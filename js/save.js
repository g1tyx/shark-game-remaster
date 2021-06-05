"use strict";
SharkGame.Save = {
    saveFileName: "sharkGameSave",

    saveGame() {
        // populate save data object
        let saveString = "";
        const saveData = {
            version: SharkGame.VERSION,
            resources: {},
            tabs: {},
            completedRequirements: {},
            world: { type: world.worldType },
            aspects: {},
            gateway: { betweenRuns: SharkGame.gameOver, wonGame: SharkGame.wonGame },
        };

        SharkGame.PlayerResources.forEach((resource, resourceId) => {
            if (resource.amount > 0 || resource.totalAmount > 0) {
                saveData.resources[resourceId] = {
                    amount: resource.amount,
                    totalAmount: resource.totalAmount,
                };
            }
        });

        saveData.upgrades = _.cloneDeep(SharkGame.Upgrades.purchased);
        // Save non-zero artifact levels
        _.each(SharkGame.Aspects, ({ level }, aspectId) => {
            if (level) saveData.aspects[aspectId] = level;
        });

        $.each(SharkGame.Tabs, (tabId, tab) => {
            if (tabId !== "current") {
                saveData.tabs[tabId] = tab.discovered;
            } else {
                saveData.tabs.current = tab;
            }
        });

        saveData.completedRequirements = _.cloneDeep(SharkGame.Gate.completedRequirements);
        saveData.settings = _.cloneDeep(SharkGame.Settings.current);

        saveData.completedWorlds = _.cloneDeep(SharkGame.Gateway.completedWorlds);

        // add timestamp
        saveData.timestampLastSave = _.now();
        saveData.timestampGameStart = SharkGame.timestampGameStart;
        saveData.timestampRunStart = SharkGame.timestampRunStart;
        saveData.timestampRunEnd = SharkGame.timestampRunEnd;

        saveData.saveVersion = SharkGame.Save.saveUpdaters.length - 1;
        saveString = ascii85.encode(pako.deflate(JSON.stringify(saveData), { to: "string" }));

        try {
            if (saveString === undefined || saveString === "<~~>") throw new Error("Something went wrong while saving");
            localStorage.setItem(SharkGame.Save.saveFileName, saveString);
        } catch (err) {
            throw new Error("Couldn't save to local storage. Reason: " + err.message);
        }

        return saveString;
    },

    loadGame(importSaveData) {
        let saveData;
        let saveDataString = importSaveData || localStorage.getItem(SharkGame.Save.saveFileName);

        if (!saveDataString) {
            throw new Error("Tried to load game, but no game to load.");
        } else if (typeof saveDataString !== "string") {
            throw new Error("Tried to load game, but save wasn't a string.");
        }

        // if first letter of string is <, data is encoded in ascii85, decode it.
        if (saveDataString.substring(0, 2) === "<~") {
            try {
                saveDataString = ascii85.decode(saveDataString);
            } catch (err) {
                throw new Error(
                    "Saved data looked like it was encoded in ascii85, but it couldn't be decoded. Can't load. Your save: " + saveDataString
                );
            }
        }

        // if first letter of string is x, data is compressed and needs uncompressing.
        if (saveDataString.charAt(0) === "x") {
            // decompress string
            try {
                saveDataString = pako.inflate(saveDataString, { to: "string" });
            } catch (err) {
                throw new Error("Saved data is compressed, but it can't be decompressed. Can't load. Your save: " + saveDataString);
            }
        }

        // if first letter of string is {, data is json
        if (saveDataString.charAt(0) === "{") {
            try {
                saveData = JSON.parse(saveDataString);
            } catch (err) {
                let errMessage = "Couldn't load save data. It didn't parse correctly. Your save: " + saveDataString;
                if (importSaveData) {
                    errMessage += " Did you paste the entire string?";
                }
                throw new Error(errMessage);
            }
        }

        if (saveData) {
            //check for updates
            const currentVersion = SharkGame.Save.saveUpdaters.length - 1;
            if (!_.has(saveData, "saveVersion")) {
                saveData = SharkGame.Save.saveUpdaters[0](saveData);
            } else if (typeof saveData.saveVersion !== "number" || saveData.saveVersion <= 12) {
                // After save version 12, packing support was removed; Backwards compatibility is not maintained because gameplay changed significantly after this point.
                throw new Error("This is a save from before New Frontiers 0.2, after which the save system was changed.");
            }

            if (saveData.saveVersion < currentVersion) {
                for (let i = saveData.saveVersion + 1; i <= currentVersion; i++) {
                    const updater = SharkGame.Save.saveUpdaters[i];
                    saveData = updater(saveData);
                    saveData.saveVersion = i;
                }
                // let player know update went fine
                SharkGame.Log.addMessage("Updated save data from v " + saveData.version + " to " + SharkGame.VERSION + ".");
            }

            res.init();

            $.each(saveData.resources, (resourceId, resource) => {
                // check that this isn't an old resource that's been removed from the game for whatever reason
                if (SharkGame.PlayerResources.has(resourceId)) {
                    SharkGame.PlayerResources.get(resourceId).amount = isNaN(resource.amount) ? 0 : resource.amount;
                    SharkGame.PlayerResources.get(resourceId).totalAmount = isNaN(resource.totalAmount) ? 0 : resource.totalAmount;
                }
            });

            // load world type and level and apply world properties
            if (saveData.world) {
                world.init();
                world.worldType = saveData.world.type;
                world.apply();
                home.init();
            }

            // hacky kludge: force table creation
            res.reconstructResourcesTable();

            SharkGame.Lab.resetUpgrades();

            _.each(saveData.upgrades, (upgradeId) => {
                SharkGame.Lab.addUpgrade(upgradeId);
            });

            _.each(SharkGame.Aspects, (aspectData) => {
                aspectData.level = 0;
            });
            // load aspects (need to have the cost reducer loaded before world init)
            $.each(saveData.aspects, (aspectId, level) => {
                if (_.has(SharkGame.Aspects, aspectId)) {
                    SharkGame.Aspects[aspectId].level = level;
                }
            });

            gateway.init();
            _.each(saveData.completedWorlds, (worldType) => {
                gateway.markWorldCompleted(worldType);
            });

            $.each(saveData.tabs, (tabName, discovered) => {
                if (_.has(SharkGame.Tabs, tabName) && tabName !== "current") {
                    SharkGame.Tabs[tabName].discovered = discovered;
                }
            });
            if (saveData.tabs.current) {
                SharkGame.Tabs.current = saveData.tabs.current;
            }

            if (saveData.completedRequirements) {
                SharkGame.Gate.completedRequirements = _.cloneDeep(saveData.completedRequirements);
            }

            // recalculate income table to make sure that the grotto doesnt freak out if its the first tab that loads
            res.recalculateIncomeTable();

            $.each(saveData.settings, (settingId, currentvalue) => {
                if (SharkGame.Settings.current[settingId] !== undefined) {
                    SharkGame.Settings.current[settingId] = currentvalue;
                    // update anything tied to this setting right off the bat
                    if (typeof SharkGame.Settings[settingId].onChange === "function") {
                        SharkGame.Settings[settingId].onChange();
                    }
                }
            });

            const currTimestamp = _.now();
            // create surrogate timestamps if necessary
            if (typeof saveData.timestampLastSave !== "number") {
                saveData.timestampLastSave = currTimestamp;
            }
            if (typeof saveData.timestampGameStart !== "number") {
                saveData.timestampGameStart = currTimestamp;
            }
            if (typeof saveData.timestampRunStart !== "number") {
                saveData.timestampRunStart = currTimestamp;
            }
            if (typeof saveData.timestampRunEnd !== "number") {
                saveData.timestampRunEnd = currTimestamp;
            }

            SharkGame.timestampLastSave = saveData.timestampLastSave;
            SharkGame.timestampGameStart = saveData.timestampGameStart;
            SharkGame.timestampRunStart = saveData.timestampRunStart;
            SharkGame.timestampRunEnd = saveData.timestampRunEnd;

            // load existence in in-between state,
            // else check for offline mode and process
            let simulateOffline = SharkGame.Settings.current.offlineModeActive;
            if (saveData.gateway) {
                if (saveData.gateway.betweenRuns) {
                    simulateOffline = false;
                    SharkGame.wonGame = saveData.gateway.wonGame;
                    main.endGame(true);
                }
            }

            // if offline mode is enabled
            if (simulateOffline) {
                // get times elapsed since last save game
                const now = _.now();
                let secondsElapsed = (now - saveData.timestampLastSave) / 1000;
                if (secondsElapsed < 0) {
                    // something went hideously wrong or someone abused a system clock somewhere
                    secondsElapsed = 0;
                }

                // process this
                res.recalculateIncomeTable();
                main.processSimTime(secondsElapsed);

                // acknowledge long time gaps
                if (secondsElapsed > 3600) {
                    let notification = "Welcome back! It's been ";
                    const numHours = Math.floor(secondsElapsed / 3600);
                    if (numHours > 24) {
                        const numDays = Math.floor(numHours / 24);
                        if (numDays > 7) {
                            const numWeeks = Math.floor(numDays / 7);
                            if (numWeeks > 4) {
                                const numMonths = Math.floor(numWeeks / 4);
                                if (numMonths > 12) {
                                    const numYears = Math.floor(numMonths / 12);
                                    notification +=
                                        "almost " +
                                        (numYears === 1 ? "a" : numYears) +
                                        " year" +
                                        SharkGame.plural(numYears) +
                                        ", thanks for remembering this exists!";
                                } else {
                                    notification +=
                                        "like " +
                                        (numMonths === 1 ? "a" : numMonths) +
                                        " month" +
                                        SharkGame.plural(numMonths) +
                                        ", it's getting kinda crowded.";
                                }
                            } else {
                                notification +=
                                    "about " + (numWeeks === 1 ? "a" : numWeeks) + " week" + SharkGame.plural(numWeeks) + ", you were gone a while!";
                            }
                        } else {
                            notification +=
                                (numDays === 1 ? "a" : numDays) + " day" + SharkGame.plural(numDays) + ", and look at all the stuff you have now!";
                        }
                    } else {
                        notification +=
                            (numHours === 1 ? "an" : numHours) + " hour" + SharkGame.plural(numHours) + " since you were seen around here!";
                    }
                    SharkGame.Log.addMessage(notification);
                }
            }
        } else {
            throw new Error(
                "Couldn't load saved game. I don't know how to break this to you, but I think your save is corrupted. Your save: " + saveDataString
            );
        }
    },

    importData(data) {
        // load the game from this save data string
        try {
            SharkGame.Log.clearMessages(false);
            SharkGame.Save.loadGame(data);
        } catch (err) {
            SharkGame.Log.addError(err);
        }
        // refresh current tab
        main.setUpTab();
    },

    exportData() {
        // get save
        /** @type string */
        let saveData;
        try {
            saveData = SharkGame.Save.saveGame();
        } catch (err) {
            SharkGame.Log.addError(err);
        }
        // check if save isn't encoded
        if (saveData.substring(0, 2) !== "<~") {
            // encode it
            saveData = ascii85.encode(saveData);
        }
        return saveData;
    },

    savedGameExists() {
        return localStorage.getItem(SharkGame.Save.saveFileName) !== null;
    },

    deleteSave() {
        localStorage.removeItem(SharkGame.Save.saveFileName);
    },

    wipeSave() {
        localStorage.setItem(SharkGame.Save.saveFileName + "Backup", localStorage.getItem(SharkGame.Save.saveFileName));
        SharkGame.Save.deleteSave();
        SharkGame.Save.importData("{}");
        SharkGame.Log.clearMessages(false);
        SharkGame.Main.init();
    },

    saveUpdaters: [
        //used to update saves and to make templates
        function update0(save) {
            //no one is converting a real save to version 0, so it doesn't need real values
            save.saveVersion = 0;
            save.version = null;
            save.timestamp = null;
            save.resources = {};

            [
                "essence",
                "shark",
                "ray",
                "crab",
                "scientist",
                "nurse",
                "laser",
                "maker",
                "planter",
                "brood",
                "crystalMiner",
                "autoTransmuter",
                "fishMachine",
                "science",
                "fish",
                "sand",
                "crystal",
                "kelp",
                "seaApple",
                "sharkonium",
            ].forEach((resourceName) => (save.resources[resourceName] = { amount: null, totalAmount: null }));
            save.upgrades = {};

            [
                "crystalBite",
                "crystalSpade",
                "crystalContainer",
                "underwaterChemistry",
                "seabedGeology",
                "thermalVents",
                "laserRays",
                "automation",
                "engineering",
                "kelpHorticulture",
                "xenobiology",
                "biology",
                "rayBiology",
                "crabBiology",
                "sunObservation",
                "transmutation",
                "exploration",
                "farExploration",
                "gateDiscovery",
            ].forEach((upgrade) => (save.upgrades[upgrade] = null));

            save.tabs = {
                current: "home",
                home: { discovered: true },
                lab: { discovered: false },
                gate: { discovered: false },
            };
            save.settings = {
                buyAmount: 1,
                offlineModeActive: true,
                autosaveFrequency: 5,
                logMessageMax: 15,
                sidebarWidth: "25%",
                showAnimations: true,
                colorCosts: true,
            };
            save.gateCostsMet = {
                fish: false,
                sand: false,
                crystal: false,
                kelp: false,
                seaApple: false,
                sharkonium: false,
            };
            return save;
        },

        // future updaters for save versions beyond the base:
        // they get passed the result of the previous updater and it continues in a chain
        // and they start based on the version they were saved
        function update1(save) {
            save = $.extend(true, save, {
                resources: { sandDigger: { amount: 0, totalAmount: 0 }, junk: { amount: 0, totalAmount: 0 } },
                upgrades: { statsDiscovery: null, recyclerDiscovery: null },
                settings: { showTabHelp: true, groupResources: true },
                timestampLastSave: save.timestamp,
                timestampGameStart: null,
                timestampRunStart: null,
            });
            // reformat tabs
            save.tabs = {
                current: save.tabs["current"],
                home: save.tabs["home"].discovered,
                lab: save.tabs["lab"].discovered,
                gate: save.tabs["gate"].discovered,
                stats: false,
                recycler: false,
            };
            delete save.timestamp;
            return save;
        },

        // v0.6
        function update2(save) {
            // add new setting to list of saves
            save = $.extend(true, save, {
                settings: { iconPositions: "top" },
            });
            return save;
        },

        // v0.7
        function update3(save) {
            save = $.extend(true, save, {
                settings: { showTabImages: true },
                tabs: { reflection: false },
                timestampRunEnd: null,
            });
            _.each(
                [
                    "shrimp",
                    "lobster",
                    "dolphin",
                    "whale",
                    "chimaera",
                    "octopus",
                    "eel",
                    "queen",
                    "berrier",
                    "biologist",
                    "pit",
                    "worker",
                    "harvester",
                    "treasurer",
                    "philosopher",
                    "chorus",
                    "transmuter",
                    "explorer",
                    "collector",
                    "scavenger",
                    "technician",
                    "sifter",
                    "skimmer",
                    "purifier",
                    "heater",
                    "spongeFarmer",
                    "berrySprayer",
                    "glassMaker",
                    "silentArchivist",
                    "tirelessCrafter",
                    "clamCollector",
                    "sprongeSmelter",
                    "seaScourer",
                    "prostheticPolyp",
                    "sponge",
                    "jellyfish",
                    "clam",
                    "coral",
                    "algae",
                    "coralglass",
                    "delphinium",
                    "spronge",
                    "tar",
                    "ice",
                ],
                (resourceId) => {
                    save.resources[resourceId] = { amount: 0, totalAmount: 0 };
                }
            );
            _.each(
                [
                    "environmentalism",
                    "thermalConditioning",
                    "coralglassSmelting",
                    "industrialGradeSponge",
                    "aquamarineFusion",
                    "coralCircuitry",
                    "sprongeBiomimicry",
                    "dolphinTechnology",
                    "spongeCollection",
                    "jellyfishHunting",
                    "clamScooping",
                    "pearlConversion",
                    "crustaceanBiology",
                    "eusociality",
                    "wormWarriors",
                    "cetaceanAwareness",
                    "dolphinBiology",
                    "delphinePhilosophy",
                    "coralHalls",
                    "eternalSong",
                    "eelHabitats",
                    "creviceCreches",
                    "bioelectricity",
                    "chimaeraMysticism",
                    "abyssalEnigmas",
                    "octopusMethodology",
                    "octalEfficiency",
                ],
                (upgradeId) => {
                    save.upgrades[upgradeId] = false;
                }
            );
            save.world = { type: "start", level: 1 };
            save.artifacts = {};
            _.each(
                [
                    "permanentMultiplier",
                    "planetTerraformer",
                    "gateCostReducer",
                    "planetScanner",
                    "sharkMigrator",
                    "rayMigrator",
                    "crabMigrator",
                    "shrimpMigrator",
                    "lobsterMigrator",
                    "dolphinMigrator",
                    "whaleMigrator",
                    "eelMigrator",
                    "chimaeraMigrator",
                    "octopusMigrator",
                    "sharkTotem",
                    "rayTotem",
                    "crabTotem",
                    "shrimpTotem",
                    "lobsterTotem",
                    "dolphinTotem",
                    "whaleTotem",
                    "eelTotem",
                    "chimaeraTotem",
                    "octopusTotem",
                    "progressTotem",
                    "carapaceTotem",
                    "inspirationTotem",
                    "industryTotem",
                    "wardingTotem",
                ],
                (artifactId) => {
                    save.artifacts[artifactId] = 0;
                }
            );
            save.gateway = { betweenRuns: false };
            return save;
        },

        // a little tweak here and there
        function update4(save) {
            save = $.extend(true, save, {
                settings: { buttonDisplayType: "pile" },
            });
            return save;
        },
        function update5(save) {
            save = $.extend(true, save, {
                gateway: { wonGame: false },
            });
            return save;
        },
        function update6(save) {
            // forgot to add numen to saved resources (which is understandable given it can't actually be legitimately achieved at this point)
            save.resources["numen"] = { amount: 0, totalAmount: 0 };
            // completely change how gate slot status is saved
            save.gateCostsMet = [false, false, false, false, false, false];
            return save;
        },

        // v 0.71
        function update7(save) {
            _.each(["eggBrooder", "diver"], (resourceId) => {
                save.resources[resourceId] = { amount: 0, totalAmount: 0 };
            });
            _.each(
                [
                    "agriculture",
                    "ancestralRecall",
                    "utilityCarapace",
                    "primordialSong",
                    "leviathanHeart",
                    "eightfoldOptimisation",
                    "mechanisedAlchemy",
                    "mobiusShells",
                    "imperialDesigns",
                ],
                (upgradeId) => {
                    save.upgrades[upgradeId] = false;
                }
            );
            return save;
        },

        // MODDED, v0.1
        function update8(save) {
            save = $.extend(true, save, {
                completedWorlds: {},
            });
            _.each(["iterativeDesign", "superprocessing"], (upgradeId) => {
                save.upgrades[upgradeId] = false;
            });
            _.each(["start", "marine", "chaotic", "haven", "tempestuous", "violent", "abandoned", "shrouded", "frigid"], (worldType) => {
                save.completedWorlds[worldType] = false;
            });
            return save;
        },

        function update9(save) {
            save = $.extend(true, save, {
                settings: { enableThemes: true, framerate: 20 },
            });
            return save;
        },

        function update10(save) {
            save = $.extend(true, save, {
                settings: { boldCosts: true },
            });
            return save;
        },

        // MODDED v0.2
        function update11(save) {
            _.each(["investigator", "filter", "ancientPart"], (resourceId) => {
                save.resources[resourceId] = { amount: 0, totalAmount: 0 };
            });
            _.each(
                ["farAbandonedExploration", "reverseEngineering", "highEnergyFusion", "artifactAssembly", "superiorSearchAlgorithms"],
                (upgradeId) => {
                    save.upgrades[upgradeId] = false;
                }
            );
            return save;
        },

        function update12(save) {
            save = $.extend(true, save, {
                settings: { grottoMode: "simple", incomeTotalMode: "absolute" },
            });
            return save;
        },

        function update13(save) {
            _.each(["historian", "crimsonCombine", "kelpCultivator"], (resourceName) => {
                save.resources[resourceName] = { amount: 0, totalAmount: 0 };
            });
            _.each(
                ["coralCollection", "whaleCommunication", "delphineHistory", "whaleSong", "farHavenExploration", "crystallineConstruction"],
                (upgradeName) => {
                    save.upgrades[upgradeName] = false;
                }
            );
            return save;
        },

        // Haven rework
        function update14(save) {
            _.each(
                [
                    "planetTerraformer",
                    "shrimpMigrator",
                    "lobsterMigrator",
                    "dolphinMigrator",
                    "whaleMigrator",
                    "eelMigrator",
                    "chimaeraMigrator",
                    "octopusMigrator",
                    "shrimpTotem",
                    "lobsterTotem",
                    "dolphinTotem",
                    "whaleTotem",
                    "eelTotem",
                    "chimaeraTotem",
                    "octopusTotem",
                    "carapaceTotem",
                    "inspirationTotem",
                    "industryTotem",
                ],
                (deprecatedTotem) => {
                    if (_.has(save.artifacts, deprecatedTotem)) {
                        delete save.artifacts[deprecatedTotem];
                    }
                }
            );

            if (_.has(save, "gateCostsMet")) {
                delete save.gateCostsMet;
            }

            if (_.has(save.settings, "iconPositions")) {
                save.settings.showIcons = save.settings.iconPositions !== "off";
                delete save.settings.iconPositions;
            } else {
                save.settings.showIcons = true;
            }
            save.settings.minimizedTopbar = true;

            if (_.has(save.resources, "philosopher")) {
                delete save.resources.philosopher;
            }
            if (_.has(save.upgrades, "coralHalls")) {
                delete save.upgrades.coralHalls;
            }

            // Don't bother saving 0 or null values, they're implied already
            _.each(save.resources, (resource, resourceId) => {
                if ([0, null].includes(resource.amount) && [0, null].includes(resource.totalAmount)) {
                    delete save.resources[resourceId];
                }
            });
            _.each(save.artifacts, (level, artifactId) => {
                if (level === 0 || level === null) {
                    delete save.artifacts[artifactId];
                }
            });

            /** @type string[] */
            const purchasedUpgrades = [];
            $.each(save.upgrades, (upgradeId, purchased) => {
                if (purchased === true) {
                    purchasedUpgrades.push(upgradeId);
                }
            });
            save.upgrades = purchasedUpgrades;

            /** @type string[] */
            const completedWorlds = [];
            _.each(save.completedWorlds, (completed, worldType) => {
                if (completed === true) {
                    completedWorlds.push(worldType);
                }
            });
            save.completedWorlds = completedWorlds;

            return save;
        },

        // Frigid rework
        function update15(save) {
            if (_.has(save, "settings.showTabHelp")) {
                if (!_.has(save, "settings.showTooltips")) {
                    save.settings.showTooltops = save.settings.showTabHelp;
                }
                delete save.settings.showTabHelp;
            }

            if (_.has(save, "artifacts")) {
                delete save.artifacts;
            }
            if (!_.has(save, "aspects")) {
                save.aspects = {};
            }

            return save;
        },
    ],
};

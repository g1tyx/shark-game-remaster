SharkGame.Save = {
    saveFileName: "sharkGameSave",

    saveGame() {
        // populate save data object
        let saveString = "";
        const saveData = {
            version: SharkGame.VERSION,
            resources: {},
            tabs: {},
            settings: {},
            upgrades: {},
            gateCostsMet: [],
            world: { type: w.worldType, level: w.planetLevel },
            artifacts: {},
            gateway: { betweenRuns: SharkGame.gameOver, wonGame: SharkGame.wonGame },
            completedWorlds: {},
        };

        SharkGame.PlayerResources.forEach((v, k) => {
            saveData.resources[k] = {
                amount: v.amount,
                totalAmount: v.totalAmount,
            };
        });

        saveData.upgrades = _.cloneDeep(SharkGame.Upgrades.purchased);

        $.each(SharkGame.Tabs, (k, v) => {
            if (k !== "current") {
                saveData.tabs[k] = v.discovered;
            } else {
                saveData.tabs.current = v;
            }
        });

        const gateCostTypes = [];
        $.each(SharkGame.Gate.costsMet, (name) => {
            gateCostTypes.push(name);
        });
        gateCostTypes.sort();

        $.each(gateCostTypes, (i, name) => {
            saveData.gateCostsMet[i] = SharkGame.Gate.costsMet[name];
        });

        $.each(SharkGame.Settings, (settingName) => {
            if (settingName !== "current") {
                saveData.settings[settingName] = SharkGame.Settings.current[settingName];
            }
        });

        $.each(SharkGame.Artifacts, (artifactName, artifact) => {
            saveData.artifacts[artifactName] = artifact.level;
        });

        $.each(SharkGame.WorldTypes, (worldType) => {
            saveData.completedWorlds[worldType] = false;
        });

        $.each(g.completedWorlds, (_keyOfSomeKind, v) => {
            saveData.completedWorlds[v] = true;
        });

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

        // if first letter of string is { or [, data is json
        if (saveDataString.charAt(0) === "{" || saveDataString.charAt(0) === "[") {
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
            // go through it

            //check for updates
            const currentVersion = SharkGame.Save.saveUpdaters.length - 1;
            if (!Array.isArray(saveData) && !_.has(saveData, "saveVersion")) {
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

            r.init();

            if (saveData.resources) {
                $.each(saveData.resources, (k, v) => {
                    // check that this isn't an old resource that's been removed from the game for whatever reason
                    if (SharkGame.PlayerResources.has(k)) {
                        SharkGame.PlayerResources.get(k).amount = isNaN(v.amount) ? 0 : v.amount;
                        SharkGame.PlayerResources.get(k).totalAmount = isNaN(v.totalAmount) ? 0 : v.totalAmount;
                    }
                });
            }

            // load world type and level and apply world properties
            if (saveData.world) {
                w.init();
                w.worldType = saveData.world.type;
                w.planetLevel = saveData.world.level;
                w.apply();
                h.init();
            }

            // hacky kludge: force table creation
            r.reconstructResourcesTable();

            SharkGame.Lab.resetUpgrades();

            if (saveData.upgrades) {
                _.each(saveData.upgrades, (upgradeId) => {
                    SharkGame.Lab.addUpgrade(upgradeId);
                });
            }

            g.init();
            if (saveData.completedWorlds) {
                $.each(saveData.completedWorlds, (k, v) => {
                    if (v) {
                        g.markWorldCompleted(k);
                    }
                });
            }

            // load artifacts (need to have the terraformer and cost reducer loaded before world init)
            if (saveData.artifacts) {
                $.each(saveData.artifacts, (k, v) => {
                    if (SharkGame.Artifacts[k]) {
                        SharkGame.Artifacts[k].level = v;
                    }
                });
                // apply artifacts (world needs to be init first before applying other artifacts, but special ones need to be _loaded_ first)
                g.applyArtifacts(true);
            }

            if (saveData.tabs) {
                $.each(saveData.tabs, (k, v) => {
                    if (SharkGame.Tabs[k]) {
                        SharkGame.Tabs[k].discovered = v;
                    }
                });
                if (saveData.tabs.current) {
                    SharkGame.Tabs.current = saveData.tabs.current;
                }
            }

            const gateCostTypes = [];
            $.each(SharkGame.Gate.costsMet, (name, _met) => {
                gateCostTypes.push(name);
            });
            gateCostTypes.sort();

            $.each(gateCostTypes, (i, name) => {
                SharkGame.Gate.costsMet[name] = saveData.gateCostsMet[i];
            });

            // recalculate income table to make sure that the grotto doesnt freak out if its the first tab that loads
            r.recalculateIncomeTable();

            if (saveData.settings) {
                $.each(saveData.settings, (k, v) => {
                    if (SharkGame.Settings.current[k] !== undefined) {
                        SharkGame.Settings.current[k] = v;
                        // update anything tied to this setting right off the bat
                        (SharkGame.Settings[k].onChange || $.noop)();
                    }
                });
            }

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
                    m.endGame(true);
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
                r.recalculateIncomeTable();
                m.processSimTime(secondsElapsed);

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
            SharkGame.Log.addError(err.message);
            console.error(err);
        }
        // refresh current tab
        m.setUpTab();
    },

    exportData() {
        // get save
        /** @type string */
        let saveData;
        try {
            saveData = SharkGame.Save.saveGame();
        } catch (err) {
            SharkGame.Log.addError(err.message);
            console.error(err);
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
                current: null,
                home: { discovered: true },
                lab: { discovered: null },
                gate: { discovered: null },
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
                settings: { showTabHelp: false, groupResources: true },
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
                (v) => {
                    save.resources[v] = { amount: 0, totalAmount: 0 };
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
                (v) => {
                    save.upgrades[v] = false;
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
                (v) => {
                    save.artifacts[v] = 0;
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
            _.each(["eggBrooder", "diver"], (v) => {
                save.resources[v] = { amount: 0, totalAmount: 0 };
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
                (v) => {
                    save.upgrades[v] = false;
                }
            );
            return save;
        },

        // MODDED, v0.1
        function update8(save) {
            save = $.extend(true, save, {
                completedWorlds: {},
            });
            _.each(["iterativeDesign", "superprocessing"], (v) => {
                save.upgrades[v] = false;
            });
            _.each(["start", "marine", "chaotic", "haven", "tempestuous", "violent", "abandoned", "shrouded", "frigid"], (v) => {
                save.completedWorlds[v] = false;
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
            _.each(["investigator", "filter", "ancientPart"], (v) => {
                save.resources[v] = { amount: 0, totalAmount: 0 };
            });
            _.each(["farAbandonedExploration", "reverseEngineering", "highEnergyFusion", "artifactAssembly", "superiorSearchAlgorithms"], (v) => {
                save.upgrades[v] = false;
            });
            return save;
        },

        function update12(save) {
            save = $.extend(true, save, {
                settings: { grottoMode: "simple", incomeTotalMode: "absolute" },
            });
            return save;
        },

        function update13(save) {
            _.each(["historian", "crimsonCombine", "kelpCultivator"], (v) => {
                save.resources[v] = { amount: 0, totalAmount: 0 };
            });
            _.each(
                ["coralCollection", "whaleCommunication", "delphineHistory", "whaleSong", "farHavenExploration", "crystallineConstruction"],
                (v) => {
                    save.upgrades[v] = false;
                }
            );
            return save;
        },

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
            if (_.has(save.settings, "iconPositions")) {
                save.settings.showIcons = save.settings.iconPositions !== "off";
                delete save.settings.iconPositions;
            } else {
                save.settings.showIcons = true;
            }

            if (_.has(save.resources, "philosopher")) {
                delete save.resources.philosopher;
            }
            if (_.has(save.upgrades, "coralHalls")) {
                delete save.upgrades.coralHalls;
            }

            /** @type string[] */
            const purchasedUpgrades = [];
            $.each(save.upgrades, (upgradeId, purchased) => {
                if (purchased === true) {
                    purchasedUpgrades.push(upgradeId);
                }
            });
            save.upgrades = purchasedUpgrades;
            return save;
        },
    ],
};

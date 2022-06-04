"use strict";

SharkGame.Gateway = {
    NUM_PLANETS_TO_SHOW: 3,

    transitioning: false,
    selectedWorld: "",

    allowedWorlds: ["abandoned", "haven", "frigid", "shrouded", "marine"],

    completedWorlds: [],

    planetPool: [],

    init() {
        this.completedWorlds = [];
        this.planetPool = [];
        SharkGame.wonGame = false;
        SharkGame.gameOver = false;
    },

    setup() {
        if (SharkGame.gameOver) {
            main.endGame(true);
        } else {
            gateway.updateScoutingStatus();
            SharkGame.persistentFlags.wasOnScoutingMission = undefined;
        }
    },

    enterGate(loadingFromSave) {
        SharkGame.PaneHandler.wipeStack();

        SharkGame.OverlayHandler.enterGateway();

        //ensure buy buttons will be revealed
        SharkGame.persistentFlags.revealedBuyButtons = true;

        //be sure minute hand is off
        res.minuteHand.toggleOff();
        //be sure we're not paused
        if (cad.pause) {
            res.pause.togglePause();
        }

        tree.resetScoutingRestrictions();
        gateway.updateWasScoutingStatus();

        if (!loadingFromSave && SharkGame.wonGame) {
            gateway.markWorldCompleted(world.worldType);
            SharkGame.persistentFlags.destinyRolls = SharkGame.Aspects.destinyGamble.level;
            gateway.preparePlanetSelection(gateway.NUM_PLANETS_TO_SHOW);
        }

        if (this.planetPool.length === 0) {
            gateway.preparePlanetSelection(gateway.NUM_PLANETS_TO_SHOW);
        }

        // make sure the player is flagged as having idled so the minute hand shows up from now on
        res.minuteHand.allowMinuteHand();

        const baseReward = gateway.getBaseReward(loadingFromSave);
        const patienceReward = gateway.getPatienceReward(loadingFromSave);
        const speedReward = gateway.getSpeedReward(loadingFromSave);
        const gumptionBonus = gateway.getGumptionBonus(loadingFromSave);

        gateway.prepareBasePane(baseReward, patienceReward, speedReward, gumptionBonus);
        gateway.grantEssenceReward(baseReward, patienceReward, speedReward);

        // RESET COMPLETED GATE REQUIREMENTS
        SharkGame.Gate.completedRequirements = {};
        // clear non-persistent flags just in case
        SharkGame.flags = {};

        // SAVE
        SharkGame.Save.saveGame();

        $("#game").addClass("inGateway");
    },

    cleanUp() {
        // empty out the game stuff behind
        main.purgeGame();
    },

    showGateway(baseReward, patienceReward, speedReward, gumptionRatio = gateway.getGumptionBonus(), forceWorldBased = false) {
        const gumptionBonus = Math.ceil(gumptionRatio * (baseReward + speedReward));

        // get some useful numbers
        const essenceHeld = res.getResource("essence");
        const numenHeld = res.getResource("numen");

        // construct the gateway content
        const gatewayContent = $("<div>");
        gatewayContent.append($("<p>").html("You are a shark in the space between worlds."));
        if (!SharkGame.wonGame) {
            gatewayContent.append($("<p>").html("It is not clear how you have ended up here, but you remember a bitter defeat.").addClass("medDesc"));
        }
        gatewayContent.append($("<p>").html(sharktext.boldString("Something unseen says,")).addClass("medDesc"));
        gatewayContent.append(
            $("<em>")
                .attr("id", "gatewayVoiceMessage")
                .html(sharktext.boldString(gateway.getVoiceMessage(SharkGame.wonGame, forceWorldBased)))
        );

        // figure out all our rewards
        if (baseReward > 0) {
            gatewayContent.append(
                $("<p>").html(
                    "Entering this place has changed you, granting you <span class='essenceCount'>" +
                        sharktext.beautify(baseReward) +
                        "</span> essence."
                )
            );
        }
        if (speedReward > 0) {
            gatewayContent.append(
                $("<p>").html(
                    "You completed this world " +
                        sharktext.beautify(gateway.getMinutesBelowPar()) +
                        " minutes faster than par, granting you <span class='essenceCount'>" +
                        sharktext.beautify(speedReward) +
                        "</span> additional essence."
                )
            );
        } else if (SharkGame.wonGame && !gateway.wasOnScoutingMission() && !gateway.getMinutesBelowPar()) {
            gatewayContent.append($("<p>").html("You didn't beat this world fast enough to get below par. If you did, you would get more essence."));
        }
        if (gumptionBonus) {
            gatewayContent.append(
                $("<p>").html(
                    "Your gumption lets you scrounge up <span class='essenceCount'>" +
                        sharktext.beautify(gumptionBonus, false, 2) +
                        "</span> extra essence."
                )
            );
        }
        if (patienceReward > 0) {
            gatewayContent.append(
                $("<p>").html(
                    "Your patience pays off, granting you <span class='essenceCount'>" +
                        sharktext.beautify(patienceReward) +
                        "</span> additional essence."
                )
            );
        }
        if (speedReward || gumptionBonus || patienceReward) {
            gatewayContent.append(
                $("<p>").html(
                    "You gained <span class='essenceCount'>" +
                        sharktext.beautify(speedReward + patienceReward + baseReward + gumptionBonus, false, 2) +
                        "</span> essence overall."
                )
            );
        }
        gatewayContent.append(
            $("<p>").html(
                sharktext.boldString(
                    "You have <span id='essenceHeldDisplay' class='essenceCount'>" + sharktext.beautify(essenceHeld, false, 2) + "</span> essence."
                )
            )
        );
        if (numenHeld > 0) {
            const numenName = numenHeld > 1 ? "numina" : "numen";
            gatewayContent.append(
                $("<p>").html(
                    "You also have <span class='numenCount'>" + sharktext.beautify(numenHeld) + "</span> " + numenName + ", and you radiate divinity."
                )
            );
        }
        gatewayContent.append($("<p>").attr("id", "gatewayStatusMessage").addClass("medDesc"));

        // show end time
        const endRunInfoDiv = $("<div>");
        gateway.showRunEndInfo(endRunInfoDiv);
        gatewayContent.append(endRunInfoDiv);

        // add navigation buttons
        const navButtons = $("<div>").addClass("gatewayButtonList");
        SharkGame.Button.makeButton("backToGateway", "aspects", navButtons, () => {
            gateway.switchViews(gateway.showAspects);
        });
        SharkGame.Button.makeButton("toOptions", "options", navButtons, SharkGame.PaneHandler.showOptions);
        SharkGame.Button.makeHoverscriptButton(
            "toWorlds",
            "worlds",
            navButtons,
            () => {
                if (SharkGame.Aspects.pathOfEnlightenment.level) {
                    gateway.switchViews(gateway.showPlanets);
                }
            },
            () => {
                if (!SharkGame.Aspects.pathOfEnlightenment.level) {
                    $("#tooltipbox").addClass("forAspectTreeUnpurchased").html("You're not yet sure what this means.");
                }
            },
            () => {
                $("#tooltipbox").removeClass("forAspectTreeUnpurchased").html("");
            }
        );
        gatewayContent.append(navButtons);

        SharkGame.PaneHandler.swapCurrentPane("GATEWAY", gatewayContent, true, 500, true);
        gateway.transitioning = false;
        if (!SharkGame.Aspects.pathOfEnlightenment.level) {
            $("#toWorlds").addClass("disabled");
        }
        if (SharkGame.missingAspects) {
            SharkGame.PaneHandler.showAspectWarning();
        }
    },

    showRunEndInfo(containerDiv) {
        containerDiv.append($("<p>").html("<em>Time spent within last ocean:</em><br/>").append(gateway.getTimeInLastWorld()));
    },

    showAspects() {
        tree.updateRequirementReference();
        const aspectTreeContent = $("<div>");
        aspectTreeContent.append(
            $("<strong>")
                .attr("id", "essenceCount")
                .attr("contenteditable", SharkGame.persistentFlags.debug ? "true" : "false")
                .html(sharktext.beautify(res.getResource("essence"), false, 2))
                .on("keydown", function (event) {
                    if (event.code === "Enter") {
                        event.preventDefault();
                        window.getSelection().removeAllRanges();

                        const html = $(this).html();
                        if (!isNaN(html)) {
                            res.setResource("essence", Number(html));
                        }
                        tree.updateEssenceCounter();
                    }
                })
        );
        aspectTreeContent.append($("<strong>").html(" ESSENCE"));
        aspectTreeContent.append($("<p>").html("Your will flows into solid shapes beyond your control.<br>Focus."));
        aspectTreeContent.append(tree.drawTree(SharkGame.Settings.current.doAspectTable === "table"));

        tree.resetTreeCamera();
        tree.render();

        const buttonDiv = $("<div>").attr("id", "aspectTreeNavButtons").addClass("gatewayButtonList");

        // add return to gateway button
        SharkGame.Button.makeButton("backToGateway", "return to gateway", buttonDiv, () => {
            gateway.switchViews(gateway.showGateway);
            $("#tooltipbox").empty().removeClass("forAspectTree forAspectTreeUnpurchased");
        });

        if (SharkGame.Settings.current.doAspectTable === "table") {
            if (SharkGame.Aspects.cleanSlate.level) {
                SharkGame.Button.makeButton("respecModeButton", "respec mode", buttonDiv, tree.toggleRefundMode);
                SharkGame.Button.makeButton("respecButton", "respec all", buttonDiv, () => {
                    if (confirm("Are you sure you want to respec all refundable aspects?")) {
                        tree.respecTree();
                    }
                });
            }

            if (SharkGame.persistentFlags.debug) {
                SharkGame.Button.makeButton("debugModeButton", "debug mode", buttonDiv, tree.toggleDebugMode);
            }
        }

        tree.debugMode = false;
        tree.refundMode = false;

        aspectTreeContent.append(buttonDiv);

        SharkGame.PaneHandler.swapCurrentPane("ASPECT TREE", aspectTreeContent, true, 500, true);

        gateway.transitioning = false;
    },

    showPlanets(foregoAnimation) {
        // construct the gateway content
        const planetSelectionContent = $("<div>");
        planetSelectionContent.append($("<p>").html("Other worlds await."));

        // show planet pool
        const planetPool = $("<div>").addClass("gatewayButtonList");
        _.each(gateway.planetPool, function callback(planetInfo) {
            SharkGame.Button.makeButton("planet-" + planetInfo.type, planetInfo.type + " " + planetInfo.level, planetPool, function onClick() {
                gateway.selectedWorld = $(this).attr("id").split("-")[1];
                gateway.switchViews(gateway.confirmWorld);
            }).addClass("planetButton");
        });
        planetSelectionContent.append(planetPool);

        planetSelectionContent.append(
            $("<p>").html("NOTE: When you first visit a world, you are SCOUTING it. If you choose to replay it, you are NOT SCOUTING it.")
        );

        if (SharkGame.Aspects.destinyGamble.level > 0) {
            SharkGame.Button.makeButton("destinyGamble", "foobar", planetSelectionContent, gateway.rerollWorlds);
        }

        if (SharkGame.persistentFlags.debug) {
            SharkGame.Button.makeButton("visitButton", "visit any world", planetSelectionContent, gateway.showWorldVisitMenu);
        }

        // add return to gateway button
        const returnButtonDiv = $("<div>");
        SharkGame.Button.makeButton("backToGateway", "return to gateway", returnButtonDiv, () => {
            gateway.switchViews(gateway.showGateway);
        });
        planetSelectionContent.append(returnButtonDiv);

        SharkGame.PaneHandler.swapCurrentPane("WORLDS", planetSelectionContent, true, foregoAnimation ? 0 : 500, true);
        gateway.transitioning = false;
        gateway.updatePlanetButtons();
        gateway.formatDestinyGamble();
    },

    formatDestinyGamble() {
        if (!_.isUndefined(SharkGame.persistentFlags.destinyRolls)) {
            switch (SharkGame.persistentFlags.destinyRolls) {
                case 0:
                    $("#destinyGamble").html("No rerolls remain. Beat a world to recharge.").addClass("disabled");
                    break;
                case 1:
                    $("#destinyGamble").html("Reroll Worlds (1 reroll remains)");
                    break;
                default:
                    $("#destinyGamble").html("Reroll Worlds (" + SharkGame.persistentFlags.destinyRolls + " rerolls remain)");
            }
        }
    },

    rerollWorlds() {
        if (SharkGame.persistentFlags.destinyRolls && SharkGame.persistentFlags.destinyRolls > 0) {
            SharkGame.persistentFlags.destinyRolls -= 1;
            gateway.preparePlanetSelection(gateway.NUM_PLANETS_TO_SHOW);
            gateway.showPlanets(true);
            SharkGame.Save.saveGame();
        }
    },

    confirmWorld() {
        const selectedWorldData = SharkGame.WorldTypes[gateway.selectedWorld];
        const seenWorldYet = gateway.completedWorlds.includes(gateway.selectedWorld);

        // construct the gateway content
        const gatewayContent = $("<div>").append(
            $("<p>").html((seenWorldYet ? "Replay the " + selectedWorldData.name + " W" : "Scout this w") + "orld?")
        );

        gatewayContent.append(
            $("<p>").html(
                `${seenWorldYet ? `A par time` : `This`} would grant you <strong>` +
                    sharktext.beautify(
                        Math.ceil(
                            (1 + gateway.getGumptionBonus()) * ((seenWorldYet ? 2 : 4) + (selectedWorldData.bonus ? selectedWorldData.bonus : 0)) +
                                SharkGame.Aspects.patience.level
                        ),
                        false,
                        2
                    ) +
                    "</strong> " +
                    sharktext.getResourceName("essence", undefined, undefined, sharkcolor.getElementColor("pane")) +
                    " overall."
            )
        );

        // add world image
        const spritename = seenWorldYet ? "planets/" + gateway.selectedWorld : "planets/missing";
        const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "planets/missing");
        if (iconDiv) {
            iconDiv.addClass("planetDisplay");
            const containerDiv = $("<div>").attr("id", "planetContainer");
            containerDiv.append(iconDiv);
            gatewayContent.append(containerDiv);
        }

        const attributeDiv = $("<div>");
        gateway.showPlanetAttributes(selectedWorldData, seenWorldYet, attributeDiv);
        gatewayContent.append(attributeDiv);

        if (seenWorldYet && selectedWorldData.par) {
            gatewayContent.append(
                $("<p>").html("Par: <strong>" + selectedWorldData.par + " minutes</strong><br>Beat the world faster for extra essence.")
            );
        }

        // add confirm button
        const confirmButtonDiv = $("<div>");
        SharkGame.Button.makeButton("progress", "proceed", confirmButtonDiv, () => {
            function checkAspects() {
                let doProceed = true;
                $.each(SharkGame.Aspects, (_aspectName, aspectData) => {
                    if (aspectData.level && !aspectData.core) {
                        doProceed = confirm(
                            "Woah, hold on! Only CORE ASPECTS work when scouting, but you have some that aren't! If you continue, these non-core aspects will stop working until you leave. Are you sure that you want to proceed?"
                        );
                        return false;
                    }
                });
                return doProceed;
            }
            if (gateway.completedWorlds.includes(gateway.selectedWorld) || checkAspects()) {
                // kick back to main to start up the game again
                world.worldType = gateway.selectedWorld;
                main.loopGame();
            }
        });
        gatewayContent.append(confirmButtonDiv);

        // add return to planets button
        const returnButtonDiv = $("<div>");
        SharkGame.Button.makeButton("backToGateway", "reconsider", returnButtonDiv, () => {
            gateway.switchViews(gateway.showPlanets);
        });
        gatewayContent.append(returnButtonDiv);

        SharkGame.PaneHandler.swapCurrentPane("CONFIRM", gatewayContent, true, 500, true);
        gateway.transitioning = false;
    },

    switchViews(callback) {
        if (!gateway.transitioning) {
            gateway.transitioning = true;
            if (SharkGame.Settings.current.showAnimations) {
                $("#pane").animate(
                    {
                        opacity: 0.0,
                    },
                    500,
                    "swing",
                    callback
                );
            } else {
                callback();
            }
        }
    },

    preparePlanetSelection(numPlanets) {
        // empty existing pool
        gateway.planetPool = [];

        // create pool of qualified types
        const qualifiedPlanetTypes = gateway.allowedWorlds.slice(0);

        // look for uncompleted planet types
        const uncompletedPlanetTypes = gateway.allowedWorlds.slice(0);
        _.each(gateway.completedWorlds, (worldtype) => {
            const typeIndex = uncompletedPlanetTypes.indexOf(worldtype);
            if (typeIndex > -1) {
                uncompletedPlanetTypes.splice(typeIndex, 1);
            }
        });

        // are there any? if so, set a random index out of the number of planets we're choosing
        // the choice with this index is guaranteed to be an uncompleted planet
        let guaranteeWhichWorld;
        if (uncompletedPlanetTypes.length > 0) {
            guaranteeWhichWorld = Math.floor(Math.random() * numPlanets);
        }

        // pull random types from the pool
        // for each type pulled, generated a random level for the planet
        // then add to the planet pool
        for (let i = 0; i < numPlanets; i++) {
            let choice;
            if (uncompletedPlanetTypes.length > 0 && guaranteeWhichWorld === i) {
                choice = SharkGame.choose(uncompletedPlanetTypes);
            } else {
                choice = SharkGame.choose(qualifiedPlanetTypes);
            }
            const index = qualifiedPlanetTypes.indexOf(choice);
            // take it out of the qualified pool (avoid duplicates)
            qualifiedPlanetTypes.splice(index, 1);

            if (uncompletedPlanetTypes.indexOf(choice) > -1) {
                uncompletedPlanetTypes.splice(uncompletedPlanetTypes.indexOf(choice), 1);
            }

            // add choice to pool
            gateway.planetPool.push({
                type: choice,
            });
        }
    },

    updatePlanetButtons() {
        _.each(gateway.planetPool, (planetData) => {
            const buttonSel = $("#planet-" + planetData.type);
            if (buttonSel.length > 0) {
                const seenWorldYet = gateway.completedWorlds.includes(planetData.type);
                const deeperPlanetData = SharkGame.WorldTypes[planetData.type];
                const label =
                    sharktext.boldString(seenWorldYet ? deeperPlanetData.name : "???") +
                    "<br>" +
                    (seenWorldYet ? deeperPlanetData.desc : deeperPlanetData.vagueDesc) +
                    (seenWorldYet && gateway.getPar(planetData.type)
                        ? "<br>Par: <strong>" + gateway.getPar(planetData.type) + " minutes</strong>"
                        : "");

                buttonSel.html(label);

                const spritename = seenWorldYet ? "planets/" + planetData.type : "planets/missing";
                if (SharkGame.Settings.current.showIcons) {
                    const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "planets/missing");
                    if (iconDiv) {
                        iconDiv.addClass("button-icon");
                        buttonSel.prepend(iconDiv);
                    }
                }
            }
        });
    },

    showWorldVisitMenu() {
        const menuContent = $("<div>").append($("<p>").html("Pick a world to visit:"));
        const visitButtons = $("<div>").attr("id", "visitButtons");

        _.each(gateway.allowedWorlds, (planetName) => {
            SharkGame.Button.makeButton(planetName + "VisitButton", "visit " + planetName, visitButtons, () => {
                world.worldType = planetName;
                main.loopGame();
            });
        });

        menuContent.append(visitButtons);
        SharkGame.Button.makeButton("backButton", "go back", menuContent, () => {
            gateway.switchViews(gateway.showPlanets);
        });

        SharkGame.PaneHandler.swapCurrentPane("DEBUG VISIT", menuContent, true, 500, true);
        gateway.transitioning = false;
    },

    getVoiceMessage(wonGame, forceWorldBased) {
        // the point of this function is to add to the message pool all available qualifying messages and then pick one
        const messagePool = [];
        const totalEssence = res.getTotalResource("essence");

        // if the game wasn't won, add loss messages
        if (!wonGame) {
            messagePool.push(...gateway.Messages.loss);
        } else if (forceWorldBased) {
            const planetPool = gateway.Messages.lastPlanetBased[world.worldType];
            if (planetPool) {
                messagePool.push(...planetPool);
            }
        } else {
            // determine which essence based messages should go into the pool
            _.each(gateway.Messages.essenceBased, (message) => {
                const min = message.min || 0;
                const max = message.max || Number.MAX_VALUE;

                if (totalEssence >= min && totalEssence <= max) {
                    messagePool.push(...message.messages);
                }
            });

            // determine which planet based messages should go into the pool
            const planetPool = gateway.Messages.lastPlanetBased[world.worldType];
            if (planetPool) {
                messagePool.push(...planetPool);
            }

            // finally just add all the generics into the pool
            messagePool.push(...gateway.Messages.generic);
        }

        return '"' + SharkGame.choose(messagePool) + '"';
    },

    showPlanetAttributes(worldData, seenWorldYet, contentDiv) {
        /* eslint-disable no-fallthrough */
        switch (SharkGame.Aspects.distantForesight.level) {
            case 1:
                contentDiv.prepend($("<p>").html(worldData.foresight.longDesc));
                if (worldData.foresight.missing.length > 0) {
                    const missingList = $("<ul>").addClass("gatewayPropertyList");
                    _.each(worldData.foresight.missing, (missingResource) => {
                        missingList.append(
                            $("<li>").html(
                                "This world has no " + sharktext.getResourceName(missingResource, false, 2, sharkcolor.getElementColor("pane")) + "."
                            )
                        );
                    });
                    contentDiv.prepend(missingList);
                }
                if (worldData.foresight.present.length > 0) {
                    const presentList = $("<ul>").addClass("gatewayPropertyList");
                    _.each(worldData.foresight.present, (presentResource) => {
                        presentList.append(
                            $("<li>").html(
                                "You feel the presence of " +
                                    sharktext.getResourceName(
                                        presentResource,
                                        false,
                                        2,
                                        sharkcolor.getElementColor("pane", "background-color"),
                                        gateway.playerHasSeenResource(presentResource) ? undefined : gateway.PresenceFeelings[presentResource]
                                    ) +
                                    "."
                            )
                        );
                    });
                    contentDiv.prepend(presentList);
                }
                if (worldData.modifiers.length > 0) {
                    const modifierList = $("<ul>").addClass("gatewayPropertyList");
                    _.each(worldData.modifiers, (modifier) => {
                        if (gateway.playerHasSeenResource(modifier.resource) || !(worldData.foresight.present.indexOf(modifier.resource) > -1)) {
                            modifierList.append(
                                $("<li>").html(
                                    SharkGame.ModifierReference.get(modifier.modifier).effectDescription(
                                        modifier.amount,
                                        modifier.resource,
                                        "#246c54"
                                    )
                                )
                            );
                        } else {
                            modifierList.append(
                                $("<li>").html(
                                    SharkGame.ModifierReference.get(modifier.modifier)
                                        .effectDescription(modifier.amount, modifier.resource, sharkcolor.getElementColor("pane"))
                                        .replace(new RegExp(modifier.resource, "g"), gateway.PresenceFeelings[modifier.resource])
                                )
                            );
                        }
                    });
                    contentDiv.prepend(modifierList);
                    contentDiv.prepend($("<p>").html("ATTRIBUTES:"));
                } else {
                    contentDiv.prepend($("<p>").html("NO KNOWN ATTRIBUTES"));
                }
                break;
            default:
                if (seenWorldYet) {
                    contentDiv.prepend($("<p>").html(worldData.foresight.longDesc));
                } else {
                    contentDiv.prepend($("<p>").html(worldData.foresight.vagueLongDesc));
                }
        }
        /* eslint-enable no-fallthrough */
    },

    playerHasSeenResource(resource) {
        if (res.isCategory(resource)) {
            return true;
        }
        return _.some(gateway.completedWorlds, (completedWorld) =>
            _.some(SharkGame.WorldTypes[completedWorld].foresight.present, (seenResource) => seenResource === resource)
        );
    },

    markWorldCompleted(worldType) {
        if (!gateway.completedWorlds.includes(worldType)) {
            gateway.completedWorlds.push(worldType);
        }
    },

    getTimeInLastWorld(formatLess) {
        if (!SharkGame.persistentFlags.totalPausedTime) {
            SharkGame.persistentFlags.totalPausedTime = 0;
        }
        if (!SharkGame.persistentFlags.currentPausedTime) {
            SharkGame.persistentFlags.currentPausedTime = 0;
        }
        const time =
            SharkGame.timestampRunEnd -
            SharkGame.timestampRunStart -
            SharkGame.persistentFlags.totalPausedTime -
            SharkGame.persistentFlags.currentPausedTime;
        return formatLess ? time : sharktext.formatTime(time);
    },

    updateWasScoutingStatus() {
        if (!_.isUndefined(SharkGame.persistentFlags.scouting)) {
            SharkGame.persistentFlags.wasScouting = SharkGame.persistentFlags.scouting;
            SharkGame.persistentFlags.scouting = undefined;
        } else if (_.isUndefined(SharkGame.persistentFlags.wasScouting)) {
            // failsafe, assume we were indeed scouting
            SharkGame.persistentFlags.wasScouting = true;
        }
    },

    updateScoutingStatus() {
        SharkGame.persistentFlags.scouting = !gateway.completedWorlds.includes(world.worldType);
    },

    wasOnScoutingMission() {
        if (!_.isUndefined(SharkGame.persistentFlags.scouting)) {
            gateway.updateWasScoutingStatus();
        }
        return SharkGame.persistentFlags.wasScouting;
    },

    currentlyOnScoutingMission() {
        if (!SharkGame.gameOver && _.isUndefined(SharkGame.persistentFlags.scouting)) {
            gateway.updateScoutingStatus();
        }
        return SharkGame.persistentFlags.scouting;
    },

    getMinutesBelowPar() {
        const time = gateway.getPar() - gateway.getTimeInLastWorld(true) / 60000;
        if (time < 0) {
            return 0;
        }
        return time;
    },

    getPar(type = world.worldType) {
        return SharkGame.WorldTypes[type].par;
    },

    getSpeedReward(loadingFromSave) {
        let reward = 0;
        if (gateway.getPar() && !loadingFromSave && SharkGame.wonGame) {
            let timeBelowPar = gateway.getMinutesBelowPar();
            if (timeBelowPar > 0) {
                while (timeBelowPar > 0) {
                    timeBelowPar -= 5;
                    reward += 1;
                }

                let timeBelowThreshold;
                const rawTime = gateway.getTimeInLastWorld(true) / 60000;
                if (rawTime < 5) {
                    timeBelowThreshold = 5 - rawTime;

                    while (timeBelowThreshold > 0) {
                        timeBelowThreshold -= 1;
                        reward += 1;
                    }
                }

                if (rawTime < 1) {
                    timeBelowThreshold = 1 - rawTime;

                    while (timeBelowThreshold > 0) {
                        timeBelowThreshold -= 1 / 6;
                        reward += 1;
                    }
                }

                if (rawTime < 1 / 6) {
                    timeBelowThreshold = 1 / 6 - rawTime;

                    while (timeBelowThreshold > 0) {
                        timeBelowThreshold -= 1 / 60;
                        reward += 1;
                    }
                }
            }
        }
        return reward;
    },

    getBaseReward(loadingFromSave, whichWorld = world.worldType) {
        let reward = 0;
        if (!loadingFromSave && SharkGame.wonGame) {
            reward = gateway.wasOnScoutingMission() ? 4 : 2;

            const bonus = SharkGame.WorldTypes[whichWorld].bonus;
            if (bonus) {
                reward += bonus;
            }
        }
        return reward;
    },

    getPatienceReward(loadingFromSave) {
        if (!loadingFromSave && SharkGame.wonGame) {
            return SharkGame.Aspects.patience.level;
        }
        return 0;
    },

    getGumptionBonus(loadingFromSave) {
        if (!loadingFromSave && SharkGame.wonGame) {
            const bonus = SharkGame.Aspects.gumption.level * 0.01 * res.getResource("essence");
            return Math.min(1, bonus);
        }
        return 0;
    },

    grantEssenceReward(essenceReward, patienceReward, speedReward) {
        const gumptionBonus = gateway.getGumptionBonus();
        res.changeResource("essence", Math.ceil((1 + gumptionBonus) * (essenceReward + speedReward) + patienceReward));
    },

    prepareBasePane(baseReward, patienceReward, speedReward, gumptionBonus) {
        // PREPARE GATEWAY PANE
        // set up classes
        let pane;
        if (!SharkGame.paneGenerated) {
            pane = SharkGame.PaneHandler.buildPane();
        } else {
            pane = $("#pane");
        }
        pane.addClass("gateway");

        // make overlay opaque
        if (SharkGame.Settings.current.showAnimations) {
            gateway.transitioning = true;
        }

        SharkGame.OverlayHandler.revealOverlay(1000, 1.0, () => {
            gateway.cleanUp();
            gateway.showGateway(baseReward, patienceReward, speedReward, gumptionBonus, true);
            if (gateway.shouldCheatsBeUnlocked()) {
                gateway.unlockCheats();
            }
        });
    },

    shouldCheatsBeUnlocked() {
        return res.getTotalResource("essence") >= 1000 && !SharkGame.persistentFlags.unlockedDebug;
    },

    unlockCheats() {
        if (!SharkGame.persistentFlags.debug && !SharkGame.persistentFlags.unlockedDebug) {
            SharkGame.PaneHandler.showUnlockedCheatsMessage();
            SharkGame.Save.createTaggedSave(`BackupCheats`);
            cad.debug();
        }
        SharkGame.persistentFlags.unlockedDebug = true;
    },
};

SharkGame.Gateway.PresenceFeelings = {
    clam: "hard things?",
    sponge: "porous things?",
    jellyfish: "squishy things?",
    coral: "colorful things?",
    dolphin: "annoying scholars?",
    whale: "wise scholars?",
    octopus: "logical entities?",
    squid: "loyal hunters?",
    urchin: "dimwitted creatures?",
    shrimp: "simple creatures?",
    lobster: "worriless crustaceans?",
    chimaera: "familiar predators?",
    eel: "slithering hunters?",
    tar: "something dirty?",
    // swordfish: "wary hunters",
};

SharkGame.Gateway.Messages = {
    essenceBased: [
        {
            min: 5,
            max: 10,
            messages: [
                "Your aptitude grows, I see.",
                "Your presence is weak, but it grows stronger.",
                "What new sights have you seen in these journeys?",
                "How are you finding your voyage?",
                "Have you noticed how few can follow you through the gates?",
            ],
        },
        {
            min: 11,
            max: 30,
            messages: [
                "How quickly do you travel through worlds?",
                "You are becoming familiar with this.",
                "Back so soon?",
                "Welcome back, to the space between spaces.",
            ],
        },
        {
            min: 31,
            max: 50,
            messages: [
                "You are a traveller like any other.",
                "I see you here more than ever. Can you see me?",
                "Well met, shark friend.",
                "You remind me of myself, from a long, long time ago.",
                "Welcome back to irregular irreality.",
            ],
        },
        {
            min: 51,
            max: 200,
            messages: [
                "Have you found your home yet?",
                "Surely your home lies but a jump or two away?",
                "Have you ever returned to one of the worlds you've been before?",
                "Can you find anyone else that journeys so frequently as you?",
                "You have become so strong. So powerful.",
                "I remember when you first arrived here, with confusion and terror in your mind.",
            ],
        },
        {
            min: 201,
            messages: [
                "Your devotion to the journey is alarming.",
                "You exceed anything I've ever known.",
                "You are a force of will within the shell of a shark.",
                "It surprises me how much focus and dedication you show. Perhaps you may settle in your next world?",
                "Does your home exist?",
                "Is there an end to your quest?",
                "Why are you still searching? Many others would have surrendered to the odds by this point.",
            ],
        },
    ],
    lastPlanetBased: {
        start: [
            "What brings you here, strange one?",
            "Hello, newcomer.",
            "Ah. Welcome, new one.",
            "Your journey has only just begun.",
            "Welcome to the end of the beginning.",
        ],
        marine: [
            "Did your last ocean feel all too familiar?",
            "Do you bring life, or do you bring death, worldbuilder?",
            "Do you wonder where the remnants of the lobsters' past are?",
            "A tragedy; or, perhaps, merely the cost of progress.",
        ],
        haven: [
            "A beautiful paradise. It may be a while before you find a world so peaceful.",
            "What shining atoll do you leave behind? Those who could not follow you will surely live happily.",
            "Why did you leave?",
            "The incessant chatter of the dolphins has stopped.",
            "Something echoed from the gate into this realm. Was that you?",
            "Do you wonder how the dolphins arrived in this state?",
        ],
        tempestuous: [
            "You braved the maelstrom and came from it unscathed.",
            "Charge through the whirlpool. Give no quarter to the storm.",
            "The revolt was unavoidable. It was merely a matter of time.",
            "Do you wonder why the swordfish obeyed?",
            "Do you wonder what the swordfish were so startled by?",
        ],
        violent: [
            "The boiling ocean only stirred you on.",
            "You are forged from the geothermal vents.",
            "The shrimp are no simpletons.",
            "That environment is ideal for life. Just not for your kind.",
            "Do you wonder why there were no sharks here?",
        ],
        abandoned: [
            "Do you wonder who abandoned the machines?",
            "Do the octopuses know who came before them? Do you know?",
            "We confront our mistakes as choices. We repeat them, or we do not.",
        ],
        shrouded: [
            "Did the chimaeras recognise who you were?",
            "What did you learn from the dark world?",
            "To fall into darkness is easy, but to escape it is another story.",
            "Such strange forces guide the chimaeras, just as strange forces guide you.",
            "Do you wonder where the shards came from?",
            "Do you wonder who the ancients were?",
        ],
        frigid: [
            "...did you miss the rays?",
            "Tell me: Where do you see the line between friend and food? The urchins are as simple-minded as the fish.",
            "Do you wonder who the squid look up to?",
            "Do you wonder who built the great machine?",
        ],
    },
    loss: [
        "No matter. You will succeed in the future, no doubt.",
        "Never give in. Never surrender. Empty platitudes, perhaps, but sound advice nonetheless.",
        "Mistakes are filled with lessons. Learn never to repeat them.",
        "How does it feel to know that everyone who trusted you has perished?",
        "Another world dies. Was this one significant to you?",
        "A sad event. There is plenty of time to redeem yourself.",
        "What a pity. What a shame. I hear the mournful cries of a dying ocean.",
        "You can do better. You will do better. Believe.",
        "You wish to get back here so quickly?",
        "You and everything you knew has died. Perhaps not you. Perhaps not.",
        "One more try, perhaps?",
        "Excellence is pure habit. We are what we repeatedly do.",
    ],
    generic: [
        "There is no warmth or cold here. Only numbness.",
        "What do you seek?",
        "We are on the edge of infinity, peering into a boundless sea of potential.",
        "You may not see me. Do not worry. I can see you.",
        "What am I? Oh, it is not so important. Not so soon.",
        "Is this the dream of a shark between worlds, or are the worlds a dream and this place your reality?",
        "A crossroads. Decisions. Decisions that cannot be taken so lightly.",
        "There are such sights to behold for the ones who can see here.",
        "You are to the ocean what we are to the pathways.",
        "You swim through liquid eternity. You are now, always, and forever.",
        "The prodigal shark returns.",
        "Your constant drive to continue fuels your capacity to overcome.",
        "There is no space in this universe you cannot make your own.",
    ],
};

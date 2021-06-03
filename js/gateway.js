"use strict";
SharkGame.Gateway = {
    NUM_ARTIFACTS_TO_SHOW: 5,
    NUM_PLANETS_TO_SHOW: 3,

    transitioning: false,
    selectedWorld: "",

    allowedWorlds: ["abandoned", "haven", "frigid"],

    completedWorlds: [],

    planetPool: [],

    init() {
        // apply aspect effects
        _.each(SharkGame.Aspects, (aspectData) => {
            if (aspectData.level && typeof aspectData.level === "function") {
                aspectData.apply();
            }
        });
    },

    enterGate(loadingFromSave) {
        // award essence (and mark world completion)
        let essenceReward = 0;
        if (!loadingFromSave) {
            if (SharkGame.wonGame) {
                essenceReward = 4 + Math.floor(world.planetLevel / 4);
                gateway.markWorldCompleted(world.worldType);
            } else {
                essenceReward = 0;
            }
            res.changeResource("essence", essenceReward);
        }

        // RESET COMPLETED GATE REQUIREMENTS
        SharkGame.Gate.completedRequirements = {};

        // PREPARE PLANETS
        gateway.preparePlanetSelection(gateway.NUM_PLANETS_TO_SHOW);

        // SAVE
        SharkGame.Save.saveGame();

        // PREPARE GATEWAY PANE
        // set up classes
        let pane;
        if (!SharkGame.paneGenerated) {
            pane = main.buildPane();
        } else {
            pane = $("#pane");
        }
        pane.addClass("gateway");

        const overlay = $("#overlay");
        overlay.addClass("gateway");

        // make overlay opaque
        if (SharkGame.Settings.current.showAnimations) {
            overlay
                .show()
                .css("opacity", 0)
                .animate(
                    {
                        opacity: 1.0,
                    },
                    1000,
                    "swing",
                    () => {
                        // put back to 4000
                        gateway.cleanUp();
                        gateway.showGateway(essenceReward);
                    }
                );
        } else {
            overlay.show().css("opacity", 1.0);
            gateway.cleanUp();
            gateway.showGateway(essenceReward);
        }
    },

    cleanUp() {
        // empty out the game stuff behind
        main.purgeGame();
    },

    showGateway(essenceRewarded) {
        // get some useful numbers
        const essenceHeld = res.getResource("essence");
        const numenHeld = res.getResource("numen");

        // construct the gateway content
        const gatewayContent = $("<div>");
        gatewayContent.append($("<p>").html("You are a shark in the space between worlds."));
        if (!SharkGame.wonGame) {
            gatewayContent.append($("<p>").html("It is not clear how you have ended up here, but you remember a bitter defeat.").addClass("medDesc"));
        }
        gatewayContent.append($("<p>").html("Something unseen says,").addClass("medDesc"));
        gatewayContent.append($("<em>").attr("id", "gatewayVoiceMessage").html(gateway.getVoiceMessage()));
        if (essenceRewarded > 0) {
            gatewayContent.append(
                $("<p>").html(
                    "Entering this place has changed you, granting you <span class='essenceCount'>" +
                        main.beautify(essenceRewarded) +
                        "</span> essence."
                )
            );
        }
        gatewayContent.append(
            $("<p>").html("You have <span id='essenceHeldDisplay' class='essenceCount'>" + main.beautify(essenceHeld) + "</span> essence.")
        );
        if (numenHeld > 0) {
            const numenName = numenHeld > 1 ? "numina" : "numen";
            gatewayContent.append(
                $("<p>").html(
                    "You also have <span class='numenCount'>" + main.beautify(numenHeld) + "</span> " + numenName + ", and you radiate divinity."
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
        SharkGame.Button.makeButton("backToGateway", "worlds", navButtons, () => {
            gateway.switchViews(gateway.showPlanets);
        });
        gatewayContent.append(navButtons);

        main.showPane("GATEWAY", gatewayContent, true, 500, true);
        gateway.transitioning = false;
    },

    showRunEndInfo(containerDiv) {
        containerDiv.append(
            $("<p>")
                .html("<em>Time spent within last ocean:</em><br/>")
                .append(main.formatTime(SharkGame.timestampRunEnd - SharkGame.timestampRunStart))
        );
    },

    applyAspects() {
        _.each(SharkGame.Aspects, (aspectData) => {
            if (aspectData.level && typeof aspectData.level === "function") {
                aspectData.apply();
            }
        });
    },

    showAspects() {
        const aspectTreeContent = $("<div>");
        aspectTreeContent.append(
            $("<strong>")
                .attr("id", "essenceCount")
                .html(res.getResource("essence") + " ESSENCE")
        );
        aspectTreeContent.append($("<p>").html("Your will flows into solid shapes beyond your control.<br>Focus."));
        aspectTreeContent.append(SharkGame.AspectTree.drawCanvas());

        SharkGame.AspectTree.setUp();
        SharkGame.AspectTree.render();

        // add return to gateway button
        SharkGame.Button.makeButton("backToGateway", "return to gateway", aspectTreeContent, () => {
            gateway.switchViews(gateway.showGateway);
        });

        main.showPane("ASPECT TREE", aspectTreeContent, true, 500, true);

        gateway.transitioning = false;
    },

    showPlanets() {
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
            $("<p>").html("NOTE: v0.2 alpha <b>ONLY</b> CONTAINS <b>2 WORLDS</b> at the moment.<br/>Once you beat them, try v0.11 of the mod.")
        );

        // add return to gateway button
        const returnButtonDiv = $("<div>");
        SharkGame.Button.makeButton("backToGateway", "return to gateway", returnButtonDiv, () => {
            gateway.switchViews(gateway.showGateway);
        });
        planetSelectionContent.append(returnButtonDiv);

        main.showPane("WORLDS", planetSelectionContent, true, 500, true);
        gateway.transitioning = false;
        gateway.updatePlanetButtons();
    },

    confirmWorld() {
        const selectedWorldData = SharkGame.WorldTypes[gateway.selectedWorld];
        const planetLevel = _.find(gateway.planetPool, (generatedWorld) => generatedWorld.type === gateway.selectedWorld).level;

        // construct the gateway content
        const gatewayContent = $("<div>").append($("<p>").html("Travel to the " + selectedWorldData.name + " World?"));

        // add world image
        const spritename = "planets/" + gateway.selectedWorld;
        const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "planets/missing");
        if (iconDiv) {
            iconDiv.addClass("planetDisplay");
            const containerDiv = $("<div>").attr("id", "planetContainer");
            containerDiv.append(iconDiv);
            gatewayContent.append(containerDiv);
        }

        const attributeDiv = $("<div>");
        gateway.showPlanetAttributes(selectedWorldData, planetLevel, attributeDiv);
        gatewayContent.append(attributeDiv);

        // add confirm button
        const confirmButtonDiv = $("<div>");
        SharkGame.Button.makeButton("progress", "proceed", confirmButtonDiv, () => {
            // kick back to main to start up the game again
            world.worldType = gateway.selectedWorld;
            world.planetLevel = planetLevel;
            main.loopGame();
        });
        gatewayContent.append(confirmButtonDiv);

        // add return to planets button
        const returnButtonDiv = $("<div>");
        SharkGame.Button.makeButton("backToGateway", "reconsider", returnButtonDiv, () => {
            gateway.switchViews(gateway.showPlanets);
        });
        gatewayContent.append(returnButtonDiv);

        main.showPane("CONFIRM", gatewayContent, true, 500, true);
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

        // pull random types from the pool
        // for each type pulled, generated a random level for the planet
        // then add to the planet pool
        for (let i = 0; i < numPlanets; i++) {
            const choice = SharkGame.choose(qualifiedPlanetTypes);
            const index = qualifiedPlanetTypes.indexOf(choice);
            // take it out of the qualified pool (avoid duplicates)
            qualifiedPlanetTypes.splice(index, 1);

            // generate random level
            const newLevel = Math.floor(Math.max(world.planetLevel + (Math.random() * 10 - 4), 1));

            // add choice to pool
            gateway.planetPool.push({
                type: choice,
                level: newLevel,
            });
        }
    },

    updatePlanetButtons() {
        _.each(gateway.planetPool, (planetData) => {
            const buttonSel = $("#planet-" + planetData.type);
            if (buttonSel.length > 0) {
                const planetLevel = _.find(gateway.planetPool, (generatedWorld) => generatedWorld.type === planetData.type).level;
                const deeperPlanetData = SharkGame.WorldTypes[planetData.type];
                const label =
                    deeperPlanetData.name +
                    "<br><span class='medDesc'>( Climate Level " +
                    main.beautify(planetLevel) +
                    " )</span>" +
                    "<br>" +
                    deeperPlanetData.desc;

                buttonSel.html(label);

                const spritename = "planets/" + planetData.type;
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

    getVoiceMessage() {
        // the point of this function is to add to the message pool all available qualifying messages and then pick one
        const messagePool = [];
        const totalEssence = res.getTotalResource("essence");

        // if the game wasn't won, add loss messages
        if (!SharkGame.wonGame) {
            messagePool.push(...gateway.Messages.loss);
        } else {
            // determine which essence based messages should go into the pool
            _.each(gateway.Messages.essenceBased, (message) => {
                let min = 0;
                if (message.min) {
                    min = message.min;
                }

                let max = Number.MAX_VALUE;
                // This would not work when message.max === 0
                if (message.max) {
                    max = message.max;
                }
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

    // GOD THIS IS A MESS
    // I'M SO SORRY FUTURE ME AND ANYONE ELSE READING THIS

    // why
    showPlanetAttributes(worldData, planetLevel, contentDiv) {
        // add known attributes
        const pslevel = Infinity; //SharkGame.Aspects.planetScanner.level;
        if (pslevel > 0) {
            const modifiers = _.size(worldData.modifiers);
            const gateSlots = _.size(worldData.gateCosts);
            const bannedResources = _.size(worldData.absentResources);
            const totalAttributes = modifiers + gateSlots + bannedResources;
            const numberKnown = Math.floor((totalAttributes * pslevel) / 5);
            let numberLeft = numberKnown;

            contentDiv.append(
                $("<p>").html("Known modifiers (" + Math.floor(modifiers === 0 ? 100 : Math.min(1, numberKnown / modifiers) * 100) + "%):")
            );

            const modifierList = $("<ul>").addClass("gatewayPropertyList");
            for (let i = 0; i < Math.min(numberKnown, modifiers); i++) {
                const modifier = worldData.modifiers[i];
                const target = modifier.resource;
                modifierList.append(
                    $("<li>")
                        .html(SharkGame.ModifierReference.get(modifier.modifier).effectDescription(modifier.amount, target, planetLevel))
                        .addClass("medDesc")
                );
            }
            contentDiv.append(modifierList);
            numberLeft = numberLeft - modifiers;

            // if all modifiers are revealed, carry over to the gate requirements and abandoned resources
            if (numberLeft > 0) {
                contentDiv.append($("<p>").html("Known gate requirements (" + Math.floor(Math.min(1, numberLeft / gateSlots) * 100) + "%):"));
                const gateList = $("<ul>").addClass("gatewayPropertyList");
                const gateKeySet = _.keys(worldData.gateCosts);
                for (let i = 0; i < Math.min(numberLeft, gateSlots); i++) {
                    const gateSlot = gateKeySet[i];
                    const gateCost = Math.floor(worldData.gateCosts[gateSlot] * planetLevel * world.getGateCostMultiplier());
                    const resourceName = main.toTitleCase(SharkGame.ResourceMap.get(gateSlot).singleName);
                    gateList.append(
                        $("<li>")
                            .html(resourceName + ": " + main.beautify(gateCost))
                            .addClass("medDesc")
                    );
                }
                contentDiv.append(gateList);
            }

            numberLeft = numberLeft - gateSlots;
            if (numberLeft > 0) {
                contentDiv.append($("<p>").html("Known absences (" + Math.floor(Math.min(1, numberLeft / bannedResources) * 100) + "%):"));
                const bannedList = $("<ul>").addClass("gatewayPropertyList");
                for (let i = 0; i < Math.min(numberLeft, bannedResources); i++) {
                    const bannedResource = worldData.absentResources[i];
                    const resourceName = SharkGame.ResourceMap.get(bannedResource).singleName;
                    bannedList.append($("<li>").html(resourceName).addClass("smallDesc"));
                }
                contentDiv.append(bannedList);
            }
        }
    },

    markWorldCompleted(worldType) {
        if (!gateway.completedWorlds.includes(worldType)) {
            gateway.completedWorlds.push(worldType);
        }
    },
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
        // working on changing this section
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
            "Was that world not your home?",
            "A blue world. A dream of a former life, perhaps.",
            "You seem surprised. Did this not happen to your own home?",
        ],
        haven: [
            "A beautiful paradise. It may be a while before you find a world so peaceful.",
            "What shining atoll do you leave behind? Those who could not follow you will surely live happily.",
            "Why did you leave?",
            "The incessant chatter of the dolphins has stopped.",
            "Something echoed from the gate into this realm. Was that you?",
            "These dolphins are not reflective of others, I assure you.",
        ],
        tempestuous: [
            "You braved the maelstrom and came from it unscathed.",
            "Charge through the whirlpool. Give no quarter to the storm.",
            "The swordfish fear your presence, with good reason.",
            "The revolt was unavoidable. It was merely a matter of time.",
        ],
        violent: [
            "The boiling ocean only stirred you on.",
            "You are forged from the geothermal vents.",
            "The shrimp are no simpletons, they are merely focused.",
        ],
        abandoned: [
            "Do you wonder who abandoned the machines?",
            "Do the octopuses know who came before them? Do you know?",
            "Did you create this world? How could you remember?",
        ],
        shrouded: [
            "Did the chimaeras recognise who you were?",
            "What did you learn from the dark world?",
            "The serpant is an old god; her time had passed long before you arrived.",
            "Who brought darkness to this place? Or, was it always like this?",
        ],
        frigid: [
            "The squid do not usually take so well to outsiders.",
            "...did you miss the rays?",
            "Tell me: Where do you see the line between friend and food? The urchins are as simple-minded as the fish.",
            "The squid thought they recognized you. They would be wrong.",
            // The squid are primitive and prideful, yet wise.<br>They are no fools, else the ice would have claimed them long ago.
            // save that for the squid status
        ],
    },
    loss: [
        "No matter. You will succeed in future, no doubt.",
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

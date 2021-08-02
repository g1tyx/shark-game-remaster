"use strict";
SharkGame.Home = {
    tabId: "home",
    tabDiscovered: true,
    tabSeen: true,
    tabName: "Home Sea",
    tabBg: "img/bg/bg-homesea.png",

    currentButtonTab: null,
    currentExtraMessageIndex: null,

    // Priority: later messages display if available, otherwise earlier ones.
    extraMessages: {
        // FIRST RUN
        start: [
            {
                name: "start-you-are-a-shark",
                message: "",
            },
            {
                name: "start-shark",
                unlock: { resource: { fish: 5 } },
                message: "You attract the attention of a shark. Maybe they can help you catch fish!",
            },
            {
                name: "start-sharks",
                unlock: { resource: { shark: 1 } },
                message: "More sharks swim over, curious and watchful.",
            },
            {
                name: "start-ray",
                unlock: { resource: { fish: 15 } },
                message: "Some rays drift over.",
            },
            {
                name: "start-quite-the-group",
                unlock: { resource: { shark: 1, ray: 1 } },
                message: "You have quite the group going now.",
            },
            {
                name: "start-crab",
                unlock: { resource: { shark: 4, ray: 4 } },
                message: "Some curious crabs come over.",
            },
            {
                name: "start-tribe",
                unlock: { resource: { shark: 1, ray: 1, crab: 1 } },
                message: "Your new tribe is at your command!",
            },
            {
                name: "start-crystals",
                unlock: { resource: { shark: 1, crystal: 10 } },
                message: "The crystals are shiny. Some sharks stare at them curiously.",
            },
            {
                name: "start-science",
                unlock: { resource: { scientist: 1 } },
                message: "The science sharks swim in their own school.",
            },
            {
                name: "start-discoveries",
                unlock: { upgrade: ["crystalContainer"] },
                message: "More discoveries are needed.",
            },
            {
                name: "start-nurse",
                unlock: { resource: { nurse: 1 } },
                message: "The shark community grows with time.",
            },
            {
                name: "start-exploration",
                unlock: { upgrade: ["exploration"] },
                message: "You hear faint songs and cries in the distance.",
            },
            {
                name: "start-machines",
                unlock: { upgrade: ["automation"] },
                message: "Machines to do things for you.<br>Machines to do things faster than you or any shark.",
            },
            {
                name: "start-chasm",
                unlock: { upgrade: ["farExploration"] },
                message: "This place is not your home. You remember a crystal blue ocean.<br>The chasms beckon.",
            },
            {
                name: "start-gate",
                unlock: { upgrade: ["gateDiscovery"] },
                message: "The gate beckons. The secret must be unlocked.",
            },
        ],

        // LATER RUNS
        marine: [
            {
                name: "marine-default",
                message: "The fish never run dry here. This place feels so familiar.",
            },
            {
                name: "lobster-one",
                unlock: { resource: { lobster: 20 }, homeAction: ["getLobster"] },
                message: "The lobsters work, but seem carefree.<br>They worry about nothing.",
            },
        ],

        haven: [
            {
                name: "haven-default",
                message: "The oceans are rich with life. But it's still not home.",
            },
            {
                name: "haven-dolphin-observes",
                unlock: { totalResource: { coral: 75 } },
                message: "A... thing observes us from afar. What the heck is that??",
            },
            {
                name: "haven-dolphins",
                unlock: { totalResource: { dolphin: 1 }, homeAction: ["getDolphin"] },
                message: "A dolphin joins the frenzy.<br/>It already wants a raise. Wow.",
            },
            {
                name: "haven-dolphin-empire",
                unlock: { totalResource: { dolphin: 20 } },
                message:
                    "The dolphin pods that work with us speak of a star-spanning empire of their kind.<br>They ask where our empire is. And they smile.",
            },
            {
                name: "haven-papyrus",
                unlock: { upgrade: ["sunObservation"] },
                message: "Pieces of condensed kelp (???) are washing up in the currents.<br/>Something is carved into them.",
            },
            {
                name: "haven-stories",
                unlock: { upgrade: ["delphineHistory"] },
                message:
                    "The dolphin's self-indulgent tales make frequent references to a mystical gate.<br>And, they don't know where it is. Of course they don't.",
            },
            {
                name: "haven-whales",
                unlock: { totalResource: { whale: 1 }, homeAction: ["getWhale"] },
                message: "The whales speak rarely to us, working in silence as they sing to the ocean.<br>What do they sing for?",
            },
            {
                name: "haven-history",
                unlock: { upgrade: ["retroactiveRecordkeeping"] },
                message:
                    "The grand sum of all dolphin knowledge is laid out before us,<br/>and it is pitifully small. The original collections have been lost to time.",
            },
            {
                name: "haven-song",
                unlock: { upgrade: ["whaleSong"] },
                message: "The whale song fills you with the same feeling as the gates. But so much smaller.",
            },
            {
                name: "haven-done",
                unlock: { resource: { chorus: 1 } },
                message: "The great song booms across the open water, carrying itself to all corners of the ocean.<br/>The gate reacts.",
            },
        ],

        tempestuous: [
            {
                name: "tempestuous-default",
                message: "The storm never ends, and many are lost to its violent throes.",
            },
        ],

        violent: [
            {
                name: "violent-default",
                message: "Bursts of plenty from the scorching vents, but so hot.<br>No place for the young.",
            },
            {
                name: "shrimp-one",
                unlock: { resource: { shrimp: 50 }, homeAction: ["getShrimp"] },
                message: "The shrimps are tiny, but hard-working.<br>They live for their sponge hives.",
            },
        ],

        abandoned: [
            {
                name: "abandoned-default",
                message: "The tar clogs the gills of everyone here.<br>This dying world drags everyone down with it.",
            },
            {
                name: "abandoned-octopus-scrutinizes",
                unlock: { upgrade: ["statsDiscovery"] },
                message: "An octopus wanders over.<br>It scrutinizes your attempt at organization.",
            },
            {
                name: "abandoned-octopus",
                unlock: { totalResource: { octopus: 1 } },
                message: "The octopus works tirelessly.",
            },
            {
                name: "abandoned-octopuses",
                unlock: { totalResource: { octopus: 8 } },
                message: "More octopuses join. They work in perfect unison.",
            },
            {
                name: "abandoned-production",
                unlock: { upgrade: ["octopusMethodology"] },
                message:
                    "The octopuses speak of production and correct action. They speak of unity through efficiency.<br>They regard us with cold, neutral eyes.",
            },
            {
                name: "abandoned-spronge",
                unlock: { resource: { spronge: 1 } },
                message: "Residue pumps through spronge like blood.<br>It pulses and throbs.",
            },
            {
                name: "abandoned-exploration",
                unlock: { upgrade: ["exploration"] },
                message: "Great spires loom in the distance.<br>Loose cables are strung together on the horizon.",
            },
            {
                name: "abandoned-gate",
                unlock: { upgrade: ["farAbandonedExploration"] },
                message:
                    "This gate stands inert and lifeless like the city around it.<br>The slots are already filled, but it looks like it's turned off.",
            },
            {
                name: "abandoned-reverse-engineering",
                unlock: { upgrade: ["reverseEngineering"] },
                message:
                    "The components spin and whirr and click together, but their purpose eludes us.<br>What secrets are you hiding in your mechanisms?",
            },
            {
                name: "abandoned-high-energy-fusion",
                unlock: { upgrade: ["highEnergyFusion"] },
                message: "The light is blinding, but the output is worth it.<br>The pieces of a broken past unite to create a brighter future.",
            },
            {
                name: "abandoned-done",
                unlock: { upgrade: ["artifactAssembly"] },
                message: "...",
            },
            {
                name: "abandoned-tar-one",
                unlock: { resource: { tar: 5 } },
                message: "The tar is killing everything!<br>Maybe a filter could save us?",
            },
            {
                name: "abandoned-tar-two",
                unlock: { resource: { tar: 200 } },
                message: "Only machines will remain. All is lost.<br><span class='smallDesc'>All is lost.</span>",
            },
        ],

        shrouded: [
            {
                name: "shrouded-default",
                message: "The crystals are easier to find, but the darkness makes it hard to find anything else.",
            },
            {
                name: "eel-one",
                unlock: { resource: { eel: 10 }, homeAction: ["getEel"] },
                message: "The eels chatter among their hiding places.<br>They like the sharks.",
            },
            {
                name: "chimaera-one",
                unlock: { resource: { chimaera: 5 }, homeAction: ["getChimaera"] },
                message:
                    "The chimaeras are ancient kin of the shark kind, reunited through wild coincidence.<br>What peerless wonders have they found in the dark?",
            },
        ],

        frigid: [
            {
                name: "frigid-default",
                message: "Giant shards of glassy ice surround you on all sides.",
            },
            {
                name: "frigid-ice-one",
                unlock: { resource: { ice: 100 } },
                message: "You feel tired.",
            },
            {
                name: "frigid-icy-doom",
                unlock: { resource: { ice: 500 } },
                message: "So cold. So hungry.<br><span class='smallDesc'>So hopeless.</span>",
            },
            {
                name: "frigid-distant-village",
                unlock: { totalResource: { science: 8 } },
                message: "While scanning the horizon, you notice a gap in the ice.<br>You peer through it, and spot something else.",
            },
            {
                name: "frigid-village",
                unlock: { upgrade: ["civilContact"] },
                message:
                    "A small village of squid greets you respectfully.<br>The water in this place is a little warmer, and you hear a quiet, ambient hum.",
            },
            {
                name: "frigid-urchins",
                unlock: { totalResource: { urchin: 2 } },
                message:
                    "The urchins scuttle along the ground and hop about, gathering kelp and placing it into a large, central pile.<br>They know nothing but the kelp.",
            },
            {
                name: "frigid-teamwork",
                unlock: { totalResource: { extractionTeam: 1 } },
                message: "The squid champion the value of teamwork and the necessity of cooperation.<br>They say they follow by example.",
            },
            {
                name: "frigid-machine",
                unlock: { totalResource: { squid: 125 } },
                message:
                    "In the center of the settlement lies a vibrating...thing, and a strange gate.<br>The thing buzzes loudly, casting enormous energy across the water.",
            },
            {
                name: "frigid-squid",
                unlock: { totalResource: { squid: 250 } },
                message: "The squid speak of an ancient visitor who saved their world.<br>They ask if you too, have seen this visitor.",
            },
            {
                name: "frigid-suspicion",
                unlock: { upgrade: ["automation"] },
                message: "The squid describe the machine with fascination. They ask if we feel the same.<br>They see something we do not.",
            },
            {
                name: "frigid-battery",
                unlock: { upgrade: ["internalInquiry"] },
                message:
                    "Buried deep within the complex lies a massive, dimly glowing battery.<br>The squid say replacing it will get the machine running at full power.",
            },
            {
                name: "frigid-heat-returns",
                unlock: { upgrade: ["rapidRecharging"] },
                message: "A wave of heat washes over you, and the dingy complex comes back to life.<br>The gate turns on.",
            },
            /*{
                name: "frigid-end",
                unlock: { upgrade: ["rapidRepairs"] },
                message: "The gate opens.<br>The squid bid you farewell.",
            },*/
            //another one: "the maw of the gate opens"
        ],
        /*
        {
            message:
                "The jagged seafloor looks ancient, yet pristine.<br>Sponges thrive in great numbers on the rocks.",
        },
        */
    },

    init() {
        // rename home tab
        const tabName = SharkGame.WorldTypes[world.worldType].name + " Ocean";
        home.tabName = tabName;

        main.registerTab(this);

        // populate action discoveries (and reset removals)
        _.each(SharkGame.HomeActions.getActionTable(), (actionData) => {
            actionData.discovered = false;
            actionData.newlyDiscovered = false;
            actionData.isRemoved = false;
        });

        home.currentExtraMessageIndex = -1;
        home.currentButtonTab = "all";
    },

    switchTo() {
        const content = $("#content");
        const tabMessage = $("<div>").attr("id", "tabMessage");
        content.append(tabMessage);
        home.currentExtraMessageIndex = -1;
        home.updateMessage(true);
        // button tabs
        const buttonTabDiv = $("<div>").attr("id", "homeTabs");
        content.append(buttonTabDiv);
        home.createButtonTabs();
        // buy amount buttons
        main.createBuyButtons("buy", content, "append");
        // button list
        const buttonList = $("<div>").attr("id", "buttonList");
        content.append(buttonList);
        if (SharkGame.Settings.current.buttonDisplayType === "pile") {
            buttonList.addClass("pileArrangement");
        } else {
            buttonList.removeClass("pileArrangement");
        }
        // background art!
        if (SharkGame.Settings.current.showTabImages) {
            tabMessage.css("background-image", "url('" + home.tabBg + "')");
        }
        if (SharkGame.Settings.current.logLocation === "right") {
            buttonList.addClass("smallerMargin");
        }
    },

    discoverActions() {
        $.each(SharkGame.HomeActions.getActionTable(), (actionName, actionData) => {
            actionData.discovered = home.areActionPrereqsMet(actionName);
            actionData.newlyDiscovered = false;
        });
    },

    createButtonTabs() {
        const buttonTabDiv = $("#homeTabs");
        const buttonTabList = $("<ul>").attr("id", "homeTabsList");
        buttonTabDiv.empty();
        let tabAmount = 0;

        // add a header for each discovered category
        // make it a link if it's not the current tab
        $.each(SharkGame.HomeActionCategories, (categoryName, category) => {
            const onThisTab = home.currentButtonTab === categoryName;

            let categoryDiscovered = false;
            if (categoryName === "all") {
                categoryDiscovered = true;
            } else {
                // Check if any action in category is discovered
                categoryDiscovered = _.some(category.actions, (actionName) => {
                    const actionTable = SharkGame.HomeActions.getActionTable();
                    // True if it exists and is discovered
                    return _.has(actionTable, actionName) && actionTable[actionName].discovered;
                });
            }

            if (categoryDiscovered) {
                const tabListItem = $("<li>");
                if (onThisTab) {
                    tabListItem.html(category.name);
                } else {
                    tabListItem.append(
                        $("<a>")
                            .attr("id", "buttonTab-" + categoryName)
                            .attr("href", "javascript:;")
                            .html(category.name)
                            .on("click", function callback() {
                                if ($(this).hasClass(".disabled")) return;
                                const tab = $(this).attr("id").split("-")[1];
                                home.changeButtonTab(tab);
                            })
                    );
                    if (category.hasNewItem) {
                        tabListItem.addClass("newItemAdded");
                    }
                }
                buttonTabList.append(tabListItem);
                tabAmount++;
            }
        });
        // finally at the very end just throw the damn list away if it only has two options
        // "all" + another category is completely pointless
        if (tabAmount > 2) {
            buttonTabDiv.append(buttonTabList);
        }
    },

    updateTab(tabToUpdate) {
        // return if we're looking at all buttons, no change there
        if (home.currentButtonTab === "all") {
            return;
        }
        SharkGame.HomeActionCategories[tabToUpdate].hasNewItem = true;
        const tabItem = $("#buttonTab-" + tabToUpdate);
        if (tabItem.length > 0) {
            tabItem.parent().addClass("newItemAdded");
        } else {
            home.createButtonTabs();
        }
    },

    changeButtonTab(tabToChangeTo) {
        SharkGame.HomeActionCategories[tabToChangeTo].hasNewItem = false;
        if (tabToChangeTo === "all") {
            _.each(SharkGame.HomeActionCategories, (category) => {
                category.hasNewItem = false;
            });
        }
        home.currentButtonTab = tabToChangeTo;
        $("#buttonList").empty();
        home.createButtonTabs();
    },

    updateMessage(suppressAnimation) {
        const worldType = SharkGame.WorldTypes[world.worldType];
        const events = home.extraMessages[world.worldType];

        const selectedIndex = _.findLastIndex(events, (extraMessage) => {
            // check if all requirements met
            if (_.has(extraMessage, "unlock")) {
                let requirementsMet = true;
                requirementsMet =
                    requirementsMet &&
                    _.every(extraMessage.unlock.resource, (requiredAmount, resourceId) => res.getResource(resourceId) >= requiredAmount);
                requirementsMet =
                    requirementsMet &&
                    _.every(extraMessage.unlock.totalResource, (requiredAmount, resourceId) => res.getTotalResource(resourceId) >= requiredAmount);
                requirementsMet =
                    requirementsMet && _.every(extraMessage.unlock.upgrade, (upgradeId) => SharkGame.Upgrades.purchased.includes(upgradeId));
                requirementsMet =
                    requirementsMet &&
                    _.every(extraMessage.unlock.homeAction, (actionName) => {
                        const action = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName);
                        return action.discovered && !action.newlyDiscovered;
                    });
                return requirementsMet;
            }
            return true;
        });

        // only edit DOM if necessary
        if (home.currentExtraMessageIndex !== selectedIndex) {
            home.currentExtraMessageIndex = selectedIndex;
            const messageData = events[selectedIndex];
            const tabMessage = $("#tabMessage");
            let sceneDiv;
            if (SharkGame.Settings.current.showTabImages) {
                sceneDiv = $("#tabSceneImage");
                if (sceneDiv.length === 0) {
                    sceneDiv = $("<div>").attr("id", "tabSceneImage");
                }
            }
            let message = "You are a shark in a " + worldType.shortDesc + " sea.";
            message += "<br><span id='extraMessage' class='medDesc'><br></span>";
            tabMessage.html(message).prepend(sceneDiv);

            const extraMessageSel = $("#extraMessage");
            if (!suppressAnimation && SharkGame.Settings.current.showAnimations) {
                extraMessageSel.animate({ opacity: 0 }, 200, () => {
                    $(extraMessageSel).animate({ opacity: 1 }, 200).html(messageData.message);
                });
                sceneDiv.animate({ opacity: 0 }, 500, () => {
                    if (SharkGame.Settings.current.showTabImages) {
                        SharkGame.changeSprite(SharkGame.spriteHomeEventPath, messageData.name, sceneDiv, "missing");
                    }
                    $(sceneDiv).animate({ opacity: 1 }, 500);
                });
            } else {
                extraMessageSel.html(events[selectedIndex].message);
                if (SharkGame.Settings.current.showTabImages) {
                    SharkGame.changeSprite(SharkGame.spriteHomeEventPath, messageData.name, sceneDiv, "missing");
                }
            }
        }
    },

    update() {
        // for each button entry in the home tab,
        $.each(SharkGame.HomeActions.getActionTable(), (actionName, actionData) => {
            const actionTab = home.getActionCategory(actionName);
            const onTab = actionTab === home.currentButtonTab || home.currentButtonTab === "all";
            if (onTab && !actionData.isRemoved) {
                const button = $("#" + actionName);
                if (button.length === 0) {
                    if (actionData.discovered || home.areActionPrereqsMet(actionName)) {
                        if (!actionData.discovered) {
                            actionData.discovered = true;
                            actionData.newlyDiscovered = true;
                        }
                        home.addButton(actionName);
                    }
                } else {
                    // button exists
                    home.updateButton(actionName);
                }
            } else {
                if (!actionData.discovered) {
                    if (home.areActionPrereqsMet(actionName)) {
                        actionData.discovered = true;
                        actionData.newlyDiscovered = true;
                        home.updateTab(actionTab);
                    }
                }
            }
        });

        // update home message
        home.updateMessage();

        // update hovering messages
        if (document.getElementById("tooltipbox").className.split(" ").includes("forHomeButtonOrGrotto")) {
            if (document.getElementById("tooltipbox").attributes.current) {
                home.onHomeHover(null, document.getElementById("tooltipbox").attributes.current.value);
            }
        }
    },

    updateButton(actionName) {
        const amountToBuy = sharkmath.getBuyAmount();

        const button = $("#" + actionName);
        const actionData = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName);

        if (actionData.removedBy) {
            if (home.shouldRemoveHomeButton(actionData)) {
                button.remove();
                SharkGame.HomeActions.getActionTable()[actionName].isRemoved = true;
                SharkGame.HomeActions.getActionTable()[actionName].discovered = true;
                return;
            }
        }
        let amount = amountToBuy;
        let actionCost;
        if (amountToBuy < 0) {
            const max = Math.floor(home.getMax(actionData));
            // convert divisor from a negative number to a positive fraction
            const divisor = 1 / (Math.floor(amountToBuy) * -1);
            amount = max * divisor;
            amount = Math.floor(amount);
            if (amount < 1) amount = 1;
            actionCost = home.getCost(actionData, amount);
        } else {
            actionCost = home.getCost(actionData, amountToBuy);
        }
        // disable button if resources can't be met
        let enableButton;
        if ($.isEmptyObject(actionCost)) {
            enableButton = true; // always enable free buttons
        } else {
            enableButton = res.checkResources(actionCost);
        }

        let label = actionData.name;
        if (!$.isEmptyObject(actionCost) && amount > 1) {
            label += " (" + sharktext.beautify(amount) + ")";
        }

        if (enableButton) {
            button.removeClass("disabled");
        } else {
            button.addClass("disabled");
        }

        // check for any infinite quantities
        if (_.some(actionCost, (cost) => cost === Infinity)) {
            label += "<br>Maxed out";
        } else {
            const costText = sharktext.resourceListToString(actionCost, !enableButton, sharkcolor.getElementColor(actionName, "background-color"));
            if (costText !== "") {
                label += "<br>Cost: " + costText;
            }
        }

        label = $('<span id="' + actionName + 'Label" class="click-passthrough">' + label + "</span>");

        // Only redraw the whole button when necessary.
        // This is necessary when buttons are new, or the icon setting has been changed.
        // We can detect both cases for the icon-on settings by making sure we have an icon
        // class that matches the setting.
        // The icon-off setting is a little trickier.  It needs two cases.  We check for a lack of spans to
        // see if the button is new, then check for the presence of any icon to see if the setting changed.
        if (button.html().includes("button-icon") !== SharkGame.Settings.current.showIcons) {
            button.html(label);

            let spritename;
            switch (actionName) {
                case "getUrchin":
                    spritename = Math.random() < 0.002 ? "actions/getUrchinHatted" : "actions/getUrchin";
                    break;
                default:
                    spritename = "actions/" + actionName;
            }
            if (SharkGame.Settings.current.showIcons) {
                const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "general/missing-action");
                if (iconDiv) {
                    iconDiv.addClass("button-icon");
                    button.prepend(iconDiv);
                }
            }
        } else {
            // The button already exists, so don't waste time drawing the icon.
            // Only redraw the label, and even then only if it's changed.
            const labelSpan = $("#" + actionName + "Label");

            // Quote-insensitive comparison, because the helper methods beautify the labels using single quotes
            // but jquery returns the same elements back with double quotes.
            if (label.html() !== labelSpan.html()) {
                labelSpan.html(label.html());
            }
        }
    },

    areActionPrereqsMet(actionName) {
        const action = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName);
        if (action.unauthorized) {
            return false;
        }
        // check to see if this action should be forcibly removed
        if (action.removedBy && home.shouldRemoveHomeButton(action)) {
            return false;
        }

        // check resource prerequisites
        if (action.prereq.resource && !res.checkResources(action.prereq.resource, true)) {
            return false;
        }

        // check if resource cost exists
        if (!_.every(action.cost, (cost) => world.doesResourceExist(cost.resource))) {
            return false;
        }

        // check special worldtype prereqs
        if (action.prereq.world && world.worldType !== action.prereq.world) {
            return false;
        }

        // check the special worldtype exclusions
        if (action.prereq.notWorlds && action.prereq.notWorlds.includes(world.worldType)) {
            return false;
        }

        // check upgrade prerequisites
        if (!_.every(action.prereq.upgrade, (upgradeId) => SharkGame.Upgrades.purchased.includes(upgradeId))) {
            return false;
        }
        // check if resulting resource exists
        if (!_.every(action.effect.resource, (_amount, resourceId) => world.doesResourceExist(resourceId))) {
            return false;
        }
        // if nothing fails, return true
        return true;
    },

    shouldRemoveHomeButton(action) {
        let disable = false;
        // eslint-disable-next-line id-length
        $.each(action.removedBy, (kind, by) => {
            switch (kind) {
                case "otherActions":
                    disable ||= _.some(by, (otherAction) => home.areActionPrereqsMet(otherAction));
                    break;
                case "upgrades":
                    disable ||= _.some(by, (upgrade) => SharkGame.Upgrades.purchased.includes(upgrade));
                    break;
            }
        });
        return disable;
    },

    addButton(actionName) {
        const buttonListSel = $("#buttonList");
        const actionData = SharkGame.HomeActions.getActionTable()[actionName];

        const buttonSelector = SharkGame.Button.makeHoverscriptButton(
            actionName,
            actionData.name,
            buttonListSel,
            home.onHomeButton,
            home.onHomeHover,
            home.onHomeUnhover
        );
        buttonSelector.html($("<span id='" + actionName + "Label' class='click-passthrough'></span>"));
        home.updateButton(actionName);
        if (SharkGame.Settings.current.showAnimations) {
            buttonSelector.hide().css("opacity", 0).slideDown(50).animate({ opacity: 1.0 }, 50);
        }
        if (actionData.newlyDiscovered) {
            buttonSelector.addClass("newlyDiscovered");
        }
    },

    getActionCategory(actionName) {
        return _.findKey(SharkGame.HomeActionCategories, (category) => {
            return _.some(category.actions, (action) => action === actionName);
        });
    },

    onHomeButton() {
        const amountToBuy = sharkmath.getBuyAmount();
        // get related entry in home button table
        const button = $(this);
        if (button.hasClass("disabled")) return;
        const actionName = button.attr("id");
        const action = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName);
        let actionCost = {};
        let amount = 0;
        if (amountToBuy < 0) {
            // unlimited mode, calculate the highest we can go
            const max = Math.floor(home.getMax(action));
            // floor max
            if (max > 0) {
                // convert divisor from a negative number to a positive fraction
                const divisor = 1 / (Math.floor(amountToBuy) * -1);
                amount = max * divisor;
                // floor amount
                amount = Math.floor(amount);
                // make it worth entering this function
                if (amount < 1) amount = 1;
                actionCost = home.getCost(action, amount);
            }
        } else {
            actionCost = home.getCost(action, amountToBuy);
            amount = amountToBuy;
        }

        if ($.isEmptyObject(actionCost)) {
            // free action
            // do not repeat or check for costs
            if (action.effect.resource) {
                res.changeManyResources(action.effect.resource);
            }
            log.addMessage(SharkGame.choose(action.outcomes));
        } else if (amount > 0) {
            // cost action
            // check cost, only proceed if sufficient resources (prevention against lazy cheating, god, at least cheat in the right resources)
            if (res.checkResources(actionCost)) {
                // take cost
                res.changeManyResources(actionCost, true);
                // execute effects
                if (action.effect.resource) {
                    let resourceChange;
                    if (amount !== 1) {
                        resourceChange = res.scaleResourceList(action.effect.resource, amount);
                    } else {
                        resourceChange = action.effect.resource;
                    }
                    res.changeManyResources(resourceChange);
                }
                // print outcome to log
                if (!action.multiOutcomes || amount === 1) {
                    log.addMessage(SharkGame.choose(action.outcomes));
                } else {
                    log.addMessage(SharkGame.choose(action.multiOutcomes));
                }
            } else {
                log.addMessage("You can't afford that!");
            }
        }
        if (button.hasClass("newlyDiscovered")) {
            SharkGame.HomeActions.getActionTable()[actionName].newlyDiscovered = false;
            button.removeClass("newlyDiscovered");
        }
        // disable button until next frame
        button.addClass("disabled");
    },

    onHomeHover(_mouseEnterEvent, actionName) {
        if (!SharkGame.Settings.current.showTooltips) {
            return;
        }
        if (!actionName) {
            const button = $(this);
            actionName = button.attr("id");
        }
        const effects = SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName).effect;
        const validGenerators = {};
        $.each(effects.resource, (resource) => {
            $.each(SharkGame.ResourceMap.get(resource).income, (incomeResource) => {
                const genAmount = res.getProductAmountFromGeneratorResource(resource, incomeResource, 1);
                if (genAmount !== 0 && world.doesResourceExist(incomeResource)) {
                    validGenerators[incomeResource] = genAmount;
                }
            });
        });

        let buyingHowMuch = 1;
        if (!SharkGame.Settings.current.alwaysSingularTooltip) {
            buyingHowMuch = sharkmath.getPurchaseAmount(
                "doesntmatter",
                home.getMax(SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionName))
            );
            if (buyingHowMuch < 1) {
                buyingHowMuch = 1;
            }
        }

        const usePlural = buyingHowMuch > 1 || _.keys(effects.resource).length > 1 || _.some(effects.resource, (amount) => amount > 1);
        let addedAnyLabelsYet = false; // this keeps track of whether or not little tooltip text has already been appended

        // append valid stuff for generators like production
        let text = "";

        if (_.some(validGenerators, (amount) => amount > 0)) {
            addedAnyLabelsYet = true;
            text += "<span class='littleTooltipText'>PRODUCE" + (usePlural ? "" : "S") + "</span><br/>";
        }

        $.each(validGenerators, (incomeResource, amount) => {
            if (amount > 0) {
                text +=
                    sharktext
                        .beautifyIncome(
                            buyingHowMuch * amount,
                            " " +
                                sharktext.getResourceName(incomeResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color"))
                        )
                        .bold() + "<br/>";
            }
        });

        if (_.some(validGenerators, (amount) => amount < 0)) {
            addedAnyLabelsYet = true;
            text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "and " : "") + "CONSUME" + (usePlural ? "" : "S") + "</span><br/>";
        }

        $.each(validGenerators, (incomeResource, amount) => {
            if (amount < 0) {
                text +=
                    sharktext
                        .beautifyIncome(
                            -buyingHowMuch * amount,
                            " " +
                                sharktext.getResourceName(incomeResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color"))
                        )
                        .bold() + "<br/>";
            }
        });

        const condensedObject = res.condenseNode(effects.resource);

        if (!$.isEmptyObject(condensedObject.resAffect.increase)) {
            text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "and " : "") + "INCREASE" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.resAffect.increase, (affectedResource, degreePerPurchase) => {
                text +=
                    sharktext.boldString("all ") +
                    sharktext.getResourceName(affectedResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" gains ") +
                    " by " +
                    sharktext.boldString(Math.round(buyingHowMuch * degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.resAffect.decrease)) {
            text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "and " : "") + "DECREASE" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.resAffect.decrease, (affectedResource, degreePerPurchase) => {
                text +=
                    sharktext.boldString("all ") +
                    sharktext.getResourceName(affectedResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" gains ") +
                    " by " +
                    sharktext.boldString(Math.round(buyingHowMuch * degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.resAffect.multincrease)) {
            text +=
                "<span class='littleTooltipText'>" +
                (addedAnyLabelsYet ? "and " : "") +
                "MULTIPLICATIVELY INCREASE" +
                (usePlural ? "" : "S") +
                "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.resAffect.multincrease, (affectedResource, degreePerPurchase) => {
                degreePerPurchase = degreePerPurchase ** buyingHowMuch - 1;
                text +=
                    sharktext.boldString("all ") +
                    sharktext.getResourceName(affectedResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" gains ") +
                    " by " +
                    sharktext.boldString(Math.round(degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.resAffect.multdecrease)) {
            text +=
                "<span class='littleTooltipText'>" +
                (addedAnyLabelsYet ? "and " : "") +
                "MULTIPLICATIVELY DECREASE" +
                (usePlural ? "" : "S") +
                "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.resAffect.multdecrease, (affectedResource, degreePerPurchase) => {
                degreePerPurchase = 1 - degreePerPurchase ** buyingHowMuch;
                text +=
                    sharktext.boldString("all ") +
                    sharktext.getResourceName(affectedResource, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" gains ") +
                    " by " +
                    sharktext.boldString(Math.round(degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.genAffect.increase)) {
            text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "and " : "") + "INCREASE" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.genAffect.increase, (affectedGenerator, degreePerPurchase) => {
                text +=
                    sharktext.getResourceName(affectedGenerator, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" income ") +
                    " by " +
                    sharktext.boldString(Math.round(buyingHowMuch * degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.genAffect.decrease)) {
            text += "<span class='littleTooltipText'>" + (addedAnyLabelsYet ? "and " : "") + "DECREASE" + (usePlural ? "" : "S") + "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.genAffect.decrease, (affectedGenerator, degreePerPurchase) => {
                text +=
                    sharktext.getResourceName(affectedGenerator, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" income ") +
                    " by " +
                    sharktext.boldString(Math.round(buyingHowMuch * degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.genAffect.multincrease)) {
            text +=
                "<span class='littleTooltipText'>" +
                (addedAnyLabelsYet ? "and " : "") +
                "MULTIPLICATIVELY INCREASE" +
                (usePlural ? "" : "S") +
                "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.genAffect.multincrease, (affectedGenerator, degreePerPurchase) => {
                degreePerPurchase = degreePerPurchase ** buyingHowMuch - 1;
                text +=
                    sharktext.getResourceName(affectedGenerator, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" income ") +
                    " by " +
                    sharktext.boldString(Math.round(degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (!$.isEmptyObject(condensedObject.genAffect.multdecrease)) {
            text +=
                "<span class='littleTooltipText'>" +
                (addedAnyLabelsYet ? "and " : "") +
                "MULTIPLICATIVELY DECREASE" +
                (usePlural ? "" : "S") +
                "</span><br/>";
            addedAnyLabelsYet = true;
            $.each(condensedObject.genAffect.multdecrease, (affectedGenerator, degreePerPurchase) => {
                degreePerPurchase = 1 - degreePerPurchase ** buyingHowMuch;
                text +=
                    sharktext.getResourceName(affectedGenerator, false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    sharktext.boldString(" income ") +
                    " by " +
                    sharktext.boldString(Math.round(degreePerPurchase * 100) + "%") +
                    "<br>";
            });
        }

        if (SharkGame.HomeActions.getActionTable()[actionName].helpText) {
            text +=
                "<hr class='hrForTooltipSeparation'><span class='medDesc'>" + SharkGame.HomeActions.getActionTable()[actionName].helpText + "</span>";
        }

        $.each(effects.resource, (resource, amount) => {
            if (buyingHowMuch * amount !== 1) {
                text =
                    sharktext.beautify(buyingHowMuch * amount).bold() +
                    " " +
                    sharktext
                        .getResourceName(resource, false, buyingHowMuch * amount, sharkcolor.getElementColor("tooltipbox", "background-color"))
                        .bold() +
                    "<br>" +
                    (SharkGame.Settings.current.tooltipQuantityReminders
                        ? "<span class='medDesc littleTooltipText'>(you have " + sharktext.beautify(res.getResource(resource)) + ")</span><br>"
                        : "") +
                    text;
            } else {
                const determiner = sharktext.getDeterminer(resource);
                text =
                    (determiner ? determiner + " " : "") +
                    sharktext.getResourceName(resource, false, 1, sharkcolor.getElementColor("tooltipbox", "background-color")).bold() +
                    "<br>" +
                    (SharkGame.Settings.current.tooltipQuantityReminders
                        ? "<span class='medDesc littleTooltipText'>(you have " + sharktext.beautify(res.getResource(resource)) + ")</span><br>"
                        : "") +
                    text;
            }
        });

        if (document.getElementById("tooltipbox").innerHTML !== text.replace(/'/g, '"')) {
            document.getElementById("tooltipbox").innerHTML = text;
        }
        $("#tooltipbox").removeClass("forIncomeTable").attr("current", "");
        $("#tooltipbox").addClass("forHomeButtonOrGrotto").attr("current", actionName);
    },

    onHomeUnhover() {
        document.getElementById("tooltipbox").innerHTML = "";
        $("#tooltipbox").removeClass("forHomeButtonOrGrotto").attr("current", "");
    },

    getCost(action, amount) {
        const calcCost = {};
        const rawCost = action.cost;

        _.each(rawCost, (costObj) => {
            const resource = SharkGame.PlayerResources.get(action.max);
            const currAmount = resource.amount;
            const priceIncrease = costObj.priceIncrease;
            let cost = 0;
            switch (costObj.costFunction) {
                case "constant":
                    cost = sharkmath.constantCost(currAmount, currAmount + amount, priceIncrease);
                    break;
                case "linear":
                    cost = sharkmath.linearCost(currAmount, currAmount + amount, priceIncrease);
                    break;
                case "unique":
                    cost = sharkmath.uniqueCost(currAmount, currAmount + amount, priceIncrease);
                    break;
            }
            if (Math.abs(cost - Math.round(cost)) < SharkGame.EPSILON) {
                cost = Math.round(cost);
            }
            calcCost[costObj.resource] = cost;
        });
        return calcCost;
    },

    getMax(action) {
        let max = 1;
        if (action.max) {
            // max is used as the determining resource for linear cost functions
            const resource = SharkGame.PlayerResources.get(action.max);
            const currAmount = resource.amount;
            max = Number.MAX_VALUE;
            _.each(action.cost, (costObject) => {
                const costResource = SharkGame.PlayerResources.get(costObject.resource).amount;
                const priceIncrease = costObject.priceIncrease;

                let subMax = -1;
                switch (costObject.costFunction) {
                    case "constant":
                        subMax = sharkmath.constantMax(0, costResource, priceIncrease);
                        break;
                    case "linear":
                        subMax = sharkmath.linearMax(currAmount, costResource, priceIncrease) - currAmount;
                        break;
                    case "unique":
                        subMax = sharkmath.uniqueMax(currAmount, costResource, priceIncrease) - currAmount;
                        break;
                }
                // prevent flashing action costs
                if (Math.abs(subMax - Math.round(subMax)) < SharkGame.EPSILON) {
                    subMax = Math.round(subMax);
                }
                max = Math.min(max, subMax);
            });
        }
        return Math.floor(max);
    },
};

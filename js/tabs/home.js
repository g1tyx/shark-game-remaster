SharkGame.Home = {
    tabId: "home",
    tabDiscovered: true,
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
                    "The dolphin pods that work with us speak of an star-spanning empire of their kind.<br>They ask where our empire is. And they smile.",
            },
            {
                name: "haven-papyrus",
                unlock: { upgrade: ["sunObservation"] },
                message: "Pieces of strange, crunchy kelp have begun washing up in the currents.<br/>Something is carved into them.",
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
                    "The grand sum of all dolphin knowledge is laid out before us -<br/> and it is pitifully small. The original collections have been lost to time.",
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
                unlock: { resource: { octopus: 1 } },
                message: "The octopus works tirelessly.",
            },
            {
                name: "abandoned-octopuses",
                unlock: { resource: { octopus: 2 } },
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
                message: "This gate stands inert and lifeless like the city around it.<br>But the slots are already filled.",
            },
            {
                name: "abandoned-reverse-engineering",
                unlock: { upgrade: ["reverseEngineering"] },
                message: "The components spin and whirr and click together, but their purpose eludes us.<br>What secrets are you hiding, parts?",
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
                message:
                    "The cold here seeps through you. There are giant boulders of ice on the horizon. They surround your field of view.<br>There is a quiet hum in the water.",
            },
            {
                name: "frigid-distant-village",
                unlock: { totalResource: { scientist: 1 } },
                message: "While scanning the horizon, you notice some weird outcroppings in the distance.<br>What is that supposed to be??",
            },
            {
                name: "frigid-village",
                unlock: { upgrade: ["activeInvestigation"] },
                message: "A colony of squid greets you respectfully.<br>Many small structures form the basis of a tiny village.",
            },
            {
                name: "frigid-machine",
                unlock: { totalResource: { squid: 25 } },
                message:
                    "In the center of the settlement lies a stone structure containing a small, dilapidated structure.<br>One part is a gate, the other, a small box.<br>The box hums loudly. It warms you from the inside.",
            },
            {
                name: "frigid-squid",
                unlock: { totalResource: { squid: 75 } },
                message:
                    "The squid speak of an ancient visitor. They say this visitor was the one who saved their world.<br>They ask if you too, have seen this visitor.",
            },
            {
                name: "frigid-urchin",
                unlock: { totalResource: { urchin: 25 } },
                message:
                    "The urchins scuttle along the ground, gathering kelp into a massive pile.<br>They know nothing else. To them, there is only food.",
            },
            {
                name: "frigid-mechanical-failure",
                unlock: { upgrade: ["automation"], totalResource: { crystalMiner: 1 } },
                message: "The squid interrupt you as the first miners begin drilling.<br>They say something is wrong with the great machine.",
            },
            {
                name: "frigid-blast",
                unlock: { upgrade: ["haventdecided"] },
                message: "A sudden, frigid blast overtakes you, and all the heat is sucked from your body.<br>The background hum disappears.",
            },
            {
                name: "frigid-ice-one",
                unlock: { resource: { ice: 25 } },
                message: "The water around you begins to crystallize as shards of ice appear on every surface in view.",
            },
            {
                name: "frigid-ice-two",
                unlock: { resource: { ice: 200 } },
                message: "As the ice shelf advances, some of the frenzy have stopped sleeping.<br>They fear they might not wake back up.",
            },
            {
                name: "frigid-icy-doom",
                unlock: { resource: { ice: 800 } },
                message: "So cold. So hungry.<br><span class='smallDesc'>So hopeless.</span>",
            },
            {
                name: "frigid-heat-returns",
                unlock: { upgrade: ["rapidRepairs"] },
                message:
                    "The machine comes to life, and a wave of heat washes over you.<br>The glassy shards of ice disappear from the water, and the glaciers begin to recede.",
            },
            {
                name: "frigid-end",
                unlock: { upgrade: ["rapidRepairs"] },
                message: "The gate, filled once again, comes to life alongside the whirring machine.",
            },
        ],
        /*
        {
            message: "The water glows here.<br>It feels familiar.",
        },
        {
            message:
                "The jagged seafloor looks ancient, yet pristine.<br>Sponges thrive in great numbers on the rocks.",
        },
        */
    },

    init() {
        // rename home tab
        const tabName = SharkGame.WorldTypes[w.worldType].name + " Ocean";
        h.tabName = tabName;

        // register tab
        SharkGame.Tabs[h.tabId] = {
            id: h.tabId,
            name: h.tabName,
            discovered: h.tabDiscovered,
            code: h,
            discoverReq: [],
        };
        // populate action discoveries (and reset removals)
        _.each(SharkGame.HomeActions.getActionTable(), (actionData) => {
            actionData.discovered = false;
            actionData.newlyDiscovered = false;
            actionData.isRemoved = false;
        });

        h.currentExtraMessageIndex = -1;
        h.currentButtonTab = "all";
    },

    switchTo() {
        const content = $("#content");
        const tabMessage = $("<div>").attr("id", "tabMessage");
        content.append(tabMessage);
        h.currentExtraMessageIndex = -1;
        h.updateMessage(true);
        // button tabs
        const buttonTabDiv = $("<div>").attr("id", "homeTabs");
        content.append(buttonTabDiv);
        h.createButtonTabs();
        // help button
        const helpButtonDiv = $("<div>");
        helpButtonDiv.css({ margin: "auto", clear: "both" });
        SharkGame.Button.makeButton("helpButton", "Toggle hover descriptions", helpButtonDiv, h.toggleHelp).addClass("min-block");
        content.append(helpButtonDiv);
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
            tabMessage.css("background-image", "url('" + h.tabBg + "')");
        }
    },

    discoverActions() {
        $.each(SharkGame.HomeActions.getActionTable(), (actionName, actionData) => {
            actionData.discovered = h.areActionPrereqsMet(actionName);
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
            const onThisTab = h.currentButtonTab === categoryName;

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
                                h.changeButtonTab(tab);
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
        if (h.currentButtonTab === "all") {
            return;
        }
        SharkGame.HomeActionCategories[tabToUpdate].hasNewItem = true;
        const tabItem = $("#buttonTab-" + tabToUpdate);
        if (tabItem.length > 0) {
            tabItem.parent().addClass("newItemAdded");
        } else {
            h.createButtonTabs();
        }
    },

    changeButtonTab(tabToChangeTo) {
        SharkGame.HomeActionCategories[tabToChangeTo].hasNewItem = false;
        if (tabToChangeTo === "all") {
            _.each(SharkGame.HomeActionCategories, (category) => {
                category.hasNewItem = false;
            });
        }
        h.currentButtonTab = tabToChangeTo;
        $("#buttonList").empty();
        h.createButtonTabs();
    },

    updateMessage(suppressAnimation) {
        const wi = SharkGame.WorldTypes[w.worldType];
        const events = h.extraMessages[w.worldType];

        const selectedIndex = _.findLastIndex(events, (extraMessage) => {
            // check if all requirements met
            if (_.has(extraMessage, "unlock")) {
                let requirementsMet = true;
                requirementsMet &&= _.every(
                    extraMessage.unlock.resource,
                    (requiredAmount, resourceId) => r.getResource(resourceId) >= requiredAmount
                );
                requirementsMet &&= _.every(
                    extraMessage.unlock.totalResource,
                    (requiredAmount, resourceId) => r.getTotalResource(resourceId) >= requiredAmount
                );
                requirementsMet &&= _.every(extraMessage.unlock.upgrade, (upgradeId) => SharkGame.Upgrades.purchased.includes(upgradeId));
                requirementsMet &&= _.every(extraMessage.unlock.homeAction, (actionName) => {
                    const action = SharkGame.HomeActions.getActionTable()[actionName];
                    return action.discovered && !action.newlyDiscovered;
                });
                return requirementsMet;
            }
            return true;
        });

        // only edit DOM if necessary
        if (h.currentExtraMessageIndex !== selectedIndex) {
            h.currentExtraMessageIndex = selectedIndex;
            const messageData = events[selectedIndex];
            const tabMessage = $("#tabMessage");
            let sceneDiv;
            if (SharkGame.Settings.current.showTabImages) {
                sceneDiv = $("#tabSceneImage");
                if (sceneDiv.size() === 0) {
                    sceneDiv = $("<div>").attr("id", "tabSceneImage");
                }
            }
            let message = "You are a shark in a " + wi.shortDesc + " sea.";
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
            const actionTab = h.getActionCategory(actionName);
            const onTab = actionTab === h.currentButtonTab || h.currentButtonTab === "all";
            if (onTab && !actionData.isRemoved) {
                const button = $("#" + actionName);
                if (button.length === 0) {
                    if (actionData.discovered || h.areActionPrereqsMet(actionName)) {
                        if (!actionData.discovered) {
                            actionData.discovered = true;
                            actionData.newlyDiscovered = true;
                        }
                        h.addButton(actionName);
                    }
                } else {
                    // button exists
                    h.updateButton(actionName);
                }
            } else {
                if (!actionData.discovered) {
                    if (h.areActionPrereqsMet(actionName)) {
                        actionData.discovered = true;
                        actionData.newlyDiscovered = true;
                        h.updateTab(actionTab);
                    }
                }
            }
        });

        // update home message
        h.updateMessage();

        // update hovering messages
        if (document.getElementById("tooltipbox").className.split(" ").includes("forHomeButton")) {
            if (document.getElementById("tooltipbox").attributes.current) {
                h.onHomeHover(null, document.getElementById("tooltipbox").attributes.current.value);
            }
        }
    },

    updateButton(actionName) {
        const amountToBuy = m.getBuyAmount();

        const button = $("#" + actionName);
        const actionData = SharkGame.HomeActions.getActionTable()[actionName];

        if (actionData.removedBy) {
            if (h.shouldRemoveHomeButton(actionData)) {
                button.remove();
                actionData.isRemoved = true;
                actionData.discovered = true;
                return;
            }
        }
        let amount = amountToBuy;
        let actionCost;
        if (amountToBuy < 0) {
            const max = Math.floor(h.getMax(actionData));
            // convert divisor from a negative number to a positive fraction
            const divisor = 1 / (Math.floor(amountToBuy) * -1);
            amount = max * divisor;
            amount = Math.floor(amount);
            if (amount < 1) amount = 1;
            actionCost = h.getCost(actionData, amount);
        } else {
            actionCost = h.getCost(actionData, amountToBuy);
        }
        // disable button if resources can't be met
        let enableButton;
        if ($.isEmptyObject(actionCost)) {
            enableButton = true; // always enable free buttons
        } else {
            enableButton = r.checkResources(actionCost);
        }

        let label = actionData.name;
        if (!$.isEmptyObject(actionCost) && amount > 1) {
            label += " (" + m.beautify(amount) + ")";
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
            const costText = r.resourceListToString(actionCost, !enableButton, SharkGame.getElementColor(actionName, "background-color"));
            if (costText !== "") {
                label += "<br>Cost: " + costText;
            }
        }

        /*
        if (document.querySelector("#wrapper button.hoverbutton:hover") === null) {
            h.onHomeUnhover();
        }
        */

        label = $('<span id="' + actionName + 'Label" class="click-passthrough">' + label + "</span>");

        // Only redraw the whole button when necessary.
        // This is necessary when buttons are new, or the icon setting has been changed.
        // We can detect both cases for the icon-on settings by making sure we have an icon
        // class that matches the setting.
        // The icon-off setting is a little trickier.  It needs two cases.  We check for a lack of spans to
        // see if the button is new, then check for the presence of any icon to see if the setting changed.
        if (button.html().includes("button-icon") !== SharkGame.Settings.current.showIcons) {
            button.html(label);

            const spritename = "actions/" + actionName;
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
        let prereqsMet = true; // assume true until proven false
        const action = SharkGame.HomeActions.getActionTable()[actionName];
        if (action.unauthorized) {
            return false;
        }
        // check to see if this action should be forcibly removed
        if (action.removedBy) {
            prereqsMet = !h.shouldRemoveHomeButton(action);
        }

        // check resource prerequisites
        if (action.prereq.resource) {
            prereqsMet &&= r.checkResources(action.prereq.resource, true);
        }

        // check if resource cost exists
        prereqsMet &&= _.every(action.cost, (cost) => w.doesResourceExist(cost.resource));

        // check special worldtype prereqs
        if (action.prereq.world) {
            prereqsMet &&= w.worldType === action.prereq.world;
        }

        // check the special worldtype exclusions
        if (action.prereq.notWorlds) {
            prereqsMet &&= !action.prereq.notWorlds.includes(w.worldType);
        }

        const upgradeTable = SharkGame.Upgrades.getUpgradeTable();

        // check upgrade prerequisites
        _.each(action.prereq.upgrade, (upgradeId) => {
            if (upgradeTable[upgradeId]) {
                prereqsMet &&= SharkGame.Upgrades.purchased.includes(upgradeId);
            } else {
                prereqsMet = false;
            }
        });
        // check if resulting resource exists
        $.each(action.effect.resource, (k) => {
            prereqsMet = prereqsMet && w.doesResourceExist(k);
        });
        return prereqsMet;
    },

    shouldRemoveHomeButton(action) {
        let disable = false;
        $.each(action.removedBy, (kind, by) => {
            switch (kind) {
                case "otherActions":
                    disable ||= _.some(by, (otherAction) => h.areActionPrereqsMet(otherAction));
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
            h.onHomeButton,
            h.onHomeHover,
            h.onHomeUnhover
        );
        h.updateButton(actionName);
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
        const amountToBuy = m.getBuyAmount();
        // get related entry in home button table
        const button = $(this);
        if (button.hasClass("disabled")) return;
        const buttonName = button.attr("id");
        const action = SharkGame.HomeActions.getActionTable()[buttonName];
        let actionCost = {};
        let amount = 0;
        if (amountToBuy < 0) {
            // unlimited mode, calculate the highest we can go
            const max = Math.floor(h.getMax(action));
            // floor max
            if (max > 0) {
                // convert divisor from a negative number to a positive fraction
                const divisor = 1 / (Math.floor(amountToBuy) * -1);
                amount = max * divisor;
                // floor amount
                amount = Math.floor(amount);
                // make it worth entering this function
                if (amount < 1) amount = 1;
                actionCost = h.getCost(action, amount);
            }
        } else {
            actionCost = h.getCost(action, amountToBuy);
            amount = amountToBuy;
        }

        if ($.isEmptyObject(actionCost)) {
            // free action
            // do not repeat or check for costs
            if (action.effect.resource) {
                r.changeManyResources(action.effect.resource);
            }
            SharkGame.Log.addMessage(SharkGame.choose(action.outcomes));
        } else if (amount > 0) {
            // cost action
            // check cost, only proceed if sufficient resources (prevention against lazy cheating, god, at least cheat in the right resources)
            if (r.checkResources(actionCost)) {
                // take cost
                r.changeManyResources(actionCost, true);
                // execute effects
                if (action.effect.resource) {
                    let resourceChange;
                    if (amount !== 1) {
                        resourceChange = r.scaleResourceList(action.effect.resource, amount);
                    } else {
                        resourceChange = action.effect.resource;
                    }
                    r.changeManyResources(resourceChange);
                }
                // print outcome to log
                if (!action.multiOutcomes || amount === 1) {
                    SharkGame.Log.addMessage(SharkGame.choose(action.outcomes));
                } else {
                    SharkGame.Log.addMessage(SharkGame.choose(action.multiOutcomes));
                }
            } else {
                SharkGame.Log.addMessage("You can't afford that!");
            }
        }
        if (button.hasClass("newlyDiscovered")) {
            action.newlyDiscovered = false;
            button.removeClass("newlyDiscovered");
        }
        // disable button until next frame
        button.addClass("disabled");
    },

    onHomeHover(_mouseEnterEvent, actionName) {
        if (!SharkGame.Settings.current.showTabHelp) {
            return;
        }
        if (!actionName) {
            const button = $(this);
            actionName = button.attr("id");
        }
        const effects = SharkGame.HomeActions.getActionTable()[actionName].effect;
        const validGenerators = {};
        if (effects.resource) {
            $.each(effects.resource, (resource) => {
                if (SharkGame.ResourceMap.get(resource).income) {
                    $.each(SharkGame.ResourceMap.get(resource).income, (incomeResource) => {
                        const genAmount = r.getProductAmountFromGeneratorResource(resource, incomeResource, 1);
                        if (genAmount !== 0 && w.doesResourceExist(incomeResource)) {
                            validGenerators[incomeResource] = genAmount;
                        }
                    });
                }
            });
        }

        let appendedProduce = false;
        let appendedConsume = false;
        let appendedMultiply = false;
        let text = "";

        $.each(validGenerators, (incomeResource, amount) => {
            if (amount > 0) {
                if (!appendedProduce) {
                    appendedProduce = true;
                    text += "<span class='littleTooltipText'>PRODUCES</span><br/>";
                }
                text +=
                    m
                        .beautifyIncome(
                            amount,
                            " " + r.getResourceName(incomeResource, false, false, false, SharkGame.getElementColor("tooltipbox", "background-color"))
                        )
                        .bold() + "<br/>";
            }
        });

        $.each(validGenerators, (incomeResource, amount) => {
            if (amount < 0) {
                if (!appendedConsume) {
                    appendedConsume = true;
                    text += "<span class='littleTooltipText'>CONSUMES</span><br/>";
                }
                text +=
                    m
                        .beautifyIncome(
                            -amount,
                            " " + r.getResourceName(incomeResource, false, false, false, SharkGame.getElementColor("tooltipbox", "background-color"))
                        )
                        .bold() + "<br/>";
            }
        });

        $.each(effects.resource, (resource) => {
            $.each(SharkGame.ResourceIncomeAffectors[resource], (type, object) => {
                $.each(object, (affected, degree) => {
                    if (type === "multiply") {
                        if (!appendedMultiply) {
                            appendedMultiply = true;
                            if (degree > 0) {
                                text += "<span class='littleTooltipText'>INCREASES</span><br/>";
                            } else {
                                text += "<span class='littleTooltipText'>DECREASES</span><br/>";
                            }
                        }
                        text +=
                            "all ".bold() +
                            r.getResourceName(affected, false, false, false, SharkGame.getElementColor("tooltipbox", "background-color")) +
                            " gains ".bold() +
                            " by " +
                            (Math.round(degree * 100) + "%").bold() +
                            " each<br>";
                    }
                });
            });
        });

        if (SharkGame.HomeActions.getActionTable()[actionName].helpText) {
            text += "<span class='medDesc'>" + SharkGame.HomeActions.getActionTable()[actionName].helpText + "</span>";
        }

        $.each(effects.resource, (resource, amount) => {
            if (amount !== 1) {
                text =
                    m.beautify(amount).bold() +
                    " " +
                    r.getResourceName(resource, false, true, false, SharkGame.getElementColor("tooltipbox", "background-color")).bold() +
                    "<br>" +
                    text;
            } else {
                const determiner = m.getDeterminer(resource);
                text =
                    (determiner ? determiner + " " : "") +
                    r.getResourceName(resource, false, true, false, SharkGame.getElementColor("tooltipbox", "background-color")).bold() +
                    "<br>" +
                    text;
            }
        });

        if (document.getElementById("tooltipbox").innerHTML !== text.replace(/'/g, '"')) {
            document.getElementById("tooltipbox").innerHTML = text;
        }
        $("#tooltipbox").addClass("forHomeButton").attr("current", actionName);
    },

    onHomeUnhover() {
        document.getElementById("tooltipbox").innerHTML = "";
        $("#tooltipbox").removeClass("forHomeButton").attr("current", "");
    },

    getCost(action, amount) {
        const calcCost = {};
        const rawCost = action.cost;

        _.each(rawCost, (costObj) => {
            const resource = SharkGame.PlayerResources.get(action.max);
            let currAmount = resource.amount;
            if (resource.jobs) {
                _.each(resource.jobs, (v) => {
                    currAmount += r.getResource(v);
                });
            }
            const k = costObj.priceIncrease;
            let cost = 0;
            switch (costObj.costFunction) {
                case "constant":
                    cost = SharkGame.MathUtil.constantCost(currAmount, currAmount + amount, k);
                    break;
                case "linear":
                    cost = SharkGame.MathUtil.linearCost(currAmount, currAmount + amount, k);
                    break;
                case "unique":
                    cost = SharkGame.MathUtil.uniqueCost(currAmount, currAmount + amount, k);
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
            // max is really ambiguous
            // its used as the determining resource for linear cost functions
            const resource = SharkGame.PlayerResources.get(action.max);
            let currAmount = resource.amount;
            _.each(resource.jobs, (job) => {
                currAmount += r.getResource(job);
            });
            max = Number.MAX_VALUE;
            _.each(action.cost, (costObject) => {
                const costResource = SharkGame.PlayerResources.get(costObject.resource).amount;
                const k = costObject.priceIncrease;

                let subMax = -1;
                switch (costObject.costFunction) {
                    case "constant":
                        subMax = SharkGame.MathUtil.constantMax(0, costResource, k);
                        break;
                    case "linear":
                        subMax = SharkGame.MathUtil.linearMax(currAmount, costResource, k) - currAmount;
                        break;
                    case "unique":
                        subMax = SharkGame.MathUtil.uniqueMax(currAmount, costResource, k) - currAmount;
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

    toggleHelp() {
        SharkGame.Settings.current.showTabHelp = !SharkGame.Settings.current.showTabHelp;
    },
};

"use strict";
SharkGame.Gate = {
    tabId: "gate",
    tabDiscovered: false,
    tabName: "Strange Gate",
    tabBg: "img/bg/bg-gate.png",

    discoverReq: {
        upgrade: ["gateDiscovery", "farAbandonedExploration", "farHavenExploration", "rapidRecharging"],
    },

    message: "A foreboding circular structure, closed shut.<br/>There are many slots, and a sign you know to mean 'insert items here'.",
    messageOneSlot: "A foreboding circular structure, closed shut.<br/>One slot remains.",
    messageOpened: "A foreboding circular structure, wide open.<br/>The water glows and shimmers within it. A gentle tug pulls at you.",
    messagePaid: "The slot accepts your donation and ceases to be.",
    messageCantPay: "The slot spits everything back out. You get the sense it wants more at once.",
    messagePaidNotOpen: "Every slot is filled, but the structure doesn't open.<br/>Perhaps it needs something else.",
    messageAllPaid: "The last slot closes. The structure opens. The water glows and shimmers within it.<br/>A gentle tug pulls at you.",
    messageEnter: "You swim through the gate...",

    sceneClosedImage: "img/events/misc/scene-gate-closed.png",
    sceneAlmostOpenImage: "img/events/misc/scene-gate-one-slot.png",
    sceneOpenImage: "img/events/misc/scene-gate-open.png",
    sceneClosedButFilledImage: "img/events/misc/scene-gate-closed-but-filled.png",

    requirements: {},
    completedRequirements: {},

    init() {
        const gate = SharkGame.Gate;
        // register tab
        SharkGame.Tabs[gate.tabId] = {
            id: gate.tabId,
            name: gate.tabName,
            discovered: gate.tabDiscovered,
            discoverReq: gate.discoverReq,
            code: gate,
        };
        gate.opened = false;
    },

    createSlots(gateRequirements, gateCostMultiplier) {
        const gate = SharkGame.Gate;
        gate.requirements = {};
        gate.completedRequirements = {};

        if (gateRequirements.slots) {
            gate.requirements.slots = {};
            gate.completedRequirements.slots = {};
            // create costs and costsMet
            $.each(gateRequirements.slots, (resourceId, requiredAmount) => {
                gate.requirements.slots[resourceId] = Math.floor(requiredAmount * gateCostMultiplier);
                gate.completedRequirements.slots[resourceId] = false;
            });
        }

        if (gateRequirements.upgrades) {
            gate.requirements.upgrades = {};
            gate.completedRequirements.upgrades = {};
            // FIXME: https://discord.com/channels/747861699486285974/795148648837021716/845279763077136424
            // "the way that i set up the system, it needs a key value pair later down the line, but it'll only use the key.
            // so i set the key to the name of the upgrade and then just make a placeholder value so that it sticks"
            $.each(gateRequirements.upgrades, (_index, upgradeId) => {
                gate.requirements.upgrades[upgradeId] = "__this_string_is_here_because_this_needs_to_be_an_object__";
                gate.completedRequirements.upgrades[upgradeId] = false;
            });
        }

        if (gateRequirements.resources) {
            gate.requirements.resources = {};
            gate.completedRequirements.resources = {};

            $.each(gateRequirements.resources, (resourceId, requiredAmount) => {
                gate.requirements.resources[resourceId] = requiredAmount;
                gate.completedRequirements.resources[resourceId] = false;
            });
        }
    },

    switchTo() {
        const gate = SharkGame.Gate;
        const content = $("#content");
        content.append($("<div>").attr("id", "tabMessage"));
        content.append($("<div>").attr("id", "buttonList"));

        SharkGame.Gate.getResourcesLeft();

        if (!gate.shouldBeOpen()) {
            if (SharkGame.WorldTypes[world.worldType].gateRequirements.slots) {
                const buttonList = $("#buttonList");
                $.each(gate.requirements.slots, (resource, requiredAmount) => {
                    if (!gate.completedRequirements.slots[resource]) {
                        const resourceName = res.getResourceName(resource, false, false, SharkGame.getElementColor("tooltipbox", "background-color"));
                        SharkGame.Button.makeHoverscriptButton(
                            "gateCost-" + resource,
                            "Insert " + main.beautify(requiredAmount) + " " + resourceName + " into " + resourceName + " slot",
                            buttonList,
                            gate.onGateButton,
                            gate.onHover,
                            gate.onUnhover
                        );
                    }
                });
            }
        } else {
            SharkGame.Button.makeButton("gateEnter", "Enter gate", $("#buttonList"), gate.onEnterButton);
        }

        let message = gate.getMessage();
        const tabMessageSel = $("#tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + gate.getSceneImagePath() + "' id='tabSceneImageEssence'>" + message;
            tabMessageSel.css("background-image", "url('" + gate.tabBg + "')");
        }
        tabMessageSel.html(message);
    },

    getMessage() {
        const gate = SharkGame.Gate;
        if (gate.shouldBeOpen()) {
            return gate.messageOpened;
        }

        const slotsLeft = gate.getSlotsLeft();
        const upgradesLeft = gate.getUpgradesLeft();
        const resourcesLeft = gate.getResourcesLeft();

        // this intentionally checks for !== false because if it is specifically false, then getSlotsLeft() found that this world has no slots
        if (slotsLeft !== false) {
            if (slotsLeft > 1) {
                return gate.message;
            } else if (slotsLeft === 1) {
                return gate.messageOneSlot;
            }
            // if we get here then slotsLeft somehow took on a value other than a positive integer or false
            // in this situation simply assume slotsLeft === 0 and continue with execution
        }

        // if there are no slots then see if there are any upgrades or resources needed
        if (upgradesLeft !== false || resourcesLeft !== false) {
            return gate.messagePaidNotOpen;
        }

        // if there are no upgrades needed, then that implies that there are no gate requirements
        // send an error to the log and return a debug message
        log.addError("No gate requirements found.");
        return "This is a failsafe message. Something has gone wrong internally.";
    },

    getSlotsLeft() {
        const gate = SharkGame.Gate;
        let incompleteSlots = 0;
        // counts up the number of slots which are *not* filled
        _.each(gate.completedRequirements.slots, (resource) => {
            incompleteSlots += resource ? 0 : 1;
        });

        // if there are any slots in the first place, return the number of slots unfilled
        // if there are not any slots, return false to identify this fact
        return _.size(gate.requirements.slots) !== 0 ? incompleteSlots : false;
    },

    getUpgradesLeft() {
        const gate = SharkGame.Gate;
        let incompleteUpgrades = 0;
        // counts up the number of required upgrades which are *not* purchased
        _.each(gate.completedRequirements.upgrades, (upgradeName) => {
            incompleteUpgrades += upgradeName ? 0 : 1;
        });

        // if there are any required upgrades in the first place, return the number of still required upgrades
        // if there are not any required upgrades, return false to identify this fact
        return _.size(gate.requirements.upgrades) === 0 ? incompleteUpgrades : false;
    },

    getResourcesLeft() {
        const gate = SharkGame.Gate;

        $.each(gate.completedRequirements.resources, (resource) => {
            gate.checkResourceRequirements(resource);
        });

        const remaining = [];
        $.each(gate.completedRequirements.resources, (resource, completed) => {
            if (completed) {
                remaining.push(resource);
            }
        });
        return remaining ? remaining : false;
    },

    onHover() {
        const gate = SharkGame.Gate;
        const button = $(this);
        const resourceName = button.attr("id").split("-")[1];
        const amount = res.getResource(resourceName);
        const required = gate.requirements.slots[resourceName];
        if (amount < required) {
            button.html(
                `Need <span class='click-passthrough' style='color:#FFDE0A'>${main.beautify(required - amount)}</span> more ${res.getResourceName(
                    resourceName,
                    false,
                    false,
                    SharkGame.getElementColor(button.attr("id"), "background-color")
                )} for ${res.getResourceName(resourceName, false, false, SharkGame.getElementColor(button.attr("id"), "background-color"))} slot`
            );
        }
    },

    onUnhover() {
        const gate = SharkGame.Gate;
        const button = $(this);
        const resourceName = button.attr("id").split("-")[1];
        const required = gate.requirements.slots[resourceName];
        button.html(
            "Insert " +
                main.beautify(required) +
                " " +
                res.getResourceName(resourceName, false, false, SharkGame.getElementColor(button.attr("id"), "background-color")) +
                " into " +
                res.getResourceName(resourceName, false, false, SharkGame.getElementColor(button.attr("id"), "background-color")) +
                " slot"
        );
    },

    update() {},

    onGateButton() {
        const gate = SharkGame.Gate;
        const resourceId = $(this).attr("id").split("-")[1];

        let message = "";
        const cost = gate.requirements.slots[resourceId] * (res.getResource("numen") + 1);
        if (res.getResource(resourceId) >= cost) {
            gate.completedRequirements.slots[resourceId] = true;
            res.changeResource(resourceId, -cost);
            $(this).remove();
            if (gate.shouldBeOpen()) {
                message = gate.messageAllPaid;
                // add enter gate button
                SharkGame.Button.makeButton("gateEnter", "Enter gate", $("#buttonList"), gate.onEnterButton);
            } else {
                message = gate.messagePaid;
            }
        } else {
            message = gate.messageCantPay + "<br/>";
            const diff = cost - res.getResource(resourceId);
            message += main.beautify(diff) + " more.";
        }
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + gate.getSceneImagePath() + "' id='tabSceneImageEssence'>" + message;
        }
        $("#tabMessage").html(message);
    },

    onEnterButton() {
        $("#tabMessage").html(SharkGame.Gate.messageEnter);
        $(this).remove();
        SharkGame.wonGame = true;
        main.endGame();
    },

    shouldBeOpen() {
        return _.every(SharkGame.Gate.completedRequirements, (requirementType) => _.every(requirementType));
    },

    checkUpgradeRequirements(upgradeName) {
        const gate = SharkGame.Gate;
        if (gate.completedRequirements.upgrades && gate.completedRequirements.upgrades[upgradeName] === false) {
            gate.completedRequirements.upgrades[upgradeName] = true;
        }
    },

    checkResourceRequirements(resourceName) {
        const gate = SharkGame.Gate;
        if (gate.requirements.resources && res.getResource(resourceName) >= gate.requirements.resources[resourceName]) {
            gate.completedRequirements.resources[resourceName] = true;
        }
    },

    getSceneImagePath() {
        const gate = SharkGame.Gate;
        const slotsLeft = gate.getSlotsLeft();
        const upgradesLeft = gate.getUpgradesLeft();
        const resourcesLeft = gate.getResourcesLeft();

        // lots of complicated logic here
        // basically:
        // - if the gate is open, show it as open
        // - if the gate has more than 1 slot left, show it as closed
        // - if the gate has 1 slot left and filling that slot would open it, then do the 1 slot remaining
        // - if the gate has 1 slot left but filling that slot would NOT open it (there's an upgrade requirement), show it as closed
        // - if all slots are filled but an upgrade is still needed then show the closed-but-filled image
        if (gate.shouldBeOpen()) {
            return gate.sceneOpenImage;
        } else if (slotsLeft > 1) {
            return gate.sceneClosedImage;
        } else if (slotsLeft === 1 && !upgradesLeft && !resourcesLeft) {
            return gate.sceneAlmostOpenImage;
        } else if (!slotsLeft && (upgradesLeft || resourcesLeft)) {
            return gate.sceneClosedButFilledImage;
        } else {
            return gate.sceneClosedImage;
        }
    },
};

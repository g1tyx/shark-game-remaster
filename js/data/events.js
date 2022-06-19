"use strict";
// welcome to the events system!
// events are an important piece of a larger puzzle I'm trying to solve related to adding lots of behavior into the game
// events will allow miscellaneous behavior to be organized into a single object
// miscellaneous behavior is anything which does not belong in the core game loop.
// Toby: Then why is it running in the core game loop?
// this has the same purpose of the modifier system: flexibility while retaining performance and organization.
//
// events have triggers; they are very rigid, so we also need a system with which to trigger them
// the ways we might trigger events:
// - on buying an upgrade
// - purposefully queuing up an event to have its requirements checked every tick until success
// - on using the recycler
// - on using a home button
//
// a system will be implemented to handle events which will simply be called every tick before and after regular processing.
//
SharkGame.Events = {
    frigidInitiateIcyDoom: {
        handlingTime: "beforeTick",
        priority: 2,
        getAction() {
            if (SharkGame.World.worldType !== "frigid") {
                return "remove";
            }
            if (SharkGame.Upgrades.purchased.includes("civilContact")) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            SharkGame.ResourceIncomeAffectors.ice.multiply.ice = -(1 / 666);
            res.clearNetworks();
            res.buildIncomeNetwork();
        },
    },
    frigidThaw: {
        handlingTime: "beforeTick",
        priority: 3,
        getAction() {
            if (SharkGame.World.worldType !== "frigid") {
                return "remove";
            }
            if (SharkGame.Upgrades.purchased.indexOf("rapidRecharging") > -1) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            res.applyModifier("planetaryIncome", "ice", -51);
            SharkGame.ResourceMap.get("heater").baseIncome = {
                kelp: 0,
                ice: 0,
            };
            SharkGame.ResourceMap.get("heater").desc = "Kept ice at bay. Not very useful anymore.";
            res.reapplyModifiers("heater", "kelp");
            res.reapplyModifiers("heater", "ice");
            SharkGame.ResourceIncomeAffectors.ice.multiply.ice = 0;
            res.clearNetworks();
            res.buildIncomeNetwork();
        },
    },
    frigidEmergencyIceCap: {
        handlingTime: "afterTick",
        priority: 0,
        getAction() {
            if (SharkGame.World.worldType !== "frigid") {
                return "remove";
            }
            if (res.getResource("ice") > 999) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            res.setResource("ice", 999);
            return true;
        },
    },
    frigidAddUrchin: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "remove";
        },
        trigger() {
            if (!SharkGame.flags.frigidAddedUrchin) {
                SharkGame.Resources.changeResource("urchin", 1);
                SharkGame.flags.frigidAddedUrchin = true;
            }
        },
    },
    abandonedRefundInvestigators: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "remove";
        },
        trigger() {
            if (!SharkGame.flags.abandonedRefundedInvestigators) {
                SharkGame.Resources.changeResource("investigator", 500);
                SharkGame.flags.abandonedRefundedInvestigators = true;
            }
        },
    },
    revealBuyButtons: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            if (SharkGame.persistentFlags.revealedBuyButtons) {
                return "remove";
            }
            if (res.getTotalResource("crab") > 12 || res.getTotalResource("crystal") > 12) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            SharkGame.persistentFlags.revealedBuyButtons = true;
            SharkGame.TabHandler.setUpTab();
        },
    },
    revealButtonTabs: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            if (world.worldType === `start` && !SharkGame.persistentFlags.revealedButtonTabs) {
                if (res.getTotalResource("scientist") > 0) {
                    return "trigger";
                }
                return "pass";
            }
            SharkGame.persistentFlags.revealedButtonTabs = true;
            return "remove";
        },
        trigger() {
            SharkGame.persistentFlags.revealedButtonTabs = true;
            SharkGame.TabHandler.setUpTab();
        },
    },
    /* getAllAffordableUpgrades */
    updateLabNotifier: {
        handlingTime: "afterTick",
        priority: 0,
        getAction() {
            if (SharkGame.TabHandler.isTabUnlocked("lab")) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            if (SharkGame.Lab.findAllAffordableUpgrades().length) {
                $("#tab-lab").html("(<strong>!</strong>) Laboratory");
            } else {
                $("#tab-lab").html("Laboratory");
            }
            return true;
        },
    },
    remindAboutBuyMax: {
        handlingTime: "afterTick",
        priority: 0,
        getAction() {
            if (SharkGame.persistentFlags.individuallyBoughtSharkonium === -1) {
                return "remove";
            }
            if (SharkGame.persistentFlags.individuallyBoughtSharkonium >= 50) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            if (sharkmath.getBuyAmount() === 1 && SharkGame.Tabs.current === "home") {
                $("#buy--1").addClass("reminderShadow");
            } else {
                $("#buy--1").removeClass("reminderShadow");
                SharkGame.persistentFlags.individuallyBoughtSharkonium = 49;
            }
            return true;
        },
    },
    aspectRefresh: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            return "trigger";
        },
        trigger() {
            res.reapplyModifiers("aspectAffect", "crystal");
            return true;
        },
    },
    resetPressAllButtonsKeybind: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            if (!SharkGame.gameOver) {
                return "trigger";
            }
            return "pass";
        },
        trigger() {
            SharkGame.flags.pressedAllButtonsThisTick = false;
            return true;
        },
    },
};

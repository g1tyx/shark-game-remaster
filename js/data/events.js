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
/**
 * !! Copied from ../eventhandler.js !!
 * @typedef {"beforeTick" | "afterTick"} eventName
 * @typedef {"trigger" | "remove" | "pass"} eventAction
 * @typedef {{
 *     handlingTime: eventName
 *     priority: number
 *     getAction(): eventAction
 *     trigger(): boolean - Whether to keep the event after firing
 * }} SharkEventHandler
 */
/** @type Record<string, SharkEventHandler> */
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
            SharkGame.GeneratorIncomeAffectors.ice.multiply.world = -(1 / 666);
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
    theMinuteHandEvent: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            if (SharkGame.Aspects.theMinuteHand.level) {
                if (SharkGame.Settings.current.offlineModeActive && SharkGame.timestampSimulated - SharkGame.timestampRunStart < 60000) {
                    return "trigger";
                }
                if (
                    !SharkGame.Settings.current.offlineModeActive &&
                    SharkGame.timestampSimulated + SharkGame.timestampLastSave - 2 * SharkGame.timestampRunStart < 60000
                ) {
                    return "trigger";
                }
            }

            res.specialMultiplier = 1;
            return "remove";
        },
        trigger() {
            res.specialMultiplier = SharkGame.Aspects.theMinuteHand.level + 3;
            return true;
        },
    },
};

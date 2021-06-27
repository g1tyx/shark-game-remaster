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
            if (SharkGame.World.worldType === "frigid") {
                if (SharkGame.Upgrades.purchased.indexOf("civilContact") > -1) {
                    return "trigger";
                }
                return "pass";
            }
            return "remove";
        },
        trigger() {
            SharkGame.GeneratorIncomeAffectors.ice.multiply.world = -0.0015015;
            res.clearNetworks();
            res.buildIncomeNetwork();
        },
    },
    frigidThaw: {
        handlingTime: "beforeTick",
        priority: 3,
        getAction() {
            if (SharkGame.World.worldType === "frigid") {
                if (SharkGame.Upgrades.purchased.indexOf("rapidRecharging") > -1) {
                    return "trigger";
                }
                return "pass";
            }
            return "remove";
        },
        trigger() {
            world.worldResources.get("ice").income = -50;
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
            if (SharkGame.World.worldType === "frigid") {
                if (res.getResource("ice") > 999) {
                    return "trigger";
                }
                return "pass";
            }
            return "remove";
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
            if (res.getResource("urchin") < 1) {
                SharkGame.Resources.changeResource("urchin", 1);
                // I know this opens up an exploit for one free urchin if you load a save with none with this upgrade,
                // but the exploit is meaningless, sooo
            }
        },
    },
    // frigidIncreaseUrchinIceResist: {
    //     handlingTime: "beforeTick",
    //     priority: 0,
    //     getAction() {
    //         return "remove";
    //     },
    //     trigger() {
    //         SharkGame.GeneratorIncomeAffectors.ice.multiply.urchin = -0.0001;
    //         SharkGame.GeneratorIncomeAffectors.ice.multiply.spawner = -0.0001;
    //         res.clearNetworks();
    //         res.buildIncomeNetwork();
    //     },
    // },
    // frigidIncreaseFrenzyIceResist: {
    //     handlingTime: "beforeTick",
    //     priority: 0,
    //     getAction() {
    //         return "remove";
    //     },
    //     trigger() {
    //         SharkGame.GeneratorIncomeAffectors.ice.multiply.shark = -0.00075;
    //         SharkGame.GeneratorIncomeAffectors.ice.multiply.squid = -0.00075;
    //         SharkGame.GeneratorIncomeAffectors.ice.multiply.crab = -0.00075;
    //         SharkGame.GeneratorIncomeAffectors.ice.multiply.specialists = -0.00075;
    //         SharkGame.GeneratorIncomeAffectors.ice.multiply.nurse = -0.00075;
    //         SharkGame.GeneratorIncomeAffectors.ice.multiply.collective = -0.00075;
    //         SharkGame.GeneratorIncomeAffectors.ice.multiply.brood = -0.00075;
    //         res.clearNetworks();
    //         res.buildIncomeNetwork();
    //     },
    // },
};

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
    frigidActivateIce: {
        handlingTime: "beforeTick",
        priority: 3,
        getAction() {
            if (SharkGame.Upgrades.purchased.indexOf("automation") > -1 && SharkGame.World.worldType === "frigid") {
                this.trigger();
            }
            return "remove";
        },
        trigger() {
            SharkGame.World.worldResources.get("ice").income = 0.01;
            SharkGame.GeneratorIncomeAffectors.ice.multiply.ice = -0.005;
            res.clearNetworks();
            res.buildIncomeNetwork();
        },
    },
    frigidIntensifyIce: {
        handlingTime: "beforeTick",
        priority: 2,
        getAction() {
            if (SharkGame.Upgrades.purchased.indexOf("automation") > -1 && SharkGame.World.worldType === "frigid") {
                this.trigger();
            }
            return "remove";
        },
        trigger() {
            SharkGame.GeneratorIncomeAffectors.ice.multiply.ice = -0.002;
            res.clearNetworks();
            res.buildIncomeNetwork();
        },
    },
    frigidFurtherIntensifyIce: {
        handlingTime: "beforeTick",
        priority: 1,
        getAction() {
            if (SharkGame.Upgrades.purchased.indexOf("automation") > -1 && SharkGame.World.worldType === "frigid") {
                this.trigger();
            }
            return "remove";
        },
        trigger() {
            SharkGame.GeneratorIncomeAffectors.ice.multiply.ice = -0.0012;
            res.clearNetworks();
            res.buildIncomeNetwork();
        },
    },
    frigidThaw: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            if (SharkGame.Upgrades.purchased.indexOf("automation") > -1 && SharkGame.World.worldType === "frigid") {
                this.trigger();
            }
            return "remove";
        },
        trigger() {
            SharkGame.World.worldResources.get("ice").income = 0;
            SharkGame.GeneratorIncomeAffectors.ice.multiply.ice = -1;
            res.clearNetworks();
            res.buildIncomeNetwork();
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
    frigidIncreaseUrchinIceResist: {
        handlingTime: "beforeTick",
        priority: 1,
        getAction() {
            return "remove";
        },
        trigger() {
            SharkGame.GeneratorIncomeAffectors.ice.multiply.urchin = -0.0001;
            res.clearNetworks();
            res.buildIncomeNetwork();
        },
    },
};

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
 * @typedef {"trigger" | "remove"} eventAction
 * @typedef {{
 *     handlingTime: eventName
 *     priority: number
 *     getAction(): eventAction
 *     trigger(): boolean
 * }} SharkEventHandler
 */
/** @type Record<string, SharkEventHandler> */
SharkGame.Events = {
    frigidActivateIce: {
        handlingTime: "beforeTick",
        priority: 0,
        getAction() {
            if (SharkGame.World.worldType !== "frigid") {
                return "remove";
            }
            return "trigger";
        },
        /**
         * @returns {boolean} - Wether to keep the event after firing
         */
        trigger() {
            SharkGame.World.worldResources.set("ice", 0.1);
            SharkGame.GeneratorIncomeAffectors.ice.multiply.ice = -0.02;
            return false;
        },
    },
};

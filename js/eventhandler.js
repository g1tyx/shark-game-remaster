"use strict";

/**
 * !! Copied from ./data/events.js !!
 * @typedef {"beforeTick" | "afterTick"} eventName
 * @typedef {"trigger" | "remove" | "pass"} eventAction
 * @typedef {{
 *     handlingTime: eventName
 *     priority: number
 *     getAction(): eventAction
 *     trigger(): boolean
 * }} SharkEventHandler
 */

SharkGame.EventHandler = {
    /** @type {SharkEventHandler[][]>} */
    eventQueue: [],
    init() {
        const queue = SharkGame.EventHandler.eventQueue;
        _.each(SharkGame.Events, (eventHandler) => {
            if (!queue[eventHandler.priority]) {
                queue[eventHandler.priority] = [eventHandler];
            } else {
                queue[eventHandler.priority].push(eventHandler);
            }
        });
        SharkGame.EventHandler.handleEventTick("load");
    },
    /** @param {eventName | "load"} handlingTime */
    handleEventTick(handlingTime) {
        if (!handlingTime) {
            log.addError("tried to call handleEventTick without passing handlingTime");
            return;
        }

        const queue = SharkGame.EventHandler.eventQueue;

        queue.forEach((handlers, priority) => {
            const cleanedEventHandlers = [];
            _.each(handlers, (eventHandler) => {
                let keep = true;
                if (eventHandler.handlingTime === handlingTime || handlingTime === "load") {
                    const action = eventHandler.getAction();
                    switch (action) {
                        case "trigger":
                            keep = eventHandler.trigger();
                            break;
                        case "remove":
                            keep = false;
                            break;
                        case "pass":
                            break;
                        default:
                            log.addError(new Error("eventHandler.getAction() returned unexpected result"));
                    }
                }
                if (keep) {
                    cleanedEventHandlers.push(eventHandler);
                }
            });
            queue[priority] = cleanedEventHandlers;
        });
    },
};

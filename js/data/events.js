// welcome to the events system!
// events are an important piece of a larger puzzle i'm trying to solve related to adding lots of behavior into the game
// events will allow miscellaneous behavior to be organized into a single object
// miscellaneous behavior is anything which does not belong in the core game loop.
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

SharkGame.EventsHandler = {
    eventQueue: new Map(),
    init() {
        const queue = SharkGame.EventsHandler.eventQueue;
        $.each(SharkGame.Events, (name, obj) => {
            if (!queue.get(obj.priority)) {
                for (let i = 0; i <= obj.priority; i++) {
                    if (!queue.get(i)) {
                        queue.set(i, []);
                    }
                }
            }
            queue.get(obj.priority).push(name);
        });
        SharkGame.EventsHandler.handleEventTick("load");
    },
    handleEventTick(handlingTime) {
        const queue = SharkGame.EventsHandler.eventQueue;

        if (!handlingTime) {
            SharkGame.Log.addError("Something tried to handle events without specifying when the handling is taking place.");
            return;
        }

        let keepers;
        for (let i = queue.size - 1; i >= 0; i--) {
            keepers = [];
            _.each(queue.get(i), (name) => {
                const event = SharkGame.Events[name];
                let keep = true;
                if (event.handlingTime === handlingTime || handlingTime === "load") {
                    switch (event.testTrigger(/*handlingTime === "load"*/)) {
                        case true:
                            keep = event.trigger(/*handlingTime === "load"*/);
                            break;
                        case "removeFromList":
                            keep = false;
                    }
                }
                if (keep) {
                    keepers.push(name);
                }
            });
            queue.set(i, keepers);
        }
    },
};

SharkGame.Events = {
    frigidActivateIce: {
        handlingTime: "before",
        priority: 0,
        testTrigger(/*load = false*/) {
            if (SharkGame.World.worldType !== "frigid") {
                return "removeFromList";
            }
            // placeholder return value
            return false;
        },
        trigger(/*load = false*/) {
            SharkGame.World.worldResources.set("ice", 0.1);
            SharkGame.GeneratorIncomeAffectors.ice.multiply.ice = -0.02;
            return false;
        },
    },
    /*test: {
        handlingTime: "before",
        priority: 0,
        testTrigger(load = false) {
            return r.getResource('ray') > 10;
        },
        trigger(load = false) {
            SharkGame.World.worldResources.get('crab').income += 0.1;
            return false;
        },
    },*/
};

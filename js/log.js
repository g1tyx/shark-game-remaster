"use strict";
SharkGame.Log = {
    initialised: false,
    messages: [],

    init() {
        const l = SharkGame.Log;
        // create log
        $("#log").append("<h3>Log<h3/>").append("<button id='clearLog' class='min close-button'>✕</button>").append("<ul id='messageList'></ul>");
        // add clear button
        $("#clearLog").on("click", l.clearMessages);
        l.initialised = true;
    },

    addMessage(message) {
        const log = SharkGame.Log;
        const showAnims = SharkGame.Settings.current.showAnimations;

        if (!log.initialised) {
            log.init();
        }
        const messageItem = $("<li>").html(message);
        if (showAnims) {
            messageItem.hide().css("opacity", 0).prependTo("#messageList").slideDown(50).animate({ opacity: 1.0 }, 100);
        } else {
            messageItem.prependTo("#messageList");
        }
        log.messages.push(messageItem);

        SharkGame.Log.correctLogLength();

        return messageItem;
    },

    addError(message) {
        if (message instanceof Error) {
            console.error(message);
            message = message.message;
        }
        const messageItem = SharkGame.Log.addMessage("Error: " + message);
        messageItem.addClass("error");
        return messageItem;
    },

    addDiscovery(message) {
        const messageItem = SharkGame.Log.addMessage(message);
        messageItem.addClass("discovery");
        return messageItem;
    },

    correctLogLength() {
        const l = SharkGame.Log;
        const showAnims = SharkGame.Settings.current.showAnimations;
        const logMax = SharkGame.Settings.current.logMessageMax;

        if (l.messages.length >= logMax) {
            while (l.messages.length > logMax) {
                const oldestMessage = l.messages[0];
                // remove oldest message
                if (showAnims) {
                    l.messages[0].animate({ opacity: 0 }, 100, "swing", () => {
                        $(oldestMessage).remove();
                    });
                } else {
                    oldestMessage.remove();
                }

                // shift array (remove first item)
                l.messages.shift();
            }
        }
    },

    clearMessages(log = true) {
        // remove each element from page
        _.each(SharkGame.Log.messages, (message) => {
            message.remove();
        });
        // wipe array
        SharkGame.Log.messages = [];
        if (log) SharkGame.Log.addMessage("Log cleared.");
    },

    haveAnyMessages() {
        return SharkGame.Log.messages.length > 0;
    },
};

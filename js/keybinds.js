SharkGame.Keybinds = {
    defaultBinds: {
        0: "test",
        P: "pause",
        1: "switch to home tab",
        2: "switch to lab tab",
        3: "switch to grotto tab",
        4: "switch to recycler tab",
        5: "switch to gate tab",
        6: "switch to reflection tab",
        Backquote: "open bind menu",
    },
    keybinds: {},
    bindMode: false,
    tempDisableBind: false,
    settingAction: undefined, // setting this to undefined for sake of thoroughness in writing everything down

    modifierKeys: {
        ShiftLeft: 0,
        ShiftRight: 0,
        AltLeft: 0,
        AltRight: 0,
        ControlLeft: 0,
        ControlRight: 0,
    },

    init() {
        this.keybinds = _.cloneDeep(this.defaultBinds);
    },

    setup() {},

    // makes IDs human-readable
    cleanID(keyID) {
        keyID = keyID.replace("Digit", "").replace("Key", "");
        if (keyID.includes("Left")) {
            keyID = "Left " + keyID.replace("Left", "");
        }
        if (keyID.includes("Right")) {
            keyID = "Right " + keyID.replace("Right", "");
        }
        if (keyID === "CapsLock") {
            keyID = "Caps Lock";
        }
        return keyID;
    },

    composeKeys(keyID) {
        _.each(["Shift", "Alt", "Control"], (modifier) => {
            if (this.modifierKeys[modifier + "Left"] || this.modifierKeys[modifier + "Right"]) {
                keyID = modifier + " + " + keyID;
            }
        });

        return keyID;
    },

    handleKeyUp(keyID) {
        console.log(keyID);

        if (!_.isUndefined(this.modifierKeys[keyID])) {
            this.modifierKeys[keyID] = 0;
        }

        keyID = this.cleanID(keyID);
        keyID = this.composeKeys(keyID);
        console.log(keyID);
        if (this.bindMode) {
            this.addKeybind(keyID, this.settingAction);
        } else {
            const boundAction = this.keybinds[keyID];
            if (boundAction) this.handleBind(boundAction);
        }
    },

    handleKeyDown(keyID) {
        if (!_.isUndefined(this.modifierKeys[keyID])) {
            this.modifierKeys[keyID] = 1;
        }
    },

    handleBind(actionType) {
        if (!this.bindMode && !this.tempDisableBind) {
            switch (actionType) {
                case "test":
                    console.log("test successful");
                    break;
                case "open bind menu":
                    // do nothing for now
                    break;
                case "pause":
                    if (SharkGame.Aspects.meditation.level && !SharkGame.gameOver) {
                        res.pause.togglePause();
                    }
                    break;
                case "switch to home tab":
                    SharkGame.TabHandler.keybindSwitchTab("home");
                    break;
                case "switch to lab tab":
                    SharkGame.TabHandler.keybindSwitchTab("lab");
                    break;
                case "switch to grotto tab":
                    SharkGame.TabHandler.keybindSwitchTab("stats");
                    break;
                case "switch to recycler tab":
                    SharkGame.TabHandler.keybindSwitchTab("recycler");
                    break;
                case "switch to gate tab":
                    SharkGame.TabHandler.keybindSwitchTab("gate");
                    break;
                case "switch to reflection tab":
                    SharkGame.TabHandler.keybindSwitchTab("reflection");
                    break;
                default:
                // do nothing
                // or alternatively:
                // SharkGame.Log.addError("Keybind assigned to nonexistent action.");
            }
        }
    },

    addKeybind(keyID, actionType) {
        this.keybinds[keyID] = actionType;
    },
};

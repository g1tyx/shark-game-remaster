SharkGame.Keybinds = {
    defaultBinds: {
        0: "toggle bind mode",
        P: "pause",
        1: "switch to home tab",
        2: "switch to lab tab",
        3: "switch to grotto tab",
        4: "switch to recycler tab",
        5: "switch to gate tab",
        6: "switch to reflection tab",
        Backquote: "bind home ocean button",
    },
    keybinds: {},

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
        this.bindMode = false;
        this.tempDisableBind = false;
        this.settingAction = undefined;
        this.settingKey = undefined;
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
            if (keyID.includes(modifier)) return;
            if (this.modifierKeys[modifier + "Left"] || this.modifierKeys[modifier + "Right"]) {
                keyID = modifier + " + " + keyID;
            }
        });

        return keyID;
    },

    handleKeyUp(keyID) {
        const modifiersEntry = this.modifierKeys[keyID];
        if (!_.isUndefined(modifiersEntry)) {
            this.modifierKeys[keyID] = 0;
        }

        keyID = this.cleanID(keyID);
        keyID = this.composeKeys(keyID);
        console.log(keyID);

        const boundAction = this.keybinds[keyID];
        if (this.bindMode && boundAction !== "bind home ocean button") {
            if (!_.isUndefined(modifiersEntry)) {
                this.settingKey = keyID;
                this.updateBindModeState();
            }
        } else if (boundAction) {
            this.handleUpBind(boundAction);
        }
    },

    handleKeyDown(keyID) {
        const modifiersEntry = this.modifierKeys[keyID];
        if (!_.isUndefined(modifiersEntry)) {
            this.modifierKeys[keyID] = 1;
        }

        keyID = this.cleanID(keyID);
        keyID = this.composeKeys(keyID);
        console.log(keyID);

        const boundAction = this.keybinds[keyID];
        if (this.bindMode && boundAction !== "bind home ocean button") {
            console.log(modifiersEntry);
            if (_.isUndefined(modifiersEntry)) {
                this.settingKey = keyID;
                this.updateBindModeState();
            }
        } else if (boundAction) {
            this.handleDownBind(boundAction);
        }
    },

    handleUpBind(actionType) {
        if (!this.tempDisableBind) {
            switch (actionType) {
                default:
                    if (SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionType)) {
                        $(`#${actionType}`).removeClass(`keep-button-pressed`);
                        home.onHomeButton(null, actionType);
                    }
                    console.log(actionType);
                // return false;
                // do nothing yet
                // or alternatively:
                // SharkGame.Log.addError("Keybind assigned to nonexistent action.");
            }
            return true;
        }
    },

    handleDownBind(actionType) {
        // make sure to remember to search all homeaction worlds in order when
        // looking for the data associated with it
        if (!this.tempDisableBind && actionType) {
            switch (actionType) {
                case "test":
                    console.log("test successful");
                    break;
                case "open bind menu":
                    // do nothing for now
                    break;
                case "bind home ocean button":
                    this.toggleBindMode();
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
                    if (SharkGame.HomeActions.getActionData(SharkGame.HomeActions.getActionTable(), actionType)) {
                        $(`#${actionType}`).addClass(`keep-button-pressed`);
                    }
                    console.log(actionType);
                    /*                     _.each(SharkGame.HomeActions, (table) => {
                        if (typeof table !== `function` && table[actionType]) {

                        }
                    }); */
                    return false;
            }
            return true;
        }
    },

    addKeybind(keyID, actionType) {
        this.keybinds[keyID] = actionType;
    },

    updateBindModeOverlay() {},

    updateBindModeState() {
        this.updateBindModeOverlay();
        if (this.checkForBindModeCombo()) {
            // check to make sure we dont merge redundant modifier keys
            // or just pass nothing when setting a modifier key
            this.addKeybind(this.composeKeys(this.settingKey), this.settingAction);
            this.toggleBindMode();
        }
    },

    checkForBindModeCombo() {
        return this.settingAction && this.settingKey;
    },

    toggleBindMode() {
        // toggle bind mode:
        // first, settingaction and settingkey to undefined
        // then toggle the bindmode property in sharkgame.keybinds
        // then, if it was just turned on, pop up an overlay window if not in the gate
        // (make sure to turn off overlay in keybinds init)
        // if it was just turned off, remove the overlay
        //
        // on key up don't accept input from the bind mode toggle key
        // on keydown test to see if its the bindmode key and turn off bindmode if it is
        // on keydown test to see if it's not a modifier key
        // if it's not a modifier key, set the overlay to display the key on it,
        // and set the settingkey property in sharkgame.keybinds
        // then test to see if we have a settingaction
        // if we do, bind it and toggle bind mode
        //
        // on home button press, check for bindmode
        // if bindmode, set settingaction, update the overlay, and run checkForCombo

        this.settingKey = undefined;
        this.settingAction = undefined;

        if (this.bindMode) {
            console.log(`off`);
            this.bindMode = false;
        } else {
            console.log(`on`);
            this.bindMode = true;
        }
    },
};

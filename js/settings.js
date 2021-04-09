SharkGame.Settings = {
    current: {},

    buyAmount: {
        defaultSetting: 1,
        show: false,
        options: [1, 10, 100, -3, -2, -1, "custom"],
    },

    grottoMode: {
        defaultSetting: "simple",
        show: false,
        options: ["simple", "advanced"],
    },

    showPercentages: {
        defaultSetting: "absolute",
        show: false,
        options: ["absolute", "percentage"],
    },

    showTabHelp: {
        defaultSetting: true,
        show: false,
        options: [true, false],
    },

    framerate: {
        defaultSetting: 20,
        name: "Framerate/TPS",
        desc: "Which rate to update the game at. Lower saves power and might improve performance. Higher looks smoother.",
        show: true,
        options: [1, 2, 5, 10, 20, 30],
        onChange() {
            m.applyFramerate();
        },
    },

    groupResources: {
        defaultSetting: true,
        name: "Group Resources",
        desc: "Whether to group resources in the table into categories.",
        show: true,
        options: [true, false],
        onChange() {
            r.rebuildTable = true;
        },
    },

    buttonDisplayType: {
        defaultSetting: "pile",
        name: "Home Sea Button Display",
        desc: "Do you want a vertical list of buttons, or a more space-saving configuration?",
        show: true,
        options: ["list", "pile"],
        onChange() {
            m.changeTab(SharkGame.Tabs.current);
        },
    },

    offlineModeActive: {
        defaultSetting: true,
        name: "Offline Mode",
        desc: "Whether to calculate income gained while not playing.",
        show: true,
        options: [true, false],
    },

    autosaveFrequency: {
        // times given in minutes
        defaultSetting: 5,
        name: "Autosave Frequency",
        desc: "Number of minutes between autosaves.",
        show: true,
        options: [1, 2, 5, 10, 30],
        onChange() {
            clearInterval(m.autosaveHandler);
            m.autosaveHandler = setInterval(m.autosave, SharkGame.Settings.current.autosaveFrequency * 60000);
            SharkGame.Log.addMessage(
                "Now autosaving every " +
                    SharkGame.Settings.current.autosaveFrequency +
                    " minute" +
                    SharkGame.plural(SharkGame.Settings.current.autosaveFrequency) +
                    "."
            );
        },
    },

    updateCheck: {
        defaultSetting: true,
        name: "Check for updates",
        desc: "Whether to show a notification when a new update becomes available. (Checked every 5 minutes)",
        show: true,
        options: [true, false],
        onChange() {
            clearInterval(SharkGame.Main.checkForUpdateHandler);
            if (SharkGame.Settings.current.updateCheck) {
                SharkGame.Main.checkForUpdateHandler = setInterval(m.checkForUpdates, 300000);
            }
        },
    },

    logMessageMax: {
        defaultSetting: 15,
        name: "Max Log Messages",
        desc: "How many messages to show before removing old ones.",
        show: true,
        options: [5, 10, 15, 20, 25, 30, 50],
        onChange() {
            SharkGame.Log.correctLogLength();
        },
    },

    sidebarWidth: {
        defaultSetting: "25%",
        name: "Sidebar Width",
        desc: "How much screen space the sidebar should take.",
        show: true,
        options: ["25%", "30%", "35%", "40%", "45%", "50%"],
        onChange() {
            const sidebar = $("#sidebar");
            if (SharkGame.Settings.current.showAnimations) {
                sidebar.animate({ width: SharkGame.Settings.current.sidebarWidth }, 100);
            } else {
                sidebar.width(SharkGame.Settings.current.sidebarWidth);
            }
        },
    },

    showAnimations: {
        defaultSetting: true,
        name: "Show Animations",
        desc: "Whether to show animated transitions for some things.",
        show: true,
        options: [true, false],
    },

    colorCosts: {
        defaultSetting: true,
        name: "Color Resource Names",
        desc: "Whether to color names of resources.",
        show: true,
        options: [true, false],
        onChange() {
            r.rebuildTable = true;
            s.recreateIncomeTable = true;
        },
    },

    boldCosts: {
        defaultSetting: true,
        name: "Bold Resource Names",
        desc: "Whether to embolden names of resources.",
        show: true,
        options: [true, false],
        onChange() {
            r.rebuildTable = true;
            s.recreateIncomeTable = true;
        },
    },

    enableThemes: {
        defaultSetting: true,
        name: "Enable Planet-dependent Styles",
        desc: "Whether to use a different color scheme dependent on which planet you're currently on.",
        show: true,
        options: [true, false],
        onChange() {
            if (SharkGame.Settings.current["enableThemes"]) {
                document.querySelector("body").classList.remove("no-theme");
            } else {
                document.querySelector("body").classList.add("no-theme");
            }
        },
    },

    showIcons: {
        defaultSetting: true,
        name: "Show Home Action icons",
        desc: "Whether to show icons above actions in your home actions.",
        show: true,
        options: [true, false],
    },

    showTabImages: {
        defaultSetting: true,
        name: "Show Tab Header Images",
        desc: "Whether to show the art of the current tab.",
        show: true,
        options: [true, false],
        onChange() {
            m.changeTab(SharkGame.Tabs.current);
        },
    },
};

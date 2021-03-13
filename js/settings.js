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
        desc: "Lower the TPS to save power or increase performance. Set higher to get a smoother game. Defaults to 10.",
        show: true,
        options: [1, 2, 5, 10, 20, 30],
        onChange() {
            m.applyFramerate();
        },
    },

    groupResources: {
        defaultSetting: true,
        name: "Group Resources",
        desc: "Group resources in the table into categories for legibility.",
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
        desc: "Let your numbers increase even with the game closed!",
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
        // times given in minutes
        defaultSetting: true,
        name: "Check for updates",
        desc: "Do you want it to give you a warning when there's a new update?",
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
        desc: "How much screen estate the sidebar should take.",
        show: true,
        options: ["25%", "30%", "35%", "40%", "45%", "50%"],
        onChange() {
            const sidebar = $("#sidebar");
            if (SharkGame.Settings.current.showAnimations) {
                sidebar.animate({ width: SharkGame.Settings.current.sidebarWidth }, "100");
                SharkGame.Log.correctLogLength();
            } else {
                sidebar.width(SharkGame.Settings.current.sidebarWidth);
            }
        },
    },

    showAnimations: {
        defaultSetting: true,
        name: "Show Animations",
        desc: "Show animations or don't. YOU DECIDE.",
        show: true,
        options: [true, false],
    },

    colorCosts: {
        defaultSetting: true,
        name: "Color Resource Names",
        desc: "Color names of resources.",
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
        desc: "Bold names of resources.",
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
        desc: "Makes your game look like the planet you're on.",
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

    iconPositions: {
        defaultSetting: "top",
        name: "Icon Positions",
        desc: "Where should icons go on the buttons?",
        show: true,
        options: ["top", "side", "off"],
    },

    showTabImages: {
        defaultSetting: true,
        name: "Show Tab Header Images",
        desc: "Do you want the new header images or are they taking up precious screen real-estate?",
        show: true,
        options: [true, false],
        onChange() {
            m.changeTab(SharkGame.Tabs.current);
        },
    },
};

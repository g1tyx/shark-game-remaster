"use strict";
SharkGame.Settings = {
    current: {},

    // Internal / No category
    buyAmount: {
        defaultSetting: 1,
        options: [1, 10, 100, -3, -2, -1, "custom"],
    },

    grottoMode: {
        defaultSetting: "simple",
        options: ["simple", "advanced"],
    },

    showPercentages: {
        defaultSetting: "absolute",
        options: ["absolute", "percentage"],
    },

    // PERFORMANCE

    framerate: {
        defaultSetting: 20,
        name: "Framerate/TPS",
        desc: "Which rate to update the game at. Lower saves power and might improve performance. Higher looks smoother.",
        category: "PERFORMANCE",
        options: [1, 2, 5, 10, 20, 30],
        onChange() {
            main.applyFramerate();
        },
    },

    showAnimations: {
        defaultSetting: true,
        name: "Show Animations",
        desc: "Whether to show animated transitions for some things.",
        category: "PERFORMANCE",
        options: [true, false],
    },

    // LAYOUT

    minimizedTopbar: {
        defaultSetting: true,
        name: "Minimized Title Bar",
        desc: "Whether to minimize the title bar at the top of the game.",
        category: "LAYOUT",
        options: [true, false],
        onChange() {
            if (SharkGame.Settings.current["minimizedTopbar"]) {
                document.querySelector("body").classList.add("top-bar");
            } else {
                document.querySelector("body").classList.remove("top-bar");
            }
        },
    },

    groupResources: {
        defaultSetting: true,
        name: "Group Resources",
        desc: "Whether to group resources in the table into categories.",
        category: "LAYOUT",
        options: [true, false],
        onChange() {
            res.rebuildTable = true;
        },
    },

    buttonDisplayType: {
        defaultSetting: "pile",
        name: "Home Sea Button Display",
        desc: "Do you want a vertical list of buttons, or a more space-saving configuration?",
        category: "LAYOUT",
        options: ["list", "pile"],
        onChange() {
            main.changeTab(SharkGame.Tabs.current);
        },
    },

    logMessageMax: {
        defaultSetting: 15,
        name: "Max Log Messages",
        desc: "How many messages to show before removing old ones.",
        category: "LAYOUT",
        options: [5, 10, 15, 20, 30],
        onChange() {
            SharkGame.Log.correctLogLength();
        },
    },

    sidebarWidth: {
        defaultSetting: "30%",
        name: "Sidebar Width",
        desc: "How much screen space the sidebar should take.",
        category: "LAYOUT",
        options: ["25%", "30%", "35%"],
        onChange() {
            const sidebar = $("#sidebar");
            if (SharkGame.Settings.current.showAnimations) {
                sidebar.animate({ width: SharkGame.Settings.current.sidebarWidth }, 100);
            } else {
                sidebar.width(SharkGame.Settings.current.sidebarWidth);
            }
        },
    },

    // APPEARANCE

    colorCosts: {
        defaultSetting: "color",
        name: "Color Resource Names",
        desc: "How to color names of resources.",
        category: "APPEARANCE",
        options: ["color", "bright", "none"],
        onChange() {
            res.rebuildTable = true;
            stats.recreateIncomeTable = true;
        },
    },

    boldCosts: {
        defaultSetting: true,
        name: "Bold Resource Names",
        desc: "Whether to embolden names of resources.",
        options: [true, false],
        category: "APPEARANCE",
        onChange() {
            res.rebuildTable = true;
            stats.recreateIncomeTable = true;
        },
    },

    enableThemes: {
        defaultSetting: true,
        name: "Enable Planet-dependent Styles",
        desc: "Whether to use a different color scheme dependent on which planet you're currently on.",
        options: [true, false],
        category: "APPEARANCE",
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
        name: "Show Action Button icons",
        desc: "Whether to show icons/drawings above action buttons.",
        category: "APPEARANCE",
        options: [true, false],
    },

    showTabImages: {
        defaultSetting: true,
        name: "Show Tab Header Images",
        desc: "Whether to show the art of the current tab.",
        category: "APPEARANCE",
        options: [true, false],
        onChange() {
            main.changeTab(SharkGame.Tabs.current);
        },
    },

    // OTHER

    showTooltips: {
        defaultSetting: true,
        name: "Tooltips",
        desc: "Whether to show informational tooltips when hovering over certain elements.",
        category: "OTHER",
        options: [true, false],
    },

    updateCheck: {
        defaultSetting: true,
        name: "Check for updates",
        desc: "Whether to show a notification when a new update becomes available. (Checked every 5 minutes)",
        category: "OTHER",
        options: [true, false],
        onChange() {
            clearInterval(SharkGame.Main.checkForUpdateHandler);
            if (SharkGame.Settings.current.updateCheck) {
                SharkGame.Main.checkForUpdateHandler = setInterval(main.checkForUpdates, 300000);
            }
        },
    },

    offlineModeActive: {
        defaultSetting: true,
        name: "Offline Mode",
        desc: "Whether to calculate income gained while not playing.",
        category: "OTHER",
        options: [true, false],
    },

    // SAVES (Needs to come last due to hard-coded import/export/wipe buttons at the bottom)

    autosaveFrequency: {
        // times given in minutes
        defaultSetting: 5,
        name: "Autosave Frequency",
        desc: "Number of minutes between autosaves.",
        category: "SAVES",
        options: [1, 2, 5, 10, 30],
        onChange() {
            clearInterval(main.autosaveHandler);
            main.autosaveHandler = setInterval(main.autosave, SharkGame.Settings.current.autosaveFrequency * 60000);
            SharkGame.Log.addMessage(
                "Now autosaving every " +
                    SharkGame.Settings.current.autosaveFrequency +
                    " minute" +
                    SharkGame.plural(SharkGame.Settings.current.autosaveFrequency) +
                    "."
            );
        },
    },
};

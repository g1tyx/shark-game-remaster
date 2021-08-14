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
        desc: "How fast to update the game.",
        category: "PERFORMANCE",
        options: [1, 2, 5, 10, 20, 30],
        onChange() {
            main.applyFramerate();
        },
    },

    showAnimations: {
        defaultSetting: true,
        name: "Show Animations",
        desc: "Whether to show animated transitions.",
        category: "PERFORMANCE",
        options: [true, false],
    },

    // LAYOUT

    minimizedTopbar: {
        defaultSetting: true,
        name: "Minimized Title Bar",
        desc: "Whether to minimize the title bar at the top.",
        category: "LAYOUT",
        options: [true, false],
        onChange() {
            if (SharkGame.Settings.current["minimizedTopbar"]) {
                document.querySelector("body").classList.add("top-bar");
                $("#wrapper").removeClass("notMinimized");
            } else {
                document.querySelector("body").classList.remove("top-bar");
                $("#wrapper").addClass("notMinimized");
            }
        },
    },

    logLocation: {
        defaultSetting: "right",
        name: "Log Location",
        desc: "Where to put the log.",
        category: "LAYOUT",
        options: ["right", "left", "top"],
        onChange() {
            log.moveLog();
        },
    },

    groupResources: {
        defaultSetting: true,
        name: "Group Resources",
        desc: "Whether to categorize resources in the table.",
        category: "LAYOUT",
        options: [true, false],
        onChange() {
            res.rebuildTable = true;
        },
    },

    smallTable: {
        defaultSetting: false,
        name: "Smaller Table",
        desc: "Whether to make the stuff table smaller.",
        category: "LAYOUT",
        options: [true, false],
        onChange() {
            res.rebuildTable = true;
        },
    },

    buttonDisplayType: {
        defaultSetting: "pile",
        name: "Home Sea Button Display",
        desc: "How to arrange buttons.",
        category: "LAYOUT",
        options: ["list", "pile"],
        onChange() {
            SharkGame.TabHandler.changeTab(SharkGame.Tabs.current);
        },
    },

    logMessageMax: {
        defaultSetting: 30,
        name: "Max Log Messages",
        desc: "Max number of messages kept in the log.",
        category: "LAYOUT",
        options: [5, 10, 15, 20, 30, 60],
        onChange() {
            log.correctLogLength();
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

    alwaysSingularTooltip: {
        defaultSetting: false,
        name: "Tooltip Always Singular",
        desc: "Whether to make the tooltip only show what one of each thing produces.",
        category: "APPEARANCE",
        options: [true, false],
    },

    tooltipQuantityReminders: {
        defaultSetting: true,
        name: "Tooltip Amount Reminder",
        desc: "Should tooltips tell you much you own of stuff?",
        category: "APPEARANCE",
        options: [true, false],
    },

    enableThemes: {
        defaultSetting: true,
        name: "Enable Planet-dependent Styles",
        desc: "Whether to change page colors for different planets.",
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
        desc: "Whether to show icons.",
        category: "APPEARANCE",
        options: [true, false],
    },

    showTabImages: {
        defaultSetting: true,
        name: "Show Tab Header Images",
        desc: "Whether to show art.",
        category: "APPEARANCE",
        options: [true, false],
        onChange() {
            SharkGame.TabHandler.changeTab(SharkGame.Tabs.current);
        },
    },

    // ACCESSIBILITY

    doAspectTable: {
        defaultSetting: "tree",
        name: "Aspect Table or Tree",
        desc: "Whether to draw the visual aspect tree or the more accessible aspect table.",
        category: "ACCESSIBILITY",
        options: ["tree", "table"],
    },

    verboseTokenDescriptions: {
        defaultSetting: false,
        name: "Verbose Token",
        desc: "Whether the 'token' mechanic should have text saying where it is.",
        category: "ACCESSIBILITY",
        options: [true, false],
        onChange() {
            res.tokens.updateTokenDescriptions();
        },
    },

    // OTHER

    showTooltips: {
        defaultSetting: true,
        name: "Tooltips",
        desc: "Whether to show informational tooltips when hovering over certain stuff.",
        category: "OTHER",
        options: [true, false],
    },

    gameSpeed: {
        defaultSetting: "Active",
        name: "Playstyle",
        desc: "How you prefer the game. It will adjust to fit your choice.",
        category: "OTHER",
        options: [/* "Idle",  */ "Inactive", "Active"],
        onChange() {
            main.applyProgressionSpeed();
        },
    },

    updateCheck: {
        defaultSetting: true,
        name: "Check for updates",
        desc: "Whether to notify you of new updates.",
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
        name: "Offline Progress",
        desc: "Whether to calculate offline progress.",
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
            log.addMessage(
                "Now autosaving every " +
                    SharkGame.Settings.current.autosaveFrequency +
                    " minute" +
                    sharktext.plural(SharkGame.Settings.current.autosaveFrequency) +
                    "."
            );
        },
    },
};

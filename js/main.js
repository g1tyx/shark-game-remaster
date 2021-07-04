"use strict";
/* eslint-disable-next-line no-var, no-use-before-define, no-shadow */
var SharkGame = SharkGame || {};

window.onmousemove = (event) => {
    const tooltip = document.getElementById("tooltipbox");
    if (!tooltip) return;
    const posX = event.clientX;
    const posY = event.clientY;

    const tooltipStyle = getComputedStyle(tooltip);

    // get visual width in px, plus 15px offset from cursor
    const tooltipWidth = [
        tooltipStyle.width,
        tooltipStyle.paddingLeft,
        tooltipStyle.paddingRight,
        tooltipStyle.borderLeft,
        tooltipStyle.borderRight,
        tooltipStyle.marginLeft,
        tooltipStyle.marginRight,
    ].reduce((prev, cur) => prev + parseInt(cur), 0);

    tooltip.style.top = posY - 20 + "px";
    // Would clip over right screen edge
    if (tooltipWidth + posX + 35 > window.innerWidth) {
        tooltip.style.left = posX - 10 - tooltipWidth + "px";
    } else {
        tooltip.style.left = posX + 15 + "px";
    }
};

// CORE VARIABLES AND HELPER FUNCTIONS
$.extend(SharkGame, {
    GAME_NAMES: [
        "Five Seconds A Shark",
        "Next Shark Game",
        "Next Shark Game: Barkfest",
        "Sharky Clicker",
        "Weird Oceans",
        "You Have To Name The Shark Game",
        "Shark A Lark",
        "Bark Shark",
        "Fin Idle",
        "Ray of Dreams",
        "Shark Saver",
        "Shoal Sharker",
        "Shark Souls",
        "Saucy Sharks",
        "Sharkfall",
        "Heart of Sharkness",
        "Sharks and Recreation",
        "Alone in the Shark",
        "Sharkpocalypse",
        "Shark of Darkness",
        "Strange Oceans",
        "A New Frontier",
        "Lobster's Paradise",
        "Revenge of the Crabs",
        "Shark Box",
        "Dolphin Heroes",
        "Maws",
        "Sharky's Strange Crusade: Part 6",
        "Sailor Crab",
        "League of Lobsters",
        "Eel Team Six",
        "Dungeons And Dolphins",
        "Gameshark",
        "Sharkiplier Plays",
        "Five Nights in Frigid",
        "The Shark of Wall Street",
        ":the shark game:",
        "Sharkware Edition",
        "Help Wanted",
        "NOT FINISHED",
        "Deluxe",
        "doo doo do do do do",
    ],
    GAME_NAME: null,
    ACTUAL_GAME_NAME: "Shark Game",
    VERSION: "0.2 OPEN ALPHA",
    ORIGINAL_VERSION: 0.71,
    VERSION_NAME: "New Perspectives",
    EPSILON: 1e-6, // floating point comparison is a joy
    // agreed, already had to deal with it on recycler revisions
    // did you know that reducing a float like 1.2512351261 to 1.25 by literally removing the decimal and multiplying by 100 gives you something like 125.0000001?

    INTERVAL: 1000 / 10, // 20 FPS // I'm pretty sure 1000 / 10 comes out to 10 FPS
    dt: 1 / 10,
    before: new Date(),

    timestampLastSave: false,
    timestampGameStart: false,
    timestampRunStart: false,
    timestampRunEnd: false,
    timestampSimulated: false,

    sidebarHidden: true,
    paneGenerated: false,

    gameOver: false,
    wonGame: false,

    cheatsAndDebug: {
        pause: false,
        stop: false,
        speed: 1,
        chunky: false,
        cycling: false,
        cycleStyles(time = 2000) {
            if (cad.cycling) return;
            cad.cycling = true;
            let i = 0;
            let intervalId = NaN;
            function nextStyle() {
                if (i >= gateway.allowedWorlds.length && !isNaN(intervalId)) {
                    clearInterval(intervalId);
                } else {
                    world.worldType = gateway.allowedWorlds[i++];
                    console.debug(`worldType now ${world.worldType}`);
                }
            }
            setTimeout(nextStyle);
            intervalId = setInterval(nextStyle, time);
            cad.cycling = false;
        },

        discoverAll() {
            $.each(SharkGame.Tabs, (tabName) => {
                if (tabName !== "current") {
                    main.discoverTab(tabName);
                }
            });
        },

        giveEverything(amount = 1) {
            SharkGame.ResourceMap.forEach((_resource, resourceId) => {
                res.changeResource(resourceId, amount);
            });
        },
    },

    credits:
        "<p>This game was originally created in 3 days for Seamergency 2014.<br/>" +
        "<span class='smallDesc'>(Technically it was 4 days, but sometimes plans go awry.)</span></p>" +
        "<p>It was made by <a href='http://cirri.al'>Cirr</a> who needs to update his website.<br/>" +
        "He has a rarely updated <a href='https://twitter.com/Cirrial'>Twitter</a> though.</p>" +
        "<p>Additional code and credit help provided by Dylan and Sam Red.<br/>" +
        "<span class='smallDesc'>Dylan is also graciously hosting the original game.</span></p>" +
        "<br><p><a href='https://github.com/spencers145/SharkGame'>NEW FRONTIERS</a> created by base4/spencers145,<br/>" +
        "with spritework help from <a href='https://twitter.com/vhs_static'>@vhs_static</a> and friends,<br/>" +
        "and with a little help from <a href='https://github.com/stampyzfanz'>Ixbixbam</a>.<br/>" +
        "<span class='smallDesc'>Ixbix's games at his little corner of the internet are </span><a href='https://stampyzfanz.github.io/games'>here</a><span class='smallDesc'>.</span><br/>" +
        '<span style="color: rgba(0,0,0,0);">With some help by <a href="https://github.com/Toby222" style="color: rgba(0,0,0,0);">Toby</a></span><br/>',

    ending:
        "<p>Congratulations! You did it.<br/>You saved the sharks!</p>" +
        "<p>The gate leads away from this strange ocean...</p>" +
        "<p>Back home to the oceans you came from!</p>" +
        "<h3>Or are they?</h3>",

    help:
        "<p>This game is a game about discovery, resources, and does not demand your full attention. " +
        "You are free to pay as much attention to the game as you want. " +
        "It will happily run in the background, and works even while closed.</p>" +
        "<p>To begin, you should catch fish. Once you have some fish, more actions will become available. " +
        "<p>If you are ever stuck, try actions you haven't yet tried. " +
        "<p>If you are here because you think you have encountered a bug of some kind, or you really need help, report it on the <a href='https://discord.gg/nN7BQDJR2G' target='blank_'>discord</a>.</p>",

    donate:
        "<p>You can <a href='https://www.sharktrust.org/Listing/Category/donate' target='_blank'>donate to help save sharks and mantas</a>!</p>" +
        "<p>Seems only fitting, given this game was made for a charity stream!</p>" +
        "<p><span class='smallDescAllowClicks'>(But if you'd rather, you can also " +
        "<a href='https://www.paypal.com/cgi-bin/" +
        "webscr?cmd=_donations&business=G3WPPAYAWTJCJ&lc=GB&" +
        "item_name=Shark%20Game%20Developer%20Support&" +
        "item_number=Shark%20Game%20Support&no_note=1&" +
        "no_shipping=1&currency_code=USD&" +
        "bn=PP%2dDonationsBF%3adonate%2epng%3aNonHosted' " +
        "target='_blank'>support the original developer</a>" +
        " if you'd like.)</span></p>",

    notice:
        "<p>Welcome to the open <b>alpha</b> of v0.2 for New Frontiers.</p>" +
        "<p>v0.2 is a total rework.<br/>Currently, only two worlds (besides starter) are playable.<br><b>Things will be missing.</b> New stuff will be added.</p>" +
        "<p>To give feedback or contribute, check out our <a href='https://discord.gg/eYqApFkFPY'>Discord</a>.</p>" +
        "<p>To play the stable version (with all planets), visit <a href='https://spencers145.github.io/SharkGame/'>this link</a>.</p>",

    spriteIconPath: "img/sharksprites.png",
    spriteHomeEventPath: "img/sharkeventsprites.png",

    /**
     *
     * @param {any[]} choices
     * @returns {any} A random element of choices
     */
    choose(choices) {
        return choices[Math.floor(Math.random() * choices.length)];
    },
    plural(number) {
        return number === 1 ? "" : "s";
    },
    colorLum(hex, lum) {
        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, "");
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        let rgb = "#";
        for (let i = 0; i < 3; i++) {
            let color = parseInt(hex.substr(i * 2, 2), 16);
            color = Math.round(Math.min(Math.max(0, color + color * lum), 255)).toString(16);
            rgb += ("00" + color).substr(color.length);
        }

        return rgb;
    },
    getColorValue(color) {
        color = String(color).replace(/[^0-9a-f]/gi, "");
        return Math.max(parseInt(color.substr(0, 2), 16), parseInt(color.substr(2, 2), 16), parseInt(color.substr(4, 2), 16));
    },
    getRelativeLuminance(color) {
        color = String(color).replace(/[^0-9a-f]/gi, "");
        let red = parseInt(color.substr(0, 2), 16);
        let green = parseInt(color.substr(2, 2), 16);
        let blue = parseInt(color.substr(4, 2), 16);
        red = red / 255;
        green = green / 255;
        blue = blue / 255;
        let lum = 0;
        _.each([red, green, blue], (piece, index) => {
            if (piece <= 0.03928) {
                piece = piece / 12.92;
            } else {
                piece = ((piece + 0.055) / 1.055) ** 2.4;
            }
            lum += piece * [0.2126, 0.7152, 0.0722][index];
        });
        return lum;
    },
    correctLuminance(color, luminance) {
        color = String(color).replace(/[^0-9a-f]/gi, "");
        let red = parseInt(color.substr(0, 2), 16);
        let green = parseInt(color.substr(2, 2), 16);
        let blue = parseInt(color.substr(4, 2), 16);
        red = red / 255;
        green = green / 255;
        blue = blue / 255;
        const varA = 1.075 * (0.2126 * red ** 2 + 0.7152 * green ** 2 + 0.0722 * blue ** 2);
        const varB = -0.075 * (0.2126 * red + 0.7152 * green + 0.0722 * blue);
        const ratio = Math.max((-varB + Math.sqrt(varB ** 2 + 4 * varA * luminance)) / (2 * varA), 0);
        red = parseInt(Math.min(255, 255 * red * ratio).toFixed(0)).toString(16);
        green = parseInt(Math.min(255, 255 * green * ratio).toFixed(0)).toString(16);
        blue = parseInt(Math.min(255, 255 * blue * ratio).toFixed(0)).toString(16);
        return "#" + red + green + blue;
    },
    convertColorString(color) {
        const colors = color
            .substring(4)
            .replace(/[^0-9a-f]/gi, " ")
            .split(" ");
        let colorstring = "#";
        for (let i = 0; i < 3; i++) {
            colorstring += ("00" + parseInt(colors[i * 2]).toString(16)).substr(parseInt(colors[i * 2]).toString(16).length);
        }
        return colorstring;
    },
    getElementColor(id, propertyName) {
        const color = getComputedStyle(document.getElementById(id)).getPropertyValue(propertyName);
        return SharkGame.convertColorString(color);
    },
    /** @param {string} string */
    boldString(string) {
        return `<span class='bold'>${string}</span>`;
    },
    getImageIconHTML(imagePath, width, height) {
        if (!imagePath) {
            imagePath = "http://placekitten.com/g/" + Math.floor(width) + "/" + Math.floor(height);
        }
        let imageHtml = "";
        if (SharkGame.Settings.current.iconPositions !== "off") {
            imageHtml += "<img width=" + width + " height=" + height + " src='" + imagePath + "' class='button-icon'>";
        }
        return imageHtml;
    },
    changeSprite(spritePath, imageName, imageDiv, backupImageName) {
        let spriteData = SharkGame.Sprites[imageName];
        if (!imageDiv) {
            imageDiv = $("<div>");
        }

        // if the original sprite data is undefined, try loading the backup
        if (!spriteData) {
            spriteData = SharkGame.Sprites[backupImageName];
        }

        if (spriteData) {
            imageDiv.css("background-image", "url(" + spritePath + ")");
            imageDiv.css("background-position", "-" + spriteData.frame.x + "px -" + spriteData.frame.y + "px");
            imageDiv.width(spriteData.frame.w);
            imageDiv.height(spriteData.frame.h);
        } else {
            imageDiv.css("background-image", 'url("//placehold.it/50x50")');
            imageDiv.width(50);
            imageDiv.height(50);
        }
        return imageDiv;
    },
});

SharkGame.TitleBar = {
    saveLink: {
        name: "save",
        main: true,
        onClick() {
            try {
                SharkGame.Save.saveGame();
            } catch (err) {
                SharkGame.Log.addError(err);
            }
            SharkGame.Log.addMessage("Saved game.");
        },
    },

    optionsLink: {
        name: "options",
        main: true,
        onClick() {
            main.showOptions();
        },
    },

    changelogLink: {
        name: "changelog",
        main: false,
        onClick() {
            main.showChangelog();
        },
    },

    helpLink: {
        name: "help",
        main: true,
        onClick() {
            main.showHelp();
        },
    },

    skipLink: {
        name: "skip",
        main: true,
        onClick() {
            if (main.isFirstTime()) {
                // save people stranded on home world
                if (confirm("Do you want to reset your game?")) {
                    // just reset
                    main.init();
                }
            } else if (confirm("Is this world causing you too much trouble? Want to go back to the gateway?")) {
                SharkGame.wonGame = false;
                main.endGame();
            }
        },
    },

    creditsLink: {
        name: "credits",
        main: false,
        onClick() {
            main.showPane("Credits", SharkGame.credits);
        },
    },

    donateLink: {
        name: "donate",
        main: false,
        onClick() {
            main.showPane("Donate", SharkGame.donate);
        },
    },

    discordLink: {
        name: "discord",
        main: false,
        link: "https://discord.gg/eYqApFkFPY",
    },

    noticeLink: {
        name: "notice",
        main: false,
        onClick() {
            main.showPane("v0.2 OPEN ALPHA NOTICE", SharkGame.notice);
        },
    },
};

SharkGame.Tabs = {
    current: "home",
};

SharkGame.Main = {
    tickHandler: -1,
    autosaveHandler: -1,

    beautify(number, suppressDecimals, toPlaces) {
        let formatted;

        let negative = false;
        if (number < 0) {
            negative = true;
            number *= -1;
        }

        if (number === Number.POSITIVE_INFINITY) {
            formatted = "infinite";
        } else if (number < 1 && number >= 0) {
            if (suppressDecimals) {
                formatted = "0";
            } else if (number >= 0.01) {
                formatted = number.toFixed(2) + "";
            } else if (number >= 0.001) {
                formatted = number.toFixed(3) + "";
            } else if (number >= 0.0001) {
                formatted = number.toFixed(4) + "";
            } else if (number >= 0.00001) {
                // number > 0.00001 && negative -> number > 0.00001 && number < 0 -> false
                formatted = number.toFixed(5) + "";
            } else {
                formatted = "0";
            }

            if (negative) {
                formatted = "-" + formatted;
            }
        } else {
            const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
            const digits = Math.floor(Math.log10(number));
            // Max for a case where the supported suffix is not specified
            const precision = Math.max(0, 2 - (digits % 3));
            const suffixIndex = Math.floor(digits / 3);

            let suffix;
            if (suffixIndex >= suffixes.length) {
                formatted = "lots";
            } else {
                suffix = suffixes[suffixIndex];
                // fix number to be compliant with suffix
                if (suffixIndex > 0) {
                    number /= Math.pow(1000, suffixIndex);
                }
                let formattedNumber;
                if (suffixIndex === 0) {
                    if (toPlaces && toPlaces - digits > 0 && number !== Math.floor(number)) {
                        formattedNumber = number.toFixed(toPlaces - digits);
                    } else {
                        formattedNumber = Math.floor(number);
                    }
                } else if (suffixIndex > 0) {
                    formattedNumber = number.toFixed(precision) + suffix;
                } else {
                    formattedNumber = number.toFixed(precision);
                }
                formatted = (negative ? "-" : "") + formattedNumber;
            }
        }

        return formatted;
    },

    beautifyIncome(number, also = "") {
        const abs = Math.abs(number);
        if (abs >= 0.001) {
            number = main.beautify(number, false, 2);
            number += also;
            number += "/s";
        } else if (abs > 0.000001) {
            number *= 3600;
            number = number.toFixed(3);
            number += also;
            number += "/h";
        } else {
            number = 0 + "/s";
        }
        return number;
    },

    applyFramerate() {
        SharkGame.INTERVAL = 1000 / SharkGame.Settings.current.framerate;
        SharkGame.dt = 1 / SharkGame.Settings.current.framerate;
        if (main.tickHandler) {
            clearInterval(main.tickHandler);
        }
        main.tickHandler = setInterval(main.tick, SharkGame.INTERVAL);
    },

    formatTime(milliseconds) {
        const numSeconds = Math.floor(milliseconds / 1000);
        const numMinutes = Math.floor(numSeconds / 60);
        const numHours = Math.floor(numMinutes / 60);
        const numDays = Math.floor(numHours / 24);
        const numWeeks = Math.floor(numDays / 7);
        const numMonths = Math.floor(numWeeks / 4);
        const numYears = Math.floor(numMonths / 12);

        const formatSeconds = (numSeconds % 60).toString(10).padStart(2, "0");
        const formatMinutes = numMinutes > 0 ? (numMinutes % 60).toString(10).padStart(2, "0") + ":" : "";
        const formatHours = numHours > 0 ? (numHours % 24).toString() + ":" : "";
        const formatDays = numDays > 0 ? (numDays % 7).toString() + "D, " : "";
        const formatWeeks = numWeeks > 0 ? (numWeeks % 4).toString() + "W, " : "";
        const formatMonths = numMonths > 0 ? (numMonths % 12).toString() + "M, " : "";
        const formatYears = numYears > 0 ? numYears.toString() + "Y, " : "";

        return formatYears + formatMonths + formatWeeks + formatDays + formatHours + formatMinutes + formatSeconds;
    },

    // credit where it's due, i didn't write this (regexes fill me with fear), pulled from
    // http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript/196991#196991
    toTitleCase(str) {
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    },

    // also functions as a reset
    init(foregoLoad) {
        const now = _.now();
        SharkGame.before = now;
        SharkGame.timestampSimulated = now;
        if (SharkGame.GAME_NAME === null) {
            SharkGame.GAME_NAME = SharkGame.choose(SharkGame.GAME_NAMES);
            document.title = SharkGame.ACTUAL_GAME_NAME + ": " + SharkGame.GAME_NAME;
        }
        $("#sidebar").hide();
        const overlay = $("#overlay");
        overlay.hide();
        $("#gameName").html("- " + SharkGame.GAME_NAME + " -");
        $("#versionNumber").html(
            `New Frontiers v ${SharkGame.VERSION} - ${SharkGame.VERSION_NAME}<br/>\
Mod of v ${SharkGame.ORIGINAL_VERSION}`
        );
        $.getJSON("https://api.github.com/repos/Toby222/SharkGame/commits/dev", (data) => {
            SharkGame.COMMIT_SHA = data.sha;
        });
        SharkGame.sidebarHidden = true;
        SharkGame.gameOver = false;

        // remove any errant classes
        $("#pane").removeClass("gateway");
        overlay.removeClass("gateway");

        // initialise timestamps to something sensible
        SharkGame.timestampLastSave = SharkGame.timestampLastSave || now;
        SharkGame.timestampGameStart = SharkGame.timestampGameStart || now;
        SharkGame.timestampRunStart = SharkGame.timestampRunStart || now;

        // create the tooltip box

        // initialise and reset resources
        SharkGame.Resources.init();

        // initialise world
        // MAKE SURE GATE IS INITIALISED AFTER WORLD!!
        SharkGame.World.init();
        SharkGame.World.apply();

        SharkGame.Gateway.init();

        // generate requiredBy entries
        SharkGame.AspectTree.init();

        // initialise tabs
        SharkGame.Home.init();
        SharkGame.Lab.init();
        SharkGame.Stats.init();
        SharkGame.Recycler.init();
        SharkGame.Gate.init();
        SharkGame.Reflection.init();

        SharkGame.Main.setUpTitleBar();

        SharkGame.Tabs.current = "home";

        // preserve settings or set defaults
        $.each(SharkGame.Settings, (settingName, setting) => {
            if (settingName === "current") {
                return;
            }
            const currentSetting = SharkGame.Settings.current[settingName];
            if (typeof currentSetting === "undefined") {
                SharkGame.Settings.current[settingName] = setting.defaultSetting;
            }
            // apply all settings as a failsafe
            if (_.has(setting, "onChange")) {
                setting.onChange();
            }
        });

        // load save game data if present
        if (SharkGame.Save.savedGameExists() && !foregoLoad) {
            try {
                SharkGame.Save.loadGame();
                SharkGame.Log.addMessage("Loaded game.");
            } catch (err) {
                SharkGame.Log.addError(err);
            }
        } else {
            SharkGame.AspectTree.applyAspects();
            SharkGame.EventHandler.init();
        }

        // rename a game option if this is a first time run
        if (main.isFirstTime()) {
            SharkGame.TitleBar.skipLink.name = "reset";
            main.setUpTitleBar();
            main.showPane("v0.2 OPEN ALPHA NOTICE", SharkGame.notice);
        } else {
            // and then remember to actually set it back once it's not
            SharkGame.TitleBar.skipLink.name = "skip";
            main.setUpTitleBar();
        }

        // discover actions that were present in last save
        home.discoverActions();

        // set up tab after load
        main.setUpTab();

        // apply tick settings
        main.applyFramerate();

        if (main.autosaveHandler === -1) {
            main.autosaveHandler = setInterval(main.autosave, SharkGame.Settings.current.autosaveFrequency * 60000);
        }

        if (SharkGame.Settings.current.updateCheck) {
            SharkGame.Main.checkForUpdateHandler = setInterval(main.checkForUpdate, 300000);
        }

        $("#title").on("click", (event) => {
            if (event.clientX < 100 && event.clientY > 150 && event.clientY < 200) {
                event.currentTarget.classList.add("radical");
            }
        });
    },

    tick() {
        if (SharkGame.cheatsAndDebug.pause) {
            SharkGame.before = _.now();
            return;
        }
        if (SharkGame.cheatsAndDebug.stop) {
            return;
        }
        if (!SharkGame.gameOver) {
            SharkGame.EventHandler.handleEventTick("beforeTick");

            // tick main game stuff
            const now = _.now();
            const elapsedTime = now - SharkGame.before;
            // check if the sidebar needs to come back
            if (SharkGame.sidebarHidden) {
                main.showSidebarIfNeeded();
            }

            if (elapsedTime > SharkGame.INTERVAL) {
                // Compensate for lost time.
                main.processSimTime(SharkGame.dt * (elapsedTime / SharkGame.INTERVAL));
            } else {
                main.processSimTime(SharkGame.dt);
            }
            res.updateResourcesTable();

            const tabCode = SharkGame.Tabs[SharkGame.Tabs.current].code;
            tabCode.update();

            main.checkTabUnlocks();

            SharkGame.before = now;

            SharkGame.EventHandler.handleEventTick("afterTick");
        }

        //see if resource table tooltip needs updating
        if (document.getElementById("tooltipbox").className.split(" ").includes("forIncomeTable")) {
            if (document.getElementById("tooltipbox").attributes.current) {
                res.tableTextEnter(null, document.getElementById("tooltipbox").attributes.current.value);
            }
        }
    },

    checkTabUnlocks() {
        $.each(SharkGame.Tabs, (tabName, tab) => {
            if (tabName === "current" || tab.discovered) {
                return;
            }
            let reqsMet = true;

            // check resources
            if (tab.discoverReq.resource) {
                reqsMet = reqsMet && res.checkResources(tab.discoverReq.resource, true);
            }

            const upgradeTable = SharkGame.Upgrades.getUpgradeTable();
            // check upgrades
            if (tab.discoverReq.upgrade) {
                let anyUpgradeExists = false;
                _.each(tab.discoverReq.upgrade, (upgradeName) => {
                    if (upgradeTable[upgradeName]) {
                        anyUpgradeExists = true;
                        reqsMet &&= SharkGame.Upgrades.purchased.includes(upgradeName);
                    }
                });
                if (!anyUpgradeExists) {
                    reqsMet = false;
                }
            }

            if (reqsMet) {
                // unlock tab!
                main.discoverTab(tabName);
                SharkGame.Log.addDiscovery("Discovered " + tab.name + "!");
            }
        });
    },

    processSimTime(numberOfSeconds, load = false) {
        // income calculation
        res.processIncomes(numberOfSeconds, false, load);
    },

    autosave() {
        try {
            SharkGame.Save.saveGame();
            SharkGame.Log.addMessage("Autosaved.");
        } catch (err) {
            SharkGame.Log.addError(err);
        }
    },

    checkForUpdate() {
        $.getJSON("https://api.github.com/repos/Toby222/SharkGame/commits/dev", (data) => {
            if (data.sha !== SharkGame.COMMIT_SHA) {
                $("#updateGameBox")
                    .html("You see a new update swimming towards you. Click to update.")
                    .on("click", () => {
                        try {
                            SharkGame.Save.saveGame();
                            history.go(0);
                        } catch (err) {
                            SharkGame.Log.addError(err);
                            console.error(err);
                            SharkGame.Log.addMessage("Something went wrong while saving.");
                        }
                    });
            }
        });
    },

    setUpTitleBar() {
        const titleMenu = $("#titlemenu");
        const subTitleMenu = $("#subtitlemenu");
        titleMenu.empty();
        subTitleMenu.empty();
        $.each(SharkGame.TitleBar, (linkId, linkData) => {
            let option;
            if (linkData.link) {
                option = "<li><a id='" + linkId + "' href='" + linkData.link + "' target='_blank'>" + linkData.name + "</a></li>";
            } else {
                option = "<li><a id='" + linkId + "' href='javascript:;'>" + linkData.name + "</a></li>";
            }
            if (linkData.main) {
                titleMenu.append(option);
            } else {
                subTitleMenu.append(option);
            }
            $("#" + linkId).on("click", linkData.onClick);
        });
    },

    setUpTab() {
        const tabs = SharkGame.Tabs;
        // empty out content div
        const content = $("#content");

        content.empty();
        content.append('<div id="contentMenu"><ul id="tabList"></ul><ul id="tabButtons"></ul></div><div id="tabBorder" class="clear-fix"></div>');

        main.createTabNavigation();
        main.createBuyButtons();

        // set up tab specific stuff
        const tab = tabs[tabs.current];
        const tabCode = tab.code;
        tabCode.switchTo();
    },

    createTabMenu() {
        main.createTabNavigation();
        main.createBuyButtons();
    },

    createTabNavigation() {
        const tabs = SharkGame.Tabs;
        const tabList = $("#tabList");
        tabList.empty();
        // add navigation
        // check if we have more than one discovered tab, else bypass this
        let numTabsDiscovered = 0;
        $.each(tabs, (_tabName, tab) => {
            if (tab.discovered) {
                numTabsDiscovered++;
            }
        });
        if (numTabsDiscovered > 1) {
            // add a header for each discovered tab
            // make it a link if it's not the current tab
            $.each(tabs, (tabId, tabData) => {
                const onThisTab = SharkGame.Tabs.current === tabId;
                if (tabData.discovered) {
                    const tabListItem = $("<li>");
                    if (onThisTab) {
                        tabListItem.html(tabData.name);
                    } else {
                        tabListItem.append(
                            $("<a>")
                                .attr("id", "tab-" + tabId)
                                .attr("href", "javascript:;")
                                .html(tabData.name)
                                .on("click", function callback() {
                                    const tab = $(this).attr("id").split("-")[1];
                                    main.changeTab(tab);
                                })
                        );
                    }
                    tabList.append(tabListItem);
                }
            });
        }
    },

    createBuyButtons(customLabel) {
        // add buy buttons
        const buttonList = $("#tabButtons");
        buttonList.empty();
        _.each(SharkGame.Settings.buyAmount.options, (amount) => {
            const disableButton = amount === SharkGame.Settings.current.buyAmount;
            buttonList.append(
                $("<li>").append(
                    $("<button>")
                        .addClass("min" + (disableButton ? " disabled" : ""))
                        .attr("id", "buy-" + amount)
                )
            );
            let label = customLabel ? customLabel + " " : "buy ";
            if (amount < 0) {
                if (amount < -2) {
                    label += "1/3 max";
                } else if (amount < -1) {
                    label += "1/2 max";
                } else {
                    label += "max";
                }
            } else if (amount === "custom") {
                label += "custom";
            } else {
                label += main.beautify(amount);
            }
            $("#buy-" + amount)
                .html(label)
                .on("click", function callback() {
                    const thisButton = $(this);
                    if (thisButton.hasClass("disabled")) return;
                    if (thisButton[0].id === "buy-custom") {
                        $("#custom-input").attr("disabled", false);
                    } else {
                        $("#custom-input").attr("disabled", true);
                    }
                    SharkGame.Settings.current.buyAmount = amount === "custom" ? "custom" : parseInt(thisButton.attr("id").slice(4));
                    $("button[id^='buy-']").removeClass("disabled");
                    thisButton.addClass("disabled");
                });
        });
        buttonList.append(
            $("<li>").append(
                $("<input>")
                    .prop("type", "number")
                    .attr("id", "custom-input")
                    .attr("value", 1)
                    .attr("min", "1")
                    .attr("disabled", SharkGame.Settings.current.buyAmount !== "custom")
            )
        );
        document.getElementById("custom-input").addEventListener("input", main.onCustomChange);
        if (SharkGame.Settings.current.customSetting) {
            $("#custom-input")[0].value = SharkGame.Settings.current.customSetting;
        }
    },

    onCustomChange() {
        SharkGame.Settings.current.customSetting = $("#custom-input")[0].value;
    },

    getBuyAmount() {
        if (SharkGame.Settings.current.buyAmount === "custom") {
            return Math.floor($("#custom-input")[0].valueAsNumber) >= 1 && $("#custom-input")[0].valueAsNumber < 1e18
                ? Math.floor($("#custom-input")[0].valueAsNumber)
                : 1;
        } else {
            return SharkGame.Settings.current.buyAmount;
        }
    },

    changeTab(tab) {
        SharkGame.Tabs.current = tab;
        main.setUpTab();
    },

    discoverTab(tab) {
        SharkGame.Tabs[tab].discovered = true;
        // force a total redraw of the navigation
        main.createTabMenu();
    },

    showSidebarIfNeeded() {
        // if we have any non-zero resources, show sidebar
        // if we have any log entries, show sidebar
        if (res.haveAnyResources() || SharkGame.Log.haveAnyMessages()) {
            // show sidebar
            if (SharkGame.Settings.current.showAnimations) {
                $("#sidebar").show("500");
            } else {
                $("#sidebar").show();
            }
            // flag sidebar as shown
            SharkGame.sidebarHidden = false;
        }
    },

    showOptions() {
        const optionsContent = main.setUpOptions();
        main.showPane("Options", optionsContent);
    },

    setUpOptions() {
        const optionsTable = $("<table>").attr("id", "optionTable");
        // add settings specified in settings.js
        const categories = {};
        $.each(SharkGame.Settings, (name, setting) => {
            if (typeof setting.category === "string") {
                if (!categories[setting.category]) {
                    categories[setting.category] = [];
                }
                categories[setting.category].push(name);
            }
        });

        $.each(categories, (category, settings) => {
            optionsTable.append($("<tr>").html("<br><span style='text-decoration: underline'>" + category.bold() + "</span>"));
            _.each(settings, (settingName) => {
                const setting = SharkGame.Settings[settingName];
                if (settingName === "current") {
                    return;
                }
                const optionRow = $("<tr>");

                // show setting name
                optionRow.append(
                    $("<td>")
                        .addClass("optionLabel")
                        .html(setting.name + ":" + "<br/><span class='smallDesc'>(" + setting.desc + ")</span>")
                );

                const currentSetting = SharkGame.Settings.current[settingName];

                // show setting adjustment buttons
                $.each(setting.options, (index, optionValue) => {
                    const isSelectedOption = optionValue === currentSetting;
                    optionRow.append(
                        $("<td>").append(
                            $("<button>")
                                .attr("id", "optionButton-" + settingName + "-" + index)
                                .addClass("option-button" + (isSelectedOption ? " disabled" : ""))
                                .html(typeof optionValue === "boolean" ? (optionValue ? "on" : "off") : optionValue)
                                .on("click", main.onOptionClick)
                        )
                    );
                });

                optionsTable.append(optionRow);
            });
        });

        // SAVE IMPORT/EXPORT
        // add save import/export
        let row = $("<tr>");
        row.append(
            $("<td>").html(
                "Import/Export Save:<br/><span class='smallDesc'>(You should probably save first!) Import or export save as text. Keep it safe!</span>"
            )
        );
        row.append(
            $("<td>").append(
                $("<button>")
                    .html("import")
                    .addClass("option-button")
                    .on("click", function callback() {
                        if ($(this).hasClass("disabled")) return;
                        const importText = $("#importExportField").val();
                        if (importText === "") {
                            SharkGame.Main.hidePane();
                            SharkGame.Log.addError("You need to paste something in first!");
                        } else if (confirm("Are you absolutely sure? This will override your current save.")) {
                            SharkGame.Save.importData(importText);
                        }
                    })
            )
        );
        row.append(
            $("<td>").append(
                $("<button>")
                    .html("export")
                    .addClass("option-button")
                    .on("click", function callback() {
                        if ($(this).hasClass("disabled")) return;
                        $("#importExportField").val(SharkGame.Save.exportData());
                    })
            )
        );
        // add the actual text box
        row.append($("<td>").attr("colSpan", 4).append($("<input>").attr("type", "text").attr("id", "importExportField")));
        optionsTable.append(row);

        // SAVE WIPE
        // add save wipe
        row = $("<tr>");
        row.append(
            $("<td>").html("Wipe Save<br/><span class='smallDesc'>(Completely wipe your save and reset the game. COMPLETELY. FOREVER.)</span>")
        );
        row.append(
            $("<td>").append(
                $("<button>")
                    .html("wipe")
                    .addClass("option-button")
                    .on("click", () => {
                        if (confirm("Are you absolutely sure you want to wipe your save?\nIt'll be gone forever!")) {
                            SharkGame.Save.wipeSave();
                        }
                    })
            )
        );
        optionsTable.append(row);
        return optionsTable;
    },

    onOptionClick() {
        if ($(this).hasClass("disabled")) return;
        const buttonLabel = $(this).attr("id");
        const settingInfo = buttonLabel.split("-");
        const settingName = settingInfo[1];
        const optionIndex = parseInt(settingInfo[2]);

        // change setting to specified setting!
        SharkGame.Settings.current[settingName] = SharkGame.Settings[settingName].options[optionIndex];

        // update relevant table cell!
        // $('#option-' + settingName)
        //     .html("(" + ((typeof newSetting === "boolean") ? (newSetting ? "on" : "off") : newSetting) + ")");

        // enable all buttons
        $('button[id^="optionButton-' + settingName + '"]').removeClass("disabled");

        // disable this button
        $(this).addClass("disabled");

        // if there is a callback, call it, else call the no op
        (SharkGame.Settings[settingName].onChange || $.noop)();
    },

    showChangelog() {
        const changelogContent = $("<div>").attr("id", "changelogDiv");
        $.each(SharkGame.Changelog, (version, changes) => {
            const segment = $("<div>").addClass("paneContentDiv");
            segment.append($("<h3>").html(version + ": "));
            const changeList = $("<ul>");
            _.each(changes, (changeLogEntry) => {
                changeList.append($("<li>").html(changeLogEntry));
            });
            segment.append(changeList);
            changelogContent.append(segment);
        });
        main.showPane("Changelog", changelogContent);
    },

    showHelp() {
        const helpDiv = $("<div>");
        helpDiv.append($("<div>").append(SharkGame.help).addClass("paneContentDiv"));
        main.showPane("Help", helpDiv);
    },

    endGame(loadingFromSave) {
        // stop autosaving
        clearInterval(main.autosaveHandler);
        main.autosaveHandler = -1;

        // flag game as over
        SharkGame.gameOver = true;

        // grab end game timestamp
        SharkGame.timestampRunEnd = _.now();

        // kick over to passage
        gateway.enterGate(loadingFromSave);
    },

    purgeGame() {
        // empty out all the containers!
        $("#status").empty();
        SharkGame.Log.clearMessages();
        $("#content").empty();
    },

    loopGame() {
        if (SharkGame.gameOver) {
            SharkGame.gameOver = false;
            SharkGame.wonGame = false;
            main.hidePane();

            // copy over all special category resources
            // aspects are preserved automatically within gateway file
            const backup = {};
            _.each(SharkGame.ResourceCategories.special.resources, (resourceName) => {
                backup[resourceName] = {
                    amount: res.getResource(resourceName),
                    totalAmount: res.getTotalResource(resourceName),
                };
            });

            SharkGame.timestampRunStart = _.now();
            main.init(true);
            SharkGame.Log.addMessage(world.getWorldEntryMessage());

            // restore special resources
            $.each(backup, (resourceName, resourceData) => {
                res.setResource(resourceName, resourceData.amount);
                res.setTotalResource(resourceName, resourceData.totalAmount);
            });

            try {
                SharkGame.Save.saveGame();
                SharkGame.Log.addMessage("Game saved.");
            } catch (err) {
                SharkGame.Log.addError(err);
            }
        }
    },

    buildPane() {
        const pane = $("<div>").attr("id", "pane");
        $("body").append(pane);

        // set up structure of pane
        const titleDiv = $("<div>").attr("id", "paneHeader");
        titleDiv.append($("<div>").attr("id", "paneHeaderTitleDiv"));
        titleDiv.append(
            $("<div>")
                .attr("id", "paneHeaderCloseButtonDiv")
                .append($("<button>").attr("id", "paneHeaderCloseButton").addClass("min close-button").html("✕").on("click", main.hidePane))
        );
        pane.append(titleDiv);
        pane.append($("<div>").attr("id", "paneHeaderEnd").addClass("clear-fix"));
        pane.append($("<div>").attr("id", "paneContent"));

        pane.hide();
        SharkGame.paneGenerated = true;
        return pane;
    },

    showPane(title, contents, hideCloseButton, fadeInTime, customOpacity) {
        let pane;

        // GENERATE PANE IF THIS IS THE FIRST TIME
        if (!SharkGame.paneGenerated) {
            pane = main.buildPane();
        } else {
            pane = $("#pane");
        }

        // begin fading in/displaying overlay if it isn't already visible
        const overlay = $("#overlay");
        // is it already up?
        fadeInTime = fadeInTime || 600;
        if (overlay.is(":hidden")) {
            // nope, show overlay
            const overlayOpacity = customOpacity || 0.5;
            if (SharkGame.Settings.current.showAnimations) {
                overlay.show().css("opacity", 0).animate({ opacity: overlayOpacity }, fadeInTime);
            } else {
                overlay.show().css("opacity", overlayOpacity);
            }
        }

        // adjust header
        const titleDiv = $("#paneHeaderTitleDiv");
        const closeButtonDiv = $("#paneHeaderCloseButtonDiv");

        if (!title || title === "") {
            titleDiv.hide();
        } else {
            titleDiv.show();
            if (!hideCloseButton) {
                // put back to left
                titleDiv.css({ float: "left", "text-align": "left", clear: "none" });
                titleDiv.html("<h3>" + title + "</h3>");
            } else {
                // center
                titleDiv.css({ float: "none", "text-align": "center", clear: "both" });
                titleDiv.html("<h2>" + title + "</h2>");
            }
        }
        if (hideCloseButton) {
            closeButtonDiv.hide();
        } else {
            closeButtonDiv.show();
        }

        // adjust content
        const paneContent = $("#paneContent");
        paneContent.empty();

        paneContent.append(contents);
        if (SharkGame.Settings.current.showAnimations && customOpacity) {
            pane.show().css("opacity", 0).animate({ opacity: 1.0 }, fadeInTime);
        } else {
            pane.show();
        }
    },

    hidePane() {
        $("#overlay").hide();
        $("#pane").hide();
    },

    isFirstTime() {
        return world.worldType === "start" && res.getTotalResource("essence") <= 0;
    },

    getDeterminer(name) {
        const firstLetter = SharkGame.ResourceMap.get(name).name.charAt(0);

        //note to self: make the next line not suck
        // Possibly add an "uncountable" property to resources somehow? Manual works fine though
        if (["algae", "coral", "spronge", "delphinium", "coralglass", "sharkonium", "residue", "tar", "ice", "science", "papyrus"].includes(name)) {
            return "";
        } else if ("aeiou".includes(firstLetter)) {
            return "an";
        } else {
            return "a";
        }
    },

    resetTimers() {
        SharkGame.timestampLastSave = _.now();
        SharkGame.timestampGameStart = _.now();
        SharkGame.timestampRunStart = _.now();
    },
};

SharkGame.Button = {
    makeHoverscriptButton(id, name, div, handler, hhandler, huhandler) {
        return $("<button>")
            .html(name)
            .attr("id", id)
            .addClass("hoverbutton")
            .appendTo(div)
            .on("click", handler)
            .on("mouseenter", hhandler)
            .on("mouseleave", huhandler);
    },

    makeButton(id, name, div, handler) {
        return $("<button>").html(name).attr("id", id).appendTo(div).on("click", handler);
    },
};

SharkGame.FunFacts = [
    "Shark Game's initial bare minimum code came from an abandoned idle game about bees. Almost no trace of bees remains!",
    "The existence of resources that create resources that create resources in this game were inspired by Derivative Clicker!",
    "Kitten Game was an inspiration for this game! This surprises probably no one. The very first message the game gives you is a nod of sorts.",
    "There have been social behaviours observed in lemon sharks, and evidence that suggests they prefer company to being alone.",
    "Sea apples are a type of sea cucumber.",
    "Magic crystals are probably not real.",
    "There is nothing suspicious about the machines.",
    "There are many species of sharks that investigate things with their mouths. This can end badly for the subject of investigation.",
    "Some shark species display 'tonic immobility' when rubbed on the nose. They stop moving, appear deeply relaxed, and can stay this way for up to 15 minutes before swimming away.",
    "In some shark species eggs hatch within their mothers, and in some of these species the hatched babies eat unfertilised or even unhatched eggs.",
    "Rays can be thought of as flattened sharks.",
    "Rays are pancakes of the sea. (note: probably not true)",
    "Chimaera are related to sharks and rays and have a venomous spine in front of their dorsal fin.",
    "More people are killed by lightning every year than by sharks.",
    "There are real eusocial shrimps that live as a community in sponges on reefs, complete with queens.",
    "White sharks have been observed to have a variety of body language signals to indicate submission and dominance towards each other without violence.",
    "Sharks with lasers were overdone, okay?",
    "There is a surprising deficit of cookie in this game.",
    "Remoras were banished from the oceans in the long bygone eras. The sharks hope they never come back.",
    "A kiss from a shark can make you immortal. But only if they want you to be immortal.",
    "A shark is worth one in the bush, and a bunch in the sea water. Don't put sharks in bushes.",
];

SharkGame.Changelog = {
    "<a href='https://github.com/spencers145/SharkGame'>New Frontiers</a> 0.2 patch 20210610a": [
        "Fixed bug where haven had no essence. Oops.",
        "Changed home messages a little.",
        "Retconned some previous patch notes.",
        "Added sprite for octopus investigator.",
        "Internal stuff.",
    ],
    "<a href='https://github.com/spencers145/SharkGame'>New Frontiers</a> 0.2 patch 20210515a": ["Added missing flavor text.", "Internal stuff."],
    "<a href='https://github.com/spencers145/SharkGame'>New Frontiers</a> 0.2 patch 20210422a": [
        "Implemented reworked gameplay for the Haven worldtype.",
        "Made sweeping changes to the UI.",
        "Improved grotto formatting.",
        "Changed the colors for Haven worlds.",
        "In the grotto, amounts for each producer now update live.",
        "Both kinds of tooltips update live.",
        "Tooltips can tell you more things: for example, it now says how much science you get from sea apples.",
        "Added minimized titlebar. You can switch it back to the old one in the options menu.",
        "Added categories to options menu. Now it's readable!",
    ],
    "<a href='https://github.com/spencers145/SharkGame'>New Frontiers</a> 0.2 patch 20210314a": [
        "Fixed bug related to how artifacts display in the grotto.",
        "Fixed bug related to artifact affects not applying properly.",
        "Fixed bug where the grotto would show an upgrade multiplier for everything, even if it was x1.",
        "Fixed bug where artifact effects would not reset when importing.",
        "Added 'INCOME PER' statistic to Simple grotto. Shows absolutely how much of a resource you get per generator.",
    ],
    "<a href='https://github.com/spencers145/SharkGame'>New Frontiers</a> 0.2 patch 20210312a": [
        "Added simplified grotto.",
        "Made grotto way easier to understand.",
        "Added tooltips to income table.",
        "Did internal rework of the multiplier system, created the modifier system.",
    ],
    "<a href='https://github.com/spencers145/SharkGame'>New Frontiers</a> 0.2 - New Perspectives (2021/??/??)": [
        "Scrapped Chaotic worldtype. Completely.",
        "Implemented gameplay for 1 out of 7 necessary planet reworks.",
        "Implemented new assets.",
    ],
    "<a href='https://github.com/spencers145/SharkGame'>New Frontiers</a> 0.11 - New Foundations (2021/1/27)": [
        "New, greatly improved UI for everything.",
        "Rebalanced stuff.",
        "Added world themes, so the page now changes color depending on what world you're in.",
        "Added a TPS/FPS setting, to make the game smoother and nicer to look at, or chunkier and easier on performance.",
        "Custom purchase amounts.",
        "Added a 'grace period'. Ice doesn't build up if you have no income for anything.",
        "Artifact descriptions and distant foresight planet properties are useful.",
        "See 5 artifact choices instead of 3. On that note, buffed base essence to 4 per world.",
    ],
    "<a href='https://github.com/spencers145/SharkGame'>New Frontiers</a> 0.1 - New is Old (2021/1/7)": [
        "22 NEW SPRITES! More are coming but we couldn't finish all the sprites in time!",
        "TRUE OFFLINE PROGRESS! Days are compressed to mere seconds with RK4 calculation.",
        "Attempted to rebalance worlds, especially frigid and abandoned, by making hazardous materials more threatening and meaningful.",
        "Halved the effectiveness of the 3 basic shark machines (except sand digger, which is 2/3 as productive), but added a new upgrade to counterbalance it.",
        "Added recycler efficiency system. The more you recycle at once, the more you lose in the process. Added an upgrade which makes the mechanic less harsh.",
        "Added new UI elements to the Recycler to make it less of a guessing game and more of a cost-benefit analysis.",
        "Increased the effectiveness of many machines.",
        "Greatly improved number formatting.",
        "World shaper has been disabled because it will probably break plans for future game balance.",
        "Distant foresight now has a max level of 5, and reveals 20% of world properties per level, up to 100% at level 5.",
        "Fixed exploits, bugs, and buggy exploits and exploitable bugs. No more crystals -> clams & sponges -> science & clams -> crystals loop.",
        "No more science from sponges.",
        "Removed jellyfish from a bunch of worlds where the resource was a dead end.",
    ],
    "0.71 (2014/12/20)": [
        "Fixed and introduced and fixed a whole bunch of horrible game breaking bugs. If your save was lost, I'm sorry.",
        "Made the recycler stop lying about what could be made.",
        "Made the recycler not pay out so much for animals.",
        "Options are no longer reset after completing a run for real this time.",
        "Bunch of tweaked gate costs.",
        "One new machine, and one new job.",
        "Ten new post-chasm-exploration technologies to invest copious amounts of science into.",
    ],
    "0.7 - Stranger Oceans (2014/12/19)": [
        "WHOLE BUNCH OF NEW STUFF ADDED.",
        "Resource system slightly restructured for something in the future.",
        "New worlds with some slight changes to availabilities, gate demands, and some other stuff.",
        "Categories added to Home Sea tab for the benefit of trying to make sense of all the buttons.",
        "Newly added actions show up in highlights for your convenience.",
        "The way progress continues beyond the gate is now... a little tweaked.",
        "Options are no longer reset after completing a run.",
        "Artifacts exist.",
        "Images are a work in progress. Apologies for the placeholder graphics in these trying times.",
        "Partial production when there's insufficient resources for things that take costs. Enjoy watching your incomes slow to a trickle!",
    ],
    "0.62 (2014/12/12)": [
        "Fixed infinity resource requirement for gate.",
        "Attempted to fix resource table breaking in some browsers for some sidebar widths.",
    ],
    "0.61 (2014/12/12)": [
        "Added categories for buttons in the home sea, because there are going to be so many buttons.",
        "Miscellaneous shuffling of files.",
        "Some groundwork laid for v0.7, which will be the actual official release.",
    ],
    "0.6 - Return of Shark (2014/12/8)": [
        "Major graphical update!",
        "Now features graphics sort of!",
        "Some UI rearrangements:" +
            "<ul><li>Researched techs now show in lab instead of grotto.</li>" +
            "<li>General stats now on right of grotto instead of left.</li>" +
            "<li>Large empty space in grotto right column reserved for future use!</li></ul>",
        "Pointless version subtitle!",
        "<span class='medDesc'>Added a donate link. Hey, sharks gotta eat.</span>",
    ],
    "0.59 (2014/09/30)": [
        "Bunch of small fixes and tweaks!",
        "End of run time now shown at the end of a run.",
        "A couple of fixes for issues only found in IE11.",
        "Fixed a bug that could let people buy hundreds of things for cheap by overwhelming the game's capacity for input. Hopefully fixed, anyway.",
        "Gaudy social media share menu shoehorned in below the game title. Enjoy!",
    ],
    "0.531 (2014/08/20)": [
        "Banned sea apples from the recycler because the feedback loop is actually far more crazy powerful than I was expecting. Whoops!",
    ],
    "0.53 (2014/08/18)": ["Changed Recycler so that residue into new machines is linear, but into new resources is constant."],
    "0.52 (2014/08/18)": [
        "Emergency bug-fixes.",
        "Cost to assemble residue into new things is now LINEAR (gets more expensive as you have more things) instead of CONSTANT.",
    ],
    "0.51 (2014/08/18)": [
        "Edited the wording of import/export saving.",
        "Made machine recycling less HORRIBLY BROKEN in terms of how much a machine is worth.",
    ],
    "0.5 (2014/08/18)": [
        "Added the Grotto - a way to better understand what you've accomplished so far.",
        "Added the Recycler. Enjoy discovering its function!",
        "Added sand machines for more machine sand goodness.",
        "Fixed oscillation/flickering of resources when at zero with anything providing a negative income.",
        "Added 'support' for people stumbling across the page with scripts turned off.",
        "Upped the gate kelp requirement by 10x, due to request.",
        "Added time tracking. Enjoy seeing how much of your life you've invested in this game.",
        "Added grouping for displaying resources on the left.",
        "Added some help and action descriptions.",
        "Added some text to the home tab to let people have an idea of where they should be heading in the very early game.",
        "Thanks to assistance from others, the saves are now much, much smaller than before.",
        "Made crab broods less ridiculously explosive.",
        "Adjusted some resource colours.",
        "Added a favicon, probably.",
        "<span class='medDesc'>Added an overdue copyright notice I guess.</span>",
    ],
    "0.48 (2014/08-ish)": [
        "Saves are now compressed both in local storage and in exported strings.",
        "Big costs significantly reduced.",
        "Buy 10, Buy 1/3 max and Buy 1/2 max buttons added.",
        "Research impact now displayed on research buttons.",
        "Resource effectiveness multipliers now displayed in table." +
            "<ul><li>These are not multipliers for how much of that resource you are getting.</li></ul>",
        "Some dumb behind the scenes things to make the code look nicer.",
        "Added this changelog!",
        "Removed upgrades list on the left. It'll come back in a future version.",
        "Added ray and crab generating resources, and unlocking techs.",
    ],
    "0.47 (2014/08-ish)": ["Bulk of game content added.", "Last update for Seamergency 2014!"],
    "0.4 (2014/08-ish)": ["Added Laboratory tab.", "Added the end of the game tab."],
    "0.3 (2014/08-ish)": ["Added description to options.", "Added save import/export.", "Added the ending panel."],
    "0.23 (2014/08-ish)": ["Added autosave.", "Income system overhauled.", "Added options panel."],
    "0.22 (2014/08-ish)": [
        "Offline mode added. Resources will increase even with the game off!",
        "(Resource income not guaranteed to be 100% accurate.)",
    ],
    "0.21 (2014/08-ish)": ["Save and load added."],
    "<0.21 (2014/08-ish)": ["A whole bunch of stuff.", "Resource table, log, initial buttons, the works."],
};

$(() => {
    $("#game").show();
    main.init();

    // ctrl+s saves
    $(window).on("keydown", (event) => {
        if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.key).toLowerCase()) {
                case "s":
                    event.preventDefault();
                    SharkGame.Save.saveGame();
                    break;
                case "o":
                    event.preventDefault();
                    main.showOptions();
                    break;
            }
        }
    });
});

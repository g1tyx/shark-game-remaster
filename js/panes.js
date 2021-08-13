SharkGame.Panes = {
    credits:
        "<p>This game was originally created in 3 days for Seamergency 2014.<br/>" +
        "<span class='smallDesc'>(Technically it was 4 days, but sometimes plans go awry.)</span></p>" +
        "<p>It was made by <a href='http://cirri.al'>Cirr</a> who needs to update his website.<br/>" +
        "He has a rarely updated <a href='https://twitter.com/Cirrial'>Twitter</a> though.</p>" +
        "<p>Additional code and credit help provided by Dylan and Sam Red.<br/>" +
        "<span class='smallDesc'>Dylan is also graciously hosting the original game.</span></p>" +
        "<br><p><a href='https://github.com/spencers145/SharkGame'>NEW FRONTIERS</a> created by base4/spencers145.<br/>" +
        "Art and sprite contributions by Jay, <a href='https://www.imdb.com/name/nm12683932/'>Noah Deibler,</a> and <a href='https://twitter.com/vhs_static'>@vhs_static</a> and friends.<br/>" +
        "Additional help from <a href='https://github.com/stampyzfanz'>Ixbixbam</a>.<br/>" +
        "<span class='smallDesc'>Ixbix's games at his little corner of the internet are </span><a href='https://stampyzfanz.github.io/games'>here</a><span class='smallDesc'>.</span><br/>" +
        '<span style="color: rgba(0,0,0,0);">With some help by <a href="https://github.com/Toby222" style="color: rgba(0,0,0,0);">Toby</a></span><br/>',

    ending:
        "<p>Congratulations! You did it.<br/>You saved the sharks!</p>" +
        "<p>The gate leads away from this strange ocean...</p>" +
        "<p>Back home to the oceans you came from!</p>" +
        "<h3>Or are they?</h3>",

    help:
        "<p>This game is a game about resources and discovery, and does not demand your full attention. " +
        "It will happily run in the background, and works even while closed.</p>" +
        "<p>To begin, you should catch fish. Once you have some fish, more actions will become available.</p>" +
        "<p>If you are ever stuck, double-check that you have already bought everything, then make sure there's not a resource you've been neglecting.</p>" +
        "<p>If you are still stuck, or if you think it's a bug, you can always ask for help on the <a href='https://discord.gg/nN7BQDJR2G' target='blank_'>discord server</a>.</p>",

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
        "target='_blank'>support the developer of the original shark game,</a>" +
        " if you'd like.)</span></p>" +
        "<p>The developers of the mod are not currently taking donations.</p>",

    notice:
        "<p>Welcome to the open <b>alpha</b> of v0.2 for New Frontiers.</p>" +
        "<p>v0.2 is a total rework.<br/>Right now only four worlds (besides the starter world) are playable.<br><b>Things will be missing.</b> New stuff will be added.</p>" +
        "<p>To give feedback or contribute, check out our <a href='https://discord.gg/eYqApFkFPY'>Discord</a>.</p>" +
        "<p>To play the stable (OUTDATED) version (with all planets), visit <a href='https://spencers145.github.io/SharkGame/'>this link</a>.</p>",
};

SharkGame.PaneHandler = {
    paneStack: [],
    currentPane: undefined,

    buildPane() {
        const pane = $("<div>").attr("id", "pane");
        $("body").append(pane);

        // set up structure of pane
        const titleDiv = $("<div>").attr("id", "paneHeader");
        titleDiv.append($("<div>").attr("id", "paneHeaderTitleDiv"));
        titleDiv.append(
            $("<div>")
                .attr("id", "paneHeaderCloseButtonDiv")
                .append(
                    $("<button>")
                        .attr("id", "paneHeaderCloseButton")
                        .addClass("min close-button")
                        .html("✕")
                        .on("click", SharkGame.PaneHandler.nextPaneInStack)
                )
        );
        pane.append(titleDiv);
        pane.append($("<div>").attr("id", "paneHeaderEnd").addClass("clear-fix"));
        pane.append($("<div>").attr("id", "paneContent"));

        pane.hide();
        SharkGame.paneGenerated = true;
        return pane;
    },

    addPaneToStack(title, contents, notCloseable, fadeInTime = 600, customOpacity) {
        const stackObject = [title, contents, notCloseable, fadeInTime, customOpacity];
        if (this.currentPane) {
            this.paneStack.push(_.cloneDeep(this.currentPane));
        }
        this.currentPane = stackObject;
        this.showPane(title, contents, notCloseable, fadeInTime, customOpacity, true);
    },

    swapCurrentPane(title, contents, notCloseable, fadeInTime = 600, customOpacity) {
        const stackObject = [title, contents, notCloseable, fadeInTime, customOpacity];
        this.currentPane = stackObject;
        this.showPane(title, contents, notCloseable, fadeInTime, customOpacity);
    },

    wipeStack() {
        SharkGame.PaneHandler.paneStack = [];
        SharkGame.PaneHandler.currentPane = undefined;
        SharkGame.PaneHandler.hidePane();
    },

    nextPaneInStack() {
        const panehandler = SharkGame.PaneHandler;
        panehandler.currentPane = panehandler.paneStack.pop();
        if (panehandler.currentPane) {
            panehandler.showPane(
                panehandler.currentPane[0],
                panehandler.currentPane[1],
                panehandler.currentPane[2],
                panehandler.currentPane[3],
                panehandler.currentPane[4]
            );
        } else {
            panehandler.hidePane();
        }
    },

    showPane(title, contents, notCloseable, fadeInTime, customOpacity, preserveElements) {
        let pane;

        // GENERATE PANE IF THIS IS THE FIRST TIME
        if (!SharkGame.paneGenerated) {
            pane = SharkGame.PaneHandler.buildPane();
        } else {
            pane = $("#pane");
        }

        // begin fading in/displaying overlay if it isn't already visible
        const overlay = $("#overlay");
        // is it already up?
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
            if (!notCloseable) {
                // put back to left
                titleDiv.css({ float: "left", "text-align": "left", clear: "none" });
                titleDiv.html("<h3>" + title + "</h3>");
            } else {
                // center
                titleDiv.css({ float: "none", "text-align": "center", clear: "both" });
                titleDiv.html("<h2>" + title + "</h2>");
            }
        }
        if (notCloseable) {
            closeButtonDiv.hide();
        } else {
            closeButtonDiv.show();
        }

        let paneContent;
        if (!preserveElements) {
            paneContent = $("#paneContent");
            paneContent.empty();
        } else {
            const originalContent = $("#paneContent");
            originalContent.detach();

            pane.append($("<div>").attr("id", "paneContent"));
            paneContent = $("#paneContent");
        }

        // adjust content
        paneContent.append(contents);
        if (SharkGame.Settings.current.showAnimations && customOpacity) {
            pane.show().css("opacity", 0).animate({ opacity: 1.0 }, fadeInTime);
        } else {
            pane.show();
        }

        if (!notCloseable) {
            document.getElementById("overlay").addEventListener("click", SharkGame.PaneHandler.nextPaneInStack);
            overlay.addClass("pointy");
        } else {
            document.getElementById("overlay").removeEventListener("click", SharkGame.PaneHandler.nextPaneInStack);
            overlay.removeClass("pointy");
        }
    },

    hidePane() {
        document.getElementById("overlay").removeEventListener("click", SharkGame.PaneHandler.nextPaneInStack);
        $("#overlay").removeClass("pointy");
        $("#overlay").hide();
        $("#pane").hide();
    },

    showOptions() {
        const optionsContent = SharkGame.PaneHandler.setUpOptions();
        SharkGame.PaneHandler.addPaneToStack("Options", optionsContent);
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
            optionsTable.append(
                $("<tr>").html("<h3><br><span style='text-decoration: underline'>" + sharktext.boldString(category) + "</span></h3>")
            );
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
                                .on("click", SharkGame.PaneHandler.onOptionClick)
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
                "Import/Export Save:<br/><span class='smallDesc'>(Turn your save into text for other people to load, or as a backup.)</span>"
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
                            SharkGame.PaneHandler.nextPaneInStack();
                            log.addError("You need to paste something in first!");
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

        // SETTING WIPE
        row = $("<tr>");
        row.append($("<td>").html("Wipe Settings:<br/><span class='smallDesc'>(Change all settings to default.)</span>"));
        row.append(
            $("<td>").append(
                $("<button>")
                    .html("wipe")
                    .addClass("option-button")
                    .on("click", () => {
                        if (confirm("Are you absolutely sure you want to wipe your settings to default?")) {
                            $.each(SharkGame.Settings.current, (settingName) => {
                                if (SharkGame.Settings[settingName]) {
                                    SharkGame.Settings.current[settingName] = SharkGame.Settings[settingName].defaultSetting;
                                }
                                if (typeof SharkGame.Settings[settingName].onChange === "function") {
                                    SharkGame.Settings[settingName].onChange();
                                }
                            });
                            SharkGame.PaneHandler.nextPaneInStack();
                            SharkGame.PaneHandler.showOptions();
                        }
                    })
            )
        );
        optionsTable.append(row);

        // SAVE WIPE
        // add save wipe
        row = $("<tr>");
        row.append(
            $("<td>").html("Wipe Save:<br/><span class='smallDesc'>(Completely wipe your save and reset the game. COMPLETELY. FOREVER.)</span>")
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
        SharkGame.PaneHandler.addPaneToStack("Changelog", changelogContent);
    },

    showHelp() {
        const helpDiv = $("<div>");
        helpDiv.append($("<div>").append(SharkGame.Panes.help).addClass("paneContentDiv"));
        SharkGame.PaneHandler.addPaneToStack("Help", helpDiv);
    },

    showSpeedSelection() {
        const speedDiv = $("<div>");
        const buttonContainer = $("<div class='speedButtons'>");
        speedDiv.append(buttonContainer.addClass("paneContentDiv"));
        /*         SharkGame.Button.makeButton(
            "slowSpeed",
            "<h class='bigSpeedHeader'><strong>IDLE</strong></h><br><br><br><br>Much slower.<br><br><br>Good to have on in the <strong>background</strong>.",
            buttonContainer,
            () => {
                SharkGame.Settings.current.gameSpeed = "Idle";
                main.applyProgressionSpeed();
                SharkGame.PaneHandler.nextPaneInStack();
                SharkGame.persistentFlags.choseSpeed = true;
            }
        ); */
        SharkGame.Button.makeButton(
            "medSpeed",
            "<h class='bigSpeedHeader'><strong>INACTIVE</strong></h><br><br><br>Even-paced.<br><br><br>The better choice if you <strong>don't</strong> give the game your <strong>full attention</strong>.<br>",
            buttonContainer,
            () => {
                SharkGame.Settings.current.gameSpeed = "Inactive";
                main.applyProgressionSpeed();
                SharkGame.PaneHandler.nextPaneInStack();
                SharkGame.persistentFlags.choseSpeed = true;
            }
        );
        SharkGame.Button.makeButton(
            "highSpeed",
            "<h class='bigSpeedHeader'><strong>ACTIVE</strong></h><br><br><br>Fast-paced.<br><br><br><br>Good if you give the game your <strong>full attention</strong>.",
            buttonContainer,
            () => {
                SharkGame.Settings.current.gameSpeed = "Active";
                main.applyProgressionSpeed();
                SharkGame.PaneHandler.nextPaneInStack();
                SharkGame.persistentFlags.choseSpeed = true;
            }
        );
        speedDiv.append($("<p>").html("You can change playstyle at any time."));
        this.addPaneToStack("Choose Playstyle", speedDiv, true);
    },

    showAspectWarning() {
        const aspectWarnDiv = $("<div>");
        aspectWarnDiv.append(
            $("<div>")
                .attr("id", "aspectInnerWarning")
                .append(
                    "Uh oh!<br>Your save has aspects that are no longer in the game!<br>To fix this,<br>all your <strong>essence</strong> has been <strong>refunded</strong>,<br>and all your <strong>aspects</strong> have been <strong>reset</strong>.<br>"
                )
                .addClass("paneContentDiv")
        );
        SharkGame.Button.makeButton(
            "confirmUnderstood",
            "I understand my <br><strong>ESSENCE</strong> is <strong>REFUNDED</strong><br>and<br><strong>ASPECTS</strong> are <strong>RESET</strong>",
            aspectWarnDiv,
            () => {
                SharkGame.PaneHandler.nextPaneInStack();
                SharkGame.missingAspects = false;
            }
        );
        this.addPaneToStack("ASPECTS RESET", aspectWarnDiv, true);
    },
};

SharkGame.Stats = {
    tabId: "stats",
    tabDiscovered: false,
    tabName: "Grotto",
    tabBg: "img/bg/bg-grotto.png",

    sceneImage: "img/events/misc/scene-grotto.png",

    recreateIncomeTable: null,

    discoverReq: {
        upgrade: ["statsDiscovery"],
    },

    bannedDisposeCategories: ["special", "harmful"],

    message:
        "The grotto is a place to keep a better track of resources." +
        "</br></br>You can also dispose of those you don't need anymore." +
        "</br>Disposing specialists returns them to their normal, previous lives.",

    init() {
        // register tab
        SharkGame.Tabs[s.tabId] = {
            id: s.tabId,
            name: s.tabName,
            discovered: s.tabDiscovered,
            discoverReq: s.discoverReq,
            code: s,
        };
        s.recreateIncomeTable = true;
    },

    switchTo() {
        const content = $("#content");
        content.append($("<div>").attr("id", "tabMessage"));
        const statsContainer = $("<div>").attr("id", "statsContainer");
        content.append(statsContainer);

        statsContainer.append(
            $("<div>").attr("id", "statsLeftContainer").append($("<div>").attr("id", "incomeData")).append($("<div>").attr("id", "disposeResource"))
        );
        statsContainer.append($("<div>").attr("id", "statsRightContainer").append($("<div>").attr("id", "generalStats")));

        statsContainer.append($("<div>").addClass("clear-fix"));
        let message = s.message;
        const tabMessageSel = $("#tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + s.sceneImage + "' id='tabSceneImage'>" + message;
            tabMessageSel.css("background-image", "url('" + s.tabBg + "')");
        }
        tabMessageSel.html(message);

        const disposeSel = $("#disposeResource");
        disposeSel.append($("<h3>").html("Dispose of Stuff"));
        s.createDisposeButtons();

        const table = s.createIncomeTable();
        const incomeDataSel = $("#incomeData");
        incomeDataSel.append($("<h3>").html("Income Details"));
        incomeDataSel.append(
            $("<p>")
                .html("(Listed below are resources, the income each resource gives you, and the total income you're getting from each thing.)")
                .addClass("medDesc")
        );

        const switchButtonDiv = $("<div>");
        switchButtonDiv.css({
            margin: "auto",
            "margin-bottom": "15px",
            clear: "both",
        });
        // TODO NAME BUTTON BETTER
        SharkGame.Button.makeButton("switchButton", "&nbsp Swap Producers and Produced &nbsp", switchButtonDiv, s.toggleSwitch).addClass("min-block");
        if (SharkGame.Settings.current.grottoMode === "simple") {
            SharkGame.Button.makeButton("modeButton", "&nbsp Swap to Advanced mode &nbsp", switchButtonDiv, s.toggleMode).addClass("min-block");
        } else {
            SharkGame.Button.makeButton("modeButton", "&nbsp Swap to Simple mode &nbsp", switchButtonDiv, s.toggleMode).addClass("min-block");
        }
        /*         if (SharkGame.Settings.current.incomeTotalMode === "absolute") {
            SharkGame.Button.makeButton("percentButton", "&nbsp Show Income as Percentage &nbsp", switchButtonDiv, s.togglePercent).addClass("min-block");
        } else {
            SharkGame.Button.makeButton("percentButton", "&nbsp Show Income as Number &nbsp", switchButtonDiv, s.togglePercent).addClass("min-block");
        } */
        incomeDataSel.append(switchButtonDiv);

        incomeDataSel.append(table);
        incomeDataSel.append($("<div>").attr("id", "tableKey"));
        s.updateTableKey();

        const genStats = $("#generalStats");
        genStats.append($("<h3>").html("General Stats"));
        const firstTime = m.isFirstTime();
        if (!firstTime) {
            genStats.append($("<p>").html("<span class='medDesc'>Climate Level</span><br>" + m.beautify(w.planetLevel)));
        }
        genStats.append($("<p>").html("Time since you began:<br/><span id='gameTime' class='timeDisplay'></span>").addClass("medDesc"));
        if (!firstTime) {
            genStats.append(
                $("<p>").html("Time since you came through the gate:<br/><span id='runTime' class='timeDisplay'></span>").addClass("medDesc")
            );
        }
        genStats.append($("<h3>").html("Total Ocean Resources Acquired"));
        if (!firstTime) {
            genStats.append(
                $("<p>").html("Essence given is the total acquired for the entire game and not just for this world.").addClass("medDesc")
            );
        }
        genStats.append(s.createTotalAmountTable());

        m.createBuyButtons("rid");
    },

    update() {
        s.updateDisposeButtons();
        s.updateIncomeTable();
        s.updateTotalAmountTable();
        if (s.recreateIncomeTable) {
            s.createIncomeTable();
            s.createTotalAmountTable();
            s.recreateIncomeTable = false;
        }

        // update run times
        const currTime = _.now();
        $("#gameTime").html(m.formatTime(currTime - SharkGame.timestampGameStart));
        $("#runTime").html(m.formatTime(currTime - SharkGame.timestampRunStart));
    },

    createDisposeButtons() {
        const buttonDiv = $("#disposeResource").addClass("disposeArrangement");
        SharkGame.ResourceMap.forEach((_v, someKindOfKey) => {
            if (r.getTotalResource(someKindOfKey) > 0 && s.bannedDisposeCategories.indexOf(r.getCategoryOfResource(someKindOfKey)) === -1) {
                SharkGame.Button.makeButton(
                    "dispose-" + someKindOfKey,
                    "Dispose of<br/>" +
                        r.getResourceName(someKindOfKey, false, false, false, SharkGame.getElementColor("tooltipbox", "background-color")),
                    buttonDiv,
                    s.onDispose
                );
            }
        });
    },

    updateDisposeButtons() {
        SharkGame.ResourceMap.forEach((_v, someKindOfKey) => {
            if (r.getTotalResource(someKindOfKey) > 0 && s.bannedDisposeCategories.indexOf(r.getCategoryOfResource(someKindOfKey)) === -1) {
                const button = $("#dispose-" + someKindOfKey);
                const resourceAmount = r.getResource(someKindOfKey);
                let amountToDispose = m.getBuyAmount();
                if (amountToDispose < 0) {
                    const max = resourceAmount;
                    const divisor = Math.floor(amountToDispose) * -1;
                    amountToDispose = Math.floor(max / divisor);
                }
                const forceSingular = amountToDispose === 1;
                const disableButton = resourceAmount < amountToDispose || amountToDispose <= 0;
                let label =
                    "Dispose of " +
                    m.beautify(amountToDispose) +
                    "<br/>" +
                    r.getResourceName(
                        someKindOfKey,
                        disableButton,
                        forceSingular,
                        false,
                        SharkGame.getElementColor("dispose-" + someKindOfKey, "background-color")
                    );
                if (amountToDispose <= 0) {
                    label =
                        "Can't dispose any more " +
                        r.getResourceName(
                            someKindOfKey,
                            disableButton,
                            forceSingular,
                            false,
                            SharkGame.getElementColor("dispose-" + someKindOfKey, "background-color")
                        );
                }

                if (button.html() !== label.replace(/'/g, '"').replace("<br/>", "<br>")) {
                    button.html(label);
                }

                if (disableButton) {
                    button.addClass("disabled");
                } else {
                    button.removeClass("disabled");
                }
            }
        });
    },

    onDispose() {
        const l = SharkGame.Log;
        const resourceName = $(this).attr("id").split("-")[1];
        const resourceAmount = r.getResource(resourceName);
        let amountToDispose = SharkGame.Settings.current.buyAmount;
        if (amountToDispose < 0) {
            const max = resourceAmount;
            const divisor = Math.floor(amountToDispose) * -1;
            amountToDispose = max / divisor;
        }
        if (resourceAmount >= amountToDispose) {
            r.changeResource(resourceName, -amountToDispose);
            const category = SharkGame.ResourceCategories[r.getCategoryOfResource(resourceName)];
            const employmentPool = r.getBaseOfResource(resourceName);
            if (employmentPool) {
                r.changeResource(employmentPool, amountToDispose);
            }
            l.addMessage(SharkGame.choose(category.disposeMessage));
        } else {
            l.addMessage("Can't dispose that much! You don't have enough of it.");
        }
    },

    updateIncomeTable() {
        SharkGame.ResourceMap.forEach((_v, someKindOfKey) => {
            if (r.getTotalResource(someKindOfKey) > 0 && SharkGame.ResourceMap.get(someKindOfKey).income) {
                const income = SharkGame.ResourceMap.get(someKindOfKey).income;
                $.each(income, (incomeKey) => {
                    const cell = $("#income-" + someKindOfKey + "-" + incomeKey);
                    const realIncome = SharkGame.BreakdownIncomeTable.get(someKindOfKey)[incomeKey];
                    const changeChar = !(realIncome < 0) ? "+" : "";
                    const newValue =
                        "<span style='color: " +
                        r.TOTAL_INCOME_COLOR +
                        "'>" +
                        // (SharkGame.Settings.current.incomeTotalMode === "absolute" ? (changeChar + m.beautifyIncome(realIncome)).bold() : ((Math.min(realIncome/SharkGame.PlayerIncomeTable.get(incomeKey) * 100, 100)).toFixed(0) + "%")).bold() +
                        (changeChar + m.beautifyIncome(realIncome)).bold() +
                        "</span>";
                    const oldValue = cell.html();

                    if (oldValue !== newValue.replace(/'/g, '"')) {
                        cell.html(newValue);
                    }
                });
            }
        });
    },

    updateTotalAmountTable() {
        SharkGame.ResourceMap.forEach((_v, someKindOfKey) => {
            const totalResource = r.getTotalResource(someKindOfKey);
            if (totalResource > 0) {
                const cell = $("#totalAmount-" + someKindOfKey);
                const newValue = m.beautify(totalResource);
                const oldValue = cell.html();

                if (oldValue !== newValue.replace(/'/g, '"')) {
                    cell.html(newValue);
                }
            }
        });
    },

    createIncomeTable() {
        let incomesTable = $("#incomeTable");
        if (incomesTable.length === 0) {
            incomesTable = $("<table>").attr("id", "incomeTable");
        } else {
            incomesTable.empty();
        }

        const specialMultiplierCol = null;

        let formatCounter = 1;

        const drawnResourceMap = new Map();
        SharkGame.ResourceMap.forEach((generatorData, generatorName) => {
            if (r.getTotalResource(generatorName) > 0 && generatorData.income) {
                // if the resource has an income requiring any costs
                // and it isn't a forced income
                // do not display the resource's income if it requires a non-existent resource (looking at you, sponge)
                for (const incomeResourceName in generatorData.income) {
                    // skip income that doesn't exist
                    if (SharkGame.PlayerResources.get(incomeResourceName) < generatorData.income[incomeResourceName] && !generatorData.forceIncome)
                        return;
                }

                $.each(generatorData.income, (incomeKey, incomeValue) => {
                    if (w.doesResourceExist(incomeKey) && r.getTotalResource(incomeKey) > 0 && incomeValue > 0) {
                        if (SharkGame.Settings.current.switchStats) {
                            // Switch it!
                            if (!drawnResourceMap.has(incomeKey)) drawnResourceMap.set(incomeKey, { subheading: {} });

                            drawnResourceMap.get(incomeKey).subheading[generatorName] = incomeValue;
                        } else {
                            if (!drawnResourceMap.has(generatorName)) drawnResourceMap.set(generatorName, { subheading: {} });

                            // Copy all the good incomes over
                            drawnResourceMap.get(generatorName).subheading[incomeKey] = incomeValue;
                        }
                    }
                });
            }
        });

        // You would filter or sort here if you want to filter or sort using higher order operations
        // You would filter or sort above the statement where it's checked if the view is switched if you want to do an if statement

        /*         incomesTable.append($("<tr>").append($("<td>").html("test").attr("rowspan", 1).addClass("evenRow"))
            .append($("<td>").html("test2").attr("rowspan", 1).addClass("evenRow"))
            .append($("<td>").html("test").attr("rowspan", 1).addClass("evenRow"))
            .append($("<td>").html("test").attr("rowspan", 1).addClass("evenRow"))); */

        drawnResourceMap.forEach((headingData, headingName) => {
            // if the resource has an income requiring any costs
            // and it isn't a forced income
            // do not display the resource's income if it requires a non-existent resource (looking at you, sponge)
            const subheading = headingData.subheading;

            const subheadings = Object.keys(subheading).length;

            let row = $("<tr>");
            let counter = 0;
            let firstEntryinRow = true;

            const rowStyle = formatCounter % 2 === 0 ? "evenRow" : "oddRow";

            if (!SharkGame.Settings.current.switchStats) {
                row.append(
                    $("<td>")
                        .html("<div style='text-align:right'>" + m.beautify(r.getResource(headingName)).bold() + "</div>")
                        .addClass(rowStyle)
                );
            }
            row.append($("<td>").html(r.getResourceName(headingName)).attr("rowspan", subheadings).addClass(rowStyle));

            function addCell(text, rowspan, id) {
                if (id) {
                    row.append(
                        $("<td>")
                            .attr("rowspan", rowspan === "inline" ? 1 : subheadings)
                            .attr("id", id)
                            .html(text ? `<span style='color:${text[0]}'>${text[1]}</span>` : undefined)
                            .addClass(rowStyle)
                    );
                } else {
                    row.append(
                        $("<td>")
                            .attr("rowspan", rowspan === "inline" ? 1 : subheadings)
                            .html(text ? `<span style='color:${text[0]}'>${text[1]}</span>` : undefined)
                            .addClass(rowStyle)
                    );
                }
            }

            $.each(subheading, (subheadingKey, subheadingValue) => {
                // the income was formerly the subheadingKey, but then it got changed so it could be flipped

                const incomeKey = SharkGame.Settings.current.switchStats ? headingName : subheadingKey;
                const generatorName = SharkGame.Settings.current.switchStats ? subheadingKey : headingName;
                const incomeValue = subheadingValue;

                const generatorBoostRowspan = SharkGame.Settings.current.switchStats ? "inline" : undefined;
                const realIncome = SharkGame.BreakdownIncomeTable.get(generatorName)[incomeKey];
                const changeChar = !(realIncome < 0) ? "+" : "";

                if (SharkGame.Settings.current.switchStats) {
                    row.append(
                        $("<td>")
                            .html("<div style='text-align:right'>" + m.beautify(r.getResource(subheadingKey)).bold() + "</div>")
                            .addClass(rowStyle)
                    );
                } else if (!firstEntryinRow) {
                    row.append(
                        $("<td>")
                            .html("<div style='text-align:right'>" + m.beautify(r.getResource(headingName)).bold() + "</div>")
                            .addClass(rowStyle)
                    );
                }
                row.append($("<td>").html(r.getResourceName(subheadingKey)).addClass(rowStyle));

                // which mode are we in?
                if (SharkGame.Settings.current.grottoMode === "advanced") {
                    addCell(
                        [r.INCOME_COLOR, changeChar + m.beautify(SharkGame.ResourceMap.get(generatorName).baseIncome[incomeKey], false, 2) + "/s"],
                        "inline"
                    );
                    // if its inline then many rowspans will fill the gap

                    if (generatorBoostRowspan === "inline" || counter === 0) {
                        const upgradeMutiplier = r.getMultiplierProduct("upgrade", generatorName, incomeKey);
                        if (upgradeMutiplier !== 1) {
                            addCell([r.UPGRADE_MULTIPLIER_COLOR, "x" + m.beautify(upgradeMutiplier)], generatorBoostRowspan);
                        } else addCell(undefined, generatorBoostRowspan);

                        // does this generator get a world multiplier?
                        // world multipliers are per generator, so when its sorted by material being produced you need it for all its income
                        const worldMultiplier = r.getMultiplierProduct("world", generatorName, incomeKey);
                        if (worldMultiplier !== 1) {
                            addCell([r.WORLD_MULTIPLIER_COLOR, "x" + m.beautify(worldMultiplier)], generatorBoostRowspan);
                        } else addCell(undefined, generatorBoostRowspan);

                        // does this income get an artifact multiplier?
                        const artifactMultiplier = r.getMultiplierProduct("artifact", generatorName, incomeKey);
                        if (artifactMultiplier !== 1) {
                            addCell([r.ARTIFACT_MULTIPLIER_COLOR, "x" + m.beautify(artifactMultiplier)], generatorBoostRowspan);
                        } else addCell(undefined, generatorBoostRowspan);

                        // does this income get an effect network multiplier?
                        const resourceAffectMultiplier = r.getNetworkIncomeModifier("generator", generatorName);
                        if (resourceAffectMultiplier !== 1) {
                            addCell([r.RESOURCE_AFFECT_MULTIPLIER_COLOR, "x" + m.beautify(resourceAffectMultiplier)], generatorBoostRowspan);
                        } else addCell(undefined, generatorBoostRowspan);
                    }
                } else {
                    addCell([r.INCOME_COLOR, changeChar + m.beautify(incomeValue, false, 2) + "/s"], "inline");
                }

                // grotto is currently missing functionality to display resource effect (not affect) multipliers, needs to be added, but not pertinent since no resources currently use this multiplier type

                addCell(undefined, "inline");

                if (SharkGame.Settings.current.incomeTotalMode === "percentage") {
                    addCell(
                        [
                            r.TOTAL_INCOME_COLOR,
                            (Math.min((realIncome / SharkGame.PlayerIncomeTable.get(incomeKey)) * 100, 100).toFixed(0) + "%").bold(),
                        ],
                        "inline",
                        "income-" + generatorName + "-" + incomeKey
                    );
                } else {
                    addCell(
                        [r.TOTAL_INCOME_COLOR, (changeChar + m.beautifyIncome(realIncome)).bold()],
                        "inline",
                        "income-" + generatorName + "-" + incomeKey
                    );
                }

                counter++;
                incomesTable.append(row);
                row = $("<tr>");
                firstEntryinRow = false;
            });

            // throw away dangling values
            row = null;
            formatCounter++;
        });

        if (specialMultiplierCol) {
            const rowCount = incomesTable.find("tr").length;
            specialMultiplierCol.attr("rowspan", rowCount);
        }

        const row = $("<tr>");

        let columns = incomesTable[0].children[0].children[0].children.length;

        if (!SharkGame.Settings.current.switchStats) {
            row.append(
                $("<td>")
                    .html("<span><u>" + "AMOUNT".bold() + "</u></span>")
                    .addClass("evenRow")
            );
            row.append(
                $("<td>")
                    .html("<span><u>" + (SharkGame.Settings.current.switchStats ? "RESOURCE" : "GENERATOR").bold() + "</u></span>")
                    .addClass("evenRow")
            );
        } else {
            row.append(
                $("<td>")
                    .html("<span><u>" + (SharkGame.Settings.current.switchStats ? "RESOURCE" : "GENERATOR").bold() + "</u></span>")
                    .addClass("evenRow")
            );
            row.append(
                $("<td>")
                    .html("<span><u>" + "AMOUNT".bold() + "</u></span>")
                    .addClass("evenRow")
            );
        }

        row.append(
            $("<td>")
                .html("<span><u>" + (SharkGame.Settings.current.switchStats ? "GENERATOR" : "RESOURCE").bold() + "</u></span>")
                .addClass("evenRow")
        );

        row.append(
            $("<td>")
                .html("<span><u><b>" + (SharkGame.Settings.current.grottoMode === "advanced" ? "BASE INCOME" : "INCOME PER") + "</b></u></span>")
                .addClass("evenRow")
        );

        columns -= 4;
        while (columns > 1) {
            columns -= 1;
            row.append($("<td>").html(undefined).addClass("evenRow"));
        }

        row.append($("<td>").html("<span><u><b>TOTAL</b></u></span>").addClass("evenRow"));

        incomesTable.prepend(row);

        return incomesTable;
    },

    createTotalAmountTable() {
        let totalAmountTable = $("#totalAmountTable");
        if (totalAmountTable.length === 0) {
            totalAmountTable = $("<table>").attr("id", "totalAmountTable");
        } else {
            totalAmountTable.empty();
        }

        SharkGame.ResourceMap.forEach((_v, someKindOfKey) => {
            if (r.getTotalResource(someKindOfKey) > 0) {
                const row = $("<tr>");

                row.append($("<td>").html(r.getResourceName(someKindOfKey)));
                row.append(
                    $("<td>")
                        .html(m.beautify(r.getTotalResource(someKindOfKey)))
                        .attr("id", "totalAmount-" + someKindOfKey)
                );

                totalAmountTable.append(row);
            }
        });

        return totalAmountTable;
    },

    toggleSwitch() {
        SharkGame.Settings.current.switchStats = !SharkGame.Settings.current.switchStats;
        // s.createIncomeTable();
        SharkGame.Stats.createIncomeTable();
    },

    toggleMode() {
        if (SharkGame.Settings.current.grottoMode === "simple") {
            SharkGame.Settings.current.grottoMode = "advanced";
            document.getElementById("modeButton").innerHTML = "&nbsp Swap to Simple mode &nbsp";
        } else {
            SharkGame.Settings.current.grottoMode = "simple";
            document.getElementById("modeButton").innerHTML = "&nbsp Swap to Advanced mode &nbsp";
        }
        s.updateTableKey();
        s.createIncomeTable();
    },

    /*     togglePercent() {
        if (SharkGame.Settings.current.incomeTotalMode === "absolute") {
            SharkGame.Settings.current.incomeTotalMode = "percent";
            document.getElementById("percentButton").innerHTML = "&nbsp Show Income as Number &nbsp";
        } else {
            SharkGame.Settings.current.incomeTotalMode = "absolute";
            document.getElementById("percentButton").innerHTML = "&nbsp Show Income as Percentage &nbsp";
        }
    }, */

    updateTableKey() {
        let key = "";
        if (SharkGame.Settings.current.grottoMode === "advanced") {
            if (w.worldType !== "start") {
                key =
                    "<br> <b><u>TABLE KEY</b></u>" +
                    `<br> <span style='color:${r.UPGRADE_MULTIPLIER_COLOR}'><b>This color</b></span> is for upgrade effects.` +
                    `<br> <span style='color:${r.WORLD_MULTIPLIER_COLOR}'><b>This color</b></span> is for world effects.` +
                    `<br> <span style='color:${r.RESOURCE_AFFECT_MULTIPLIER_COLOR}'><b>This color</b></span> is for how some resources affect eachother.` +
                    `<br> <span style='color:${r.ARTIFACT_MULTIPLIER_COLOR}'><b>This color</b></span> is for artifact effects.`;
            } else {
                key =
                    "<br> <b><u>TABLE KEY</b></u>" +
                    `<br> <span style='color:${r.UPGRADE_MULTIPLIER_COLOR}'><b>This color</b></span> is for upgrade effects.`;
            }
        }
        document.getElementById("tableKey").innerHTML = key;
    },
};

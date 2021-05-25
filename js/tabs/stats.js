"use strict";
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
        SharkGame.Tabs[stats.tabId] = {
            id: stats.tabId,
            name: stats.tabName,
            discovered: stats.tabDiscovered,
            discoverReq: stats.discoverReq,
            code: stats,
        };
        stats.recreateIncomeTable = true;
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
        let message = stats.message;
        const tabMessageSel = $("#tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + stats.sceneImage + "' id='tabSceneImage'>" + message;
            tabMessageSel.css("background-image", "url('" + stats.tabBg + "')");
        }
        tabMessageSel.html(message);

        const disposeSel = $("#disposeResource");
        disposeSel.append($("<h3>").html("Dispose of Stuff"));
        stats.createDisposeButtons();

        const table = stats.createIncomeTable();
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
        SharkGame.Button.makeButton("switchButton", "Swap Producers and Produced", switchButtonDiv, stats.toggleSwitch).addClass("min-block");
        if (SharkGame.Settings.current.grottoMode === "simple") {
            SharkGame.Button.makeButton("modeButton", "Swap to Advanced mode", switchButtonDiv, stats.toggleMode).addClass("min-block");
        } else {
            SharkGame.Button.makeButton("modeButton", "Swap to Simple mode", switchButtonDiv, stats.toggleMode).addClass("min-block");
        }
        /*         if (SharkGame.Settings.current.incomeTotalMode === "absolute") {
            SharkGame.Button.makeButton("percentButton", "Show Income as Percentage", switchButtonDiv, stats.togglePercent).addClass("min-block");
        } else {
            SharkGame.Button.makeButton("percentButton", "Show Income as Number", switchButtonDiv, stats.togglePercent).addClass("min-block");
        } */
        incomeDataSel.append(switchButtonDiv);

        incomeDataSel.append(table);
        incomeDataSel.append($("<div>").attr("id", "tableKey"));
        stats.updateTableKey();

        const genStats = $("#generalStats");
        genStats.append($("<h3>").html("General Stats"));
        const firstTime = main.isFirstTime();
        if (!firstTime) {
            genStats.append($("<p>").html("<span class='medDesc'>Climate Level</span><br>" + main.beautify(world.planetLevel)));
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
        genStats.append(stats.createTotalAmountTable());

        main.createBuyButtons("rid");
    },

    update() {
        stats.updateDisposeButtons();
        stats.updateIncomeTable();
        stats.updateTotalAmountTable();
        if (stats.recreateIncomeTable) {
            stats.createIncomeTable();
            stats.createTotalAmountTable();
            stats.recreateIncomeTable = false;
        }

        // update run times
        const currTime = _.now();
        $("#gameTime").html(main.formatTime(currTime - SharkGame.timestampGameStart));
        $("#runTime").html(main.formatTime(currTime - SharkGame.timestampRunStart));
    },

    createDisposeButtons() {
        const buttonDiv = $("#disposeResource").addClass("disposeArrangement");
        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            if (res.getTotalResource(resourceId) > 0 && stats.bannedDisposeCategories.indexOf(res.getCategoryOfResource(resourceId)) === -1) {
                SharkGame.Button.makeButton(
                    "dispose-" + resourceId,
                    "Dispose of<br/>" +
                        res.getResourceName(resourceId, false, false, false, SharkGame.getElementColor("tooltipbox", "background-color")),
                    buttonDiv,
                    stats.onDispose
                );
            }
        });
    },

    updateDisposeButtons() {
        SharkGame.ResourceMap.forEach((_resource, resourceName) => {
            if (res.getTotalResource(resourceName) > 0 && stats.bannedDisposeCategories.indexOf(res.getCategoryOfResource(resourceName)) === -1) {
                const button = $("#dispose-" + resourceName);
                const resourceAmount = res.getResource(resourceName);
                let amountToDispose = main.getBuyAmount();
                if (amountToDispose < 0) {
                    const max = resourceAmount;
                    const divisor = Math.floor(amountToDispose) * -1;
                    amountToDispose = Math.floor(max / divisor);
                }
                const forceSingular = amountToDispose === 1;
                const disableButton = resourceAmount < amountToDispose || amountToDispose <= 0;
                let label =
                    "Dispose of " +
                    main.beautify(amountToDispose) +
                    "<br/>" +
                    res.getResourceName(
                        resourceName,
                        disableButton,
                        forceSingular,
                        false,
                        SharkGame.getElementColor("dispose-" + resourceName, "background-color")
                    );
                if (amountToDispose <= 0) {
                    label =
                        "Can't dispose any more " +
                        res.getResourceName(
                            resourceName,
                            disableButton,
                            forceSingular,
                            false,
                            SharkGame.getElementColor("dispose-" + resourceName, "background-color")
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
        const resourceName = $(this).attr("id").split("-")[1];
        const resourceAmount = res.getResource(resourceName);
        let amountToDispose = SharkGame.Settings.current.buyAmount;
        if (amountToDispose < 0) {
            const max = resourceAmount;
            const divisor = Math.floor(amountToDispose) * -1;
            amountToDispose = max / divisor;
        }
        if (resourceAmount >= amountToDispose) {
            res.changeResource(resourceName, -amountToDispose);
            const category = SharkGame.ResourceCategories[res.getCategoryOfResource(resourceName)];
            const employmentPool = res.getBaseOfResource(resourceName);
            if (employmentPool) {
                res.changeResource(employmentPool, amountToDispose);
            }
            SharkGame.Log.addMessage(SharkGame.choose(category.disposeMessage));
        } else {
            SharkGame.Log.addMessage("Can't dispose that much! You don't have enough of it.");
        }
    },

    updateIncomeTable() {
        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            if (res.getTotalResource(resourceId) > 0) {
                if (SharkGame.ResourceMap.get(resourceId).income) {
                    const income = SharkGame.ResourceMap.get(resourceId).income;
                    $.each(income, (incomeKey) => {
                        let cell = $("#income-" + resourceId + "-" + incomeKey);
                        const realIncome = SharkGame.BreakdownIncomeTable.get(resourceId)[incomeKey];
                        const changeChar = !(realIncome < 0) ? "+" : "";
                        let newValue =
                            "<span style='color: " +
                            res.TOTAL_INCOME_COLOR +
                            "'>" +
                            // (SharkGame.Settings.current.incomeTotalMode === "absolute" ? (changeChar + main.beautifyIncome(realIncome)).bold() : ((Math.min(realIncome/SharkGame.PlayerIncomeTable.get(incomeKey) * 100, 100)).toFixed(0) + "%")).bold() +
                            (changeChar + main.beautifyIncome(realIncome)).bold() +
                            "</span>";
                        let oldValue = cell.html();

                        if (oldValue !== newValue.replace(/'/g, '"')) {
                            cell.html(newValue);
                        }

                        if (SharkGame.Settings.current.switchStats) {
                            cell = $("#table-amount-" + resourceId + "-" + incomeKey);
                        } else {
                            cell = $("#table-amount-" + resourceId);
                        }

                        newValue = "<div style='text-align:right'>" + main.beautify(res.getResource(resourceId)).bold() + "</div>";
                        oldValue = cell.html();
                        if (oldValue !== newValue.replace(/'/g, '"')) {
                            cell.html(newValue);
                        }
                    });
                }
            }
        });
    },

    updateTotalAmountTable() {
        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            const totalResource = res.getTotalResource(resourceId);
            if (totalResource > 0) {
                const cell = $("#totalAmount-" + resourceId);
                const newValue = main.beautify(totalResource);
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
            if (res.getTotalResource(generatorName) > 0 && generatorData.income) {
                // if the resource has an income requiring any costs
                // and it isn't a forced income
                // do not display the resource's income if it requires a non-existent resource (looking at you, sponge)
                for (const incomeResourceName in generatorData.income) {
                    // skip income that doesn't exist
                    if (SharkGame.PlayerResources.get(incomeResourceName) < generatorData.income[incomeResourceName] && !generatorData.forceIncome)
                        return;
                }

                $.each(generatorData.income, (incomeKey, incomeValue) => {
                    if (world.doesResourceExist(incomeKey) && res.getTotalResource(incomeKey) > 0 && incomeValue !== 0) {
                        if (SharkGame.Settings.current.switchStats) {
                            // Switch it!
                            if (!drawnResourceMap.has(incomeKey)) {
                                drawnResourceMap.set(incomeKey, {});
                            }

                            drawnResourceMap.get(incomeKey)[generatorName] = incomeValue;
                        } else {
                            if (!drawnResourceMap.has(generatorName)) {
                                drawnResourceMap.set(generatorName, {});
                            }

                            // Copy all the good incomes over
                            drawnResourceMap.get(generatorName)[incomeKey] = incomeValue;
                        }
                    }
                });
            }
        });

        // You would filter or sort here if you want to filter or sort using higher order operations
        // You would filter or sort above the statement where it's checked if the view is switched if you want to do an if statement

        /*
        incomesTable.append($("<tr>").append($("<td>").html("test").attr("rowspan", 1).addClass("evenRow"))
            .append($("<td>").html("test2").attr("rowspan", 1).addClass("evenRow"))
            .append($("<td>").html("test").attr("rowspan", 1).addClass("evenRow"))
            .append($("<td>").html("test").attr("rowspan", 1).addClass("evenRow")));
        */

        drawnResourceMap.forEach((headingData, headingName) => {
            // if the resource has an income requiring any costs
            // and it isn't a forced income
            // do not display the resource's income if it requires a non-existent resource (looking at you, sponge)
            const subheadings = Object.keys(headingData).length;

            let resourceMapRow = $("<tr>");
            let counter = 0;

            const rowStyle = formatCounter % 2 === 0 ? "evenRow" : "oddRow";

            if (!SharkGame.Settings.current.switchStats) {
                resourceMapRow.append(
                    $("<td>")
                        .attr("rowspan", subheadings)
                        .html("<div style='text-align:right'>" + main.beautify(res.getResource(headingName)).bold() + "</div>")
                        .addClass(rowStyle)
                        .attr("id", "table-amount-" + headingName)
                );
            }
            resourceMapRow.append($("<td>").html(res.getResourceName(headingName)).attr("rowspan", subheadings).addClass(rowStyle));

            function addCell(text, rowspan, id) {
                if (id) {
                    resourceMapRow.append(
                        $("<td>")
                            .attr("rowspan", rowspan === "inline" ? 1 : subheadings)
                            .attr("id", id)
                            .html(text ? `<span style='color:${text[0]}'>${text[1]}</span>` : undefined)
                            .addClass(rowStyle)
                    );
                } else {
                    resourceMapRow.append(
                        $("<td>")
                            .attr("rowspan", rowspan === "inline" ? 1 : subheadings)
                            .html(text ? `<span style='color:${text[0]}'>${text[1]}</span>` : undefined)
                            .addClass(rowStyle)
                    );
                }
            }

            $.each(headingData, (subheadingKey, subheadingValue) => {
                // the income was formerly the subheadingKey, but then it got changed so it could be flipped

                const incomeKey = SharkGame.Settings.current.switchStats ? headingName : subheadingKey;
                const generatorName = SharkGame.Settings.current.switchStats ? subheadingKey : headingName;
                const incomeValue = subheadingValue;

                const generatorBoostRowspan = SharkGame.Settings.current.switchStats ? "inline" : undefined;
                const realIncome = SharkGame.BreakdownIncomeTable.get(generatorName)[incomeKey];
                const changeChar = !(realIncome < 0) ? "+" : "";

                if (SharkGame.Settings.current.switchStats) {
                    resourceMapRow.append(
                        $("<td>")
                            .html("<div style='text-align:right'>" + main.beautify(res.getResource(subheadingKey)).bold() + "</div>")
                            .addClass(rowStyle)
                            .attr("id", "table-amount-" + generatorName + "-" + incomeKey)
                    );
                }
                resourceMapRow.append($("<td>").html(res.getResourceName(subheadingKey)).addClass(rowStyle));

                // which mode are we in?
                if (SharkGame.Settings.current.grottoMode === "advanced") {
                    addCell(
                        [
                            res.INCOME_COLOR,
                            changeChar + main.beautify(SharkGame.ResourceMap.get(generatorName).baseIncome[incomeKey], false, 2) + "/s",
                        ],
                        "inline",
                        "advanced-base-income-" + generatorName + "-" + incomeKey
                    );
                    // if its inline then many rowspans will fill the gap

                    if (generatorBoostRowspan === "inline" || counter === 0) {
                        const upgradeMutiplier = res.getMultiplierProduct("upgrade", generatorName, incomeKey);
                        if (upgradeMutiplier !== 1) {
                            addCell([res.UPGRADE_MULTIPLIER_COLOR, "x" + main.beautify(upgradeMutiplier)], generatorBoostRowspan);
                        } else addCell(undefined, generatorBoostRowspan);

                        // does this generator get a world multiplier?
                        // world multipliers are per generator, so when its sorted by material being produced you need it for all its income
                        const worldMultiplier = res.getMultiplierProduct("world", generatorName, incomeKey);
                        if (worldMultiplier !== 1) {
                            addCell([res.WORLD_MULTIPLIER_COLOR, "x" + main.beautify(worldMultiplier)], generatorBoostRowspan);
                        } else addCell(undefined, generatorBoostRowspan);

                        // does this income get an aspect multiplier?
                        const aspectMultiplier = res.getMultiplierProduct("aspect", generatorName, incomeKey);
                        if (aspectMultiplier !== 1) {
                            addCell([res.ASPECT_MULTIPLIER_COLOR, "x" + main.beautify(aspectMultiplier)], generatorBoostRowspan);
                        } else addCell(undefined, generatorBoostRowspan);

                        // does this income get an effect network multiplier?
                        const resourceAffectMultiplier =
                            res.getNetworkIncomeModifier("generator", generatorName) * res.getNetworkIncomeModifier("resource", incomeKey);
                        if (resourceAffectMultiplier !== 1) {
                            addCell(
                                [res.RESOURCE_AFFECT_MULTIPLIER_COLOR, "x" + main.beautify(resourceAffectMultiplier, false, 2)],
                                generatorBoostRowspan
                            );
                        } else addCell(undefined, generatorBoostRowspan);
                    }
                } else {
                    addCell(
                        [res.INCOME_COLOR, changeChar + main.beautify(incomeValue, false, 2) + "/s"],
                        "inline",
                        "base-income-" + generatorName + "-" + incomeKey
                    );
                }

                // grotto is currently missing functionality to display resource effect (not affect) multipliers, needs to be added, but not pertinent since no resources currently use this multiplier type

                addCell(undefined, "inline");

                if (SharkGame.Settings.current.incomeTotalMode === "percentage") {
                    addCell(
                        [
                            res.TOTAL_INCOME_COLOR,
                            (Math.min((realIncome / SharkGame.PlayerIncomeTable.get(incomeKey)) * 100, 100).toFixed(0) + "%").bold(),
                        ],
                        "inline",
                        "income-" + generatorName + "-" + incomeKey
                    );
                } else {
                    addCell(
                        [res.TOTAL_INCOME_COLOR, (changeChar + main.beautifyIncome(realIncome)).bold()],
                        "inline",
                        "income-" + generatorName + "-" + incomeKey
                    );
                }

                counter++;
                incomesTable.append(resourceMapRow);
                resourceMapRow = $("<tr>");
            });

            // throw away dangling values
            resourceMapRow = null;
            formatCounter++;
        });

        if (specialMultiplierCol) {
            const rowCount = incomesTable.find("tr").length;
            specialMultiplierCol.attr("rowspan", rowCount);
        }

        const row = $("<tr>");

        let columns = incomesTable[0].children[0].children[0].children.length;

        if (SharkGame.Settings.current.switchStats) {
            row.append(
                $("<th>")
                    .html("<span><u>" + "RESOURCE".bold() + "</u></span>")
                    .addClass("evenRow")
            );
            row.append(
                $("<th>")
                    .html("<span><u>" + "AMOUNT".bold() + "</u></span>")
                    .addClass("evenRow")
            );

            row.append(
                $("<td>")
                    .html("<span><u>" + "GENERATOR".bold() + "</u></span>")
                    .addClass("evenRow")
            );
        } else {
            row.append(
                $("<th>")
                    .html("<span><u>" + "AMOUNT".bold() + "</u></span>")
                    .addClass("evenRow")
            );
            row.append(
                $("<th>")
                    .html("<span><u>" + "GENERATOR".bold() + "</u></span>")
                    .addClass("evenRow")
            );

            row.append(
                $("<td>")
                    .html("<span><u>" + "RESOURCE".bold() + "</u></span>")
                    .addClass("evenRow")
            );
        }

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

        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            if (res.getTotalResource(resourceId) > 0) {
                const row = $("<tr>");

                row.append($("<td>").html(res.getResourceName(resourceId)));
                row.append(
                    $("<td>")
                        .html(main.beautify(res.getTotalResource(resourceId)))
                        .attr("id", "totalAmount-" + resourceId)
                );

                totalAmountTable.append(row);
            }
        });

        return totalAmountTable;
    },

    toggleSwitch() {
        SharkGame.Settings.current.switchStats = !SharkGame.Settings.current.switchStats;
        SharkGame.Stats.createIncomeTable();
    },

    toggleMode() {
        if (SharkGame.Settings.current.grottoMode === "simple") {
            SharkGame.Settings.current.grottoMode = "advanced";
            document.getElementById("modeButton").innerHTML = "Swap to Simple mode";
        } else {
            SharkGame.Settings.current.grottoMode = "simple";
            document.getElementById("modeButton").innerHTML = "Swap to Advanced mode";
        }
        stats.updateTableKey();
        stats.createIncomeTable();
    },

    updateTableKey() {
        if (SharkGame.Settings.current.grottoMode !== "advanced") {
            document.getElementById("tableKey").innerHTML = "";
            return;
        }

        if (world.worldType !== "start") {
            document.getElementById("tableKey").innerHTML =
                "<br> <b><u>TABLE KEY</b></u>" +
                `<br> <span style='color:${res.UPGRADE_MULTIPLIER_COLOR}'><b>This color</b></span> is for upgrade effects.` +
                `<br> <span style='color:${res.WORLD_MULTIPLIER_COLOR}'><b>This color</b></span> is for world effects.` +
                `<br> <span style='color:${res.RESOURCE_AFFECT_MULTIPLIER_COLOR}'><b>This color</b></span> is for how some resources affect each other.` +
                `<br> <span style='color:${res.ASPECT_MULTIPLIER_COLOR}'><b>This color</b></span> is for aspect effects.`;
        } else {
            document.getElementById("tableKey").innerHTML =
                "<br> <b><u>TABLE KEY</b></u>" +
                `<br> <span style='color:${res.UPGRADE_MULTIPLIER_COLOR}'><b>This color</b></span> is for upgrade effects.`;
        }
    },
};

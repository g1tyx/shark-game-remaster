"use strict";
/** @type {Map<string, any>} */
SharkGame.PlayerResources = new Map(); // stats about resources player has
SharkGame.PlayerIncomeTable = new Map(); // every resource and how much is produced
SharkGame.ResourceMap = new Map(); // every resource and what it produces at base income and after modifiers are applied
SharkGame.BreakdownIncomeTable = new Map(); // a map which has every single generator and what it produces, after costScaling
SharkGame.FlippedBreakdownIncomeTable = new Map(); // each resource and what produces it and how much
SharkGame.ModifierMap = new Map(); // the static multipliers and modifiers to each resource from upgrades, the world, etc
SharkGame.ResourceIncomeAffectors = {}; // these two are used to preserve the integrity of the original table in sharkgame.resourcetable
SharkGame.GeneratorIncomeAffectors = {}; // this allows free modification of these, in accordance with modifiers and events

SharkGame.Resources = {
    INCOME_COLOR: "#909090",
    TOTAL_INCOME_COLOR: "#A0A0A0",
    UPGRADE_MULTIPLIER_COLOR: "#60A060",
    WORLD_MULTIPLIER_COLOR: "#6060A0",
    ASPECT_MULTIPLIER_COLOR: "#70B5A0",
    RESOURCE_AFFECT_MULTIPLIER_COLOR: "#BFBF5A",

    specialMultiplier: null,
    rebuildTable: false,

    collapsedRows: new Set(),

    init() {
        // set all the amounts and total amounts of resources to 0
        $.each(SharkGame.ResourceTable, (resourceId, resource) => {
            SharkGame.ResourceMap.set(resourceId, _.cloneDeep(resource));
        });

        SharkGame.ResourceMap.forEach((resource, resourceId) => {
            // create the baseIncome data
            if (resource.income) {
                resource.baseIncome = _.cloneDeep(resource.income);
            }

            // create the playerresources map
            SharkGame.PlayerResources.set(resourceId, {
                amount: 0,
                totalAmount: 0,
            });

            // populate the flipped income breakdown map
            SharkGame.FlippedBreakdownIncomeTable.set(resourceId, {});

            // populate income table with an entry for each resource!!
            SharkGame.PlayerIncomeTable.set(resourceId, 0);
        });

        // set up the modifier reference, and also set up the object we copy to every entry in the modifier map
        const multiplierObject = {};
        $.each(SharkGame.ModifierTypes, (category, types) => {
            multiplierObject[category] = {};
            $.each(types, (type, modifiers) => {
                multiplierObject[category][type] = {};
                $.each(modifiers, (name, object) => {
                    // additionally set values for the types and categories of stuff
                    object.category = category;
                    object.type = type;
                    SharkGame.ModifierReference.set(name, object);
                    multiplierObject[category][type][name] = object.defaultValue;
                });
            });
        });

        // build multiplier map
        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            SharkGame.ModifierMap.set(resourceId, _.cloneDeep(multiplierObject));
        });

        res.specialMultiplier = 1;
        SharkGame.ResourceIncomeAffectors = _.cloneDeep(SharkGame.ResourceIncomeAffectorsOriginal);
        SharkGame.GeneratorIncomeAffectors = _.cloneDeep(SharkGame.GeneratorIncomeAffectorsOriginal);
        res.clearNetworks();
    },

    processIncomes(timeDelta, debug) {
        res.recalculateIncomeTable(true);
        if (res.testGracePeriod()) {
            return;
        }

        if (!debug && timeDelta > 51) {
            for (let i = 0; i < 50; i++) {
                SharkGame.PlayerIncomeTable.forEach((amount, resourceId) => {
                    res.changeResource(resourceId, amount);
                });
                res.recalculateIncomeTable(true);
                timeDelta -= 1;
            }
            if (timeDelta > 172800) {
                timeDelta = res.doRKMethod(timeDelta, timeDelta / 1728, 50000);
            }
            if (timeDelta > 43200) {
                timeDelta = res.doRKMethod(timeDelta, 100, 8000);
            }
            if (timeDelta > 7200) {
                timeDelta = res.doRKMethod(timeDelta, 75, 2250);
            }
            if (timeDelta > 2000) {
                timeDelta = res.doRKMethod(timeDelta, 40, 500);
            }
            if (timeDelta > 50) {
                timeDelta = res.doRKMethod(timeDelta, 20, 50);
            }
        }
        while (timeDelta > 1) {
            SharkGame.PlayerIncomeTable.forEach((income, resourceId) => {
                if (!SharkGame.ResourceSpecialProperties.timeImmune.includes(resourceId)) {
                    res.changeResource(resourceId, income);
                } else {
                    res.changeResource(resourceId, income);
                }
            });
            res.recalculateIncomeTable(true);
            timeDelta -= 1;
        }
        SharkGame.PlayerIncomeTable.forEach((amount, resourceId) => {
            if (!SharkGame.ResourceSpecialProperties.timeImmune.includes(resourceId)) {
                res.changeResource(resourceId, amount * timeDelta);
            } else {
                res.changeResource(resourceId, amount);
            }
        });
        res.recalculateIncomeTable();
    },

    doRKMethod(time, factor, threshold) {
        let originalResources;
        let originalIncomes;
        let stepTwoIncomes;
        let stepThreeIncomes;

        while (time > threshold) {
            originalResources = _.cloneDeep(SharkGame.PlayerResources);
            originalIncomes = _.cloneDeep(SharkGame.PlayerIncomeTable);

            SharkGame.PlayerIncomeTable.forEach((income, resourceId) => {
                if (!SharkGame.ResourceSpecialProperties.timeImmune.includes(resourceId)) {
                    res.changeResource(resourceId, (income * factor) / 2, true);
                }
            });

            res.recalculateIncomeTable(true);
            stepTwoIncomes = _.cloneDeep(SharkGame.PlayerIncomeTable);

            SharkGame.PlayerIncomeTable.forEach((amount, resourceId) => {
                if (!SharkGame.ResourceSpecialProperties.timeImmune.includes(resourceId)) {
                    res.changeResource(resourceId, (amount * factor) / 2, true);
                }
            });

            res.recalculateIncomeTable(true);
            stepThreeIncomes = _.cloneDeep(SharkGame.PlayerIncomeTable);

            SharkGame.PlayerIncomeTable.forEach((amount, resourceId) => {
                if (!SharkGame.ResourceSpecialProperties.timeImmune.includes(resourceId)) {
                    res.changeResource(resourceId, amount * factor, true);
                }
            });

            res.recalculateIncomeTable(true);
            SharkGame.PlayerResources = originalResources;

            SharkGame.PlayerIncomeTable.forEach((_amount, resource) => {
                res.changeResource(
                    resource,
                    (factor *
                        (originalIncomes.get(resource) +
                            2 * stepTwoIncomes.get(resource) +
                            2 * stepThreeIncomes.get(resource) +
                            SharkGame.PlayerIncomeTable.get(resource))) /
                        6,
                    true
                );
            });

            res.recalculateIncomeTable(true);
            time -= factor;
        }
        return time;
    },

    recalculateIncomeTable(cheap) {
        // clear income table first
        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            SharkGame.PlayerIncomeTable.set(resourceId, 0);
        });

        const worldResources = world.worldResources;

        SharkGame.ResourceMap.forEach((resource, resourceId) => {
            const worldResourceInfo = worldResources.get(resourceId);
            if (worldResourceInfo.exists) {
                // for this resource, calculate the income it generates
                if (resource.income) {
                    let costScaling = 1;
                    const changeMap = new Map();

                    $.each(resource.income, (generatedResource) => {
                        if (world.doesResourceExist(generatedResource)) {
                            changeMap.set(generatedResource, res.getProductAmountFromGeneratorResource(resourceId, generatedResource));
                        }
                    });

                    changeMap.forEach((generatedAmount, generatedResource) => {
                        // run over all resources first to check if costs can be met
                        // if the cost can't be taken, scale the cost and output down to feasible levels
                        if (!generatedResource.forceIncome) {
                            if (generatedAmount < 0) {
                                const resourceHeld = res.getResource(generatedResource);
                                if (resourceHeld + generatedAmount <= 0) {
                                    const scaling = resourceHeld / -generatedAmount;
                                    if (scaling >= 0 && scaling < 1) {
                                        // sanity checking
                                        costScaling = Math.min(costScaling, scaling);
                                    } else {
                                        costScaling = 0; // better to break this way than break explosively
                                    }
                                }
                            }
                        }
                        if (generatedAmount > 0) {
                            SharkGame.PlayerResources.get(generatedResource).discovered = true;
                        }
                    });

                    if (!cheap) {
                        const trueIncomeObject = {};
                        let income;
                        changeMap.forEach((amount, generatedResource) => {
                            income = amount * costScaling;
                            trueIncomeObject[generatedResource] = income;
                            SharkGame.FlippedBreakdownIncomeTable.get(generatedResource)[resourceId] = income;
                            SharkGame.PlayerIncomeTable.set(generatedResource, SharkGame.PlayerIncomeTable.get(generatedResource) + income);
                        });
                        SharkGame.BreakdownIncomeTable.set(resourceId, trueIncomeObject);
                    } else {
                        changeMap.forEach((amount, generatedResource) => {
                            SharkGame.PlayerIncomeTable.set(
                                generatedResource,
                                SharkGame.PlayerIncomeTable.get(generatedResource) + amount * costScaling
                            );
                        });
                    }
                }

                // calculate any world income that should be added to this resource
                if (worldResourceInfo) {
                    SharkGame.PlayerIncomeTable.set(resourceId, SharkGame.PlayerIncomeTable.get(resourceId) + worldResourceInfo.income * cad.speed);
                }
            }
        });

        $.each(SharkGame.ResourceSpecialProperties.incomeCap, (resourceId, maxProduction) => {
            if (SharkGame.PlayerIncomeTable.get(resourceId) > maxProduction) {
                SharkGame.PlayerIncomeTable.set(resourceId, maxProduction);
            }
        });
    },

    getProductAmountFromGeneratorResource(generator, product, numGenerator = res.getResource(generator)) {
        return (
            SharkGame.ResourceMap.get(generator).income[product] *
            numGenerator *
            res.getSpecialMultiplier() *
            res.getNetworkIncomeModifier("generator", generator) *
            res.getNetworkIncomeModifier("resource", product) *
            cad.speed
        );
    },

    getNetworkIncomeModifier(network, resource) {
        switch (network) {
            case "generator":
                network = SharkGame.GeneratorIncomeAffected;
                break;
            case "resource":
                network = SharkGame.ResourceIncomeAffected;
        }

        const node = network[resource];
        let multiplier = 1;
        if (node) {
            if (node.multiply) {
                $.each(node.multiply, (resourceOrGroup, amount) => {
                    multiplier = multiplier * (1 + amount * res.getResource(resourceOrGroup));
                });
            }
            if (node.reciprocate) {
                $.each(node.reciprocate, (resourceOrGroup, amount) => {
                    multiplier = multiplier / (1 + amount * res.getResource(resourceOrGroup));
                });
            }
            if (node.exponentiate) {
                $.each(node.exponentiate, (resourceOrGroup, amount) => {
                    multiplier = multiplier * Math.pow(amount, res.getResource(resourceOrGroup));
                });
            }
            if (node.polynomial) {
                $.each(node.polynomial, (resourceOrGroup, amount) => {
                    multiplier = multiplier * (1 + Math.pow(res.getResource(resourceOrGroup), amount));
                });
            }
        }
        return multiplier;
    },

    getSpecialMultiplier() {
        return res.specialMultiplier;
    },

    getIncome(resource) {
        return SharkGame.PlayerIncomeTable.get(resource);
    },

    // Adds or subtracts resources based on amount given.
    changeResource(resource, amount, norecalculation) {
        if (Math.abs(amount) < SharkGame.EPSILON) {
            return; // ignore changes below epsilon
        }

        const resourceTable = SharkGame.PlayerResources.get(resource);
        const prevTotalAmount = resourceTable.totalAmount;

        if (!world.doesResourceExist(resource)) {
            return; // don't change resources that don't technically exist
        }

        resourceTable.amount += amount;
        if (resourceTable.amount < 0) {
            resourceTable.amount = 0;
        }

        if (amount > 0) {
            resourceTable.totalAmount += amount;
        }

        if (prevTotalAmount < SharkGame.EPSILON) {
            // we got a new resource
            res.rebuildTable = true;
        }

        if (!norecalculation) {
            res.recalculateIncomeTable();
        }
    },

    setResource(resource, newValue) {
        const resourceTable = SharkGame.PlayerResources.get(resource);

        resourceTable.amount = newValue;
        if (resourceTable.amount < 0) {
            resourceTable.amount = 0;
        }
        res.recalculateIncomeTable();
    },

    setTotalResource(resource, newValue) {
        SharkGame.PlayerResources.get(resource).totalAmount = newValue;
    },

    getResource(resource) {
        return SharkGame.PlayerResources.get(resource).amount;
    },

    getTotalResource(resource) {
        return SharkGame.PlayerResources.get(resource).totalAmount;
    },

    isCategoryVisible(category) {
        return _.some(category.resources, (resourceName) => {
            const resource = SharkGame.PlayerResources.get(resourceName);
            return (resource.totalAmount > 0 || resource.discovered) && world.doesResourceExist(resourceName);
        });
    },

    getCategoryOfResource(resourceName) {
        return _.findKey(SharkGame.ResourceCategories, (category) => _.some(category.resources, (resource) => resource === resourceName));
    },

    getResourcesInCategory(categoryName) {
        const resources = [];
        SharkGame.ResourceCategories[categoryName].resources.forEach((resourceName) => resources.push(resourceName));
        return resources;
    },

    isCategory(name) {
        return typeof SharkGame.ResourceCategories[name] !== "undefined";
    },

    isInCategory(resource, category) {
        return SharkGame.ResourceCategories[category].resources.indexOf(resource) !== -1;
    },

    getBaseOfResource(resourceName) {
        // if there are super-categories/base jobs of a resource, return that, otherwise return null
        for (const [resourceId, resource] of SharkGame.ResourceMap) {
            if (_.some(resource.jobs, (jobName) => jobName === resourceName)) {
                return resourceId;
            }
        }
        return null;
    },

    haveAnyResources() {
        for (const [, resource] of SharkGame.PlayerResources) {
            if (resource.totalAmount > 0) return true;
        }
        return false;
    },

    // returns true if enough resources are held (>=)
    // false if they are not
    checkResources(resourceList, checkTotal) {
        return _.every(resourceList, (required, resource) => {
            const currentAmount = checkTotal ? res.getTotalResource(resource) : res.getResource(resource);
            return currentAmount >= required;
        });
    },

    changeManyResources(resourceList, subtract) {
        if (typeof subtract === "undefined") {
            subtract = false;
        }

        $.each(resourceList, (resource, amount) => {
            res.changeResource(resource, subtract ? -amount : amount);
        });
    },

    scaleResourceList(resourceList, amount) {
        const newList = {};
        $.each(resourceList, (resource, resourceAmount) => {
            newList[resource] = resourceAmount * amount;
        });
        return newList;
    },

    // update values in table without adding rows
    updateResourcesTable() {
        // if resource table does not exist, there are no resources, so do not construct table
        // if a resource became visible when it previously wasn't, reconstruct the table
        if (res.rebuildTable) {
            res.reconstructResourcesTable();
        } else {
            // loop over table rows, update values
            SharkGame.PlayerResources.forEach((resource, resourceName) => {
                const oldValue = $("#amount-" + resourceName).html();
                const newValue = "⠀" + main.beautify(resource.amount, true);
                if (oldValue !== newValue.replace(/'/g, '"')) {
                    $("#amount-" + resourceName).html(newValue);
                }

                const income = res.getIncome(resourceName);
                if (Math.abs(income) > SharkGame.EPSILON) {
                    const changeChar = income > 0 ? "+" : "";
                    const newIncome = "⠀" + "<span style='color:" + res.INCOME_COLOR + "'>" + changeChar + main.beautifyIncome(income) + "</span>";
                    const oldIncome = $("#income-" + resourceName).html();
                    if (oldIncome !== newIncome.replace(/'/g, '"')) {
                        $("#income-" + resourceName).html(newIncome);
                    }
                } else {
                    $("#income-" + resourceName).html("");
                }
            });
        }
    },

    // add rows to table (more expensive than updating existing DOM elements)
    reconstructResourcesTable() {
        let resourceTable = $("#resourceTable");

        const statusDiv = $("#status");
        // if resource table does not exist, create
        if (resourceTable.length <= 0) {
            statusDiv.prepend("<h3>Stuff</h3>");
            const tableContainer = $("<div>").attr("id", "resourceTableContainer");
            tableContainer.append($("<table>").attr("id", "resourceTable"));
            statusDiv.append(tableContainer);
            resourceTable = $("#resourceTable");
        }

        // remove the table contents entirely
        resourceTable.empty();

        let anyResourcesInTable = false;

        if (SharkGame.Settings.current.groupResources) {
            $.each(SharkGame.ResourceCategories, (categoryName, category) => {
                if (res.isCategoryVisible(category)) {
                    const icon = res.collapsedRows.has(categoryName) ? "⯈" : "⯆";
                    const headerRow = $("<tr>")
                        .append(
                            $("<td>")
                                .attr("colSpan", 3)
                                .append(
                                    $("<h3>").html(`<span class="collapser">${icon}</span><span>${categoryName}</span>`).css("text-align", "left")
                                )
                        )
                        .on("click", () => SharkGame.Resources.collapseResourceTableRow(categoryName));

                    resourceTable.append(headerRow);
                    $.each(category.resources, (_resourceName, resourceValue) => {
                        if (res.getTotalResource(resourceValue) > 0 || SharkGame.PlayerResources.get(resourceValue).discovered) {
                            if (!res.collapsedRows.has(categoryName)) {
                                const row = res.constructResourceTableRow(resourceValue);
                                resourceTable.append(row);
                            }
                            anyResourcesInTable = true;
                        }
                    });
                }
            });
        } else {
            // iterate through data, if total amount > 0 add a row
            SharkGame.ResourceMap.forEach((_resource, resourceId) => {
                if (
                    (res.getTotalResource(resourceId) > 0 || SharkGame.PlayerResources.get(resourceId).discovered) &&
                    world.doesResourceExist(resourceId)
                ) {
                    const row = res.constructResourceTableRow(resourceId);
                    resourceTable.append(row);
                    anyResourcesInTable = true;
                }
            });
        }

        // if the table is still empty, hide the status div
        // otherwise show it
        if (!anyResourcesInTable) {
            statusDiv.hide();
        } else {
            statusDiv.show();
        }

        // debugger;
        resourceTable.css("min-width", resourceTable.outerWidth() + "px");

        res.rebuildTable = false;
    },

    collapseResourceTableRow(categoryName) {
        if (this.collapsedRows.has(categoryName)) {
            this.collapsedRows.delete(categoryName);
        } else {
            this.collapsedRows.add(categoryName);
        }
        this.reconstructResourcesTable();
    },

    constructResourceTableRow(resourceKey) {
        const playerResources = SharkGame.PlayerResources.get(resourceKey);
        const income = res.getIncome(resourceKey);
        const row = $("<tr>").attr("id", resourceKey).on("mouseenter", res.tableTextEnter).on("mouseleave", res.tableTextLeave);
        if (playerResources.totalAmount > 0 || SharkGame.PlayerResources.get(resourceKey).discovered) {
            row.append(
                $("<td>")
                    .attr("id", "resource-" + resourceKey)
                    .html(res.getResourceName(resourceKey))
            );

            row.append(
                $("<td>")
                    .attr("id", "amount-" + resourceKey)
                    .html("⠀" + main.beautify(playerResources.amount))
            );

            const incomeId = $("<td>").attr("id", "income-" + resourceKey);

            row.append(incomeId);

            if (Math.abs(income) > SharkGame.EPSILON) {
                const changeChar = income > 0 ? "+" : "";
                incomeId.html("⠀<span style='color:" + res.INCOME_COLOR + "'>" + changeChar + main.beautifyIncome(income) + "</span>");
            }
        }
        return row;
    },

    tableTextEnter(_mouseEnterEvent, resourceName = false) {
        if (!SharkGame.Settings.current.showTooltips) {
            return;
        }
        if (!resourceName) {
            resourceName = $(this).attr("id");
        }
        const generators = SharkGame.FlippedBreakdownIncomeTable.get(resourceName);
        let producertext = "";
        let consumertext = "";
        $.each(generators, (which, amount) => {
            if (Math.abs(amount) > SharkGame.EPSILON) {
                if (amount > 0) {
                    producertext += "<br>";
                    producertext +=
                        main.beautify(res.getResource(which)).bold() +
                        " " +
                        res.getResourceName(which, false, false, false, SharkGame.getElementColor("tooltipbox", "background-color")) +
                        "  <span class='littleTooltipText'>at</span>  " +
                        main.beautifyIncome(amount).bold();
                } else if (amount < 0) {
                    consumertext += "<br>";
                    consumertext +=
                        main.beautify(res.getResource(which)).bold() +
                        " " +
                        res.getResourceName(which, false, false, false, SharkGame.getElementColor("tooltipbox", "background-color")) +
                        "  <span class='littleTooltipText'>at</span>  " +
                        main.beautifyIncome(-amount).bold();
                }
            }
        });

        /*         if (producertext === "" && consumertext === "") {
            return;
        } */

        let text = res.getResourceName(resourceName, false, false, 2, SharkGame.getElementColor("tooltipbox", "background-color"));
        if (producertext !== "") {
            text += "<br><span class='littleTooltipText'>PRODUCED BY</span>" + producertext;
        }
        if (consumertext !== "") {
            text += "<br><span class='littleTooltipText'>CONSUMED BY</span>" + consumertext;
        }

        if (SharkGame.ResourceMap.get(resourceName).desc) {
            text += "<br><span class='medDesc'>" + SharkGame.ResourceMap.get(resourceName).desc + "</span>";
        }
        if (document.getElementById("tooltipbox").innerHTML !== text.replace(/'/g, '"')) {
            document.getElementById("tooltipbox").innerHTML = text;
        }
        $(".tooltip").addClass("forIncomeTable").attr("current", resourceName);
    },

    tableTextLeave() {
        document.getElementById("tooltipbox").innerHTML = "";
        $(".tooltip").removeClass("forIncomeTable").attr("current", "");
    },

    getResourceName(resourceName, darken, forceSingle, arbitraryAmount, background) {
        if (res.isCategory(resourceName)) {
            return SharkGame.ResourceCategories[resourceName].name;
        }
        const resource = SharkGame.ResourceMap.get(resourceName);
        const amount = arbitraryAmount ? arbitraryAmount : Math.floor(SharkGame.PlayerResources.get(resourceName).amount);
        let name = amount - 1 < SharkGame.EPSILON || forceSingle ? resource.singleName : resource.name;
        let extraStyle = "";

        if (SharkGame.Settings.current.boldCosts) {
            name = name.bold();
        }

        if (SharkGame.Settings.current.colorCosts) {
            let color = resource.color;
            if (darken) {
                color = SharkGame.colorLum(resource.color, -0.5);
            } else if (background) {
                // this code takes the HSV of the text and its background, if its color is provided,
                // and compares their Values. If they are less than 20 away, then they're too close
                // then calculate exactly how much it takes to get them up to 20 away
                // if the text's value is less, make it 20 below that of the background
                // if the text's value is more, make it 20 above that of the background
                const backValue = SharkGame.getColorValue(background);
                const colorValue = SharkGame.getColorValue(color);
                if (Math.abs(colorValue - backValue) < 20) {
                    if (colorValue > backValue) {
                        color = SharkGame.colorLum(color, (backValue + 20) / colorValue - 1);
                    } else {
                        color = SharkGame.colorLum(color, (backValue - 20) / colorValue - 1);
                    }
                }
            }
            extraStyle = " style='color:" + color + "'";
        }
        return "<span class='click-passthrough'" + extraStyle + ">" + name + "</span>";
    },

    // make a resource list object into a string describing its contents
    resourceListToString(resourceList, darken, backgroundColor) {
        if ($.isEmptyObject(resourceList)) {
            return "";
        }
        let formattedResourceList = "";
        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            const listResource = resourceList[resourceId];
            // amend for unspecified resources (assume zero)
            if (listResource > 0 && world.doesResourceExist(resourceId)) {
                const isSingular = Math.floor(listResource) - 1 < SharkGame.EPSILON;
                formattedResourceList += main.beautify(listResource);
                formattedResourceList += " " + res.getResourceName(resourceId, darken, isSingular, listResource, backgroundColor) + ", ";
            }
        });
        // snip off trailing suffix
        formattedResourceList = formattedResourceList.slice(0, -2);
        return formattedResourceList;
    },

    buildIncomeNetwork() {
        // completes the network of resources whose incomes are affected by other resources
        // takes the order of the gia and reverses it to get the rgad.

        const gia = SharkGame.GeneratorIncomeAffectors;
        const rgad = SharkGame.GeneratorIncomeAffected;
        const resourceCategories = SharkGame.ResourceCategories;
        // recursively parse the gia
        $.each(gia, (affectorResource) => {
            $.each(gia[affectorResource], (type) => {
                $.each(gia[affectorResource][type], (affectedGeneratorCategory, value) => {
                    // is it a category or a generator?
                    const nodes = res.isCategory(affectedGeneratorCategory)
                        ? resourceCategories[affectedGeneratorCategory].resources
                        : [affectedGeneratorCategory];
                    // recursively reconstruct the table with the keys in the inverse order
                    // eslint-disable-next-line id-length
                    $.each(nodes, (_k, affectedGenerator) => {
                        if (world.worldResources.get(affectedGenerator).exists && world.worldResources.get(affectorResource).exists) {
                            res.addNetworkNode(rgad, affectedGenerator, type, affectorResource, value);
                        }
                    });
                });
            });
        });

        // resources incomes below, generators above
        const ria = SharkGame.ResourceIncomeAffectors;
        const rad = SharkGame.ResourceIncomeAffected;
        // recursively parse the ria
        $.each(ria, (affectorResource) => {
            $.each(ria[affectorResource], (type) => {
                $.each(ria[affectorResource][type], (affectedResourceCategory, degree) => {
                    // is it a category?
                    const nodes = res.isCategory(affectedResourceCategory)
                        ? resourceCategories[affectedResourceCategory].resources
                        : [affectedResourceCategory];
                    // recursively reconstruct the table with the keys in the inverse order
                    // eslint-disable-next-line id-length
                    $.each(nodes, (_k, affectedResource) => {
                        if (world.worldResources.get(affectedResource).exists && world.worldResources.get(affectorResource).exists) {
                            res.addNetworkNode(rad, affectedResource, type, affectorResource, degree);
                        }
                    });
                });
            });
        });
    },

    clearNetworks() {
        SharkGame.GeneratorIncomeAffected = {};
        SharkGame.ResourceIncomeAffected = {};
    },

    /**
     * Adds a parameter in a nested object, specifically 3 layers deep
     * @param {object} network The nested object to add a paramater to
     * @param {string} high The top-level parameter to index
     * @param {string} mid The second-level paramater to index
     * @param {string} low The paramater to assign
     * @param {number} value The value of that parameter
     */
    addNetworkNode(network, high, mid, low, value) {
        if (!network[high]) {
            network[high] = {};
        }
        if (!network[high][mid]) {
            network[high][mid] = {};
        }
        network[high][mid][low] = value;
    },

    applyModifier(name, target, degree, level = 1) {
        if (res.isCategory(target)) {
            target = res.getResourcesInCategory(target);
        } else if (typeof target !== "object") {
            target = [target];
        }
        _.each(target, (resource) => {
            const modifier = SharkGame.ModifierReference.get(name);
            const type = modifier.type;
            const category = modifier.category;
            SharkGame.ModifierMap.get(resource)[category][type][name] = modifier.apply(
                SharkGame.ModifierMap.get(resource)[category][type][name],
                degree,
                resource,
                level
            );
        });
    },

    reapplyModifiers(generator, generated) {
        let income = SharkGame.ResourceMap.get(generator).baseIncome[generated];
        SharkGame.ModifierReference.forEach((modifier, name) => {
            const generatorDegree = SharkGame.ModifierMap.get(generator)[modifier.category][modifier.type][name];
            const generatedDegree = SharkGame.ModifierMap.get(generated)[modifier.category][modifier.type][name];
            income = modifier.applyToInput(income, generatorDegree, generatedDegree, generator, generated);
        });
        SharkGame.ResourceMap.get(generator).income[generated] = income;
    },

    getMultiplierProduct(category, generator, generated, treatOneAsNone = false) {
        let product = 1;
        $.each(SharkGame.ModifierTypes[category].multiplier, (name, data) => {
            const generatorDegree = SharkGame.ModifierMap.get(generator)[data.category][data.type][name];
            const generatedDegree = SharkGame.ModifierMap.get(generated)[data.category][data.type][name];
            product *= data.getEffect(generatorDegree, generatedDegree, generator, generated);
        });
        if (treatOneAsNone && product === 1) {
            return "";
        }
        return product;
    },

    getPurchaseAmount(resource) {
        const buy = main.getBuyAmount();
        const owned = res.getResource(resource);

        if (buy > 0) {
            return buy;
        } else {
            return Math.floor(owned / -buy);
        }
    },

    testGracePeriod() {
        let grace = true;
        SharkGame.PlayerIncomeTable.forEach((income, resourceId) => {
            if (!res.isInCategory(resourceId, "harmful") && income !== 0) {
                grace = false;
            }
        });
        return grace;
    },
};

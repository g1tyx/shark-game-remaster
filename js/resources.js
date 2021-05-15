"use strict";
/** @type {Map<string, any>} */
SharkGame.PlayerResources = new Map(); // stats about resources player has
SharkGame.PlayerIncomeTable = new Map(); // every resource and how much is produced
SharkGame.ResourceMap = new Map(); // every resource and what it produces at base income and after modifiers are applied
SharkGame.BreakdownIncomeTable = new Map(); // a map which has every single generator and what it produces, after costScaling
SharkGame.FlippedBreakdownIncomeTable = new Map(); // each resource and what produces it and how much
SharkGame.ModifierMap = new Map(); // the static multipliers and modifiers to each resource from upgrades, the world, etc
SharkGame.ResourceIncomeAffectorsClone = {}; // these two are used to preserve the integrity of the original table in sharkgame.resourcetable
SharkGame.GeneratorIncomeAffectorsClone = {}; // this allows free modification of these, in accordance with modifiers and events

SharkGame.Resources = {
    INCOME_COLOR: "#909090",
    TOTAL_INCOME_COLOR: "#A0A0A0",
    UPGRADE_MULTIPLIER_COLOR: "#60A060",
    WORLD_MULTIPLIER_COLOR: "#6060A0",
    ARTIFACT_MULTIPLIER_COLOR: "#70B5A0",
    RESOURCE_AFFECT_MULTIPLIER_COLOR: "#BFBF5A",

    specialMultiplier: null,
    rebuildTable: false,

    collapsedRows: new Set(),

    init() {
        // set all the amounts and total amounts of resources to 0
        $.each(SharkGame.ResourceTable, (key, value) => {
            SharkGame.ResourceMap.set(key, _.cloneDeep(value));
        });

        SharkGame.ResourceMap.forEach((v, key) => {
            // create the baseIncome data
            if (v.income) {
                v.baseIncome = _.cloneDeep(v.income);
            }

            // create the playerresources map
            SharkGame.PlayerResources.set(key, {
                amount: 0,
                totalAmount: 0,
            });

            // populate the flipped income breakdown map
            SharkGame.FlippedBreakdownIncomeTable.set(key, {});

            // populate income table with an entry for each resource!!
            SharkGame.PlayerIncomeTable.set(key, 0);
        });

        // set up the modifier reference, and also set up the object we copy to every entry in the modifier map
        const multiplierObject = {};
        $.each(mt, (category, types) => {
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
        SharkGame.ResourceMap.forEach((_v, key) => {
            SharkGame.ModifierMap.set(key, _.cloneDeep(multiplierObject));
        });

        r.specialMultiplier = 1;
        SharkGame.ResourceIncomeAffectorsClone = _.cloneDeep(SharkGame.ResourceIncomeAffectors);
        SharkGame.GeneratorIncomeAffectorsClone = _.cloneDeep(SharkGame.GeneratorIncomeAffectors);
        r.clearNetworks();
    },

    processIncomes(timeDelta, debug) {
        r.recalculateIncomeTable(true);
        if (r.testGracePeriod()) {
            return;
        }

        if (!debug && timeDelta > 51) {
            for (let i = 0; i < 50; i++) {
                SharkGame.PlayerIncomeTable.forEach((value, key) => {
                    r.changeResource(key, value);
                });
                r.recalculateIncomeTable(true);
                timeDelta -= 1;
            }
            if (timeDelta > 172800) {
                timeDelta = r.doRKMethod(timeDelta, timeDelta / 1728, 50000);
            }
            if (timeDelta > 43200) {
                timeDelta = r.doRKMethod(timeDelta, 100, 8000);
            }
            if (timeDelta > 7200) {
                timeDelta = r.doRKMethod(timeDelta, 75, 2250);
            }
            if (timeDelta > 2000) {
                timeDelta = r.doRKMethod(timeDelta, 40, 500);
            }
            if (timeDelta > 50) {
                timeDelta = r.doRKMethod(timeDelta, 20, 50);
            }
        }
        while (timeDelta > 1) {
            SharkGame.PlayerIncomeTable.forEach((value, key) => {
                if (!SharkGame.ResourceSpecialProperties.timeImmune.includes(key)) {
                    r.changeResource(key, value);
                } else {
                    r.changeResource(key, value);
                }
            });
            r.recalculateIncomeTable(true);
            timeDelta -= 1;
        }
        SharkGame.PlayerIncomeTable.forEach((value, key) => {
            if (!SharkGame.ResourceSpecialProperties.timeImmune.includes(key)) {
                r.changeResource(key, value * timeDelta);
            } else {
                r.changeResource(key, value);
            }
        });
        r.recalculateIncomeTable();
    },

    doRKMethod(time, factor, threshold) {
        let originalResources;
        let originalIncomes;
        let stepTwoIncomes;
        let stepThreeIncomes;

        while (time > threshold) {
            originalResources = _.cloneDeep(SharkGame.PlayerResources);
            originalIncomes = _.cloneDeep(SharkGame.PlayerIncomeTable);

            SharkGame.PlayerIncomeTable.forEach((value, key) => {
                if (!SharkGame.ResourceSpecialProperties.timeImmune.includes(key)) {
                    r.changeResource(key, (value * factor) / 2, true);
                }
            });

            r.recalculateIncomeTable(true);
            stepTwoIncomes = _.cloneDeep(SharkGame.PlayerIncomeTable);

            SharkGame.PlayerIncomeTable.forEach((value, key) => {
                if (!SharkGame.ResourceSpecialProperties.timeImmune.includes(key)) {
                    r.changeResource(key, (value * factor) / 2, true);
                }
            });

            r.recalculateIncomeTable(true);
            stepThreeIncomes = _.cloneDeep(SharkGame.PlayerIncomeTable);

            SharkGame.PlayerIncomeTable.forEach((value, key) => {
                if (!SharkGame.ResourceSpecialProperties.timeImmune.includes(key)) {
                    r.changeResource(key, value * factor, true);
                }
            });

            r.recalculateIncomeTable(true);
            SharkGame.PlayerResources = originalResources;

            SharkGame.PlayerIncomeTable.forEach((_v, resource) => {
                r.changeResource(
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

            r.recalculateIncomeTable(true);
            time -= factor;
        }
        return time;
    },

    recalculateIncomeTable(cheap) {
        // clear income table first
        SharkGame.ResourceMap.forEach((_v, key) => {
            SharkGame.PlayerIncomeTable.set(key, 0);
        });

        const worldResources = w.worldResources;

        SharkGame.ResourceMap.forEach((properties, name) => {
            const worldResourceInfo = worldResources.get(name);
            if (worldResourceInfo.exists) {
                // for this resource, calculate the income it generates
                if (properties.income) {
                    let costScaling = 1;
                    const changeMap = new Map();

                    $.each(properties.income, (key) => {
                        if (w.doesResourceExist(key)) {
                            changeMap.set(key, r.getProductAmountFromGeneratorResource(name, key));
                        }
                    });

                    changeMap.forEach((change, resource) => {
                        // run over all resources first to check if costs can be met
                        // if the cost can't be taken, scale the cost and output down to feasible levels
                        if (!properties.forceIncome) {
                            if (change < 0) {
                                const resourceHeld = r.getResource(resource);
                                if (resourceHeld + change <= 0) {
                                    const scaling = resourceHeld / -change;
                                    if (scaling >= 0 && scaling < 1) {
                                        // sanity checking
                                        costScaling = Math.min(costScaling, scaling);
                                    } else {
                                        costScaling = 0; // better to break this way than break explosively
                                    }
                                }
                            }
                        }
                        if (change > 0) {
                            SharkGame.PlayerResources.get(resource).discovered = true;
                        }
                    });

                    if (!cheap) {
                        const trueIncomeObject = {};
                        let n;
                        changeMap.forEach((change, resource) => {
                            n = change * costScaling;
                            trueIncomeObject[resource] = n;
                            SharkGame.FlippedBreakdownIncomeTable.get(resource)[name] = n;
                            SharkGame.PlayerIncomeTable.set(resource, SharkGame.PlayerIncomeTable.get(resource) + n);
                        });
                        SharkGame.BreakdownIncomeTable.set(name, trueIncomeObject);
                    } else {
                        changeMap.forEach((change, resource) => {
                            SharkGame.PlayerIncomeTable.set(resource, SharkGame.PlayerIncomeTable.get(resource) + change * costScaling);
                        });
                    }
                }

                // calculate any world income that should be added to this resource
                if (worldResourceInfo) {
                    SharkGame.PlayerIncomeTable.set(name, SharkGame.PlayerIncomeTable.get(name) + worldResourceInfo.income * cad.speed);
                }
            }
        });

        $.each(SharkGame.ResourceSpecialProperties.incomeCap, (k, v) => {
            if (SharkGame.PlayerIncomeTable.get(k) > v) {
                SharkGame.PlayerIncomeTable.set(k, v);
            }
        });
    },

    getProductAmountFromGeneratorResource(generator, product, numGenerator = r.getResource(generator)) {
        return (
            SharkGame.ResourceMap.get(generator).income[product] *
            numGenerator *
            r.getSpecialMultiplier() *
            r.getNetworkIncomeModifier("generator", generator) *
            r.getNetworkIncomeModifier("resource", product) *
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
                $.each(node.multiply, (key, val) => {
                    multiplier = multiplier * (1 + val * r.getResource(key));
                });
            }
            if (node.reciprocate) {
                $.each(node.reciprocate, (key, val) => {
                    multiplier = multiplier / (1 + val * r.getResource(key));
                });
            }
            if (node.exponentiate) {
                $.each(node.exponentiate, (key, val) => {
                    multiplier = multiplier * Math.pow(val, r.getResource(key));
                });
            }
            if (node.polynomial) {
                $.each(node.polynomial, (key, val) => {
                    multiplier = multiplier * (1 + Math.pow(r.getResource(key), val));
                });
            }
        }
        return multiplier;
    },

    getSpecialMultiplier() {
        return r.specialMultiplier;
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

        if (!w.doesResourceExist(resource)) {
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
            r.rebuildTable = true;
        }

        if (!norecalculation) {
            r.recalculateIncomeTable();
        }
    },

    setResource(resource, newValue) {
        const resourceTable = SharkGame.PlayerResources.get(resource);

        resourceTable.amount = newValue;
        if (resourceTable.amount < 0) {
            resourceTable.amount = 0;
        }
        r.recalculateIncomeTable();
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
            return (resource.totalAmount > 0 || resource.discovered) && w.doesResourceExist(resourceName);
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
            const currentAmount = checkTotal ? r.getTotalResource(resource) : r.getResource(resource);
            return currentAmount >= required;
        });
    },

    changeManyResources(resourceList, subtract) {
        if (typeof subtract === "undefined") {
            subtract = false;
        }

        $.each(resourceList, (resource, amount) => {
            r.changeResource(resource, subtract ? -amount : amount);
        });
    },

    scaleResourceList(resourceList, amount) {
        const newList = {};
        $.each(resourceList, (k, v) => {
            newList[k] = v * amount;
        });
        return newList;
    },

    // update values in table without adding rows
    updateResourcesTable() {
        // if resource table does not exist, there are no resources, so do not construct table
        // if a resource became visible when it previously wasn't, reconstruct the table
        if (r.rebuildTable) {
            r.reconstructResourcesTable();
        } else {
            // loop over table rows, update values
            SharkGame.PlayerResources.forEach((resource, resourceName) => {
                const oldValue = $("#amount-" + resourceName).html();
                const newValue = "⠀" + m.beautify(resource.amount, true);
                if (oldValue !== newValue.replace(/'/g, '"')) {
                    $("#amount-" + resourceName).html(newValue);
                }

                const income = r.getIncome(resourceName);
                if (Math.abs(income) > SharkGame.EPSILON) {
                    const changeChar = income > 0 ? "+" : "";
                    const newIncome = "⠀" + "<span style='color:" + r.INCOME_COLOR + "'>" + changeChar + m.beautifyIncome(income) + "</span>";
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
                if (r.isCategoryVisible(category)) {
                    const icon = r.collapsedRows.has(categoryName) ? "⯈" : "⯆";
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
                        if (r.getTotalResource(resourceValue) > 0 || SharkGame.PlayerResources.get(resourceValue).discovered) {
                            if (!r.collapsedRows.has(categoryName)) {
                                const row = r.constructResourceTableRow(resourceValue);
                                resourceTable.append(row);
                            }
                            anyResourcesInTable = true;
                        }
                    });
                }
            });
        } else {
            // iterate through data, if total amount > 0 add a row
            SharkGame.ResourceMap.forEach((_v, key) => {
                if ((r.getTotalResource(key) > 0 || SharkGame.PlayerResources.get(key).discovered) && w.doesResourceExist(key)) {
                    const row = r.constructResourceTableRow(key);
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

        r.rebuildTable = false;
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
        const k = resourceKey;
        const pr = SharkGame.PlayerResources.get(k);
        const income = r.getIncome(k);
        const row = $("<tr>").attr("id", k).on("mouseenter", r.tableTextEnter).on("mouseleave", r.tableTextLeave);
        if (pr.totalAmount > 0 || SharkGame.PlayerResources.get(k).discovered) {
            row.append(
                $("<td>")
                    .attr("id", "resource-" + k)
                    .html(r.getResourceName(k))
            );

            row.append(
                $("<td>")
                    .attr("id", "amount-" + k)
                    .html("⠀" + m.beautify(pr.amount))
            );

            const incomeId = $("<td>").attr("id", "income-" + k);

            row.append(incomeId);

            if (Math.abs(income) > SharkGame.EPSILON) {
                const changeChar = income > 0 ? "+" : "";
                incomeId.html("⠀<span style='color:" + r.INCOME_COLOR + "'>" + changeChar + m.beautifyIncome(income) + "</span>");
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
                        m.beautify(r.getResource(which)).bold() +
                        " " +
                        r.getResourceName(which, false, false, false, SharkGame.getElementColor("tooltipbox", "background-color")) +
                        "  <span class='littleTooltipText'>at</span>  " +
                        m.beautifyIncome(amount).bold();
                } else if (amount < 0) {
                    consumertext += "<br>";
                    consumertext +=
                        m.beautify(r.getResource(which)).bold() +
                        " " +
                        r.getResourceName(which, false, false, false, SharkGame.getElementColor("tooltipbox", "background-color")) +
                        "  <span class='littleTooltipText'>at</span>  " +
                        m.beautifyIncome(-amount).bold();
                }
            }
        });

        /*         if (producertext === "" && consumertext === "") {
            return;
        } */

        let text = r.getResourceName(resourceName, false, false, 2, SharkGame.getElementColor("tooltipbox", "background-color"));
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
        if (r.isCategory(resourceName)) {
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
    resourceListToString(resourceList, darken, backgroundcolor) {
        if ($.isEmptyObject(resourceList)) {
            return "";
        }
        let formattedResourceList = "";
        SharkGame.ResourceMap.forEach((_v, key) => {
            const listResource = resourceList[key];
            // amend for unspecified resources (assume zero)
            if (listResource > 0 && w.doesResourceExist(key)) {
                const isSingular = Math.floor(listResource) - 1 < SharkGame.EPSILON;
                formattedResourceList += m.beautify(listResource);
                formattedResourceList += " " + r.getResourceName(key, darken, isSingular, listResource, backgroundcolor) + ", ";
            }
        });
        // snip off trailing suffix
        formattedResourceList = formattedResourceList.slice(0, -2);
        return formattedResourceList;
    },

    buildIncomeNetwork() {
        // completes the network of resources whose incomes are affected by other resources
        // takes the order of the gia and reverses it to get the rgad.

        const gia = SharkGame.GeneratorIncomeAffectorsClone;
        const rgad = SharkGame.GeneratorIncomeAffected;
        const rc = SharkGame.ResourceCategories;
        // recursively parse the gia
        $.each(gia, (resource) => {
            $.each(gia[resource], (type) => {
                $.each(gia[resource][type], (generator, value) => {
                    // is it a category or a generator?
                    const nodes = r.isCategory(generator) ? rc[generator].resources : [generator];
                    // recursively reconstruct the table with the keys in the inverse order
                    $.each(nodes, (_k, v) => {
                        if (w.worldResources.get(v).exists && w.worldResources.get(resource).exists) {
                            r.addNetworkNode(rgad, v, type, resource, value);
                        }
                    });
                });
            });
        });

        // resources incomes below, generators above
        const ria = SharkGame.ResourceIncomeAffectorsClone;
        const rad = SharkGame.ResourceIncomeAffected;
        // recursively parse the ria
        $.each(ria, (affectorResource) => {
            $.each(ria[affectorResource], (type) => {
                $.each(ria[affectorResource][type], (affectedResource, degree) => {
                    // is it a category?
                    const nodes = r.isCategory(affectedResource) ? rc[affectedResource].resources : [affectedResource];
                    // recursively reconstruct the table with the keys in the inverse order
                    $.each(nodes, (_k, v) => {
                        if (w.worldResources.get(v).exists && w.worldResources.get(affectorResource).exists) {
                            r.addNetworkNode(rad, v, type, affectorResource, degree);
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

    addNetworkNode(network, main, effect, sub, degree) {
        if (!network[main]) {
            network[main] = {};
        }
        if (!network[main][effect]) {
            network[main][effect] = {};
        }
        network[main][effect][sub] = degree;
    },

    applyModifier(name, target, degree, level = 1) {
        if (r.isCategory(target)) {
            target = r.getResourcesInCategory(target);
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
            const type = modifier.type;
            const category = modifier.category;
            income *= modifier.getEffect(SharkGame.ModifierMap.get(generator)[category][type][name], generator, generated);
        });
        SharkGame.ResourceMap.get(generator).income[generated] = income;
    },

    getMultiplierProduct(category, generator, generated, treatOneAsNone = false) {
        let product = 1;
        $.each(mt[category].multiplier, (name, data) => {
            product *= data.getEffect(SharkGame.ModifierMap.get(generator)[category].multiplier[name], generator, generated);
        });
        $.each(mt[category].multiplier, (name, data) => {
            product *= data.getEffect(SharkGame.ModifierMap.get(generated)[category].multiplier[name], generator, generated);
        });
        if (treatOneAsNone && product === 1) {
            return "";
        }
        return product;
    },

    getPurchaseAmount(resource) {
        const buy = m.getBuyAmount();
        const owned = r.getResource(resource);

        if (buy > 0) {
            return buy;
        } else {
            return Math.floor(owned / -buy);
        }
    },

    testGracePeriod() {
        let grace = true;
        SharkGame.PlayerIncomeTable.forEach((v, key) => {
            if (!r.isInCategory(key, "harmful")) {
                if (v !== 0) {
                    grace = false;
                }
            }
        });
        return grace;
    },
};

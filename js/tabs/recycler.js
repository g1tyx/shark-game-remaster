"use strict";
SharkGame.Recycler = {
    tabId: "recycler",
    tabDiscovered: false,
    tabName: "Recycler",
    tabBg: "img/bg/bg-recycler.png",

    sceneImage: "img/events/misc/scene-recycler.png",

    discoverReq: {
        upgrade: ["recyclerDiscovery"],
    },

    message:
        "The recycler allows for the repurposing of any and all of your unwanted materials.<br/><span class='medDesc'>Feed the machines. Feed them.</span>",

    recyclerInputMessages: [
        "The machines grind and churn.",
        "Screech clunk chomp munch erp.",
        "Clunk clunk clunk screeeeech.",
        "The recycler hungrily devours the stuff you offer.",
        "The offerings are no more.",
        "Viscous, oily mess sloshes within the machine.",
        "The recycler reprocesses.",
    ],

    recyclerOutputMessages: [
        "A brand new whatever!",
        "The recycler regurgitates your demand, immaculately formed.",
        "How does a weird blackish gel become THAT?",
        "Some more stuff to use! Maybe even to recycle!",
        "Gifts from the machine! Gifts that may have cost a terrible price!",
        "How considerate of this unfeeling, giant apparatus! It provides you stuff at inflated prices!",
    ],

    allowedCategories: {
        machines: "linear",
        stuff: "constant",
        processed: "constant",
        animals: "constant",
    },

    bannedResources: ["essence", "junk", "science", "seaApple", "coalescer", "ancientPart", "filter", "world"],

    efficiency: "NA",
    hoveredResource: "NA",
    expectedOutput: "NA",
    expectedJunkSpent: "NA",

    init() {
        main.registerTab(this);
    },

    switchTo() {
        const content = $("#content");
        content.append($("<div>").attr("id", "tabMessage"));
        const container = $("<div>").attr("id", "recyclerContainer");
        container.append($("<div>").attr("id", "inputButtons"));
        container.append($("<div>").attr("id", "junkDisplay"));
        container.append($("<div>").attr("id", "outputButtons"));
        content.append(container);
        content.append($("<div>").addClass("clear-fix"));
        let message = rec.message;
        const tabMessageSel = $("#tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + rec.sceneImage + "' id='tabSceneImageRed'>" + message;
            tabMessageSel.css("background-image", "url('" + rec.tabBg + "')");
        }
        tabMessageSel.html(message);

        main.createBuyButtons("eat", container, "prepend");
        rec.createButtons();
    },

    update() {
        rec.updateExpectedOutput();
        rec.updateExpectedJunkSpent();
        rec.updateJunkDisplay();
        rec.updateButtons();
    },

    updateJunkDisplay() {
        const junkAmount = res.getResource("junk");
        const junkDisplay = $("#junkDisplay");

        let junkString = "";
        if (rec.expectedOutput !== "NA") {
            junkString = "<span class='click-passthrough' style='color:#FFE436'>" + main.beautify(junkAmount + rec.expectedOutput) + "</span> ";
        } else if (rec.expectedJunkSpent !== "NA") {
            junkString = "<span class='click-passthrough' style='color:#FFE436'>" + main.beautify(junkAmount - rec.expectedJunkSpent) + "</span> ";
        } else {
            junkString = main.beautify(junkAmount);
        }

        const newValue = "CONTAINS:<br/>" + junkString.bold() + " RESIDUE<br/><br/>" + rec.getRecyclerEfficiencyString() + rec.getTarString().bold();
        const oldValue = junkDisplay.html();

        // Fix up beautified strings to match jquery returns for matching purposes.
        if (oldValue !== newValue.replace(/'/g, '"').replace(/<br\/>/g, "<br>")) {
            junkDisplay.html(newValue);
        }
    },

    updateButtons() {
        SharkGame.ResourceMap.forEach((_resource, resourceName) => {
            if (res.getTotalResource(resourceName) > 0) {
                const inputButton = $("#input-" + resourceName);
                // If this is a resource that's not in the recycler, skip it entirely.
                if (inputButton.length === 0) {
                    return true;
                }
                const outputButton = $("#output-" + resourceName);
                const resourceAmount = res.getResource(resourceName);

                // determine amounts for input and what would be retrieved from output
                const buy = main.getBuyAmount();
                let inputAmount = buy;
                let outputAmount = buy;
                const maxOutputAmount = rec.getMaxToBuy(resourceName);
                if (buy < 0) {
                    const divisor = Math.floor(buy) * -1;
                    inputAmount = Math.floor(resourceAmount / divisor);
                    outputAmount = Math.floor(maxOutputAmount / divisor);
                }

                // update input button
                let disableButton = resourceAmount < inputAmount || inputAmount <= 0;
                let label = "Recycle ";
                if (inputAmount > 0) {
                    if (rec.expectedJunkSpent !== "NA" && !disableButton && resourceName === rec.hoveredResource) {
                        if (buy < 0) {
                            label +=
                                "<span class='click-passthrough' style='color:#FFDE0A'>" +
                                main.beautify(inputAmount + outputAmount / -buy) +
                                "</span> ";
                        } else {
                            label += "<span class='click-passthrough' style='color:#FFDE0A'>" + main.beautify(inputAmount) + "</span> ";
                        }
                    } else {
                        label += main.beautify(inputAmount) + " ";
                    }
                }

                if (disableButton) {
                    inputButton.addClass("disabled");
                } else {
                    inputButton.removeClass("disabled");
                }

                label += res.getResourceName(
                    resourceName,
                    disableButton,
                    buy,
                    SharkGame.getElementColor("input-" + resourceName, "background-color")
                );
                if (inputButton.html() !== label.replace(/'/g, '"')) {
                    inputButton.html(label);
                }

                // update output button
                disableButton = maxOutputAmount < outputAmount || outputAmount <= 0;
                label = "Convert to ";
                if (outputAmount > 0) {
                    if (rec.expectedOutput !== "NA" && !disableButton) {
                        label += "<span class='click-passthrough' style='color:#FFDE0A'>" + main.beautify(outputAmount) + "</span> ";
                    } else {
                        label += main.beautify(outputAmount) + " ";
                    }
                }

                if (disableButton) {
                    outputButton.addClass("disabled");
                } else {
                    outputButton.removeClass("disabled");
                }

                label += res.getResourceName(
                    resourceName,
                    disableButton,
                    buy,
                    SharkGame.getElementColor("output-" + resourceName, "background-color")
                );
                if (outputButton.html() !== label.replace(/'/g, '"')) {
                    outputButton.html(label);
                }
            }
        });
    },

    createButtons() {
        const inputButtonDiv = $("#inputButtons");
        const outputButtonDiv = $("#outputButtons");
        SharkGame.ResourceMap.forEach((_resource, resourceName) => {
            if (
                res.getTotalResource(resourceName) > 0 &&
                rec.allowedCategories[res.getCategoryOfResource(resourceName)] &&
                rec.bannedResources.indexOf(resourceName) === -1
            ) {
                SharkGame.Button.makeHoverscriptButton(
                    "input-" + resourceName,
                    "Recycle " + res.getResourceName(resourceName),
                    inputButtonDiv,
                    rec.onInput,
                    rec.onInputHover,
                    rec.onInputUnhover
                );
                SharkGame.Button.makeHoverscriptButton(
                    "output-" + resourceName,
                    "Convert to " + res.getResourceName(resourceName),
                    outputButtonDiv,
                    rec.onOutput,
                    rec.onOutputHover,
                    rec.onOutputUnhover
                );
            }
        });
    },

    onInput() {
        const button = $(this);
        if (button.hasClass("disabled")) return;
        const resourceName = button.attr("id").split("-")[1];
        const resourceAmount = res.getResource(resourceName);
        const junkPerResource = SharkGame.ResourceMap.get(resourceName).value;
        const amount = res.getPurchaseAmount(resourceName);

        if (resourceAmount >= amount) {
            res.changeResource("junk", amount * junkPerResource * rec.getEfficiency());
            res.changeResource(resourceName, -amount);
            res.changeResource("tar", Math.max(amount * junkPerResource * 0.0000002 + res.getProductAmountFromGeneratorResource("filter", "tar"), 0));
            log.addMessage(SharkGame.choose(rec.recyclerInputMessages));
        } else {
            log.addError("Not enough resources for that transaction. This might be caused by putting in way too many resources at once.");
        }

        rec.updateEfficiency(resourceName);

        // disable button until next frame
        button.addClass("disabled");
    },

    onOutput() {
        const button = $(this);
        if (button.hasClass("disabled")) return;
        const resourceName = button.attr("id").split("-")[1];
        const junkAmount = res.getResource("junk");
        const junkPerResource = SharkGame.ResourceMap.get(resourceName).value;

        if (rec.expectedOutput !== "NA") {
            return;
        }

        const selectedAmount = main.getBuyAmount();
        let amount = selectedAmount;
        if (selectedAmount < 0) {
            const divisor = Math.floor(selectedAmount) * -1;
            amount = rec.getMaxToBuy(resourceName) / divisor;
        }

        const currentResourceAmount = res.getResource(resourceName);
        let junkNeeded;

        const costFunction = rec.allowedCategories[res.getCategoryOfResource(resourceName)];
        if (costFunction === "linear") {
            junkNeeded = SharkGame.MathUtil.linearCost(currentResourceAmount, currentResourceAmount + amount, junkPerResource);
        } else if (costFunction === "constant") {
            junkNeeded = SharkGame.MathUtil.constantCost(currentResourceAmount, currentResourceAmount + amount, junkPerResource);
        }

        if (junkAmount >= junkNeeded) {
            res.changeResource(resourceName, amount);
            res.changeResource("junk", -junkNeeded);
            log.addMessage(SharkGame.choose(rec.recyclerOutputMessages));
        } else {
            log.addMessage("You don't have enough for that!");
        }

        // disable button until next frame
        button.addClass("disabled");
    },

    getMaxToBuy(resource) {
        const resourceAmount = res.getResource(resource);
        const junkPricePerResource = SharkGame.ResourceMap.get(resource).value;
        const category = res.getCategoryOfResource(resource);
        let junkAmount = res.getResource("junk");
        if (rec.expectedOutput !== "NA") {
            junkAmount += rec.expectedOutput;
        }

        let max = 0;
        if (rec.allowedCategories[category]) {
            const costFunction = rec.allowedCategories[category];
            if (costFunction === "linear") {
                max = SharkGame.MathUtil.linearMax(resourceAmount, junkAmount, junkPricePerResource) - resourceAmount;
            } else if (costFunction === "constant") {
                max = SharkGame.MathUtil.constantMax(resourceAmount, junkAmount, junkPricePerResource) - resourceAmount;
            }
        }
        return Math.floor(max);
    },

    onInputHover() {
        const button = $(this);
        const resource = button.attr("id").split("-")[1];

        if (button.is(".disabled")) {
            return;
        }

        rec.hoveredResource = resource;
        rec.updateEfficiency(resource);
        rec.updateExpectedOutput();
    },

    onInputUnhover() {
        rec.efficiency = "NA";
        rec.hoveredResource = "NA";
        rec.expectedOutput = "NA";
    },

    onOutputHover() {
        const button = $(this);
        const resource = button.attr("id").split("-")[1];

        if (button.is(".disabled")) {
            return;
        }

        rec.efficiency = "NA";
        rec.hoveredResource = resource;
        rec.updateExpectedJunkSpent();
    },

    onOutputUnhover() {
        rec.hoveredResource = "NA";
        rec.expectedJunkSpent = "NA";
    },

    getTarString() {
        const buy = main.getBuyAmount();

        if (world.worldType === "abandoned") {
            if (rec.efficiency === "NA") {
                return "<br/><br/><br/><br/>";
            }

            const tarTolerance = -res.getProductAmountFromGeneratorResource("filter", "tar");
            let produced = SharkGame.ResourceMap.get(rec.hoveredResource).value * 0.0000002;
            if (buy > 0) {
                produced *= buy;
            } else {
                produced *= res.getResource(rec.hoveredResource) / -buy;
            }
            let amountstring = main.beautify(produced);
            amountstring = "<br/><br/>AND " + amountstring.bold() + " " + res.getResourceName("tar");
            if (tarTolerance > 0) {
                amountstring +=
                    "<br/>(" +
                    main.beautify(Math.max(produced - tarTolerance, 0)) +
                    " " +
                    res.getResourceName("tar") +
                    " WITH<br/>" +
                    res.getResourceName("filter", false, 2) +
                    ")";
            }
            return amountstring;
        }
        return "";
    },

    getRecyclerEfficiencyString() {
        if (rec.efficiency === "NA" || rec.hoveredResource === "NA") {
            return "<br/><br/><br/><br/><br/><br/>";
        }

        let amountstring = "";
        if (main.getBuyAmount() > 0) {
            amountstring = main.beautify(rec.efficiency * main.getBuyAmount());
        } else {
            amountstring = main.beautify((rec.efficiency * res.getResource(rec.hoveredResource)) / -main.getBuyAmount());
        }

        return (
            (rec.getEfficiency() * 100).toFixed(2).toString().bold() +
            "<b>%<br/>EFFICIENCY</b><br/><br/>EQUIVALENT TO:<br/>" +
            amountstring.bold() +
            " " +
            res.getResourceName(rec.hoveredResource).bold() +
            "<br/>WORTH OF RESIDUE"
        );
    },

    updateExpectedOutput() {
        const resource = rec.hoveredResource;
        if (resource === "NA" || rec.expectedJunkSpent !== "NA") {
            rec.expectedOutput = "NA";
            return;
        }
        const amount = res.getResource(resource);
        const buy = main.getBuyAmount();

        if (buy > 0) {
            rec.expectedOutput = buy * rec.getEfficiency() * SharkGame.ResourceMap.get(resource).value;
        } else {
            rec.expectedOutput = (amount * rec.getEfficiency() * SharkGame.ResourceMap.get(resource).value) / -buy;
        }
    },

    updateExpectedJunkSpent() {
        const resource = rec.hoveredResource;
        if (resource === "NA" || rec.expectedOutput !== "NA") {
            rec.expectedJunkSpent = "NA";
            return;
        }
        const junkAmount = res.getResource("junk");
        const buy = main.getBuyAmount();

        if (buy > 0) {
            rec.expectedJunkSpent = buy * SharkGame.ResourceMap.get(resource).value;
        } else {
            rec.expectedJunkSpent = junkAmount / -buy;
        }
    },

    getEfficiency() {
        if (rec.efficiency === "NA") {
            return 1;
        }
        rec.updateEfficiency(rec.hoveredResource);
        return rec.efficiency.toFixed(4);
    },

    updateEfficiency(resource) {
        let maxEfficiencyRecyclePowerOfTen = 5;
        let baseEfficiency = 0.5;

        if (SharkGame.Upgrades.purchased.includes("superprocessing")) {
            maxEfficiencyRecyclePowerOfTen = 8;
            baseEfficiency = 1;
        }

        const purchaseAmount = res.getPurchaseAmount(resource);
        // check if the amount to eat is less than the threshold
        if (purchaseAmount <= Math.pow(10, maxEfficiencyRecyclePowerOfTen)) {
            rec.efficiency = baseEfficiency;
        } else {
            //otherwise, scale back based purely on the number to process
            // 'cheating' by lowering the value of n is ok if the player wants to put in a ton of effort
            // the system is more sensible, and people can get a feel for it easier if i make this change
            // the amount that this effects things isn't crazy high either, so
            rec.efficiency = 1 / (Math.log10(purchaseAmount) - maxEfficiencyRecyclePowerOfTen + Math.round(1 / baseEfficiency));
        }
    },
};

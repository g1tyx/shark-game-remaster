SharkGame.Lab = {
    tabId: "lab",
    tabDiscovered: false,
    tabName: "Laboratory",
    tabBg: "img/bg/bg-lab.png",

    sceneImage: "img/events/misc/scene-lab.png",
    sceneDoneImage: "img/events/misc/scene-lab-done.png",

    discoverReq: {
        resource: {
            science: 10,
        },
    },

    notEmptyList: true,

    message: "Sort of just off to the side, the science sharks congregate and discuss things with words you've never heard before.",
    messageDone:
        "Sort of just off to the side, the science sharks quietly wrap up their badly disguised party and pretend to work.<br/>" +
        "Looks like that's it! No more things to figure out.",

    init() {
        const l = SharkGame.Lab;
        // register tab
        SharkGame.Tabs[l.tabId] = {
            id: l.tabId,
            name: l.tabName,
            discovered: l.tabDiscovered,
            discoverReq: l.discoverReq,
            code: l,
        };
        // add default purchased state to each upgrade
        l.resetUpgrades();
    },

    resetUpgrades() {
        const ups = SharkGame.Upgrades.getUpgradeTable();
        $.each(ups, (k, v) => {
            ups[k].purchased = false;
        });

        const upgradeObject = {};
        $.each(mt.upgrade, (type, modifiers) => {
            upgradeObject[type] = {};
            $.each(modifiers, (name, object) => {
                // additionally set values for the types and categories of stuff
                object.category = "upgrade";
                object.type = type;
                upgradeObject[type][name] = object.defaultValue;
            });
        });

        SharkGame.ResourceMap.forEach((v, key) => {
            SharkGame.ModifierMap.get(key).upgrade = _.cloneDeep(upgradeObject);
        });
    },

    switchTo() {
        const l = SharkGame.Lab;
        const content = $("#content");
        const ups = SharkGame.Upgrades.getUpgradeTable();

        const allResearchDone = l.allResearchDone();
        let message = allResearchDone ? l.messageDone : l.message;
        const imgSrc = allResearchDone ? l.sceneDoneImage : l.sceneImage;
        const tabMessageSel = $("<div>").attr("id", "tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + imgSrc + "' id='tabSceneImage'>" + message;
            tabMessageSel.css("background-image", "url('" + l.tabBg + "')");
        }
        tabMessageSel.html(message);
        content.append(tabMessageSel);
        const buttonListContainer = $("<div>").attr("id", "buttonLeftContainer");
        buttonListContainer.append($("<div>").attr("id", "buttonList").append($("<h3>").html("Available Upgrades")));
        content.append(buttonListContainer);
        content.append($("<div>").attr("id", "upgradeList"));
        content.append($("<div>").addClass("clear-fix"));

        l.updateUpgradeList();
        l.update();
        if (allResearchDone) {
            $("#buttonList").append($("<p>").html("All clear here!"));
        } else if (!l.notEmptyList) {
            $("#buttonList").append($("<p>").html("The scientists are out of ideas, but there are always more discoveries to be made."));
            let hintResource = "";
            $.each(ups, (k, v) => {
                if (l.isUpgradePossible(k) && !l.isUpgradeSeeable(k)) {
                    if (hintResource === "") {
                        if (v.required.upgrades) {
                            let prereqsMet = true;
                            $.each(v.required.upgrades, (_, value) => {
                                prereqsMet = prereqsMet && ups[value].purchased;
                            });
                            if (prereqsMet) {
                                _.each(v.required.seen, (resource) => {
                                    if (w.doesResourceExist(resource)) {
                                        hintResource = resource;
                                        return false;
                                    }
                                });
                            }
                        }
                    }
                }
            });
            if (hintResource) {
                $("#buttonList").append(
                    $("<p>").html("You get the feeling that " + r.getResourceName(hintResource, false, false, 2) + " may be the key.")
                );
            } else {
                SharkGame.Log.addError("There is a possible, undiscovered upgrade, but no valid hint resource.");
            }
        }
    },

    update() {
        const l = SharkGame.Lab;

        // cache a selector
        const buttonList = $("#buttonList");

        const ups = SharkGame.Upgrades.getUpgradeTable();
        l.notEmptyList = false;

        // for each upgrade not yet bought
        $.each(ups, (key, value) => {
            if (value.purchased) {
                return; // skip this upgrade altogether
            }

            // check if a button exists
            const button = $("#" + key);
            if (button.length === 0) {
                // add it if prequisite upgrades have been completed
                let prereqsMet = true; // assume true until proven false

                // check upgrade prerequisites
                if (value.required) {
                    // check previous upgrades
                    if (value.required.upgrades) {
                        $.each(value.required.upgrades, (_, v) => {
                            // check previous upgrade research
                            if (ups[v]) {
                                prereqsMet = prereqsMet && ups[v].purchased;
                            } else {
                                prereqsMet = false; // if the required upgrade doesn't exist, we definitely don't have it
                            }
                        });
                    }
                    // validate if upgrade is possible
                    prereqsMet = prereqsMet && l.isUpgradePossible(key) && l.isUpgradeSeeable(key);
                }
                if (prereqsMet) {
                    l.notEmptyList = true;

                    // add button
                    const effects = SharkGame.Lab.getResearchEffects(value);
                    const buttonSelector = SharkGame.Button.makeButton(
                        key,
                        value.name + "<br/>" + value.desc + "<br/>" + effects,
                        buttonList,
                        l.onLabButton
                    );
                    l.updateLabButton(key);
                    if (SharkGame.Settings.current.showAnimations) {
                        buttonSelector
                            .hide()
                            .css("opacity", 0)
                            .slideDown(50)
                            .animate(
                                { opacity: 1.0 },
                                {
                                    duration: 50,
                                    done: (anim) => (anim.elem.style = null),
                                }
                            );
                    }
                }
            } else {
                // button exists
                l.updateLabButton(key);
            }
        });
    },

    updateLabButton(upgradeName) {
        const button = $("#" + upgradeName);
        const ups = SharkGame.Upgrades.getUpgradeTable();
        const upgradeData = ups[upgradeName];
        const upgradeCost = upgradeData.cost;

        let enableButton;
        if ($.isEmptyObject(upgradeCost)) {
            enableButton = true; // always enable free buttons
        } else {
            enableButton = r.checkResources(upgradeCost);
        }

        const effects = SharkGame.Lab.getResearchEffects(upgradeData, !enableButton);
        let label = upgradeData.name + "<br/>" + upgradeData.desc + "<br/>" + effects;
        const costText = r.resourceListToString(upgradeCost, !enableButton);
        if (costText !== "") {
            label += "<br/>Cost: " + costText;
        }
        if (enableButton) {
            button.removeClass("disabled");
        } else {
            button.addClass("disabled");
        }

        const newButton = $(document.createElement("button"));
        newButton.html(label);

        const spritename = "technologies/" + upgradeName;
        if (SharkGame.Settings.current.iconPositions !== "off") {
            const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, spritename, null, "general/missing-technology");
            if (iconDiv) {
                iconDiv.addClass("button-icon-" + SharkGame.Settings.current.iconPositions);
                newButton.prepend(iconDiv);
            }
        }

        if (button.html() !== newButton.html()) {
            button.html(newButton.html());
        }
    },

    onLabButton() {
        const l = SharkGame.Lab;
        const u = SharkGame.Upgrades.getUpgradeTable();

        const upgradeId = $(this).attr("id");
        const upgrade = u[upgradeId];
        if (upgrade.purchased) {
            $(this).remove();
            return; // something went wrong don't even pay attention to this function
        }

        const upgradeCost = u[upgradeId].cost;

        if (r.checkResources(upgradeCost)) {
            // kill button
            $(this).remove();
            // take resources
            r.changeManyResources(upgradeCost, true);
            // purchase upgrade
            l.addUpgrade(upgradeId);

            if (upgrade.researchedMessage) {
                SharkGame.Log.addMessage(upgrade.researchedMessage);
            }
        }
    },

    addUpgrade(upgradeId) {
        const l = SharkGame.Lab;
        const u = SharkGame.Upgrades.getUpgradeTable();
        const upgrade = u[upgradeId];
        if (upgrade) {
            if (!upgrade.purchased) {
                upgrade.purchased = true;
                //l.updateResearchList();
                SharkGame.Gate.checkUpgradeRequirements(upgradeId);

                // if the upgrade has effects, do them
                if (upgrade.effect) {
                    $.each(upgrade.effect, (name, effects) => {
                        $.each(effects, (affectedResource, degree) => {
                            r.applyModifier(name, affectedResource, degree);
                        });
                    });
                }

                // Add upgrade to DOM
                const list = $("#upgradeList > ul");
                const upgradeElt = $("<li>").html(`${upgrade.name}<br/><span class='medDesc'>${upgrade.effectDesc}</span>`);
                const showAnims = SharkGame.Settings.current.showAnimations;
                if (showAnims) {
                    upgradeElt.hide().css("opacity", 0).prependTo(list).slideDown(50).animate({ opacity: 1.0 }, 100);
                } else {
                    upgradeElt.prependTo(list);
                }
            }
        }
    },

    allResearchDone() {
        const u = SharkGame.Upgrades.getUpgradeTable();
        const l = SharkGame.Lab;
        let allDone = true;
        $.each(u, (k, v) => {
            if (l.isUpgradePossible(k)) {
                allDone = allDone && v.purchased && l.isUpgradeSeeable(k);
            }
        });
        return allDone;
    },

    isUpgradePossible(upgradeName) {
        const l = SharkGame.Lab;
        const ups = SharkGame.Upgrades.getUpgradeTable();
        const upgradeData = ups[upgradeName];
        let isPossible = true;

        if (!upgradeData) {
            return false;
        }

        if (upgradeData.required) {
            // MODDED
            // if this upgrade is restricted to certain worlds,
            // check that the worldtype is acceptable for this upgrade to appear
            if (upgradeData.required.worlds) {
                isPossible = isPossible && upgradeData.required.worlds.includes(w.worldType);
            }
            if (upgradeData.required.notWorlds) {
                isPossible = isPossible && !upgradeData.required.notWorlds.includes(w.worldType);
            }
            if (upgradeData.required.resources) {
                // check if any related resources exist in the world for this to make sense
                // unlike the costs where all resources in the cost must exist, this is an either/or scenario
                let relatedResourcesExist = false;
                _.each(upgradeData.required.resources, (v) => {
                    relatedResourcesExist = relatedResourcesExist || w.doesResourceExist(v);
                });
                isPossible = isPossible && relatedResourcesExist;
            }
            if (upgradeData.required.upgrades) {
                // RECURSIVE CHECK REQUISITE TECHS
                _.each(upgradeData.required.upgrades, (v) => {
                    isPossible = isPossible && l.isUpgradePossible(v);
                });
            }

            // check existence of resource cost
            // this is the final check, everything that was permitted previously will be made false
            $.each(upgradeData.cost, (k, v) => {
                isPossible = isPossible && w.doesResourceExist(k);
            });
        }

        return isPossible;
    },

    isUpgradeSeeable(u) {
        const ups = SharkGame.Upgrades.getUpgradeTable();
        const upgradeData = ups[u];
        if (upgradeData.required) {
            if (upgradeData.required.seen) {
                let seenOne = false;
                _.each(upgradeData.required.seen, (v) => {
                    seenOne = seenOne || r.getTotalResource(v) > 0;
                });
                return seenOne;
            }
        }
        return true;
    },

    getResearchEffects(upgrade, _darken) {
        let effects = "<span class='medDesc' class='click-passthrough'>(Effects: ";
        let anyeffect = false;
        if (upgrade.effect) {
            $.each(upgrade.effect, (name, effectsList) => {
                $.each(effectsList, (resource, degree) => {
                    if (w.doesResourceExist(resource)) {
                        effects += SharkGame.ModifierReference.get(name).effectDescription(degree, resource) + ", ";
                        anyeffect = true;
                    }
                });
            });
        }
        if (anyeffect) {
            effects = effects.slice(0, -2); // remove trailing suffix
        } else {
            effects += "???";
        }
        effects += ")</span>";
        return effects;
    },

    updateUpgradeList() {
        const upgradeTable = SharkGame.Upgrades.getUpgradeTable();
        const upgradeList = $("#upgradeList");
        upgradeList.empty();
        upgradeList.append($("<h3>").html("Researched Upgrades"));
        const list = $("<ul>");

        // reverse object keys
        const keys = [];
        $.each(upgradeTable, (k, v) => {
            if (v.purchased) {
                keys.unshift(k);
            }
        });

        for (const key of keys) {
            const upgrade = upgradeTable[key];
            list.append($("<li>").html(`${upgrade.name}<br/><span class='medDesc'>${upgrade.effectDesc}</span>`));
        }
        upgradeList.append(list);
    },
};

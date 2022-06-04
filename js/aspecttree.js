"use strict";

const BUTTON_BORDER_RADIUS = 5;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

/*
 *            +y
 *            ^
 *            |
 *            |
 *            |
 * +x<--------+-------> -x
 *            |
 *            |
 *            |
 *            V
 *            -y
 */
const LEFT_EDGE = CANVAS_WIDTH + 400;
const TOP_EDGE = CANVAS_HEIGHT + 650;
const RIGHT_EDGE = -400;
const BOTTOM_EDGE = -150;

const SPRITE_SHEET = new Image();
const EVENT_SPRITE_SHEET = new Image();

SPRITE_SHEET.src = "img/sharksprites.png";
EVENT_SPRITE_SHEET.src = "img/sharkeventsprites.png";

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

SharkGame.AspectTree = {
    dragStart: { posX: 0, posY: 0 },
    cameraZoom: 1,
    cameraOffset: { posX: 0, posY: 0 },
    /** @type {CanvasRenderingContext2D} */
    context: undefined,
    staticButtons: {
        zoom: {
            posX: 10,
            posY: 10,
            width: 30,
            height: 30,

            name: "Zoom",
            description: "Change the zoom level.",
            getEffect() {
                if (tree.cameraZoom === 1) {
                    return "Zoom out.";
                } else {
                    return "Zoom in.";
                }
            },
            clicked() {
                if (tree.cameraZoom === 1) {
                    tree.cameraZoom = 0.5;
                } else {
                    tree.cameraZoom = 1;
                }
                tree.updateTooltip(this);
            },
            getOn() {
                return tree.cameraZoom !== 1;
            },
        },
        respec: {
            posX: 10,
            get posY() {
                return tree.staticButtons.zoom.posY + tree.staticButtons.zoom.height + 10;
            },
            width: 30,
            height: 30,

            name: "Respec",
            description: "Toggles respec mode.",
            getEffect() {
                if (tree.refundMode) {
                    return "Deactivate respec mode.";
                } else {
                    return "Activate respec mode to refund aspects (if possible) on click.";
                }
            },
            clicked() {
                tree.toggleRefundMode();
                tree.updateTooltip(this);
            },
            getUnlocked() {
                return SharkGame.Aspects.cleanSlate.level > 0;
            },
            getOn() {
                return tree.refundMode;
            },
        },
        respecAll: {
            posX: 10,
            get posY() {
                return tree.staticButtons.respec.posY + tree.staticButtons.respec.height + 10;
            },
            width: 30,
            height: 30,

            name: "Respec All",
            description: "Respecs all aspects.",
            getEffect() {
                return "Respec ALL refundable aspects.";
            },
            clicked() {
                if (confirm("Are you sure you want to respec ALL refundable aspects?")) {
                    tree.respecTree();
                }
            },
            getUnlocked() {
                return SharkGame.Aspects.cleanSlate.level > 0;
            },
            getOn() {
                return false;
            },
        },
        debug: {
            posX: 760,
            posY: 10,
            width: 30,
            height: 30,

            name: "Debug",
            description: "Toggles debug mode.",
            getEffect() {
                if (tree.debugMode) {
                    return "Deactivate debug mode.";
                } else {
                    return "Activate debug mode to freely change levels of aspects.";
                }
            },
            clicked() {
                tree.toggleDebugMode();
                tree.updateTooltip(this);
            },
            getUnlocked() {
                return SharkGame.persistentFlags.debug;
            },
            getOn() {
                return tree.debugMode;
            },
        },
    },
    requirementReference: {},

    init() {
        $.each(SharkGame.Aspects, (aspectId, aspectData) => {
            _.each(aspectData.prerequisites, (prerequisite) => {
                if (!_.has(aspectData, "requiredBy")) {
                    aspectData.requiredBy = [];
                }
                if (!_.has(SharkGame.Aspects, prerequisite)) return;
                if (!_.has(SharkGame.Aspects[prerequisite], "requiredBy")) {
                    SharkGame.Aspects[prerequisite].requiredBy = [];
                }
                SharkGame.Aspects[prerequisite].requiredBy.push(aspectId);
            });
            // wipe all levels
            aspectData.level = 0;

            // redundant removal of persistent flags
            if (SharkGame.persistentFlags.destinyRolls) {
                SharkGame.persistentFlags.destinyRolls = 0;
            }
            if (SharkGame.persistentFlags.patience) {
                SharkGame.persistentFlags.patience = 0;
            }
        });

        // turn off refund mode
        tree.refundMode = false;
        tree.debugMode = false;
    },

    setup() {
        if (SharkGame.missingAspects) {
            res.setResource("essence", res.getTotalResource("essence"));
            _.each(SharkGame.Aspects, (aspectData) => {
                // wipe all levels
                aspectData.level = 0;
            });
            SharkGame.PaneHandler.showAspectWarning();
        } else {
            // try to refund deprecated aspects
            _.each(SharkGame.Aspects, (aspectData) => {
                if (aspectData.deprecated) {
                    tree.refundLevels(aspectData);
                }
            });
        }

        tree.resetScoutingRestrictions();
        tree.applyScoutingRestrictionsIfNeeded();

        tree.applyAspects();

        if (SharkGame.persistentFlags.patience) {
            if (SharkGame.Aspects.patience.level) {
                res.changeResource("essence", 2 * (SharkGame.Aspects.patience.level + 1) ** 2);
            }
            SharkGame.persistentFlags.patience = undefined;
        }

        res.setResource("aspectAffect", 1);
        res.setTotalResource("aspectAffect", 1);

        tree.generateRequirementReference();
    },

    resetTreeCamera() {
        // remember to figure out this nonsense
        this.dragStart = { posX: 0, posY: 0 };
        this.cameraZoom = 1;
        this.cameraOffset = { posX: 0, posY: 0 };
    },

    drawTree(disableCanvas = true) {
        if (disableCanvas) {
            return tree.drawTable();
        } else {
            return tree.drawCanvas();
        }
    },

    drawTable(table = $("<table>")) {
        table.html("").attr("id", "aspectTable");

        const headerRow = $("<thead>").append($("<th>").html(`Name`).attr("scope", "col"));
        headerRow.append($("<th>").html(`Description`).attr("scope", "col"));
        headerRow.append($("<th>").html(`Level`).attr("scope", "col"));
        headerRow.append($("<th>").html(`Cost`).attr("scope", "col"));

        table.append(headerRow);

        function clickCallback(event) {
            const aspectId = event.currentTarget.getAttribute("data-aspectId");
            const aspect = SharkGame.Aspects[aspectId];
            // console.debug(aspect);

            aspect.clicked(event);

            tree.updateEssenceCounter();

            requestAnimationFrame(() => {
                tree.drawTable(table);
            });
        }

        const tableBody = $("<tbody>");

        $.each(SharkGame.Aspects, (aspectId, aspectData) => {
            if (aspectData.deprecated) return;
            const reqref = tree.requirementReference[aspectId];
            if (!reqref.revealed) return;

            let basicText = "";
            let cantBuyText = "";
            if (!reqref.prereqsMet && aspectData.level === 0) {
                cantBuyText = "With your infinite vision, you can see this aspect, but cannot buy it.";
            } else if (reqref.locked) {
                cantBuyText = "This aspect is locked. " + reqref.locked;
            } else if (reqref.isolated) {
                cantBuyText = "This aspect's prerequisites aren't met, even though you have levels in it.";
            }
            basicText =
                " A" +
                (aspectData.level ? " level " + aspectData.level : "") +
                (aspectData.core ? " core aspect" : aspectData.level ? " aspect" : "n aspect") +
                (aspectData.core && aspectData.noRefunds ? "," : "") +
                (aspectData.noRefunds ? " with no refunds" : "") +
                ". ";

            const aspectNameTableData = $("<th>").html(aspectData.name).addClass("aspectTableName").attr("rowspan", "3").attr("scope", "rowgroup");
            const specialData = $("<td>").append(basicText + cantBuyText);
            const aspectTableDescriptionRow = $("<tr>").append(aspectNameTableData).append(specialData);
            aspectTableDescriptionRow.append($(`<td>`));
            aspectTableDescriptionRow.append(
                $(`<td>`)
                    .html(!reqref.max ? aspectData.getCost(aspectData.level) : "n/A")
                    .attr("rowspan", "3")
            );

            const aspectTableRowCurrent = $("<tr>");

            if (aspectData.level > 0) {
                aspectTableRowCurrent.append($(`<td>`).html(`CURRENT: ${aspectData.getEffect(aspectData.level)}`));
            } else {
                aspectTableRowCurrent.append($(`<td>`).html(`CURRENT: Not bought, no effect.`));
            }
            aspectTableRowCurrent.append($(`<td>`).html(aspectData.level));

            //aspectTableRowCurrent.classList.add("aspect-table-row");
            //aspectTableRowCurrent.id = "aspect-table-row-" + aspectId;

            const aspectTableRowNext = $("<tr>");
            if (!reqref.max) {
                //${aspectData.level + 1}`
                aspectTableRowNext.append($(`<td>`).html(`NEXT: ${aspectData.getEffect(aspectData.level + 1)}`));
                aspectTableRowNext.append($(`<td>`).html(`${aspectData.level + 1}`));
            } else {
                aspectTableRowNext.append($(`<td>`).html(`NEXT: Already at maximum level.`));
                aspectTableRowNext.append($(`<td>`).html(`n/A`));
            }

            _.each([aspectTableDescriptionRow, aspectTableRowNext, aspectTableRowCurrent], (row) => {
                row.attr("data-aspectId", aspectId)
                    .on("click", clickCallback)
                    .attr("aria-role", "button")
                    .attr("disabled", reqref.prereqsMet.toString());
            });

            tableBody.append(aspectTableDescriptionRow);
            tableBody.append(aspectTableRowCurrent);
            tableBody.append(aspectTableRowNext);
        });
        table.append(tableBody);
        return table;
    },

    drawCanvas() {
        const canvas = document.createElement("canvas");
        canvas.id = "treeCanvas";
        canvas.setAttribute("width", "800px");
        canvas.setAttribute("height", "600px");

        $(canvas).on("mouseenter mousemove mouseleave", tree.updateMouse);

        $(canvas).on("mousedown", tree.startPan);

        $(canvas).on("click", tree.click);
        $(canvas).on("click", tree.updateMouse);

        tree.context = canvas.getContext("2d", { alpha: false, desynchronized: true });

        // tree doesn't work with touch screens so convert touch events to mouse events
        // https://stackoverflow.com/questions/1517924/javascript-mapping-touch-events-to-mouse-events
        function touchHandler(event) {
            const touches = event.changedTouches;
            const first = touches[0];
            let type = "";
            switch (event.type) {
                case "touchstart":
                    type = "mousedown";
                    break;
                case "touchmove":
                    type = "mousemove";
                    break;
                case "touchend":
                    type = "mouseup";
                    break;
                default:
                    return;
            }

            // initMouseEvent(type, canBubble, cancelable, view, clickCount,
            //                screenX, screenY, clientX, clientY, ctrlKey,
            //                altKey, shiftKey, metaKey, button, relatedTarget);

            const simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(
                type,
                true,
                true,
                window,
                1,
                first.screenX,
                first.screenY,
                first.clientX,
                first.clientY,
                false,
                false,
                false,
                false,
                0 /*left*/,
                null
            );

            first.target.dispatchEvent(simulatedEvent);
            event.preventDefault();
        }

        canvas.addEventListener("touchstart", touchHandler, true);
        canvas.addEventListener("touchmove", touchHandler, true);
        canvas.addEventListener("touchend", touchHandler, true);
        canvas.addEventListener("touchcancel", touchHandler, true);

        return canvas;
    },

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {MouseEvent} event
     */
    getCursorPositionInCanvas(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        const posX = event.clientX - rect.left;
        const posY = event.clientY - rect.top;
        const result = { posX, posY };
        return result;
    },

    /** @param {MouseEvent} event */
    getButtonUnderMouse(event) {
        const context = tree.context;
        const mousePos = tree.getCursorPositionInCanvas(context.canvas, event);
        const offset = tree.cameraOffset;
        const zoom = tree.cameraZoom;

        // this fixes one piece of the sticky tooltip bug on the tree
        if (gateway.transitioning) {
            return;
        }

        const staticButton = _.find(tree.staticButtons, ({ posX, posY, width, height }) => {
            return mousePos.posX - posX >= 0 && mousePos.posY - posY >= 0 && mousePos.posX - posX <= width && mousePos.posY - posY <= height;
        });
        if (staticButton !== undefined && (!staticButton.getUnlocked || staticButton.getUnlocked())) {
            return staticButton;
        }

        const aspect = _.find(SharkGame.Aspects, ({ posX, posY, width, height, prerequisites, level }) => {
            if (
                _.some(prerequisites, (prerequisite) => SharkGame.Aspects[prerequisite].level === 0) &&
                !SharkGame.Aspects.infinityVision.level &&
                !level
            ) {
                return;
            }
            return (
                CANVAS_WIDTH / 2 - (CANVAS_WIDTH / 2 - mousePos.posX) / zoom - offset.posX >= posX &&
                CANVAS_HEIGHT / 2 - (CANVAS_HEIGHT / 2 - mousePos.posY) / zoom - offset.posY >= posY &&
                CANVAS_WIDTH / 2 - (CANVAS_WIDTH / 2 - mousePos.posX) / zoom - offset.posX <= posX + width &&
                CANVAS_HEIGHT / 2 - (CANVAS_HEIGHT / 2 - mousePos.posY) / zoom - offset.posY <= posY + height
            );
        });
        return aspect;
    },

    previousButton: undefined,
    /** @param {MouseEvent} event */
    updateMouse(event) {
        const button = tree.getButtonUnderMouse(event);
        if (button !== tree.previousButton) {
            tree.previousButton = button;
            tree.updateTooltip(button);
        }
    },

    /** @param {MouseEvent} event */
    click(event) {
        const button = tree.getButtonUnderMouse(event);
        if (button === undefined) {
            return;
        }
        if (typeof button.clicked === "function") {
            button.clicked(event);
        }
        requestAnimationFrame(tree.render);
    },

    /** @param {MouseEvent} event */
    startPan(event) {
        if (tree.getButtonUnderMouse(event) !== undefined) {
            return;
        }
        tree.dragStart.posX = event.clientX / tree.cameraZoom - tree.cameraOffset.posX;
        tree.dragStart.posY = event.clientY / tree.cameraZoom - tree.cameraOffset.posY;
        $(tree.context.canvas).on("mousemove", tree.pan);
        $(tree.context.canvas).on("mouseup mouseleave", tree.endPan);
    },

    /** @param {MouseEvent} event */
    pan(event) {
        const offsetX = clamp(event.clientX / tree.cameraZoom - tree.dragStart.posX, RIGHT_EDGE, LEFT_EDGE - CANVAS_WIDTH);
        const offsetY = clamp(event.clientY / tree.cameraZoom - tree.dragStart.posY, BOTTOM_EDGE, TOP_EDGE - CANVAS_HEIGHT);
        tree.cameraOffset.posX = offsetX;
        tree.cameraOffset.posY = offsetY;
        requestAnimationFrame(tree.render);
    },

    endPan() {
        $(tree.context.canvas).off("mousemove", tree.pan);
        $(tree.context.canvas).off("mouseup mouseleave", tree.endPan);
    },

    render() {
        const context = tree.context;
        if (context === undefined) return;

        // For some reason, it scrolls indefinitely if you don't set this every frame
        // I have no idea how or why
        context.canvas.width = CANVAS_WIDTH;
        context.canvas.height = CANVAS_HEIGHT;

        // setting font for later
        context.font = "12px Verdana";

        // Only one call to getComputedStyle for two properties, otherwise we'd use sharkcolor.getElementColor
        // Also, beware that these values change if the button is pressed, but that should never happen in the same frame
        // as the aspect tree gets redrawn
        const buttonStyle = getComputedStyle(document.getElementById("backToGateway"));
        const buttonColor = buttonStyle.backgroundColor;
        const borderColor = buttonStyle.borderTopColor;

        context.save();
        // FIXME: Hard-coded color
        context.fillStyle = "#155c4b";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.restore();

        context.translate(context.canvas.width / 2, context.canvas.height / 2);
        context.scale(tree.cameraZoom, tree.cameraZoom);
        context.translate(-context.canvas.width / 2 + tree.cameraOffset.posX, -context.canvas.height / 2 + tree.cameraOffset.posY);

        if (gateway.completedWorlds.length >= 3) {
            context.save();
            context.lineWidth = 5;
            context.strokeStyle = buttonColor;
            context.setLineDash([15, 15]);
            context.beginPath();
            context.moveTo(420, -1000);
            context.lineTo(420, 2000);
            context.stroke();
            context.restore();

            context.save();
            context.fillStyle = getComputedStyle(document.getElementById("backToGateway")).color;
            context.fillText("on scouting missions", 440, 60);
            context.fillText("you can only bring core aspects", 440, 75);
            context.fillText("non-core aspects ->", 440, 110);
            context.fillText("<- core aspects", 300, 110);
            context.fillText("on scouting missions", 440, 710);
            context.fillText("you can only bring core aspects", 440, 725);
            context.fillText("non-core aspects ->", 440, 680);
            context.fillText("<- core aspects", 300, 680);
            context.restore();
        }

        // Lines between aspects
        context.save();
        context.lineWidth = 5;
        _.each(SharkGame.Aspects, ({ level, posX, posY, width, height, requiredBy, deprecated }) => {
            if (deprecated) return;

            if (level) {
                // requiredBy: array of aspectId that depend on this aspect
                _.each(requiredBy, (requiringId) => {
                    const requiring = SharkGame.Aspects[requiringId];
                    if (requiring.deprecated) return;

                    context.save();

                    const startX = posX + width / 2;
                    const startY = posY + height / 2;

                    const endX = requiring.posX + requiring.width / 2;
                    const endY = requiring.posY + requiring.height / 2;

                    const gradient = context.createLinearGradient(startX, startY, endX, endY);
                    gradient.addColorStop(0, buttonColor);
                    gradient.addColorStop(1, borderColor);
                    context.strokeStyle = gradient;

                    if (requiring.level === 0) {
                        if (requiring.getUnlocked()) {
                            context.filter = "brightness(40%)";
                        } else {
                            context.filter = "brightness(65%)";
                        }
                    }

                    context.beginPath();
                    context.moveTo(startX, startY);
                    context.lineTo(endX, endY);

                    context.stroke();
                    context.restore();
                });
            }
        });
        context.restore();

        // Aspects
        context.save();
        context.lineWidth = 1;
        context.fillStyle = buttonColor;
        context.strokeStyle = borderColor;
        _.each(SharkGame.Aspects, ({ posX, posY, width, height, icon, eventSprite, level, deprecated }, name) => {
            if (deprecated) return;

            context.save();
            const reqref = tree.requirementReference[name];
            if (!reqref.revealed) {
                // if any prerequisite is unmet and we dont have infinity vision, and it's level 0, don't render
                return;
            } else if (level === 0) {
                if (reqref.locked) {
                    // if not unlocked, render even darker and more saturated
                    context.filter = "brightness(25%) saturate(160%)";
                } else if (reqref.prereqsMet) {
                    // if not bought but can be bought, render a little darker and more saturated
                    context.filter = "brightness(70%) saturate(150%)";
                } else {
                    // if we reach this statement then it is revealed by infinity vision
                    // render darker and more saturated
                    context.filter = "brightness(40%) saturate(150%)";
                }
            }

            tree.renderButton(context, posX, posY, width, height, icon, eventSprite, name);

            context.restore();
        });
        context.restore();

        // Static buttons
        context.save();
        // revert zooming
        context.translate(context.canvas.width / 2 - tree.cameraOffset.posX, context.canvas.height / 2 - tree.cameraOffset.posY);
        context.scale(1 / tree.cameraZoom, 1 / tree.cameraZoom);
        context.translate(-context.canvas.width / 2, -context.canvas.height / 2);

        context.lineWidth = 1;
        context.fillStyle = buttonColor;
        context.strokeStyle = borderColor;
        _.each(tree.staticButtons, ({ posX, posY, width, height, icon, eventSprite }, name) => {
            const button = tree.staticButtons[name];
            if (!button.getUnlocked || button.getUnlocked()) {
                if (button.getOn && button.getOn()) {
                    context.fillStyle = borderColor;
                }
                tree.renderButton(context, posX, posY, width, height, icon || "aspects/static/" + name, eventSprite, name);
                context.fillStyle = buttonColor;
            }
        });
        context.restore();

        // update essence count
        tree.updateEssenceCounter();
    },

    /**
     * Draws a rounded rectangle using the current state of the canvas
     * @param {CanvasRenderingContext2D} context
     * @param {number} posX The top left x coordinate
     * @param {number} posY The top left y coordinate
     * @param {number} width The width of the rectangle
     * @param {number} height The height of the rectangle
     * @param {string} icon The icon to draw in the rectangle
     * @param {string} name The name of the button
     */
    renderButton(context, posX, posY, width, height, icon = "general/missing-action", eventIcon = false, name) {
        context.beginPath();
        context.moveTo(posX + BUTTON_BORDER_RADIUS, posY);
        context.lineTo(posX + width - BUTTON_BORDER_RADIUS, posY);
        context.quadraticCurveTo(posX + width, posY, posX + width, posY + BUTTON_BORDER_RADIUS);
        context.lineTo(posX + width, posY + height - BUTTON_BORDER_RADIUS);
        context.quadraticCurveTo(posX + width, posY + height, posX + width - BUTTON_BORDER_RADIUS, posY + height);
        context.lineTo(posX + BUTTON_BORDER_RADIUS, posY + height);
        context.quadraticCurveTo(posX, posY + height, posX, posY + height - BUTTON_BORDER_RADIUS);
        context.lineTo(posX, posY + BUTTON_BORDER_RADIUS);
        context.quadraticCurveTo(posX, posY, posX + BUTTON_BORDER_RADIUS, posY);
        context.closePath();
        context.fill();
        context.stroke();
        if (icon !== null) {
            if (icon === "general/missing-action" && SharkGame.Sprites["aspects/" + name]) {
                icon = "aspects/" + name;
            }
            let sprite = SharkGame.Sprites[icon];
            if (sprite === undefined) {
                sprite = SharkGame.Sprites["general/missing-action"];
            }
            context.drawImage(
                eventIcon ? EVENT_SPRITE_SHEET : SPRITE_SHEET,
                sprite.frame.x,
                sprite.frame.y,
                sprite.frame.w,
                sprite.frame.h,
                posX,
                posY,
                width,
                height
            );
        }
        const textToDisplay = tree.getLittleLevelText(name);
        if (textToDisplay) {
            context.fillStyle = getComputedStyle(document.getElementById("backToGateway")).color;
            context.fillText(textToDisplay, posX + width + 5, posY + height / 2);
            // revert back to the previous fillStyle right afterward
            context.fillStyle = getComputedStyle(document.getElementById("backToGateway")).backgroundColor;
        }
    },

    getLittleLevelText(aspectName) {
        const reqref = tree.requirementReference[aspectName];
        if (!reqref) return;

        if (!reqref.locked && reqref.prereqsMet) {
            if (!reqref.max) {
                return SharkGame.Aspects[aspectName].level + " / " + SharkGame.Aspects[aspectName].max;
            }
            return "MAX";
        }
    },

    handleClickedAspect(aspect) {
        if (tree.refundMode) {
            if (!aspect.noRefunds) tree.refundLevels(aspect);
            tree.updateRequirementReference();
            tree.render();
        } else if (tree.debugMode) {
            tree.setLevel(aspect, prompt("Set to what level?"));
        } else {
            tree.increaseLevel(aspect);
        }
        tree.updateTooltip(aspect);
    },

    increaseLevel(aspect, ignoreRestrictions) {
        let cost = 0;
        if (!ignoreRestrictions) {
            if (
                aspect.level >= aspect.max ||
                aspect.getUnlocked() ||
                _.some(aspect.prerequisites, (prereq) => SharkGame.Aspects[prereq].level === 0)
            ) {
                return;
            }

            cost = aspect.getCost(aspect.level);
            if (cost > res.getResource("essence")) {
                return;
            }
        }

        res.changeResource("essence", -cost);
        aspect.level++;
        if (typeof aspect.apply === "function") {
            aspect.apply("levelUp");
        }
        tree.updateRequirementReference();
    },

    updateEssenceCounter() {
        if (document.getElementById("essenceCount")) {
            document.getElementById("essenceCount").innerHTML = sharktext.beautify(res.getResource("essence"), false, 2);
        }
    },

    applyAspects() {
        _.each(SharkGame.Aspects, (aspectData) => {
            if (aspectData.level && typeof aspectData.apply === "function") {
                aspectData.apply("init");
            }
        });
    },

    respecTree(totalWipe) {
        if (!totalWipe) {
            _.each(SharkGame.Aspects, (aspect) => {
                if (!aspect.noRefunds) {
                    this.refundLevels(aspect);
                }
            });
        } else {
            _.each(SharkGame.Aspects, (aspect) => {
                this.refundLevels(aspect);
            });
        }
        tree.updateRequirementReference();
        if (SharkGame.Settings.current.doAspectTable === "table") {
            this.drawTable(document.getElementById("aspectTable"));
            this.updateEssenceCounter();
        } else {
            requestAnimationFrame(tree.render);
        }
    },

    refundLevels(aspectData) {
        let cost = 0;
        while (aspectData.level) {
            cost = aspectData.getCost(aspectData.level - 1);
            if (_.isUndefined(cost)) cost = 0;
            res.changeResource("essence", cost);
            aspectData.level -= 1;
        }
    },

    applyScoutingRestrictionsIfNeeded() {
        if (gateway.currentlyOnScoutingMission()) {
            if (!SharkGame.persistentFlags.aspectStorage) {
                SharkGame.persistentFlags.aspectStorage = {};
            }
            $.each(SharkGame.Aspects, (aspectName, aspectData) => {
                if (aspectData.core) {
                    return true;
                }
                SharkGame.persistentFlags.aspectStorage[aspectName] = aspectData.level;
                SharkGame.Aspects[aspectName].level = 0;
            });
        }
    },

    resetScoutingRestrictions() {
        if (!SharkGame.persistentFlags.aspectStorage) {
            SharkGame.persistentFlags.aspectStorage = {};
        }
        $.each(SharkGame.Aspects, (aspectName) => {
            if (!_.isUndefined(SharkGame.persistentFlags.aspectStorage[aspectName])) {
                SharkGame.Aspects[aspectName].level = SharkGame.persistentFlags.aspectStorage[aspectName];
                SharkGame.persistentFlags.aspectStorage[aspectName] = undefined;
            }
        });
    },

    updateTooltip(button) {
        // console.log("test");
        const tooltipBox = $("#tooltipbox");
        const context = tree.context;
        if (button === undefined) {
            context.canvas.style.cursor = "grab";
            tooltipBox.empty().removeClass("forAspectTree forAspectTreeUnpurchased forAspectTreeAffordable");
        } else {
            let name;
            _.forEach(tree.staticButtons, (buttonData, buttonName) => {
                if (buttonData.name === button.name) {
                    name = buttonName;
                    return false;
                }
            });

            if (!name) {
                _.forEach(SharkGame.Aspects, (aspectData, aspectName) => {
                    if (aspectData.name === button.name) {
                        name = aspectName;
                        return false;
                    }
                });
            } else {
                // we have a static button
                if (!button.getUnlocked || button.getUnlocked()) {
                    tooltipBox.html(button.getEffect()).removeClass("forAspectTree forAspectTreeAffordable").addClass("forAspectTreeUnpurchased");
                    context.canvas.style.cursor = "pointer";
                }
                return;
            }

            if (!name) {
                tooltipBox.empty().removeClass("forAspectTree forAspectTreeUnpurchased forAspectTreeAffordable");
                return;
            }

            const reqref = tree.requirementReference[name];

            if (!reqref) {
                tooltipBox.empty().removeClass("forAspectTree forAspectTreeUnpurchased forAspectTreeAffordable");
                return;
            }

            const cost = button.getCost(button.level);

            if (!reqref.prereqsMet) {
                if (button.level) {
                    context.canvas.style.cursor = "not-allowed";
                } else {
                    context.canvas.style.cursor = "grab";
                }
            } else {
                context.canvas.style.cursor = "pointer";
            }

            tooltipBox.addClass("forAspectTree").removeClass("forAspectTreeUnpurchased").removeClass("forAspectTreeAffordable");
            if (reqref.locked) {
                tooltipBox.addClass("forAspectTreeUnpurchased").html(sharktext.boldString(button.getUnlocked()));
                return;
            }

            const refundValue = tree.getTheoreticalRefundValue(button);
            if (tree.refundMode) {
                if (refundValue && !button.noRefunds) {
                    tooltipBox.addClass("forAspectTreeAffordable");
                }
            } else if (reqref.affordable && !reqref.max && reqref.prereqsMet) {
                tooltipBox.addClass("forAspectTreeAffordable");
            }

            let tooltipText = "";
            if (button.level === 0) {
                let costText = ``;
                if (tree.refundMode) {
                    if (button.noRefunds) {
                        costText = `NO REFUNDS`;
                    }
                } else {
                    costText = `COST: <span class='${reqref.affordable ? "can-afford-aspect" : "cant-afford-aspect"}'>${cost}</span>`;
                }

                const levelText =
                    (button.core ? " core aspect" : "") + (button.core && button.noRefunds ? ", " : "") + (button.noRefunds ? "no refunds" : "");

                tooltipText =
                    sharktext.boldString(button.name) +
                    `<br /><span class='littleTooltipText'>${levelText}</span>` +
                    `<br/>${button.getEffect(1)}<br/>` +
                    `<span class='littleTooltipText'>${button.description}</span><br/>` +
                    (tree.debugMode ? "" : "<hr class='hrForTooltipJuxtapositionInGateway'>" + `<span class='bold'>${costText}</span>`);
                tooltipBox.addClass("forAspectTreeUnpurchased");
            } else if (button.level < button.max) {
                let costText = ``;
                if (tree.refundMode) {
                    if (button.noRefunds) {
                        costText = `NO REFUNDS`;
                    } else {
                        costText = `REFUND VALUE: <span class="can-afford-aspect">${refundValue}</span>`;
                    }
                } else {
                    costText = `COST: <span class='${reqref.affordable ? "can-afford-aspect" : "cant-afford-aspect"}'>${cost}</span>`;
                }

                const levelText =
                    "<strong>level " +
                    button.level +
                    "</strong> " +
                    (button.core ? " core aspect" : " aspect") +
                    (button.noRefunds ? ", no refunds" : "");

                tooltipText =
                    sharktext.boldString(button.name) +
                    `<br /><span class='littleTooltipText'>${levelText}</span><br />` +
                    button.getEffect(button.level) +
                    `<br /><span class='littleTooltipText'>${button.description}</span>` +
                    "<hr class='hrForTooltipSeparationInGateway'>" +
                    "<span class='littleTooltipText' class='bold'>NEXT LEVEL:</span><br />" +
                    button.getEffect(button.level + 1) +
                    (tree.debugMode ? "" : "<hr class='hrForTooltipJuxtapositionInGateway'>" + `<span class='bold'>${costText}</span>`);
            } else if (button.level === undefined) {
                const levelText =
                    (button.core ? " core aspect" : "") + (button.core && button.noRefunds ? ", " : "") + (button.noRefunds ? "no refunds" : "");
                tooltipText =
                    sharktext.boldString(button.name) +
                    `<br /><span class='littleTooltipText'>${levelText}</span>` +
                    `<br />${button.getEffect(button.level)}` +
                    `<br /><span class='littleTooltipText'>${button.description}</span>`;
            } else {
                let costText = ``;
                if (tree.refundMode) {
                    if (button.noRefunds) {
                        costText = `NO REFUNDS`;
                    } else {
                        costText = `REFUND VALUE: <span class="can-afford-aspect">${refundValue}</span>`;
                    }
                } else {
                    costText = `MAXIMUM LEVEL.`;
                }

                const levelText =
                    "<strong>level " +
                    button.level +
                    "</strong> " +
                    (button.core ? " core aspect" : " aspect") +
                    (button.noRefunds ? ", no refunds" : "");
                tooltipText =
                    sharktext.boldString(button.name) +
                    `<br /><span class='littleTooltipText'>${levelText}</span>` +
                    `<br />${button.getEffect(button.level)}` +
                    `<br /><span class='littleTooltipText'>${button.description}</span>` +
                    (tree.debugMode ? "" : "<hr class='hrForTooltipJuxtapositionInGateway'>" + `<strong>${costText}</strong></span>`);
            }
            tooltipBox.html(tooltipText);
        }
    },

    generateRequirementReference() {
        tree.requirementReference = {};
        _.forEach(SharkGame.Aspects, (aspectData, aspectName) => {
            if (aspectData.deprecated) return;
            tree.requirementReference[aspectName] = {};
        });
        tree.updateRequirementReference();
    },

    updateRequirementReference() {
        const reqref = tree.requirementReference;

        _.forEach(SharkGame.Aspects, (aspectData, aspectName) => {
            if (aspectData.deprecated) return;
            reqref[aspectName].affordable = aspectData.getCost(aspectData.level) <= res.getResource("essence");
            reqref[aspectName].locked = aspectData.getUnlocked() || false;
            reqref[aspectName].prereqsMet = !_.some(aspectData.prerequisites, (prereq) => SharkGame.Aspects[prereq].level === 0);
            reqref[aspectName].isolated = aspectData.level && !reqref[aspectName].prereqsMet;
            reqref[aspectName].revealed = reqref[aspectName].prereqsMet || SharkGame.Aspects.infinityVision.level || aspectData.level;
            reqref[aspectName].max = aspectData.level >= aspectData.max;
        });
    },

    toggleRefundMode() {
        if (tree.refundMode) {
            tree.refundMode = false;
            $("#respecModeButton").removeClass("respecMode");
        } else {
            tree.refundMode = true;
            $("#respecModeButton").addClass("respecMode");
            if (tree.debugMode) tree.toggleDebugMode();
        }
    },

    toggleDebugMode() {
        if (tree.debugMode) {
            tree.debugMode = false;
            $("#debugModeButton").removeClass("respecMode");
        } else {
            tree.debugMode = true;
            $("#debugModeButton").addClass("respecMode");
            if (tree.refundMode) tree.toggleRefundMode();
        }
    },

    getTheoreticalRefundValue(aspect) {
        if (!aspect.level || aspect.noRefunds) return 0;

        let value = 0;
        let level = aspect.level - 1;
        while (level >= 0) {
            value += aspect.getCost(level);
            level -= 1;
        }
        return value;
    },

    // will loop increase and decrease levels
    setLevel(aspect, targetLevel) {
        if (isNaN(targetLevel)) return;
        targetLevel = Math.ceil(targetLevel);
        if (targetLevel < 0) return;

        if (targetLevel - aspect.level < 0) {
            aspect.level = 0;
        }

        while (targetLevel - aspect.level > 0) {
            tree.increaseLevel(aspect, true);
        }
    },
};

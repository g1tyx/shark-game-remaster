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
            width: 15,
            height: 15,

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
            },
        },
    },

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
        });
    },
    setUp() {
        this.dragStart = { posX: 0, posY: 0 };
        this.cameraZoom = 1;
        this.cameraOffset = { posX: 0, posY: 0 };
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

        const staticButton = _.find(tree.staticButtons, ({ posX, posY, width, height }) => {
            return mousePos.posX - posX >= 0 && mousePos.posY - posY >= 0 && mousePos.posX - posX <= width && mousePos.posY - posY <= height;
        });
        if (staticButton !== undefined) {
            return staticButton;
        }

        const aspect = _.find(SharkGame.Aspects, ({ posX, posY, width, height, prerequisites }) => {
            if (_.some(prerequisites, (prerequisite) => SharkGame.Aspects[prerequisite].level === 0)) {
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
    /** @param {MouseEvent} event */
    updateMouse(event) {
        const context = tree.context;

        const button = tree.getButtonUnderMouse(event);
        const tooltipBox = $("#tooltipbox");
        if (button === undefined) {
            context.canvas.style.cursor = "grab";
            tooltipBox.empty().removeClass("forAspectTree forAspectTreeUnpurchased");
        } else {
            context.canvas.style.cursor = "pointer";
            tooltipBox.addClass("forAspectTree").removeClass("forAspectTreeUnpurchased");

            // FIXME: Hard-coded color "#ace3d1"
            if (button.getUnlocked && button.getUnlocked()) {
                tooltipBox.addClass("forAspectTreeUnpurchased").html(SharkGame.boldString(button.getUnlocked()));
            } else if (button.level === 0) {
                const tooltipText =
                    SharkGame.boldString(button.name) +
                    `<br/>${button.getEffect(button.level + 1)}<br/>` +
                    `<span class='littleTooltipText'>${button.description}</span><br/>` +
                    `<span class='bold'>COST: <span style='text-shadow: 0 0 .6em #ace3d1'>` +
                    `${button.getCost(button.level)}</span></span>`;
                tooltipBox.addClass("forAspectTreeUnpurchased").html(tooltipText);
            } else if (button.level < button.max) {
                const tooltipText =
                    SharkGame.boldString(button.name) +
                    `<br /><span class='littleTooltipText' class='bold'> level ${button.level}</span><br />` +
                    button.getEffect(button.level) +
                    `<br /><span class='littleTooltipText'>${button.description}</span>` +
                    "<br /><span class='littleTooltipText' class='bold'>NEXT LEVEL:</span><br />" +
                    button.getEffect(button.level + 1) +
                    "<br /><span class='bold'>COST: <span style='text-shadow: 0 0 .6em #ace3d1'>" +
                    button.getCost(button.level) +
                    "</span>";
                tooltipBox.html(tooltipText);
            } else if (button.level === undefined) {
                const tooltipText =
                    SharkGame.boldString(button.name) +
                    `<br />${button.getEffect(button.level)}` +
                    `<br /><span class='littleTooltipText'>${button.description}</span>`;
                tooltipBox.html(tooltipText);
            } else {
                const tooltipText =
                    SharkGame.boldString(button.name) +
                    `<br /><span class='littleTooltipText bold'> level ${button.level}</span>` +
                    `<br />${button.getEffect(button.level)}` +
                    `<br /><span class='littleTooltipText'>${button.description}</span>` +
                    "<br /><b>MAXIMUM LEVEL.</b></span>";
                tooltipBox.html(tooltipText);
            }
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

        // Only one call to getComputedStyle for two properties, otherwise we'd use SharkGame.getElementColor
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

        // Lines between aspects
        context.save();
        context.lineWidth = 5;
        _.each(SharkGame.Aspects, ({ posX, posY, requiredBy, width, height, level }) => {
            if (level > 0) {
                // requiredBy: array of aspectId that depend on this aspect
                _.each(requiredBy, (requiringId) => {
                    context.save();
                    const requiring = SharkGame.Aspects[requiringId];

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
        _.each(SharkGame.Aspects, ({ posX, posY, width, height, icon, eventSprite, prerequisites, level, getUnlocked }, name) => {
            context.save();
            if (_.some(prerequisites, (prereq) => SharkGame.Aspects[prereq].level === 0)) {
                // if any prerequisite is unmet, don't render
                return;
            } else if (level === 0) {
                if (getUnlocked()) {
                    // if not unlocked, render even darker and more saturated
                    context.filter = "brightness(40%) saturate(150%)";
                } else {
                    // if not bought, render darker and more saturated
                    context.filter = "brightness(65%) saturate(150%)";
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
            tree.renderButton(context, posX, posY, width, height, icon, eventSprite, name);
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
            const sprite = SharkGame.Sprites[icon];
            if (sprite === undefined) {
                SharkGame.Log.addError(new Error(`Unknown sprite '${icon}' in prestige tree.`));
                return;
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
    },
    increaseLevel(aspect) {
        if (aspect.level >= aspect.max || aspect.getUnlocked()) {
            return;
        }

        const cost = aspect.getCost(aspect.level);
        if (cost > res.getResource("essence")) {
            return;
        }
        res.changeResource("essence", -cost);
        aspect.level++;
        if (typeof aspect.apply === "function") {
            aspect.apply("levelUp");
        }
    },
    updateEssenceCounter() {
        if (document.getElementById("essenceCount")) {
            document.getElementById("essenceCount").innerHTML = main.beautify(res.getResource("essence")) + " ESSENCE";
        }
    },
    applyAspects() {
        _.each(SharkGame.Aspects, (aspectData) => {
            if (aspectData.level && typeof aspectData.apply === "function") {
                aspectData.apply("init");
            }
        });
    },
};

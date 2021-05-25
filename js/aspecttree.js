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
const LEFT_EDGE = CANVAS_WIDTH + 50;
const TOP_EDGE = CANVAS_HEIGHT + 50;
const RIGHT_EDGE = -50;
const BOTTOM_EDGE = -50 - CANVAS_HEIGHT;

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

            description: "Zoom",
            getEffect() {
                if (SharkGame.AspectTree.cameraZoom === 1) {
                    return "Zoom out.";
                } else {
                    return "Zoom in.";
                }
            },
            clicked() {
                if (SharkGame.AspectTree.cameraZoom === 1) {
                    SharkGame.AspectTree.cameraZoom = 0.5;
                } else {
                    SharkGame.AspectTree.cameraZoom = 1;
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
        SharkGame.AspectTree.dragStart = { posX: 0, posY: 0 };
        SharkGame.AspectTree.cameraZoom = 1;
        SharkGame.AspectTree.cameraOffset = { posX: 0, posY: 0 };
    },

    drawCanvas() {
        const canvas = document.createElement("canvas");
        canvas.id = "treeCanvas";
        canvas.setAttribute("width", "800px");
        canvas.setAttribute("height", "600px");

        $(canvas).on("mouseenter mousemove mouseleave", SharkGame.AspectTree.updateMouse);

        $(canvas).on("mousedown", SharkGame.AspectTree.startPan);

        $(canvas).on("click", SharkGame.AspectTree.click);
        $(canvas).on("click", SharkGame.AspectTree.updateMouse);

        SharkGame.AspectTree.context = canvas.getContext("2d", { alpha: false, desynchronized: true });

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
        const context = SharkGame.AspectTree.context;
        const mousePos = SharkGame.AspectTree.getCursorPositionInCanvas(context.canvas, event);
        const offset = SharkGame.AspectTree.cameraOffset;
        const zoom = SharkGame.AspectTree.cameraZoom;

        const staticButton = _.find(SharkGame.AspectTree.staticButtons, ({ posX, posY, width, height }) => {
            return mousePos.posX - posX >= 0 && mousePos.posY - posY >= 0 && mousePos.posX - posX <= width && mousePos.posY - posY <= height;
        });
        if (staticButton !== undefined) {
            return staticButton;
        }

        const upgrade = _.find(SharkGame.Aspects, ({ posX, posY, width, height }) => {
            return (
                CANVAS_WIDTH / 2 - (CANVAS_WIDTH / 2 - mousePos.posX) / zoom - offset.posX >= posX &&
                CANVAS_HEIGHT / 2 - (CANVAS_HEIGHT / 2 - mousePos.posY) / zoom - offset.posY >= posY &&
                CANVAS_WIDTH / 2 - (CANVAS_WIDTH / 2 - mousePos.posX) / zoom - offset.posX <= posX + width &&
                CANVAS_HEIGHT / 2 - (CANVAS_HEIGHT / 2 - mousePos.posY) / zoom - offset.posY <= posY + height
            );
        });
        return upgrade;
    },
    /** @param {MouseEvent} event */
    updateMouse(event) {
        const context = SharkGame.AspectTree.context;

        const button = SharkGame.AspectTree.getButtonUnderMouse(event);
        if (button === undefined) {
            context.canvas.style.cursor = "default";
            $("#tooltipbox").html("");
        } else {
            context.canvas.style.cursor = "pointer";
            $("#tooltipbox").html(button.description + "<br />" + button.getEffect(button.level));
        }
    },
    /** @param {MouseEvent} event */
    click(event) {
        const button = SharkGame.AspectTree.getButtonUnderMouse(event);
        if (button === undefined) {
            return;
        }
        if (typeof button.clicked === "function") {
            button.clicked(event);
        }
        requestAnimationFrame(SharkGame.AspectTree.render);
    },
    /** @param {MouseEvent} event */
    startPan(event) {
        if (SharkGame.AspectTree.getButtonUnderMouse(event) !== undefined) {
            return;
        }
        SharkGame.AspectTree.dragStart.posX = event.clientX / SharkGame.AspectTree.cameraZoom - SharkGame.AspectTree.cameraOffset.posX;
        SharkGame.AspectTree.dragStart.posY = event.clientY / SharkGame.AspectTree.cameraZoom - SharkGame.AspectTree.cameraOffset.posY;
        $(SharkGame.AspectTree.context.canvas).on("mousemove", SharkGame.AspectTree.pan);
        $(SharkGame.AspectTree.context.canvas).on("mouseup mouseleave", SharkGame.AspectTree.endPan);
    },
    /** @param {MouseEvent} event */
    pan(event) {
        const offsetX = clamp(
            event.clientX / SharkGame.AspectTree.cameraZoom - SharkGame.AspectTree.dragStart.posX,
            RIGHT_EDGE,
            LEFT_EDGE - CANVAS_WIDTH
        );
        const offsetY = clamp(
            event.clientY / SharkGame.AspectTree.cameraZoom - SharkGame.AspectTree.dragStart.posY,
            BOTTOM_EDGE,
            TOP_EDGE - CANVAS_HEIGHT
        );
        SharkGame.AspectTree.cameraOffset.posX = offsetX;
        SharkGame.AspectTree.cameraOffset.posY = offsetY;
        requestAnimationFrame(SharkGame.AspectTree.render);
    },
    endPan() {
        $(SharkGame.AspectTree.context.canvas).off("mousemove", SharkGame.AspectTree.pan);
        $(SharkGame.AspectTree.context.canvas).off("mouseup mouseleave", SharkGame.AspectTree.endPan);
    },
    render() {
        const context = SharkGame.AspectTree.context;
        if (context === undefined) return;

        // For some reason, it scrolls indefinitely if you don't set this every frame
        // I have no idea how or why
        context.canvas.width = CANVAS_WIDTH;
        context.canvas.height = CANVAS_HEIGHT;

        const buttonStyle = getComputedStyle(document.getElementById("backToGateway"));
        const buttonColor = buttonStyle.backgroundColor;
        const borderColor = buttonStyle.borderTopColor;

        context.save();
        context.fillStyle = "#155c4b";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.restore();

        context.translate(context.canvas.width / 2, context.canvas.height / 2);
        context.scale(SharkGame.AspectTree.cameraZoom, SharkGame.AspectTree.cameraZoom);
        context.translate(
            -context.canvas.width / 2 + SharkGame.AspectTree.cameraOffset.posX,
            -context.canvas.height / 2 + SharkGame.AspectTree.cameraOffset.posY
        );

        // Lines between upgrades
        context.save();
        context.lineWidth = 5;
        _.each(SharkGame.Aspects, ({ posX, posY, requiredBy, width, height, level }) => {
            context.save();
            if (level === 0) {
                context.filter = "brightness(70%)";
            } else {
                // requiredBy: array of aspectId that depend on this aspect
                _.each(requiredBy, (requiringId) => {
                    const requiring = SharkGame.Aspects[requiringId];

                    const startX = posX + width / 2;
                    const startY = posY + height / 2;

                    const endX = requiring.posX + requiring.width / 2;
                    const endY = requiring.posY + requiring.height / 2;

                    const gradient = context.createLinearGradient(startX, startY, endX, endY);
                    gradient.addColorStop(0, buttonColor);
                    gradient.addColorStop(1, borderColor);
                    context.strokeStyle = gradient;

                    context.beginPath();
                    context.moveTo(startX, startY);
                    context.lineTo(endX, endY);

                    context.stroke();
                });
            }
            context.restore();
        });
        context.restore();

        // Upgrades
        context.save();
        context.lineWidth = 1;
        context.fillStyle = buttonColor;
        context.strokeStyle = borderColor;
        _.each(SharkGame.Aspects, ({ posX, posY, width, height, icon, eventSprite, prerequisites, level }) => {
            context.save();
            if (_.some(prerequisites, (prereq) => SharkGame.Aspects[prereq].level === 0)) {
                // if any prerequisite is unmet, don't render
                return;
            } else if (level === 0) {
                // if not bought, render darker and more saturated
                context.filter = "brightness(70%) saturate(150%)";
            }
            SharkGame.AspectTree.renderButton(context, posX, posY, width, height, icon, eventSprite);

            context.restore();
        });
        context.restore();

        // Static buttons
        context.save();
        // revert zooming
        context.translate(
            context.canvas.width / 2 - SharkGame.AspectTree.cameraOffset.posX,
            context.canvas.height / 2 - SharkGame.AspectTree.cameraOffset.posY
        );
        context.scale(1 / SharkGame.AspectTree.cameraZoom, 1 / SharkGame.AspectTree.cameraZoom);
        context.translate(-context.canvas.width / 2, -context.canvas.height / 2);

        context.lineWidth = 1;
        context.fillStyle = buttonColor;
        context.strokeStyle = borderColor;
        _.each(SharkGame.AspectTree.staticButtons, ({ posX, posY, width, height, icon, eventSprite }) => {
            SharkGame.AspectTree.renderButton(context, posX, posY, width, height, icon, eventSprite);
        });
        context.restore();
    },
    /**
     * Draws a rounded rectangle using the current state of the canvas
     * @param {CanvasRenderingContext2D} context
     * @param {number} posX The top left x coordinate
     * @param {number} posY The top left y coordinate
     * @param {number} width The width of the rectangle
     * @param {number} height The height of the rectangle
     * @param {string} icon The icon to draw in the rectangle
     */
    renderButton(context, posX, posY, width, height, icon = "general/missing-action", eventIcon = false) {
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
    increaseLevel(button) {
        const cost = button.getCost(button.level);

        if (cost > res.getResource("essence")) {
            return;
        }
        res.changeResource("essence", -cost);
        button.level += 1;
        button.apply();
    },
};

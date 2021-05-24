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
SPRITE_SHEET.src = "img/sharksprites.png";
const EVENT_SPRITE_SHEET = new Image();
EVENT_SPRITE_SHEET.src = "img/sharkeventsprites.png";

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

SharkGame.ArtifactTree = {
    dragStart: { posX: 0, posY: 0 },
    cameraZoom: 1,
    cameraOffset: { posX: 0, posY: 0 },
    /** @type {CanvasRenderingContext2D} */
    context: undefined,
    staticButtons: {
        /* Removed until I can figure out how to properly click things when zoomed
        zoom: {
            posX: 10,
            posY: 10,
            width: 200,
            height: 50,
            icon: null,

            description: "Zoom",
            getEffect() {
                if (SharkGame.ArtifactTree.cameraZoom === 1) {
                    return "Zoom out.";
                } else {
                    return "Zoom in.";
                }
            },
            clicked() {
                if (SharkGame.ArtifactTree.cameraZoom === 1) {
                    SharkGame.ArtifactTree.cameraZoom = 0.5;
                } else {
                    SharkGame.ArtifactTree.cameraZoom = 1;
                }
            },
        },
        */
        /*
        debug: {
            posX: 50,
            posY: 50,
            width: 20,
            height: 20,

            description: "Test",
            getEffect() {
                return "test";
            },
            clicked(...args) {
                console.debug(...args);
            },
        },
        */
    },

    init() {
        $.each(SharkGame.Artifacts, (artifactId, artifact) => {
            _.each(artifact.prerequisites, (prerequisite) => {
                if (!_.has(artifact, "requiredBy")) {
                    artifact.requiredBy = [];
                }
                if (!_.has(SharkGame.Artifacts, prerequisite)) return;
                if (!_.has(SharkGame.Artifacts[prerequisite], "requiredBy")) {
                    SharkGame.Artifacts[prerequisite].requiredBy = [];
                }
                SharkGame.Artifacts[prerequisite].requiredBy.push(artifactId);
            });
        });
    },
    setUp() {
        SharkGame.ArtifactTree.dragStart = { posX: 0, posY: 0 };
        SharkGame.ArtifactTree.cameraZoom = 1;
        SharkGame.ArtifactTree.cameraOffset = { posX: 0, posY: 0 };
    },

    drawCanvas() {
        const canvas = document.createElement("canvas");
        canvas.id = "treeCanvas";
        canvas.setAttribute("width", "800px");
        canvas.setAttribute("height", "600px");

        $(canvas).on("mouseenter mousemove mouseleave", SharkGame.ArtifactTree.updateMouse);

        $(canvas).on("mousedown", SharkGame.ArtifactTree.startPan);

        $(canvas).on("click", SharkGame.ArtifactTree.click);
        $(canvas).on("click", SharkGame.ArtifactTree.updateMouse);

        SharkGame.ArtifactTree.context = canvas.getContext("2d", { alpha: true, desynchronized: true });

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
        const context = SharkGame.ArtifactTree.context;
        const mousePos = SharkGame.ArtifactTree.getCursorPositionInCanvas(context.canvas, event);
        const offset = SharkGame.ArtifactTree.cameraOffset;

        const staticButton = _.find(SharkGame.ArtifactTree.staticButtons, ({ posX, posY, width, height }) => {
            return mousePos.posX - posX >= 0 && mousePos.posY - posY >= 0 && mousePos.posX - posX <= width && mousePos.posY - posY <= height;
        });
        if (staticButton !== undefined) {
            return staticButton;
        }

        const upgrade = _.find(SharkGame.Artifacts, ({ posX, posY, width, height }) => {
            return (
                mousePos.posX - offset.posX >= posX &&
                mousePos.posY - offset.posY >= posY &&
                mousePos.posX - offset.posX <= posX + width &&
                mousePos.posY - offset.posY <= posY + height
            );
        });
        return upgrade;
    },
    /** @param {MouseEvent} event */
    updateMouse(event) {
        const context = SharkGame.ArtifactTree.context;

        const button = SharkGame.ArtifactTree.getButtonUnderMouse(event);
        if (button === undefined) {
            context.canvas.style.cursor = "default";
            $("#treeInfobox").html("<br /><br />");
        } else {
            context.canvas.style.cursor = "pointer";
            $("#treeInfobox").html(button.description + "<br />" + button.getEffect(button.level));
        }
    },
    /** @param {MouseEvent} event */
    click(event) {
        const button = SharkGame.ArtifactTree.getButtonUnderMouse(event);
        if (button === undefined) {
            return;
        }
        if (typeof button.clicked === "function") {
            button.clicked(event);
        }
        requestAnimationFrame(SharkGame.ArtifactTree.render);
    },
    /** @param {MouseEvent} event */
    startPan(event) {
        if (SharkGame.ArtifactTree.getButtonUnderMouse(event) !== undefined) {
            return;
        }
        SharkGame.ArtifactTree.dragStart.posX = event.clientX / SharkGame.ArtifactTree.cameraZoom - SharkGame.ArtifactTree.cameraOffset.posX;
        SharkGame.ArtifactTree.dragStart.posY = event.clientY / SharkGame.ArtifactTree.cameraZoom - SharkGame.ArtifactTree.cameraOffset.posY;
        $(SharkGame.ArtifactTree.context.canvas).on("mousemove", SharkGame.ArtifactTree.pan);
        $(SharkGame.ArtifactTree.context.canvas).on("mouseup mouseleave", SharkGame.ArtifactTree.endPan);
    },
    /** @param {MouseEvent} event */
    pan(event) {
        const offsetX = clamp(
            event.clientX / SharkGame.ArtifactTree.cameraZoom - SharkGame.ArtifactTree.dragStart.posX,
            RIGHT_EDGE,
            LEFT_EDGE - CANVAS_WIDTH
        );
        const offsetY = clamp(
            event.clientY / SharkGame.ArtifactTree.cameraZoom - SharkGame.ArtifactTree.dragStart.posY,
            BOTTOM_EDGE,
            TOP_EDGE - CANVAS_HEIGHT
        );
        SharkGame.ArtifactTree.cameraOffset.posX = offsetX;
        SharkGame.ArtifactTree.cameraOffset.posY = offsetY;
        requestAnimationFrame(SharkGame.ArtifactTree.render);
    },
    endPan() {
        $(SharkGame.ArtifactTree.context.canvas).off("mousemove", SharkGame.ArtifactTree.pan);
        $(SharkGame.ArtifactTree.context.canvas).off("mouseup mouseleave", SharkGame.ArtifactTree.endPan);
    },
    render() {
        const context = SharkGame.ArtifactTree.context;
        if (context === undefined) return;

        // For some reason, it scrolls indefinitely if you don't set this every frame
        // I have no idea how or why
        context.canvas.width = CANVAS_WIDTH;
        context.canvas.height = CANVAS_HEIGHT;

        const buttonStyle = getComputedStyle(document.getElementById("backToGateway"));
        const buttonColor = buttonStyle.backgroundColor;
        const borderColor = buttonStyle.borderTopColor;

        context.translate(context.canvas.width / 2, context.canvas.height / 2);
        context.scale(SharkGame.ArtifactTree.cameraZoom, SharkGame.ArtifactTree.cameraZoom);
        context.translate(
            -context.canvas.width / 2 + SharkGame.ArtifactTree.cameraOffset.posX,
            -context.canvas.height / 2 + SharkGame.ArtifactTree.cameraOffset.posY
        );
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        // Lines between upgrades
        context.save();
        context.lineWidth = 5;
        _.each(SharkGame.Artifacts, ({ posX, posY, requiredBy, width, height }) => {
            // requiredBy: array of artifactId that depend on this artifact
            _.each(requiredBy, (requiringId) => {
                const requiring = SharkGame.Artifacts[requiringId];

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
        });
        context.restore();

        // Upgrades
        context.save();
        context.lineWidth = 1;
        context.fillStyle = buttonColor;
        context.strokeStyle = borderColor;
        _.each(SharkGame.Artifacts, ({ posX, posY, width, height, icon, eventSprite }) => {
            SharkGame.ArtifactTree.renderButton(context, posX, posY, width, height, icon, eventSprite);
        });
        context.restore();

        // Static buttons
        context.save();
        // revert zooming
        context.translate(
            context.canvas.width / 2 - SharkGame.ArtifactTree.cameraOffset.posX,
            context.canvas.height / 2 - SharkGame.ArtifactTree.cameraOffset.posY
        );
        context.scale(1 / SharkGame.ArtifactTree.cameraZoom, 1 / SharkGame.ArtifactTree.cameraZoom);
        context.translate(-context.canvas.width / 2, -context.canvas.height / 2);

        context.lineWidth = 1;
        context.fillStyle = buttonColor;
        context.strokeStyle = borderColor;
        _.each(SharkGame.ArtifactTree.staticButtons, ({ posX, posY, width, height, icon, eventSprite }) => {
            SharkGame.ArtifactTree.renderButton(context, posX, posY, width, height, icon, eventSprite);
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
};

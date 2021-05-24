"use strict";
const BUTTON_HEIGHT = 60;
const BUTTON_WIDTH = 60;
const BUTTON_BORDER_RADIUS = 5;

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const LEFT_EDGE = -50;
const TOP_EDGE = -50;
const RIGHT_EDGE = CANVAS_WIDTH + 50;
const BOTTOM_EDGE = CANVAS_HEIGHT + 50;

function clamp(num, min, max) {
    console.debug(num, min, max, num <= min ? min : num >= max ? max : num);
    return num <= min ? min : num >= max ? max : num;
}

SharkGame.ArtifactTree = {
    dragStart: { posX: 0, posY: 0 },
    cameraZoom: 1,
    cameraOffset: { posX: 0, posY: 0 },
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
    /** @type {{posX: number, posY: number}[]} */
    buttons: [],
    shouldRender: false,
    /** @type {CanvasRenderingContext2D} */
    context: undefined,

    drawCanvas() {
        const canvas = document.createElement("canvas");
        canvas.id = "treeCanvas";
        canvas.setAttribute("width", "800px");
        canvas.setAttribute("height", "600px");

        $(canvas).on("mouseenter mousemove mouseleave", SharkGame.ArtifactTree.updateMouse);

        $(canvas).on("mousedown", SharkGame.ArtifactTree.startPan);

        $(canvas).on("click", SharkGame.ArtifactTree.click);

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
    getUpgradeUnderMouse(event) {
        const context = SharkGame.ArtifactTree.context;
        const mousePos = SharkGame.ArtifactTree.getCursorPositionInCanvas(context.canvas, event);
        const offset = SharkGame.ArtifactTree.cameraOffset;

        const upgrade = _.find(SharkGame.Artifacts, ({ posX, posY }) => {
            return (
                mousePos.posX - offset.posX - posX >= 0 &&
                mousePos.posY - offset.posY - posY >= 0 &&
                mousePos.posX - offset.posX - posX <= BUTTON_WIDTH &&
                mousePos.posY - offset.posY - posY <= BUTTON_HEIGHT
            );
        });
        return upgrade;
    },
    /** @param {MouseEvent} event */
    updateMouse(event) {
        const context = SharkGame.ArtifactTree.context;

        const upgrade = SharkGame.ArtifactTree.getUpgradeUnderMouse(event);
        if (upgrade === undefined) {
            context.canvas.style.cursor = "default";
            $("#treeInfobox").html("<br /><br />");
        } else {
            context.canvas.style.cursor = "pointer";
            $("#treeInfobox").html(upgrade.description + "<br />" + upgrade.getEffect(upgrade.level));
        }
    },
    click(event) {
        const upgrade = SharkGame.ArtifactTree.getUpgradeUnderMouse(event);
        if (upgrade === undefined) {
            return;
        }
    },
    startPan(event) {
        if (SharkGame.ArtifactTree.getUpgradeUnderMouse(event) !== undefined) {
            return;
        }
        SharkGame.ArtifactTree.dragStart.posX = event.clientX / SharkGame.ArtifactTree.cameraZoom - SharkGame.ArtifactTree.cameraOffset.posX;
        SharkGame.ArtifactTree.dragStart.posY = event.clientY / SharkGame.ArtifactTree.cameraZoom - SharkGame.ArtifactTree.cameraOffset.posY;
        $(SharkGame.ArtifactTree.context.canvas).on("mousemove", SharkGame.ArtifactTree.pan);
        $(SharkGame.ArtifactTree.context.canvas).on("mouseup mouseleave", SharkGame.ArtifactTree.endPan);
    },
    pan(event) {
        const offsetX = clamp(event.clientX / SharkGame.ArtifactTree.cameraZoom - SharkGame.ArtifactTree.dragStart.posX, LEFT_EDGE, RIGHT_EDGE);
        const offsetY = clamp(event.clientY / SharkGame.ArtifactTree.cameraZoom - SharkGame.ArtifactTree.dragStart.posY, TOP_EDGE, BOTTOM_EDGE);
        SharkGame.ArtifactTree.cameraOffset.posX = offsetX;
        SharkGame.ArtifactTree.cameraOffset.posY = offsetY;
    },
    endPan(_event) {
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

        const buttonColor = getComputedStyle(document.getElementById("backToGateway")).backgroundColor;
        const borderColor = getComputedStyle(document.getElementById("backToGateway")).borderTopColor;

        context.translate(context.canvas.width / 2, context.canvas.height / 2);
        context.scale(SharkGame.ArtifactTree.cameraZoom, SharkGame.ArtifactTree.cameraZoom);
        context.translate(
            -context.canvas.width / 2 + SharkGame.ArtifactTree.cameraOffset.posX,
            -context.canvas.height / 2 + SharkGame.ArtifactTree.cameraOffset.posY
        );

        context.lineWidth = 5;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        _.each(SharkGame.Artifacts, ({ posX, posY, requiredBy }) => {
            _.each(requiredBy, (requiringId) => {
                const requiring = SharkGame.Artifacts[requiringId];

                const startX = posX + BUTTON_WIDTH / 2;
                const startY = posY + BUTTON_HEIGHT / 2;

                const endX = requiring.posX + BUTTON_WIDTH / 2;
                const endY = requiring.posY + BUTTON_HEIGHT / 2;

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

        context.lineWidth = 1;
        context.fillStyle = buttonColor;
        context.strokeStyle = borderColor;
        _.each(SharkGame.Artifacts, ({ posX, posY }) => {
            SharkGame.ArtifactTree.roundRect(context, posX, posY, BUTTON_WIDTH, BUTTON_HEIGHT);
        });
        if (SharkGame.ArtifactTree.shouldRender) {
            requestAnimationFrame(SharkGame.ArtifactTree.render);
        }
    },
    /**
     * Draws a rounded rectangle using the current state of the canvas
     * @param {CanvasRenderingContext2D} context
     * @param {number} posX The top left x coordinate
     * @param {number} posY The top left y coordinate
     * @param {number} width The width of the rectangle
     * @param {number} height The height of the rectangle
     */
    roundRect(context, posX, posY, width, height) {
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
    },
};

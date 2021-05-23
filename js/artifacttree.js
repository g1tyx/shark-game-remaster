const BUTTON_HEIGHT = 60;
const BUTTON_WIDTH = 60;
const BUTTON_BORDER_RADIUS = 5;

SharkGame.ArtifactTree = {
    // Not called anywhere yet
    // requiredBy would be useful for lines
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

        $(canvas).on("mousedown", SharkGame.ArtifactTree.mouseDown);
        $(canvas).on("mouseup", SharkGame.ArtifactTree.mouseUp);

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

        const upgrade = _.find(SharkGame.Artifacts, ({ posX, posY }) => {
            return (
                mousePos.posX - posX >= 0 &&
                mousePos.posY - posY >= 0 &&
                mousePos.posX - posX <= BUTTON_WIDTH &&
                mousePos.posY - posY <= BUTTON_HEIGHT
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
    mouseDown(event) {
        console.debug("mouseDown", event);
    },
    mouseUp(event) {
        console.debug("mouseUp", event);
    },
    render() {
        const context = SharkGame.ArtifactTree.context;
        if (context === undefined) return;

        const buttonColor = getComputedStyle(document.getElementById("backToGateway")).backgroundColor;
        const borderColor = getComputedStyle(document.getElementById("backToGateway")).borderTopColor;

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.save();
        context.lineWidth = 5;
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
        context.restore();
        context.save();
        context.fillStyle = buttonColor;
        context.strokeStyle = borderColor;
        _.each(SharkGame.Artifacts, ({ posX, posY }) => {
            SharkGame.ArtifactTree.roundRect(context, posX, posY, BUTTON_WIDTH, BUTTON_HEIGHT);
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

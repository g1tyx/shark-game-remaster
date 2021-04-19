SharkGame.Reflection = {
    tabId: "reflection",
    tabDiscovered: false,
    tabName: "Reflection",
    tabBg: "img/bg/bg-gate.png",

    sceneImage: "img/events/misc/scene-reflection.png",

    discoverReq: {
        resource: {
            essence: 1,
        },
    },

    message:
        "You may not remember everything, but you are something more than a shark now." +
        "</br><span='medDesc'>Reflect upon the changes in yourself and reality you have made here.</span>",

    init() {
        const ref = SharkGame.Reflection;
        // register tab
        SharkGame.Tabs[ref.tabId] = {
            id: ref.tabId,
            name: ref.tabName,
            discovered: ref.tabDiscovered,
            discoverReq: ref.discoverReq,
            code: ref,
        };
    },

    switchTo() {
        const ref = SharkGame.Reflection;
        const content = $("#content");
        content.append($("<div>").attr("id", "tabMessage"));
        content.append($("<div>").attr("id", "artifactList"));
        let message = ref.message;
        const tabMessageSel = $("#tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + ref.sceneImage + "' id='tabSceneImageEssence'>" + message;
            tabMessageSel.css("background-image", "url('" + ref.tabBg + "')");
        }
        tabMessageSel.html(message);

        ref.updateArtifactList();
    },

    update() {},

    updateArtifactList() {
        const listSel = $("#artifactList");
        $.each(SharkGame.Artifacts, (artifactKey, artifactData) => {
            if (artifactData.level > 0 && !artifactData.ignore) {
                let artifactLabel = artifactData.name + "<br><span class='medDesc'>";
                if (artifactData.level >= artifactData.max) {
                    artifactLabel += "(Maximum Power)";
                } else {
                    artifactLabel += "(Power: " + m.beautify(artifactData.level) + ")";
                }
                artifactLabel += "<br>" + artifactData.desc(artifactData.level);
                artifactLabel += "</span><br><em>" + artifactData.flavour + "</em>";

                const item = $("<div>").addClass("artifactDiv");
                item.append(artifactLabel);
                listSel.append(item);

                if (SharkGame.Settings.current.showIcons) {
                    const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, "artifacts/" + artifactKey, null, "general/missing-artifact");
                    if (iconDiv) {
                        iconDiv.addClass("button-icon");
                        iconDiv.addClass("gatewayButton");
                        item.prepend(iconDiv);
                    }
                }
            }
        });
        if ($("#artifactList > div").length === 0) {
            listSel.append("<p><em>You have no artifacts to show.</em></p>");
        }
    },
};

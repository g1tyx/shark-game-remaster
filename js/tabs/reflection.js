"use strict";
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
        content.append($("<div>").attr("id", "aspectList"));
        let message = ref.message;
        const tabMessageSel = $("#tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + ref.sceneImage + "' id='tabSceneImageEssence'>" + message;
            tabMessageSel.css("background-image", "url('" + ref.tabBg + "')");
        }
        tabMessageSel.html(message);

        ref.updateAspectList();
    },

    update() {},

    updateAspectList() {
        const listSel = $("#aspectList");
        $.each(SharkGame.Aspects, (aspectId, aspectData) => {
            if (aspectData.level > 0 && !aspectData.ignore) {
                let aspectLabel = aspectData.name + "<br><span class='medDesc'>";
                if (aspectData.level >= aspectData.max) {
                    aspectLabel += "(Maximum Power)";
                } else {
                    aspectLabel += "(Power: " + main.beautify(aspectData.level) + ")";
                }
                aspectLabel += "<br>" + aspectData.desc(aspectData.level);
                aspectLabel += "</span><br><em>" + aspectData.flavour + "</em>";

                const item = $("<div>").addClass("aspectDiv");
                item.append(aspectLabel);
                listSel.append(item);

                if (SharkGame.Settings.current.showIcons) {
                    // FIXME: artifacts -> aspects
                    const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, "artifacts/" + aspectId, null, "general/missing-artifact");
                    if (iconDiv) {
                        iconDiv.addClass("button-icon");
                        iconDiv.addClass("gatewayButton");
                        item.prepend(iconDiv);
                    }
                }
            }
        });
        if ($("#aspectList > div").length === 0) {
            listSel.append("<p><em>You have no aspects to you yet.</em></p>");
        }
    },
};

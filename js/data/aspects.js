"use strict";

/**
 * @type {Record<string, {
 *     requiredBy: string[] | undefined
 *     eventSprite: boolean // Whether to use the event spritesheet
 *     icon: string
 *     posX: number
 *     posY: number
 *     width: number
 *     height: number
 *     level: number
 *     prerequisites: string[]
 *     getCost(level: number): number
 *     getEffect(level: number): string
 *     getUnlocked(): string // tells you if miscellaneous requirements have been met. if they have, returns nothing. if they have not, returns a message stating why not.
 *     clicked(): void
 *     apply(time: string): void
 * }>
 */
// idea: aspect which helps to reveal more of the tree
SharkGame.Aspects = {
    apotheosis: {
        posX: 350,
        posY: 350,
        width: 40,
        height: 40,

        max: 4,
        level: 0,
        name: "Apotheosis",
        description: "The path begins here.",
        noRefunds: true,
        getCost(level) {
            return (level + 1) ** 2;
        },
        getEffect(level) {
            return "Manual resource collection <strong>x" + (level > 0 ? level * 4 : 1) + "</strong>.";
        },
        getUnlocked() {},
        prerequisites: [],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    pathOfIndustry: {
        posX: 450,
        posY: 450,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Path of Industry",
        description: "Unlock the potential of those around you.",
        getCost(level) {
            return 2 ** (level + 2);
        },
        getEffect(level) {
            return (
                "Multiply the efficiency of " +
                sharktext.getResourceName("shark", false, 69, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                ", their jobs, and their fundamental machines by <strong>" +
                (level + 1) +
                "x</strong>."
            );
        },
        getUnlocked() {},
        prerequisites: ["apotheosis"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
        apply(when) {
            if (when === "init") {
                res.applyModifier("pathOfIndustry", "shark", this.level + 1);
                res.applyModifier("pathOfIndustry", "diver", this.level + 1);
                res.applyModifier("pathOfIndustry", "scientist", this.level + 1);
                res.applyModifier("pathOfIndustry", "fishMachine", this.level + 1);
                res.applyModifier("pathOfIndustry", "crystalMiner", this.level + 1);
                res.applyModifier("pathOfIndustry", "sandDigger", this.level + 1);
                res.applyModifier("pathOfIndustry", "nurse", this.level + 1);
                res.applyModifier("pathOfIndustry", "skimmer", this.level + 1);
                res.applyModifier("pathOfIndustry", "autoTransmuter", this.level + 1);
            }
        }
    },
    tokenOfIndustry: {
        posX: 200,
        posY: 225,
        width: 40,
        height: 40,

        max: 3,
        level: 0,
        name: "Token of Industry",
        description: ".",
        getCost(level) {
            switch (level) {
                case 0:
                    return 1;
                case 1:
                    return 20;
                case 2:
                    return 48;
            }
        },
        getEffect(level) {
            switch (level) {
                case 1:
                    return "Unlock a <strong>moveable token</strong> that <strong>multiplies</strong> production of whatever it is placed on.";
                case 2:
                    return "Unlock a second token (tokens cannot stack on the same resource).";
                case 3:
                    return "Unlock a third token (tokens cannot stack on the same resource).";
            }
        },
        getUnlocked() {},
        prerequisites: ["pathOfEnlightenment"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    pathOfEnlightenment: {
        posX: 200,
        posY: 350,
        width: 40,
        height: 40,

        max: 1,
        level: 0,
        name: "Path of Enlightenment",
        description: "Unlock the potential of yourself.",
        noRefunds: true,
        getCost(_level) {
            return 2;
        },
        getEffect(_level) {
            return "Gain the power to travel between worlds.";
        },
        getUnlocked() {},
        prerequisites: ["apotheosis"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    distantForesight: {
        posX: 200,
        posY: 475,
        width: 40,
        height: 40,

        max: 1,
        level: 0,
        name: "Distant Foresight",
        description: "See the unseen.",
        noRefunds: true,
        getCost(_level) {
            return 2;
        },
        getEffect(level) {
            switch (level) {
                case 1:
                    return "Reveals basic information about a world before you choose to visit it.";
                //case 2:
                //    return "Reveals basic information about a world before you choose to visit it, and identifies unknown resources.";
            }
        },
        getUnlocked() {},
        prerequisites: ["pathOfEnlightenment"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    patience: {
        posX: -25,
        posY: 250,
        width: 40,
        height: 40,

        // need to give out patience rewards to those who had pending patience
        max: 5,
        level: 0,
        name: "Patience",
        description: "They say that good things come to those who wait.",
        noRefunds: true,
        getCost(level) {
            return (level + 2) ** 2;
        },
        getEffect(level) {
            return "Gain nothing now. Every time a world is completed, gain " + level + " " + sharktext.getResourceName("essence", false, 69, sharkcolor.getElementColor("tooltipbox", "background-color") + " in addition to usual rewards.");
        },
        getUnlocked() {},
        prerequisites: ["meditation"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    pathOfTime: {
        posX: 450,
        posY: 250,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Path of Time",
        description: "Patience is the choice of those who prefer inaction.",
        getCost(level) {
            return (level + 1) ** 2 + 1;
        },
        getEffect(level) {
            return (
                "Start with <strong>" +
                50 * level ** 2 +
                "</strong> " +
                sharktext.getResourceName("crab", false, 69, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                ". If they do not exist, start with an equivalent."
            );
        },
        getUnlocked() {},
        prerequisites: ["apotheosis"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
        apply(when) {
            if (when === "init" && res.getResource("crab") === 0 && !SharkGame.flags.pathOfTimeApplied) {
                const base = 50 * this.level ** 2;
                switch (world.worldType) {
                    case "shrouded":
                        res.changeResource("diver", base * 0.5);
                        break;
                    default:
                        res.changeResource("crab", base);
                }
                SharkGame.flags.pathOfTimeApplied = true;
            }
        },
    },
    coordinatedCooperation: {
        posX: 200,
        posY: 100,
        width: 40,
        height: 40,

        max: 4,
        level: 0,
        name: "Coordinated Cooperation",
        description: "Maybe the squid had a point. Maybe teamwork really is the key.",
        getCost(level) {
            return 16 * (level + 1);
        },
        getEffect(level) {
            return "Tokens increase production by <strong>" + (level + 2) + "x</strong>.";
        },
        getUnlocked() {
            return gateway.completedWorlds.includes("frigid") ? "" : "Complete the Frigid worldtype to unlock this aspect.";
        },
        prerequisites: ["tokenOfIndustry"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    syntheticTransmutation: {
        posX: 530,
        posY: 550,
        width: 40,
        height: 40,

        max: 3,
        level: 0,
        name: "Synthetic Transmutation",
        description: "Surely, our materials don't need to be 100% pure. Surely.",
        getCost(level) {
            return 2 * level + 3;
        },
        getEffect(level) {
            return "Artificial materials are <strong>" + 20 * level + "%</strong> cheaper to produce manually.";
        },
        getUnlocked() {},
        prerequisites: ["pathOfIndustry"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    amorphousAssembly: {
        posX: 570,
        posY: 650,
        width: 40,
        height: 40,

        max: 2,
        level: 0,
        name: "Amorphous Assembly",
        description: "Machines that make use of similar components are better machines.",
        getCost(level) {
            return 4 + 5 * level;
        },
        getEffect(level) {
            return "All machines have non-artificial-material costs reduced by <strong>" + (50 * level) + "%</strong>.";
        },
        getUnlocked() {},
        prerequisites: ["syntheticTransmutation"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    mechanicalManifestation: {
        posX: 630,
        posY: 510,
        width: 40,
        height: 40,

        max: 2,
        level: 0,
        name: "Mechanical Manifestation",
        description: ".",
        getCost(level) {
            return 2 + 5 * level;
        },
        getEffect(level) {
            return "Reduce how much machines making artificial materials consume by <strong>" + (50 * level) + "%</strong>."
        },
        getUnlocked() {},
        prerequisites: ["syntheticTransmutation"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    thePlan: {
        posX: 550,
        posY: 375,
        width: 40,
        height: 40,

        max: 3,
        level: 0,
        name: "The Plan",
        description: "Professionals have standards. Be polite, be efficient, and have a plan to recruit everyone you meet.",
        getCost(level) {
            return 2 * level + 4;
        },
        getEffect(level) {
            return "Core frenzy members are <strong>" + 100 * (1 - 0.5 ** level) + "%</strong> cheaper to hire.";
        },
        getUnlocked() {},
        prerequisites: ["pathOfIndustry"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    collectiveCooperation: {
        posX: 675,
        posY: 425,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Collective Cooperation",
        description: "Direct your frenzy. Learn to control them.",
        getCost(level) {
            return 3 * level + 5;
        },
        getEffect(level) {
            return "The effect from tokens of industry is <strong>" + (level + 1) + "x</strong> stronger.";
        },
        getUnlocked() {},
        prerequisites: ["thePlan"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    constructedConception: {
        posX: 675,
        posY: 350,
        width: 40,
        height: 40,

        max: 7,
        level: 0,
        name: "Constructed Conception",
        description: "Reproduction is inefficient. Reinvent biology as a means to an end.",
        getCost(level) {
            return 2 * level + 4;
        },
        getEffect(level) {
            return "All breeders are <strong>" + (2 ** level) + "x</strong> faster.";
        },
        getUnlocked() {},
        prerequisites: ["thePlan"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    destinyGamble: {
        posX: 300,
        posY: 550,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Destiny Gamble",
        description: "Where we end up is all luck, but sometimes, we can stack the deck.",
        noRefunds: true,
        getCost(level) {
            return 2 + level;
        },
        getEffect(level) {
            return (
                "Between worlds, have the opportunity to reroll your world selection up to <strong>" +
                level +
                " time" +
                (level > 0 ? "s" : "") +
                "</strong>."
            );
        },
        getUnlocked() {},
        prerequisites: ["distantForesight"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
        apply(when) {
            if (when === "levelUp") {
                if (_.isUndefined(SharkGame.persistentFlags.destinyRolls)) {
                    SharkGame.persistentFlags.destinyRolls = this.level;
                } else {
                    SharkGame.persistentFlags.destinyRolls += 1;
                }
            }
        },
    },
    cleanSlate: {
        posX: 100,
        posY: 550,
        width: 40,
        height: 40,

        max: 1,
        level: 0,
        name: "Clean Slate",
        description: "To build anew, you must first destroy what is already there.",
        noRefunds: true,
        getCost(_level) {
            return 4;
        },
        getEffect(_level) {
            return "Unlock the ability to refund non-core aspects.";
        },
        getUnlocked() {},
        prerequisites: ["distantForesight"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
        apply(when) {
            if (when === "levelUp") {
                SharkGame.Button.makeButton("respecButton", "respec industry and time branches", $("#paneContent"), () => {
                    if (confirm("Are you sure you want to refund all aspects on the Industry and Time branches?")) {
                        tree.respecTree();
                    }
                });
            }
        },
    },
    crystallineSkin: {
        posX: 425,
        posY: 150,
        width: 40,
        height: 40,

        max: 6,
        level: 0,
        name: "Crystalline Skin",
        description: "Become one with the lattice.",
        getCost(level) {
            return 2 * level + 4;
        },
        getEffect(level) {
            return (
                "If you have less than <strong>" +
                25 * level ** 2 +
                "</strong> " +
                sharktext.getResourceName("crystal", false, 69, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                ", they will rapidly increase back to that amount. If they do not exist, this applies to an equivalent resource."
            );
        },
        getUnlocked() {},
        prerequisites: ["pathOfTime"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
        apply(when) {
            if (when === "init" && res.getResource("crystal") === 0 && !SharkGame.flags.crystallineSkinApplied) {
                const base = 20 * this.level ** 2;
                res.changeResource("crystal", base);
                SharkGame.flags.crystallineSkinApplied = true;
            }
        },
    },
    /*     keenEyesight: {
        posX: 0,
        posY: 50,
        width: 40,
        height: 40,

        max: 10,
        level: 0,
        name: "Keen Eyesight",
        description: "Learn to stop overlooking the small stuff.",
        getCost(level) {
            return 3 * level + 5;
        },
        getEffect(level) {
            return (
                "Unlocks a button to manually gather " +
                sharktext.getResourceName("crystal", false, 420) +
                ". " +
                0.01 * level * SharkGame.Aspects.apotheosis.level +
                " " +
                sharktext.getResourceName("crystal", false, 420) +
                " per click."
            );
        },
        getUnlocked() {
            //return SharkGame.Gateway.completedWorlds.includes("shrouded") ? "" : "Complete the Shrouded worldtype to unlock this aspect.";
            return "This aspect will be implemented in a future update.";
        },
        prerequisites: ["crystallineSkin"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    }, */
    internalCalculator: {
        posX: 575,
        posY: 225,
        width: 40,
        height: 40,

        max: 2,
        level: 0,
        name: "Internal Calculator",
        description: "The octopuses could always manifest the rational from the confusing. Master their efficiency inside your own mind.",
        getCost(_level) {
            return 4;
        },
        getEffect(level) {
            if (level === 1) {
                return (
                    "If a research costs <strong>" +
                    150 +
                    "</strong> " +
                    sharktext.getResourceName("science", false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    " or less, then its science cost is halved."
                );
            } else {
                return (
                    "If a research costs <strong>" +
                    150 +
                    "</strong> " +
                    sharktext.getResourceName("science", false, false, sharkcolor.getElementColor("tooltipbox", "background-color")) +
                    " or less, then all its costs are halved."
                );
            }
        },
        getUnlocked() {
            return gateway.completedWorlds.includes("abandoned") ? "" : "Complete the Abandoned worldtype to unlock this aspect.";
        },
        prerequisites: ["pathOfTime"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    extensiveOrganization: {
        posX: 550,
        posY: 125,
        width: 40,
        height: 40,

        max: 2,
        level: 0,
        name: "Extensive Organization",
        description: "Be prepared. Organize. No wasted time.",
        getCost(_level) {
            return 2;
        },
        getEffect(level) {
            if (level === 1) {
                return "Start with the grotto already unlocked.";
            } else {
                return "Start with the grotto and the laboratory already unlocked.";
            }
        },
        getUnlocked() {
            //return SharkGame.Gateway.completedWorlds.includes("tempestuous") ? "" : "Complete the Tempestuous worldtype to unlock this aspect.";
        },
        prerequisites: ["internalCalculator"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
        apply(when) {
            if (when === "init") {
                SharkGame.Lab.addUpgrade("statsDiscovery");
                if (this.level > 1) {
                    SharkGame.TabHandler.discoverTab("lab");
                }
            }
        },
    },
    anythingAndEverything: {
        posX: 675,
        posY: 100,
        width: 40,
        height: 40,

        max: 1,
        level: 0,
        name: "Anything and Everything",
        description: "Could I interest you in little bit of everything?",
        getCost(_level) {
            return 5;
        },
        getEffect(_level) {
            return "Unlock a button which presses all buy buttons on the screen (pressed in order from left-to-right, top-to-bottom).";
        },
        getUnlocked() {},
        prerequisites: ["extensiveOrganization"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    theHourHand: {
        posX: 75,
        posY: 400,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "The Hour Hand",
        description: "Time is a construct of the mind.",
        getCost(level) {
            return 3 + 2 * level;
        },
        getEffect(level) {
            return "The Minute Hand starts with " + sharktext.boldString(60 * level + "s") + " when entering a new world.";
        },
        getUnlocked() {},
        prerequisites: ["pathOfEnlightenment"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    gumption: {
        posX: -25,
        posY: 350,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Gumption",
        description: "Resourcefulness leads to prosperity.",
        getCost(level) {
            return 3 + level * 2;
        },
        getEffect(level) {
            return "For each unspent essence you have, increase all essence gains by " + 2 * level + "%.";
        },
        getUnlocked() {},
        prerequisites: ["meditation"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    meditation: {
        posX: 75,
        posY: 300,
        width: 40,
        height: 40,

        max: 1,
        level: 0,
        name: "Meditation",
        description: "Breathe. Focus. Exert your influence.",
        getCost(_level) {
            return 2;
        },
        getEffect(_level) {
            return "Unlocks a pause button that freezes everything, and no idle or offline progress is accrued while paused.";
        },
        getUnlocked() {},
        prerequisites: ["pathOfEnlightenment"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    infinityVision: {
        posX: 200,
        posY: 600,
        width: 40,
        height: 40,

        max: 1,
        level: 0,
        name: "Infinity Vision",
        description: "Nothing can remain hidden to astute observers.",
        getCost(_level) {
            return 10;
        },
        getEffect(_level) {
            return "Reveals all aspects which are not locked or behind other locked aspects.";
        },
        getUnlocked() {},
        prerequisites: ["distantForesight"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },

    // deprecated

    theMinuteHand: {
        deprecated: true,
        level: 0,
        getCost(level) {
            switch (level) {
                case 0:
                    return 4;
                default:
                    return 3 + level;
            }
        },
        prerequisites: ["theSecondHand"],
    },
    theSecondHand: {
        deprecated: true,
        level: 0,
        getCost(level) {
            return 6 * (level + 1);
        },
        prerequisites: ["theMinuteHand"],
    },
};

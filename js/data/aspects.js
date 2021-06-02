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
 *     apply(level): void
 * }>
 */
SharkGame.Aspects = {
    apotheosis: {
        posX: 380,
        posY: 550,
        width: 40,
        height: 40,

        max: 4,
        level: 0,
        name: "Apotheosis",
        description: "The path begins here.",
        getCost(level) {
            return (level + 1) ** 2;
        },
        getEffect(level) {
            return "Manual resource collection x" + (level > 0 ? level * 4 : 1) + ".";
        },
        getUnlocked() {},
        prerequisites: [],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
    },
    pathOfIndustry: {
        posX: 690,
        posY: 350,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Path of Industry",
        description: "Unlock the potential of those around you.",
        getCost(level) {
            return level * 2 + 2;
        },
        getEffect(level) {
            return res.getResourceName("shark", false, false, 69) + " collect things " + (level > 0 ? level + 1 : 1) + " times faster.";
        },
        getUnlocked() {},
        prerequisites: ["apotheosis"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
    },
    pathOfEnlightenment: {
        posX: 380,
        posY: 350,
        width: 40,
        height: 40,

        max: 4,
        level: 0,
        name: "Path of Enlightenment",
        description: "Unlock the potential of yourself.",
        getCost(level) {
            return (level + 1) ** 2 + 1;
        },
        getEffect(level) {
            //return "Gain " + level + " extra choice" + (level > 1 ? "s" : "") + " when choosing a world to visit.";
            switch (level) {
                case 1:
                    return "Reveals basic information about a world before you choose to visit it.";
                case 2:
                    return "Reveals all properties of a world before you choose to visit it.";
                case 3:
                    return "Reveals important resources that are and are not present, as well as all properties of a world before you choose to visit it.";
                case 4:
                    return "Reveals all information about a world before you choose to visit it and gives insight into your hypothetical experience.";
            }
        },
        getUnlocked() {},
        prerequisites: ["apotheosis"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
    },
    patience: {
        posX: 300,
        posY: 250,
        width: 40,
        height: 40,

        max: 3,
        level: 0,
        name: "Patience",
        description: "They say that good things come to those who wait.",
        getCost(level) {
            return (level + 2) ** 2;
        },
        getEffect(level) {
            return "Gain nothing now. After beating 3 more worlds, gain " + 2 * (level + 1) ** 2 + " essence.";
        },
        getUnlocked() {},
        prerequisites: ["pathOfEnlightenment"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
    },
    pathOfTime: {
        posX: 70,
        posY: 350,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Path of Time",
        description: "Begin each journey with swiftness.",
        getCost(level) {
            return (level + 1) ** 2 + 1;
        },
        getEffect(level) {
            return "Start with " + 10 * level ** 3 + " crabs (if possible).";
        },
        getUnlocked() {},
        prerequisites: ["apotheosis"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
    },
    adjustedAquadynamics: {
        posX: 610,
        posY: 250,
        width: 40,
        height: 40,

        max: 4,
        level: 0,
        name: "Adjusted Aquadynamics",
        description: "A thin layer of essence greatly reduces drag, improving hunting profiency.",
        getCost(level) {
            return 2 * level + 1;
        },
        getEffect(level) {
            return (
                res.getResourceName("ray", false, false, 69) +
                " hunt " +
                res.getResourceName("fish", false, false, 69) +
                " " +
                2 ** level * 2.5 +
                "x faster."
            );
        },
        getUnlocked() {},
        prerequisites: ["pathOfIndustry"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
    },
    destinyGamble: {
        posX: 460,
        posY: 250,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Destiny Gamble",
        description: "Where we end up is all luck, but sometimes, we can stack the deck.",
        getCost(level) {
            switch (level) {
                case 0:
                    return 1;
                default:
                    return 3 * level;
            }
        },
        getEffect(level) {
            return "Between worlds, have the opportunity to reroll your world selection up to " + level + " time" + (level > 0 ? "s" : "") + ".";
        },
        getUnlocked() {},
        prerequisites: ["pathOfEnlightenment"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
    },
    syntheticTransmutation: {
        posX: 770,
        posY: 250,
        width: 40,
        height: 40,

        max: 4,
        level: 0,
        name: "Synthetic Transmutation",
        description: "Sharkonium is naturally unaffected by small impurities. Perhaps we can cheat a little.",
        getCost(level) {
            return 2 * level + 3;
        },
        getEffect(level) {
            return "Sharkonium is " + 20 * level + "% cheaper to produce.";
        },
        getUnlocked() {},
        prerequisites: ["pathOfIndustry"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
    },
    crystallineSkin: {
        posX: 0,
        posY: 250,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Crystalline Skin",
        description: "Become one with the lattice.",
        getCost(level) {
            return 2 * level + 3;
        },
        getEffect(level) {
            return "Start with " + 20 * level ** 2 + " crystals. If they do not exist, start with an equivalent.";
        },
        getUnlocked() {},
        prerequisites: ["pathOfTime"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
    },
    internalCalculator: {
        posX: 140,
        posY: 250,
        width: 40,
        height: 40,

        max: 1,
        level: 0,
        name: "Internal Calculator",
        description: "What's a calculator?",
        getCost(_level) {
            return 3;
        },
        getEffect(_level) {
            return "Start with the grotto unlocked.";
        },
        getUnlocked() {
            return SharkGame.Gateway.completedWorlds.includes("abandoned") ? "" : "Complete the Abandoned worldtype to unlock this aspect.";
        },
        prerequisites: ["pathOfTime"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
    },
};

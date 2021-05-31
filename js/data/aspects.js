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
        prerequisites: [],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
        apply() {},
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
            return "Sharks catch fish " + (level > 0 ? level + 1 : 1) + " times faster.";
        },
        prerequisites: ["apotheosis"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
        apply() {},
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
        prerequisites: ["apotheosis"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
        apply() {},
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
            return "Gain nothing immediately. After beating 3 more worlds, gain " + 2 * (level + 1) ** 2 + " essence.";
        },
        prerequisites: ["pathOfEnlightenment"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
        apply() {},
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
            return "Bring " + 10 * level ** 3 + " crabs with you between worlds.";
        },
        prerequisites: ["apotheosis"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
        apply() {},
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
            return "Rays hunt fish " + 2 ** level * 2.5 + "x faster.";
        },
        prerequisites: ["pathOfIndustry"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
        apply() {},
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
        prerequisites: ["pathOfEnlightenment"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
        apply() {},
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
        prerequisites: ["pathOfIndustry"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
        apply() {},
    },
};

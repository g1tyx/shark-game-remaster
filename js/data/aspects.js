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
        posY: 380,
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
        posX: 490,
        posY: 250,
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
        posY: 250,
        width: 40,
        height: 40,

        max: 3,
        level: 0,
        name: "Path of Enlightenment",
        description: "Unlock the potential of yourself.",
        getCost(level) {
            return (level + 1) ** 2;
        },
        getEffect(level) {
            return "Gain " + level + " extra choice" + (level > 1 ? "s" : "") + " when choosing a world to visit.";
        },
        prerequisites: ["apotheosis"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
        apply() {},
    },
    patience: {
        posX: 380,
        posY: 150,
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
        posX: 270,
        posY: 250,
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
};

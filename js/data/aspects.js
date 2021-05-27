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
        eventSprite: true,
        icon: "haven-song",
        posX: 200,
        posY: 5,
        width: 400,
        height: 200,

        max: 1,
        level: 0,
        name: "Apotheosis",
        description: "Become unto a god.",
        getCost(_level) {
            return 0;
        },
        getEffect(level) {
            if (level > 0) {
                return "You've begun on your path, it is too late to look back now.";
            }
            return "You can do something with this essence...";
        },
        prerequisites: ["starterResources"],
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
        apply() {},
    },
    starterResources: {
        posX: 380,
        posY: 380,
        width: 40,
        height: 40,
        level: 0,

        max: 5,
        name: "Start Resources",
        description: "Remove some of that annoying early game",
        getCost(_level) {
            return 0;
        },
        getEffect(level) {
            return `level: ${level}`;
        },
        clicked(_event) {
            SharkGame.AspectTree.increaseLevel(this);
        },
        apply(_level) {},
        prerequisites: [],
    },
};

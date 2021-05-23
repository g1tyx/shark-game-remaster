/**
 * @type {Record<string, {
 *     requiredBy: string[] | undefined,
 *     posX: number,
 *     posY: number,
 *     level: number,
 *     prerequisites: string[],
 *     getCost(level: number): number,
 *     getEffect(level: number): string,
 *     apply(level): void
 * }>
 */
SharkGame.Artifacts = {
    apotheosis: {
        posX: 100,
        posY: 5,
        level: 0,
        description: "Become unto a god.",
        getCost(level) {
            if (level > 0) {
                return Infinity;
            }
            return 10;
        },
        getEffect(level) {
            if (level > 0) {
                return "You've begun on your path, it is too late to look back now.";
            }
            return "You can do something with this essence...";
        },
        prerequisites: [],
    },
    starterResources: {
        posX: 370,
        posY: 270,
        level: 0,

        name: "Start Resources",
        description: "Remove some of that annoying early game",
        getCost(_level) {
            return 100;
        },
        getEffect(level) {
            return `level: ${level}`;
        },
        apply(_level) {},
        prerequisites: ["apotheosis"],
    },
};

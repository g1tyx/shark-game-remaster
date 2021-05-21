// ideas for tech tree:
//
// 1. artifact that gives you starting resources
// 2. artifact that multiplies production at world start
// 3. implement failsafe for the migrator artifacts
// 4. multiplier for world-specific animals
// 5. make sharkonium cheaper
// 6. make recycler available earlier? nah save for NG+
// 7. make other things cheaper or whatever
// 8. something to make breeders more powerful
// 9. research team artifact or smth: science sharks make themselves more powerful using the affector table
// 10. increased essence gain
// 11. all manual buttons give stuff proportional to how much you produce a second of it. maybe bundle a slow autoclicker by changing button behavior
// 12. start with lab unlocked and 1 science shark
// 13. start with the grotto already researched
// 14. rechargeable time skips!
// 15. silly autoclicker maybe (maybe not)
// 16. patience (after doing 3 more worlds, you get double the amount you put in. price increases with each tier, can only purchase once per tier)
// 17. just one more: there's a chance that you'll get just one more of whatever you buy, each time you buy it. price works by buying exactly as much as you wanted to,
// then decide how many extra you get using a binomial distribution. displays a little +number when you get bonuses.
// 18. feeling lucky: maybe some sort of hilarious slot machine that you can play with your resources lmao
// 19. the sharkcade: just kidding (unless?)
// 20. golden sharks: golden sharks like golden cookies pop up on screen sometimes loool
// 21.
// 22.
// 23.
// 24.
// 25.
//
//
//
//
//
// supertechs (purchased with numen in NG+):
//
// 1. every fish makes sharks a little faster
// 2. every research costs half as much?
// 3. skip one/two worlds per tier (upgradeable?)
// 4. recompleting worlds gives the same rewards as beating for the first time
// 5. the recycler is unlocked. forever and always.
// 6. lucky 7s: every specialized resource is boosted by a factor of 7
// 7. harmless: harmful resources and negative world effects are less potent
// 8. nice weather out: all positive world effects are tripled.
// 9. extreme weather events: all world effects are sextupled.
//
SharkGame.Artifacts = {
    permanentMultiplier: {
        name: "Time Anemone",
        flavour: "As creatures dwell within the sea, so too do creatures dwell within causality.",
        max: 5,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiplies all income by 10x.";
            } else if (level > 0) {
                return (
                    `Multiplies all income by ${main.beautify(2 * level)}x` + (includeNext ? ` (${main.beautify(2 * level + 2)}x next level).` : ".")
                );
            } else {
                return "Multiplies all income by 2x.";
            }
        },
        cost(level) {
            return Math.floor(Math.pow(10, level + 1));
        },
        effect(level) {
            res.specialMultiplier = Math.max(2 * level, 1);
        },
    },
    gateCostReducer: {
        name: "Gate Controller",
        flavour: "Power over the unknown can only reach so far.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Reduces gate costs by 65.1%.";
            } else if (level > 0) {
                return (
                    `Reduces gate costs by ${main.beautify((1 - Math.pow(0.9, level)) * 100)}%` +
                    (includeNext ? " (" + main.beautify((1 - Math.pow(0.9, level + 1)) * 100) + "% next level)." : ".")
                );
            } else {
                return "Reduces gate costs by 10%.";
            }
        },
        cost(level) {
            return Math.floor(Math.pow(3, level + 1));
        },
        // effect is handled specially
        // check SharkGame.World.getGateCostMultiplier
    },
    planetScanner: {
        name: "Distant Foresight",
        flavour: "Knowledge may not change destiny, but it may divert it.",
        max: 5,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Reveals all of the properties of worlds before travelling to them.";
            } else if (level > 0) {
                return (
                    `Reveals ${main.beautify(20 * level)}%` +
                    (includeNext ? " (" + main.beautify(20 * level + 20) + "% next level)" : "") +
                    " of the properties of worlds before travelling to them."
                );
            } else {
                return "Reveals 20% of the properties of worlds before travelling to them.";
            }
        },
        cost(level) {
            return Math.floor(Math.pow(2, level));
        },
        // effect is handled specially
    },
    sharkMigrator: {
        name: "Shark Migrator",
        flavour: "Essence forges a barrier. Sharks are fragile between worlds.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Bring " + main.beautify(9765625) + " sharks with you to the next world.";
            } else if (level > 0) {
                return (
                    `Bring ${main.beautify(Math.pow(5, level))}` +
                    (includeNext ? ` (${main.beautify(Math.pow(5, level + 1))} next level)` : "") +
                    " sharks with you to the next world."
                );
            } else {
                return "Bring 5 sharks with you to the next world.";
            }
        },
        required: ["shark"],
        cost: SharkGame.ArtifactUtil.migratorCost,
        effect(level) {
            SharkGame.ArtifactUtil.migratorEffect(level, "shark");
        },
    },
    rayMigrator: {
        name: "Ray Migrator",
        flavour: "The gateway has no sand to hide in.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Bring " + main.beautify(9765625) + " rays with you to the next world.";
            } else if (level > 0) {
                return (
                    `Bring ${main.beautify(Math.pow(5, level))}` +
                    (includeNext ? " (" + main.beautify(Math.pow(5, level + 1)) + " next level)" : "") +
                    " rays with you to the next world."
                );
            } else {
                return "Bring 5 rays with you to the next world.";
            }
        },
        required: ["ray"],
        cost: SharkGame.ArtifactUtil.migratorCost,
        effect(level) {
            SharkGame.ArtifactUtil.migratorEffect(level, "ray");
        },
    },
    crabMigrator: {
        name: "Crab Migrator",
        flavour: "Essence-refined shells to keep the crabs alive.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Bring " + main.beautify(9765625) + " crabs with you to the next world.";
            } else if (level > 0) {
                return (
                    `Bring ${main.beautify(Math.pow(5, level))}` +
                    (includeNext ? " (" + main.beautify(Math.pow(5, level + 1)) + " next level)" : "") +
                    " crabs with you to the next world."
                );
            } else {
                return "Bring 5 crabs with you to the next world.";
            }
        },
        required: ["crab"],
        cost: SharkGame.ArtifactUtil.migratorCost,
        effect(level) {
            SharkGame.ArtifactUtil.migratorEffect(level, "crab");
        },
    },
    sharkTotem: {
        name: "Totem of Shark",
        flavour: "To hunt. To catch. To win.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiply the income of sharks and their roles by 10x.";
            } else if (level > 0) {
                return (
                    `Multiply the income of sharks and their roles by ${main.beautify(level + 1)}x` +
                    (includeNext ? ` (${main.beautify(level + 2)}x next level).` : ".")
                );
            } else {
                return "Multiply the income of sharks and their roles by 2x.";
            }
        },
        required: ["shark"],
        cost: SharkGame.ArtifactUtil.totemCost,
        effect(level) {
            SharkGame.ArtifactUtil.totemEffect(level, ["shark", "scientist", "nurse", "diver"], "sharkTotem");
        },
    },
    rayTotem: {
        name: "Totem of Ray",
        flavour: "Flying across the ocean in grace and serenity.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiply the income of rays and their roles by 10x.";
            } else if (level > 0) {
                return (
                    `Multiply the income of rays and their roles by ${main.beautify(level + 1)}x` +
                    (includeNext ? ` (${main.beautify(level + 2)}x next level).` : ".")
                );
            } else {
                return "Multiply the income of rays and their roles by 2x.";
            }
        },
        required: ["ray"],
        cost: SharkGame.ArtifactUtil.totemCost,
        effect(level) {
            SharkGame.ArtifactUtil.totemEffect(level, ["ray", "laser", "maker"], "rayTotem");
        },
    },
    crabTotem: {
        name: "Totem of Crab",
        flavour: "No stone left unturned.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiply the income of crabs and their roles by 10x.";
            } else if (level > 0) {
                return (
                    `Multiply the income of crabs and their roles by ${main.beautify(level + 1)}x` +
                    (includeNext ? ` (${main.beautify(level + 2)}x next level).` : ".")
                );
            } else {
                return "Multiply the income of crabs and their roles by 2x.";
            }
        },
        required: ["crab"],
        cost: SharkGame.ArtifactUtil.totemCost,
        effect(level) {
            SharkGame.ArtifactUtil.totemEffect(level, ["crab", "planter", "brood", "collector"], "crabTotem");
        },
    },
    progressTotem: {
        name: "Totem of Progress",
        flavour: "Progress can be slowed, but it can never be stopped.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiply the income of shark machines by 10x.";
            } else if (level > 0) {
                return (
                    `Multiply the income of shark machines by ${main.beautify(level + 1)}x` +
                    (includeNext ? ` (${main.beautify(level + 2)}x next level).` : ".")
                );
            } else {
                return "Multiply the income of shark machines by 2x.";
            }
        },
        cost: SharkGame.ArtifactUtil.totemCost,
        effect(level) {
            SharkGame.ArtifactUtil.totemEffect(
                level,
                ["fishMachine", "sandDigger", "autoTransmuter", "crystalMiner", "skimmer", "purifier", "heater"],
                "progressTotem"
            );
        },
    },
    wardingTotem: {
        name: "Totem of Warding",
        flavour: "The end is inevitable, but the wait can be lengthened.",
        max: 10,
        desc(_level, _includeNext) {
            return "Reduces the adverse effects of harmful materials.";
        },
        required: ["tar", "ice"],
        cost: SharkGame.ArtifactUtil.totemCost,
        effect(level) {
            if (level < 1) {
                return;
            }
            const resourceList = ["tar", "ice"];
            const worldResources = world.worldResources;
            const multiplier = 1 / (level + 1);
            _.each(resourceList, (resourceName) => {
                if (worldResources.get(resourceName).artifactMultiplier) {
                    worldResources.get(resourceName).artifactMultiplier *= multiplier;
                } else {
                    worldResources.get(resourceName).artifactMultiplier = multiplier;
                }
            });
        },
    },
};

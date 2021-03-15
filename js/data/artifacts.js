SharkGame.ArtifactUtil = {
    migratorCost(level) {
        return Math.floor(Math.pow(2, level));
    },
    migratorEffect(level, resourceName) {
        if (level < 1) {
            return;
        }
        const amount = Math.pow(5, level);
        // force existence
        w.forceExistence(resourceName);
        const res = r.getTotalResource(resourceName);
        if (res < amount) {
            r.changeResource(resourceName, amount);
        }
    },
    totemCost(level) {
        return Math.floor(Math.pow(2.5, level + 1));
    },
    totemEffect(level, resourceList, totemName) {
        if (level < 1) {
            return;
        }
        const wr = w.worldResources;
        const multiplier = level + 1;
        _.each(resourceList, (resourceName) => {
            if (wr.get(resourceName).artifactMultiplier) {
                wr.get(resourceName).artifactMultiplier *= multiplier;
            } else {
                wr.get(resourceName).artifactMultiplier = multiplier;
            }
            const incomes = SharkGame.ResourceMap.get(resourceName).income;
            $.each(incomes, (k, v) => {
                incomes[k] = v * multiplier;
            });
            SharkGame.ModifierMap.get(resourceName).artifact.multiplier[totemName] = level;
        });
    },
};

SharkGame.Artifacts = {
    permanentMultiplier: {
        name: "Time Anemone",
        flavour: "As creatures dwell within the sea, so too do creatures dwell within causality.",
        max: 5,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiplies all income by 10x.";
            } else if (level > 0) {
                return `Multiplies all income by ${m.beautify(2 * level)}x` + (includeNext ? ` (${m.beautify(2 * level + 2)}x next level).` : ".");
            } else {
                return "Multiplies all income by 2x.";
            }
        },
        cost(level) {
            return Math.floor(Math.pow(10, level + 1));
        },
        effect(level) {
            r.specialMultiplier = Math.max(2 * level, 1);
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
                    `Reduces gate costs by ${m.beautify((1 - Math.pow(0.9, level)) * 100)}%` +
                    (includeNext ? " (" + m.beautify((1 - Math.pow(0.9, level + 1)) * 100) + "% next level)." : ".")
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
                    `Reveals ${m.beautify(20 * level)}%` +
                    (includeNext ? " (" + m.beautify(20 * level + 20) + "% next level)" : "") +
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
                return "Bring " + m.beautify(9765625) + " sharks with you to the next world.";
            } else if (level > 0) {
                return (
                    `Bring ${m.beautify(Math.pow(5, level))}` +
                    (includeNext ? ` (${m.beautify(Math.pow(5, level + 1))} next level)` : "") +
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
                return "Bring " + m.beautify(9765625) + " rays with you to the next world.";
            } else if (level > 0) {
                return (
                    `Bring ${m.beautify(Math.pow(5, level))}` +
                    (includeNext ? " (" + m.beautify(Math.pow(5, level + 1)) + " next level)" : "") +
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
                return "Bring " + m.beautify(9765625) + " crabs with you to the next world.";
            } else if (level > 0) {
                return (
                    `Bring ${m.beautify(Math.pow(5, level))}` +
                    (includeNext ? " (" + m.beautify(Math.pow(5, level + 1)) + " next level)" : "") +
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
                    `Multiply the income of sharks and their roles by ${m.beautify(level + 1)}x` +
                    (includeNext ? ` (${m.beautify(level + 2)}x next level).` : ".")
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
                    `Multiply the income of rays and their roles by ${m.beautify(level + 1)}x` +
                    (includeNext ? ` (${m.beautify(level + 2)}x next level).` : ".")
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
                    `Multiply the income of crabs and their roles by ${m.beautify(level + 1)}x` +
                    (includeNext ? ` (${m.beautify(level + 2)}x next level).` : ".")
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
                    `Multiply the income of shark machines by ${m.beautify(level + 1)}x` +
                    (includeNext ? ` (${m.beautify(level + 2)}x next level).` : ".")
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
            const wr = w.worldResources;
            const multiplier = 1 / (level + 1);
            _.each(resourceList, (resourceName) => {
                if (wr.get(resourceName).artifactMultiplier) {
                    wr.get(resourceName).artifactMultiplier *= multiplier;
                } else {
                    wr.get(resourceName).artifactMultiplier = multiplier;
                }
            });
        },
    },
};

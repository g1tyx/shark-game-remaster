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
    totemEffect(level, resourceList) {
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
    planetTerraformer: {
        name: "World Shaper",
        flavour: "Intelligence is not changing to fit an environment, but changing the environment to fit you.",
        max: 10,
        desc(_level, _includeNext) {
            return;
        },
        cost(level) {
            return Math.floor(Math.pow(4, level + 1));
        },
        // effect is handled specially
        // check SharkGame.World.getTerraformMultiplier
        ignore: true,
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
    shrimpMigrator: {
        name: "Shrimp Migrator",
        flavour: "The hive produces a new hive.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Bring " + m.beautify(9765625) + " shrimp with you to the next world.";
            } else if (level > 0) {
                return (
                    `Bring ${m.beautify(Math.pow(5, level))}` +
                    (includeNext ? " (" + m.beautify(Math.pow(5, level + 1)) + " next level)" : "") +
                    " shrimp with you to the next world."
                );
            } else {
                return "Bring 5 shrimp with you to the next world.";
            }
        },
        required: ["shrimp"],
        cost: SharkGame.ArtifactUtil.migratorCost,
        effect(level) {
            SharkGame.ArtifactUtil.migratorEffect(level, "shrimp");
        },
    },
    lobsterMigrator: {
        name: "Lobster Migrator",
        flavour: "Relaxing in the astral seas.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Bring " + m.beautify(9765625) + " lobsters with you to the next world.";
            } else if (level > 0) {
                return (
                    `Bring ${m.beautify(Math.pow(5, level))}` +
                    (includeNext ? " (" + m.beautify(Math.pow(5, level + 1)) + " next level)" : "") +
                    " lobsters with you to the next world."
                );
            } else {
                return "Bring 5 lobsters with you to the next world.";
            }
        },
        required: ["lobster"],
        cost: SharkGame.ArtifactUtil.migratorCost,
        effect(level) {
            SharkGame.ArtifactUtil.migratorEffect(level, "lobster");
        },
    },
    dolphinMigrator: {
        name: "Dolphin Migrator",
        flavour: "They will find this transportation strangely familiar.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Bring " + m.beautify(9765625) + " dolphins with you to the next world.";
            } else if (level > 0) {
                return (
                    `Bring ${m.beautify(Math.pow(5, level))}` +
                    (includeNext ? " (" + m.beautify(Math.pow(5, level + 1)) + " next level)" : "") +
                    " dolphins with you to the next world."
                );
            } else {
                return "Bring 5 dolphins with you to the next world.";
            }
        },
        required: ["dolphin"],
        cost: SharkGame.ArtifactUtil.migratorCost,
        effect(level) {
            SharkGame.ArtifactUtil.migratorEffect(level, "dolphin");
        },
    },
    whaleMigrator: {
        name: "Whale Migrator",
        flavour: "They need no protection, only persuasion.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Bring " + m.beautify(9765625) + " whales with you to the next world.";
            } else if (level > 0) {
                return (
                    `Bring ${m.beautify(Math.pow(5, level))}` +
                    (includeNext ? " (" + m.beautify(Math.pow(5, level + 1)) + " next level)" : "") +
                    " whales with you to the next world."
                );
            } else {
                return "Bring 5 whales with you to the next world.";
            }
        },
        required: ["whale"],
        cost: SharkGame.ArtifactUtil.migratorCost,
        effect(level) {
            SharkGame.ArtifactUtil.migratorEffect(level, "whale");
        },
    },
    eelMigrator: {
        name: "Eel Migrator",
        flavour: "Essence tunnels for them to slide into a new domain.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Bring " + m.beautify(9765625) + " eels with you to the next world.";
            } else if (level > 0) {
                return (
                    `Bring ${m.beautify(Math.pow(5, level))}` +
                    (includeNext ? " (" + m.beautify(Math.pow(5, level + 1)) + " next level)" : "") +
                    " eels with you to the next world."
                );
            } else {
                return "Bring 5 eels with you to the next world.";
            }
        },
        required: ["eel"],
        cost: SharkGame.ArtifactUtil.migratorCost,
        effect(level) {
            SharkGame.ArtifactUtil.migratorEffect(level, "eel");
        },
    },
    chimaeraMigrator: {
        name: "Chimaera Migrator",
        flavour: "The light is unbearable. Essence dulls the brightness.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Bring " + m.beautify(9765625) + " chimaeras with you to the next world.";
            } else if (level > 0) {
                return (
                    `Bring ${m.beautify(Math.pow(5, level))}` +
                    (includeNext ? " (" + m.beautify(Math.pow(5, level + 1)) + " next level)" : "") +
                    " chimaeras with you to the next world."
                );
            } else {
                return "Bring 5 chimaeras with you to the next world.";
            }
        },
        required: ["chimaera"],
        cost: SharkGame.ArtifactUtil.migratorCost,
        effect(level) {
            SharkGame.ArtifactUtil.migratorEffect(level, "chimaera");
        },
    },
    octopusMigrator: {
        name: "Octopus Migrator",
        flavour: "The gateway defies reason. It is uncomfortable to the rational mind.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Bring " + m.beautify(9765625) + " octopuses with you to the next world.";
            } else if (level > 0) {
                return (
                    `Bring ${m.beautify(Math.pow(5, level))}` +
                    (includeNext ? " (" + m.beautify(Math.pow(5, level + 1)) + " next level)" : "") +
                    " octopuses with you to the next world."
                );
            } else {
                return "Bring 5 octopuses with you to the next world.";
            }
        },
        required: ["octopus"],
        cost: SharkGame.ArtifactUtil.migratorCost,
        effect(level) {
            SharkGame.ArtifactUtil.migratorEffect(level, "octopus");
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
            SharkGame.ArtifactUtil.totemEffect(level, ["shark", "scientist", "nurse", "diver"]);
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
            SharkGame.ArtifactUtil.totemEffect(level, ["ray", "laser", "maker"]);
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
            SharkGame.ArtifactUtil.totemEffect(level, ["crab", "planter", "brood"]);
        },
    },
    shrimpTotem: {
        name: "Totem of Shrimp",
        flavour: "The hive mind awakens.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiply the income of shrimp and their roles by 10x.";
            } else if (level > 0) {
                return (
                    `Multiply the income of shrimp and their roles by ${m.beautify(level + 1)}x` +
                    (includeNext ? ` (${m.beautify(level + 2)}x next level).` : ".")
                );
            } else {
                return "Multiply the income of shrimp and their roles by 2x.";
            }
        },
        required: ["shrimp"],
        cost: SharkGame.ArtifactUtil.totemCost,
        effect(level) {
            SharkGame.ArtifactUtil.totemEffect(level, ["shrimp", "worker", "queen"]);
        },
    },
    lobsterTotem: {
        name: "Totem of Lobster",
        flavour: "The seabed is a priceless treasure.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiply the income of lobsters and their roles by 10x.";
            } else if (level > 0) {
                return (
                    `Multiply the income of lobsters and their roles by ${m.beautify(level + 1)}x` +
                    (includeNext ? ` (${m.beautify(level + 2)}x next level).` : ".")
                );
            } else {
                return "Multiply the income of lobsters and their roles by 2x.";
            }
        },
        required: ["lobster"],
        cost: SharkGame.ArtifactUtil.totemCost,
        effect(level) {
            SharkGame.ArtifactUtil.totemEffect(level, ["lobster", "berrier", "harvester"]);
        },
    },
    dolphinTotem: {
        name: "Totem of Dolphin",
        flavour: "Exiles of a greater threat.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiply the income of dolphins and their roles by 10x.";
            } else if (level > 0) {
                return (
                    `Multiply the income of dolphins and their roles by ${m.beautify(level + 1)}x` +
                    (includeNext ? ` (${m.beautify(level + 2)}x next level).` : ".")
                );
            } else {
                return "Multiply the income of dolphins and their roles by 2x.";
            }
        },
        required: ["dolphin"],
        cost: SharkGame.ArtifactUtil.totemCost,
        effect(level) {
            SharkGame.ArtifactUtil.totemEffect(level, ["dolphin", "philosopher", "biologist", "treasurer"]);
        },
    },
    whaleTotem: {
        name: "Totem of Whale",
        flavour: "Keepers of song and mystery.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiply the income of whales by 10x.";
            } else if (level > 0) {
                return (
                    `Multiply the income of whales by ${m.beautify(level + 1)}x` + (includeNext ? ` (${m.beautify(level + 2)}x next level).` : ".")
                );
            } else {
                return "Multiply the income of whales by 2x.";
            }
        },
        required: ["whale"],
        cost: SharkGame.ArtifactUtil.totemCost,
        effect(level) {
            SharkGame.ArtifactUtil.totemEffect(level, ["whale"]);
        },
    },
    eelTotem: {
        name: "Totem of Eel",
        flavour: "Snaking elegance, talented attendants.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiply the income of eels and their roles by 10x.";
            } else if (level > 0) {
                return (
                    `Multiply the income of eels and their roles by ${m.beautify(level + 1)}x` +
                    (includeNext ? ` (${m.beautify(level + 2)}x next level).` : ".")
                );
            } else {
                return "Multiply the income of eels and their roles by 2x.";
            }
        },
        required: ["eel"],
        cost: SharkGame.ArtifactUtil.totemCost,
        effect(level) {
            SharkGame.ArtifactUtil.totemEffect(level, ["eel", "sifter", "pit", "technician"]);
        },
    },
    chimaeraTotem: {
        name: "Totem of Chimaera",
        flavour: "The prodigal descendants return.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiply the income of chimaeras and their roles by 10x.";
            } else if (level > 0) {
                return (
                    `Multiply the income of chimaeras and their roles by ${m.beautify(level + 1)}x` +
                    (includeNext ? ` (${m.beautify(level + 2)}x next level).` : ".")
                );
            } else {
                return "Multiply the income of chimaeras and their roles by 2x.";
            }
        },
        required: ["chimaera"],
        cost: SharkGame.ArtifactUtil.totemCost,
        effect(level) {
            SharkGame.ArtifactUtil.totemEffect(level, ["chimaera", "transmuter", "explorer"]);
        },
    },
    octopusTotem: {
        name: "Totem of Octopus",
        flavour: "The cold, rational response is to maximise rewards.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiply the income of octopuses and their roles by 10x.";
            } else if (level > 0) {
                return (
                    `Multiply the income of octopuses and their roles by ${m.beautify(level + 1)}x` +
                    (includeNext ? ` (${m.beautify(level + 2)}x next level).` : ".")
                );
            } else {
                return "Multiply the income of octopuses and their roles by 2x.";
            }
        },
        required: ["octopus"],
        cost: SharkGame.ArtifactUtil.totemCost,
        effect(level) {
            SharkGame.ArtifactUtil.totemEffect(level, ["octopus", "collector", "scavenger"]);
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
            SharkGame.ArtifactUtil.totemEffect(level, [
                "fishMachine",
                "sandDigger",
                "autoTransmuter",
                "crystalMiner",
                "skimmer",
                "purifier",
                "heater",
            ]);
        },
    },
    carapaceTotem: {
        name: "Totem of Carapace",
        flavour: "The shelled machines are slow, but clean.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiply the income of crustacean machines by 10x.";
            } else if (level > 0) {
                return (
                    `Multiply the income of crustacean machines by ${m.beautify(level + 1)}x ` +
                    (includeNext ? " (" + m.beautify(level + 2) + "x next level)." : ".")
                );
            } else {
                return "Multiply the income of crustacean machines by 2x.";
            }
        },
        required: ["shrimp", "lobster"],
        cost: SharkGame.ArtifactUtil.totemCost,
        effect(level) {
            SharkGame.ArtifactUtil.totemEffect(level, ["spongeFarmer", "berrySprayer", "glassMaker"]);
        },
    },
    inspirationTotem: {
        name: "Totem of Inspiration",
        flavour: "Dreams of a former glory.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiply the income of cetacean machines by 10x.";
            } else if (level > 0) {
                return (
                    `Multiply the income of cetacean machines by ${m.beautify(level + 1)}x` +
                    (includeNext ? " (" + m.beautify(level + 2) + "x next level)." : ".")
                );
            } else {
                return "Multiply the income of cetacean machines by 2x.";
            }
        },
        required: ["dolphin"],
        cost: SharkGame.ArtifactUtil.totemCost,
        effect(level) {
            SharkGame.ArtifactUtil.totemEffect(level, ["silentArchivist", "tirelessCrafter"]);
        },
    },
    industryTotem: {
        name: "Totem of Industry",
        flavour: "Find unity in efficiency. Seek octal rationalities.",
        max: 10,
        desc(level, includeNext) {
            if (level === "Max") {
                return "Multiply the income of cephalopod machines by 10x.";
            } else if (level > 0) {
                return (
                    `Multiply the income of cephalopod machines by ${m.beautify(level + 1)}x` +
                    (includeNext ? " (" + m.beautify(level + 2) + "x next level)." : ".")
                );
            } else {
                return "Multiply the income of cephalopod machines by 2x.";
            }
        },
        required: ["octopus"],
        cost: SharkGame.ArtifactUtil.totemCost,
        effect(level) {
            SharkGame.ArtifactUtil.totemEffect(level, ["clamCollector", "sprongeSmelter", "seaScourer", "prostheticPolyp"]);
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

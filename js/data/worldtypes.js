SharkGame.WorldTypes = {
    test: {
        name: "Test",
        desc: "You REALLY shouldn't be seeing this.",
        shortDesc: "testing",
        entry: "You enter a debug ocean.",
        style: "default",
        absentResources: [],
        modifiers: [],
        gateRequirements: {
            slots: {
                fish: 1e3,
                sand: 1e3,
                crystal: 1e3,
                kelp: 1e3,
                seaApple: 1e3,
                sharkonium: 1e3,
            },
        },
    },
    start: {
        name: "Home",
        desc: "...",
        shortDesc: "strange blue",
        foresight: {
            longDesc: "...Home.",
            missing: [],
            present: [],
            tip: "...",
        },
        entry: "You enter a familiar blue sea, all your previous knowledge a dim memory.",
        style: "default",
        includedResources: ["sharks", "rays", "crabs", "basicmaterials", "kelpstuff", "sharkmachines", "essence", "world"],
        modifiers: [],
        // initial gate cost, scaled by planetary level
        gateRequirements: {
            slots: {
                fish: 1e7,
                sand: 1e6,
                crystal: 1e6,
                kelp: 1e5,
                seaApple: 1e5,
                sharkonium: 1e6,
            },
        },
    },
    marine: {
        name: "Marine",
        desc: "A serene blue world. Peaceful, beautiful, so close to home.",
        shortDesc: "strange blue",
        entry: "You enter a familiar blue sea, all your previous knowledge a dim memory.",
        style: "default",
        /* includedResources: [
            "sharks",
            "rays",
            "crabs",
            "lobsters",
            "shrimps",
            "basicmaterials",
            "kelpstuff",
            "sharkmachines",
            "crustaceanmachines",
            "coral",
            "
        ], */
        absentResources: ["tar", "ice", "heater", "shrimp", "chimaera", "eel", "jellyfish"],
        modifiers: [{ type: "multiplier", modifier: "planetaryResourceBoost", resource: "fish", amount: 1.5 }],
        gateRequirements: {
            slots: {
                fish: 1e9,
                sand: 1e7,
                crystal: 1e7,
                kelp: 1e7,
                seaApple: 1e6,
                sharkonium: 1e6,
            },
        },
    },
    haven: {
        name: "Haven",
        desc: "An aquamarine world of plenty. So beautiful, yet so vulnerable.",
        shortDesc: "thriving aquamarine",
        foresight: {
            longDesc:
                "This world is teeming with life, more than any other place you've seen before. The water is clear, the sand is clean, the fish are plenty. A paradise in every way.",
            missing: ["laser", "sharkonium"],
            present: ["coral", "dolphin", "whale"],
            tip: "The abudance of resources might may your stay here shorter than others.",
        },
        entry: "Remembering nothing, you find yourself in a beautiful atoll. Life will be good here.",
        style: "haven",
        includedResources: [
            "essence",
            "sharks",
            "rays",
            "crabs",
            "dolphins",
            "whales",
            "basicmaterials",
            "kelpstuff",
            "dolphinmachines",
            "coral",
            "chorus",
            "essence",
            "world",
        ],
        absentResources: ["laser"],
        modifiers: [
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "breeders", amount: 1 },
            { type: "multiplier", modifier: "planetaryResourceBoost", resource: "fish", amount: 1 },
        ],
        gateRequirements: { resources: { chorus: 1 } },
    },
    tempestuous: {
        name: "Tempestuous",
        desc: "A swirling maelstrom of storms where nothing rests.",
        shortDesc: "stormy grey",
        entry: "You recall nothing and know only the storms. The unrelenting, restless storms scattering your possessions and allies.",
        style: "tempestuous",
        /* includedResources: [
            "sharks",
            "rays",
            "crabs",
            "basicmaterials",
            "kelpstuff",
            "sharkmachines",
        ], */
        modifiers: [
            { type: "multiplier", modifier: "planetaryIncome", resource: "sand", amount: -0.5 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "kelp", amount: -0.5 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "coral", amount: -0.1 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "algae", amount: -1 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "frenzy", amount: -0.001 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "specialists", amount: -0.0005 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "breeders", amount: -0.0005 },
            { type: "multiplier", modifier: "planetaryResourceBoost", resource: "stuff", amount: 0.5 },
        ],
        gateRequirements: {
            slots: {
                junk: 1e9,
                coral: 5e7,
                spronge: 1e6,
                delphinium: 1e6,
                sharkonium: 1e6,
                crystal: 5e7,
            },
        },
    },
    violent: {
        name: "Violent",
        desc: "An ocean close to boiling and choking under sulphuric fumes.",
        shortDesc: "searing red",
        entry: "The burning waters sear the last traces of your past experiences from you. From beneath, the vents spew forth a heavy cloud of sand.",
        style: "violent",
        /* includedResources: [
            "sharks",
            "rays",
            "crabs",
            "shrimps",
            "basicmaterials",
            "kelpstuff",
            "sharkmachines",
            "sponge",
            "algae",
        ], */
        modifiers: [
            { type: "multiplier", modifier: "planetaryIncomeReciprocalMultiplier", resource: "breeders", amount: 1 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "sand", amount: 1 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "kelp", amount: 0.1 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "coral", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncome", resource: "algae", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryResourceBoost", resource: "sand", amount: 1 },
            { type: "multiplier", modifier: "planetaryResourceBoost", resource: "kelp", amount: 1 },
            { type: "multiplier", modifier: "planetaryResourceBoost", resource: "algae", amount: 1 },
        ],
        gateRequirements: {
            slots: {
                sand: 1e8,
                kelp: 5e6,
                coral: 1e7,
                algae: 5e7,
                sponge: 5e6,
                junk: 1e8,
            },
        },
    },
    abandoned: {
        name: "Abandoned",
        desc: "A dying world filled with machinery.",
        shortDesc: "murky dark green",
        foresight: {
            get longDesc() {
                return (
                    "The water here is dank and tinted green by " +
                    (gateway.completedWorlds.indexOf("abandoned") > -1 ? sharktext.getResourceName("tar") + "." : "an unrecognizable substance.") +
                    " Husks of machinery litter the ocean floor."
                );
            },
            missing: ["seaApple", "kelp"],
            present: ["octopus", "sponge", "clam", "tar"],
            get tip() {
                return (
                    "This ocean is polluted with " +
                    (gateway.completedWorlds.indexOf("abandoned") > -1
                        ? sharktext.getResourceName("tar")
                        : "an unrecognizable substance" + ". It is only harmful when machines produce it.")
                );
            },
        },
        entry: "You do not know who left this world so torn and empty. Was it some predecessor of yours? Was it you yourself?",
        style: "abandoned",
        absentResources: [
            "ice",
            "heater",
            "shrimp",
            "chimaera",
            "eel",
            "jellyfish",
            "algae",
            "whale",
            "dolphin",
            "lobster",
            "coral",
            "kelp",
            "seaApple",
            "planter",
            "autoTransmuter",
        ],
        modifiers: [
            {
                type: "restriction",
                modifier: "planetaryGeneratorRestriction",
                resource: "sponge",
                amount: "sponge",
            },
            { type: "multiplier", modifier: "planetaryIncome", resource: "tar", amount: -0.02 },
        ],
        gateRequirements: { upgrades: ["artifactAssembly"] },
    },
    shrouded: {
        name: "Shrouded",
        desc: "A dark, murky ocean of secrecy.",
        foresight: {
            get longDesc() {
                return "It's hard to see more than 10 feet in this place, let alone manage a frenzy. Glowing crystals litter the water, though, so it's never completely dark.";
            },
            missing: ["kelp", "crab", "laser"],
            present: ["jellyfish", "chimaera", "eel"],
        },
        shortDesc: "dark mysterious",
        entry: "Blackness. You know only blindness in these dark forsaken waters. Foggy memory leads you to follow a stream of crystals.",
        style: "shrouded",
        includedResources: [
            "essence",
            "sharks",
            "diver",
            "rays",
            "eels",
            "chimaeras",
            "basicmaterials",
            "sharkmachines",
            "arcana",
            "scholar",
            "jellyfish",
            "sacrifice",
        ],
        absentResources: ["laser"],
        modifiers: [{ type: "multiplier", modifier: "planetaryIncomeReciprocalMultiplier", resource: "scientist", amount: 1 }],
        gateRequirements: {
            upgrades: ["arcaneActivation"],
        },
    },
    frigid: {
        name: "Frigid",
        desc: "An arctic ocean dangling on the edge of frozen doom.",
        shortDesc: "freezing white",
        foresight: {
            longDesc: "This world is mostly frozen, but a small pocket of warmer water seems to preserve what little chance life has here.",
            missing: ["seaApple", "ray"],
            present: ["squid", "urchin"],
            get tip() {
                return (
                    "This world has " +
                    sharktext.getResourceName("ice") +
                    ". " +
                    sharktext.getResourceName("ice") +
                    " will slow some of the frenzy, and will be present from the start."
                );
            },
        },
        entry: "The arctic water freezes away whatever thoughts you may have had. So cold.",
        style: "frigid",
        includedResources: ["sharks", "crabs", "squids", "urchins", "basicmaterials", "kelp", "sharkmachines", "ice", "heater", "essence", "world"],
        modifiers: [
            {
                type: "multiplier",
                modifier: "planetaryIncome",
                resource: "ice",
                get amount() {
                    return 1 / main.getProgressionConstant();
                },
            },
        ],
        gateRequirements: {
            slots: {
                sand: 1e7,
                crystal: 1e7,
                kelp: 5e7,
                heater: 40,
                sharkonium: 1e6,
                fish: 2e8,
            },
        },
    },
    template: {
        name: "",
        desc: "description in gateway",
        shortDesc: "status",
        entry: "enter world",
        style: "default",
        absentResources: ["knowledge", "tar", "ice", "heater", "chimaera"],
        modifiers: [{ type: "multiplier", modifier: "planetaryResourceBoost", resource: "fish", amount: 1.5 }],
        gateType: "slots",
        gateCosts: {
            fish: 1,
            sand: 1,
            crystal: 1,
            kelp: 1,
            seaApple: 1,
            sharkonium: 1,
        },
    },
    stone: {
        name: "Stone",
        desc: "A world unweathered by ocean currents. It has no natural sand.",
        shortDesc: "rock-bottom",
        entry: "As you enter, the usual shades of green and yellow are nowhere to be found. You look down, and there's no sand: just cold, hard slate.",
        style: "default",
        absentResources: [
            "knowledge",
            "tar",
            "ice",
            "heater",
            "chimaera",
            "dolphin",
            "kelp",
            "coral",
            "eel",
            "sandDigger",
            "treasurer",
            "philosopher",
            "jellyfish",
        ],
        modifiers: [
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "sponge", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "shrimp", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "worker", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "clamCollector", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "eggBrooder", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "sprongeSmelter", amount: 0.5 },
            { type: "multiplier", modifier: "planetaryIncomeMultiplier", resource: "ray", amount: 5 },
            { type: "restriction", modifier: "planetaryGeneratorRestriction", resource: "ray", amount: "sand" },
            {
                type: "restriction",
                modifier: "planetaryGeneratorRestriction",
                resource: "lobster",
                amount: "sand",
            },
            {
                type: "restriction",
                modifier: "planetaryGeneratorRestriction",
                resource: "scavenger",
                amount: "sand",
            },
        ],
        gateType: "slots",
        gateCosts: {
            gravel: 1e9,
            sand: 1e6,
            crystal: 1e8,
            pulverizer: 2,
            sponge: 1e9,
            clam: 1e7,
        },
    },
};

// TODO: separate upgrades?
// NAMES, EFFECTS, DESCRIPTIONS, IF THEY EXIST, COSTS, PREREQUISITES
// names will remain constant
// effects vary with what is or isn't in the world
// this is hard
// i cant tell if i'll need to just make separate, independent lists
// i probably will
// but that's for later

// my end conclusion is that I will certainly be putting upgrades into individual lists,
// separated by world type. therefore every world gets its own upgrade progression individually,
// so I can closely monitor and control the progression in every world, have individual and unique
// descriptions and names and effects, and have the progression of each species vary by world.

// Wouldn't it make more sense to have effects just depend on world type then, instead of making
// three or more near-if-not-comletely-identical entries?
SharkGame.Upgrades = {
    purchased: [],
    /**
     * @type Record<string, Record<string, any>>
     * Generated cache on-demand
     */
    generated: {},

    /** @param worldType {string} */
    getUpgradeTable(worldType = w.worldType) {
        if (typeof SharkGame.Upgrades[worldType] !== "object") {
            // This world type doesn't have any special upgrades, so use the default ones.
            // We don't want to generate the same upgrade table multiple times for no reason.
            worldType = "default";
        }
        if (!_.has(SharkGame.Upgrades.generated, worldType)) {
            return (SharkGame.Upgrades.generated[worldType] = SharkGame.Upgrades.generateUpgradeTable(worldType));
        }
        return SharkGame.Upgrades.generated[worldType];
    },

    /** @param worldType {string} */
    generateUpgradeTable(worldType = w.worldType) {
        const upgradeTable = _.cloneDeep(SharkGame.Upgrades.default);

        // Check if world type has modifications
        if (_.has(SharkGame.Upgrades, worldType)) {
            const worldMods = _.cloneDeep(SharkGame.Upgrades[worldType]);

            // Delete non-existing upgrades from world
            for (const upgrade in upgradeTable) {
                if (!_.has(worldMods, upgrade)) {
                    delete upgradeTable[upgrade];
                }
            }

            // Apply world-specific modifications
            for (const upgrade in worldMods) {
                if (_.has(upgradeTable, upgrade)) {
                    // If upgrade exists in both, it's just a modification
                    _.assign(upgradeTable[upgrade], worldMods[upgrade]);
                } else {
                    // Otherwise, it's a world-specific upgrade and needs to be added
                    upgradeTable[upgrade] = worldMods[upgrade];
                }
            }
        }
        return upgradeTable;
    },
    default: {
        crystalBite: {
            name: "Crystal Bite-Gear",
            desc: "Bite the crystals we have into something to help biting!",
            researchedMessage: "Weird teeth-wear has been developed, and sharks can now catch fish better as a result.",
            effectDesc: "Sharks are twice as effective with their new biting gear. Turns out they work better outside the mouth!",
            cost: {
                science: 50,
                fish: 10,
                crystal: 5,
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                },
            },
        },
        crystalSpade: {
            name: "Crystal Spades",
            desc: "Fashion strange harness-tools for the rays.",
            researchedMessage: "The rays can now bother the sand more effectively, and dig up more sand now!",
            effectDesc: "Rays are twice as effective with their specially adapted digging tools.",
            cost: {
                science: 50,
                sand: 20,
                crystal: 5,
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        crystalContainer: {
            name: "Crystal Containers",
            desc: "Make weird bottle things from the crystals we have. Maybe useful??",
            researchedMessage: "Well, things can go into these containers that aren't water. This makes science easier!",
            effectDesc: "Scientists are twice as effective at making with the science.",
            cost: {
                science: 100,
                crystal: 50,
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                },
            },
        },
        statsDiscovery: {
            name: "Storage Caverns",
            desc: "It's about time to start moving the stores we have to a better place. We've found one but it needs setting up.",
            researchedMessage:
                "All the goods we've acquired are now being stored and itemised in a mostly flooded cavern system. We're organized! Sort of!",
            effectDesc: "By storing things in a centralised location, we now finally have an idea of what we're doing...sort of.",
            cost: {
                science: 150,
            },
            required: {
                upgrades: ["crystalContainer"],
            },
        },
        underwaterChemistry: {
            name: "Underwater Chemistry",
            desc: "With the weird bottles, we can now put things and other things into them and see what happens.",
            researchedMessage: "Well, nothing useful was determined, but if we keep on doing it we make tremendous leaps for science!",
            effectDesc: "Scientists are twice as effective with their new chemical insights.",
            cost: {
                science: 200,
                crystal: 50,
            },
            required: {
                upgrades: ["crystalContainer"],
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                },
            },
        },
        seabedGeology: {
            name: "Seabed Geology",
            desc: "Study the bottom of the ocean to determine the rich, deep, juicy secrets it contains.",
            researchedMessage: "Not only did we find a whole bunch of weird things, the rays found that there was more sand!",
            effectDesc: "Rays are twice as effective with their understanding of the seabed and its varieties of sediment.",
            cost: {
                science: 250,
                sand: 250,
            },
            required: {
                upgrades: ["crystalContainer"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        thermalVents: {
            name: "Thermal Vents",
            desc: "Investigate the boiling vents that just seem to keep on heating things up.",
            researchedMessage: "This is a wondrous, unending source of heat! Something good must come from this.",
            effectDesc: "A power source for future technologies has been discovered.",
            cost: {
                science: 300,
                sand: 500,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        laserRays: {
            name: "Laser Rays",
            desc: "Using arcane shark mystery science, capture the heat of the vents for use by rays.",
            researchedMessage: "The rays can now be granted gear that will let them fuse sand into crystal! Future!",
            effectDesc: "Laser rays can now be geared up to burn the very sand to glassy crystal.",
            cost: {
                science: 100,
                sand: 2000,
                crystal: 100,
            },
            required: {
                upgrades: ["thermalVents"],
            },
        },
        transmutation: {
            name: "Transmutation",
            desc: "By heating things up and doing science things to them, maybe new things can be made!",
            researchedMessage: "A new form of material has been discovered! It has been named after its discoverer, Dr. Sharkonium.",
            effectDesc: "Enables transmutation of some random junk we have lying around into sharkonium, material of the future.",
            cost: {
                science: 1000,
                crystal: 2000,
                sand: 4000,
            },
            required: {
                upgrades: ["thermalVents", "underwaterChemistry"],
            },
        },
        automation: {
            name: "Automation",
            desc: "Using sharkonium, we can make things to do things so we don't have to do the things!",
            researchedMessage: "Now we don't have to do all the work, machines can do it for us! Future!!",
            effectDesc: "Machines can be built to supplement population duties. This is efficient.",
            cost: {
                science: 1500,
                sharkonium: 250,
            },
            required: {
                upgrades: ["transmutation"],
            },
        },
        engineering: {
            name: "Engineering",
            desc: "The machines sort of suck. Let's make them better by learning how!",
            researchedMessage: "The machines are twice as good now! We've figured out new designs in the process, too!",
            effectDesc: "Machines are twice as effective. Skimmers and auto-transmuters are now possible to create.",
            cost: {
                science: 2500,
                sharkonium: 1750,
            },
            required: {
                upgrades: ["automation"],
                seen: ["fishMachine", "crystalMiner", "sandDigger"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                },
            },
        },
        recyclerDiscovery: {
            name: "Recycler",
            desc: "Devise a system of pulverising unwanted resources into a component paste, and reusing them as something else.",
            researchedMessage:
                "Well this thing is frankly terrifying. I wouldn't swim anywhere near the input holes if I were you. Maybe it'll help though!",
            effectDesc: "Allows recycling of materials by virtue of a horrifying mechanical maw that consumes all that ventures near it. Future?",
            cost: {
                science: 5000,
                sharkonium: 5000,
            },
            required: {
                upgrades: ["engineering"],
            },
        },
        iterativeDesign: {
            name: "Iterative Design",
            desc: "The machines are useful, but they could be better. Maybe it's time we started over?",
            researchedMessage: "As it turns out, science is about learning from mistakes, or so the scientists say. About their own mistakes.",
            effectDesc: "All shark machines run twice as fast. Again!",
            cost: {
                science: 15000,
                sharkonium: 17500,
            },
            required: {
                upgrades: ["engineering"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                    autoTransmuter: 2,
                    skimmer: 2,
                    heater: 2,
                    scientist: 4,
                },
            },
        },
        superprocessing: {
            name: "Superprocessing",
            desc:
                "The recycler wasn't really meant for millions of fish at once. Seeing as that transaction is fairly common, we should probably do something about it.",
            researchedMessage: "Eureka! If we make the big things bigger, and the grinders grindier, we can process way more material at once!",
            effectDesc:
                "The recycler's efficiency only starts dropping at 10 million material inserted at once, instead of 100 thousand. The base efficiency is now 100%.",
            cost: {
                science: 1e6,
                sharkonium: 1e6,
                junk: 1e6,
            },
            required: {
                upgrades: ["iterativeDesign", "recyclerDiscovery"],
            },
        },
        agriculture: {
            name: "Agriculture",
            desc: "The hunter-gatherer lifestyle will only work so well for us. Maybe we should gather these animals in one place and let them grow.",
            researchedMessage: "It is so much easier to get things when they're all in one place. It's like the ocean is our grotto now!",
            effectDesc: "Various roles are twice as effective thanks to farming regions for coral and sponge.",
            cost: {
                science: 500,
                sand: 1000,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        kelpHorticulture: {
            name: "Kelp Horticulture",
            desc: "Determine what it takes to plant kelp all over the seabed. Maybe this is useful.",
            researchedMessage: "Crab-specific gear has been invented to allow for kelp farming! This is possibly useful.",
            effectDesc: "Crabs can become kelp farmers and grow a living carpet across the bottom of the sea.",
            cost: {
                science: 1000,
                sand: 2000,
            },
            required: {
                upgrades: ["agriculture"],
                resources: ["kelp"],
            },
        },
        biology: {
            name: "Biology",
            desc: "What is a shark? What is inside a shark, except for large amounts of fish?",
            researchedMessage: "With a new understanding of their own biology, sharks can now specialise in the manufacture of new sharks.",
            effectDesc: "Sharks are twice as effective. Did you know shark eggs don't actually form just because a shark wills them to exist?",
            cost: {
                science: 400,
            },
            required: {
                upgrades: ["underwaterChemistry", "agriculture"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                },
            },
        },
        xenobiology: {
            name: "Xenobiology",
            desc: "Determine what is with these weird faceless creatures we keep finding.",
            researchedMessage: "Results inconclusive! Further research required. It could be such a benefit for science!",
            effectDesc:
                "Kelp produces sea apples twice as fast. Also, sea apple isn't a fruit. We can also dissect sea apples and jellyfish for science.",
            cost: {
                science: 600,
            },
            required: {
                upgrades: ["agriculture"],
                resources: ["seaApple", "jellyfish"],
                seen: ["seaApple", "jellyfish"],
            },
            effect: {
                incomeMultiplier: {
                    kelp: 2,
                },
            },
        },
        rayBiology: {
            name: "Ray Biology",
            desc: "Though kindred to the sharks, we know so little about the rays. If only we could fix this. We need to bait a sand trap.",
            researchedMessage:
                "Apparently we could have just asked. We learned how rays make more rays. It's kinda similar to sharks, really, but rays.",
            effectDesc:
                "Rays and laser rays are twice as effective. We may never repair the shark-ray relations to their former state after how awkward this whole affair was.",
            cost: {
                science: 700,
                sand: 600,
            },
            required: {
                upgrades: ["biology", "laserRays"],
                seen: ["kelp"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                    laser: 2,
                },
            },
        },
        crabBiology: {
            name: "Crab Biology",
            desc: "Crabs are a mystery. They keep to themselves and dig up crystals or put down plants. What is even up with that? What ARE crabs??",
            researchedMessage:
                "It turns out crabs are friendly crustaceans that have revealed to the sharks the secrets of crab generation. It involves eggs, or something. Squirmy eggs.",
            effectDesc:
                "Crabs and planter crabs are four and two times as effective, respectively. Crabs are alright but they are also sort of terrifying and weird. Good thing they're on our side!",
            cost: {
                science: 500,
                kelp: 100,
            },
            required: {
                upgrades: ["biology", "sunObservation"],
                resources: ["crab"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    planter: 2,
                },
            },
        },
        sunObservation: {
            name: "Sun Observation",
            desc: "We must determine what is with the weird glare on the surface of the water.",
            researchedMessage: "Shark science has discovered the sun! It has also discovered that looking directly into the sun hurts.",
            effectDesc:
                "Planter crabs are twice as effective. Is a suns worth many fish? We can see a sun, but where is it really? And what is it made of?",
            cost: {
                science: 5000,
            },
            required: {
                upgrades: ["agriculture"],
            },
            effect: {
                incomeMultiplier: {
                    planter: 2,
                },
            },
        },
        exploration: {
            name: "Exploration",
            desc: "Swim beyond the home seas to see what can be found!",
            researchedMessage: "Found lots of schools of fish! So many different schools! And such untapped sand reserves!",
            effectDesc: "Sharks and rays are twice as effective. Did you know oceans are big? Fascinating!",
            cost: {
                science: 5000,
                fish: 5000,
            },
            required: {
                upgrades: ["sunObservation"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                    ray: 2,
                },
            },
        },
        farExploration: {
            name: "Far Exploration",
            desc: "Explore the vast reaches beyond the home ocean.",
            researchedMessage: "Crystal-rich deposits were found, as well as strange, deep chasms.",
            effectDesc: "Crabs are four times as effective. Did you know oceans are actually even bigger than big? Remarkable!",
            cost: {
                science: 8000,
                fish: 15000,
            },
            required: {
                upgrades: ["exploration"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                },
            },
        },
        gateDiscovery: {
            name: "Chasm Exploration",
            desc: "A campaign of risky, foolhardy expeditions to the deeps, to find whatever can be found.",
            researchedMessage: "A strange structure was found from clues within the chasms. The cost was great, but the discovery is greater!",
            effectDesc: "Something ancient lurked in the depths.",
            cost: {
                science: 1e6,
                shark: 1000,
                fish: 50000,
            },
            required: {
                upgrades: ["farExploration"],
            },
        },
    },
    abandoned: {
        // Unless upgrade is defined here, it won't exist on the world
        // hence the empty objects
        crystalBite: {},
        crystalSpade: {},
        crystalContainer: {},
        statsDiscovery: { cost: { science: 75 } },
        underwaterChemistry: {},
        seabedGeology: {},
        thermalVents: {},
        clamScooping: {
            name: "Clam Scooping",
            desc: "We see these things all over the seabed but we can't tell which are clams and which are rocks.",
            researchedMessage:
                "Patient observation has shown that clams and rocks are in fact different and distinct things. Now we won't be scooping up any more rocks!",
            effectDesc: "Clams can be collected like fish.",
            cost: {
                science: 150,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        laserRays: {},
        transmutation: {
            cost: {
                science: 1500,
                crystal: 1750,
            },
        },
        spongeCollection: {
            name: "Sponge Collection",
            desc: "We can see these things littering the reefs and beds, but only the octopuses know how to collect them without breaking them.",
            researchedMessage:
                "Understanding the fragile nature of sponges and their weird porous texture, we can now collect sponges by not biting so hard.",
            effectDesc: "Sponge can be collected in the same way fish can be.",
            cost: {
                science: 888,
            },
            required: {
                upgrades: ["octopusMethodology"],
            },
        },
        industrialGradeSponge: {
            name: "Industrial-Grade Sponge",
            desc: "Our octopus contacts inform us that sponge is highly useful with a little augmentation. Let's figure this out.",
            researchedMessage:
                "By infusing sponge with processed matter, we have devised spronge, a versatile super-material that kind of freaks us out!",
            effectDesc: "Enables creation of spronge, the backbone... uh... the core material in cephalopod technology.",
            cost: {
                science: 1500,
                sponge: 800,
                junk: 4000,
            },
            required: {
                upgrades: ["recyclerDiscovery", "spongeCollection"],
                seen: ["sponge"],
            },
        },
        automation: { cost: { science: 1750 } },
        environmentalism: {
            name: "Environmentalism",
            desc: "The machines produce what now?! Quick, we need a solution - sponges filter stuff, right?!",
            researchedMessage: "With the right kind of stretching and squishing, we can turn sponges into weird little filter things!",
            effectDesc: "Sponges can be turned into filters to stop the tar from killing us all. Yay!",
            cost: {
                science: 250,
                sponge: 15,
            },
            required: {
                upgrades: ["spongeCollection", "automation"],
            },
        },
        engineering: {
            effectDesc: "Shark machines are twice as effective.",
            effect: {
                incomeBoost: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                },
            },
        },
        recyclerDiscovery: {
            effectDesc:
                "Allows recycling of materials by virtue of a horrifying mechanical maw that consumes all that ventures near it. Future? Also, skimmers are now possible to create.",
            cost: {
                science: 4000,
                sharkonium: 2000,
            },
            required: {
                upgrades: ["automation"],
            },
        },
        iterativeDesign: {
            cost: {
                science: 75000,
                sharkonium: 17500,
            },
            effect: {
                incomeBoost: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                    skimmer: 2,
                },
                incomeMultiplier: {
                    scientist: 4,
                },
            },
        },
        sprongeBiomimicry: {
            name: "Spronge Biomimicry",
            desc: "The cephalopod school of thought is that a machine that mimics life is a better machine. We don't understand this so well yet.",
            researchedMessage:
                "For machines that mimic life, these things sure put out a lot of pollution. It's sort of alarming. Very alarming, even.",
            effectDesc:
                "We can mimic some of the life-mimicking biotechnology the octopuses use, but it gums up the oceans so quickly. So very dangerous.",
            cost: {
                science: 4000,
                spronge: 200,
            },
            required: {
                upgrades: ["automation", "industrialGradeSponge"],
                resources: ["sponge", "junk"],
                seen: ["spronge"],
            },
        },
        agriculture: {
            researchedMessage:
                "While the tar makes it difficult to pull off, it is so much easier to get things when they're all in one place. It's like the ocean is our grotto now!",
            effectDesc: "Crabs can now specialize in collecting sponge.",
            cost: {
                science: 1500,
                sand: 500,
                sponge: 10,
            },
            required: {
                upgrades: ["seabedGeology", "spongeCollection"],
                seen: ["sponge"],
            },
        },
        biology: {
            cost: {
                science: 1600,
            },
        },
        rayBiology: {
            cost: {
                science: 1800,
                sand: 1600,
            },
            required: {
                upgrades: ["biology", "laserRays"],
            },
        },
        crabBiology: {
            desc: "Crabs are a mystery. They keep to themselves and dig up crystals or pick up sponge. What is even up with that? What ARE crabs??",
            cost: {
                science: 2500,
                fish: 2500,
            },
            required: {
                upgrades: ["biology"],
                resources: ["crab"],
                seen: ["collector"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    collector: 4,
                },
            },
        },
        octopusMethodology: {
            name: "Octopus Methodology",
            desc: "The octopuses claim they know ways to improve their routines and machines.",
            researchedMessage: "We have no idea what thought processes guide these cephalopod allies of ours, but they know how to get results.",
            effectDesc: "Octopuses can specialise in different tasks, and octopuses work more efficiently.",
            cost: {
                science: 888,
                clam: 888,
            },
            required: {
                upgrades: ["clamScooping"],
                resources: ["octopus"],
                seen: ["octopus"],
            },
            effect: {
                incomeMultiplier: {
                    octopus: 2,
                },
            },
        },
        octalEfficiency: {
            name: "Octal Efficiency",
            desc: "The octopuses wish to further enhance their productivity for collective gain.",
            researchedMessage:
                "The instructions constructed and disseminated by the octopuses are complex and only understood to other octopuses. Head hurts. Something about the number eight.",
            effectDesc: "Octopuses, their specialists, and their machines are twice as effective. Find unity in efficiency.",
            cost: {
                science: 8888,
                clam: 88888,
            },
            required: {
                upgrades: ["sprongeBiomimicry"],
                seen: ["clamCollector", "sprongeSmelter", "eggBrooder"],
            },
            effect: {
                incomeMultiplier: {
                    octopus: 2,
                    investigator: 2,
                },
                incomeBoost: {
                    clamCollector: 2,
                    eggBrooder: 2,
                    sprongeSmelter: 2,
                },
            },
        },
        sunObservation: {
            desc: "It's hard to see, but there's a weird glare on the surface of the water, and we need to figure out what it means.",
            effectDesc:
                "Octopus investigators, science sharks, and collector crabs are twice as effective. Is a suns worth many fish? We can see a sun, but where is it really? And what is it made of?",
            cost: {
                science: 17500,
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                    investigator: 2,
                    collector: 2,
                },
            },
        },
        exploration: {
            desc: "Venture into open waters to see what can be found!",
            researchedMessage: "Fish, sand, and crystals can be found! Even further out, though, there's something else.",
            effectDesc: "Sharks, rays, crabs, and crab collectors are more effective...and something was spotted in the distance.",
            cost: {
                science: 25000,
                fish: 30000,
            },
            required: {
                upgrades: ["sunObservation"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    collector: 2,
                },
            },
        },
        farAbandonedExploration: {
            name: "Far Exploration",
            desc: "In the distance lies a bunch of weird structures that sharks have dared not enter...so what happens if we do?",
            researchedMessage:
                "As it turns out, discoveries happen! There are no signs of life, but we found lots of weird machines and a strange gate.",
            effectDesc:
                "Explored the city in the distance and discovered a gate and some weird machines. Octopuses can now specialize in scavenging around the city.",
            cost: {
                science: 50000,
                fish: 75000,
            },
            required: {
                upgrades: ["exploration"],
            },
        },
        superiorSearchAlgorithms: {
            name: "Superior Search Algorithms",
            desc: "Why is finding stuff so hard?!?!",
            researchedMessage:
                "As our octopus bretheren explain, it was hard because we kept telling them to go in circles. They used the word 'inept'.",
            effectDesc:
                "The octopuses have taken control of both scavenging operations and are refusing to listen to our directions. Still, scavengers are 8 times faster and collectors are 4 times faster.",
            cost: {
                science: 88888,
                ancientPart: 88,
            },
            required: {
                upgrades: ["farAbandonedExploration", "octalEfficiency"],
                seen: ["ancientPart"],
            },
            effect: {
                incomeMultiplier: {
                    scavenger: 8,
                    collector: 4,
                },
            },
        },
        reverseEngineering: {
            name: "Reverse Engineering",
            desc: "What is up with these parts? Why are they shaped like that?!",
            researchedMessage: "Results inconclusive. Further analysis pending.",
            effectDesc:
                "Ancient parts can be sacrificed for science. Scientists and scavengers are twice as effective, and investigators are 4 times as effective.",
            cost: {
                science: 125000,
                ancientPart: 250,
            },
            required: {
                upgrades: ["farAbandonedExploration", "engineering"],
                seen: ["ancientPart"],
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                    investigator: 4,
                },
            },
        },
        highEnergyFusion: {
            name: "High-Energy Fusion",
            desc: "These old parts must have some kind of use! Question is, can we figure it out???",
            researchedMessage: "The secret of high-energy fusion has been unlocked. Scavenge no more. We will do it ourselves.",
            effectDesc:
                "Laser rays can fuse sand to crystal at an absurd rate. We have figured out how to create more ancient parts by fusing clams and crystals.",
            cost: {
                science: 2500000,
                ancientPart: 1750,
            },
            required: {
                upgrades: ["reverseEngineering", "iterativeDesign", "laserRays"],
            },
            effect: {
                incomeBoost: {
                    laser: 128,
                },
            },
        },
        artifactAssembly: {
            name: "Artifact Assembly",
            desc: "Assemble the pieces. Create the tool. Open the gate.",
            researchedMessage: "It is done.",
            effectDesc: "The artifact is assembled. The gate can be opened.",
            cost: {
                ancientPart: 250000,
            },
            required: {
                upgrades: ["highEnergyFusion"],
            },
        },
        eightfoldOptimisation: {
            name: "Eightfold Optimisation",
            desc: "Enhance productivity. Optimise. Improve. Improve.",
            researchedMessage: "Peak productivity attained. Maintain course. Maintain efficiency.",
            effectDesc: "Octopuses and their roles, as well as their machines, are all eight times as effective. Optimised.",
            cost: {
                science: 8e7,
            },
            required: {
                upgrades: ["reverseEngineering", "octalEfficiency"],
                resources: ["octopus"],
            },
            effect: {
                incomeMultiplier: {
                    octopus: 8,
                    investigator: 8,
                    scavenger: 8,
                },
                incomeBoost: {
                    clamCollector: 8,
                    eggBrooder: 8,
                    sprongeSmelter: 8,
                },
            },
        },
        mechanisedAlchemy: {
            name: "Mechanised Alchemy",
            desc: "Better engineering and transmutation processes lead to a refinement of our machines.",
            researchedMessage: "We are blurring the line between science and magic more than ever before!",
            effectDesc: "Shark machines are all four times as effective, as are filters. We work better with the machines, not against them.",
            cost: {
                science: 4e7,
            },
            required: {
                upgrades: ["reverseEngineering", "iterativeDesign"],
                resources: ["sharkonium"],
            },
            effect: {
                incomeMultiplier: {
                    filter: 8,
                },
                incomeBoost: {
                    fishMachine: 4,
                    crystalMiner: 4,
                    sandDigger: 4,
                    skimmer: 4,
                },
            },
        },
    },
    haven: {
        crystalBite: {},
        crystalSpade: {},
        cetaceanAwareness: {
            name: "Cetacean Awareness",
            desc: "From a distance, it's hard to tell which of us are really sharks or... those other things. We need to figure this out.",
            researchedMessage:
                "Right, so, dolphins have a horizontal tail and sharks have a vertical tail. Also, they have warm blood and bigger brains. Jerks.",
            effectDesc: "Dolphins can now be recruited. We're happy about this why, exactly??",
            cost: {
                science: 75,
                coral: 100,
            },
            required: {
                totals: {
                    coral: 75,
                },
            },
        },
        crystalContainer: {},
        statsDiscovery: {},
        underwaterChemistry: {},
        seabedGeology: {},
        transmutation: {
            desc: "Delphinium is a terrible material! And it makes terrible machines! We can do better, surely.",
            cost: {
                science: 75000,
                crystal: 75000,
                sand: 4000000,
            },
            required: {
                upgrades: ["dolphinTechnology"],
                seen: ["crimsonCombine", "kelpCultivator", "tirelessCrafter"],
            },
        },
        aquamarineFusion: {
            name: "Aquamarine Fusion",
            desc:
                "Those uppity dolphins think they're the only ones who can make their special delphinium. But the kelp papyrus things have instructions, so we'll show them!",
            researchedMessage:
                "Using the knowledge gained from the kelp slab things, we've figured out how to make delphinium and now we feel gross.",
            effectDesc: "Enables transmutation of a different bunch of junk into delphinium.",
            cost: {
                science: 30000,
                coral: 75000,
                crystal: 50000,
            },
            required: {
                upgrades: ["delphineHistory"],
            },
        },
        automation: {
            name: "Automation",
            desc: "Using sharkonium, we can make our own things to do things so we don't have to do the things!",
            cost: {
                science: 125000,
                sharkonium: 17500,
            },
        },
        engineering: {
            effectDesc: "Machines are twice as effective. Auto-transmuters are now possible to create.",
            cost: {
                science: 525000,
                sharkonium: 60000,
            },
        },
        recyclerDiscovery: {
            cost: {
                science: 500000,
                sharkonium: 75000,
            },
        },
        iterativeDesign: {
            cost: {
                science: 3750000,
                sharkonium: 100000,
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                    autoTransmuter: 2,
                    scientist: 4,
                },
            },
        },
        dolphinTechnology: {
            name: "Dolphin Technology",
            desc: "The warm-blooded squeakers have machinery that might be useful. Let's reverse-engineer it.",
            researchedMessage:
                "The elaborate crystalline structures of dolphin technology are a ruse to mask their limited function. Inside, they're not so different to our machines.",
            effectDesc: "We've reverse-engineered some dolphin machinery. We also, regretfully, learned what the designs are called.",
            cost: {
                science: 37500,
                delphinium: 3750,
            },
            required: {
                upgrades: ["aquamarineFusion"],
                seen: ["delphinium"],
            },
        },
        agriculture: {
            effectDesc: "Discovered agricultural methods. We'll see if this bears fruit.",
            cost: {
                science: 300,
                sand: 1000,
            },
            effect: {
                incomeMultiplier: {
                    dolphin: 2,
                },
            },
        },
        kelpHorticulture: {
            cost: {
                science: 100,
                sand: 2500,
            },
        },
        biology: {
            cost: {
                science: 750,
            },
        },
        xenobiology: {
            effectDesc:
                "We know how to harvest sea apples twice as quickly, and we can dissect sea apples for science. Also, sea apple isn't a fruit.",
            cost: {
                seaApple: 2,
            },
            required: {
                upgrades: ["kelpHorticulture"],
                seen: ["seaApple"],
            },
        },
        rayBiology: {
            effectDesc:
                "Rays are four times as effective. We may never repair the shark-ray relations to their former state after how awkward this whole affair was.",
            cost: {
                science: 1250,
                sand: 5000,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 4,
                },
            },
        },
        crabBiology: {
            name: "Crab Biology",
            desc: "Crabs are a mystery. They keep to themselves and dig up crystals or put down plants. What is even up with that? What ARE crabs??",
            cost: {
                science: 1500,
                kelp: 100,
            },
            required: {
                upgrades: ["biology", "kelpHorticulture"],
                resources: ["crab"],
            },
        },
        coralCollection: {
            name: "Coral Collection",
            desc: "The dolphins keep talking about coral and crystals and pretty artwork. All the time. What??? Why do you care??",
            researchedMessage: "So it's a cultural thing. Fine, collect your coral. See if I care.",
            effectDesc: "Dolphins can now specialize in becoming treasurers.",
            cost: {
                science: 800,
                coral: 750,
            },
            required: {
                upgrades: ["seabedGeology"],
                seen: ["dolphin"],
                totals: {
                    coral: 1250,
                },
            },
        },
        dolphinBiology: {
            name: "Dolphin Biology",
            desc: "Do we really have to learn about this? We do? Alright, then.",
            researchedMessage:
                "We managed to offend the dolphins with our questions so much they decided to form their own biological research team.",
            effectDesc:
                "All dolphins are four times as effective but four times a small number is still small. Also now they can make more dolphins. <em>Hooray.</em>",
            cost: {
                science: 1500,
                coral: 1000,
            },
            required: {
                upgrades: ["biology", "coralCollection"],
                seen: ["treasurer"],
            },
            effect: {
                incomeMultiplier: {
                    dolphin: 4,
                    treasurer: 2,
                },
            },
        },
        delphineHistory: {
            name: "Delphine History",
            desc: "We keep finding all these flat pieces of kelp washing up in the current. What is with them? Why are they crunchy?!",
            researchedMessage: "A dolphin overheard us talking about it, and they came over and 'read' something from it. What?!",
            effectDesc: "Discovered the remnants of dolphin civilization in the form of kelp...papyrus. Okay then??",
            cost: {
                science: 10000,
            },
            required: {
                upgrades: ["sunObservation"],
                seen: ["treasurer"],
            },
            effect: {
                incomeMultiplier: {
                    dolphin: 2,
                    biologist: 2,
                    treasurer: 2,
                },
            },
        },
        imperialDesigns: {
            name: "Imperial Designs",
            desc:
                "Finally, with all the materials in one place, we can stop relying on shoddy copies and use the original designs for the dolphin machines.",
            researchedMessage: "What? These designs will never work! Look, let's show them-- oh. Oh, apparently they do. Huh.",
            effectDesc:
                "Kelp cultivators and crimson combines are 8 times faster, and tireless crafters are twice as efficient. We begrudingly admit their quality is not entirely terrible.",
            cost: {
                science: 25000000,
                delphinium: 250000,
            },
            required: {
                upgrades: ["retroactiveRecordkeeping", "dolphinTechnology"],
                seen: ["crimsonCombine", "kelpCultivator", "tirelessCrafter"],
            },
            effect: {
                incomeMultiplier: {
                    crimsonCombine: 8,
                    kelpCultivator: 8,
                },
                incomeBoost: {
                    tirelessCrafter: 4,
                },
            },
        },
        retroactiveRecordkeeping: {
            name: "Retroactive Recordkeeping",
            desc: "We've been sitting on a massive stockpile of these kelp papyrus...things. Maybe we should actually try organizing them.",
            researchedMessage: "The dolphins were the first to volunteer with helping to organize this stuff. I GUESS we could give them a chance.",
            effectDesc: "Can now assign dolphins as historians who will help catalogue all of the information we have on these kelp things.",
            cost: {
                science: 900000,
            },
            required: {
                totals: {
                    science: 850000,
                },
            },
            effect: {
                incomeMultiplier: {
                    scientist: 4,
                },
            },
        },
        sunObservation: {
            effectDesc:
                "Planter crabs are four times as effective. Is a suns worth many fish? We can see a sun, but where is it really? And what is it made of?",
            cost: {
                science: 2750,
            },
            required: {
                upgrades: ["kelpHorticulture"],
            },
            effect: {
                incomeMultiplier: {
                    planter: 4,
                },
            },
        },
        exploration: {
            cost: {
                science: 5000,
                fish: 50000,
            },
        },
        /* Equivalent of farExploration.. named differently for unlocks or smth I think? */
        farHavenExploration: {
            name: "Far Exploration",
            desc: "Explore the vast reaches beyond the home ocean, and look for that portal that keeps popping up in dolphin texts.",
            researchedMessage: "Crystal-rich deposits were found, as well as what appears to be the portal of dolphin legend.",
            effectDesc: "Crabs are four times as effective. Did you know oceans are actually even bigger than big? Remarkable!",
            cost: {
                science: 80000,
                fish: 15000,
            },
            required: {
                upgrades: ["exploration", "delphineHistory"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                },
            },
        },
        whaleCommunication: {
            name: "Whale Communication",
            desc: "We can hear faint cries in the distance. What is out there?",
            researchedMessage:
                "Okay, 'whales' are out there. They're similar to dolphins, except less rude, and really big. Oh, and, they collect tons of fish.",
            effectDesc: "Whales can now be recruited.",
            cost: {
                fish: 2500000,
            },
            required: {
                upgrades: ["exploration"],
            },
        },
        whaleSong: {
            name: "The Whale Song",
            desc:
                "The whales claim to know segments of some form of ancient ethereal music that connects worlds. We can collect what they know to piece it together ourselves.",
            researchedMessage: "What we've put together is definitely a song...but something's missing. This can't be the whole thing.",
            effectDesc:
                "The whales have worked with us to put together pieces of an ancient song. We don't think it's everything, though. Whales are 4 times as effective.",
            cost: {
                fish: 100000000,
            },
            required: {
                upgrades: ["whaleCommunication"],
                seen: ["whale"],
            },
            effect: {
                incomeMultiplier: {
                    whale: 4,
                },
            },
        },
        eternalSong: {
            name: "The Eternal Song",
            desc: "The song of the whales is mentioned in dolphin texts dating back as far as we can find. I think we're onto something.",
            researchedMessage:
                "The song of the whales was only ever half of the composition. The dolphins were the key to completing it. Now we have the pieces.",
            effectDesc: "A chorus of whales and dolphins can be assembled to sing the eternal song, but we have no clue what it will do.",
            cost: {
                science: 250000000,
            },
            required: {
                upgrades: ["whaleSong", "retroactiveRecordkeeping", "farHavenExploration"],
            },
            effect: {
                incomeMultiplier: {
                    whale: 16,
                    dolphin: 16,
                    treasurer: 16,
                    biologist: 4,
                },
            },
        },
        crystallineConstruction: {
            name: "Crystalline Construction",
            desc: "The dolphins are a bunch of jerks, but maybe we can still learn from one another. Maybe.",
            researchedMessage:
                "By integrating the genius of shark design with only the good parts of dolphin design, we've managed to create a superior set of machines. Maybe we work better together than we do apart.",
            effectDesc:
                "All shark machines run eight times as fast. Holy moley! Also, shark science is way more informative now that we have more perspective.",
            cost: {
                science: 100000000,
                sharkonium: 250000,
                delphinium: 250000,
            },
            required: {
                upgrades: ["iterativeDesign"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 8,
                    fishMachine: 8,
                    sandDigger: 8,
                    scientist: 16,
                },
            },
        },
    },
    frigid: {
        crystalBite: {},
        urchinAttraction: {
            name: "Urchin Attraction",
            desc: "We can see these little spiny balls moving around on the ocean floor. What are they? Why are they everywhere?!",
            researchedMessage: "We have made two miraculous discoveries: they're sentient (barely), and spikes exist and are painful.",
            effectDesc:
                "We've managed to attract the attention of one of the sea urchins, and it's bringing stuff to us. I think it likes us?? Maybe???",
            cost: {
                science: 75,
            },
        },
        crystalContainer: {},
        statsDiscovery: {},
        underwaterChemistry: {},
        seabedGeology: {
            researchedMessage: "Not only did we find a whole bunch of weird things, we found that there was more sand!",
            effectDesc:
                "Urchins gather sand twice as fast. Not that they understand how to do it faster, but that we've shown them better techniques to mimic.",
            cost: {
                science: 250,
                sand: 250,
            },
            effect: {
                sandMultiplier: {
                    urchin: 2,
                },
            },
        },
        transmutation: {
            name: "Transmutation",
            desc: "By heating things up and doing science things to them, maybe new things can be made!",
            researchedMessage: "A new form of material has been discovered! It has been named after its discoverer, Dr. Sharkonium.",
            effectDesc: "Enables transmutation of some random junk we have lying around into sharkonium, material of the future.",
            cost: {
                science: 8000,
                crystal: 4000,
                sand: 8000,
            },
            required: {
                upgrades: ["underwaterChemistry", "sunObservation"],
            },
        },
        automation: {
            name: "Automation",
            desc: "Using sharkonium, we can make things to do things so we don't have to do the things!",
            researchedMessage: "Now we don't have to do all the work, machines can do it for us! Future!!",
            effectDesc: "Machines can be built to supplement population duties. This is efficient.",
            cost: {
                science: 1500,
                sharkonium: 250,
            },
            required: {
                upgrades: ["transmutation"],
            },
        },
        engineering: {
            name: "Engineering",
            desc: "The machines sort of suck. Let's make them better by learning how!",
            researchedMessage: "The machines are twice as good now! We've figured out new designs in the process, too!",
            effectDesc: "Machines are twice as effective. Skimmers and auto-transmuters are now possible to create.",
            cost: {
                science: 15000,
                sharkonium: 1750,
            },
            required: {
                upgrades: ["automation"],
                seen: ["fishMachine", "crystalMiner", "sandDigger"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                },
            },
        },
        recyclerDiscovery: {
            name: "Recycler",
            desc: "Devise a system of pulverising unwanted resources into a component paste, and reusing them as something else.",
            researchedMessage:
                "Well this thing is frankly terrifying. I wouldn't swim anywhere near the input holes if I were you. Maybe it'll help though!",
            effectDesc: "Allows recycling of materials by virtue of a horrifying mechanical maw that consumes all that ventures near it. Future?",
            cost: {
                science: 6000,
                sharkonium: 6000,
            },
            required: {
                upgrades: ["engineering"],
            },
        },
        iterativeDesign: {
            name: "Iterative Design",
            desc: "The machines are useful, but they could be better. Maybe it's time we started over?",
            researchedMessage: "As it turns out, science is about learning from mistakes, or so the scientists say. About their own mistakes.",
            effectDesc: "All shark machines run twice as fast. Again!",
            cost: {
                science: 15000,
                sharkonium: 17500,
            },
            required: {
                upgrades: ["engineering"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                    autoTransmuter: 2,
                    heater: 2,
                    scientist: 4,
                },
            },
        },
        superprocessing: {
            name: "Superprocessing",
            desc:
                "The recycler wasn't really meant for millions of fish at once. Seeing as that transaction is fairly common, we should probably do something about it.",
            researchedMessage: "Eureka! If we make the big things bigger, and the grinders grindier, we can process way more material at once!",
            effectDesc:
                "The recycler's efficiency only starts dropping at 10 million material inserted at once, instead of 100 thousand. The base efficiency is now 100%.",
            cost: {
                science: 1e6,
                sharkonium: 1e6,
                junk: 1e6,
            },
            required: {
                upgrades: ["iterativeDesign", "recyclerDiscovery"],
            },
        },
        agriculture: {
            name: "Agriculture",
            desc: "The hunter-gatherer lifestyle seems like the only option, but maybe we could learn something more sustainable?",
            researchedMessage:
                "It sorta worked. We've had to plant kelp all over the place, since the urchins just tear through it if it's all together.",
            effectDesc: "Urchins gather kelp twice as fast. Just kelp.",
            cost: {
                science: 300,
                sand: 1000,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
            effect: {
                kelpMultiplier: {
                    urchin: 2,
                },
            },
        },
        kelpExtraction: {
            name: "Kelp Extraction",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                science: 1000,
                sand: 2000,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        biology: {
            name: "Biology",
            desc: "What is a shark? What is inside a shark, except for large amounts of fish?",
            researchedMessage: "With a new understanding of their own biology, sharks can now specialise in the manufacture of new sharks.",
            effectDesc: "Sharks are twice as effective. Did you know shark eggs don't actually form just because a shark wills them to exist?",
            cost: {
                science: 400,
            },
            required: {
                upgrades: ["underwaterChemistry", "agriculture"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                },
            },
        },
        squidBiology: {
            name: "Biology",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                science: 400,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    squid: 2,
                },
            },
        },
        crabBiology: {
            name: "Crab Biology",
            desc: "Crabs are a mystery. They keep to themselves and dig up crystals or put down plants. What is even up with that? What ARE crabs??",
            researchedMessage:
                "It turns out crabs are friendly crustaceans that have revealed to the sharks the secrets of crab generation. It involves eggs, or something. Squirmy eggs.",
            effectDesc:
                "Crabs and planter crabs are twice as effective. Crabs are alright but they are also sort of terrifying and weird. Good thing they're on our side!",
            cost: {
                science: 500,
                kelp: 100,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                },
            },
        },
        urchinBiology: {
            name: "Urchin Biology",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                science: 400,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    urchin: 2,
                },
            },
        },
        fishAnatomy: {
            name: "Kelp Extraction",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                science: 1000,
                sand: 2000,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        curiousCrabs: {
            name: "Kelp Extraction",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                science: 1000,
                sand: 2000,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        sunObservation: {
            name: "Sun Observation",
            desc: "We must determine what is with the weird glare on the surface of the water.",
            researchedMessage: "Shark science has discovered the sun! It has also discovered that looking directly into the sun hurts.",
            effectDesc: "Is a suns worth many fish? We can see a sun, but where is it really? And what is it made of?",
            cost: {
                science: 5000,
            },
            required: {
                upgrades: ["agriculture"],
            },
            effect: {
                incomeMultiplier: {
                    planter: 2,
                },
            },
        },
        exploration: {
            name: "Exploration",
            desc: "Swim beyond the home seas to see what can be found!",
            researchedMessage: "Found lots of fish, but also a giant wall of cracked ice. It's like a bubble around us as far as we can see!",
            effectDesc: "Squids and squid hunters are twice as effective. Did you know oceans are big? Fascinating!",
            cost: {
                science: 6000,
                fish: 5000,
            },
            required: {
                upgrades: ["sunObservation"],
            },
            effect: {
                incomeMultiplier: {
                    hunter: 2,
                    squid: 2,
                },
            },
        },
        glacialNavigation: {
            name: "Glacial Navigation",
            desc: "Explore the icebergs that lie beyond the warmth. Maybe we can learn something useful?",
            researchedMessage:
                "Exploring the icebergs yielded...more icebergs. It's a cold world out there, but there are untapped crystal reserves at the border.",
            effectDesc: "Crabs and extraction teams are 4 times as effective. ",
            cost: {
                science: 8000,
                fish: 15000,
            },
            required: {
                upgrades: ["exploration"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    extractionTeam: 4,
                },
            },
        },
        artificialHeating: {
            name: "Kelp Extraction",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                science: 1000,
                sand: 2000,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        coldproofSpines: {
            name: "Kelp Extraction",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                science: 1000,
                sand: 2000,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        thermalConditioning: {
            name: "Kelp Extraction",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                science: 1000,
                sand: 2000,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        internalInvestigation: {
            name: "Kelp Extraction",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                science: 1000,
                sand: 2000,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        sonicEnergizers: {
            name: "Kelp Extraction",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                science: 1000,
                sand: 2000,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        rapidRepairs: {
            name: "Kelp Extraction",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                science: 1000,
                sand: 2000,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        teamSpirit: {
            name: "Kelp Extraction",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                science: 1000,
                sand: 2000,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        creatureCoalition: {
            name: "Kelp Extraction",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                science: 1000,
                sand: 2000,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
    },
};

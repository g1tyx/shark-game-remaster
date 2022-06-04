"use strict";
SharkGame.Upgrades = {
    purchased: [],
    /**
     * @type Record<string, Record<string, any>>
     * Generated cache on-demand
     */
    generated: {},

    /** @param worldType {string} */
    getUpgradeTable(worldType = world.worldType) {
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

    /**
     * Retrieves, modifies, and returns the data for an upgrade. Implemented to intercept retreival of upgrade data to handle special logic where alternatives are inconvenient or impossible.
     * @param {object} table The table to retrieve the upgrade data from
     * @param {string} upgradeName The name of the upgrade
     */
    getUpgradeData(table, upgradeName) {
        if (!table[upgradeName]) {
            return;
        }

        // probably find a way to forego the clonedeep here, but the performance impact seems negligible.
        const data = _.cloneDeep(table[upgradeName]);

        // apply effect of internal calculator aspect if indeed applicable
        // would use getters but there would be too many getters to be reasonable
        let theThing = 150;
        if (SharkGame.Aspects.internalCalculator.level > 1) {
            theThing = 150 * (SharkGame.Aspects.internalCalculator.level - 1) ** 2;
        }

        if (data.cost && data.cost.science && data.cost.science <= theThing) {
            switch (SharkGame.Aspects.internalCalculator.level) {
                case 0:
                    // haha nothing
                    break;
                case 1:
                    data.cost.science *= 0.5;
                    break;
                default:
                    $.each(data.cost, (resource) => {
                        data.cost[resource] *= 0.5;
                    });
            }
        }

        if (cad.upgradePriceModifier !== 1) {
            $.each(data.cost, (resource) => {
                data.cost[resource] *= cad.upgradePriceModifier;
            });
        }

        return data;
    },

    /** @param worldType {string} */
    generateUpgradeTable(worldType = world.worldType) {
        let finalTable = {};
        const defaultUpgrades = SharkGame.Upgrades.default;
        if (_.has(SharkGame.Upgrades, worldType)) {
            const worldUpgrades = SharkGame.Upgrades[worldType];
            _.each(Object.getOwnPropertyNames(worldUpgrades), (upgradeName) => {
                if (defaultUpgrades[upgradeName]) {
                    finalTable[upgradeName] = {};
                    const names = Object.getOwnPropertyNames(worldUpgrades[upgradeName]);
                    _.each(names, (theName) => {
                        const descriptor = Object.getOwnPropertyDescriptor(worldUpgrades[upgradeName], theName);
                        Object.defineProperty(finalTable[upgradeName], theName, descriptor);
                    });
                    const defaultNames = Object.getOwnPropertyNames(defaultUpgrades[upgradeName]);
                    _.each(defaultNames, (theName) => {
                        if (!finalTable[upgradeName][theName]) {
                            const descriptor = Object.getOwnPropertyDescriptor(defaultUpgrades[upgradeName], theName);
                            Object.defineProperty(finalTable[upgradeName], theName, descriptor);
                        }
                    });
                } else {
                    finalTable[upgradeName] = worldUpgrades[upgradeName];
                }
            });
        } else {
            finalTable = defaultUpgrades;
        }
        return finalTable;
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
                sand: 500,
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
                sand: 750,
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
                sand: 1000,
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
                sand: 10000,
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
                science: 3500,
                crystal: 1500,
                sand: 15000,
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
                science: 3500,
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
                science: 5000,
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
                science: 75000,
                sharkonium: 25000,
            },
            required: {
                upgrades: ["engineering"],
            },
        },
        iterativeDesign: {
            name: "Iterative Design",
            desc: "The machines are useful, but they could be better. Let's build new ones, from scratch!",
            researchedMessage: "As it turns out, science is about learning from mistakes, or so the scientists say. About their own mistakes.",
            effectDesc: "All shark machines run twice as fast. Again! Scientists are 4 times faster as well.",
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
            desc: "The recycler wasn't really meant for millions of fish at once. Seeing as that transaction is fairly common, we should probably do something about it.",
            researchedMessage: "Eureka! If we make the big things bigger, and the grinders grindier, we can process way more material at once!",
            effectDesc:
                "The recycler's efficiency only starts dropping at 10 million material inserted at once, instead of 100 thousand. The base efficiency is now 100%.",
            cost: {
                science: 1e6,
                sharkonium: 5e5,
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
            effectDesc: "Advances in agriculture will fuel future endeavors. Who knows what we'll do next!",
            cost: {
                science: 500,
                sand: 1500,
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
                science: 1500,
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
            effectDesc:
                "Sharks are twice as effective, and nurse sharks can be bought. Did you know shark eggs don't actually form just because a shark wills them to exist?",
            cost: {
                science: 600,
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
                "Kelp produces sea apples twice as fast. We can dissect sea apples and jellyfish for science. Also, sea apple isn't a fruit. Gross.",
            cost: {
                science: 2000,
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
                "Rays and laser rays are twice as effective, and ray makers are available. We may never repair the shark-ray relations to their former state after how awkward this whole affair was.",
            cost: {
                science: 1500,
                sand: 10000,
            },
            required: {
                upgrades: ["biology", "laserRays"],
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
                "Crabs and planter crabs are four and two times as effective, respectively, and crab broods are available. Crabs are alright but they are also sort of terrifying and weird. Good thing they're on our side!",
            cost: {
                science: 8500,
                kelp: 1000,
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
                science: 7500,
            },
            required: {
                upgrades: ["agriculture", "kelpHorticulture"],
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
                science: 10000,
                fish: 50000,
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
                science: 12000,
                fish: 125000,
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
                fish: 2500000,
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
        thermalVents: {
            cost: {
                science: 500,
                sand: 1000,
            },
        },
        clamScooping: {
            name: "Clam Scooping",
            desc: "We see these things all over the seabed but we can't tell which are clams and which are rocks.",
            researchedMessage:
                "Patient observation has shown that clams and rocks are in fact different and distinct things. Now we won't be scooping up any more rocks!",
            effectDesc: "Clams can be collected like fish.",
            cost: {
                science: 250,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        laserRays: {
            cost: {
                crystal: 100,
                sand: 2000,
                science: 500,
            },
        },
        transmutation: {
            cost: {
                science: 2500,
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
                science: 2500,
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
                science: 6000,
                sharkonium: 2000,
            },
            required: {
                upgrades: ["automation"],
            },
        },
        iterativeDesign: {
            cost: {
                science: 100000,
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
                science: 6000,
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
                science: 2000,
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
                science: 2250,
            },
        },
        rayBiology: {
            cost: {
                science: 2400,
                sand: 1600,
            },
            required: {
                upgrades: ["biology", "laserRays"],
            },
        },
        crabBiology: {
            desc: "Crabs are a mystery. They keep to themselves and dig up crystals or pick up sponge. What is even up with that? What ARE crabs??",
            cost: {
                science: 2700,
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
            effectDesc: "Octopuses can specialise in investigation, and octopuses work twice as efficiently.",
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
            effectDesc: "Octopuses, investigators, and their machines are twice as effective. Find unity in efficiency.",
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
                science: 22500,
            },
            required: {
                upgrades: ["agriculture"],
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
            effectDesc: "Crabs are 4 times more effective, and collectors are twice as effective...and something was spotted in the distance.",
            cost: {
                science: 30000,
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
                science: 75000,
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
            effectDesc: "Ancient parts can be sacrificed for science. Scientists are twice as effective, and investigators are 4 times as effective.",
            cost: {
                science: 150000,
                ancientPart: 350,
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
                "Laser rays can fuse sand to crystal at an absurd rate: 128 times faster! We have figured out how to create more ancient parts by fusing clams and crystals.",
            cost: {
                science: 3500000,
                ancientPart: 2250,
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
                ancientPart: 350000,
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
            effectDesc:
                "Shark machines are all four times as effective, filters are 4 times as effective. We work better with the machines, not against them.",
            cost: {
                science: 6e7,
            },
            required: {
                upgrades: ["reverseEngineering", "iterativeDesign"],
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
                "Right, so, dolphins have a horizontal tail and sharks have a vertical tail. Also, APPARENTLY, they have warm blood and bigger brains. Jerks.",
            effectDesc: "Dolphins can now be recruited.",
            cost: {
                science: 125,
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
        seabedGeology: {
            cost: {
                science: 350,
                sand: 7500,
            },
        },
        agriculture: {
            effectDesc: "Dolphin effectiveness times 2. Discovered agricultural methods. We'll see if this bears fruit.",
            cost: {
                science: 500,
                sand: 10000,
                coral: 100,
            },
            effect: {
                incomeMultiplier: {
                    dolphin: 2,
                },
            },
        },
        coralCollection: {
            name: "Coral Collection",
            desc: "The dolphins keep talking about coral and crystals and pretty artwork. All the time. What??? Why do you care??",
            researchedMessage: "So it's a cultural thing. Fine, collect your coral. See if I care.",
            effectDesc: "Dolphins can now specialize in becoming treasurers.",
            cost: {
                science: 400,
                coral: 250,
            },
            required: {
                upgrades: ["agriculture"],
                seen: ["dolphin"],
            },
        },
        kelpHorticulture: {
            cost: {
                science: 3500,
                sand: 25000,
            },
        },
        xenobiology: {
            effectDesc:
                "We know how to harvest sea apples twice as quickly, and we can dissect sea apples for science. Also, sea apple isn't a fruit.",
            cost: {
                seaApple: 20,
            },
            required: {
                upgrades: ["kelpHorticulture"],
                seen: ["seaApple"],
            },
        },
        dolphinBiology: {
            name: "Dolphin Biology",
            desc: "Do we really have to learn about this? We do? Alright, then.",
            researchedMessage:
                "We managed to offend the dolphins with our questions so much they decided to form their own biological research team.",
            effectDesc:
                "Dolphins are four times as effective but four times a small number is still small. Treasurers are twice as effective too. Also now they can make more dolphins. <em>Hooray.</em>",
            cost: {
                science: 3000,
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
        biology: {
            cost: {
                science: 2000,
            },
        },
        rayBiology: {
            effectDesc:
                "Rays are four times as effective. We may never repair the shark-ray relations to their former state after how awkward this whole affair was.",
            cost: {
                science: 2250,
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
        delphineHistory: {
            name: "Delphine History",
            desc: "We keep finding all these flat pieces of kelp washing up in the current. What is with them? Why are they crunchy?!",
            researchedMessage: "A dolphin overheard us talking about it, and they came over and 'read' something from it. What?!",
            effectDesc:
                "All dolphin roles are twice as effective. Discovered the remnants of dolphin civilization in the form of kelp...papyrus. Okay then??",
            cost: {
                science: 25000,
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
        sunObservation: {
            effectDesc:
                "Planter crabs are four times as effective. Is a suns worth many fish? We can see a sun, but where is it really? And what is it made of?",
            cost: {
                science: 5000,
            },
            required: {
                upgrades: ["kelpHorticulture"],
                seen: ["kelp"],
            },
            effect: {
                incomeMultiplier: {
                    planter: 4,
                },
            },
        },
        crabBiology: {
            name: "Crab Biology",
            desc: "Crabs are a mystery. They keep to themselves and dig up crystals or put down plants. What is even up with that? What ARE crabs??",
            cost: {
                science: 10000,
                kelp: 1000,
            },
            required: {
                upgrades: ["biology", "sunObservation"],
                resources: ["crab"],
            },
        },
        exploration: {
            cost: {
                science: 32500,
                fish: 50000,
            },
        },
        whaleCommunication: {
            name: "Whale Communication",
            desc: "We can hear faint cries in the distance. What is out there?",
            researchedMessage:
                "Okay, 'whales' are out there. They're similar to dolphins, except less rude, and really big. Oh, and, they collect tons of fish.",
            effectDesc: "Whales can now be recruited.",
            cost: {
                fish: 2000000,
            },
            required: {
                upgrades: ["exploration"],
            },
        },
        aquamarineFusion: {
            name: "Aquamarine Fusion",
            desc: "The kelp papyrus things have instructions on how to make some gross thing called delphinium, so now we feel obligated to make it. Are we sure we want to do this?",
            researchedMessage:
                "Using the knowledge gained from the kelp slab things, we've figured out how to make delphinium and now we feel gross.",
            effectDesc: "Enables transmutation of a bunch of junk into delphinium.",
            cost: {
                science: 125000,
                coral: 200000,
                crystal: 150000,
            },
            required: {
                upgrades: ["delphineHistory"],
            },
        },
        dolphinTechnology: {
            name: "Dolphin Technology",
            desc: "Regardless of the material, the machines might be good. Probably not, but we're going to be thorough anyways.",
            researchedMessage:
                "Dolphin technology is pretty ornate. We spent more time figuring out which parts weren't strictly necessary than we did actually building machines!",
            effectDesc: "We've figured out some dolphin machinery. As expected, it's not the best - but it'll have to do.",
            cost: {
                science: 50000,
                delphinium: 15000,
            },
            required: {
                upgrades: ["aquamarineFusion"],
                seen: ["delphinium"],
            },
        },
        /* Equivalent of farExploration.. named differently for unlocks or smth I think? */
        farHavenExploration: {
            name: "Far Exploration",
            desc: "Explore the vast reaches beyond the home ocean, and look for that portal that keeps popping up in dolphin texts.",
            researchedMessage: "Crystal-rich deposits were found, as well as what appears to be the portal of dolphin legend.",
            effectDesc: "Crabs are 4 times as effective, planters 8 times. Did you know oceans are actually even bigger than big? Remarkable!",
            cost: {
                science: 375000,
                fish: 10000000,
            },
            required: {
                upgrades: ["whaleCommunication", "delphineHistory"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    planter: 4,
                },
            },
        },
        whaleSong: {
            name: "The Whale Song",
            desc: "The whales claim to know segments of some form of ancient ethereal music that connects worlds. We can collect what they know to piece it together ourselves.",
            researchedMessage: "What we've put together is definitely a song...but something's missing. This can't be the whole thing.",
            effectDesc:
                "Whales are 4 times as effective. The whales have worked with us to put together pieces of an ancient song. We don't think it's everything, though.",
            cost: {
                fish: 500000000,
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
        retroactiveRecordkeeping: {
            name: "Retroactive Recordkeeping",
            desc: "We've been sitting on a massive stockpile of these kelp papyrus...things. Maybe we should try organizing them.",
            researchedMessage: "The dolphins were the first to volunteer with helping to organize this stuff. I GUESS we could give them a chance.",
            effectDesc:
                "Scientists are 16 times as effective. Can now assign dolphins as historians who will help catalogue all of the information we have on these kelp things.",
            cost: {
                science: 2000000,
            },
            required: {
                totals: {
                    science: 800000,
                },
                upgrades: ["dolphinTechnology"],
            },
            effect: {
                incomeMultiplier: {
                    scientist: 16,
                },
            },
        },
        imperialDesigns: {
            name: "Imperial Designs",
            desc: "Finally, we've found them! After rummaging through the kelp papyrus for a bit, we came across the original designs for the dolphin machines.",
            researchedMessage:
                "Upon further examination, these suck! These designs will never work! Look, let's show them-- oh. Oh, apparently they do. Huh.",
            effectDesc:
                "Kelp cultivators and crimson combines are 4 times faster, and tireless crafters are four times as efficient. We begrudingly admit their quality is not entirely terrible.",
            cost: {
                science: 7500000,
                delphinium: 250000,
            },
            required: {
                upgrades: ["dolphinTechnology"],
                seen: ["crimsonCombine", "kelpCultivator", "tirelessCrafter"],
            },
            effect: {
                incomeMultiplier: {
                    crimsonCombine: 4,
                    kelpCultivator: 4,
                },
                incomeBoost: {
                    tirelessCrafter: 4,
                },
            },
        },
        ancientAgriculture: {
            name: "Ancient Agriculture",
            desc: "Now that we've got it all in one place, we're finding that a lot of these pages on farming methods are part of an entire book!",
            researchedMessage:
                "We spent so long arguing with the dolphins about minute details that a small group of dolphins and sharks finished sorting it before we even decided on a plan. Oops.",
            effectDesc:
                "Planter crabs times 16, kelp cultivators times 2, all coral income times 4. Nobody has talked about the wasteful argument since it happened...we thought the dolphins would rub it in our faces by now, but they seem totally disinterested.",
            cost: {
                science: 50000000,
                delphinium: 1000000,
            },
            required: {
                upgrades: ["retroactiveRecordkeeping"],
            },
            effect: {
                incomeMultiplier: {
                    planter: 16,
                    kelpCultivator: 2,
                },
                resourceBoost: {
                    coral: 4,
                },
            },
        },
        crystallineConstruction: {
            name: "Crystalline Construction",
            desc: "The dolphins are a bunch of jerks, but maybe we can still learn from one another. Maybe.",
            researchedMessage:
                "By integrating shark science with dolphin design, we've managed to create a superior set of machines. Maybe we work better together than we do apart.",
            effectDesc:
                "All dolphin machines run eight times as fast, except tireless crafters, which are 8 times as efficient. Holy moley! Also, shark science is way more informative now that we have more perspective, so scientists are 16 times faster.",
            cost: {
                science: 500000000,
                delphinium: 1500000,
            },
            required: {
                upgrades: ["retroactiveRecordkeeping", "ancientAgriculture"],
            },
            effect: {
                incomeMultiplier: {
                    kelpCultivator: 8,
                    crimsonCombine: 8,
                    scientist: 16,
                },
                incomeBoost: {
                    tirelessCrafter: 8,
                },
            },
        },
        eternalSong: {
            name: "The Eternal Song",
            desc: "The song of the whales is mentioned in dolphin texts dating back as far as we can find. I think we're onto something.",
            researchedMessage:
                "The song of the whales was only ever half of the composition. The dolphins were the key to completing it. Now we have the pieces.",
            effectDesc:
                "Whales and dolphins and treasurers times 16, biologists times 4. A chorus of whales and dolphins can be assembled to sing the eternal song, but we have no clue what it will do.",
            cost: {
                science: 2000000000,
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
    },
    frigid: {
        crystalBite: {
            cost: {
                science: 40,
                fish: 100,
            },
            required: {
                upgrades: ["civilContact"],
            },
        },
        urchinAttraction: {
            name: "Urchin Attraction",
            desc: "We can see these little spiny balls moving around on the ocean floor. What are they? Why are they everywhere?!",
            researchedMessage: "We have made two miraculous discoveries: they're sentient (barely), and they are painful to touch.",
            effectDesc:
                "We've managed to attract the attention of one of the sea urchins, and it's bringing stuff to us. I think it likes us?? Maybe???",
            cost: {
                science: 50,
            },
            required: {
                upgrades: ["civilContact"],
            },
            events: ["frigidAddUrchin"],
        },
        crystalContainer: {
            cost: {
                science: 75,
                crystal: 25,
            },
            required: {
                upgrades: ["civilContact"],
            },
        },
        statsDiscovery: {
            cost: {
                science: 50,
            },
        },
        underwaterChemistry: {
            cost: {
                science: 125,
                crystal: 25,
            },
        },
        seabedGeology: {
            researchedMessage: "Not only did we find a whole bunch of weird things, we found that there was more sand!",
            effectDesc:
                "Urchins gather sand twice as fast. Not that they understand how to do it faster, but that we've shown them better techniques to mimic.",
            cost: {
                science: 200,
                sand: 100,
            },
            required: {
                upgrades: ["urchinAttraction", "crystalContainer"],
            },
            effect: {
                sandMultiplier: {
                    urchin: 2,
                },
            },
        },
        civilContact: {
            name: "Civil Contact",
            desc: "We see a number of strange structures through the gap in the ice. What are we looking at, exactly?",
            researchedMessage: "We visited the structures, and it turns out it's an entire civilization!",
            effectDesc: "Found the squids. They can be enlisted to help catch fish. Also moved to a less frozen place.",
            cost: {
                science: 40,
            },
        },
        teamSpirit: {
            name: "Team Spirit",
            desc: "The squid seem adamant on showing us the way of teamwork, or something.",
            researchedMessage:
                "The squid said something about being efficient and cooperative and blah blah blah. It's a little pretentious, but I GUESS they have a point.",
            effectDesc: "Sharks, crabs, urchins, extraction teams, scientists, and squid production times 2. Go team?",
            cost: {
                science: 3000,
            },
            required: {
                upgrades: ["crabBiology", "squidBiology"],
                seen: ["extractionTeam"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                    crab: 2,
                    squid: 2,
                    urchin: 2,
                    scientist: 2,
                    extractionTeam: 2,
                },
            },
        },
        agriculture: {
            name: "Agriculture",
            desc: "The hunter-gatherer lifestyle seems like the only option, but maybe we could learn something more sustainable?",
            researchedMessage:
                "It sorta worked. We've had to plant kelp all over the place, since the urchins just tear through it if it's all together.",
            effectDesc: "Urchins gather kelp twice as fast. Just kelp. Only the kelp.",
            cost: {
                science: 350,
                sand: 400,
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
        assistedExtraction: {
            name: "Assisted Extraction",
            desc: "Crabs take forever to get crystals. The squid insist that working together will help. I guess it's better than nothing.",
            researchedMessage:
                "A crab can reach places a squid cannot, and a squid can help a crab get around faster. The squid were right, this is great!",
            effectDesc: "We may now organize crabs and squid into teams of 2 to expedite crystal extraction.",
            cost: {
                science: 650,
                kelp: 250,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        biology: {
            cost: {
                science: 1000,
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
            name: "Squid Biology",
            desc: "Discover the secrets of squid reproduction.",
            researchedMessage: "",
            effectDesc: "Squid are twice as effective. Squid can now be assigned to breed in a collective.",
            cost: {
                science: 1500,
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
            cost: {
                science: 2000,
                kelp: 2500,
            },
            required: {
                upgrades: ["biology", "sunObservation"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 2,
                },
            },
        },
        urchinBiology: {
            name: "Urchin Biology",
            desc: "Discover how these little things get so numerous.",
            researchedMessage: "Indirectly, as it turns out. Ew.",
            effectDesc: "Urchins are twice as effective. Urchins can now be assigned to go make more urchins.",
            cost: {
                science: 1750,
                kelp: 750,
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
        sunObservation: {
            name: "Sun Observation",
            desc: "We must determine what is with the weird glare on the surface of the water.",
            researchedMessage: "Shark science has discovered the sun! It has also discovered that looking directly into the sun hurts.",
            effectDesc:
                "Urchins collect kelp twice as fast. Is a suns worth many fish? We can see a sun, but where is it really? And what is it made of?",
            cost: {
                science: 1750,
            },
            required: {
                upgrades: ["agriculture"],
            },
            effect: {
                kelpMultiplier: {
                    urchin: 2,
                },
            },
        },
        exploration: {
            name: "Exploration",
            desc: "Swim beyond the home seas to see what can be found!",
            researchedMessage: "Found lots of fish, but also a giant wall of cracked ice. It's like a bubble around us as far as we can see!",
            effectDesc: "Sharks are twice as effective, squids are twice as effective. Did you know oceans are big? Fascinating!",
            cost: {
                science: 6500,
                fish: 25000,
            },
            required: {
                upgrades: ["sunObservation"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                    squid: 2,
                },
            },
        },
        glacialNavigation: {
            name: "Glacial Navigation",
            desc: "Explore the icebergs that lie beyond the warmth. Maybe we can learn something useful?",
            researchedMessage:
                "Exploring the icebergs yielded...more icebergs. It's a cold world out there, but there are untapped crystal reserves at the border.",
            effectDesc: "Extraction teams are four times as effective thanks to newly-discovered crystal deposits.",
            cost: {
                science: 8000,
                fish: 90000,
            },
            required: {
                upgrades: ["exploration"],
            },
            effect: {
                incomeMultiplier: {
                    extractionTeam: 4,
                },
            },
        },
        transmutation: {
            name: "Transmutation",
            desc: "By heating things up and doing science things to them, maybe new things can be made!",
            researchedMessage: "A new form of material has been discovered! It has been named after its discoverer, Dr. Sharkonium.",
            effectDesc: "Enables transmutation of some random junk we have lying around into sharkonium, material of the future.",
            cost: {
                science: 3500,
                crystal: 1000,
                sand: 10000,
            },
            required: {
                upgrades: ["underwaterChemistry", "seabedGeology"],
            },
        },
        automation: {
            name: "Automation",
            desc: "Using sharkonium, we can make things to do things so we don't have to do the things!",
            researchedMessage: "Now we don't have to do all the work, machines can do it for us! Future!!",
            effectDesc: "Machines can be built to supplement population duties. This is efficient.",
            cost: {
                science: 10000,
                sharkonium: 4000,
            },
            required: {
                upgrades: ["transmutation"],
            },
        },
        internalInvestigation: {
            name: "Internal Investigation",
            desc: "There's something up with that big machine. Why is it there? What does it do? Why is there a gate attached to it?",
            researchedMessage:
                "When we went to tamper with the machine, we found a secret hatch. It leads to a massive underground complex beneath the village!",
            effectDesc: "We accidentally discovered the underground complex. The squid do not seem to know we have stumbled upon it.",
            cost: {
                science: 35000,
            },
            required: {
                upgrades: ["automation"],
                seen: ["fishMachine", "crystalMiner", "sandDigger"],
            },
        },
        artificialHeating: {
            name: "Artificial Heating",
            desc: "Okay, seriously, I'm getting real sick of being cold all the time! How do we heat stuff up?",
            researchedMessage: "With machines, of course! And copious amounts of kelp for power. Don't ask.",
            effectDesc: "Developed artificial heating machines to battle the ice.",
            cost: {
                science: 20000,
                kelp: 250000,
            },
            required: {
                upgrades: ["automation"],
                seen: ["fishMachine", "crystalMiner", "sandDigger"],
            },
        },
        engineering: {
            name: "Engineering",
            desc: "The machines sort of suck. Let's make them better by learning how!",
            researchedMessage: "The machines are twice as good now! We've figured out new designs in the process, too!",
            effectDesc: "Machines are twice as effective. Auto-transmuters are now possible to create.",
            cost: {
                science: 55000,
                sharkonium: 10000,
            },
            required: {
                upgrades: ["automation"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                },
                heaterMultiplier: {
                    heater: 2,
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
                science: 180000,
                sharkonium: 40000,
            },
            required: {
                upgrades: ["engineering"],
            },
        },
        iterativeDesign: {
            name: "Iterative Design",
            desc: "The machines are useful, but they could be better. Let's build new ones, from scratch!",
            researchedMessage: "As it turns out, science is about learning from mistakes, or so the scientists say. About their own mistakes.",
            effectDesc: "Scientists are 4 times as effective, and all shark machines run twice as fast. Again!",
            cost: {
                science: 350000,
                sharkonium: 75000,
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
                    scientist: 4,
                },
                heaterMultiplier: {
                    heater: 2,
                },
            },
        },
        superprocessing: {
            name: "Superprocessing",
            desc: "The recycler wasn't really meant for millions of fish at once. Seeing as that transaction is fairly common, we should probably do something about it.",
            researchedMessage: "Eureka! If we make the big things bigger, and the grinders grindier, we can process way more material at once!",
            effectDesc:
                "The recycler's efficiency only starts dropping at 10 million material inserted at once, instead of 100 thousand. The base efficiency is now 100%.",
            cost: {
                science: 4e6,
                sharkonium: 250000,
                junk: 1e6,
            },
            required: {
                upgrades: ["iterativeDesign", "recyclerDiscovery"],
            },
        },
        creatureCoalition: {
            name: "Creature Coalition",
            desc: "Everyone feels it; the cold eats at us all. The squid are right, we have to cooperate to make progress.",
            researchedMessage:
                "Had a sort of group huddle to decide our plan. The squid had some sort of motivational speech prepared or something, and it seems to have lifted the frenzy's spirits.",
            effectDesc: "Sharks and crabs x8. Urchins, squids, extraction teams and scientists x4. Go team!",
            cost: {
                science: 1250000,
            },
            required: {
                upgrades: ["internalInquiry"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 8,
                    crab: 8,
                    urchin: 4,
                    squid: 4,
                    scientist: 4,
                    extractionTeam: 4,
                },
            },
        },
        internalExpedition: {
            name: "Internal Expedition",
            desc: "We have the resources to launch a secret expedition into the machine. Its secrets must be known.",
            researchedMessage: "The expedition went well, but on the way out, a squid noticed us leaving the machine. I guess the jig is up.",
            effectDesc:
                "Scientists are twice as effective. Discovered little more than endless hallways of unrecognizable text and rooms filled with incomprehensible control schemes.",
            cost: {
                science: 100000,
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                },
            },
            required: {
                upgrades: ["internalInvestigation"],
            },
        },
        internalInquiry: {
            name: "Internal Inquiry",
            desc: "We haven't spoken to the squid about what happened. Maybe we should say something.",
            researchedMessage:
                "They're not mad, just disappointed. They had hoped we would work together with them - they don't understand the controls either, as it turns out.",
            effectDesc:
                "Squid and collectives x2, extraction teams x4. Reconciled with the squids. They told us what they know about the machine's inner workings.",
            cost: {
                science: 250000,
            },
            effect: {
                incomeMultiplier: {
                    squid: 2,
                    extractionTeam: 4,
                    collective: 2,
                },
            },
            required: {
                upgrades: ["internalExpedition", "engineering"],
            },
        },
        rapidRecharging: {
            name: "Rapid Recharging",
            desc: "Replace the battery. Melt the ice. Open the gate.",
            researchedMessage:
                "A wave of heat washes over you as the switch is flipped. The ice around the village quickly vaporizes, and like magic, a giant bubble is carved in the surrounding glaciers.",
            effectDesc: "Battery has been replaced. All the nearby ice has melted and we can now begin using the gate.",
            cost: {
                science: 3250000,
                sharkonium: 250000,
            },
            required: {
                upgrades: ["internalInquiry", "iterativeDesign"],
            },
        },
    },
    shrouded: {
        crystalBite: {},
        crystalSpade: {},
        crystalContainer: {},
        statsDiscovery: {},
        underwaterChemistry: {
            cost: {
                science: 250,
                crystal: 50,
            },
        },
        seabedGeology: {
            name: "Seabed Geology",
            desc: "Find the ocean floor once and for all. No more bottomless-sea-diving shenanigans.",
            researchedMessage:
                "Not only did we actually figure out where the floor is, we met the weird wiggly creatures! They apologized for their earlier hesitence. Something about sharks and eating.",
            effectDesc: "Rays gather sand twice as fast now that we...know where the sand is, and eels can be recruited into the frenzy.",
            cost: {
                science: 350,
                sand: 750,
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
            cost: {
                science: 450,
                sand: 1000,
            },
        },
        agriculture: {
            name: "Agriculture",
            desc: "The hunter-gatherer lifestyle will only work so well for us. Maybe we should gather these animals in one place and let them grow.",
            researchedMessage: "It is so much easier to get things when they're all in one place. It's like the ocean is our grotto now!",
            effectDesc: "Advances in agriculture will fuel future endeavors. Who knows what we'll do next!",
            cost: {
                science: 500,
                sand: 1000,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        jellyfishHunting: {
            name: "Jellyfish Hunting",
            desc: "Jellyfish are plenty in these blackened waters, but our attempts to catch them is met only with pain. We need better tactics.",
            researchedMessage: "The trick to catching jellyfish is caution and avoiding the stinging tendrils. They burn. Oh, they burn.",
            effectDesc: "Jellyfish can be caught like fish. Hey, a fish is a fish, right?",
            cost: {
                science: 750,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        jellyDiving: {
            name: "Jelly Diving",
            desc: "It's only natural to get sick of getting jellyfish yourself. Solution: make someone else do it!",
            researchedMessage: "Huzzah, the divers now collect jellyfish! They're- ooh. Oh, boy. That must have hurt.",
            effectDesc: "Shark divers now sometimes collect jellyfish. Here's hoping it's worth the trouble.",
            cost: {
                science: 1000,
                jellyfish: 20,
            },
            required: {
                upgrades: ["jellyfishHunting"],
                seen: ["jellyfish"],
            },
            effect: {
                addJellyIncome: {
                    diver: 0.05,
                },
            },
        },
        biology: {
            name: "Biology",
            desc: "What is a shark? What is inside a shark, except for large amounts of fish?",
            researchedMessage: "With a new understanding of their own biology, sharks can now specialise in the manufacture of new sharks.",
            effectDesc:
                "Sharks are twice as effective, and nurse sharks can be bought. Did you know shark eggs don't actually form just because a shark wills them to exist?",
            cost: {
                science: 1500,
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
        rayBiology: {
            name: "Ray Biology",
            desc: "Though kindred to the sharks, we know so little about the rays. If only we could fix this. We need to bait a sand trap.",
            researchedMessage:
                "Apparently we could have just asked. We learned how rays make more rays. It's kinda similar to sharks, really, but rays.",
            effectDesc:
                "Rays are twice as effective, and ray makers are available. We may never repair the shark-ray relations to their former state after how awkward this whole affair was.",
            cost: {
                science: 1750,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        eelHabitats: {
            name: "Eel Habitats",
            desc: "So we've seen the eels darting in and out of holes in the ground. We're not really sure what's up with that.",
            researchedMessage:
                "After some somewhat one-sided discussion with the eels on the nature of eel pits and crucial safety and security in the form of seabed holes, we understand...maybe.",
            effectDesc: "Eels are twice as effective now we know how they prefer to live. Also, they can now breed in pits, or something.",
            cost: {
                science: 2000,
            },
            required: {
                upgrades: ["biology"],
                resources: ["eel"],
                seen: ["eel"],
            },
            effect: {
                incomeMultiplier: {
                    eel: 2,
                },
            },
        },
        xenobiology: {
            name: "Xenobiology",
            desc: "Determine what is with these weird faceless creatures we keep finding.",
            researchedMessage: "Results inconclusive! Further research required. It could be such a benefit for science!",
            effectDesc: "We can dissect jellyfish for science. Gross.",
            cost: {
                science: 2750,
                jellyfish: 500,
            },
            required: {
                upgrades: ["jellyfishHunting", "biology"],
                seen: ["jellyfish"],
            },
            effect: {
                resourceBoost: {
                    jellyfish: 2,
                },
            },
        },
        creviceContemplation: {
            name: "Crevice Contemplation",
            desc: "What's in the holes that the eels dig? Why do they make them? How DOES an eel pit work?",
            researchedMessage:
                "All of our questions and more were answered by the antsy eels. We didn't need to know that much. Thanks, though, I guess??",
            effectDesc:
                "Eels are twice as effective, and so are eel pits. We learned some things we'd rather not have, but I guess they were just trying to help. I guess.",
            cost: {
                science: 7500,
            },
            required: {
                upgrades: ["eelHabitats"],
                seen: ["pit"],
            },
            effect: {
                incomeMultiplier: {
                    eel: 2,
                    pit: 2,
                },
            },
        },
        transmutation: {
            name: "Transmutation",
            desc: "By heating things up and doing science things to them, maybe new things can be made!",
            researchedMessage: "A new form of material has been discovered! It has been named after its discoverer, Dr. Sharkonium.",
            effectDesc: "Enables transmutation of some random junk we have lying around into sharkonium, material of the future.",
            cost: {
                science: 10000,
                crystal: 1000,
                sand: 25000,
            },
            required: {
                upgrades: ["thermalVents"],
            },
        },
        automation: {
            name: "Automation",
            desc: "Using sharkonium, we can make things to do things so we don't have to do the things!",
            researchedMessage: "Now we don't have to do all the work, machines can do it for us! Future!!",
            effectDesc: "Machines can be built to supplement population duties. This is efficient.",
            cost: {
                sharkonium: 1000,
            },
            required: {
                upgrades: ["transmutation"],
            },
        },
        exploration: {
            name: "Exploration",
            desc: "Swim beyond the home seas to see what can be found!",
            researchedMessage: "Found lots of schools of fish, and so much sand! We also stumbled upon some gigantic chasms in the seafloor!",
            effectDesc: "Sharks and rays and divers are twice as effective. Did you know oceans are big? Fascinating!",
            cost: {
                science: 22500,
                fish: 15000,
            },
            required: {
                upgrades: ["xenobiology"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                    ray: 2,
                    diver: 2,
                },
            },
        },
        engineering: {
            name: "Engineering",
            desc: "The machines sort of suck. Let's make them better by learning how!",
            researchedMessage: "The machines are twice as good now! We've figured out new designs in the process, too!",
            effectDesc: "Machines are twice as effective.",
            cost: {
                science: 30000,
                sharkonium: 10000,
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
        chimaeraReunification: {
            name: "Chimaera Reunification",
            desc: "What are those things? Why do they look like sharks? Are they sharks? They're probably sharks. We should go say hi.",
            researchedMessage: "Yeah, they're sharks alright. Sort of. Like, they're close enough! Most say they're glad to see us.",
            effectDesc: "Chimaeras can be recruited. We sharks should stick together!",
            cost: {
                science: 45000,
                jellyfish: 2500,
            },
            required: {
                upgrades: ["exploration"],
                seen: ["jellyfish"],
            },
        },
        shroudedChasmExploration: {
            name: "Chasm Exploration",
            desc: "The chimaeras say they can help us navigate the chasms. With their help, we could throw together an expedition and see what's down there.",
            researchedMessage:
                "The dive team is back, and...we have no idea what we have here! Seriously! Even the chimaeras don't know what these are.",
            effectDesc: "Chimaeras find jellyfish twice as fast. We found some weird artifact thingies, but we don't know what's up with them.",
            cost: {
                science: 125000,
                fish: 1500000,
            },
            required: {
                upgrades: ["chimaeraReunification"],
                seen: ["chimaera"],
            },
            effect: {
                incomeMultiplier: {
                    chimaera: 2,
                    diver: 2,
                },
            },
        },
        iterativeDesign: {
            name: "Iterative Design",
            desc: "The machines are useful, but they could be better. Let's build new ones, from scratch!",
            researchedMessage: "As it turns out, science is about learning from mistakes, or so the scientists say. About their own mistakes.",
            effectDesc: "All shark machines run twice as fast. Again! Scientists are 4 times faster as well.",
            cost: {
                science: 275000,
                sharkonium: 27500,
            },
            required: {
                upgrades: ["engineering"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                    scientist: 4,
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
                science: 500000,
                sharkonium: 50000,
            },
            required: {
                upgrades: ["engineering"],
            },
        },
        abyssalEnigmas: {
            name: "Abyssal Enigmas",
            desc: "The chimaeras have returned from the deeper oceans with artifacts we can't explain. The chimaera don't seem bothered, but we need to work together to understand them.",
            researchedMessage:
                "From what little we have, we can tell that these all go together somehow; they're all part of something bigger... We need to find more of them!",
            effectDesc:
                "Chimaeras are twice as effective, and can now be assigned to explore the chasms for more of these...you know what, let's call them 'arcana'. If we get enough of them together, maybe we could learn their original purpose?",
            cost: {
                science: 2500000,
                jellyfish: 100000,
            },
            required: {
                upgrades: ["shroudedChasmExploration"],
            },
            effect: {
                incomeMultiplier: {
                    chimaera: 2,
                },
            },
        },
        arcaneSifting: {
            name: "Arcane Sifting",
            desc: "An eel just came back with a tiny piece of arcana-looking rubble, excitedly yelling about how they found it in the sand. Are we onto something here?",
            researchedMessage: "Eels tasked with sifting through the sand have come back with even more arcana. We should keep this up!",
            effectDesc: "Can train eels to sift through sand in search of arcana.",
            cost: {
                sand: 5000000,
                arcana: 40,
            },
            required: {
                upgrades: ["shroudedChasmExploration"],
                seen: ["arcana"],
            },
        },
        arcaneStudy: {
            name: "Arcane Study",
            desc: "We see some rays staring curiously at our collection of arcana. Where have I seen this before?",
            researchedMessage: "The scientists have helped to teach the rays in the ways of their study. Our understanding grows ever stronger.",
            effectDesc:
                "Rays can be trained in the ways of science, becoming scholars and studying arcana to better our understanding of it. Their sudden interest is rather uncanny to us.",
            cost: {
                science: 2000000,
                arcana: 200,
            },
            required: {
                upgrades: ["shroudedChasmExploration"],
                seen: ["arcana"],
            },
        },
        arcaneCompass: {
            name: "Arcane Compass",
            desc: "The thinnest, straightest shards of arcana have been observed to rotate toward a common direction when left undisturbed. What are they pointing to?",
            researchedMessage:
                "We placed some shards in a clear box and let them point us around for a while. They led us straight to a dilapidated gate.",
            effectDesc:
                "All arcana gains x2. We've since learned to use the arcana for other navigational tasks, which makes exploring for them more efficient.",
            cost: {
                arcana: 750,
            },
            required: {
                upgrades: ["arcaneStudy"],
                seen: ["scholar"],
            },
            effect: {
                resourceBoost: {
                    arcana: 2,
                },
            },
        },
        chimaeraMysticism: {
            name: "Chimaera Mysticism",
            desc: "We know the chimaeras, but we don't know them very well. They keep speaking to us like we never have any questions. We do!",
            researchedMessage:
                "We finally confronted the chimaeras about our lack of understanding. Right after we said it, there was this awkward silence, and then they started talking pretty clearly. What was that all about?",
            effectDesc:
                "Chimaeras and chimaera explorers are twice as effective now that we can actually talk to them. They've since been a lot less enthusiastic to work with us. What's with them?",
            cost: {
                science: 7500000,
                jellyfish: 150000,
            },
            required: {
                upgrades: ["arcaneCompass"],
            },
            effect: {
                incomeMultiplier: {
                    chimaera: 2,
                    explorer: 2,
                },
            },
        },
        bioelectricity: {
            name: "Bioelectricity",
            desc: "Further study has revealed arcana to be incredibly electrically conductive. We can't really make circuits out of them, but...well, there's this other idea...",
            researchedMessage:
                "We've developed special tools that technically-inclined electric eels can use to pump bioelectricity directly into machines! Brilliant?",
            effectDesc: "Machines are four times as effective. Eel-harnessed energy is weird, but practical.",
            cost: {
                sharkonium: 200000,
                arcana: 2000,
            },
            required: {
                upgrades: ["arcaneCompass", "iterativeDesign"],
            },
            effect: {
                incomeMultiplier: {
                    fishMachine: 4,
                    sandDigger: 4,
                    crystalMiner: 4,
                },
            },
        },
        arcaneSacrifice: {
            name: "Arcane Sacrifice",
            desc: "Further study has revealed arcana to be shards of a sort of huge, abstract battery for...something. If harnessed, this could change everything.",
            researchedMessage:
                "It turns out that the innate energy contained within the arcana can be violently released when shattered. If we do it just right, then we reap all the benefits.",
            effectDesc: "Arcana can now be shattered, sacrificing them for the greater good.",
            cost: {
                arcana: 10000,
            },
            required: {
                upgrades: ["arcaneCompass"],
            },
        },
        superprocessing: {
            name: "Superprocessing",
            desc: "The recycler wasn't really meant for millions of fish at once. Seeing as that transaction is fairly common, we should probably do something about it.",
            researchedMessage: "Eureka! If we make the big things bigger, and the grinders grindier, we can process way more material at once!",
            effectDesc:
                "The recycler's efficiency only starts dropping at 10 million material inserted at once, instead of 100 thousand. The base efficiency is now 100%.",
            cost: {
                science: 10000000,
                sharkonium: 2e6,
                junk: 1e7,
            },
            required: {
                upgrades: ["bioelectricity", "recyclerDiscovery"],
            },
        },
        ancestralRecall: {
            name: "Ancestral Recall",
            desc: "The sharks and rays, and even chimaeras, know we share some features among ourselves. Using the strange tales passed down by chimaeras, let's piece together the puzzle.",
            researchedMessage:
                "These tales speak plainly about a frenzy not unlike our own. It's said that what came of it was glorious, but all of the specifics have been lost to time, it seems.",
            effectDesc:
                "Sharks, rays and chimaeras, and their roles, are all four times as effective. Except divers. They're 16 times as effective. We have had a glorious past. Now, on to a glorious future.",
            cost: {
                science: 2e7,
            },
            required: {
                upgrades: ["arcaneSacrifice"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 4,
                    diver: 16,
                    scientist: 4,
                    nurse: 4,
                    ray: 4,
                    maker: 4,
                    chimaera: 4,
                    explorer: 4,
                },
            },
        },
        arcaneHeart: {
            name: "Arcane Heart",
            desc: "The eels aren't really venturing outward like the rest of us. Something about safety in numbers... We need to figure out what role they played in all this. Maybe that'll show them their own potential.",
            researchedMessage:
                "An extensive canvasing of the ocean floor had lead to the discovery of an ancient system of subterranian eel burrows, containing tools and machinery, and bits of...well...they look like arcana, but they're not glowing.",
            effectDesc:
                "Newfound confidence makes eels and their roles four times as effective. Also, closer inspection shows that the cache of arcana in the burrows isn't even in shards. They're like big, geometric chunks of the stuff.",
            cost: {
                science: 4e7,
            },
            required: {
                upgrades: ["arcaneSacrifice", "bioelectricity"],
                resources: ["eel"],
            },
            effect: {
                incomeMultiplier: {
                    eel: 4,
                    pit: 4,
                    sifter: 4,
                },
            },
        },
        arcaneActivation: {
            name: "Arcane Activation",
            desc: "The gate beckons.",
            researchedMessage:
                "The power of the arcana flashes away in a blinding light as it is smashed. When we open our eyes again, gate has been brought to life.",
            effectDesc: "...",
            cost: {
                science: 2e10,
                arcana: 1000000,
            },
            required: {
                upgrades: ["arcaneSacrifice"],
            },
        },
    },
    marine: {
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
        seabedGeology: {
            name: "Seabed Geology",
            desc: "Study the bottom of the ocean to determine the rich, deep, juicy secrets it contains.",
            researchedMessage: "Not only did we find a whole bunch of weird things, the rays found that there was more sand!",
            effectDesc: "Rays are twice as effective with their understanding of the seabed and its varieties of sediment.",
            cost: {
                science: 300,
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
        underwaterChemistry: {
            name: "Underwater Chemistry",
            desc: "With the weird bottles, we can now put things and other things into them and see what happens.",
            researchedMessage: "Well, nothing useful was determined, but if we keep on doing it we make tremendous leaps for science!",
            effectDesc: "Scientists are twice as effective with their new chemical insights.",
            cost: {
                science: 450,
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
        clamScooping: {
            name: "Clam Scooping",
            desc: "We see these things all over the seabed but we can't tell which are clams and which are rocks.",
            researchedMessage:
                "Patient observation has shown that clams and rocks are in fact different and distinct things. Now we won't be scooping up any more rocks!",
            effectDesc: "Clams can be collected like fish.",
            cost: {
                science: 750,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        thermalVents: {
            name: "Thermal Vents",
            desc: "Investigate the boiling vents that just seem to keep on heating things up.",
            researchedMessage: "This is a wondrous, unending source of heat! Something good must come from this.",
            effectDesc: "A power source for future technologies has been discovered.",
            cost: {
                science: 1500,
                sand: 1000,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        pearlConversion: {
            name: "Pearl Conversion",
            desc: "The lobsters say they know how to make the shiny things (I think they're called pearls) inside of clams into crystals. Let's see if we can't figure this out.",
            researchedMessage: "Well, we can transmute pearls to crystals now, but we need more of the clam. The whole clam. Yes. The entire clam.",
            effectDesc:
                "We can turn clams into crystals using the pearls inside them as a focus. Maybe one day we won't need to use the entire clam.",
            cost: {
                science: 2000,
                clam: 500,
                crystal: 100,
            },
            required: {
                upgrades: ["thermalVents"],
                seen: ["lobster"],
            },
        },
        agriculture: {
            name: "Agriculture",
            desc: "The hunter-gatherer lifestyle will only work so well for us. Maybe we should gather these animals in one place and let them grow.",
            researchedMessage: "It is so much easier to get things when they're all in one place. It's like the ocean is our grotto now!",
            effectDesc: "Advances in agriculture will fuel future endeavors. Who knows what we'll do next!",
            cost: {
                science: 4500,
                sand: 10000,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        biology: {
            name: "Biology",
            desc: "What is a shark? What is inside a shark, except for large amounts of fish?",
            researchedMessage: "With a new understanding of their own biology, sharks can now specialise in the manufacture of new sharks.",
            effectDesc:
                "Sharks are twice as effective, and nurse sharks can be bought. Did you know shark eggs don't actually form just because a shark wills them to exist?",
            cost: {
                science: 2500,
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
        crustaceanBiology: {
            name: "Crustacean Biology",
            desc: "These strange creatures related to crabs require further investigation. What is with exoskeletons?",
            researchedMessage: "We've figured out how these shellfish function. There's far too many limbs involved.",
            effectDesc:
                "Shrimp and lobsters are twice as effective. Lobsters can now gather other things or cover themselves in shiny eggs, also called 'berries'. What's a berry?",
            cost: {
                science: 2500,
                clam: 1000,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    lobster: 2,
                },
            },
        },
        sunObservation: {
            name: "Sun Observation",
            desc: "We must determine what is with the weird glare on the surface of the water.",
            researchedMessage: "Shark science has discovered the sun! It has also discovered that looking directly into the sun hurts.",
            effectDesc: "",
            cost: {
                science: 5000,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        kelpHorticulture: {
            name: "Kelp Horticulture",
            desc: "Determine what it takes to plant kelp all over the seabed. Maybe this is useful.",
            researchedMessage: "Crab-specific gear has been invented to allow for kelp farming! This is possibly useful.",
            effectDesc: "Crabs can become kelp farmers and grow a living carpet across the bottom of the sea.",
            cost: {
                science: 1000,
                sand: 5000,
            },
            required: {
                upgrades: ["sunObservation"],
            },
        },
        xenobiology: {
            name: "Xenobiology",
            desc: "Determine what is with these weird faceless creatures we keep finding.",
            researchedMessage: "Results inconclusive! Further research required. It could be such a benefit for science!",
            effectDesc:
                "Kelp produces sea apples twice as fast. We can dissect sea apples and jellyfish for science. Also, sea apple isn't a fruit. Gross.",
            cost: {
                seaApple: 25,
            },
            required: {
                upgrades: ["kelpHorticulture"],
                seen: ["seaApple"],
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
                "Rays and laser rays are twice as effective, and ray makers are available. We may never repair the shark-ray relations to their former state after how awkward this whole affair was.",
            cost: {
                science: 10000,
                sand: 2500,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        crabBiology: {
            name: "Crab Biology",
            desc: "Crabs are a mystery. They keep to themselves and dig up crystals or put down plants. What is even up with that? What ARE crabs??",
            researchedMessage:
                "It turns out crabs are friendly crustaceans that have revealed to the sharks the secrets of crab generation. It involves eggs, or something. Squirmy eggs.",
            effectDesc:
                "Crabs and planter crabs are four and two times as effective, respectively, and crab brood are available. Crabs are alright but they are also sort of terrifying and weird. Good thing they're on our side!",
            cost: {
                science: 12500,
                kelp: 100,
            },
            required: {
                upgrades: ["biology", "sunObservation"],
                seen: ["seaApple"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
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
                science: 25000,
                fish: 100000,
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
        transmutation: {
            name: "Transmutation",
            desc: "By heating things up and doing science things to them, maybe new things can be made!",
            researchedMessage: "A new form of material has been discovered! It has been named after its discoverer, Dr. Sharkonium.",
            effectDesc: "Enables transmutation of some random junk we have lying around into sharkonium, material of the future.",
            cost: {
                science: 250000,
                crystal: 40000,
                sand: 50000,
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
                sharkonium: 8000,
            },
            required: {
                upgrades: ["transmutation"],
            },
        },
        calciniumStudies: {
            name: "Calcinium Studies",
            desc: "The lobsters have seen our transmutation process, and they say it reminds them of some other transmutation process they used to do? Let's give it shot!",
            researchedMessage: "And there we have it, calcinium, I guess! Surprisingly strong and smooth.",
            effectDesc:
                "Learned how to manufacture calcinium. I wonder what it's for? The lobsters are currently in the process of consolidating their information on it.",
            cost: {
                seaApple: 25,
            },
            required: {
                upgrades: ["kelpHorticulture"],
                seen: ["seaApple"],
            },
            effect: {
                incomeMultiplier: {
                    kelp: 2,
                },
            },
        },
        engineering: {
            name: "Engineering",
            desc: "The machines sort of suck. Let's make them better by learning how!",
            researchedMessage: "The machines are twice as good now! We've figured out new designs in the process, too!",
            effectDesc: "Machines are twice as effective. Skimmers and auto-transmuters are now possible to create.",
            cost: {
                science: 250000,
                sharkonium: 17500,
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
        calciniumBiosynergy: {
            name: "Calcinium Biosynergy",
            desc: "So the lobsters remembered what calcinium is for. They're telling us about all the weird tools and machines they used to make with it. Let's try to piece the designs back together!",
            researchedMessage:
                "With enough tinkering, we've managed to recreate a few of their designs! They're not machines on their own, it's more like frenzy members wielding machines.",
            effectDesc:
                "Clam extractors, seabed strippers, and calcinium converters can be trained. The designs are for lobsters, but a communication error may have caused us to make two of them for non-lobsters. Whoops!",
            cost: {
                calcinium: 2500,
            },
            required: {
                upgrades: ["engineering"],
                seen: ["calcinium"],
            },
        },
        farExploration: {
            name: "Far Exploration",
            desc: "Explore the vast reaches beyond the home ocean.",
            researchedMessage: "Crystal-rich deposits were found, as well as strange, deep chasms.",
            effectDesc: "Crabs are four times as effective. Did you know oceans are actually even bigger than big? Remarkable!",
            cost: {
                science: 100000,
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
            desc: "The machines are useful, but they could be better. Let's build new ones, from scratch!",
            researchedMessage: "As it turns out, science is about learning from mistakes, or so the scientists say. About their own mistakes.",
            effectDesc: "All shark machines run twice as fast. Again! Scientists are 4 times faster as well.",
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
        highEnergyFusion: {
            name: "High-Energy Fusion",
            desc: "The lobsters are excited to show us their newest rediscovery: high-energy fusion! It involves",
            researchedMessage:
                "The lobsters showed us how fusing pearls and clams at a higher temperature can result in a waaay better clam to crystal ratio. We still have to use the whole clam, unfortunately.",
            effectDesc: "Reduced clam to crystal conversion ratio from 5-1 to 1-1. Recycler reshmycler, we have FUSION!!",
            cost: {
                science: 250000,
            },
            required: {
                upgrades: ["iterativeDesign"],
            },
            effect: {
                incomeMultiplier: {
                    calciniumConverter: 2,
                },
            },
        },
        bioengineering: {
            name: "",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                science: 696969,
                calcinium: 50000,
            },
            required: {
                upgrades: ["kelpHorticulture"],
                seen: ["seaApple"],
            },
            effect: {
                incomeMultiplier: {
                    kelp: 2,
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
        sentientCircuitBoards: {
            name: "",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                seaApple: 25,
            },
            required: {
                upgrades: ["kelpHorticulture"],
                seen: ["seaApple"],
            },
            effect: {
                incomeMultiplier: {
                    kelp: 2,
                },
            },
        },
        superprocessing: {
            name: "Superprocessing",
            desc: "The recycler wasn't really meant for millions of fish at once. Seeing as that transaction is fairly common, we should probably do something about it.",
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
        mobiusShells: {
            name: "",
            desc: "",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                seaApple: 25,
            },
            required: {
                upgrades: ["kelpHorticulture"],
                seen: ["seaApple"],
            },
            effect: {
                incomeMultiplier: {
                    kelp: 2,
                },
            },
        },
    },
};

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

SharkGame.Upgrades = {
    getUpgradeTable(type = w.worldType) {
        switch (type) {
            case "abandoned":
                return SharkGame.Upgrades.abandonedUpgrades;
            case "haven":
                return SharkGame.Upgrades.havenUpgrades;
            default:
                return SharkGame.Upgrades.standardUpgrades;
        }
    },

    /* sharks: {
        upgrades: [
            "crystalBite",
            "ancestralRecall"
        ],
        suggests: [
            "sharkmachines"
        ]
    },

    rays: {
        upgrades: ["crystalSpade", "laserRays", "rayBiology"],
    },

    crabs: {
        upgrades: ["crabBiology"],
    },

    lobsters: {
        upgrades: ["clamScooping"],
        implies: ["crustaceans"]
    },

    shrimp: {
        upgrades: ["eusociality", "wormWarriors"],
        implies: ["crustaceans"]
    },

    crustaceans: {
        upgrades: ["crustaceanBiology"],
        suggests: ["crustaceanmachines", "shrimp", "lobsters"],
        category: true
    },

    dolphins: {
        upgrades: [
            "dolphinBiology",
            "delphinePhilosophy",
            "coralHalls"
        ],
        implies: [
            "cetaceans"
        ]
    },
    
    whales: {
        upgrades: [
            "eternalSong"
        ],
        implies: [
            "cetaceans"
        ]
    },
    
    cetaceans: {
        upgrades: [
            "cetaceanAwareness",
            "primordialSong"
        ],
        suggests: [
            "cetaceantechnology",
            "dolphins",
            "whales"
        ],
        category: true
    },
    
    octopuses: {
        upgrades: [
            "octopusMethodology",
            "octalEfficiency",
            "eightfoldOptimisation"
        ],
        suggests: [
            "octopusmachines"
        ]
    },
    
    eels: {
        upgrades: [
            "eelHabitats",
            "creviceCreches",
            "bioelectricity",
            "leviathanHeart"
        ]
    },
    
    chimaera: {
        upgrades: [
            "chimaeraMysticism",
            "abyssalEnigmas"
        ]
    },
    
    sharkmachines: {
        upgrades: [
            "engineering",
            "recyclerDiscovery",
            "iterativeDesign",
            "superprocessing",
            "mechanisedAlchemy"
        ]
    },
    
    octopusmachines: {
        upgrades: [
            "industrialGradeSponge",
            "sprongeBiomimicry"
        ]
    },
    
    crustaceanmachines: {
        upgrades: [
            "coralglassSmelting",
            "coralCircuitry",
            "mobiusShells"
        ]
    },
    
    cetaceanmachines: {
        upgrades: [
            "dolphinTechnology",
            "imperialDesigns"
        ]
    },

    recycler: {
        upgrades: [
            "recyclerDiscovery",
            "superprocessing"
        ]
    }, */

    standardUpgrades: {
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

        /* test: {
            name: "Test",
            desc: "Double fish production.",
            researchedMessage: "null",
            effectDesc: "null",
            cost: {
                fish: 1,
            },
            effect: {
                boost: {
                    fish: 2,
                },
            },
        }, */

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
                "All the goods we've acquired are now being stored and itemised in a mostly flooded cavern system. No more stray currents washing it all away hopefully!",
            effectDesc: "By storing things in a centralised location, we now finally have an idea of what we're doing. Sort of.",
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

        spongeCollection: {
            name: "Sponge Collection",
            desc: "We can see these things littering the reefs and beds, but we don't know how to collect them without breaking them.",
            researchedMessage:
                "Understanding the fragile nature of sponges and their weird porous texture, we can now collect sponges by not biting so hard.",
            effectDesc: "Sponge can be collected in the same way fish can be.",
            cost: {
                science: 400,
            },
            required: {
                upgrades: ["seabedGeology"],
                resources: ["sponge"],
            },
        },

        jellyfishHunting: {
            name: "Jellyfish Hunting",
            desc: "Jellyfish are plenty in the farther waters, but our attempts to catch them is met only with pain. We need better tactics.",
            researchedMessage: "The trick to catching jellyfish is caution and avoiding the stinging tendrils. They burn. Oh, they burn.",
            effectDesc: "Jellyfish can be caught like fish. Hey, a fish is a fish, right?",
            cost: {
                science: 800,
            },
            required: {
                upgrades: ["seabedGeology"],
                resources: ["jellyfish"],
            },
        },

        clamScooping: {
            name: "Clam Scooping",
            desc: "We see these things all over the seabed but we can't tell which are clams and which are rocks.",
            researchedMessage:
                "Patient observation has shown that clams and rocks are in fact different and distinct things. Now we won't be scooping up any more rocks!",
            effectDesc: "Clams can be collected like fish.",
            cost: {
                science: 600,
            },
            required: {
                upgrades: ["seabedGeology"],
                resources: ["clam"],
            },
        },

        pearlConversion: {
            name: "Pearl Conversion",
            desc: "There's these things inside the clams that look shiny like crystals. Maybe we can transmute them to crystals?",
            researchedMessage: "Well, we can transmute pearls to crystals now, but we need more of the clam. The whole clam. Yes. The entire clam.",
            effectDesc:
                "We can turn clams into crystals using the pearls inside them as a focus. Maybe one day we won't need to use the entire clam.",
            cost: {
                science: 1500,
            },
            required: {
                upgrades: ["clamScooping", "transmutation"],
                resources: ["clam"],
                seen: ["clam"],
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
                resources: ["ray", "sand"],
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

        coralglassSmelting: {
            name: "Coralglass Smelting",
            desc: "Careful observation of crustacean smelting processes will let us copy their method for coralglass creation.",
            researchedMessage:
                "Our allies among the shelled creatures have revealed to us the secrets of underwater glassmaking! It's, uh, complicated.",
            effectDesc: "Enables smelting of coralglass, a vital component in crustacean technology.",
            cost: {
                science: 1000,
                coral: 3000,
                sand: 3000,
            },
            required: {
                upgrades: ["thermalVents", "crustaceanBiology"],
                resources: ["coral", "sand"],
                seen: ["coral"],
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

        thermalConditioning: {
            name: "Thermal Conditioning",
            desc: "We're freezing to death! Machines make heat, right? We need to work on this!!",
            researchedMessage: "Breakthrough! Machines can run alarmingly hot if we take out some of the safeguards!",
            effectDesc: "Heaters can be made to fight the freezing process. We don't want to become giant novelty ice cubes!",
            cost: {
                science: 500,
            },
            required: {
                upgrades: ["automation"],
                resources: ["ice"],
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

        coralCircuitry: {
            name: "Coral Circuitry",
            desc: "We almost know enough to replicate crustacean technology. Just a few core components remain.",
            researchedMessage: "We've unlocked the secrets of crustacean machinery. It's more environmentally friendly, but less efficient.",
            effectDesc: "We can copy some of the safe but slow machines used by the lobsters and shrimp.",
            cost: {
                science: 3000,
                coralglass: 3000,
            },
            required: {
                upgrades: ["automation", "coralglassSmelting"],
                resources: ["coral", "sand"],
                seen: ["coralglass"],
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
            effect: {
                incomeMultiplier: {
                    worker: 2,
                    harvester: 2,
                    treasurer: 2,
                    scavenger: 2,
                },
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
                resources: ["ray", "kelp"],
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
                "Crabs and planter crabs are twice as effective. Crabs are alright but they are also sort of terrifying and weird. Good job they're on our side!",
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

        crustaceanBiology: {
            name: "Crustacean Biology",
            desc: "These strange creatures related to crabs require further investigation. What is with exoskeletons?",
            researchedMessage: "We've figured out how these shellfish function. There's far too many limbs involved.",
            effectDesc:
                "Shrimp and lobsters are twice as effective. Lobsters can now gather other things or cover themselves in shiny eggs, also called 'berries'. What's a berry?",
            cost: {
                science: 500,
                clam: 100,
            },
            required: {
                upgrades: ["biology"],
                resources: ["shrimp", "lobster"],
                seen: ["shrimp", "lobster"],
            },
            effect: {
                incomeMultiplier: {
                    shrimp: 2,
                    lobster: 2,
                },
            },
        },

        eusociality: {
            name: "Eusociality",
            desc: "The shrimp are weirder than we thought. They have some advanced social system beyond our comprehension. What is the deal?",
            researchedMessage: "We have learned far more than we needed to about the duties of egg bearing queens in eusocial colonies.",
            effectDesc:
                "Shrimp are twice as effective. Shimp queens and dedicated shrimp workers are available, and we'll never sleep soundly again.",
            cost: {
                science: 1000,
                sponge: 500,
            },
            required: {
                upgrades: ["crustaceanBiology"],
                resources: ["shrimp"],
                seen: ["shrimp"],
            },
            effect: {
                incomeMultiplier: {
                    shrimp: 2,
                },
            },
        },

        wormWarriors: {
            name: "Worm Warriors",
            desc: "Shrimp sponge hives are under constant threat from outside invaders that aren't us. A collaboration effort might help them out.",
            researchedMessage: "Primordial shark techniques of self-defense have lead to the establishment of a new shrimp caste - the worm warrior.",
            effectDesc: "Shrimp, shrimp queens and shrimp workers are twice as effective now that they don't need to worry about worms eating them.",
            cost: {
                science: 3000,
                shrimp: 300,
            },
            required: {
                upgrades: ["eusociality"],
                resources: ["shrimp"],
            },
            effect: {
                incomeMultiplier: {
                    shrimp: 2,
                    queen: 2,
                    worker: 2,
                },
            },
        },

        eelHabitats: {
            name: "Eel Habitats",
            desc: "So we keep seeing these things we thought were kelp on the seabed, but it turns out they're not kelp. What are they?",
            researchedMessage:
                "After some discussion with the eels on the nature of eel pits and safety and security in the form of seabed holes, we understand, maybe.",
            effectDesc:
                "Eels are twice as effective now we know how they prefer to live. Eels are also able to specialise in a variety of different ways with a place to store their things.",
            cost: {
                science: 800,
                clam: 200,
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

        creviceCreches: {
            name: "Crevice Creches",
            desc: "We can probably figure out a way to make eel pits cosier for their inhabitants.",
            researchedMessage:
                "We've developed a design to improve the quality of eel pits involving a complicated system of chambers and subterranean warrens. Look, it... let's not worry about the specifics this time, okay?",
            effectDesc: "Eels are twice as effective, and so are eel pits. Expect many baby eels in the future.",
            cost: {
                science: 800,
                clam: 200,
            },
            required: {
                upgrades: ["eelHabitats"],
                resources: ["eel"],
            },
            effect: {
                incomeMultiplier: {
                    eel: 2,
                    pit: 2,
                    technician: 2,
                },
            },
        },

        bioelectricity: {
            name: "Bioelectricity",
            desc: "There has to be a way to harness the powers of some of the eels. We all know they have powers. Painful ones.",
            researchedMessage:
                "The technically inclined electric eels practically jumped out of the water at the chance to work with the machines. Should we be concerned?",
            effectDesc: "Eel technicians are twice as effective. So are our machines. Convenient!",
            cost: {
                science: 3200,
                clam: 800,
            },
            required: {
                upgrades: ["eelHabitats", "engineering"],
                resources: ["eel"],
            },
            effect: {
                incomeMultiplier: {
                    technician: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                    autoTransmuter: 2,
                    skimmer: 2,
                    heater: 2,
                },
            },
        },

        chimaeraMysticism: {
            name: "Chimaera Mysticism",
            desc: "We know the chimaeras, but we don't them very well. We need to adjust our thinking to understand their riddles.",
            researchedMessage:
                "After much thoughtful contemplation, the chimaeras have despaired at our inability to understand and shared their knowledge with us.",
            effectDesc:
                "Chimaeras can now become dedicated transmuters or explorers, using our knowledge to assist our industry or sharing their knowledge as they journey through the deeper seas.",
            cost: {
                science: 10000,
                jellyfish: 700,
            },
            required: {
                upgrades: ["exploration"],
                resources: ["chimaera"],
                seen: ["chimaera"],
            },
            effect: {
                incomeMultiplier: {
                    chimaera: 2,
                },
            },
        },

        abyssalEnigmas: {
            name: "Abyssal Enigmas",
            desc:
                "The chimaeras have returned from the deeper oceans with artifacts they can't explain. We need to work together to understand them.",
            researchedMessage: "Well, we still have no idea what these things are, but we've formed a stronger bond with our estranged kin.",
            effectDesc:
                "Chimaeras and their specialists are twice as effective thanks to stronger trust and friendship. Also we still don't know what these things they found do.",
            cost: {
                science: 40000,
                jellyfish: 5000,
            },
            required: {
                worlds: ["shrouded"],
                upgrades: ["chimaeraMysticism"],
                resources: ["chimaera"],
            },
            effect: {
                incomeMultiplier: {
                    chimaera: 2,
                    transmuter: 2,
                    explorer: 2,
                },
            },
        },

        sunObservation: {
            name: "Sun Observation",
            desc: "We must determine what is with the weird glare on the surface of the water.",
            researchedMessage: "Shark science has discovered the sun! It has also discovered that looking directly into the sun hurts.",
            effectDesc:
                "Planter crabs are twice as effective, and shrimp are four times as effective. Is a suns worth many fish? We can see a sun, but where is it really? And what is it made of?",
            cost: {
                science: 5000,
            },
            required: {
                upgrades: ["agriculture"],
            },
            effect: {
                incomeMultiplier: {
                    planter: 2,
                    shrimp: 4,
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
            name: "Far Explorations",
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

        /* knowledgeCoalescers: {
            name: "Knowledge Coalescers",
            desc:
                "The dolphins say they have a design to accrue knowledge directly from the ocean. Maybe we should hear them out.",
            researchedMessage:
                "With enough staring, we managed to decipher the cryptic and unhelpful instructions they gave us. Turns out, it's not a machine...it's more like an altar.",
            effectDesc: "Knowledge coalescers are now available. Education has never been easier!",
            cost: {
                science: 1e8,
                knowledge: 5,
            },
            required: {
                upgrades: ["gateDiscovery", "dolphinTechnology"],
                worlds: ["ethereal"],
            },
        }, */

        // SUPERSCIENCE

        ancestralRecall: {
            name: "Ancestral Recall",
            desc:
                "The sharks and rays know we share some features among ourselves. Using the vague glimpses of dreams, let's piece together the puzzle.",
            researchedMessage: "Our giant ancestors and the creatures of a long distant past have inspired us to become even greater!",
            effectDesc:
                "Sharks, rays and chimaeras, and their roles, are all four times as effective. We have had a glorious past. Now, on to a glorious future.",
            cost: {
                science: 1e7,
            },
            required: {
                upgrades: ["gateDiscovery"],
                resources: ["shark", "ray", "chimaera"],
                notWorlds: ["start"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 4,
                    diver: 4,
                    scientist: 4,
                    nurse: 4,
                    ray: 4,
                    maker: 4,
                    laser: 4,
                    chimaera: 4,
                    transmuter: 4,
                    explorer: 4,
                },
            },
        },

        utilityCarapace: {
            name: "Utility Carapace",
            desc: "The exoskeleton is good enough, but with some adjustments, perhaps coralglass can improve it.",
            researchedMessage:
                "Coralglass carapace augmentation is a go! The crustaceans now carry their protection and their tools everywhere they go.",
            effectDesc: "Crabs, shrimp and lobsters, and their roles, are all four times as effective. A shell protects, and a shell interfaces.",
            cost: {
                science: 1e7,
            },
            required: {
                upgrades: ["gateDiscovery", "coralglassSmelting"],
                resources: ["crab", "shrimp", "lobster"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    brood: 4,
                    planter: 4,
                    shrimp: 4,
                    worker: 4,
                    queen: 4,
                    lobster: 4,
                    berrier: 4,
                    harvester: 4,
                },
            },
        },

        primordialSong: {
            name: "Primordial Song",
            desc:
                "Even the dolphins can remember an ancient song. The whales know more, but it stirs within both of them. Perhaps we can piece it back together.",
            researchedMessage:
                "It seems that the song of the whales was only ever half of the composition. The dolphins were the key to completing it.",
            effectDesc:
                "The dolphins have been quieter since the gate opened. The whales seemed indifferent. The song of the ocean is older than life itself.",
            cost: {
                science: 1e7,
            },
            required: {
                upgrades: ["gateDiscovery"],
                resources: ["dolphin", "whale"],
                seen: ["dolphin", "whale"],
            },
            effect: {
                incomeMultiplier: {
                    dolphin: 4,
                    biologist: 4,
                    treasurer: 4,
                    philosopher: 4,
                    whale: 4,
                },
            },
        },

        leviathanHeart: {
            name: "Leviathan Heart",
            desc: "The eels are meek and unassuming, but deep within them lies a greater potential. Let's unleash it.",
            researchedMessage:
                "We have found the connection between the eels we know and the ancient giant serpents we knew only in legend. This has inspired every eel we know to do greater things.",
            effectDesc: "Eels and their roles are all four times as effective. The power of determination can overcome many odds.",
            cost: {
                science: 5e6,
            },
            required: {
                upgrades: ["gateDiscovery", "bioelectricity"],
                resources: ["eel"],
            },
            effect: {
                incomeMultiplier: {
                    eel: 4,
                    pit: 4,
                    sifter: 4,
                    technician: 4,
                },
            },
        },

        eightfoldOptimisation: {
            name: "Eightfold Optimisation",
            desc: "Enhance productivity. Optimise. Improve. Improve.",
            researchedMessage: "Peak productivity attained. Maintain course. Maintain efficiency.",
            effectDesc: "Octopuses and their roles, as well as their machines, are all four times as effective. Optimised.",
            cost: {
                science: 8e6,
            },
            required: {
                upgrades: ["gateDiscovery", "octalEfficiency"],
                resources: ["octopus"],
            },
            effect: {
                incomeMultiplier: {
                    octopus: 4,
                    collector: 4,
                    scavenger: 4,
                    clamCollector: 4,
                    eggBrooder: 4,
                    sprongeSmelter: 4,
                    seaScourer: 4,
                    prostheticPolyp: 4,
                },
            },
        },

        mechanisedAlchemy: {
            name: "Mechanised Alchemy",
            desc: "Better engineering and transmutation processes lead to a refinement of our machines.",
            researchedMessage: "We are blurring the line between science and magic more than ever before!",
            effectDesc: "Shark machines are all four times as effective. We work better with the machines, not against them.",
            cost: {
                science: 2e7,
            },
            required: {
                upgrades: ["gateDiscovery", "iterativeDesign"],
                resources: ["sharkonium"],
                notWorlds: ["start"],
            },
            effect: {
                incomeMultiplier: {
                    fishMachine: 4,
                    crystalMiner: 4,
                    sandDigger: 4,
                    autoTransmuter: 4,
                    skimmer: 4,
                    heater: 4,
                },
            },
        },

        mobiusShells: {
            name: "Mobius Shells",
            desc: "The intricate glasswork of crustacean technology can be made even finer for maximised performance.",
            researchedMessage: "So beautiful. So impossible, but yet so effective. Is it impossible? What are we looking at here?",
            effectDesc: "Crustacean machines are all four times as effective. Their glass shells defy all reason and geometry.",
            cost: {
                science: 2e6,
            },
            required: {
                upgrades: ["gateDiscovery", "coralCircuitry"],
                resources: ["coralglass"],
            },
            effect: {
                incomeMultiplier: {
                    spongeFarmer: 4,
                    berrySprayer: 4,
                    glassMaker: 4,
                },
            },
        },

        imperialDesigns: {
            name: "Imperial Designs",
            desc: "Some of the dolphins remember and have copies of plans for their machines from wherever they used to call home.",
            researchedMessage: "These designs will never work. Look, let's show them-- oh. Oh, apparently they do. Huh.",
            effectDesc: "Cetacean machines are all four times as effective. We begrudingly admit their quality is not entirely terrible.",
            cost: {
                science: 1e6,
            },
            required: {
                upgrades: ["gateDiscovery", "dolphinTechnology"],
                resources: ["delphinium"],
            },
            effect: {
                incomeMultiplier: {
                    tirelessCrafter: 4,
                    silentArchivist: 4,
                },
            },
        },
    },
    abandonedUpgrades: {
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
                "All the goods we've acquired are now being stored and itemised in a mostly flooded cavern system. No more stray currents washing it all away hopefully!",
            effectDesc: "By storing things in a centralised location, we now finally have an idea of what we're doing. Sort of.",
            cost: {
                science: 75,
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
                resources: ["clam"],
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
                science: 1500,
                crystal: 1750,
                sand: 4000,
            },
            required: {
                upgrades: ["thermalVents", "underwaterChemistry"],
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

        automation: {
            name: "Automation",
            desc: "Using sharkonium, we can make things to do things so we don't have to do the things!",
            researchedMessage: "Now we don't have to do all the work, machines can do it for us! Future!!",
            effectDesc: "Machines can be built to supplement population duties. This is efficient.",
            cost: {
                science: 1750,
                sharkonium: 250,
            },
            required: {
                upgrades: ["transmutation"],
            },
        },

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
            name: "Engineering",
            desc: "The machines sort of suck. Let's make them better by learning how!",
            researchedMessage: "The machines are twice as good now! We've figured out new designs in the process, too!",
            effectDesc: "Shark machines are twice as effective.",
            cost: {
                science: 2500,
                sharkonium: 1750,
            },
            required: {
                upgrades: ["automation"],
                seen: ["fishMachine", "crystalMiner", "sandDigger"],
            },
            effect: {
                incomeBoost: {
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
            name: "Iterative Design",
            desc: "The machines are useful, but they could be better. Maybe it's time we started over?",
            researchedMessage: "As it turns out, science is about learning from mistakes, or so the scientists say. About their own mistakes.",
            effectDesc: "All shark machines run twice as fast. Again!",
            cost: {
                science: 75000,
                sharkonium: 17500,
            },
            required: {
                upgrades: ["engineering"],
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
            name: "Agriculture",
            desc: "The hunter-gatherer lifestyle will only work so well for us. Maybe we should gather these animals in one place and let them grow.",
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
            name: "Biology",
            desc: "What is a shark? What is inside a shark, except for large amounts of fish?",
            researchedMessage: "With a new understanding of their own biology, sharks can now specialise in the manufacture of new sharks.",
            effectDesc: "Sharks are twice as effective. Did you know shark eggs don't actually form just because a shark wills them to exist?",
            cost: {
                science: 1600,
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
                "Rays and laser rays are twice as effective. We may never repair the shark-ray relations to their former state after how awkward this whole affair was.",
            cost: {
                science: 1800,
                sand: 1600,
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
            desc: "Crabs are a mystery. They keep to themselves and dig up crystals or pick up sponge. What is even up with that? What ARE crabs??",
            researchedMessage:
                "It turns out crabs are friendly crustaceans that have revealed to the sharks the secrets of crab generation. It involves eggs, or something. Squirmy eggs.",
            effectDesc:
                "Crabs and collectors are four times as effective. Crabs are alright but they are also sort of terrifying and weird. Good job they're on our side!",
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
            name: "Sun Observation",
            desc: "It's hard to see, but there's a weird glare on the surface of the water, and we need to figure out what it means.",
            researchedMessage: "Shark science has discovered the sun! It has also discovered that looking directly into the sun hurts.",
            effectDesc:
                "Octopus investigators, science sharks, and collector crabs are twice as effective. Is a suns worth many fish? We can see a sun, but where is it really? And what is it made of?",
            cost: {
                science: 17500,
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
            name: "Exploration",
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
                    shark: 2,
                    ray: 2,
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
    havenUpgrades: {
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
                "All the goods we've acquired are now being stored and itemised in a mostly flooded cavern system. No more stray currents washing it all away hopefully!",
            effectDesc: "By storing things in a centralised location, we now finally have an idea of what we're doing. Sort of.",
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

        laserRays: {
            name: "Laser Rays",
            desc: "Using arcane shark mystery science, capture the heat of the vents for use by rays.",
            researchedMessage: "The rays can now be granted gear that will let them fuse sand into crystal! Future!",
            effectDesc: "Laser rays can now be geared up to burn the very sand to glassy crystal.",
            cost: {
                science: 600,
                sand: 2500,
                crystal: 250,
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
                science: 2000,
                crystal: 2000,
                sand: 4000,
            },
            required: {
                upgrades: ["thermalVents", "underwaterChemistry"],
            },
        },

        aquamarineFusion: {
            name: "Aquamarine Fusion",
            desc: "Those uppity dolphins think they're the only ones who can make their special delphinium. We'll show them.",
            researchedMessage:
                "In a weird corrupted version of our own transmutation, we've figured out how to make delphinium and now we feel gross.",
            effectDesc: "Enables transmutation of a different bunch of junk into delphinium, a substance inherently inferior to sharkonium.",
            cost: {
                science: 1000,
                coral: 4000,
                crystal: 1000,
            },
            required: {
                upgrades: ["transmutation", "coralCollection"],
                seen: ["coral"],
            },
        },

        automation: {
            name: "Automation",
            desc: "Using sharkonium, we can make things to do things so we don't have to do the things!",
            researchedMessage: "Now we don't have to do all the work, machines can do it for us! Future!!",
            effectDesc: "Machines can be built to supplement population duties. This is efficient.",
            cost: {
                science: 1250,
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
            effectDesc: "Machines are twice as effective. Auto-transmuters are now possible to create.",
            cost: {
                science: 5500,
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
                science: 15000,
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
                science: 35000,
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
                science: 1500,
                delphinium: 750,
            },
            required: {
                upgrades: ["automation", "aquamarineFusion"],
                resources: ["coral", "crystal"],
                seen: ["delphinium"],
            },
        },

        agriculture: {
            name: "Agriculture",
            desc: "The hunter-gatherer lifestyle will only work so well for us. Maybe we should gather these animals in one place and let them grow.",
            researchedMessage: "It is so much easier to get things when they're all in one place. It's like the ocean is our grotto now!",
            effectDesc: "Various roles are twice as effective thanks to farming regions for coral and sponge.",
            cost: {
                science: 300,
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
                science: 250,
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
                "We can dissect sea apples for science. Also, sea apple isn't a fruit.",
            cost: {
                science: 550,
                seaApple: 5,
            },
            required: {
                upgrades: ["kelpHorticulture"],
                seen: ["seaApple"],
            },
        },

        rayBiology: {
            name: "Ray Biology",
            desc: "Though kindred to the sharks, we know so little about the rays. If only we could fix this. We need to bait a sand trap.",
            researchedMessage:
                "Apparently we could have just asked. We learned how rays make more rays. It's kinda similar to sharks, really, but rays.",
            effectDesc:
                "Rays are twice as effective, laser rays are four times as effective. We may never repair the shark-ray relations to their former state after how awkward this whole affair was.",
            cost: {
                science: 1500,
                sand: 5000,
            },
            required: {
                upgrades: ["biology", "laserRays"],
                resources: ["ray", "kelp"],
                seen: ["kelp"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                    laser: 4,
                },
            },
        },

        crabBiology: {
            name: "Crab Biology",
            desc: "Crabs are a mystery. They keep to themselves and dig up crystals or put down plants. What is even up with that? What ARE crabs??",
            researchedMessage:
                "It turns out crabs are friendly crustaceans that have revealed to the sharks the secrets of crab generation. It involves eggs, or something. Squirmy eggs.",
            effectDesc:
                "Crabs and planter crabs are four times as effective. Crabs are alright but they are also sort of terrifying and weird. Good job they're on our side!",
            cost: {
                science: 900,
                kelp: 100,
            },
            required: {
                upgrades: ["biology", "kelpHorticulture"],
                resources: ["crab"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    planter: 4,
                    //treasurer: 2,
                },
            },
        },

        coralCollection: {
            name: "Coral Collection",
            desc: "The dolphins keep talking about finding coral on the reefs. What??? Why do you care??",
            researchedMessage: "Okay, so it's a cultural thing. Fine. Collect your coral. See if I care.",
            effectDesc: "Dolphins now collect coral along with fish, and can specialize in becoming treasurers.",
            cost: {
                science: 400,
                coral: 200,
            },
            required: {
                upgrades: ["seabedGeology", "cetaceanAwareness"],
                seen: ["dolphin"],
            },
            effect: {
                addCoralIncome: {
                    dolphin: 0.2,
                }
            }
        },
/*         
        coralCrabs: {
            name: "Coral Crabs",
            desc: "For some reason, the dolphins think we should take crabs off of crystal duty and train them to harvest coral.",
            researchedMessage: "Those dolphins had better be glad that we're ",
            effectDesc: "Dolphins now collect coral along with fish.",
            cost: {
                science: 1500,
                fish: 2500,
            },
            required: {
                seen: ["dolphin"],
            },
        }, */

        dolphinBiology: {
            name: "Dolphin Biology",
            desc: "Do we really have to learn about this? We do? Alright, then.",
            researchedMessage:
                "We managed to offend the dolphins with our questions so much they decided to form their own biological research team.",
            effectDesc:
                "All dolphins are twice as effective but double a small number is still small. Also now they can make more dolphins. <em>Hooray.</em>",
            cost: {
                science: 750,
            },
            required: {
                upgrades: ["coralCollection", "biology"],
                seen: ["treasurer"],
            },
            effect: {
                incomeMultiplier: {
                    dolphin: 2,
                    treasurer: 2,
                },
            },
        },

        thermalVents: {
            name: "Thermal Vents",
            desc: "Investigate the boiling vents that just seem to keep on heating things up.",
            researchedMessage: "This is a wondrous, unending source of heat! Something good must come from this.",
            effectDesc: "A power source for future technologies has been discovered.",
            cost: {
                science: 1000,
                sand: 2500,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },

        kelpPapyrus: {
            name: "Kelp Papyrus",
            desc:
                "We keep finding all these flat pieces of kelp. What is with them? Why are they crunchy?!",
            researchedMessage: "The dolphins explain that it's called 'papyrus,' and they used to use it for writing stuff down or something.",
            effectDesc:
                "We can now manufacture papyrus using kelp. Why are we doing this?",
            cost: {
                science: 2500,
                kelp: 10000,
            },
            required: {
                upgrades: ["sunObservation"],
            },
        },

        delphinePhilosophy: {
            name: "Delphine Philosophy",
            desc:
                "The dolphins are not known to be natural philosphers. Nonetheless, we need to appreciate their culture for them to pay attention to us.",
            researchedMessage: "Please let's never do this again. They have fifty dozen parables involving bubbles. BUBBLES. NEVER AGAIN.",
            effectDesc:
                "Dolphins and their professions are twice as effective. They can also specialize in becoming philosophers, because we definitely want them to be even more pompous.",
            cost: {
                papyrus: 1500,
            },
            required: {
                upgrades: ["kelpPapyrus"],
                seen: ["papyrus"],
            },
            effect: {
                incomeMultiplier: {
                    dolphin: 2,
                    biologist: 2,
                    treasurer: 2,
                },
            },
        },

        delphineHistory: {
            name: "Delphine History",
            desc:
                "foobar",
            researchedMessage: "placeholder",
            effectDesc:
                "placeholder",
            cost: {
                science: 27500,
            },
            required: {
                upgrades: ["delphinePhilosophy", "farHavenExploration"],
            },
            effect: {
                philosopherToHistorian: {
                    dolphin: 1,
                }
            }
        },

        ancientAquaculture: {
            name: "Ancient Aquaculture",
            desc:
                "Some of the books we have seem to imply that the dolphins of old found an extremely efficient way to grow crops.",
            researchedMessage: "We now make use of delphinium tools to carefully harvest crops and avoid damaging their surroundings.",
            effectDesc:
                "All kelp production times 4, all coral production times 4.",
            cost: {
                science: 400000,
                delphinium: 25000,
            },
            required: {
                upgrades: ["delphineHistory"],
            },
            effect: {
                resourceBoost: {
                    kelp: 4,
                    coral: 4,
                },
            },
        },

        imperialDesigns: {
            name: "Imperial Designs",
            desc: "Finally, with all the materials in one place, we can stop relying on shoddy copies and use the original designs for the dolphin machines.",
            researchedMessage: "What? These designs will never work! Look, let's show them-- oh. Oh, apparently they do. Huh.",
            effectDesc: "Cetacean machines are all 4 times as effective. We begrudingly admit their quality is not entirely terrible.",
            cost: {
                science: 200000,
            },
            required: {
                upgrades: ["delphineHistory", "dolphinTechnology"],
            },
            effect: {
                incomeMultiplier: {
                    tirelessCrafter: 2,
                    crimsonCombine: 4,
                    kelpCultivator: 4,
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
                upgrades: ["thermalVents", "kelpHorticulture"],
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
                science: 15000,
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

        farHavenExploration: {
            name: "Far Explorations",
            desc: "Explore the vast reaches beyond the home ocean.",
            researchedMessage: "Crystal-rich deposits were found, as well as strange, deep chasms.",
            effectDesc: "Crabs are four times as effective. Did you know oceans are actually even bigger than big? Remarkable!",
            cost: {
                science: 80000,
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

        whaleCommunication: {
            name: "Whale Communication",
            desc: "We can hear faint cries in the distance. What is out there?",
            researchedMessage:
                "Okay, 'whales' are out there. They're similar to dolphins, except less rude, and really big. Oh, and, they collect tons of fish.",
            effectDesc: "Whales can now be recruited.",
            cost: {
                science: 40000,
                fish: 50000,
            },
            required: {
                upgrades: ["exploration", "cetaceanAwareness"],
            },
        },

        whaleSong: {
            name: "The Whale Song",
            desc:
                "The whales claim to know segments of some form of ancient ethereal music that connects worlds. We can collect what they know to piece it together ourselves.",
            researchedMessage: "What we've put together is definitely a song...but something's missing. This can't be the whole thing.",
            effectDesc: "The whales have worked with us to put together pieces of an ancient song. We don't think it's everything, though. Whales are 4 times as effective.",
            cost: {
                science: 500000,
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
            researchedMessage: "The song of the whales was only ever half of the composition. The dolphins were the key to completing it. Now we have the pieces.",
            effectDesc: "A chorus of whales and dolphins can be assembled to sing the eternal song, but we have no clue what it will do.",
            cost: {
                science: 1e7,
            },
            required: {
                upgrades: ["whaleSong", "delphineHistory"],
                seen: ["dolphin", "whale"],
            },
        },
    },
};

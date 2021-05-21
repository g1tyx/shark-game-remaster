"use strict";
SharkGame.World = {
    _worldType: "start",
    get worldType() {
        return this._worldType;
    },
    set worldType(val) {
        const body = document.querySelector("body");
        body.classList.remove(this._worldType);
        body.classList.add(val);
        this._worldType = val;
    },
    worldResources: new Map(),
    worldRestrictedCombinations: new Map(),
    planetLevel: 1,

    init() {
        //world.worldType = "start";
        //world.planetLevel = 1;
        //world.worldResources = {};
        world.resetWorldProperties();
    },

    apply() {
        world.applyWorldProperties();
        world.applyGateCosts(world.planetLevel);
    },

    resetWorldProperties() {
        const wr = world.worldResources;
        world.worldRestrictedCombinations.clear();

        // set up defaults
        SharkGame.ResourceMap.forEach((_entry, someKindOfKey) => {
            wr.set(someKindOfKey, {});
            wr.get(someKindOfKey).exists = true;
            wr.get(someKindOfKey).income = 0;
            wr.get(someKindOfKey).artifactMultiplier = 1;
        });
    },

    applyWorldProperties() {
        const wr = world.worldResources;
        const worldInfo = SharkGame.WorldTypes[world.worldType];

        // enable resources allowed on the planet
        if (worldInfo.includedResources) {
            SharkGame.ResourceMap.forEach((_entry, someKindOfKey) => {
                wr.get(someKindOfKey).exists = false;
            });
            _.each(worldInfo.includedResources, (group) => {
                if (_.has(SharkGame.InternalCategories, group)) {
                    _.each(SharkGame.InternalCategories[group].resources, (resource) => {
                        wr.get(resource).exists = true;
                    });
                } else {
                    wr.get(group).exists = true;
                }
            });
        }

        // disable resources not allowed on planet
        _.each(worldInfo.absentResources, (absentResource) => {
            wr.get(absentResource).exists = false;
        });

        // apply world modifiers
        _.each(worldInfo.modifiers, (modifierData) => {
            res.applyModifier(modifierData.modifier, modifierData.resource, modifierData.amount);
        });
        res.buildApplicableNetworks();
    },

    applyGateCosts(_level) {
        const worldInfo = SharkGame.WorldTypes[world.worldType];

        // get multiplier
        const gateCostMultiplier = world.getGateCostMultiplier();

        SharkGame.Gate.createSlots(worldInfo.gateRequirements, world.planetLevel, gateCostMultiplier);
    },

    getWorldEntryMessage() {
        return SharkGame.WorldTypes[world.worldType].entry;
    },

    // does this resource exist on this planet?
    doesResourceExist(resourceName) {
        return world.worldResources.get(resourceName).exists;
    },

    forceExistence(resourceName) {
        world.worldResources.get(resourceName).exists = true;
    },

    // these things are only impacted by artifacts so far

    getGateCostMultiplier() {
        const gcrLevel = SharkGame.Artifacts.gateCostReducer.level;
        return gcrLevel > 0 ? Math.pow(0.9, gcrLevel) : 1;
    },
};

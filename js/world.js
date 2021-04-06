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
        //w.worldType = "start";
        //w.planetLevel = 1;
        //w.worldResources = {};
        w.resetWorldProperties();
    },

    apply() {
        w.applyWorldProperties();
        w.applyGateCosts(w.planetLevel);
    },

    resetWorldProperties() {
        const wr = w.worldResources;
        w.worldRestrictedCombinations.clear();

        // set up defaults
        SharkGame.ResourceMap.forEach((v, k, m) => {
            wr.set(k, {});
            wr.get(k).exists = true;
            wr.get(k).income = 0;
            wr.get(k).artifactMultiplier = 1;
        });
    },

    applyWorldProperties() {
        const wr = w.worldResources;
        const worldInfo = SharkGame.WorldTypes[w.worldType];

        // enable resources allowed on the planet
        if (worldInfo.includedResources) {
            SharkGame.ResourceMap.forEach((v, k, m) => {
                wr.get(k).exists = false;
            });
            $.each(worldInfo.includedResources, (ident, group) => {
                if (SharkGame.InternalCategories[group]) {
                    $.each(SharkGame.InternalCategories[group].resources, (identwo, resource) => {
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
            r.applyModifier(modifierData.modifier, modifierData.resource, modifierData.amount);
        });
        r.buildApplicableNetworks();
    },

    applyGateCosts(_level) {
        const worldInfo = SharkGame.WorldTypes[w.worldType];

        // get multiplier
        const gateCostMultiplier = w.getGateCostMultiplier();

        SharkGame.Gate.createSlots(worldInfo.gateRequirements, w.planetLevel, gateCostMultiplier);
    },

    getWorldEntryMessage() {
        return SharkGame.WorldTypes[w.worldType].entry;
    },

    // does this resource exist on this planet?
    doesResourceExist(resourceName) {
        return w.worldResources.get(resourceName).exists;
    },

    forceExistence(resourceName) {
        w.worldResources.get(resourceName).exists = true;
    },

    // these things are only impacted by artifacts so far

    getGateCostMultiplier() {
        const gcrLevel = SharkGame.Artifacts.gateCostReducer.level;
        return gcrLevel > 0 ? Math.pow(0.9, gcrLevel) : 1;
    },
};

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
        w.applyWorldProperties(w.planetLevel);
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

    applyWorldProperties(level) {
        const wr = w.worldResources;
        const worldInfo = SharkGame.WorldTypes[w.worldType];

        // get multiplier
        const terraformMultiplier = w.getTerraformMultiplier();
        const effectiveLevel = Math.max(Math.floor(level * terraformMultiplier), 1);

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
        if (worldInfo.absentResources) {
            $.each(worldInfo.absentResources, (i, v) => {
                wr.get(v).exists = false;
            });
        }

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

    getWorldIncomeMultiplier(resourceName) {
        return w.worldResources.get(resourceName).incomeMultiplier;
    },

    getArtifactMultiplier(resourceName) {
        const artifactMultiplier = w.worldResources.get(resourceName).artifactMultiplier;
        return artifactMultiplier;
    },

    // these things are only impacted by artifacts so far

    getTerraformMultiplier() {
        // temporarily disabled the terraformer because it might screw with game balance down the line.
        //
        // const ptLevel = SharkGame.Artifacts.planetTerraformer.level;
        // return ptLevel > 0 ? Math.pow(0.9, ptLevel) : 1;
        return 1;
    },

    getGateCostMultiplier() {
        const gcrLevel = SharkGame.Artifacts.gateCostReducer.level;
        return gcrLevel > 0 ? Math.pow(0.9, gcrLevel) : 1;
    },
};

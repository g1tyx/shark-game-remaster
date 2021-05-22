SharkGame.ArtifactUtil = {
    migratorCost(level) {
        return Math.floor(Math.pow(2, level));
    },
    migratorEffect(level, resourceName) {
        if (level < 1) {
            return;
        }
        const amountToMigrate = Math.pow(5, level);
        // force existence
        world.forceExistence(resourceName);
        const resourceAmount = res.getTotalResource(resourceName);
        if (resourceAmount < amountToMigrate) {
            res.changeResource(resourceName, amountToMigrate);
        }
    },
    totemCost(level) {
        return Math.floor(Math.pow(2.5, level + 1));
    },
    totemEffect(level, resourceList, totemName) {
        if (level < 1) {
            return;
        }
        const worldResources = world.worldResources;
        const multiplier = level + 1;
        _.each(resourceList, (resourceName) => {
            if (worldResources.get(resourceName).artifactMultiplier) {
                worldResources.get(resourceName).artifactMultiplier *= multiplier;
            } else {
                worldResources.get(resourceName).artifactMultiplier = multiplier;
            }
            const incomes = SharkGame.ResourceMap.get(resourceName).income;
            $.each(incomes, (resource, income) => {
                incomes[resource] = income * multiplier;
            });
            SharkGame.ModifierMap.get(resourceName).artifact.multiplier[totemName] = level;
        });
    },
};

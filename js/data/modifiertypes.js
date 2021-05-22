SharkGame.ModifierReference = new Map();

// rules to know:
//
// every modifier in this tree must have equivalent depth
// that is that a valid path looks like this: SharkGame.ModifierTypes.category.type.modifier

SharkGame.ModifierTypes = {
    upgrade: {
        multiplier: {
            incomeMultiplier: {
                defaultValue: 1,
                apply(current, degree, resource, _level) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (resourceId, income) => {
                        incomes[resourceId] = income * degree;
                    });
                    return current * degree;
                },
                effectDescription(degree, resource, _level) {
                    return res.getResourceName(resource) + " speed x " + degree;
                },
                getEffect(degree, _gen, _out) {
                    return degree;
                },
            },
            resourceBoost: {
                defaultValue: 1,
                apply(current, degree, boostedResource, _level) {
                    SharkGame.ResourceMap.forEach((generatingResource) => {
                        $.each(generatingResource.income, (generatedResource, amount) => {
                            if (generatedResource === boostedResource && amount > 0) {
                                generatingResource.income[generatedResource] = amount * degree;
                            }
                        });
                    });
                    return current * degree;
                },
                effectDescription(degree, resource, _level) {
                    return "All " + res.getResourceName(resource) + " production x " + degree;
                },
                getEffect(degree, gen, out) {
                    return SharkGame.ResourceMap.get(gen).income[out] > 0 ? degree : 1;
                },
            },
            incomeBoost: {
                defaultValue: 1,
                apply(current, degree, resource, _level) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (resouceId, income) => {
                        if (income > 0 && resouceId !== "tar") {
                            incomes[resouceId] = income * degree;
                        }
                    });
                    return current * degree;
                },
                effectDescription(degree, resource, _level) {
                    return res.getResourceName(resource) + " efficiency x " + degree;
                },
                getEffect(degree, gen, out) {
                    return SharkGame.ResourceMap.get(gen).income[out] > 0 && out !== "tar" ? degree : 1;
                },
            },
            sandMultiplier: {
                defaultValue: 1,
                apply(current, degree, resource, _level) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    if (incomes.sand) {
                        incomes.sand = incomes.sand * degree;
                    }
                    return current * degree;
                },
                effectDescription(degree, resource, _level) {
                    return res.getResourceName(resource) + " collection of " + res.getResourceName("sand") + " x " + degree;
                },
                getEffect(degree, _gen, _out) {
                    return degree;
                },
            },
            kelpMultiplier: {
                defaultValue: 1,
                apply(current, degree, resource, _level) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    if (incomes.kelp) {
                        incomes.kelp = incomes.kelp * degree;
                    }
                    return current * degree;
                },
                effectDescription(degree, resource, _level) {
                    return res.getResourceName(resource) + " collection of " + res.getResourceName("kelp") + " x " + degree;
                },
                getEffect(degree, _gen, _out) {
                    return degree;
                },
            },
        },
        other: {
            addCoralIncome: {
                defaultValue: 0,
                apply(current, degree, resource, _level) {
                    const baseIncomes = SharkGame.ResourceMap.get(resource).baseIncome;
                    baseIncomes.coral = (baseIncomes.coral ? baseIncomes.coral : 0) + degree;
                    res.reapplyModifiers(resource, "coral");
                    return current + degree;
                },
                effectDescription(_degree, _resource, _level) {
                    return "";
                },
                getEffect(_degree, _gen, _out) {
                    return 1;
                },
            },
        },
    },

    world: {
        multiplier: {
            planetaryIncomeMultiplier: {
                defaultValue: 1,
                name: "Planetary Income Multiplier",
                apply(current, degree, resource, level) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (resouceId, income) => {
                        incomes[resouceId] = income * (1 + degree * level);
                    });
                    return current * (1 + degree * level);
                },
                effectDescription(degree, resource, level) {
                    return "Income from " + res.getResourceName(resource, false, false, 2) + " x" + (1 + level * degree).toFixed(2);
                },
                getEffect(degree, _gen, _out) {
                    return degree;
                },
            },
            planetaryFixedIncomeMultiplier: {
                defaultValue: 1,
                name: "Fixed Planetary Income Multiplier",
                apply(current, degree, resource, _level) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (resourceId, income) => {
                        incomes[resourceId] = income * degree;
                    });
                    return current * degree;
                },
                effectDescription(degree, resource, _level) {
                    return "Income from " + res.getResourceName(resource, false, false, 2) + " x" + degree;
                },
                getEffect(degree, _gen, _out) {
                    return degree;
                },
            },
            planetaryIncomeReciprocalMultiplier: {
                defaultValue: 1,
                name: "Planetary Income Reciprocal Multiplier",
                apply(current, degree, resource, level) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (resourceId, income) => {
                        incomes[resourceId] = income * (1 / (1 + level * degree));
                    });
                    return current * (1 / (1 + level * degree));
                },
                effectDescription(degree, resource, level) {
                    return "Income from " + res.getResourceName(resource, false, false, 2) + " x" + (1 / (1 + level * degree)).toFixed(2);
                },
                getEffect(degree, _gen, _out) {
                    return degree;
                },
            },
            planetaryFixedIncomeReciprocalMultiplier: {
                defaultValue: 1,
                name: "Fixed Planetary Income Reciprocal Multiplier",
                apply(current, degree, resource, _level) {
                    const incomes = SharkGame.ResourceMap.get(resource).income;
                    $.each(incomes, (resourceId, income) => {
                        incomes[resourceId] = income * (1 / degree);
                    });
                    return current * (1 / degree);
                },
                effectDescription(degree, resource, _level) {
                    return "Income from " + res.getResourceName(resource, false, false, 2) + " x" + (1 / degree).toFixed(2);
                },
                getEffect(degree, _gen, _out) {
                    return degree;
                },
            },
            planetaryResourceBoost: {
                defaultValue: 1,
                name: "Planetary Boost",
                apply(current, degree, boostedResource, level) {
                    SharkGame.ResourceMap.forEach((generatingResource) => {
                        $.each(generatingResource.income, (generatedResource, amount) => {
                            if (generatedResource === boostedResource && amount > 0) {
                                generatingResource.income[generatedResource] = amount * (1 + degree * level);
                            }
                        });
                    });
                    return current * (1 + degree * level);
                },
                effectDescription(degree, resource, level) {
                    return "All " + res.getResourceName(resource, false, false, 2) + " x" + (1 + level * degree).toFixed(2);
                },
                getEffect(degree, gen, out) {
                    return SharkGame.ResourceMap.get(gen).income[out] > 0 ? degree : 1;
                },
            },
            planetaryResourceReciprocalBoost: {
                defaultValue: 1,
                name: "Planetary Reciprocal Boost",
                apply(current, degree, boostedResource, level) {
                    SharkGame.ResourceMap.forEach((generatingResource) => {
                        $.each(generatingResource.income, (generatedResource, amount) => {
                            if (generatedResource === boostedResource && amount > 0) {
                                generatingResource.income[generatedResource] = amount * (1 / (1 + degree * level));
                            }
                        });
                    });
                    return current * (1 / (1 + degree * level));
                },

                effectDescription(degree, resource, level) {
                    return "All " + res.getResourceName(resource, false, false, 2) + " x" + (1 / (1 + level * degree)).toFixed(2);
                },
                getEffect(degree, gen, out) {
                    return SharkGame.ResourceMap.get(gen).income[out] > 0 ? degree : 1;
                },
            },
        },
        other: {
            planetaryIncome: {
                defaultValue: 0,
                name: "Income per Climate Level",
                apply(current, degree, resource, level) {
                    world.worldResources.get(resource).income = level * degree;
                    return current + level * degree;
                },
                effectDescription(degree, resource, level) {
                    return main.beautify(level * degree) + " " + res.getResourceName(resource, false, false, level * degree) + " per Second";
                },
                getEffect(_degree, _gen, _out) {
                    return 1;
                },
            },
            planetaryConstantIncome: {
                defaultValue: 0,
                name: "Fixed Planetary Income",
                apply(current, degree, resource, _level) {
                    world.worldResources.get(resource).income = degree;
                    return current + degree;
                },
                effectDescription(degree, resource, _level) {
                    return degree + " " + res.getResourceName(resource, false, false, degree) + " per Second";
                },
                getEffect(_degree, _gen, _out) {
                    return 1;
                },
            },
            planetaryStartingResources: {
                defaultValue: 0,
                name: "Planetary Starting Resources",
                apply(current, degree, resource, level) {
                    res.changeResource(resource, level * degree);
                    return current + level * degree;
                },
                effectDescription(degree, resource, level) {
                    return "Start with " + level * degree + " " + res.getResourceName(resource, false, false, level * degree);
                },
                getEffect(_degree, _gen, _out) {
                    return 1;
                },
            },
            planetaryGeneratorRestriction: {
                defaultValue: [],
                name: "Restricted Generator-Income Combination",
                apply(current, restriction, generator, _level) {
                    SharkGame.ResourceMap.get(generator).income[restriction] = 0;
                    if (typeof current !== "object") {
                        return [restriction];
                    }
                    return current.push(restriction);
                },
                effectDescription(restriction, generator, _level) {
                    return res.getResourceName(generator, false, false, 2) + " cannot produce " + res.getResourceName(restriction, false, false, 2);
                },
                getEffect(restriction, _gen, out) {
                    return restriction === out ? 0 : 1;
                },
            },
        },
    },

    artifact: {
        multiplier: {
            sharkTotem: {
                defaultValue: 0,
                getEffect(level, _gen, _out) {
                    return level + 1;
                },
            },
            rayTotem: {
                defaultValue: 0,
                getEffect(level, _gen, _out) {
                    return level + 1;
                },
            },
            crabTotem: {
                defaultValue: 0,
                getEffect(level, _gen, _out) {
                    return level + 1;
                },
            },
            progressTotem: {
                defaultValue: 0,
                getEffect(level, _gen, _out) {
                    return level + 1;
                },
            },
        },
    },
};

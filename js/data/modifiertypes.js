SharkGame.ModifierReference = new Map();

// rules to know:
//
// every modifier in this tree must have equivalent depth
// that is that a valid path looks like this: SharkGame.ModifierTypes.category.type.modifier

SharkGame.ModifierTypes = {
    upgrade: {
        multiplier: {
            incomeMultiplier: {
                name: "Income Multiplier",
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
                getEffect(genDegree, _outDegree, _gen, _out) {
                    return genDegree;
                },
                applyToInput(input, genDegree, _outDegree, _gen, _out) {
                    return input * genDegree;
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
                getEffect(_genDegree, outDegree, _gen, _out) {
                    return outDegree;
                },
                applyToInput(input, _genDegree, outDegree, _gen, _out) {
                    return input * outDegree;
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
                getEffect(genDegree, _outDegree, gen, out) {
                    return SharkGame.ResourceMap.get(gen).income[out] > 0 && out !== "tar" ? genDegree : 1;
                },
                applyToInput(input, genDegree, _outDegree, _gen, out) {
                    return input * (input > 0 && out !== "tar" ? genDegree : 1);
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
                getEffect(_genDegree, _outDegree, _gen, _out) {
                    return 1;
                },
                applyToInput(input, _genDegree, _outDegree, _gen, _out) {
                    // this applies to base income so it should never be reapplied
                    return input;
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
                getEffect(genDegree, _outDegree, _gen, _out) {
                    return genDegree;
                },
                applyToInput(input, genDegree, _outDegree, _gen, _out) {
                    return input * genDegree;
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
                getEffect(genDegree, _outDegree, _gen, _out) {
                    return genDegree;
                },
                applyToInput(input, genDegree, _outDegree, _gen, _out) {
                    return input * genDegree;
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
                getEffect(genDegree, _outDegree, _gen, _out) {
                    return genDegree;
                },
                applyToInput(input, genDegree, _outDegree, _gen, _out) {
                    return input * genDegree;
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
                getEffect(genDegree, _outDegree, _gen, _out) {
                    return genDegree;
                },
                applyToInput(input, genDegree, _outDegree, _gen, _out) {
                    return input * genDegree;
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
                getEffect(_genDegree, outDegree, _gen, _out) {
                    return outDegree;
                },
                applyToInput(input, _genDegree, outDegree, _gen, _out) {
                    return input * outDegree;
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
                getEffect(_genDegree, outDegree, _gen, _out) {
                    return outDegree;
                },
                applyToInput(input, _genDegree, outDegree, _gen, _out) {
                    return input * outDegree;
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
                applyToInput(input, _genDegree, _outDegree, _gen, _out) {
                    // planetary income handled separately
                    return input;
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
                applyToInput(input, _genDegree, _outDegree, _gen, _out) {
                    // planetary income handled separately
                    return input;
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
                applyToInput(input, _genDegree, _outDegree, _gen, _out) {
                    // starting resources has no bearing on income
                    return input;
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
                    current.push(restriction);
                    return current;
                },
                effectDescription(restriction, generator, _level) {
                    return res.getResourceName(generator, false, false, 2) + " cannot produce " + res.getResourceName(restriction, false, false, 2);
                },
                applyToInput(input, genDegree, _outDegree, _gen, out) {
                    return genDegree.includes(out) ? 0 : input;
                },
            },
        },
    },

    aspect: {
        //cool placeholder
    },
};

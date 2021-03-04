SharkGame.MultiplierTypes = {
    upgrade: {
        incomeMultiplier: {
            getSimpleEffect(lvl) {
                return lvl;
            },
            apply(resource, lvl) {
                
                let incomes = SharkGame.ResourceMap.get(resource).income;
                $.each(incomes, (k, v) {
                    incomes[k] = v * lvl;
                }
                return true;
            },
            effectDescription(resource, lvl) {
                return r.getResourceName(resource) + " speed x " + lvl;
            },
            getEffect(lvl, gen, out) {
                
            }
        },
        resourceBoost: {

        },
        incomeBoost: {

        },
    },
    world: {
        incomeMultiplier: {
            
        }
    }
    
}
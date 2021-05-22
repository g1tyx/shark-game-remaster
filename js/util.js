"use strict";
/**
 * @type Record<string, (a: number, b: number, k: number) => number>
 */
SharkGame.MathUtil = {
    // current = current amount
    // desired = desired amount
    // cost = constant price
    // returns: cost to get to b from a
    constantCost(current, desired, cost) {
        return (desired - current) * cost;
    },

    // current = current amount
    // available = available price amount
    // cost = constant price
    // returns: absolute max items that can be held with invested and current resources
    constantMax(current, available, cost) {
        available = Math.floor(Math.floor(available) * (1 - 1e-9) + 0.1); //safety margin
        return available / cost + current;
    },

    // current = current amount
    // desired = desired amount
    // cost = cost increase per item
    // returns: cost to get to b from a
    linearCost(current, desired, constant) {
        return (constant / 2) * (desired * desired + desired) - (constant / 2) * (current * current + current);
    },

    // current = current amount
    // available = available price amount
    // cost = cost increase per item
    // returns: absolute max items that can be held with invested and current resources
    linearMax(current, available, cost) {
        available = Math.floor(Math.floor(available) * (1 - 1e-9) + 0.1); //safety margin
        return Math.sqrt(current * current + current + (2 * available) / cost + 0.25) - 0.5;
    },

    // these need to be adapted probably?
    // will anything ever use these
    // exponentialCost(a, b, k) {
    //     return (k * Math.pow()) - ();
    // },
    //
    // exponentialMax(a, b, k) {
    //     return Math.floor(Math.log(Math.pow(b,a) + (b-1) * b / k) / Math.log(a));
    // }

    // artificial limit - whatever has these functions for cost/max can only have one of)
    uniqueCost(current, desired, cost) {
        if (current < 1 && desired <= 2) {
            return cost;
        } else {
            return Number.POSITIVE_INFINITY; // be careful this doesn't fuck things up
        }
    },

    uniqueMax() {
        return 1;
    },
};

//linear floor(sqrt(current^2 + current + 2 * price/k + 1/4) - 1/2)
//exponential floor(log(b^old + (b-1) * price / k) / log(b))
//linear total cost = k / 2 * (n^2 + n)
//exponential total cost = k * (b^n - 1) / (b - 1)

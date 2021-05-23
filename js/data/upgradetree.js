// // ideas for tech tree:
//
// 1. artifact that gives you starting resources
// 2. artifact that multiplies production at world start
// 3. implement failsafe for the migrator artifacts
// 4. multiplier for world-specific animals
// 5. make sharkonium cheaper
// 6. make recycler available earlier? nah save for NG+
// 7. make other things cheaper or whatever
// 8. something to make breeders more powerful
// 9. research team artifact or smth: science sharks make themselves more powerful using the affector table
// 10. increased essence gain
// 11. all manual buttons give stuff proportional to how much you produce a second of it. maybe bundle a slow autoclicker by changing button behavior
// 12. start with lab unlocked and 1 science shark
// 13. start with the grotto already researched
// 14. rechargeable time skips!
// 15. silly autoclicker maybe (maybe not)
// 16. patience (after doing 3 more worlds, you get double the amount you put in. price increases with each tier, can only purchase once per tier)
// 17. just one more: there's a chance that you'll get just one more of whatever you buy, each time you buy it. price works by buying exactly as much as you wanted to,
// then decide how many extra you get using a binomial distribution. displays a little +number when you get bonuses.
// 18. feeling lucky: maybe some sort of hilarious slot machine that you can play with your resources lmao
// 19. the sharkcade: just kidding (unless?)
// 20. golden sharks: golden sharks like golden cookies pop up on screen sometimes loool
// 21.
// 22.
// 23.
// 24.
// 25.
//
//
//
//
//
// supertechs (purchased with numen in NG+):
//
// 1. every fish makes sharks a little faster
// 2. every research costs half as much?
// 3. skip one/two worlds per tier (upgradeable?)
// 4. recompleting worlds gives the same rewards as beating for the first time
// 5. the recycler is unlocked. forever and always.
// 6. lucky 7s: every specialized resource is boosted by a factor of 7
// 7. harmless: harmful resources and negative world effects are less potent
// 8. nice weather out: all positive world effects are tripled.
// 9. extreme weather events: all world effects are sextupled.
SharkGame.UpgradeTree = {
    starterResources: {
        name: "Start Resources",
        flavour: "Remove some of that annoying early game",
        url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        cost: () => {
            player.artifactsNum > 5
        },
        buy: () => {
            player.artifactsNum -= 5;
        },
        effect: () => {
            player.fish = 5;
            player.sharks = 1;
        },
        pos: [0, 0],
        prerequisites: [],
        isBought: false
    }
}
SharkGame.CheatsAndDebug = {
    /* tabId: "cheats",
    tabDiscovered: false,
    tabSeen: false,
    tabName: "Cheaty Powers", */

    pause: false,
    stop: false,
    speed: 1,
    upgradePriceModifier: 1,
    actionPriceModifier: 1,
    noNumberBeautifying: false,
    cycling: false,

    defaultParameters: {
        pause: false,
        stop: false,
        speed: 1,
        upgradePriceModifier: 1,
        actionPriceModifier: 1,
        noNumberBeautifying: false,
        cycling: false,
    },

    cheatButtons: {
        giveEverything: {
            get name() {
                return "Give " + main.getBuyAmount(true) + " of Everything";
            },
            updates: true,
            click() {
                cad.giveEverything(main.getBuyAmount(true));
            },
        },
        speedUp: {
            name: "Speed up game by 2x",
            click() {
                cad.goFasterPlease();
            },
        },
        speedDown: {
            name: "Slow down game by 2x",
            click() {
                cad.goSlowerPlease();
            },
        },
        pause: {
            name: "Pause game",
            click() {
                cad.togglePausePlease();
            },
        },
        stop: {
            name: "Halt execution",
            click() {
                cad.toggleStopPlease();
            },
        },
        pricyUpgrades: {
            name: "Increase upgrade prices by 2x",
            click() {
                cad.expensiveUpgradesPlease();
            },
        },
        cheapUpgrades: {
            name: "Decrease upgrade prices by 2x",
            click() {
                cad.cheaperUpgradesPlease();
            },
        },
        pricyStuff: {
            name: "Increase cost of buying stuff by 2x",
            click() {
                cad.expensiveStuffPlease();
            },
        },
        cheapStuff: {
            name: "Decrease cost of buying stuff by 2x",
            click() {
                cad.cheaperStuffPlease();
            },
        },
    },

    /*     init() {
        main.registerTab(this);
    },

    switchTo() {
        $("#content").append($("<table>").attr("id", "cheatsDisplay"));
        $("#content").append($("<table>").attr("id", "cheatButtons"));
        $("#content").append($("<table>").attr("id", "totalEditTable"));
        $.each(cad.defaultParameters, (parameter) => {
            $("#cheatsDisplay").append($("<tr>").attr("id", parameter + "Row"));
        });
        main.createBuyButtons("cheat", $("#cheatButtons"), "append", true);
        $.each(cad.cheatButtons, (buttonName, buttonData) => {
            SharkGame.Button.makeButton(buttonName, buttonData.name, $("#cheatButtons"), buttonData.click);
        });
        this.update();
    },

    update() {
        $.each(cad.defaultParameters, (which, defaultValue) => {
            let msg = "<br>";
            if (defaultValue !== cad[which]) {
                switch (which) {
                    case "pause":
                        msg = "Game paused.";
                        break;
                    case "stop":
                        msg = "Game processing halted.";
                        break;
                    case "speed":
                        msg = "Game speed x" + cad.speed + ".";
                        break;
                    case "upgradePriceModifier":
                        msg = "Upgrades cost " + cad.upgradePriceModifier + "x normal.";
                        break;
                    case "actionPriceModifier":
                        msg = "Buying stuff costs " + cad.actionPriceModifier + "x normal.";
                        break;
                    case "noNumberBeautifying":
                        msg = "Number formatting disabled.";
                        break;
                    case "cycling":
                        msg = "Cycling styles.";
                        break;
                }
            }
            if ($("#" + which + "Row").html() !== msg) {
                $("#" + which + "Row").html(msg);
            }
        });

        $.each(cad.cheatButtons, (buttonName, buttonData) => {
            if (buttonData.updates) {
                if ($("#" + buttonName).html() !== buttonData.name) {
                    $("#" + buttonName).html(buttonData.name);
                }
            }
        });
    }, */

    cycleStyles(time = 2000) {
        if (cad.cycling) return;
        cad.cycling = true;
        let i = 0;
        let intervalId = NaN;
        function nextStyle() {
            if (i >= gateway.allowedWorlds.length && !isNaN(intervalId)) {
                clearInterval(intervalId);
            } else {
                world.worldType = gateway.allowedWorlds[i++];
                console.debug(`worldType now ${world.worldType}`);
            }
        }
        setTimeout(nextStyle);
        intervalId = setInterval(nextStyle, time);
        cad.cycling = false;
    },

    discoverAll() {
        $.each(SharkGame.Tabs, (tabName) => {
            if (tabName !== "current") {
                main.discoverTab(tabName);
            }
        });
    },

    giveEverything(amount = 1) {
        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            res.changeResource(resourceId, amount);
        });
    },

    debug() {
        // cad.tabDiscovered = true;
        SharkGame.HomeActions.getActionTable().debugbutton.unauthorized = false;
    },
    togglePausePlease() {
        if (cad.stop) {
            log.addError("The game is stopped. You can't also pause it.");
            return;
        }
        if (!cad.pause) {
            cad.pause = true;
        } else {
            cad.pause = false;
        }
        this.update();
    },
    toggleStopPlease() {
        if (cad.pause) {
            log.addError("The game is paused. You can't also stop it.");
            return;
        }
        if (!cad.stop) {
            cad.stop = true;
        } else {
            cad.stop = false;
        }
        this.update();
    },
    freezeGamePlease() {
        world.forceExistence("ice");
        SharkGame.PlayerResources.get("ice").discovered = true;
        res.setResource("ice", 1000);
        res.setTotalResource("ice", 1000);
        res.clearNetworks();
        res.buildIncomeNetwork();
        res.reconstructResourcesTable();
        log.addMessage("ICE going, doofus!");
        return "Game frozen.";
    },
    unfreezePlease() {
        res.setResource("ice", 0);
        log.addMessage("Unfroze game.");
        return "Game unfrozen.";
    },
    freeEssencePlease(howMuch = 15) {
        res.changeResource("essence", howMuch);
        return "Okay, but only because you asked nicely.";
    },
    goFasterPlease() {
        if (cad.speed === 512) {
            return "I think you've had enough.";
        }
        let msg = "";
        cad.speed *= 2;
        switch (cad.speed) {
            case 2:
                msg = "Going twice as fast.";
                break;
            case 512:
                msg = "Going...really fast.";
                break;
            default:
                msg = "Going " + cad.speed + " times normal speed.";
                break;
        }
        return msg;
    },
    reallyFastPlease() {
        cad.speed = 512;
        return "Set game speed to 512x.";
    },
    goSlowerPlease() {
        if (cad.speed === 1 / 512) {
            return "I think that's slow enough, don't you?";
        }
        let msg = "";
        cad.speed *= 0.5;
        switch (cad.speed) {
            case 1 / 2:
                msg = "Going twice as slow.";
                break;
            case 1 / 512:
                msg = "Going...really slow.";
                break;
            default:
                msg = "Going " + cad.speed + " times normal speed.";
                break;
        }
        return msg;
    },
    reallySlowPlease() {
        cad.speed = 1 / 512;
        return "Set game speed to 1/512th speed.";
    },
    resetSpeedPlease() {
        cad.speed = 1;
        return "Reset game speed to 1x.";
    },
    giveMeMoreOfEverythingPlease(multiplier) {
        SharkGame.ResourceMap.forEach((_value, key) => {
            SharkGame.PlayerResources.get(key).amount *= multiplier;
        });
        return "Gave you ten times more of everything.";
    },
    setAllResources(howMuch = 1) {
        SharkGame.ResourceMap.forEach((_value, key) => {
            res.setResource(key, 0);
            res.changeResource(key, howMuch);
        });
    },
    doSomethingCoolPlease() {
        return "Did something really cool.";
        // this doesn't do anything
    },
    beatWorldPlease() {
        SharkGame.wonGame = true;
        main.endGame();
        return "You got it, boss.";
    },
    rollTheDicePlease(number = Math.floor(Math.random() * 20 + 1)) {
        switch (number) {
            case 1:
                world.forceExistence("tar");
                res.setResource("tar", 10000);
                res.setTotalResource("tar", 10000);
                res.reconstructResourcesTable();
                return "Rolled a one. Uh oh.";
            case 2:
                res.specialMultiplier *= 1 / 2;
                return "Rolled a two. Everything is 2 times slower.";
            case 3:
                if (world.doesResourceExist("fish")) {
                    SharkGame.ResourceMap.get("fish").income = {};
                    SharkGame.ResourceMap.get("fish").income.shark = -0.001;
                    SharkGame.ResourceMap.get("fish").income.ray = -0.001;
                    SharkGame.ResourceMap.get("fish").income.crab = -0.001;
                    SharkGame.ResourceMap.get("fish").income.whale = -0.001;
                    SharkGame.ResourceMap.get("fish").income.squid = -0.001;
                    SharkGame.ResourceMap.get("fish").baseIncome = {};
                    SharkGame.ResourceMap.get("fish").baseIncome.shark = -0.001;
                    SharkGame.ResourceMap.get("fish").baseIncome.ray = -0.001;
                    SharkGame.ResourceMap.get("fish").baseIncome.crab = -0.001;
                    SharkGame.ResourceMap.get("fish").baseIncome.whale = -0.001;
                    SharkGame.ResourceMap.get("fish").baseIncome.squid = -0.001;
                    return "Rolled a three. The fish are fighting back!";
                }
                return "Rolled a three, but fish don't exist, so nothing happened.";
            case 4:
                if (SharkGame.ResourceMap.get("shark").baseIncome.fish) {
                    SharkGame.ResourceMap.get("shark").baseIncome.fish = -1;
                    res.reapplyModifiers("shark", "fish");
                    return "Rolled a four. The sharks are eating all the fish!";
                } else {
                    SharkGame.ResourceMap.get("shark").baseIncome.shark = -1;
                    res.reapplyModifiers("shark", "shark");
                    return "Rolled a four. The sharks would be eating fish, but they don't catch fish anymore. NOW THEY'RE EATING EACHOTHER! AAAAAAAAAAAAAAAA";
                }

            case 5:
                res.applyModifier("resourceBoost", "fish", 0.125);
                return "Rolled a five. I just killed 87.5% of all fish in the ocean. Now you get 87.5% less fish.";
            case 6:
                SharkGame.ResourceMap.forEach((_value, key) => {
                    if (key !== "essence") {
                        SharkGame.PlayerResources.get(key).amount = 1;
                    }
                });
                return "Rolled a 6...you own one of exactly everything now. Only one.";
            case 7:
                res.changeResource("shark", res.getResource("shark") * 255);
                return "Rolled a seven. Your sharks have been duplicated. A lot.";
            case 8:
                SharkGame.ResourceMap.forEach((_value, key) => {
                    if (key !== "essence") {
                        if (world.doesResourceExist(key)) {
                            SharkGame.PlayerResources.get(key).amount += 888;
                        }
                    }
                });
                return "Rolled an eight. You gained exactly 888 of everything.";
            case 9:
                res.changeResource("fish", 10000000000 * Math.random() ** 3);
                return "Rolled a nine. You eat fish hooray!";
            case 10:
                SharkGame.ResourceMap.get("shark").income = { shark: 1 };
                SharkGame.ResourceMap.get("shark").baseIncome = { shark: 1 };
                res.reapplyModifiers("shark", "shark");
                return "Rolled a ten. Sharks now produce themselves. And nothing else.";
            case 11:
                cad.noNumberBeautifying = true;
                return "Rolled an eleven...wait. Oh no. OH NO. WHAT DID YOU DO?!";
            case 12:
                return "Rolled a twelve. Nothing happened.";
            case 13:
                if (world.doesResourceExist("fish")) {
                    res.addNetworkNode(SharkGame.GeneratorIncomeAffected, "shark", "multiply", "fish", 0.0005);
                    return "Rolled a thirteen. Sharks get faster for every fish owned. I guess a good meal makes for better workers.";
                }
                return "Rolled a thirteen, but fish don't exist, so nothing happened.";
            case 14:
                if (world.worldResources.get("crab").exists) {
                    world.worldResources.get("crab").exists = false;
                    res.setResource("crab", 0);
                    res.setTotalResource("crab", 0);
                    world.worldResources.get("brood").exists = false;
                    res.setResource("brood", 0);
                    res.setTotalResource("brood", 0);
                    world.worldResources.get("planter").exists = false;
                    res.setResource("planter", 0);
                    res.setTotalResource("planter", 0);
                    world.worldResources.get("collector").exists = false;
                    res.setResource("collector", 0);
                    res.setTotalResource("collector", 0);
                    world.worldResources.get("extractionTeam").exists = false;
                    res.setResource("extractionTeam", 0);
                    res.setTotalResource("extractionTeam", 0);
                    res.reconstructResourcesTable();
                    if (world.worldType === "start") {
                        delete SharkGame.HomeActions.generated.default.getCrab;
                        delete SharkGame.HomeActions.generated.default.getBrood;
                        delete SharkGame.HomeActions.generated.default.getPlanter;
                        delete SharkGame.HomeActions.generated.default.getCollector;
                        delete SharkGame.HomeActions.generated.default.getExtractionTeam;
                    } else {
                        delete SharkGame.HomeActions.generated[world.worldType].getCrab;
                        delete SharkGame.HomeActions.generated[world.worldType].getBrood;
                        delete SharkGame.HomeActions.generated[world.worldType].getPlanter;
                        delete SharkGame.HomeActions.generated[world.worldType].getCollector;
                        delete SharkGame.HomeActions.generated[world.worldType].getExtractionTeam;
                    }
                    main.setUpTab();
                    return "Rolled a fourteen. What are you talking about? Crabs aren't real. There were never crabs to begin with.";
                }
                return "Rolled a fourteen, but crabs don't exist, so nothing happened.";
            case 15:
                SharkGame.ResourceMap.get("science").baseIncome = { scientist: 0.01 };
                SharkGame.ResourceMap.get("science").income = { scientist: 0.01 };
                return "Rolled a fifteen. Science produces more science sharks. I guess knowledge is contagious?";
            case 16:
                SharkGame.ResourceMap.get("crystal").income = { sand: 1 };
                SharkGame.ResourceMap.get("crystal").baseIncome = { sand: 1 };
                SharkGame.ResourceMap.get("sand").income = { fish: 1 };
                SharkGame.ResourceMap.get("sand").baseIncome = { fish: 1 };
                return "Rolled a sixteen. Crystals now produce sand. Sand produces fish. Fish still produces whatever it did before. What?";
            case 17:
                world.forceExistence("crab");
                world.forceExistence("brood");
                res.changeResource("crab", 10);
                SharkGame.ResourceMap.get("crab").baseIncome.brood = 0.01;
                res.reapplyModifiers("crab", "brood");
                return "Rolled a seventeen. The crabs. They're multiplying.";
            case 18:
                if (world.doesResourceExist("fish")) {
                    SharkGame.ResourceMap.get("fish").income = {};
                    SharkGame.ResourceMap.get("fish").income.shark = 0.01;
                    SharkGame.ResourceMap.get("fish").income.ray = 0.01;
                    SharkGame.ResourceMap.get("fish").income.crab = 0.01;
                    SharkGame.ResourceMap.get("fish").income.squid = 0.01;
                    SharkGame.ResourceMap.get("fish").income.whale = 0.01;
                    SharkGame.ResourceMap.get("fish").income.fish = -0.999;
                    SharkGame.ResourceMap.get("fish").baseIncome = {};
                    SharkGame.ResourceMap.get("fish").baseIncome.shark = 0.01;
                    SharkGame.ResourceMap.get("fish").baseIncome.ray = 0.01;
                    SharkGame.ResourceMap.get("fish").baseIncome.crab = 0.01;
                    SharkGame.ResourceMap.get("fish").baseIncome.squid = 0.01;
                    SharkGame.ResourceMap.get("fish").baseIncome.whale = 0.01;
                    SharkGame.ResourceMap.get("fish").baseIncome.fish = -0.999;
                    return "Rolled an eighteen. Fish will now purchase frenzy members for you. Thank me later.";
                }
                return "Rolled an eighteen, but fish don't exist, so nothing happened.";
            case 19:
                cad.upgradePriceModifier = 0;
                cad.actionPriceModifier = 4;
                return "Rolled a nineteen. Upgrades are free, yay! But everything is four times as expensive. Not-so-yay.";
            case 20:
                res.specialMultiplier *= 20;
                return "Rolled a perfect twenty. Speed times 20.";
        }
    },
    expensiveUpgradesPlease() {
        if (cad.upgradePriceModifier === 512) {
            return "I'm not letting you subject yourself to any more of this.";
        }
        let msg = "";
        cad.upgradePriceModifier *= 2;
        switch (cad.upgradePriceModifier) {
            case 2:
                msg = "Upgrades are twice as expensive.";
                break;
            case 512:
                msg = "Upgrades are...really expensive.";
                break;
            default:
                msg = "Upgrades are " + cad.upgradePriceModifier + " times normal price.";
                break;
        }
        return msg;
    },
    cheaperUpgradesPlease() {
        if (cad.upgradePriceModifier === 1 / 512) {
            return "Is this not easy enough for you yet??";
        }
        let msg = "";
        cad.upgradePriceModifier *= 0.5;
        switch (cad.upgradePriceModifier) {
            case 1 / 2:
                msg = "Upgrades are half as expensive.";
                break;
            case 1 / 512:
                msg = "Upgrades are...really cheap.";
                break;
            default:
                msg = "Upgrades are " + cad.upgradePriceModifier + " times normal price.";
                break;
        }
        return msg;
    },
    expensiveStuffPlease() {
        if (cad.actionPriceModifier === 512) {
            return "Seriously?";
        }
        let msg = "";
        cad.actionPriceModifier *= 2;
        switch (cad.actionPriceModifier) {
            case 2:
                msg = "Stuff is twice as expensive.";
                break;
            case 512:
                msg = "Stuff is...really expensive.";
                break;
            default:
                msg = "Stuff is " + cad.actionPriceModifier + " times normal price.";
                break;
        }
        return msg;
    },
    cheaperStuffPlease() {
        if (cad.actionPriceModifier === 1 / 512) {
            return "Is this not easy enough for you yet??";
        }
        let msg = "";
        cad.actionPriceModifier *= 0.5;
        switch (cad.actionPriceModifier) {
            case 1 / 2:
                msg = "Stuff is half as expensive.";
                break;
            case 1 / 512:
                msg = "Stuff is...really cheap.";
                break;
            default:
                msg = "Stuff is " + cad.actionPriceModifier + " times normal price.";
                break;
        }
        return msg;
    },
};

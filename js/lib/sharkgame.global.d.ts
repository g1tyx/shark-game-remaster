/// <reference path="./decimal.global.d.ts"/>
export namespace SharkGame {}

declare global {
    const DecimalHalfRound: { [K in keyof Decimal.Constructor]: Decimal.Constructor[K] } & { new (n: Decimal.Value): DecimalHalfRound };
    type DecimalHalfRound = { [K in keyof Decimal.Instance]: Decimal.Instance[K] };
}

declare global {
    const SharkGame: SharkGame;

    //// REGION: Data structure types
    type AspectName = string;
    type HomeActionName = string;
    type HomeActionCategory = "all" | "basic" | "frenzy" | "professions" | "breeders" | "processing" | "machines" | "otherMachines" | "unique";
    type ResourceName = string;
    type ResourceCategory =
        | "harmful"
        | "scientific"
        | "magical"
        | "frenzy"
        | "animals"
        | "stuff"
        | "processed"
        | "breeders"
        | "specialists"
        | "machines"
        | "special"
        | "hidden";
    type UpgradeName = string;
    type WorldName = string;
    type ModifierName = string;
    type ProgressionType = "2-scale";
    type CostFunction = "linear" | "constant";

    type CheatButtonType = undefined | "numeric" | "up-down";
    type CheatButton = {
        readonly name: string;
        type: CheatButtonType;
        updates: boolean;
        click(): void;
        clickUp(): void;
        clickDown(): void;
    };

    type EventName = "beforeTick" | "afterTick";
    type EventAction = "trigger" | "remove" | "pass";
    type SharkEventHandler = {
        handlingTime: EventName;
        priority: number;
        getAction(): EventAction;
        trigger(): boolean;
    };

    type GateRequirements = Partial<{
        upgrades: Record<UpgradeName, string>;
        slots: Record<ResourceName, number>;
        resources: Record<ResourceName, number>;
    }>;

    type HomeAction = {
        name: string;
        effect: {
            resource: Record<ResourceName, number>;
        };
        cost: {
            resource: ResourceName;
            costFunction: CostFunction;
            priceIncrease: number;
        }[];
        max?: ResourceName;
        prereq: Partial<{
            resource: Record<ResourceName, number>;
            upgrade: UpgradeName[];
            notWorlds: WorldName[];
        }>;
        outcomes: string[];
        multiOutcomes: string[];
        helpText: string;
        unauthorized?: boolean;
    };
    type HomeActionTable = Record<HomeActionName, HomeAction>;

    type Upgrade = {
        name: string;
        desc: string;
        researchedMessage: string;
        effectDesc: string;
        cost: Record<ResourceName, number>;
        effect?: Partial<{
            incomeMultiplier: Record<ResourceName, number>;
            sandMultiplier: Record<ResourceName, number>;
            kelpMultiplier: Record<ResourceName, number>;
            addJellyIncome: Record<ResourceName, number>;
            resourceBoost: Record<ResourceName, number>;
            incomeBoost: Record<ResourceName, number>;
        }>;
        required?: Partial<{
            upgrades: UpgradeName[];
            seen: ResourceName[];
            resources: ResourceName[];
            totals?: Record<ResourceName, number>;
        }>;
    };
    type UpgradeTable = Record<UpgradeName, Upgrade>;

    // TODO: Find out how to replace `string[]|number` with a Type parameter, since it's only ever one or the other per Modifier
    type Modifier = {
        defaultValue: string[] | number;
        name?: string;
        apply(current: string[] | number, degree: number | string, generator: string): string[] | number;
        effectDescription?(degree: number | string, generator: string): string;
        getEffect?(genDegree: number, outDegree: number, gen: string, out: string): number;
        applyToInput(input: number, genDegree: string[] | number, outDegree: string[] | number, gen: string, out: string): number;
    };

    type Pane = [title: string, contents: JQuery<HTMLElement>, notCloseable: boolean | undefined, fadeInTime: number, customOpacity: number];

    // TODO: Not quite complete type
    type WorldType = {
        name: WorldName;
        desc: string;
        shortDesc: string;
        entry: string;
        style: string;
        includedResources?: ResourceName[];
        absentResources: ResourceName[];
        modifiers: unknown[]; // TODO: Modifier type
        gateRequirements: GateRequirements;
        foresight?: {
            longDesc: string;
            missing: ResourceName[];
            present: ResourceName[];
            tip?: string;
        };
    };
    //// END REGION: Data structure types

    //// REGION: Data structure types
    type Aspect = {
        requiredBy: AspectName[] | undefined;
        /** Whether to use the event spritesheet */
        eventSprite: boolean;
        icon: string;
        posX: number;
        posY: number;
        width: number;
        height: number;
        level: number;
        prerequisites: AspectName[];
        getCost(level: number): number;
        getEffect(level: number): string;
        /**
         * Tells you if miscellaneous requirements have been met.
         * If they have, returns nothing.
         * If they have not, returns a message stating why not.
         */
        getUnlocked(): string;
        clicked(event: JQuery.MouseDownEvent): void;
        apply(time: string): void;
    };

    type StaticButton = {
        posX: number;
        posY: number;
        width: number;
        height: number;
        name: string;
        description: string;
        getEffect(): string;
        clicked(event: MouseEvent): void;
    };
    //// END REGION: Data structure types

    //// REGION: Modules
    type AspectTreeModule = {
        dragStart: { posX: number; posY: number };
        cameraZoom: number;
        cameraOffset: { posX: number; posY: number };
        context?: CanvasRenderingContext2D;
        staticButtons: Record<string, StaticButton>;
        setUp(): void;
        init(): void;
        drawTree(disableCanvas: boolean): HTMLTableElement | HTMLDivElement;
        drawTable(table?: HTMLTableElement): HTMLTableElement;
        drawCanvas(): HTMLCanvasElement;
        getCursorPositionInCanvas(canvas: HTMLCanvasElement, event: MouseEvent): { posX: number; posY: number };
        getButtonUnderMouse(mouseEvent: MouseEvent): StaticButton | Aspect;
        updateMouse(event: MouseEvent): void;
        click(event: MouseEvent): void;
        startPan(event: MouseEvent): void;
        pan(event: MouseEvent): void;
        endPan(): void;
        render(): void;
        /**
         * Helper function that draws a rounded rectangle with an icon using the current state of the canvas
         * @param context
         * @param posX The top left x coordinate
         * @param posY The top left y coordinate
         * @param width The width of the rectangle
         * @param height The height of the rectangle
         * @param icon The icon to draw in the rectangle
         * @param name The name of the button
         */
        renderButton(context: CanvasRenderingContext2D, posX: number, posY: number, width: number, height: number, icon: string, name: string): void;
        getLittleLevelText(aspectName: AspectName): string | undefined;
        increaseLevel(aspect: AspectName): void;
        updateEssenceCounter(): void;
        applyAspects(): void;
    };

    type ButtonModule = {
        makeHoverscriptButton(
            id: string,
            content: string,
            parentDiv: HTMLDivElement | JQuery<HTMLDivElement>,
            onClick: (event: JQuery.MouseDownEvent) => void,
            onMouseEnter: (event: JQuery.MouseEnterEvent) => void,
            onMouseLeave: (event: JQuery.MouseLeaveEvent) => void
        ): JQuery<HTMLButtonElement>;
        makeButton(
            id: string,
            content: string,
            parentDiv: HTMLDivElement | JQuery<HTMLDivElement>,
            onClick: (event: JQuery.MouseDownEvent) => void
        ): JQuery<HTMLButtonElement>;
    };

    type ColorUtilModule = {
        colorLum(hex: string, lum: number): string;
        getRelativeLuminance(color: string): number;
        correctLuminance(color: string, luminance: number): string;
        convertColorString(color: string): string;
        getBrightColor(color: string): string;
        getElementColor(id: string, propertyName: string): ReturnType<ColorUtilModule["convertColorString"]>;
    };

    type EventHandlerModule = {
        eventQueue: SharkEventHandler[][];
        init(): void;
        handleEventTick(handlingTime: EventName | "load"): void;
    };

    type GatewayModule = {
        PresenceFeelings: Record<ResourceName, string>;
        Messages: {
            essenceBased: { min: number; max: number; messages: string[] }[];
            lastPlanetBased: Record<WorldName, string[]>;
            loss: string[];
            generic: string[];
        };
        NUM_PLANETS_TO_SHOW: number;
        transitioning: boolean;
        selectedWorld: WorldName;
        allowedWorlds: WorldName[];
        completedWorlds: WorldName[];
        planetPool: WorldName[];
        init(): void;
        enterGate(loadingFromSave?: boolean): void;
        cleanUp(): void;
        showGateway(essenceRewarded: number, patienceReward: number): void;
        showRunEndInfo(containerDiv: JQuery<HTMLDivElement>): void;
        showAspects(): void;
        showPlanets(foregoAnimation?: boolean): void;
        formatDestinyGamble(): void;
        rerollWorlds(): void;
        confirmWorld(): void;
        switchViews(callback: () => void): void;
        preparePlanetSelection(numPlanets: number): void;
        updatePlanetButtons(): void;
        getVoiceMessage(): string;
        showPlanetAttributes(worldData: WorldType, contentDiv: JQuery<HTMLDivElement>): void;
        playerHasSeenResource(resource: ResourceName): boolean;
        markWorldCompleted(worldType: WorldName): void;
    };

    type HomeActionsModule = {
        /** Generated cache on-demand */
        generated: Record<WorldName, HomeActionTable>;
        default: HomeActionTable;
        getActionTable(worldType?: WorldName);
        /**
         * Retrieves, modifies, and returns the data for an action. Implemented to intercept retreival of action data to handle special logic where alternatives are inconvenient or impossible.
         * @param table The table to retrieve the action data from
         * @param actionName The name of the action
         */
        getActionData(table: HomeActionTable, actionName: HomeActionName): HomeAction;
        generateActionTable(worldType?: WorldName): Record<HomeActionName, HomeAction>;
    };

    type UpgradesModule = {
        purchased: UpgradeName;
        /** Generated cache on-demand */
        generated: Record<WorldName, UpgradeTable>;
        getUpgradeTable(worldType?: WorldName): UpgradeTable;
        /**
         * Retrieves, modifies, and returns the data for an upgrade. Implemented to intercept retreival of upgrade data to handle special logic where alternatives are inconvenient or impossible.
         * @param table The table to retrieve the upgrade data from
         * @param upgradeName The name of the upgrade
         */
        getUpgradeData(table: UpgradeTable, upgradeName: UpgradeName): Upgrade;
        generateUpgradeTable(worldType: WorldName): UpgradeTable;
    };

    type LogModule = {
        initialised: boolean;
        initialized: boolean;
        messages: JQuery<HTMLLIElement>;
        totalCount: number;
        moveLog(): void;
        addMessage(message: string | JQuery.Node): JQuery<HTMLLIElement>;
        addError(message: string | JQuery.Node): ReturnType<LogModule["addMessage"]>;
        addDiscovery(message: string | JQuery.Node): ReturnType<LogModule["addMessage"]>;
        correctLogLength(): void;
        clearMessages(logThing?: boolean): void;
        toggleExtendedLog(): void;
        haveAnyMessages(): boolean;
    };

    type MainModule = {
        tickHandler: number;
        autosaveHandler: number;
        applyFramerate(): void;
        init(foregoLoad?: boolean): void;
        tick(): void;
        processSimTime(numberOfSeconds: number, load?: boolean): void;
        autosave(): void;
        checkForUpdate(): void;
        createBuyButtons(customLabel: string | undefined, addToWhere: JQuery, appendOrPrepend: "append" | "prepend", absoluteOnly?: boolean): void;
        onCustomChange(): void;
        showSidebarIfNeeded(): void;
        applyProgressionSpeed(): void;
        getProgressionConstant(alternative?: ProgressionType): 1.5 | 1 | 2 | 4;
        endGame(loadingFromSave?: boolean): void;
        purgeGame(): void;
        loopGame(): void;
        isFirstTime(): boolean;
        resetTimers(): void;
    };

    type MathUtilModule = {
        /**
         * @param current current amount
         * @param desired desired amount
         * @param cost constant price
         * @returns cost to get to b from a
         */
        constantCost(current: Decimal | number, difference: Decimal | number, cost: Decimal | number): Decimal | number;
        /**
         * @param current current amount
         * @param available available price amount
         * @param cost constant price
         * @returns absolute max items that can be held with invested and current resources
         */
        constantMax(current: Decimal | number, available: Decimal | number, cost: Decimal | number): Decimal | number;
        /**
         * @param current current amount
         * @param desired desired amount
         * @param cost cost increase per item
         * @returns: cost to get to b from a
         */
        linearCost(current: Decimal | number, difference: Decimal | number, constant: Decimal | number): Decimal | number;
        /**
         * @param current current amount
         * @param available available price amount
         * @param cost cost increase per item
         * @returns absolute max items that can be held with invested and current resources
         */
        linearMax(current: Decimal | number, available: Decimal | number, cost: Decimal | number): Decimal | number;
        /** artificial limit - whatever has these functions for cost/max can only have one of */
        uniqueCost(current: Decimal | number, difference: Decimal | number, cost: Decimal | number): Decimal | number;
        /** this takes an argument to know whether or not to return a Decimal or a Number */
        uniqueMax(current: Decimal | number): Decimal | number;
        getBuyAmount(nomaxBuy: boolean): Decimal | number;
        /** This is weird */
        getPurchaseAmount(resource: ResourceName, owned?: number): Decimal | number;
    };

    type PaneHandlerModule = {
        paneStack: Pane[];
        currentPane?: Pane;
        buildPane(): JQuery<HTMLDivElement>;
        addPaneToStack(title: string, contents: JQuery<HTMLElement>, notCloseable: boolean, fadeInTime: number, customOpacity: number): void;
        swapCurrentPane(title: string, contents: JQuery<HTMLElement>, notCloseable: boolean, fadeInTime: number, customOpacity: number): void;
        wipeStack(): void;
        showPane(title: string, contents: JQuery<HTMLElement>, notCloseable: boolean, fadeInTime: number, customOpacity: number): void;
        hidePane(): void;
        showOptions(): void;
        setUpOptions(): JQuery<HTMLTableElement>;
        onOptionClick(): void;
        showChangelog(): void;
        showHelp(): void;
        showSpeedSelection(): void;
        showAspectWarning(): void;
    };
    //// END REGION: Modules

    //// REGION: Tabs
    type SharkGameTabBase = {
        init(): void;
        switchTo(): void;
        update(): void;

        tabId: string;
        tabDiscovered: boolean;
        tabSeen: boolean;
        tabName: string;
        tabBg?: string;
        discoverReq: { resource: Record<ResourceName, number> }; // TODO: Find a better type
        message?: string;
    };

    type CheatsAndDebugTab = SharkGameTabBase & {
        pause: boolean;
        stop: boolean;
        speed: number;
        upgradePriceModifier: number;
        actionPriceModifier: number;
        noNumberBeautifying: boolean;
        cycling: boolean;

        defaultParameters: {
            pause: boolean;
            stop: boolean;
            speed: number;
            upgradePriceModifier: number;
            actionPriceModifier: number;
            noNumberBeautifying: boolean;
            cycling: boolean;
        };

        cheatButtons: Record<string, CheatButton>;

        cycleStyles(time?: number): void;
        discoverAll(): void;
        giveEverything(amount?: number): void;
        debug(): void;
        hideDebug(): void;
        toggleDebugButton(): void;
        togglePausePlease(): void;
        toggleStopPlease(): void;
        freezeGamePlease(): string;
        unfreezePlease(): string;
        freeEssencePlease(howMuch?: number): string;
        goFasterPlease(): string;
        reallyFastPlease(): string;
        goSlowerPlease(): string;
        reallySlowPlease(): string;
        resetSpeedPlease(): string;
        giveMeMoreOfEverythingPlease(multiplier: number): string;
        setAllResources(howMuch?: number): void;
        doSomethingCoolPlease(): string;
        beatWorldPlease(): string;
        toggleBeautify(): void;
        rollTheDicePlease(number: number): string;
        expensiveUpgradesPlease(): string;
        cheaperUpgradesPlease(): string;
        expensiveStuffPlease(): string;
        cheaperStuffPlease(): string;
    };

    type GateTab = SharkGameTabBase & {
        messageOneSlot: string;
        messageOpened: string;
        messagePaid: string;
        messageCantPay: string;
        messagePaidNotOpen: string;
        messageAllPaid: string;
        messageEnter: string;
        sceneClosedImage: string;
        sceneAlmostOpenImage: string;
        sceneOpenImage: string;
        sceneClosedButFilledImage: string;

        requirements: {
            slots: Record<ResourceName, number>;
            upgrades: Record<UpgradeName, string>;
            resources: Record<ResourceName, number>;
        };
        completedRequirements: {
            slots: Record<ResourceName, boolean>;
            upgrades: Record<UpgradeName, boolean>;
            resources: Record<ResourceName, boolean>;
        };

        createSlots(gateRequirements: GateRequirements, gateCostMultiplier: number): void;
        getMessage(): string;
        getSlotsLeft(): number | false;
        getUpgradesLeft(): number | false;
        getResourcesLeft(): unknown[] | false; // TODO: Find better type
        onHover(): void;
        onUnhover(): void;
        onGateButton(): void;
        onEnterButton(): void;
        shouldBeOpen(): boolean;
        checkUpgradeRequirements(upgradeName: UpgradeName): void;
        checkResourceRequirements(resourceName: ResourceName): void;
        getSceneImagePath(): string;
    };

    type HomeTab = SharkGameTabBase & {
        currentButtonTab: null | HomeActionCategory;
        currentExtraMessageIndex: number;
        extraMessages: Record<
            WorldName,
            {
                name: string;
                message: string;
                scales?: boolean;
                unlock?: Partial<{
                    resource: Record<ResourceName, number>;
                    totalResource: Record<ResourceName, number>;
                    homeAction: HomeActionName[];
                    upgrade: UpgradeName[];
                }>;
            }[]
        >;
        discoverActions(): void;
        createButtonTabs(): void;
        updateTab(tabToUpdate: string): void;
        changeButtonTab(tabToChangeTo: HomeActionCategory): void;
        updateMessage(suppressAnimation: boolean): void;
        updateButton(actionName: HomeActionName): void;
        areActionPrereqsMet(actionName: HomeActionName): boolean;
        shouldRemoveHomeButton(action: HomeAction): boolean;
        addButton(actionName: HomeActionName): void;
        getActionCategory(actionName: HomeActionName): string;
        onHomeButton(mouseEnterEvent: JQuery.MouseEnterEvent, actionName: HomeActionName): void;
        onHomeUnhover(): void;
        getCost(action: HomeAction, amount: number): Record<ResourceName, number>;
        getMax(action: HomeAction): Decimal;
    };

    type LabTab = SharkGameTabBase & {
        sceneImage: string;
        sceneDoneImage: string;
        listEmpty: boolean;
        messageDone: string;
        resetUpgrades(): void;
        setHint(upgradeTable: UpgradeTable): void;
        updateLabButton(upgradeName: UpgradeName): void;
        onLabButton(): void;
        addUpgrade(upgradeId: UpgradeName): void;
        allResearchDone(): boolean;
        isUpgradePossible(upgradeName: UpgradeName): boolean;
        isUpgradeVisible(upgradeId: UpgradeName): boolean;
        getResearchEffects(upgrade: Upgrade): string;
        updateUpgradeList(): void;
    };

    type RecyclerTab = SharkGameTabBase & {
        sceneImage?: string;
        recyclerInputMessages: string[];
        recyclerOutputMessages: string[];
        allowedCategories: Record<ResourceCategory, CostFunction | undefined>;
        bannerResources: ResourceName[];
        efficiency: "NA" | number;
        hoveredResource: "NA" | number;
        expectedOutput: "NA" | number;
        expectedJunkSpent: "NA" | number;
        updateJunkDisplay(): void;
        updateButtons(): void;
        createButtons(): void;
        onInput(): void;
        onOutput(): void;
        getMaxToBuy(resource: ResourceName): Decimal;
        onInputHover(): void;
        onInputUnhover(): void;
        onOutputHover(): void;
        onOutputUnhover(): void;
        getTarString(): string;
        getRecyclerEfficiencyString(): string;
        updateExpectedOutput(): void;
        updateExpectedJunkSpent(): void;
        getEfficiency(): number;
        updateEfficiency(resource: ResourceName): void;
    };
    //// END REGION: Tabs

    type SharkGameTabs = {
        CheatsAndDebug: CheatsAndDebugTab;
        Gate: GateTab;
        Home: HomeTab;
        Lab: LabTab;
        Recycler: RecyclerTab;
        Reflection;
        Stats;
    };

    type SharkGameModules = {
        AspectTree: AspectTreeModule;
        Button: ButtonModule;
        ColorUtil: ColorUtilModule;
        EventHandler: EventHandlerModule;
        Gateway: GatewayModule;
        HomeActions: HomeActionsModule;
        Log: LogModule;
        Main: MainModule;
        MathUtil: MathUtilModule;
        PaneHandler: PaneHandlerModule;
        ResourceIncomeAffected;
        ResourceIncomeAffectors;
        ResourceIncomeAffectorsOriginal;
        ResourceMap;
        Resources;
        ResourceSpecialProperties;
        ResourceTable;
        Save;
        Settings;
        Sprites;
        TabHandler;
        Tabs;
        TextUtil;
        TitleBar;
        TitleBarHandler;
        Upgrades: UpgradesModule;
        World;
        WorldTypes;
    };
    type SharkGameConstants = {
        ACTUAL_GAME_NAME: string;
        BIGGEST_SAFE_NUMBER: number;
        COMMIT_SHA: number;
        EPSILON: number;
        GAME_NAME: string;
        GAME_NAMES: string[];
        INTERVAL: number;
        MAX: number;
        ORIGINAL_VERSION: string;
        VERSION_NAME: string;
        VERSION: string;
        Changelog: Record<string, string[]>;
        FunFacts: string[];
    };
    type SharkGameUtils = {
        changeSprite(spritePath: string, imageName: string, imageDiv: JQuery<HTMLDivElement>, backupImageName: string): JQuery<HTMLDivElement>;
        choose<T>(choices: T[]): T;
        getImageIconHTML(imagePath: string | undefined, width: number | string, height: number | string): string;

        before: number;
        dt: number;
        flags: Record<string, unknown>; // TODO: Find out unknown type
        gameOver: boolean;
        paneGenerated: boolean;
        persistentFlags: Record<string, unknown>; // TODO: Find out unknown type
        sidebarHidden: boolean;
        spriteHomeEventPath: string;
        spriteIconPath: string;
        timestampGameStart: number;
        timestampLastSave: number;
        timestampRunEnd: number;
        timestampRunStart: number;
        timestampSimulated: number;
        wonGame: boolean;
    };
    type SharkGameData = {
        Aspects: Record<AspectName, Aspect>;
        Events: Record<string, SharkEventHandler>;
        HomeActionCategories: Record<HomeActionCategory, { name: string; actions: HomeActionName }>;
        InternalCategories: Record<ResourceName, { name: string; resources: ResourceName[] }>;
        HomeActions: Record<WorldName, HomeActionTable>;
        Upgrades: Record<WorldName, UpgradeTable>;
        ModifierTypes: Record<"upgrade" | "world" | "aspect", Record<"multiplier" | "other", Record<ModifierName, Modifier>>>;
        Panes: Record<string, string[]>;
        ResourceCategories: Record<ResourceCategory, { name: string; disposeMessage: string[]; resources: ResourceName[] }>;
    };
    type SharkGameRuntimeData = {
        BreakdownIncomeTable: Map<ResourceName, Record<ResourceName, number>>;
        FlippedBreakdownIncomeTable: Map<ResourceName, Record<ResourceName, number>>;
        GeneratorIncomeAffected: SharkGameRuntimeData["GeneratorIncomeAffectorsOriginal"];
        GeneratorIncomeAffectors: SharkGameRuntimeData["GeneratorIncomeAffectorsOriginal"];
        GeneratorIncomeAffectorsOriginal: Record<ResourceName, Record<"multiply" | "exponentiate", Record<ResourceName, number>>>; // TOOD: Might be a better type available later;
        ModifierMap: Map<
            ResourceName,
            Record<"upgrade" | "world" | "aspect", Record<"multiplier" | "other", Record<ModifierName, number | string[]>>>
        >;
        /** Can be indexed with the name of a modifier to return the associated data in SharkGame.ModifierTypes. */
        ModifierReference: Map<ModifierName, Modifier>;
        PlayerIncomeTable: Map<ResourceName, number>;
        PlayerResources: Map<ResourceName, { amount: number; totalAmount: number }>;
    };

    type SharkGame = SharkGameConstants & SharkGameUtils & SharkGameModules & SharkGameData & SharkGameRuntimeData & SharkGameTabs;
}

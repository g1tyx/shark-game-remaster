export namespace SharkGame {}

declare global {
    const SharkGame: SharkGame;

    //// REGION: Data structure types
    type AspectName = string;
    type ResourceName = string;
    type UpgradeName = string;

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
        discoverReq: Record<string, unknown>; // TODO: Find a better type
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
        message: string;
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
    //// END REGION: Tabs

    type SharkGameTabs = {
        CheatsAndDebug: CheatsAndDebugTab;
        Gate: GateTab;
        Home;
        Lab;
        Recycler;
        Reflection;
        Stats;
    };

    type SharkGameModules = {
        AspectTree: AspectTreeModule;
        Button: ButtonModule;
        ColorUtil: ColorUtilModule;
        EventHandler: EventHandlerModule;
        FunFacts;
        Gateway;
        GeneratorIncomeAffected;
        GeneratorIncomeAffectors;
        GeneratorIncomeAffectorsOriginal;
        HomeActionCategories;
        HomeActions;
        InternalCategories;
        Log;
        Main;
        MathUtil;
        ModifierMap;
        ModifierReference;
        ModifierTypes;
        PaneHandler;
        Panes;
        PlayerIncomeTable;
        PlayerResources;
        ResourceCategories;
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
        Upgrades;
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
    };
    type SharkGameRuntimeData = {
        BreakdownIncomeTable: Map<ResourceName, Record<ResourceName, number>>;
        FlippedBreakdownIncomeTable: Map<ResourceName, Record<ResourceName, number>>;
    };

    type SharkGame = SharkGameConstants & SharkGameUtils & SharkGameModules & SharkGameData & SharkGameRuntimeData & SharkGameTabs;
}

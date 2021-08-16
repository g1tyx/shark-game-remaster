export namespace SharkGame {}

declare global {
    const SharkGame: SharkGame;

    //// REGION: Data structure types
    type AspectName = string;
    type ResourceName = string;
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
    //// END REGION: Modules

    type SharkGameModules = {
        AspectTree: AspectTreeModule;
        Button;
        Changelog;
        CheatsAndDebug;
        ColorUtil;
        EventHandler;
        Events;
        FlippedBreakdownIncomeTable;
        FunFacts;
        Gate;
        Gateway;
        GeneratorIncomeAffected;
        GeneratorIncomeAffectors;
        GeneratorIncomeAffectorsOriginal;
        Home;
        HomeActionCategories;
        HomeActions;
        InternalCategories;
        Lab;
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
        Recycler;
        Reflection;
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
        Stats;
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
    };
    type SharkGameRuntimeData = {
        BreakdownIncomeTable: Map<ResourceName, Record<ResourceName, number>>;
    };

    type SharkGame = SharkGameConstants & SharkGameUtils & SharkGameModules & SharkGameData & SharkGameRuntimeData;
}


export class GridCommandStyleDefinition {
    containerClass: string = "button is-small";
    iconCommandClass: string = "has-icon";
    textCommandClass: string = "";
    activeCommandClass: string = "is-primary";
}

export class GridRowCommandStyleDefinition extends GridCommandStyleDefinition {
    containerClass: string = "is-small";
    textCommandClass: string = "button";
}

export class GridColumnCustomizerStyleDefinition {
    containerClass: string = "has-text-left";
    activeClass: string = "is-active";
    align: "right" | "left" = "left";
    triggerButtonClass: string = "button has-icon is-small";
    triggerButtonIconClass: string = "fas fa-table-columns";
    checkboxButtonClass: string = "icon is-pulled-left";
    checkboxButtonIconUncheckedClass: string = "far fa-square-plus";
    checkboxButtonIconCheckedClass: string = "fas fa-square-minus";
    orderButtonClass: string = "icon is-pulled-right";
    orderButtonIconClass: string = "fas fa-bars";
    
}

export class GridStyleDefinition {
    mainContainerClass: string = "control";
    titleClass: string = "subtitle";
    tableClass: string = "table is-narrow is-fullwidth is-striped is-hoverable";
    headerRowClass: string = "";
    sortIconClass: string = "is-small";

    columnCustomizer = new GridColumnCustomizerStyleDefinition();

    dataRowClass: string = "";
    dataRowSelectedClass: string = "is-selected";

    rowCommand: GridCommandStyleDefinition = new GridRowCommandStyleDefinition();
    gridCommand: GridCommandStyleDefinition = new GridCommandStyleDefinition();
    bottomRowClass: string = "tile"; 
    gridCommandContainerClass: string = "tile is-child-buttons";
    itemsPerPageContainerClass: string = "tile is-child is-size-7";
    itemCountContainerClass: string = "tile is-child is-size-7 has-text-right"; 

    pagingCommand: GridCommandStyleDefinition = new GridCommandStyleDefinition();
    pagingTextClass: string = "is-pulled-right is-size-7";

    showMoreCommand: GridCommandStyleDefinition = new GridCommandStyleDefinition();
    showMoreCommandRowClass: string = "has-text-centered"
}
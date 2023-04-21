
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

export class GridStyleDefinition {
    mainContainerClass: string = "control";
    tableClass: string = "table is-narrow is-fullwidth is-striped is-hoverable";
    headerRowClass: string = "";
    sortIconClass: string = "is-small";

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
}
export interface IGridBaseCommandDefinition {
    label: string | undefined;
    iconClass: string | undefined;
    cssClass: string | undefined;
}

export interface IGridCommandDefinition extends IGridBaseCommandDefinition {
    command: (selectedItems: any[]) => any;
    filter: (selectedItems: any[]) => boolean;
}

export interface IGridRowCommandDefinition extends IGridBaseCommandDefinition{
    command: (item: any) => any;
    filter: (item: any) => boolean;
}

export class GridBaseCommandDefinition {
    protected _label: string | undefined = undefined;
    protected _iconClass: string | undefined = undefined;
    protected _cssClass: string | undefined = undefined;
    public get label() { return this._label; }
    public get iconClass() { return this._iconClass; }
    public get cssClass() { return this._cssClass; }
}
class __BaseCommandDefinition<TDef extends GridBaseCommandDefinition> extends GridBaseCommandDefinition {
    public withLabel(label: string): TDef {
        this._label = label;
        return this as unknown as TDef;
    }
    
    public withIcon(iconClass: string): TDef {
        this._iconClass = iconClass;
        return this as unknown as TDef;
    }
    
    public withClass(cssClass: string): TDef {
        this._cssClass = cssClass;
        return this as unknown as TDef;
    }
}
export class GridCommandDefinition extends __BaseCommandDefinition<GridCommandDefinition> implements IGridCommandDefinition{
    private _command: (selectedItems: any[]) => any;
    private _filter: (selectedItems: any[]) => boolean = _ => _==_;
    public get command() { return this._command; }
    public get filter() { return this._filter; }
    public constructor(command: (selectedItems: any[]) => any){
        super();
        this._command = command;
    }
    public withFilter(filterFn: (selectedItems: any[]) => boolean) : GridCommandDefinition {
        this._filter = filterFn;
        return this;
    }
}
export class GridRowCommandDefinition extends __BaseCommandDefinition<GridRowCommandDefinition> implements IGridRowCommandDefinition {
    private _command: (item: any) => any;
    private _filter: (item: any) => boolean = _ => _==_;
    public get command() { return this._command; }
    public get filter() { return this._filter; }
    public constructor(command: (item: any) => any){
        super();
        this._command = command;
    }
    public withFilter(filterFn: (item: any) => boolean) : GridRowCommandDefinition {
        this._filter = filterFn;
        return this;
    }
}
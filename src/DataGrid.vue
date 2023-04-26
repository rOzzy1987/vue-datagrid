<template>
    <div ref="container" :class="styling.mainContainerClass" style="width: 100%; overflow-x: auto;" :style="{'user-select': selectionMode != GridSelectionMode.None ? 'none': 'initial'}">
        <div v-if="title != ''" :class="styling.titleClass">
            {{ title }}
        </div>
        <div v-if="isColumnListOrderable || optionalColumns.length > 0" :class="styling.columnCustomizer.containerClass ">
            <div class="column-customizer" :class="styling.columnCustomizer.align +' '+ (columnCustomization.selectorActive ? styling.columnCustomizer.activeClass : '')" >
                <div class="column-customizer-trigger" style="right: 0 !important">
                    <button ref="columnsButton" :class="styling.columnCustomizer.triggerButtonClass" @click.prevent="columnCustomization.selectorActive = !columnCustomization.selectorActive">
                        <i :class="styling.columnCustomizer.triggerButtonIconClass"></i>
                    </button>
                </div>
                <div class="column-customizer-menu">
                    <div class="column-customizer-content"
                        @mousemove="colOrderMoveItem($event, {x: $event.clientX, y: $event.clientY})"
                        @touchmove="colOrderMoveItem($event, {x: $event.touches[0].clientX, y: $event.touches[0].clientY})"
                        @mouseup="colOrderReleaseItem($event)"
                        @touchend="colOrderReleaseItem($event)" :key="columnCustomization.key">
                        <div v-for="col of _columns" :key="col.id" :name="col.id" class="column-customizer-item" @click.prevent="if (col.isOptional) col.isHidden = !col.isHidden;">
                            <span :class="styling.columnCustomizer.checkboxButtonClass">
                                <i :class="!col.isOptional ? '' : col.isHidden ? styling.columnCustomizer.checkboxButtonIconUncheckedClass : styling.columnCustomizer.checkboxButtonIconCheckedClass"></i>
                            </span>
                            <span :class="styling.columnCustomizer.orderButtonClass" v-if="isColumnListOrderable"
                                @mousedown="colOrderGrabItem($event, {x: $event.clientX, y: $event.clientY})"
                                @touchstart="colOrderGrabItem($event, {x: $event.touches[0].clientX, y: $event.touches[0].clientY})">
                                <i :class="styling.columnCustomizer.orderButtonIconClass"></i>
                            </span>
                            <span class="column-customizer-text">{{ col.title }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            <table :class="styling.tableClass" :key="columnCustomization.key">
                <thead>
                    
                    <tr :class="styling.headerRowClass">
                        <th v-for="col of displayedColumns" :key="col.idx" :title="col.column.tooltip ?? undefined" @click="setOrder(col.column.id)" 
                        :style="col.column.headerStyle" :class="col.column.headerCssClasses">
                            <span v-if="isSortable && _sortByColumn == col.column.id" class="icon" :class="styling.sortIconClass"><i class="fas" :class="{'fa-sort-up': _sortAscending, 'fa-sort-down': !_sortAscending}"></i></span>
                            {{ col.column.title }}
                        </th>
                        <th v-if="rowCommands.length > 0">
                         </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, j) of _pagedModelValue" :key="j" :class="styleParser.getDataRowClasses(styling, _selectedItems.indexOf(item) >= 0)" @click="itemClicked($event, j)">
                        <td v-for="col of displayedColumns" :key="col.idx" :style="col.column.style" :class="col.column.cssClasses" v-html="col.column.getHtml(item)"></td>
                        <td v-if="rowCommands.length > 0" class="no-print" >
                            <RowCommandButton v-for="(cmd, i) in rowCommandsForItem(item)" :key="i" :cmd="ref(cmd)" :styling="styling.rowCommand" @click="cmd.command(item)"/>
                        </td>
                    </tr>
                    <tr v-if="_modelValue.length == 0">
                        <td :colspan="columnCount">{{ emptyText }}</td>
                    </tr>
                    <tr v-if="_modelValue.length != 0 && pagingMode == GridPagingMode.ShowMore">
                        <td :colspan="columnCount" :class="styling.showMoreCommandRowClass">
                            <CommandButton :styling="styling.showMoreCommand" :cmd="ref(new GridCommandDefinition(() => {}).withLabel(showMoreText))" @click="showMore" />
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr v-if="isFooterEnabled">
                        <th v-for="col of displayedColumns" :key="col.idx" :title="col.column.tooltip ?? undefined" @click="setOrder(col.column.id)" :style="col.column.headerStyle" :class="col.column.headerCssClasses">
                            <span v-if="isSortable && _sortByColumn == col.column.id" class="icon" :class="styling.sortIconClass"><i class="fas" :class="{'fa-sort-up': _sortAscending, 'fa-sort-down': !_sortAscending}"></i></span>
                            {{ col.column.title }}
                        </th>
                        <th v-if="rowCommands.length > 0">
                         </th>
                    </tr>
                    <tr v-if="_itemsPerPage != Number.POSITIVE_INFINITY" class="no-print">
                        <td :colspan="columnCount">
                            <CommandButton :styling="styling.pagingCommand" :cmd="ref(new GridCommandDefinition(() => {}).withIcon('fas fa-angles-left'))" :disabled="_page == 0" @click.prevent="_page = 0"/>
                            <CommandButton :styling="styling.pagingCommand" :cmd="ref(new GridCommandDefinition(() => {}).withIcon('fas fa-angle-left'))" :disabled="_page == 0" @click.prevent="_page--"/>
                            
                            <CommandButton v-for="i in pageButtons" :key="i" :styling="styling.pagingCommand" :cmd="ref(new GridCommandDefinition(() => {}).withLabel(`${i + 1}`))" @click.prevent="_page = i" :isActive="i == _page"/>
                            
                            <CommandButton :styling="styling.pagingCommand" :cmd="ref(new GridCommandDefinition(() => {}).withIcon('fas fa-angle-right'))" :disabled="_page == lastPage" @click.prevent="_page++"/>
                            <CommandButton :styling="styling.pagingCommand" :cmd="ref(new GridCommandDefinition(() => {}).withIcon('fas fa-angles-right'))" :disabled="_page == lastPage" @click.prevent="_page = lastPage"/>

                            <div :class="styling.pagingTextClass" v-if="pagingFooterText != undefined">{{ pagingFooterText.replace("{0}", "" + (_page + 1)).replace("{1}", "" + (lastPage + 1)) }}</div>
                        </td>
                    </tr>
                    <tr class="no-print">
                        <td :colspan="columnCount">
                            <div :class="styling.bottomRowClass">
                                <div :class="styling.gridCommandContainerClass">
                                    <span v-for="(cmd, i) in commandsForSelectedItems(selectedItems)" :key="i">
                                        <CommandButton :cmd="ref(cmd)" :styling="styling.gridCommand" @click="cmd.command(selectedItems)"/>
                                        &nbsp;
                                    </span>
                                </div>
                                <div :class="styling.itemsPerPageContainerClass" v-if="isItemsPerPageEditable">
                                    {{ itemsPerPageSelectorText }}
                                    <span v-for="n of [10, 20, 50, 100, 200]" :key="n" :style="{'text-decoration': _itemsPerPage == n ? 'underline' : 'none'}" @click="_itemsPerPage = n">&nbsp;{{ n }}&nbsp;</span>
                                </div>
                                <div :class="styling.itemCountContainerClass" v-if="itemsFooterText != undefined">
                                    {{ itemsFooterText.replace("{0}", "" + _itemCount ) }}
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
    </div>
</template>
<script lang="ts">
import CommandButton from './CommandButton.vue';
import RowCommandButton from './RowCommandButton.vue';
import { Downloader, type IDownloader } from './Downloader';
import { type IPrinter, Printer } from './Printer';

import type { IGridColumnDefinition } from './GridColumnDefinition';
import { GridCommandDefinition, type IGridBaseCommandDefinition, type IGridCommandDefinition, type IGridRowCommandDefinition } from './GridCommandDefinition';
import { GridCommandStyleDefinition, GridStyleDefinition } from './style';
import { ref } from 'vue';

export enum GridSelectionMode {
    None,
    One,
    Multi
}

export enum GridPagingMode {
    Local,
    Remote,
    ShowMore
}

export class GridStyleParser {
    public static extendWithClassList(o: any, classes: string | undefined, value: boolean = true) {
        if (typeof(o) == "string")
            o = this.extendWithClassList({}, o);
        if (o == undefined)
            o = {};

        if(classes == undefined)
            return o;

        const classArr = this.classList(classes);
        for (const c of classArr) {
            o[c] = value;
        }
        return o;
    }

    private static classList(cssStr: string) {
        return cssStr.split(" ").filter(c => c != "");
    }

    public static toString(o: any) 
    {
        const r = [] as string[];
        for (const key in o) {
            if (Object.prototype.hasOwnProperty.call(o, key)) {
                if (o[key] == true)
                    r.push(key);
            }
        }
        return r.join(" ");
    }
    
    public static getDataRowClasses(style: GridStyleDefinition, isSelected: boolean) {
        const o = this.extendWithClassList({}, style.dataRowClass)
        return this.extendWithClassList(o, style.dataRowSelectedClass, isSelected);
    }
        
    public static getCommandClasses(style: GridCommandStyleDefinition, command: IGridBaseCommandDefinition, isActive: Boolean = false) {
        let o = this.extendWithClassList(command.cssClass, style.containerClass);
        if(command.iconClass != "" && command.iconClass != undefined){
            o = this.extendWithClassList(o, style.iconCommandClass);
        } else {
            o = this.extendWithClassList(o, style.textCommandClass);
        }
        if(isActive){
            o = this.extendWithClassList(o, style.activeCommandClass);
        }
        return o; 
    }
}



export default {
    data(props) {
        return {
            sortByColumnField: props.sortByColumn,
            sortAscendingField: props.sortAscending,
            selectedItemsField: props.selectedItems,
            modelValueField: props.modelValue,
            columnsField: props.columns,
            lastItemClicked: 0,
            pageField: props.page,
            itemsPerPageField: props.itemsPerPage,
            columnCustomization: {
                selectorActive: false,
                columnGrabbed: null as HTMLElement | null,
                origin: null as {x:number, y: number} | null,
                key: "rndKey"
            }, 
            GridSelectionMode: GridSelectionMode,
            styleParser: GridStyleParser,
            GridCommandDefinition: GridCommandDefinition,
            GridPagingMode: GridPagingMode,
            ref: ref
        };
    },
    props: {
        title: { type: String, default: null },
        columns: { type: Array<IGridColumnDefinition>, required: true },
        rowCommands: { type: Array<IGridRowCommandDefinition>, default: [] as IGridRowCommandDefinition[] },
        gridCommands: { type: Array<IGridCommandDefinition>, default: [] as IGridCommandDefinition[] },
        selectionMode: { type: Number, default: GridSelectionMode.None },
        selectedItems: { type: Array<any>, default: [] },
        itemCount: { type: Number },
        modelValue: { type: Array<any>, required: true },
        // Sorting
        isSortable: { type: Boolean, default: false },
        sortByColumn: { type: String },
        sortAscending: { type: Boolean, default: true },
        // Misc. functions
        isColumnListOrderable: {type: Boolean, default: false },
        isFooterEnabled: { type: Boolean, default: false },
        isExportEnabled: { type: Boolean, default: false },
        isPrintEnabled: { type: Boolean, default: false },
        isItemsPerPageEditable: {type: Boolean, default: false },
        // Paging
        itemsPerPage: { type: Number, default: Number.POSITIVE_INFINITY },
        page: { type: Number, default: 0 },
        pagingMode: { type: Number, default: GridPagingMode.Local },
        showMoreText: {type: String, default: "Show more"},
        // Internationalization
        emptyText: { type: String, default: "- No data -" },
        exportText: {type: String, default: "Export to CSV"},
        exportFilenameFn: { type: Function, default: () => "export" },
        printText: { type: String, default: "Print" },
        pagingFooterText: { type: String },
        itemsFooterText: { type: String },
        itemsPerPageSelectorText: {type: String, default: "Items per page: "},
        styling: { type: GridStyleDefinition, default: new GridStyleDefinition() },
        
        downloader: { type: ref<IDownloader>, default: ref(new Downloader()) },
        printer: { type: ref<IPrinter>, default: ref(new Printer()) },
    },
    methods: {
        colOrderGrabItem(event: Event, origin: {x:number, y: number}) {
            let item = event.target as HTMLElement  
            if(this._columns.length < 2) return;
            const cc = this.columnCustomization;
            let i = 0;
            while (!item.classList.contains('column-customizer-item') && i < 3) {
                item = item.parentElement!;
            } 
            cc.columnGrabbed = item;
            cc.origin = origin;
            item.classList.add('grabbed');
            event.preventDefault();
        },
        colOrderMoveItem(event: Event, coord: {x:number, y: number}) {
            if(this._columns.length < 2) return;
            const cc = this.columnCustomization;
            const item = cc.columnGrabbed;
            if (item == null || cc.origin == null) 
                return;
            const container = item.parentElement!;
            const bounds = container.getBoundingClientRect();
            const itemBounds = item.getBoundingClientRect();
            item.style.top = Math.min(bounds.y + bounds.height - itemBounds.height,  Math.max(bounds.y - cc.origin.y, coord.y - cc.origin.y)) + "px";

            const allItems = [] as HTMLElement[];
            let oldIdx = 0;
            for(let i = 0; i < container.children.length; i++){
                const current = container.children.item(i) as HTMLElement;
                allItems.push(current);
                if (current.getAttribute('name') == item.getAttribute('name')) {
                    oldIdx = i;
                }
            }
            allItems.sort((a,b) => {
                    const aPos = a?.getBoundingClientRect().y ?? 0;
                    const aOffset = Number(((a as HTMLElement | null)?.style.top ?? "0").replace("px", ""));
                    const bPos = b?.getBoundingClientRect().y ?? 0;
                    const bOffset = Number(((b as HTMLElement | null)?.style.top ?? "0").replace("px", ""));
                    return (aPos + aOffset) - (bPos + bOffset);
                }
            );

            const newIdx = allItems.findIndex(i => i.getAttribute('name') == item.getAttribute('name'));
            
            if (oldIdx !=  newIdx) {
                var c =  container.children.item(oldIdx)!;
                const oldY = c.getBoundingClientRect().y;
                c.remove();
                if (newIdx == 0){
                    container.children.item(0)?.before(c);
                } else {
                    container.children.item(newIdx - 1)?.after(c);
                }
                const newY = c.getBoundingClientRect().y;
                cc.origin.y += newY - oldY;
                item.style.top = Math.min(bounds.y + bounds.height - itemBounds.height,  Math.max(bounds.y - cc.origin.y, coord.y - cc.origin.y)) + "px";
            }

            event.preventDefault();
        },
        colOrderReleaseItem(event: Event) {
            if(this._columns.length < 2) return;
            const cc = this.columnCustomization;
            const item = cc.columnGrabbed!;
            if (item == null) 
                return;
            item.classList.remove('grabbed');
            item.style.top = '0';
            cc.columnGrabbed = null;

            const container = item.parentElement!;
            const allItems = [] as HTMLElement[];
            for(let i = 0; i < container.children.length; i++){
                allItems.push(container.children.item(i) as HTMLElement);
            }
            
            const orderedColumns = [] as IGridColumnDefinition[];
            for (const i of allItems) {
                const name = i.getAttribute('name');
                orderedColumns.push(this._columns.filter(c =>c.id == name)[0]);
            }
            this._columns = orderedColumns;
            cc.key = "rnd"+ Math.round(Math.random()* 10000);

            event.preventDefault();
        },
        setOrder(colId: string) {
            if (this.pagingMode == GridPagingMode.ShowMore || !this.isSortable)
                return;
            const col = this._columns.filter(c => c.id == colId)[0];
            if (col == null || col.sortFn == null) {
                return;
            }
            if (this._sortByColumn != colId) {
                this._sortByColumn = colId;
                this._sortAscending = true;
            }
            else {
                this._sortAscending = !this._sortAscending;
            }
            this.sort();
        },
        sort() {
            if (this.pagingMode == GridPagingMode.Remote){
                this.remotePaging();
                return;
            }
            if (!this.isSortable || this._sortByColumn == undefined)
                return;
            const col = this._columns.filter(c => c.id == this._sortByColumn)[0];
            if(col == null || col.sortFn == null)
                return;

            const millis = Date.now();
            const sortFn = this._sortAscending
                ? col.sortFn
                : (a: any, b: any) => -col.sortFn!(a, b, false);
            this._modelValue = this._modelValue.slice().sort(sortFn);
            console.log(`[[DataGrid]] Sorting done in: ${Date.now()-millis}ms`);
        },
        remotePaging() {
            if(this.pagingMode == GridPagingMode.Remote){
                this.$emit("paging", {items: this._itemsPerPage, page: this._page, orderBy: this._sortByColumn, orderAscending: this._sortAscending});
            }
        },
        showMore() {
            this.$emit("showMore", {items: this._itemsPerPage, skip: this._modelValue.length});
        },
        // Selection
        itemClicked(ev: MouseEvent, idx: number) {
            if (this.selectionMode == GridSelectionMode.None) {
                return;
            }
            idx = this._itemsPerPage == Number.POSITIVE_INFINITY 
                ? idx
                : (this.page * this._itemsPerPage) + idx
            
            if (this.selectionMode == GridSelectionMode.One) {
                this.deselectAll();
                this.selectItem(this._modelValue[idx]);
                return;
            }
            if (!ev.ctrlKey) {
                this.deselectAll();
            }
            if (ev.shiftKey) {
                const l = Math.min(idx, this.lastItemClicked);
                const h = Math.max(idx, this.lastItemClicked);
                if (l != h)
                    ev.preventDefault();
                for (let i = l; i <= h; i++) {
                    this.selectItem(this._modelValue[i]);
                }
            }
            else {
                this.toggleItemSelection(this._modelValue[idx]);
                this.lastItemClicked = idx;
            }
        },
        toggleItemSelection(item: any) {
            const selIdx = this._selectedItems.indexOf(item);
            if (selIdx >= 0) {
                this.deselectItem(item, selIdx);
            }
            else {
                this.selectItem(item);
            }
        },
        selectItem(item: any) {
            const a = this._selectedItems.slice();
            a.push(item);
            this._selectedItems = a;
        },
        deselectItem(item: any, selIdx: number | null = null) {
            selIdx = selIdx == null ? this._selectedItems.indexOf(item) : selIdx;
            this._selectedItems = this._selectedItems.slice(0, selIdx).concat(this._selectedItems.slice(selIdx! + 1));
        },
        deselectAll() {
            this._selectedItems = [];
        },
        rowCommandsForItem(item:any): IGridRowCommandDefinition[]{
            const r = [] as IGridRowCommandDefinition[];
            for (const i in this.rowCommands) {
                const cmd = this.rowCommands[i];
                if (cmd.filter(item))
                r.push(cmd);
            }
            return r;
        },
        commandsForSelectedItems(items: any[]): IGridCommandDefinition[]{
            const r = [] as IGridCommandDefinition[];
            for (const i in this._gridCommands) {
                const cmd = this._gridCommands[i];
                if (cmd.filter(items))
                r.push(cmd);
            }
            return r;
        },
        export() {
            const data = [] as any[];
            for (const item of this._modelValue) {
                const row  = [] as any[];
                for (const col of this._columns) {
                    row.push(col.exportFn(col.valueFn(item)));
                }
                data.push(row);
            }
            return data;
        },
        exportCsv() {
            const data = this.export();
            let csv = "";
            const sep = 1.2.toFixed(1) == "1,2" ? ';' : ','; 
            function format(val: any) {
                return "\""+((val+"").replace("\"", "\"\""))+"\"";
            }
            let rowArr = [] as any[];
            for (const col of this._columns) {
                rowArr.push(format(col.title));
            }
            csv += rowArr.join(sep) + "\n";
            for (const row of data) {
                rowArr = [];
                for (const i in row) {
                    rowArr.push(format(row[i]));
                }
                csv += rowArr.join(sep) + "\n";
            }
            this.downloader.value!.download(csv, this.exportFilenameFn()+".csv");
        },
        print() {
            const styles = document.head.getElementsByTagName("style");
            const links = document.head.getElementsByTagName("link");
            let hTxt = "<style>.no-print{display: none !important;} thead{display: table-header-group !important;} tfoot{display: table-footer-group !important;}</style><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
            for (let i = 0; i < links.length; i++) {
                const l = links.item(i) as HTMLLinkElement;
                if(l.rel != "stylesheet") continue;
                hTxt += l.outerHTML;
            }
            for (let i = 0; i < styles.length; i++) {
                const s = styles.item(i) as HTMLStyleElement;
                hTxt += s.outerHTML;
            }
            
            let table = document.createElement("div");
            table.innerHTML = (this.$refs.container as HTMLElement).outerHTML;

            let tBody = "";
            for (const row of this._modelValue) {
                tBody += "<tr class=\"" + this.styleParser.toString(this.styleParser.getDataRowClasses(this.styling, false))+"\">";
                for (const col of this._columns) {
                    tBody += "<td class=\"" + col.cssClasses.join(" ") + "\" style=\"" + (col.style ?? "") + "\">" +  col.getHtml(row) + "</td>"
                }
                tBody += "</tr>"
            }
            
            table.getElementsByTagName("tbody")[0].innerHTML = tBody;

            this.printer.value!.print(`<html><head>${hTxt}</head><body>${table.outerHTML}</body></html>`);
        },
        getColumnStates(): {id: string, isHidden: boolean}[] {
            return this._columns.map(c=> ({id: c.id, isHidden: c.isOptional && c.isHidden}));
        },
        setColumnStates(val: {id: string, isHidden: boolean}[]){
            if(val == undefined) return;
            const newColumns = [] as any[];
            console.log("setColumnStates", val);
            for (const i of val) {
                const col = this._columns.filter(c => c.id == i.id)[0];
                col.isHidden = col.isOptional && i.isHidden;
                newColumns.push(col);
            }
            // those columns that are not received get placed at the end in original order
            for (const c of this._columns){
                if(val.findIndex(i => c.id == i.id) == -1) {
                    newColumns.push(c);
                }
            }
            this._columns = newColumns;
        },
    },
    computed: {
        _sortByColumn: {
            get(): string | undefined { return this.sortByColumnField; },
            set(v: string | undefined) { this.sortByColumnField = v; this.sort(); this.$emit("update:sortByColumn", v); }
        },
        _sortAscending: {
            get(): boolean { return this.sortAscendingField; },
            set(v: boolean) { this.sortAscendingField = v; this.sort(); this.$emit("update:sortAscending", v); }
        },
        _selectedItems: {
            get(): Array<any> { return this.selectedItemsField; },
            set(v: Array<any>) { this.selectedItemsField = v; this.$emit("update:selectedItems", v); }
        },
        _modelValue: {
            get(): Array<any> { return this.modelValueField; },
            set(v: Array<any>) {
                let d = false;
                if (v.length != this.modelValueField.length) {
                    d = true;
                }
                else {
                    for (let i = 0; i < v.length; i++)
                        if (v[i] != this.modelValueField[i]) {
                            d = true;
                            i = v.length;
                        }
                }
                if (d) {
                    this.modelValueField = v;
                    this.sort();
                    this.$emit("update:modelValue", v);

                    const newS = this.selectedItemsField.filter(s => v.indexOf(s) > -1);
                    if(this.selectedItemsField.length != newS.length)
                        this._selectedItems = newS;
                }
            }
        },
        _pagedModelValue() {
            if (this._itemsPerPage == Number.POSITIVE_INFINITY || this.pagingMode == GridPagingMode.Remote ) {
                return this._modelValue;
            }
            const s = this._page * this._itemsPerPage;
            return this._modelValue.slice(s, s + this._itemsPerPage);
        },
        _page: {
            get(): number { return this.pageField; },
            set(v: number) { this.pageField = v; this.remotePaging(); this.$emit("update:page", v); }
        },
        _itemsPerPage: {
            get(): number { return this.itemsPerPageField; },
            set(v: number) { this.itemsPerPageField = v; this.remotePaging(); this.$emit("update:itemsPerPage", v); }
        },
        _gridCommands(): IGridCommandDefinition[] {
                const r = this.gridCommands.slice();
                if(this.isExportEnabled) {
                    const csvCmd = 
                        new GridCommandDefinition(() => this.exportCsv())
                        .withIcon("fas fa-download")
                        .withLabel(this.exportText);
                    r.push(csvCmd);
                }
                if(this.isPrintEnabled) {
                    const printCmd = 
                        new GridCommandDefinition(() => this.print())
                        .withIcon("fas fa-print")
                        .withLabel(this.printText);
                    r.push(printCmd);
                }
                return r;
            
        },
        _columns: {
            get(): IGridColumnDefinition[] { return this.columnsField; },
            set(v: IGridColumnDefinition[]) { this.columnsField = v; this.$emit("update:columns", v); }  
        },
        _itemCount() {
            return this.itemCount ?? this.modelValue.length;
        },
        lastPage() {
            return Math.ceil(this._itemCount / this._itemsPerPage) - 1;
        },
        pageButtons(){
            const r = [] as number[];
            for (let i = Math.max(0, this._page-5); i <= Math.min(this._page + 5, this.lastPage); i++) {
                r.push(i);
            }
            return r;
        },
        displayedColumns(): {column: IGridColumnDefinition, idx: number}[] {
            return this._columns
            .map((c,i) => {return {column: c, idx: i};})
            .filter(c => !c.column.isOptional || !c.column.isHidden)
        },
        optionalColumns() {
            return this._columns.filter(c => c.isOptional);
        },
        columnCount() {
            let r = this.displayedColumns.length;
            return this.rowCommands.length > 0 
                    ? r + 1
                    : r;
        },
        columnsButton() {
            return this.$refs.columnsButton as HTMLButtonElement;
        }
    },
    emits: [
        "update:modelValue",
        "update:itemsPerPage",
        "update:page",
        "update:selectedItems",
        "update:sortAscending",
        "update:sortByColumn",
        "update:columns",
        "showMore",
        "paging"
    ],
    watch: {
        modelValue: {
            handler(newVal) { this._modelValue = newVal; },
            deep: true
        },
        columns: {
            handler(newVal) { this._columns = newVal; },
            deep: true
        },
        sortByColumn(newVal) {
            this._sortByColumn = newVal;
        },
        sortAscending(newVal) {
            this._sortAscending = newVal;
        },
        selectedItems(newVal) {
            this._selectedItems = newVal;
        },
        page(newVal) {
            this._page = newVal;
        },
        itemsPerPage(newVal) {
            this._itemsPerPage = newVal;
            this._page = 0;
        }
    },
    components: { CommandButton, RowCommandButton }
}
</script>
<style scoped>

@media print {
    .no-print {
        display: none;
    }
}

.column-customizer {
    position: relative;
    z-index: 10;
}

.column-customizer-menu {
    display: none;
    position: absolute;
    top: 100%;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, .3);
    border-radius: 10px;
    border: 1px solid #DDD;
    background: #FFF;
}
.column-customizer.is-active .column-customizer-menu {
    display:block;
}
.column-customizer.right .column-customizer-menu{
    right: 0;
}
.column-customizer.left .column-customizer-menu{
    left: 0;
}

.column-customizer-content {
    padding: 5px 0;
}
.column-customizer-item {
    padding: 3px 10px;
    z-index: 10;
}
.column-customizer-item:hover {
    background: #EEE;
}
.column-customizer-item.grabbed {
    z-index: 20;
    background-color: #FFF;
    box-shadow: 0 0.5em 1em -0.125em #0a0a0a1a, 0 0 0 1px #0a0a0a05;
    position: relative;
    opacity: .5;
}

.column-customizer-text {
    margin: 0 10px;
}

</style>
<template>
  <div>
    <p class="block">Paging can be achieved in three ways: either specify the maximum number of items per page or load the content as you go, or just display data from a server.</p>
      
    <div class="section">
      <p class="block">The simplest is client side paging. You load the data, set the <span class="is-family-monospace">itemsPerPage</span> property and you're done</p>
      <data-grid title="Paging with fixed dataset" :model-value="rows" v-model:columns="cols" 
        :items-per-page="20" 
        :is-items-per-page-editable="true"
        :is-sortable="true"
        paging-footer-text="page {0} of {1}" 
        items-footer-text="{0} items"/>
    </div>

    <div class="section">
      <p class="block">If you want to load data on demand but display everything loaded so far, just set the <span class="is-family-monospace">pagingMode</span> property to 
        <span class="is-family-monospace">ShowMore</span> and create a handler for the <span class="is-family-monospace">@showMore</span> event</p>
      <p class="block">Please not that sorting is disabled in this case</p>
      <data-grid title="Using dynamic dataset" :model-value="showMoreRows" v-model:columns="cols" 
        :is-sortable="true"
        :paging-mode="GridPagingMode.ShowMore" @showMore="showMoreFunc"/>
      <button class="button" @click.prevent="showMoreRows = []; showMoreFunc(null);">Reset</button>
    </div>

    <div class="section">
      <p class="block">Using server side paging requires you to set <span class="is-family-monospace">pagingMode</span> property to 
        <span class="is-family-monospace">Remote</span>, <span class="is-family-monospace">itemCount</span> property to the total item count and create a handler for the <span class="is-family-monospace">@paging</span> event</p>
      <p class="block">Please not that sorting is disabled in this case</p>
      <data-grid title="Using server side paging" :model-value="remoteRows" v-model:columns="remoteCols" 
        :paging-mode="GridPagingMode.Remote" 
        :items-per-page="20" 
        :item-count="remoteRowsCache.length"
        :is-items-per-page-editable="true"
        :is-sortable="true"
        paging-footer-text="page {0} of {1}"
        items-footer-text="{0} items"
        @paging="serverSidePaging" />
    </div>
  </div>
</template>

<script lang="ts">
import Generator, { type IName, type ITestData } from '../composables/dataSource';
import DataGrid, { GridPagingMode } from '../../../src/DataGrid.vue'
import { GridColumnDefinition } from '../../../src/GridColumnDefinition';
import type { PagingParams, ShowMoreParams } from '../../../src/event-params';

export default {
  components: { DataGrid },
    data() {
      const gen = new Generator();
        return {
            gen,
            rows: gen.getRandomData(100),
            cols: [
                new GridColumnDefinition("name", "Name", p => p.name)
                    .withFormat(n => `${n.first} ${n.middle ?? ''} ${n.last}`)
                    .withSortForValues((a,b) => this.sortNames(a, b)),
                new GridColumnDefinition("age", "Age", p => p.dateOfBirth)
                    .withFormat((d: Date) => new Date(Date.now() - d.valueOf()).getFullYear() - 1970 + " years" )
                    .withSortForValues((a,b) => this.sortAge(a,b)),
                new GridColumnDefinition("dbay", "Birthday", p => p.dateOfBirth)
                    .withFormat((d: Date) => d.getDate()+"/"+d.getMonth())
            ],
            remoteCols: [
                new GridColumnDefinition("name", "Name", p => p.name)
                    .withFormat(n => `${n.first} ${n.middle ?? ''} ${n.last}`)
                    .withRemoteSort(),
                new GridColumnDefinition("age", "Age", p => p.dateOfBirth)
                    .withFormat((d: Date) => new Date(Date.now() - d.valueOf()).getFullYear() - 1970 + " years" )
                    .withRemoteSort(),
                new GridColumnDefinition("dbay", "Birthday", p => p.dateOfBirth)
                    .withFormat((d: Date) => d.getDate()+"/"+d.getMonth())
            ],
            showMoreRows: gen.getRandomData(10),
            remoteRows: [] as ITestData[],
            remoteRowsCache: gen.getRandomData(100),
            GridPagingMode: GridPagingMode
        }
    },
    methods: {
      showMoreFunc(params: ShowMoreParams | null) {
        if(params != null) {
          console.log(`Show more button pressed. Items per page: ${params.items} Items already loaded: ${params.skip}`)
        }
        const newRows = this.gen.getRandomData(10);
        this.showMoreRows = this.showMoreRows.concat(newRows);
        console.log(this.showMoreRows.length);
      },
      serverSidePaging(params: PagingParams) {
        if(params != null) {
          console.log("Server side paging called.", params);
        }
        setTimeout(()=>{
          const start = params.page * params.items;
          if(params.orderBy == "name"){
            this.remoteRowsCache.sort((a, b) => params.orderAscending ? this.sortNames(a.name, b.name) : -this.sortNames(a.name, b.name));
          } else if (params.orderBy == "age") {
            this.remoteRowsCache.sort((a, b) => params.orderAscending ? this.sortAge(a.dateOfBirth, b.dateOfBirth) : -this.sortAge(a.dateOfBirth, b.dateOfBirth));
          }
          const r = this.remoteRowsCache.slice(start, start + params.items);
          this.remoteRows = r;
        }, 500);
      },
      sortNames(a: IName, b:IName) {
        const r = a.first.localeCompare(b.first);
        return r == 0 ? a.last.localeCompare(b.last) : r;
      },
      sortAge(a: Date, b:Date) {
        return b.valueOf()-a.valueOf();
      }
    },
    mounted() {
      this.serverSidePaging({items: 20, page: 0,orderBy: undefined, orderAscending: true});
    }
}
</script>

<template>
  <div>
    <p class="block">Paging can be achievedin two ways: either specify the maximum number of items per page or load the content as you go</p>
    <data-grid title="Paging with fixed dataset" :model-value="rows" v-model:columns="cols" 
    :items-per-page="20" 
    paging-footer-text="page {0} of {1}" 
    :is-items-per-page-editable="true"
    items-footer-text="{0} items"/>
    <data-grid title="Using dynamic dataset" :model-value="dynamicRows" v-model:columns="cols" :can-show-more="true" @showMore="showMoreFunc()"/>
    <button class="button" @click.prevent="dynamicRows = []; showMoreFunc();">Reset</button>
  </div>
</template>

<script lang="ts">
import Generator from '../composables/dataSource';
import DataGrid from '../../../src/DataGrid.vue'
import { GridColumnDefinition } from '../../../src/GridColumnDefinition';

export default {
  components: { DataGrid },
    data() {
      const gen = new Generator();
        return {
            gen,
            rows: gen.getRandomData(100),
            cols: [
                new GridColumnDefinition("name", "Name", p => p.name)
                    .withFormat(n => `${n.first} ${n.middle ?? ''} ${n.last}`),
                new GridColumnDefinition("age", "Age", p => p.dateOfBirth)
                    .withFormat((d: Date) => new Date(Date.now() - d.valueOf()).getFullYear() - 1970 + " years" ),
                new GridColumnDefinition("dbay", "Birthday", p => p.dateOfBirth)
                    .withFormat((d: Date) => d.getDate()+"/"+d.getMonth())
            ],
            dynamicRows: gen.getRandomData(10),
        }
    },
    methods: {
      showMoreFunc() {
        const newRows = this.gen.getRandomData(10);
        this.dynamicRows = this.dynamicRows.concat(newRows);
        console.log(this.dynamicRows.length);
      }

    }
}
</script>

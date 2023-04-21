<template>
  <div>
    <p class="block"></p>
    <data-grid :model-value="rows" :columns="cols" :is-export-enabled="true" :is-print-enabled="true"/>
  </div>
</template>

<script lang="ts">
import Generator from '../composables/dataSource';
import DataGrid from '../../../src/DataGrid.vue'
import { GridColumnDefinition } from '../../../src/GridColumnDefinition';

export default {
  components: { DataGrid },
    data() {
        return {
            rows: (new Generator()).getRandomData(20),
            cols: [
                new GridColumnDefinition("name", "Name", p => p.name)
                    .withFormat(n => `${n.first} ${n.middle ?? ''} ${n.last}`),
                new GridColumnDefinition("age", "Age", p => p.dateOfBirth)
                    .withFormat((d: Date) => new Date(Date.now() - d.valueOf()).getFullYear() - 1970 + " years" )
                    .withExportAsIs(),
                new GridColumnDefinition("sx", "Sex", p => p.sex)
                    .withFormat((d: "Male" | "Female") => `<span class="icon" style="color: #${d == "Male" ? "08F" : "C00"}"><i class="fas ${d == "Male" ? "fa-mars" : "fa-venus"}"></i></span>`)
                    .withHtml()
                    .withExportFn((d: "Male" | "Female") => d.substring(0, 1).toLocaleLowerCase()),
            ]
        }
    }
}
</script>

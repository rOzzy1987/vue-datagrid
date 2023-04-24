<template>
  <div>
    <p class="block">Just enable printing and xporting by setting <span class="is-family-monospace">isPrintEnabled</span> or <span class="is-family-monospace">isExportEnabled</span> property to <span class="is-family-monospace">true</span></p>
    <p class="block">Note that exporting will respect custom column orders, but will export all columns. Printing will respect the hidden states as well. Neither will show any UI controls such es paging or commands</p>
    <data-grid title="Printable & exportable data grid" :model-value="rows" :columns="cols" :is-export-enabled="true" :is-print-enabled="true" :items-per-page="20"/>
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
            rows: (new Generator()).getRandomData(200),
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

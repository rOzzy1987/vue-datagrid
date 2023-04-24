<template>
  <div>
    <p class="block">Selecting items in the grid can be enabled in single or mutiple modes.</p>
      
    <div class="section">
      <p class="block">For the single selection mode just set the <span class="is-family-monospace">selectionMode</span> property to <span class="is-family-monospace">One</span> and hook up a propery to <span class="is-family-monospace">selectedItems</span></p>
      <data-grid :model-value="rows" v-model:columns="cols" 
        :items-per-page="20" 
        :selection-mode="GridSelectionMode.One"
        v-model:selected-items="selectedItems"/>
        <p class="block">Selected item</p>
        <pre>{{ selectedItems.map(i => JSON.stringify(i)).join("\n") }}</pre>
    </div>

    <div class="section">
      <p class="block">You can use the multiselection mode by setting the <span class="is-family-monospace">selectionMode</span> property to <span class="is-family-monospace">Multi</span></p>
      <p class="block">This way Ctrl + click and Shift + click methods work as usual</p>
      <data-grid :model-value="rows" v-model:columns="cols" 
        :items-per-page="20" 
        :selection-mode="GridSelectionMode.Multi"
        v-model:selected-items="selectedMultiItems"/>
        <p class="block">Selected items</p>
        <pre>{{ selectedMultiItems.map(i => JSON.stringify(i)).join("\n") }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import Generator, { type ITestData } from '../composables/dataSource';
import DataGrid, { GridSelectionMode } from '../../../src/DataGrid.vue'
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
            GridSelectionMode: GridSelectionMode,
            selectedItems: [] as ITestData[],
            selectedMultiItems: [] as ITestData[],
        }
    },
}
</script>

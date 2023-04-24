<script lang="ts">
import CustomizableColumns from "./components/CustomizableColumns.vue";
import ExportPrint from "./components/ExportPrint.vue";
import GridWithPaging from "./components/GridWithPaging.vue";
import GridWithSort from "./components/GridWithSort.vue";
import SelectionModes from "./components/SelectionModes.vue";
import SimpleGrid from "./components/SimpleGrid.vue";
export default {
  components: { SimpleGrid, GridWithSort, CustomizableColumns, GridWithPaging, ExportPrint, SelectionModes },
  data() {
    return {
      tabNo: 0
    };
  }
};
</script>

<template>
  <div class="overall">
    <header class="section"><h1 class="title">Vue-DataGrid Examples</h1></header>
    <main class="section">
      <div class="tabs">
        <ul>
          <li :class="{ 'is-active': 0 == tabNo }" @click="tabNo = 0"><a>Bare minimum</a></li>
          <li :class="{ 'is-active': 1 == tabNo }" @click="tabNo = 1"><a>Sortable</a></li>
          <li :class="{ 'is-active': 2 == tabNo }" @click="tabNo = 2"><a>Customizable columns</a></li>
          <li :class="{ 'is-active': 3 == tabNo }" @click="tabNo = 3"><a>Paging</a></li>
          <li :class="{ 'is-active': 4 == tabNo }" @click="tabNo = 4"><a>Selection</a></li>
          <li :class="{ 'is-active': 5 == tabNo }" @click="tabNo = 5"><a>Export & Print</a></li>
        </ul>
      </div>

      <div class="box">
        <simple-grid v-if="tabNo == 0" />
        <grid-with-sort v-if="tabNo == 1" />
        <customizable-columns v-if="tabNo == 2" />
        <grid-with-paging v-if="tabNo == 3" />
        <selection-modes v-if="tabNo == 4" />
        <export-print v-if="tabNo == 5" />
      </div>
    </main>
  </div>
</template>

<style>
.is-family-monospace,
pre {
  background: rgba(0, 0, 0, 0.1);
  color: #a00;
}
.is-family-monospace {
  padding: 0 8px;
}
</style>

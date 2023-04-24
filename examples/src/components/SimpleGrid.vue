<template>
  <div class="content">
    <p class="block">This example shows how you can define columns for your datagrid. This is a minimal implementation of a grid on a page</p>
    <p class="block">The most important thing is defining the columns. Columns have at least 3 parameters set:</p>
    <ul class="list">
      <li>ID</li>
      <li>Label</li>
      <li>Value expression</li>
    </ul>
    <p class="block">
      Note that the value expression can return any type. You can later define a <i>format expression</i> for displaying that value using
      <span class="is-family-monospace">.withFormat()</span>
    </p>
    <p>In this example, the Age and Birthday columns are actually derived from the same data property of the data model: <span class="is-family-monospace">dateOfBirth</span></p>
    <data-grid :model-value="rows" :columns="cols" />
  </div>
</template>

<script lang="ts">
import Generator from "../composables/dataSource";
import DataGrid from "../../../src/DataGrid.vue";
import { GridColumnDefinition } from "../../../src/GridColumnDefinition";

export default {
  components: { DataGrid },
  data() {
    return {
      rows: new Generator().getRandomData(20),
      cols: [
        new GridColumnDefinition("name", "Name", (p) => p.name).withFormat((n) => `${n.first} ${n.middle ?? ""} ${n.last}`),
        new GridColumnDefinition("age", "Age", (p) => p.dateOfBirth).withFormat((d: Date) => new Date(Date.now() - d.valueOf()).getFullYear() - 1970 + " years"),
        new GridColumnDefinition("dbay", "Birthday", (p) => p.dateOfBirth).withFormat((d: Date) => d.getDate() + "/" + d.getMonth())
      ]
    };
  }
};
</script>

<template>
  <div>
    <p class="block">This example shows how you can define sorting. You'll need to define sorting for each of the columns. If you don't, then you won't be able to sort on that column.</p>
    <p class="block">You can define a sorting algorithm for a column that has access to the whole model object for the row using <span class="is-family-monospace">.withSort()</span><br/>
    Alternatively you can define sorting using just the column's value using <span class="is-family-monospace">.withSortForValues()</span></p>
    <data-grid :model-value="rows" :columns="cols" :is-sortable="true" sort-by-column="age"/>
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
                    .withFormat(n => `${n.first} ${n.middle ?? ''} ${n.last}`)
                    .withSortForValues((a,b) => {const r1 = a.first.localeCompare(b.first); return r1 == 0 ? a.last.localeCompare(b.last) : r1; }),
                new GridColumnDefinition("age", "Age", p => p.dateOfBirth)
                    .withFormat((d: Date) => new Date(Date.now() - d.valueOf()).getFullYear() - 1970 + " years" )
                    .withSortForValues((a: Date, b: Date) => b.valueOf() - a.valueOf() ),
                new GridColumnDefinition("dbay", "Birthday", p => p.dateOfBirth)
                    .withFormat((d: Date) => d.getDate()+"/"+d.getMonth())
                    // No sort for birthdays
            ]
        }
    }
}
</script>

<style>

</style>
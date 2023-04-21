<template>
  <div>
    <p class="block"></p>
    <data-grid :model-value="rows" v-model:columns="cols" :is-column-list-orderable="true" />
  </div>
</template>

<script lang="ts">
import Generator, { type IPet, type ITestData } from '../composables/dataSource';
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
                    .withFormat((d: Date) => new Date(Date.now() - d.valueOf()).getFullYear() - 1970 + " years" ),
                new GridColumnDefinition("dbay", "Birthday", p => p.dateOfBirth)
                    .withFormat((d: Date) => d.getDate()+"/"+d.getMonth()),
                new GridColumnDefinition("pr", "Profession", (p:ITestData) => p.profession)
                    .withOptional(),
                new GridColumnDefinition("sx", "Sex", (p:ITestData) => p.sex)
                    .withOptional().withHidden(),
                new GridColumnDefinition("pets", "Pets", (p:ITestData) => p.pets)
                    .withOptional().withHidden()
                    .withFormat((p: IPet[])=> p?.map(pet => `${pet.name}, ${pet.species} (${pet.year})`).join('<br>'))
                    .withHtml(),
            ]
        }
    }
}
</script>

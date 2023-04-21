<script lang="ts">
import GridWithSort from './components/GridWithSort.vue'
import SimpleGrid from './components/SimpleGrid.vue'
export default {
  components: { SimpleGrid, GridWithSort },
  data() {
    return {
      tabNo: 0
    }
  }
}
</script>

<template>
  <div class="overall">
    <header class="section"><h1 class="title">Vue-DataGrid Examples</h1></header>
    <main class="section">
      <div class="tabs">
        <ul>
          <li :class="{'is-active': 0 == tabNo}" @click="tabNo = 0"><a>Bare minimum</a></li>
          <li :class="{'is-active': 1 == tabNo}" @click="tabNo = 1"><a>Sortable</a></li>
          <!-- <li :class="{'is-active': 2 == tabNo}" @click="tabNo = 2"><a>Sortable</a></li> -->
        </ul>
      </div>

      <div class="box">
        <simple-grid v-if="tabNo == 0" />
        <grid-with-sort v-if="tabNo == 1" />
      </div>
    </main>
  </div>
</template>


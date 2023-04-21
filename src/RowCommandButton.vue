<template>
  <span :class="styleParser.getCommandClasses(styling, cmd)" :title="cmd.iconClass == '' ? '' : cmd.label">
    <i v-if="cmd.iconClass != ''" :class="cmd.iconClass"></i>
    {{ cmd.iconClass == '' ? cmd.label : "" }}
  </span>
</template>

<script lang="ts">
import { GridStyleParser } from './DataGrid.vue';
import { GridBaseCommandDefinition } from './GridCommandDefinition';
import { GridCommandStyleDefinition } from './style';
export default {
    data() {
        return {
            styleParser: GridStyleParser
        }
    },
    props: {
        cmd: {type: GridBaseCommandDefinition, required: true},
        styling: {type: GridCommandStyleDefinition, required: true}
    }
}
</script>
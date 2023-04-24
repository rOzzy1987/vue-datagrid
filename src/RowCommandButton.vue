<template>
  <span :class="styleParser.getCommandClasses(styling, cmdObj)" :title="cmdObj.iconClass == '' ? '' : cmdObj.label">
    <i v-if="cmdObj.iconClass != ''" :class="cmdObj.iconClass"></i>
    {{ cmdObj.iconClass == '' ? cmdObj.label : "" }}
  </span>
</template>

<script lang="ts">
import { ref } from 'vue';
import { GridStyleParser } from './DataGrid.vue';
import type { IGridBaseCommandDefinition } from './GridCommandDefinition';
import { GridCommandStyleDefinition, GridRowCommandStyleDefinition } from './style';
export default {
    data() {
        return {
            styleParser: GridStyleParser
        }
    },
    props: {
        cmd: {type: ref<IGridBaseCommandDefinition>, required: true},
        styling: {type: GridCommandStyleDefinition, default: new GridRowCommandStyleDefinition() }
    },
    computed: {
      cmdObj(): IGridBaseCommandDefinition { return this.cmd.value!; }
    }
}
</script>
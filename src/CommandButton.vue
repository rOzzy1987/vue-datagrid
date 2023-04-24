<template>
  <button :class="styleParser.getCommandClasses(styling, cmdObj, isActive)" :title="cmdObj.iconClass == '' || cmdObj.iconClass == undefined ? '' : cmdObj.label" :disabled="disabled">
    <i v-if="cmdObj.iconClass != '' && cmdObj.iconClass != undefined" :class="cmdObj.iconClass"></i>
    {{ cmdObj.iconClass == '' || cmdObj.iconClass == undefined ? cmdObj.label : "" }}
  </button>
</template>

<script lang="ts">
import { ref } from 'vue';
import { GridStyleParser } from './DataGrid.vue';
import type { IGridBaseCommandDefinition } from './GridCommandDefinition';
import { GridCommandStyleDefinition } from './style';
export default {
    data() {
        return {
            styleParser: GridStyleParser
        }
    },
    props: {
        cmd: { type: ref<IGridBaseCommandDefinition>, required: true },
        styling: {type: GridCommandStyleDefinition, default: GridCommandStyleDefinition},
        disabled: { type: Boolean, default: false },
        isActive: { type: Boolean, default: false }
    },
    computed: {
      cmdObj(): IGridBaseCommandDefinition { return this.cmd.value!; }
    }
}
</script>
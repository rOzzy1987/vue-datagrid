<template>
  <button :class="styleParser.getCommandClasses(styling, cmd, isActive)" :title="cmd.iconClass == '' ? '' : cmd.label" :disabled="disabled">
    <i v-if="cmd.iconClass != ''" :class="cmd.iconClass"></i>
    {{ cmd.iconClass == '' ? cmd.label : "" }}
  </button>
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
        cmd: { type: GridBaseCommandDefinition, required: true },
        styling: {type: GridCommandStyleDefinition, required: true},
        disabled: { type: Boolean, default: false },
        isActive: { type: Boolean, default: false }
    },
}
</script>
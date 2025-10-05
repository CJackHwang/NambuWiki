@@
<template>
  <div class="container">

  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

const prop = defineProps({
  messages: Array as PropType<Message[]>
})

export interface Message {
  text: string
  sender: string
  isSender: boolean
}
</script>

<style scoped>
.container {
  box-shadow: var(--elevation-3);
  background-color: var(--surface-container);
  border-radius: 12px;
}
</style>

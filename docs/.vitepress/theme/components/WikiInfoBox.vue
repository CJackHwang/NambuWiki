<template>
  <aside class="infobox" v-if="items && items.length">
    <h3 class="title">信息框</h3>
    <dl>
      <template v-for="(it, i) in items" :key="i">
        <dt>{{ it.label }}</dt>
        <dd v-html="it.value"></dd>
      </template>
    </dl>
  </aside>
  <!-- if no items, render nothing -->
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

interface InfoItem { label: string; value: string }

defineProps({
  items: { type: Array as PropType<InfoItem[]>, default: () => [] }
})
</script>

<style scoped>
.infobox {
  float: right;
  width: 280px;
  margin: 0 0 1rem 1rem;
  padding: 0.75rem;
  border: 1px solid var(--c-border);
  background: var(--c-bg-alt);
  border-radius: var(--shape-small);
}
.title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}
dl { margin: 0; }
dt { font-weight: 600; color: var(--vp-c-text-2); }
dd { margin: 0 0 0.4rem 0; }
</style>


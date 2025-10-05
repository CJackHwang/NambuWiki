<template>
  <div v-if="isSectionIndex && sections && sections.length" class="section-outline">
    <h2 class="outline-title">纲要</h2>

    <div class="outline">
      <template v-for="(g, gi) in sections" :key="gi">
        <!-- Group with items -->
        <div v-if="'items' in g" class="outline-group">
          <div class="group-title">{{ g.text }}</div>
          <ul class="items">
            <li v-for="(it, ii) in g.items" :key="ii">
              <a class="link" :href="it.link">{{ it.text }}</a>
            </li>
          </ul>
        </div>

        <!-- Standalone item -->
        <div v-else class="outline-item">
          <a class="link" :href="g.link">{{ g.text }}</a>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useData } from 'vitepress'

type SidebarItem = { text: string; link: string }
type SidebarGroup = { text: string; collapsed?: boolean; items: SidebarItem[] }

const route = useRoute()
const { theme } = useData()

// Detect section base for paths like "/history/" or "/memory/"
const sectionBase = computed(() => {
  const p = route.path
  if (!p || p === '/') return ''
  // Expect path "/foo/" for section index; ignore deeper paths
  const m = p.match(/^\/([^\/]+)\/$/)
  return m ? `/${m[1]}/` : ''
})

const isSectionIndex = computed(() => !!sectionBase.value)

// Resolve sidebar nodes for this section, excluding the self overview link
const sections = computed<(SidebarItem | SidebarGroup)[]>(() => {
  const base = sectionBase.value
  if (!base) return []
  const sb: any = theme.value?.sidebar
  const list: (SidebarItem | SidebarGroup)[] = Array.isArray(sb?.[base]) ? sb[base] : []
  // Drop the overview item if present
  return list.filter((node: any) => !(node && 'link' in node && node.link === base))
})
</script>

<style scoped>
.section-outline {
  margin-top: 0.75rem;
}

.outline-title {
  margin: 0.25rem 0 0.5rem 0;
  font-size: 1.05rem;
  color: var(--vp-c-text-1);
}

.outline {
  border-left: 3px solid var(--c-border);
  padding-left: 0.75rem;
}

.outline-group { margin: 0.5rem 0; }
.group-title {
  font-weight: 600;
  margin: 0.25rem 0;
  color: var(--vp-c-text-2);
}

.items { margin: 0.2rem 0 0.4rem 1rem; }
.items li { margin: 0.1rem 0; }

.outline-item { margin: 0.25rem 0 0.25rem 1rem; }

.link { text-decoration: none; }
.link:hover { text-decoration: underline; }
</style>

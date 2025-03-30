<template>
  <div class="audio-player" :class="{'use-margin-up':useMarginUp}">
    <audio ref="audio" @timeupdate="updateProgress"/>
    <IconButton :icon="isPlaying?'pause':'play'" @click="togglePlay"/>
    <div class="title-small label">{{ title }}</div>
    <Slider
        :max="duration"
        :step="0.1"
        v-model="currentTime"
        @value-changed="seekAudio"/>
    <div v-if="showIt" class="title-small label bar-out">{{ formatTime(currentTime) }} / {{
        formatTime(duration)
      }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import IconButton from "./IconButton.vue"
import Slider from "./Slider.vue"

const props = defineProps({
  src: String,
  title: {type: String, default: '页内播放'},
  useMarginUp: {type: Boolean, default: true}
})

const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const showIt = ref(false)

function togglePlay() {
  if (audio.value) {
    if (isPlaying.value) audio.value.pause()
    else audio.value.play()

    isPlaying.value = !isPlaying.value
  }
}

function updateProgress() {
  if (audio.value) {
    showIt.value = true
    currentTime.value = audio.value.currentTime
    duration.value = audio.value.duration
  }
}

function seekAudio(value: number) {
  if (audio.value) {
    audio.value.currentTime = value
  }
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

onMounted(() => watch(() => props.src, (newSrc) => {
  if (audio.value) {
    audio.value.src = newSrc || ''
    currentTime.value = 0
    duration.value = 0
    isPlaying.value = false
    showIt.value = false
  }
}, {immediate: true}))
</script>

<style scoped>
.bar-out {
  padding-right: 8px;
}

.audio-player {
  padding-right: 8px;
  display: flex;
  border-radius: 36px;
  background-color: var(--surface-container);
  gap: 4px;
  flex-direction: row;
  align-items: center;
  border: solid var(--outline-variant) 1px;
}

.use-margin-up {
  margin-top: 8px;
}

.label {
  color: var(--on-surface-variant);
}
</style>

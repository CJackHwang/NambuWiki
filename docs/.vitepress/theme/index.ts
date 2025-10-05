import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

import './custom.css'

// Reuse existing VuePress components in VitePress
import AudioPlayer from './components/AudioPlayer.vue'
import IconButton from './components/IconButton.vue'
import TextButton from './components/TextButton.vue'
import ChatView from './components/ChatView.vue'
import Slider from './components/Slider.vue'
import SectionOverview from './components/SectionOverview.vue'

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('AudioPlayer', AudioPlayer)
    app.component('IconButton', IconButton)
    app.component('TextButton', TextButton)
    app.component('ChatView', ChatView)
    app.component('Slider', Slider)
    // Expose overview block for use in Markdown or custom layouts
    app.component('SectionOverview', SectionOverview)
  }
}

export default theme

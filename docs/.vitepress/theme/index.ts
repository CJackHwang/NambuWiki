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
import WikiInfoBox from './components/WikiInfoBox.vue'

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
    app.component('WikiInfoBox', WikiInfoBox)
  },
  setup() {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((reg) => {
          // 当发现新 SW 时，立即跳过等待并尝试更新页面
          if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          reg.addEventListener('updatefound', () => {
            const sw = reg.installing;
            if (!sw) return;
            sw.addEventListener('statechange', () => {
              if (sw.state === 'installed' && navigator.serviceWorker.controller) {
                // 新版本安装完成，提示或直接刷新
                window.location.reload();
              }
            });
          });
        }).catch(() => {});
      });
    }
  }
}

export default theme

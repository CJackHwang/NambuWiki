<template>
  <div class="icon-button"
       :style="{minHeight : size + 'px' , minWidth : size + 'px'}"
       :class="[buttonStyle, {'disabled' : disabled}]"
       ref="button"
       tabindex="0">
    <div class="icon"
         :style="{height : iconSize + 'px' , width : iconSize + 'px','-webkit-mask-image': `url(/icons/icon_${icon}${(filledIcon?'_filled':'')}.svg)`}"/>
  </div>
</template>

<script lang="ts" setup>
/*const props =*/
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  filledIcon: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: 'ryo',
  },
  // 其他样式
  buttonStyle: {
    type: String,
    default: 'standard',
  },
  size: {
    type: Number,
    default: 40,
  },
  iconSize: {
    type: Number,
    default: 24,
  },
})

// TODO:这这
/*function handleClick() {
  if (!props.disabled) {
  }
}*/
</script>

<style scoped>
.icon-button {
  border-radius: 50%;
  display: flex;
  position: relative;

  justify-content: center;
  align-items: center;
  cursor: pointer;

  overflow: hidden;
}

.icon-button.disabled {
  cursor: not-allowed;
}

.icon-button::after {
  content: "";
  position: absolute;

  transition: all var(--motion-standard);

  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}

.icon-button:not(.disabled):hover::after {
  background-color: rgba(var(--state-layers-primary), var(--opacity-state-layers-008));
}

.icon-button:not(.disabled):active::after {
  background-color: rgba(var(--state-layers-primary), var(--opacity-state-layers-012));
  /*background-color: rgba(256,0,0,0.5);*/
}

.icon-button.filled:not(.disabled) {
  background-color: var(--primary);
}

.icon-button.filled.disabled::after {
  background-color: rgba(var(--state-layers-on-surface), var(--opacity-state-layers-012));
}

.icon {
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-position: center;
  mask-position: center;
}

.icon-button.disabled > .icon {
  opacity: 0.38;
}

.icon-button.standard > .icon {
  background-color: var(--on-surface-variant)
}

.icon-button:not(.disabled).filled > .icon {
  background-color: var(--on-primary)
}

.icon-button.filled.disabled > .icon {
  background-color: var(--on-surface)
}
</style>

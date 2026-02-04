<script setup>
import { computed, useTemplateRef } from 'vue';
import { useElementSize } from '@vueuse/core';
import { REPLY_EDITOR_MODES } from './constants';
import Icon from 'next/icon/Icon.vue';

const props = defineProps({
  mode: {
    type: String,
    default: REPLY_EDITOR_MODES.REPLY,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  iconOnly: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['toggleMode']);

const wootEditorReplyMode = useTemplateRef('wootEditorReplyMode');
const wootEditorPrivateMode = useTemplateRef('wootEditorPrivateMode');

const replyModeSize = useElementSize(wootEditorReplyMode);
const privateModeSize = useElementSize(wootEditorPrivateMode);

/**
 * Computed boolean indicating if the editor is in private note mode
 * When disabled, always show NOTE mode regardless of actual mode prop
 * @type {ComputedRef<boolean>}
 */
const isPrivate = computed(() => {
  return props.disabled || props.mode === REPLY_EDITOR_MODES.NOTE;
});

/**
 * Computes the width of the sliding background chip in pixels
 * Includes 16px of padding in the calculation
 * @type {ComputedRef<string>}
 */
const width = computed(() => {
  const widthToUse = isPrivate.value
    ? privateModeSize.width.value
    : replyModeSize.width.value;

  const widthWithPadding = widthToUse + 16;
  return `${widthWithPadding}px`;
});

/**
 * Computes the X translation value for the sliding background chip
 * Translates by the width of reply mode + padding when in private mode
 * @type {ComputedRef<string>}
 */
const translateValue = computed(() => {
  const xTranslate = isPrivate.value ? replyModeSize.width.value + 16 : 0;

  return `${xTranslate}px`;
});
</script>

<template>
  <button
    class="flex items-center w-auto p-1 transition-all border rounded-full bg-n-alpha-2 group relative duration-300 ease-in-out z-0 active:scale-[0.995] active:duration-75"
    :disabled="disabled"
    :class="[iconOnly ? 'h-7' : 'h-8', { 'cursor-not-allowed': disabled }]"
    @click="$emit('toggleMode')"
  >
    <div
      ref="wootEditorReplyMode"
      class="flex items-center gap-1 px-2 z-20 text-n-slate-11"
    >
      <Icon v-if="iconOnly" icon="i-lucide-message-circle" class="size-4" />
      <template v-else>{{ $t('CONVERSATION.REPLYBOX.REPLY') }}</template>
    </div>
    <div
      ref="wootEditorPrivateMode"
      class="flex items-center gap-1 px-2 z-20 text-n-slate-11"
    >
      <Icon v-if="iconOnly" icon="i-lucide-lock-keyhole" class="size-4" />
      <template v-else>{{ $t('CONVERSATION.REPLYBOX.PRIVATE_NOTE') }}</template>
    </div>
    <div
      class="absolute shadow-sm rounded-full w-[var(--chip-width)] ease-in-out translate-x-[var(--translate-x)] rtl:translate-x-[var(--rtl-translate-x)] bg-n-solid-1"
      :class="[
        iconOnly ? 'h-5' : 'h-6',
        { 'transition-all duration-300': !disabled },
      ]"
      :style="{
        '--chip-width': width,
        '--translate-x': translateValue,
        '--rtl-translate-x': `calc(-1 * var(--translate-x))`,
      }"
    />
  </button>
</template>

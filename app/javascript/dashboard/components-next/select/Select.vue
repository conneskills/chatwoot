<script setup>
import Icon from 'dashboard/components-next/icon/Icon.vue';

defineProps({
  options: {
    type: Array,
    required: true,
    validator: options =>
      options.every(
        opt => typeof opt === 'object' && 'value' in opt && 'label' in opt
      ),
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
});

const modelValue = defineModel({
  type: [String, Number, Boolean],
  default: '',
});
</script>

<template>
  <div class="w-fit relative">
    <select
      v-model="modelValue"
      :disabled="disabled"
      class="custom-select rounded-lg border-0 outline-1 outline -outline-offset-1 transition-all duration-200 bg-n-surface-1 !mb-0 py-2 px-3 pr-10 text-sm"
      :class="{
        'outline-n-weak hover:outline-n-slate-6 focus:outline-n-blue-9':
          !error && !disabled,
        'outline-n-red-9 focus:outline-n-red-9': error && !disabled,
        'outline-n-weak bg-n-slate-2 cursor-not-allowed opacity-60': disabled,
      }"
    >
      <option v-if="placeholder" value="" disabled>
        {{ placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    <div
      class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
    >
      <Icon
        icon="i-lucide-chevron-down"
        class="size-4 text-n-slate-11"
        :class="{ 'opacity-50': disabled }"
      />
    </div>
  </div>
</template>

<style scoped>
.custom-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: none;
}

.custom-select::-ms-expand {
  display: none;
}
</style>

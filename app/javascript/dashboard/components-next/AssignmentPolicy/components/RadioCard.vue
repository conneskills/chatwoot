<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['select']);

const handleChange = () => {
  if (!props.isActive) {
    emit('select', props.id);
  }
};
</script>

<template>
  <div
    class="cursor-pointer rounded-xl outline outline-1 p-4 transition-all duration-200 bg-n-solid-1 py-4 ltr:pl-4 rtl:pr-4 ltr:pr-6 rtl:pl-6"
    :class="[
      isActive ? 'outline-n-blue-9' : 'outline-n-weak hover:outline-n-strong',
    ]"
    @click="handleChange"
  >
    <!-- Content -->
    <div class="flex flex-col gap-2 items-start">
      <div class="flex items-center justify-between w-full gap-3">
        <h3 class="text-heading-3 text-n-slate-12">
          {{ label }}
        </h3>
        <input
          :id="`${id}`"
          :checked="isActive"
          :value="id"
          :name="id"
          type="radio"
          class="h-4 w-4 border-n-slate-6 text-n-brand focus:ring-n-brand focus:ring-offset-0 flex-shrink-0"
          @change="handleChange"
        />
      </div>
      <p class="text-body-main text-n-slate-11">
        {{ description }}
      </p>
      <slot />
    </div>
  </div>
</template>

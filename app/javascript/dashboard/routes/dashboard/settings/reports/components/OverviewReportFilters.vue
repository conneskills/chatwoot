<script setup>
import { ref, onMounted } from 'vue';
import { getUnixStartOfDay, getUnixEndOfDay } from 'helpers/DateHelper';
import subDays from 'date-fns/subDays';
import WootDatePicker from 'dashboard/components/ui/DatePicker/DatePicker.vue';
import ToggleSwitch from 'dashboard/components-next/switch/Switch.vue';

const emit = defineEmits(['filterChange']);

const customDateRange = ref([subDays(new Date(), 6), new Date()]);
const businessHoursSelected = ref(false);

const emitChange = () => {
  emit('filterChange', {
    from: getUnixStartOfDay(customDateRange.value[0]),
    to: getUnixEndOfDay(customDateRange.value[1]),
    businessHours: businessHoursSelected.value,
  });
};

const onDateRangeChange = value => {
  customDateRange.value = value;
  emitChange();
};

const onBusinessHoursToggle = () => {
  emitChange();
};

onMounted(() => {
  emitChange();
});
</script>

<template>
  <div class="flex flex-col justify-between gap-3 md:flex-row">
    <div class="flex flex-col flex-wrap items-start gap-2 md:flex-row">
      <WootDatePicker @date-range-changed="onDateRangeChange" />
    </div>
    <div class="flex items-center">
      <span class="mx-2 text-sm whitespace-nowrap">
        {{ $t('REPORT.BUSINESS_HOURS') }}
      </span>
      <span>
        <ToggleSwitch
          v-model="businessHoursSelected"
          @change="onBusinessHoursToggle"
        />
      </span>
    </div>
  </div>
</template>

<template>
  <div class="space-y-6">
    <!-- Single Select Input -->
    <div>
      <FormKit
        type="select"
        v-model="singleSelect"
        label="Select Input"
        placeholder="Select Option"
        :options="[
          { label: 'Marketing', value: 'marketing' },
          { label: 'Template', value: 'template' },
          { label: 'Development', value: 'development' }
        ]"
        :classes="{
          outer: 'mb-0',
          wrapper: 'mb-0',
          label: 'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400',
          input: 'h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800'
        }"
      />
    </div>

    <!-- Multiple Select Input -->
    <div>
      <MultipleSelect v-model="selectedItems" :options="optionss" class="w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MultipleSelect from './MultipleSelect.vue'

const optionss = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'graphs', label: 'Graphs' },
]

const selectedItems = ref<string[]>([])
const singleSelect = ref('')

// Keep these for backward compatibility if needed
const options = ref([
  { text: 'Option 1', selected: false },
  { text: 'Option 2', selected: false },
  { text: 'Option 3', selected: false },
  { text: 'Option 4', selected: false },
])
</script>

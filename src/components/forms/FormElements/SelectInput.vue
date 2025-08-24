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

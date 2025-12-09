<template>
  <div class="space-y-6">
    <!-- Normal Textarea -->
    <div>
      <FormKit
        type="textarea"
        v-model="normalDescription"
        label="Description"
        placeholder="Enter a description..."
        rows="6"
      />
    </div>

    <!-- Disabled Textarea -->
    <div>
      <FormKit
        type="textarea"
        v-model="disabledDescription"
        label="Description"
        placeholder="Enter a description..."
        rows="6"
        disabled
      />
    </div>

    <!-- Error State Textarea -->
    <div>
      <FormKit
        type="textarea"
        v-model="errorDescription"
        label="Description"
        placeholder="Enter a description..."
        rows="6"
        validation="required"
        :validation-messages="{
          required: 'Please enter a message in the textarea.',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const normalDescription = ref('')
const disabledDescription = ref('This textarea is disabled')
const errorDescription = ref('')
</script>

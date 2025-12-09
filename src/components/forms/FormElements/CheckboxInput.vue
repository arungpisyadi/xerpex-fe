<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center gap-8">
      <!-- Default Checkbox -->
      <div>
        <FormKit
          type="checkbox"
          v-model="checkboxOne"
          label="Default"
          :decorator-classes="{
            base: checkboxOne
              ? 'border-brand-500 bg-brand-500'
              : 'bg-transparent border-gray-300 dark:border-gray-700',
          }"
        >
          <template #decoratorIcon>
            <span :class="checkboxOne ? '' : 'opacity-0'">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                  stroke="white"
                  stroke-width="1.94437"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </template>
        </FormKit>
      </div>

      <!-- Checked Checkbox -->
      <div>
        <FormKit
          type="checkbox"
          v-model="checkboxTwo"
          label="Checked"
          :decorator-classes="{
            base: checkboxTwo
              ? 'border-brand-500 bg-brand-500'
              : 'bg-transparent border-gray-300 dark:border-gray-700',
          }"
        >
          <template #decoratorIcon>
            <span :class="checkboxTwo ? '' : 'opacity-0'">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                  stroke="white"
                  stroke-width="1.94437"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </template>
        </FormKit>
      </div>

      <!-- Disabled Checkbox -->
      <div>
        <FormKit
          type="checkbox"
          v-model="checkboxThree"
          label="Disabled"
          disabled
          :decorator-classes="{
            base: checkboxThree
              ? 'bg-transparent border-gray-200 dark:border-gray-800'
              : 'border-brand-500 bg-brand-500',
          }"
        >
          <template #decoratorIcon>
            <span :class="checkboxThree ? '' : 'opacity-0'">
              <svg
                class="stroke-gray-200 dark:stroke-gray-800"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                  stroke=""
                  stroke-width="2.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </template>
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const checkboxOne = ref(false)
const checkboxTwo = ref(true)
const checkboxThree = ref(true)
</script>

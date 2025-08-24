<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center gap-8">
      <!-- Default Checkbox -->
      <div>
        <FormKit
          type="checkbox"
          v-model="checkboxOne"
          label="Default"
          :classes="{
            outer: 'mb-0',
            wrapper: 'mb-0 flex items-center',
            label: 'text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400 ml-3',
            input: 'sr-only',
            decorator: 'mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] hover:border-brand-500 dark:hover:border-brand-500',
            decoratorIcon: 'w-3.5 h-3.5'
          }"
          :decorator-classes="{
            base: checkboxOne
              ? 'border-brand-500 bg-brand-500'
              : 'bg-transparent border-gray-300 dark:border-gray-700'
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
          :classes="{
            outer: 'mb-0',
            wrapper: 'mb-0 flex items-center',
            label: 'text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400 ml-3',
            input: 'sr-only',
            decorator: 'mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] hover:border-brand-500 dark:hover:border-brand-500',
            decoratorIcon: 'w-3.5 h-3.5'
          }"
          :decorator-classes="{
            base: checkboxTwo
              ? 'border-brand-500 bg-brand-500'
              : 'bg-transparent border-gray-300 dark:border-gray-700'
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
          :classes="{
            outer: 'mb-0',
            wrapper: 'mb-0 flex items-center',
            label: 'text-sm font-medium text-gray-300 cursor-pointer select-none dark:text-gray-700 ml-3',
            input: 'sr-only peer',
            decorator: 'mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px]',
            decoratorIcon: 'w-3.5 h-3.5'
          }"
          :decorator-classes="{
            base: checkboxThree
              ? 'bg-transparent border-gray-200 dark:border-gray-800'
              : 'border-brand-500 bg-brand-500'
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

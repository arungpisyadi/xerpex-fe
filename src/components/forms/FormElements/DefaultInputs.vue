<template>
  <div class="space-y-6">
    <!-- Text Input -->
    <div>
      <FormKit type="text" v-model="formData.input" label="Input" />
    </div>

    <!-- Input with Placeholder -->
    <div>
      <FormKit
        type="text"
        v-model="formData.inputWithPlaceholder"
        label="Input with Placeholder"
        placeholder="info@gmail.com"
      />
    </div>

    <!-- Select Input -->
    <div>
      <FormKit
        type="select"
        v-model="formData.selectInput"
        label="Select Input"
        placeholder="Select Option"
        :options="[
          { label: 'Marketing', value: 'marketing' },
          { label: 'Template', value: 'template' },
          { label: 'Development', value: 'development' },
        ]"
      />
    </div>

    <!-- Password Input -->
    <div>
      <FormKit
        type="password"
        v-model="formData.password"
        label="Password Input"
        placeholder="Enter your password"
      />
    </div>

    <!-- Date Picker Input -->
    <div>
      <FormKit
        type="date"
        v-model="formData.date"
        label="Date Picker Input"
        placeholder="Select date"
      >
        <template #suffix>
          <span
            class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400"
          >
            <svg
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.66659 1.5415C7.0808 1.5415 7.41658 1.87729 7.41658 2.2915V2.99984H12.5833V2.2915C12.5833 1.87729 12.919 1.5415 13.3333 1.5415C13.7475 1.5415 14.0833 1.87729 14.0833 2.2915V2.99984L15.4166 2.99984C16.5212 2.99984 17.4166 3.89527 17.4166 4.99984V7.49984V15.8332C17.4166 16.9377 16.5212 17.8332 15.4166 17.8332H4.58325C3.47868 17.8332 2.58325 16.9377 2.58325 15.8332V7.49984V4.99984C2.58325 3.89527 3.47868 2.99984 4.58325 2.99984L5.91659 2.99984V2.2915C5.91659 1.87729 6.25237 1.5415 6.66659 1.5415ZM6.66659 4.49984H4.58325C4.30711 4.49984 4.08325 4.7237 4.08325 4.99984V6.74984H15.9166V4.99984C15.9166 4.7237 15.6927 4.49984 15.4166 4.49984H13.3333H6.66659ZM15.9166 8.24984H4.08325V15.8332C4.08325 16.1093 4.30711 16.3332 4.58325 16.3332H15.4166C15.6927 16.3332 15.9166 16.1093 15.9166 15.8332V8.24984Z"
                fill=""
              />
            </svg>
          </span>
        </template>
      </FormKit>
    </div>

    <!-- Time Select Input -->
    <div>
      <FormKit
        type="time"
        v-model="formData.time"
        label="Time Select Input"
        placeholder="Select time"
      >
        <template #suffix>
          <span class="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 dark:text-gray-400">
            <svg
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.04175 9.99984C3.04175 6.15686 6.1571 3.0415 10.0001 3.0415C13.8431 3.0415 16.9584 6.15686 16.9584 9.99984C16.9584 13.8428 13.8431 16.9582 10.0001 16.9582C6.1571 16.9582 3.04175 13.8428 3.04175 9.99984ZM10.0001 1.5415C5.32867 1.5415 1.54175 5.32843 1.54175 9.99984C1.54175 14.6712 5.32867 18.4582 10.0001 18.4582C14.6715 18.4582 18.4584 14.6712 18.4584 9.99984C18.4584 5.32843 14.6715 1.5415 10.0001 1.5415ZM9.99998 10.7498C9.58577 10.7498 9.24998 10.4141 9.24998 9.99984V5.4165C9.24998 5.00229 9.58577 4.6665 9.99998 4.6665C10.4142 4.6665 10.75 5.00229 10.75 5.4165V9.24984H13.3334C13.7476 9.24984 14.0834 9.58562 14.0834 9.99984C14.0834 10.4141 13.7476 10.7498 13.3334 10.7498H10.0001H9.99998Z"
                fill=""
              />
            </svg>
          </span>
        </template>
      </FormKit>
    </div>

    <!-- Input with Payment -->
    <div>
      <FormKit
        type="text"
        v-model="formData.cardNumber"
        label="Input with Payment"
        placeholder="Card number"
      >
        <template #prefix>
          <span
            class="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="6.25" cy="10" r="5.625" fill="#E80B26" />
              <circle cx="13.75" cy="10" r="5.625" fill="#F59D31" />
              <path
                d="M10 14.1924C11.1508 13.1625 11.875 11.6657 11.875 9.99979C11.875 8.33383 11.1508 6.8371 10 5.80713C8.84918 6.8371 8.125 8.33383 8.125 9.99979C8.125 11.6657 8.84918 13.1625 10 14.1924Z"
                fill="#FC6020"
              />
            </svg>
          </span>
        </template>
      </FormKit>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const formData = reactive({
  input: '',
  inputWithPlaceholder: '',
  selectInput: '',
  password: '',
  date: '',
  time: '',
  cardNumber: '',
})
</script>

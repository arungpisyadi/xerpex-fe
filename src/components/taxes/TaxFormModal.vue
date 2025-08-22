<template>
  <div class="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-lg rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-black dark:text-white">
          {{ isEditing ? 'Edit Tax' : 'Add New Tax' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-primary">
          <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.16771 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632555 19.8731 0.964493 20 1.29619 20C1.62789 20 1.9596 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z" fill=""></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="mb-6">
        <div class="mb-4">
          <label class="mb-2.5 block text-black dark:text-white">
            Tax Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            v-model="form.name"
            class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            :class="{ 'border-red-500': errors.name }"
            placeholder="Enter tax name (e.g., VAT, Sales Tax)"
            required
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
        </div>

        <div class="mb-4">
          <label class="mb-2.5 block text-black dark:text-white">
            Percentage <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            v-model="form.percentage"
            class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            :class="{ 'border-red-500': errors.percentage }"
            placeholder="Enter tax percentage"
            step="0.01"
            min="0"
            max="100"
            required
          />
          <p v-if="errors.percentage" class="mt-1 text-sm text-red-500">{{ errors.percentage }}</p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter the tax rate as a percentage (e.g., 10 for 10%)</p>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button
            type="button"
            class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
            :disabled="loading || !form.name || form.percentage === null"
          >
            <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            {{ isEditing ? 'Update Tax' : 'Create Tax' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import taxService from '../../services/tax.service';
import type { Tax, CreateTaxRequest, UpdateTaxRequest } from '../../types/tax.types';

interface Props {
  tax: Tax | null;
  isEditing: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const loading = ref(false);
const errors = ref<Record<string, string>>({});

const form = reactive<CreateTaxRequest>({
  name: '',
  percentage: 0
});

// Watch for tax changes to populate form
watch(() => props.tax, (tax) => {
  if (tax && props.isEditing) {
    form.name = tax.name;
    form.percentage = tax.percentage;
  } else {
    // Reset form for new tax
    form.name = '';
    form.percentage = 0;
  }
  errors.value = {};
}, { immediate: true });

const validateForm = (): boolean => {
  errors.value = {};

  if (!form.name.trim()) {
    errors.value.name = 'Tax name is required';
  }

  if (form.percentage === null || form.percentage < 0) {
    errors.value.percentage = 'Percentage must be 0 or greater';
  } else if (form.percentage > 100) {
    errors.value.percentage = 'Percentage cannot exceed 100%';
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    loading.value = true;

    if (props.isEditing && props.tax) {
      const updateData: UpdateTaxRequest = { ...form };
      await taxService.updateTax(props.tax.id, updateData);
    } else {
      await taxService.createTax(form);
    }

    emit('saved');
  } catch (error: any) {
    console.error('Error saving tax:', error);

    // Handle validation errors from API
    if (error.response?.status === 422 && error.response.data?.detail) {
      const apiErrors = error.response.data.detail;
      if (Array.isArray(apiErrors)) {
        apiErrors.forEach((err: any) => {
          if (err.loc && err.loc.length > 1) {
            const field = err.loc[1];
            errors.value[field] = err.msg;
          }
        });
      }
    }
  } finally {
    loading.value = false;
  }
};
</script>

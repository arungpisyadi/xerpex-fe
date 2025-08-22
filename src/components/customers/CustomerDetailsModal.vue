<template>
  <div class="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
    <div class="w-full max-w-xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-8">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-black dark:text-white">
          Customer Details
        </h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-primary">
          <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.16771 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632555 19.8731 0.964493 20 1.29619 20C1.62789 20 1.9596 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z" fill=""></path>
          </svg>
        </button>
      </div>

      <div v-if="customer" class="mb-6">
        <div class="mb-4 grid grid-cols-2 gap-4">
          <div>
            <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p class="text-base font-medium text-black dark:text-white">{{ customer.name }}</p>
          </div>
          <div>
            <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Status</p>
            <span class="inline-flex rounded px-2.5 py-1 text-xs font-medium" :class="getStatusClass(customer.is_active)">
              {{ customer.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div>
            <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p class="text-base font-medium text-black dark:text-white">{{ customer.email || 'N/A' }}</p>
          </div>
          <div>
            <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Phone</p>
            <p class="text-base font-medium text-black dark:text-white">{{ customer.phone || 'N/A' }}</p>
          </div>
          <div>
            <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">City</p>
            <p class="text-base font-medium text-black dark:text-white">{{ customer.city || 'N/A' }}</p>
          </div>
          <div>
            <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Country</p>
            <p class="text-base font-medium text-black dark:text-white">{{ customer.country || 'N/A' }}</p>
          </div>
        </div>

        <div v-if="customer.address" class="mb-4">
          <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Address</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-800 rounded">
            {{ customer.address }}
          </p>
        </div>

        <div v-if="customer.billing_address" class="mb-4">
          <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Billing Address</p>
          <p class="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-100 dark:bg-gray-800 rounded">
            {{ customer.billing_address }}
          </p>
        </div>

        <div class="mb-4 grid grid-cols-2 gap-4">
          <div>
            <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Created</p>
            <p class="text-base font-medium text-black dark:text-white">{{ formatDate(customer.created_at) }}</p>
          </div>
          <div>
            <p class="mb-1 text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
            <p class="text-base font-medium text-black dark:text-white">{{ formatDate(customer.updated_at) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Customer } from '../../types/customer.types';

interface Props {
  customer: Customer | null;
}

defineProps<Props>();
defineEmits<{
  close: [];
}>();

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getStatusClass = (isActive: boolean) => {
  return isActive
    ? 'bg-success bg-opacity-10 text-success'
    : 'bg-gray-500 bg-opacity-10 text-gray-500';
};
</script>

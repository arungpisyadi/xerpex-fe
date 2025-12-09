<template>
  <div class="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
    <div
      class="w-full max-w-2xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-8"
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-black dark:text-white">
          {{ isEditing ? 'Edit Customer' : 'Add New Customer' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-primary">
          <svg
            class="fill-current"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.16771 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632555 19.8731 0.964493 20 1.29619 20C1.62789 20 1.9596 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z"
              fill=""
            ></path>
          </svg>
        </button>
      </div>

      <FormKit type="form" @submit="handleSubmit">
        <div class="mb-4 grid grid-cols-2 gap-4">
          <FormKit
            type="text"
            name="name"
            label="Name"
            v-model="form.name"
            validation="required"
            placeholder="Enter customer name"
          >
            <template #label="{ label }">
              {{ label }} <span class="text-red-500">*</span>
            </template>
          </FormKit>

          <FormKit
            type="email"
            name="email"
            label="Email"
            v-model="form.email"
            validation="email"
            placeholder="Enter email address"
          />
        </div>

        <div class="mb-4 grid grid-cols-2 gap-4">
          <FormKit
            type="tel"
            name="phone"
            label="Phone"
            v-model="form.phone"
            placeholder="Enter phone number"
          />

          <FormKit
            type="text"
            name="city"
            label="City"
            v-model="form.city"
            placeholder="Enter city"
          />
        </div>

        <div class="mb-4">
          <FormKit
            type="text"
            name="country"
            label="Country"
            v-model="form.country"
            placeholder="Enter country"
          />
        </div>

        <div class="mb-4">
          <FormKit
            type="textarea"
            name="address"
            label="Address"
            v-model="form.address"
            placeholder="Enter address"
            rows="3"
          />
        </div>

        <div class="mb-4">
          <FormKit
            type="textarea"
            name="billing_address"
            label="Billing Address"
            v-model="form.billing_address"
            placeholder="Enter billing address (leave empty to use same as address)"
            rows="3"
          />
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button
            type="button"
            class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <FormKit type="submit" :disabled="loading || !form.name">
            <span
              v-if="loading"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
            ></span>
            {{ isEditing ? 'Update Customer' : 'Create Customer' }}
          </FormKit>
        </div>
      </FormKit>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import customerService from '../../services/customer.service'
import type {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from '../../types/customer.types'

interface Props {
  customer: Customer | null
  isEditing: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const loading = ref(false)

const form = reactive<CreateCustomerRequest>({
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  billing_address: '',
})

// Watch for customer changes to populate form
watch(
  () => props.customer,
  (customer) => {
    if (customer && props.isEditing) {
      form.name = customer.name
      form.email = customer.email || ''
      form.phone = customer.phone || ''
      form.address = customer.address || ''
      form.city = customer.city || ''
      form.country = customer.country || ''
      form.billing_address = customer.billing_address || ''
    } else {
      // Reset form for new customer
      Object.assign(form, {
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        billing_address: '',
      })
    }
  },
  { immediate: true },
)

const handleSubmit = async (formData: any) => {
  try {
    loading.value = true

    // Use FormKit's form data instead of reactive form
    const submitData = {
      name: formData.name,
      email: formData.email || '',
      phone: formData.phone || '',
      address: formData.address || '',
      city: formData.city || '',
      country: formData.country || '',
      billing_address: formData.billing_address || '',
    }

    if (props.isEditing && props.customer) {
      const updateData: UpdateCustomerRequest = { ...submitData }
      await customerService.updateCustomer(props.customer.id, updateData)
    } else {
      await customerService.createCustomer(submitData)
    }

    emit('saved')
  } catch (error: any) {
    console.error('Error saving customer:', error)
    // FormKit will handle displaying validation errors
    throw error
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70">
    <div
      class="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-8"
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-black dark:text-white">
          {{ mode === 'edit' ? 'Edit Payment' : 'Record New Payment' }}
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

      <FormKit type="form" :actions="false" @submit="handleSubmit">
        <div class="mb-4">
          <FormKit
            type="select"
            name="invoice_id"
            label="Select Invoice"
            v-model="form.invoice_id"
            :options="invoiceOptions"
            placeholder="Select an invoice"
            validation="required"
            :disabled="mode === 'edit'"
          >
            <template #label="{ label }">
              {{ label }} <span class="text-red-500">*</span>
            </template>
            <template #suffixIcon>
              <ChevronDownIcon />
            </template>
          </FormKit>
        </div>

        <div class="mb-4 grid grid-cols-2 gap-4">
          <FormKit
            type="number"
            name="amount"
            label="Amount"
            :value="String(form.amount)"
            @input="form.amount = Number($event) || 0"
            placeholder="Enter payment amount"
            step="0.01"
            min="0"
            validation="required|min:0"
          >
          </FormKit>

          <FormKit
            type="select"
            name="payment_method"
            label="Payment Method"
            v-model="form.payment_method"
            :options="paymentMethodOptions"
            placeholder="Select method"
            validation="required"
          >
            <template #suffixIcon>
              <ChevronDownIcon />
            </template>
          </FormKit>
        </div>

        <div class="mb-4">
          <FormKit
            type="select"
            name="payment_type"
            label="Payment Type"
            v-model="form.payment_type"
            :options="paymentTypeOptions"
            placeholder="Select payment type"
            validation="required"
          >
            <template #suffixIcon>
              <ChevronDownIcon />
            </template>
          </FormKit>
        </div>

        <div class="mb-4 grid grid-cols-2 gap-4">
          <FormKit
            type="date"
            name="payment_date"
            label="Payment Date"
            v-model="form.payment_date"
            validation="required"
          >
            <template #suffixIcon>
              <div @click="triggerDatePicker($event)" class="cursor-pointer">
                <CalenderIcon />
              </div>
            </template>
          </FormKit>

          <FormKit
            type="select"
            name="status"
            label="Status"
            v-model="form.status"
            :options="statusOptions"
            placeholder="Select status"
            validation="required"
          >
            <template #suffixIcon>
              <ChevronDownIcon />
            </template>
          </FormKit>
        </div>

        <div class="mb-4">
          <FormKit
            type="text"
            name="reference_number"
            label="Reference Number"
            v-model="form.reference_number"
            placeholder="Enter reference number"
          />
        </div>

        <div class="mb-4">
          <FormKit
            type="textarea"
            name="notes"
            label="Notes"
            v-model="form.notes"
            placeholder="Enter payment notes"
            rows="3"
          />
        </div>

        <div class="flex justify-end gap-4">
          <FormKit type="button" @click="emit('close')"> Cancel </FormKit>
          <FormKit type="submit">
            {{ mode === 'edit' ? 'Update Payment' : 'Save Payment' }}
          </FormKit>
        </div>

        <!-- <div class="flex justify-end gap-4 mt-6">
          <button
            type="button"
            class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <FormKit type="submit" :disabled="loading || !canSubmit">
            <span
              v-if="loading"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
            ></span>
            {{ mode === 'edit' ? 'Update Payment' : 'Save Payment' }}
          </FormKit>
        </div> -->
      </FormKit>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import paymentService from '../../services/payment.service'
import { usePermissions } from '../../composables/usePermissions'
import { SystemModule, PermissionAction } from '../../types/permissions.types'
import CalenderIcon from '../../icons/CalenderIcon.vue'
import ChevronDownIcon from '../../icons/ChevronDownIcon.vue'
import type {
  Payment,
  CreatePaymentRequest,
  UpdatePaymentRequest,
} from '../../types/payment.types'
import type { Invoice } from '../../types/invoice.types'

interface Props {
  mode: 'create' | 'edit'
  payment: Payment | null
  availableInvoices?: Invoice[]
}

const props = withDefaults(defineProps<Props>(), {
  availableInvoices: () => [],
})

const emit = defineEmits<{
  close: []
  saved: []
}>()

const permissions = usePermissions()
const loading = ref(false)

// Form data
const form = reactive<{
  invoice_id: number
  amount: number
  payment_method: string
  payment_type: string
  payment_date: string
  status: string
  reference_number: string
  notes: string
}>({
  invoice_id: 0,
  amount: 0,
  payment_method: '',
  payment_type: '',
  payment_date: '',
  status: '',
  reference_number: '',
  notes: '',
})

// Utility functions
const formatPrice = (price: number | string) => {
  const numPrice = typeof price === 'number' ? price : parseFloat(price)
  return numPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

const capitalizeFirstLetter = (string: string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const triggerDatePicker = (event: Event) => {
  const target = event.target as HTMLElement | null
  if (!target) return
  const wrapper = target.closest('.formkit-outer')
  if (wrapper) {
    const input = wrapper.querySelector('input[type="date"]') as HTMLInputElement | null
    if (input) {
      input.focus()
      if (input.showPicker) {
        try {
          input.showPicker()
        } catch {
          input.click()
        }
      } else {
        input.click()
      }
    }
  }
}

// Form options
const invoiceOptions = computed(() => {
  return props.availableInvoices.map((invoice) => ({
    label: `${invoice.invoice_number} - IDR ${formatPrice(invoice.total)} (${capitalizeFirstLetter(invoice.status)})`,
    value: invoice.id,
  }))
})

const paymentMethodOptions = [
  { label: 'Cash', value: 'cash' },
  { label: 'Bank Transfer', value: 'bank_transfer' },
  { label: 'Credit Card', value: 'credit_card' },
  { label: 'Debit Card', value: 'debit_card' },
  { label: 'Digital Wallet', value: 'digital_wallet' },
  { label: 'Check', value: 'check' },
  { label: 'Other', value: 'other' },
]

const paymentTypeOptions = [
  { label: 'Down Payment', value: 'down-payment' },
  { label: 'Installment', value: 'installment' },
  { label: 'Paid Off', value: 'paid-off' },
]

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Partial', value: 'partial' },
  { label: 'Full', value: 'full' },
]

// Check if user has permission to edit
const canEdit = computed(() => {
  return permissions.canPerform(SystemModule.PAYMENTS, PermissionAction.UPDATE)
})

// Check if form can be submitted
const canSubmit = computed(() => {
  if (props.mode === 'edit' && !canEdit.value) {
    return false
  }
  return (
    form.invoice_id &&
    form.amount > 0 &&
    form.payment_method &&
    form.payment_type &&
    form.payment_date &&
    form.status
  )
})

// Watch for payment changes to populate form
watch(
  () => props.payment,
  (payment) => {
    if (payment && props.mode === 'edit') {
      form.invoice_id = payment.invoice_id
      form.amount = payment.amount
      form.payment_method = payment.payment_method
      form.payment_type = 'installment' as any // Default value since it's not in the Payment type
      form.payment_date = payment.payment_date.split('T')[0] // Format date for input
      form.status = payment.status
      form.reference_number = payment.reference_number || ''
      form.notes = payment.notes || ''
    } else {
      // Reset form for new payment
      Object.assign(form, {
        invoice_id: 0,
        amount: 0,
        payment_method: '',
        payment_type: '',
        payment_date: new Date().toISOString().split('T')[0],
        status: '',
        reference_number: '',
        notes: '',
      })
    }
  },
  { immediate: true },
)

// Handle form submission
const handleSubmit = async (formData: any) => {
  // Check permissions for edit mode
  if (props.mode === 'edit' && !canEdit.value) {
    console.error('You do not have permission to edit payments')
    alert('You do not have permission to edit payments. Only admin, manager, and finance roles can edit payments.')
    return
  }

  try {
    loading.value = true

    // Prepare submit data
    const submitData: CreatePaymentRequest = {
      invoice_id: Number(formData.invoice_id),
      amount: Number(formData.amount),
      payment_method: formData.payment_method,
      payment_type: formData.payment_type,
      payment_date: formData.payment_date,
      status: formData.status,
      reference_number: formData.reference_number || '',
      notes: formData.notes || '',
    }

    if (props.mode === 'edit' && props.payment) {
      // Update existing payment
      const updateData: UpdatePaymentRequest = { ...submitData }
      await paymentService.updatePayment(props.payment.id, updateData)
      console.log('Payment updated successfully')
    } else {
      // Create new payment
      await paymentService.createPayment(submitData)
      console.log('Payment created successfully')
    }

    emit('saved')
  } catch (error: any) {
    console.error('Error saving payment:', error)
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save payment'
    alert(`Error: ${errorMessage}`)
    throw error
  } finally {
    loading.value = false
  }
}

</script>

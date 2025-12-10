<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb page-title="Payments" />
    </div>

    <!-- Payment Form Modal -->
    <PaymentFormModal
      v-if="showFormModal"
      :mode="formMode"
      :payment="selectedPaymentForEdit"
      :available-invoices="availableInvoices"
      @close="closeFormModal"
      @saved="handlePaymentSaved"
    />

    <div
      class="bg-white px-2 pt-2 pb-0.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4 xl:pb-0"
    >
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">Payment Management</h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="relative">
            <input
              type="text"
              placeholder="Search payments..."
              v-model="searchQuery"
              class="w-full rounded-md border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <span class="absolute left-3 top-2.5 text-gray-500">
              <svg
                class="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.0467 11.22L12.6667 9.80667C12.3699 9.5245 11.9955 9.33754 11.5916 9.26983C11.1876 9.20211 10.7727 9.25673 10.4 9.42667L9.80001 8.82667C10.5071 7.88194 10.8299 6.70445 10.7037 5.53122C10.5775 4.358 10.0115 3.27615 9.11963 2.50347C8.22779 1.73078 7.07536 1.32464 5.89712 1.36679C4.71887 1.40894 3.59838 1.89621 2.76399 2.73061C1.92959 3.565 1.44232 4.68549 1.40017 5.86374C1.35802 7.04198 1.76416 8.19441 2.53685 9.08625C3.30953 9.97809 4.39138 10.5441 5.5646 10.6703C6.73783 10.7964 7.91533 10.4736 8.86005 9.76667L9.46001 10.3667C9.29007 10.7393 9.23546 11.1542 9.30317 11.5582C9.37089 11.9622 9.55785 12.3366 9.84001 12.6333L11.2533 14.0467C11.3983 14.1924 11.5712 14.3072 11.7622 14.3837C11.9532 14.4602 12.1579 14.4967 12.3633 14.4908C12.5688 14.485 12.7713 14.4368 12.9581 14.3494C13.1448 14.262 13.3112 14.1371 13.4483 13.9833C13.5946 13.8393 13.7094 13.6664 13.7859 13.4754C13.8624 13.2844 13.8989 13.0797 13.8931 12.8743C13.8873 12.6688 13.8391 12.4663 13.7517 12.2795C13.6643 12.0928 13.5394 11.9264 13.3857 11.7893L14.0467 11.22Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </div>
          <div>
            <select
              v-model="statusFilter"
              class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <select
              v-model="methodFilter"
              class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="">All Methods</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="digital_wallet">Digital Wallet</option>
              <option value="check">Check</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            v-if="canCreate"
            class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
            @click="createNewPayment"
          >
            <span class="mr-2">
              <svg
                class="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z"
                  fill="white"
                />
              </svg>
            </span>
            Record Payment
          </button>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto">
        <data-table
          :data="filteredPayments"
          :columns="columns"
          :loading="loading"
          :show-add-button="false"
          @view="viewPaymentDetails"
          @edit="openEditModal"
          @delete="deletePayment"
          :show-edit-button="canUpdate"
          :show-delete-button="canDelete"
        />
      </div>
    </div>

    <!-- Payment Details Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70"
    >
      <div
        class="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div
          class="sticky top-0 z-10 flex items-center justify-between border-b border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark"
        >
          <h3 class="text-xl font-semibold text-black dark:text-white">Payment Details</h3>
          <button @click="showModal = false" class="text-gray-500 hover:text-primary">
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

        <div v-if="selectedPayment" class="p-6">
          <!-- Payment Overview Card (merged with Payment Details) -->
          <div
            class="mb-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <h3 class="mb-4 text-xl font-semibold text-black dark:text-white">Payment Overview</h3>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="mb-3">
                <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">Payment ID</p>
                <p class="text-base font-medium text-black dark:text-white">
                  #{{ selectedPayment.id }}
                </p>
              </div>
              <div class="mb-3">
                <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">Status</p>
                <span
                  class="inline-flex rounded px-2.5 py-1 text-xs font-medium"
                  :class="getStatusClass(selectedPayment.status)"
                >
                  {{ capitalizeFirstLetter(selectedPayment.status) }}
                </span>
              </div>
              <div class="mb-3">
                <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">Amount</p>
                <p class="text-xl font-bold text-black dark:text-white">
                  IDR {{ formatPrice(selectedPayment.amount) }}
                </p>
              </div>
              <div class="mb-3">
                <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">Payment Date</p>
                <p class="text-base font-medium text-black dark:text-white">
                  {{ formatDate(selectedPayment.payment_date) }}
                </p>
              </div>
              <div class="mb-3">
                <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                <p class="text-base font-medium text-black dark:text-white">
                  {{ formatPaymentMethod(selectedPayment.payment_method) }}
                </p>
              </div>
              <div class="mb-3">
                <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">Reference Number</p>
                <p class="text-base font-medium text-black dark:text-white">
                  {{ selectedPayment.reference_number || 'N/A' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Customer Details Card -->
          <div
            class="mb-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <h3 class="mb-4 text-xl font-semibold text-black dark:text-white">Customer Details</h3>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="mb-3">
                <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">Customer Name</p>
                <p class="text-base font-medium text-black dark:text-white">
                  {{ selectedPayment.customer?.name || 'N/A' }}
                </p>
              </div>
              <div class="mb-3">
                <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">Customer Phone</p>
                <p class="text-base font-medium text-black dark:text-white">
                  {{ selectedPayment.customer?.phone || 'N/A' }}
                </p>
              </div>
              <div class="mb-3">
                <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">Customer Email</p>
                <a
                  v-if="selectedPayment.customer?.email"
                  :href="`mailto:${selectedPayment.customer.email}`"
                  class="text-base font-medium text-primary hover:underline"
                >
                  {{ selectedPayment.customer.email }}
                </a>
                <p v-else class="text-base font-medium text-black dark:text-white">N/A</p>
              </div>
              <div class="mb-3">
                <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">Customer Address</p>
                <p class="text-base font-medium text-black dark:text-white">
                  {{ selectedPayment.customer?.address || 'N/A' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Invoice Details Card -->
          <div
            class="mb-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <h3 class="mb-4 text-xl font-semibold text-black dark:text-white">Invoice Details</h3>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="mb-3">
                <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">Invoice Number</p>
                <router-link
                  :to="`/invoices/${selectedPayment.invoice_id}`"
                  class="text-base font-medium text-primary hover:underline"
                >
                  {{ selectedPayment.invoice?.invoice_number || `#${selectedPayment.invoice_id}` }}
                </router-link>
              </div>
              <div class="mb-3">
                <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">Invoice Total</p>
                <p class="text-base font-medium text-black dark:text-white">
                  IDR {{ formatPrice(selectedPayment.invoice?.total || 0) }}
                </p>
              </div>
              <div class="mb-3">
                <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">Invoice Status</p>
                <span
                  v-if="selectedPayment.invoice?.status"
                  class="inline-flex rounded px-2.5 py-1 text-xs font-medium"
                  :class="getStatusClass(selectedPayment.invoice.status)"
                >
                  {{ capitalizeFirstLetter(selectedPayment.invoice.status) }}
                </span>
                <p v-else class="text-base font-medium text-black dark:text-white">N/A</p>
              </div>
              <div class="mb-3">
                <p class="mb-1 text-sm text-gray-600 dark:text-gray-400">Invoice Due Date</p>
                <p class="text-base font-medium text-black dark:text-white">
                  {{ selectedPayment.invoice?.due_date ? formatDate(selectedPayment.invoice.due_date) : 'N/A' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Notes Card (conditional) -->
          <div
            v-if="selectedPayment.notes"
            class="mb-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <h3 class="mb-4 text-xl font-semibold text-black dark:text-white">Notes</h3>
            <p class="text-base text-gray-600 dark:text-gray-400">
              {{ selectedPayment.notes }}
            </p>
          </div>

          <!-- Actions Section -->
          <div class="flex flex-wrap justify-end gap-4">
            <button
              v-if="selectedPayment.status === 'pending'"
              class="inline-flex items-center justify-center gap-2 rounded-md bg-success px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
              @click="confirmPaymentAction(selectedPayment)"
            >
              Confirm Payment
            </button>
            <button
              v-if="selectedPayment.status === 'pending'"
              class="inline-flex items-center justify-center gap-2 rounded-md bg-danger px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
              @click="failPaymentAction(selectedPayment)"
            >
              Mark as Failed
            </button>
            <button
              v-if="selectedPayment.status === 'completed'"
              class="inline-flex items-center justify-center gap-2 rounded-md bg-warning px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
              @click="refundPaymentAction(selectedPayment)"
            >
              Refund Payment
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Payment Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70"
    >
      <div
        class="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-7.5"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-black dark:text-white">Record New Payment</h3>
          <button @click="showCreateModal = false" class="text-gray-500 hover:text-primary">
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

        <FormKit type="form" :actions="false" @submit="submitPayment">
          <div class="mb-4">
            <FormKit
              type="select"
              name="invoice_id"
              label="Select Invoice"
              v-model="paymentForm.invoice_id"
              :options="
                availableInvoices.map((invoice) => ({
                  label: `${invoice.invoice_number} - IDR ${formatPrice(invoice.total)} (${capitalizeFirstLetter(invoice.status)})`,
                  value: invoice.id,
                }))
              "
              placeholder="Select an invoice"
              validation="required"
            >
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
              v-model="paymentForm.amount"
              placeholder="Enter payment amount"
              step="0.01"
              min="0"
              validation="required|min:0"
            />

            <FormKit
              type="select"
              name="payment_method"
              label="Payment Method"
              v-model="paymentForm.payment_method"
              :options="[
                { label: 'Cash', value: 'cash' },
                { label: 'Bank Transfer', value: 'bank_transfer' },
                { label: 'Credit Card', value: 'credit_card' },
                { label: 'Debit Card', value: 'debit_card' },
                { label: 'Digital Wallet', value: 'digital_wallet' },
                { label: 'Check', value: 'check' },
                { label: 'Other', value: 'other' },
              ]"
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
              v-model="paymentForm.payment_type"
              :options="[
                { label: 'Down Payment', value: 'down-payment' },
                { label: 'Installment', value: 'installment' },
                { label: 'Paid Off', value: 'paid-off' },
              ]"
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
              v-model="paymentForm.payment_date"
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
              v-model="paymentForm.status"
              :options="[
                { label: 'Pending', value: 'pending' },
                { label: 'Completed', value: 'completed' },
                { label: 'Failed', value: 'failed' },
                { label: 'Refunded', value: 'refunded' },
                { label: 'Partial', value: 'partial' },
                { label: 'Full', value: 'full' },
              ]"
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
              v-model="paymentForm.reference_number"
              placeholder="Enter reference number"
            />
          </div>

          <div class="mb-4">
            <FormKit
              type="textarea"
              name="notes"
              label="Notes"
              v-model="paymentForm.notes"
              placeholder="Enter payment notes"
            />
          </div>

          <div class="flex justify-end gap-4">
            <FormKit type="button" @click="showCreateModal = false"> Cancel </FormKit>
            <FormKit type="submit">Save Payment</FormKit>
          </div>
        </FormKit>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70"
    >
      <div
        class="w-full max-w-md rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-danger">Confirm Delete Payment</h3>
          <button @click="cancelDelete" class="text-gray-500 hover:text-primary">
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

        <div v-if="selectedPaymentToDelete" class="mb-6">
          <div class="flex items-center justify-center mb-4">
            <div class="rounded-full bg-danger bg-opacity-10 p-4">
              <svg
                class="fill-danger"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 11V17M14 11V17M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>

          <p class="text-center text-base text-black dark:text-white mb-4">
            Are you sure you want to delete this payment?
          </p>

          <div class="bg-gray-50 dark:bg-meta-4 rounded-md p-4 mb-4">
            <div class="mb-2">
              <p class="text-sm text-gray-600 dark:text-gray-400">Payment ID</p>
              <p class="text-base font-medium text-black dark:text-white">#{{ selectedPaymentToDelete.id }}</p>
            </div>
            <div class="mb-2">
              <p class="text-sm text-gray-600 dark:text-gray-400">Amount</p>
              <p class="text-base font-semibold text-black dark:text-white">
                IDR {{ formatPrice(selectedPaymentToDelete.amount) }}
              </p>
            </div>
            <div class="mb-2">
              <p class="text-sm text-gray-600 dark:text-gray-400">Reference Number</p>
              <p class="text-base font-medium text-black dark:text-white">
                {{ selectedPaymentToDelete.reference_number || 'N/A' }}
              </p>
            </div>
            <div class="mb-2">
              <p class="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
              <p class="text-base font-medium text-black dark:text-white">
                {{ formatPaymentMethod(selectedPaymentToDelete.payment_method) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <span
                class="inline-flex rounded px-2.5 py-1 text-xs font-medium"
                :class="getStatusClass(selectedPaymentToDelete.status)"
              >
                {{ capitalizeFirstLetter(selectedPaymentToDelete.status) }}
              </span>
            </div>
          </div>

          <div class="bg-red-50 border border-red-200 rounded-md p-3 mb-4 dark:bg-red-900/20 dark:border-red-800">
            <p class="text-sm text-red-600 dark:text-red-400">
              <strong>Warning:</strong> This action cannot be undone. The payment record will be permanently deleted from the system.
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <button
            type="button"
            class="flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            @click="cancelDelete"
          >
            Cancel
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-opacity-90"
            @click="confirmDelete"
          >
            <svg
              class="fill-current"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 11V17M14 11V17M4 7H20M19 7L18.133 19.142C18.0971 19.6466 17.8713 20.1188 17.5011 20.4636C17.1309 20.8083 16.6439 21 16.138 21H7.862C7.35614 21 6.86907 20.8083 6.49889 20.4636C6.1287 20.1188 5.90292 19.6466 5.867 19.142L5 7H19ZM15 7V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H10C9.73478 3 9.48043 3.10536 9.29289 3.29289C9.10536 3.48043 9 3.73478 9 4V7H15Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Delete Payment
          </button>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script lang="ts">
import AdminLayout from '../components/layout/AdminLayout.vue'
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue'
import DataTable from '../components/common/DataTable.vue'
import PaymentFormModal from '../components/payments/PaymentFormModal.vue'
import CalenderIcon from '../icons/CalenderIcon.vue'
import ChevronDownIcon from '../icons/ChevronDownIcon.vue'
import { useInvoicing } from '../composables/useInvoicing'
import paymentService from '../services/payment.service'
import authService from '../services/auth.service'
import { handleError } from '../utils/errorHandler'
import { usePermissions } from '../composables/usePermissions'
import { SystemModule, PermissionAction } from '../types/permissions.types'
import type { Payment } from '../types/payment.types'
import type { Invoice } from '../types/invoice.types'

export default {
  name: 'PaymentsView',
  components: {
    AdminLayout,
    PageBreadcrumb,
    DataTable,
    PaymentFormModal,
    CalenderIcon,
    ChevronDownIcon,
  },
  setup() {
    const {
      payments,
      invoices,
      loading,
      error,
      pendingPayments,
      fetchPayments,
      fetchInvoices,
      createPayment,
      confirmPayment,
    } = useInvoicing()

    const permissions = usePermissions()

    return {
      payments,
      invoices,
      loading,
      error,
      pendingPayments,
      fetchPayments,
      fetchInvoices,
      createPayment,
      confirmPayment,
      authService,
      handleError,
      permissions,
    }
  },
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      methodFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      showModal: false,
      showCreateModal: false,
      showFormModal: false,
      showDeleteModal: false,
      formMode: 'create' as 'create' | 'edit',
      selectedPayment: null as Payment | null,
      selectedPaymentForEdit: null as Payment | null,
      selectedPaymentToDelete: null as Payment | null,
      availableInvoices: [] as Invoice[],
      paymentForm: {
        invoice_id: 0 as number,
        amount: '',
        payment_method: '',
        payment_type: '',
        payment_date: '',
        status: '',
        reference_number: '',
        notes: '',
      },
      columns: [
        { key: 'invoice.invoice_number', label: 'INVOICE #', span: 1 },
        { key: 'amount', label: 'Amount', span: 1, type: 'currency' },
        { key: 'payment_method', label: 'Method', span: 1 },
        { key: 'payment_type', label: 'Type', span: 1 },
        { key: 'status', label: 'Status', span: 1, type: 'status' },
        { key: 'payment_date', label: 'Date', span: 1, type: 'date' },
        { key: 'reference_number', label: 'Reference', span: 2 },
      ],
    }
  },
  computed: {
    canCreate() {
      return this.permissions.canPerform(SystemModule.PAYMENTS, PermissionAction.CREATE)
    },
    canUpdate() {
      return this.permissions.canPerform(SystemModule.PAYMENTS, PermissionAction.UPDATE)
    },
    canDelete() {
      return this.permissions.canPerform(SystemModule.PAYMENTS, PermissionAction.DELETE)
    },
    filteredPayments() {
      // Ensure payments is an array before filtering
      if (!this.payments || !Array.isArray(this.payments)) {
        return []
      }

      let filtered = [...this.payments]

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (payment) =>
            payment.invoice_id?.toString().includes(query) ||
            payment.reference_number?.toLowerCase().includes(query) ||
            payment.amount?.toString().includes(query),
        )
      }

      // Apply status filter
      if (this.statusFilter) {
        filtered = filtered.filter((payment) => payment.status === this.statusFilter)
      }

      // Apply method filter
      if (this.methodFilter) {
        filtered = filtered.filter((payment) => payment.payment_method === this.methodFilter)
      }

      return filtered
    },

    // Show user context for admin/finance users
    showUserContext() {
      return this.authService.canAccessAllData()
    },
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        await Promise.all([
          this.fetchPayments({
            skip: (this.currentPage - 1) * this.itemsPerPage,
            limit: this.itemsPerPage,
          }),
          this.fetchInvoices({ status: 'sent,partially_paid,overdue' }), // Get invoices that can receive payments
        ])
        this.totalItems = this.payments?.length || 0
        this.availableInvoices =
          this.invoices && Array.isArray(this.invoices)
            ? this.invoices.filter(
                (invoice) =>
                  invoice.status === 'sent' ||
                  invoice.status === 'partially_paid' ||
                  invoice.status === 'overdue',
              )
            : []
      } catch (error) {
        this.handleError(error, 'loadData')
      }
    },

    async handlePageChange(page: number) {
      this.currentPage = page
      await this.loadData()
    },

    viewPaymentDetails(payment: Payment) {
      this.selectedPayment = payment
      this.showModal = true
    },

    createNewPayment() {
      if (!this.canCreate) {
        console.error('You do not have permission to create payments')
        return
      }

      this.formMode = 'create'
      this.selectedPaymentForEdit = null
      this.showFormModal = true
    },

    openEditModal(payment: Payment) {
      if (!this.canUpdate) {
        console.error('You do not have permission to edit payments')
        return
      }

      this.formMode = 'edit'
      this.selectedPaymentForEdit = payment
      this.showFormModal = true
    },

    closeFormModal() {
      this.showFormModal = false
      this.selectedPaymentForEdit = null
    },

    async handlePaymentSaved() {
      this.showFormModal = false
      this.selectedPaymentForEdit = null
      await this.loadData()
      console.log('Payment saved successfully')
    },

    async submitPayment() {
      try {
        await this.createPayment(this.paymentForm)
        this.showCreateModal = false
        await this.loadData()
        console.log('Payment recorded successfully')
      } catch (error) {
        this.handleError(error, 'submitPayment')
      }
    },

    async confirmPaymentAction(payment: Payment) {
      try {
        await this.confirmPayment(payment.id)

        // Update local data
        if (this.selectedPayment && this.selectedPayment.id === payment.id) {
          this.selectedPayment.status = 'completed'
        }

        await this.loadData()
        console.log('Payment confirmed successfully')
      } catch (error) {
        this.handleError(error, 'confirmPaymentAction')
      }
    },

    async failPaymentAction(payment: Payment) {
      try {
        await paymentService.failPayment(payment.id)

        // Update local data
        if (this.selectedPayment && this.selectedPayment.id === payment.id) {
          this.selectedPayment.status = 'failed'
        }

        await this.loadData()
        console.log('Payment marked as failed')
      } catch (error) {
        this.handleError(error, 'failPaymentAction')
      }
    },


    deletePayment(payment: Payment) {
      if (!this.canDelete) {
        console.error('You do not have permission to delete payments')
        alert('You do not have permission to delete payments. Only admin users can delete payments.')
        return
      }

      // Show confirmation modal
      this.selectedPaymentToDelete = payment
      this.showDeleteModal = true
    },

    async confirmDelete() {
      if (!this.selectedPaymentToDelete) {
        return
      }

      try {
        const payment = this.selectedPaymentToDelete
        await paymentService.deletePayment(payment.id)

        // Close modal
        this.showDeleteModal = false
        this.selectedPaymentToDelete = null

        // Refresh data
        await this.loadData()

        // Show success notification
        alert(`Payment #${payment.id} (${payment.reference_number || 'N/A'}) has been deleted successfully.`)
        console.log('Payment deleted successfully:', payment.id)
      } catch (error: any) {
        console.error('Error deleting payment:', error)
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete payment'
        alert(`Error: ${errorMessage}`)
        this.handleError(error, 'confirmDelete')
      }
    },

    cancelDelete() {
      this.showDeleteModal = false
      this.selectedPaymentToDelete = null
    },

    async refundPaymentAction(payment: Payment) {
      try {
        await paymentService.refundPayment(payment.id, {
          reason: 'Customer requested refund',
          refund_date: new Date().toISOString().split('T')[0],
        })

        // Update local data
        if (this.selectedPayment && this.selectedPayment.id === payment.id) {
          this.selectedPayment.status = 'refunded'
        }

        await this.loadData()
        console.log('Payment refunded successfully')
      } catch (error) {
        this.handleError(error, 'refundPaymentAction')
      }
    },

    formatDate(dateString: string) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    },

    formatPrice(price: number | string) {
      const numPrice = typeof price === 'number' ? price : parseFloat(price)
      return numPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    },

    capitalizeFirstLetter(string: string) {
      if (!string) return ''
      return string.charAt(0).toUpperCase() + string.slice(1)
    },

    formatPaymentMethod(method: string) {
      const methods: Record<string, string> = {
        cash: 'Cash',
        bank_transfer: 'Bank Transfer',
        credit_card: 'Credit Card',
        debit_card: 'Debit Card',
        digital_wallet: 'Digital Wallet',
        check: 'Check',
        other: 'Other',
      }
      return methods[method] || method
    },

    getStatusClass(status: string) {
      switch (status) {
        case 'pending':
          return 'bg-warning bg-opacity-10 text-warning'
        case 'completed':
          return 'bg-success bg-opacity-10 text-success'
        case 'failed':
          return 'bg-red-500 bg-opacity-10 text-danger'
        case 'refunded':
          return 'bg-gray-500 bg-opacity-10 text-white'
        default:
          return 'bg-gray-500 bg-opacity-10 text-white'
      }
    },

    triggerDatePicker(event: Event) {
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
    },
  },
}
</script>

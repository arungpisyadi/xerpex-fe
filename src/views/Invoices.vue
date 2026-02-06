<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb page-title="Invoices" />
    </div>

    <div
      class="bg-white px-2 pt-2 pb-0.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4 xl:pb-0"
    >
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">Invoices Management</h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="relative">
            <input
              type="text"
              placeholder="Search invoices..."
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
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="full">Full</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <select
              v-model="dateFilter"
              class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button
            v-if="canCreate"
            class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
            @click="navigateToCreateInvoice"
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
            Create Invoice
          </button>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto">
        <data-table
          :data="filteredInvoices"
          :columns="columns"
          :loading="loading"
          :show-add-button="false"
          @view="viewInvoiceDetails"
          @edit="handleEditEvent"
          @delete="deleteInvoice"
          :show-edit-button="canUpdate"
          :show-delete-button="canDelete"
        />
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70"
    >
      <div
        class="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default sm:p-7.5"
      >
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">Confirm Delete</h4>
          <button @click="showDeleteModal = false" class="text-gray-500 hover:text-gray-700">
            <svg
              class="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z"
                fill=""
              ></path>
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <p class="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete invoice <strong>{{ selectedInvoiceNumber }}</strong
            >? This action cannot be undone.
          </p>
        </div>

        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="showDeleteModal = false"
            class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="confirmDelete"
            :disabled="loading"
            class="flex justify-center rounded bg-red-500 py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {{ loading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../components/layout/AdminLayout.vue'
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue'
import DataTable from '../components/common/DataTable.vue'
import invoiceService from '../services/invoice.service.ts'
import authService from '../services/auth.service'
import { useInvoicing } from '../composables/useInvoicing.ts'
import { handleError } from '../utils/errorHandler'
import { usePermissions } from '../composables/usePermissions'
import { SystemModule, PermissionAction } from '../types/permissions.types'

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
    DataTable,
  },
  setup() {
    const router = useRouter()
    const {
      invoices,
      loading,
      error,
      overdueInvoices,
      fetchInvoices,
      sendInvoice,
      markInvoiceAsPaid,
    } = useInvoicing()

    const permissions = usePermissions()

    // Reactive data
    const searchQuery = ref('')
    const statusFilter = ref('')
    const dateFilter = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(100)
    const totalItems = ref(0)
    const showDeleteModal = ref(false)
    const selectedInvoiceId = ref(null)
    const selectedInvoiceNumber = ref('')

    const columns = ref([
      { key: 'invoice_number', label: 'Invoice #', span: 1 },
      { key: 'customer_name', label: 'Customer', span: 2 },
      { key: 'sales_person', label: 'Sales', span: 1 },
      { key: 'total', label: 'Amount', span: 1, type: 'currency' },
      { key: 'status', label: 'Status', span: 1, type: 'status' },
      { key: 'issue_date', label: 'Issue Date', span: 1, type: 'date' },
      { key: 'check_in', label: 'Check In Date', span: 1, type: 'date' },
    ])

    // Computed properties
    const filteredInvoices = computed(() => {
      // Ensure invoices is an array before filtering
      if (!invoices.value || !Array.isArray(invoices.value)) {
        return []
      }

      let filtered = [...invoices.value]

      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(
          (invoice) =>
            invoice.invoice_number?.toLowerCase().includes(query) ||
            invoice.customer_name?.toLowerCase().includes(query) ||
            invoice.sales_person?.toLowerCase().includes(query) ||
            invoice.total?.toString().includes(query),
        )
      }

      // Apply status filter
      if (statusFilter.value) {
        filtered = filtered.filter((invoice) => invoice.status === statusFilter.value)
      }

      // Apply date filter
      if (dateFilter.value) {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfYear = new Date(now.getFullYear(), 0, 1)

        filtered = filtered.filter((invoice) => {
          const checkInDate = new Date(invoice.check_in)

          switch (dateFilter.value) {
            case 'today':
              return checkInDate >= today && checkInDate < new Date(today.getTime() + 86400000)
            case 'week':
              return checkInDate >= startOfWeek
            case 'month':
              return checkInDate >= startOfMonth
            case 'year':
              return checkInDate >= startOfYear
            default:
              return true
          }
        })
      }

      return filtered
    })

    const showUserContext = computed(() => {
      return authService.canAccessAllData()
    })

    const canCreate = computed(() => {
      return permissions.canPerform(SystemModule.INVOICES, PermissionAction.CREATE)
    })

    const canUpdate = computed(() => {
      return permissions.canPerform(SystemModule.INVOICES, PermissionAction.UPDATE)
    })

    const canDelete = computed(() => {
      return permissions.canPerform(SystemModule.INVOICES, PermissionAction.DELETE)
    })

    // Methods
    const loadData = async () => {
      try {
        await fetchInvoices({
          skip: (currentPage.value - 1) * itemsPerPage.value
        })

        // Pre-process data to flatten nested customer names
        if (invoices.value && Array.isArray(invoices.value)) {
          invoices.value = invoices.value.map((item) => ({
            ...item,
          }))
        }

        // console.log('Invoices loaded:', invoices.value);
        totalItems.value = invoices.value?.length || 0
      } catch (err) {
        handleError(err, 'loadData')
      }
    }

    const handlePageChange = async (page) => {
      currentPage.value = page
      await loadData()
    }

    const viewInvoiceDetails = (invoice) => {
      router.push(`/invoices/${invoice.id}`)
    }

    const navigateToCreateInvoice = () => {
      if (!canCreate.value) {
        alert('You do not have permission to create invoices')
        return
      }
      router.push('/invoices/create')
    }

    const markAsPaid = async (invoice) => {
      try {
        await markInvoiceAsPaid(invoice.id, {
          payment_date: new Date().toISOString().split('T')[0],
        })

        await loadData()
        console.log('Invoice marked as paid successfully')
      } catch (err) {
        handleError(err, 'markAsPaid')
      }
    }

    const sendInvoiceEmail = async (invoice) => {
      try {
        await sendInvoice(invoice.id, {
          recipient_email: invoice.customer_email,
          subject: `Invoice ${invoice.invoice_number}`,
          message: 'Please find your invoice attached.',
        })

        console.log('Invoice sent successfully')
      } catch (err) {
        handleError(err, 'sendInvoiceEmail')
      }
    }

    const handleEditEvent = (invoice) => {
      console.log('handleEditEvent called with invoice:', invoice)
      console.log('canUpdate permission:', canUpdate.value)

      if (!canUpdate.value) {
        console.log('Edit permission denied, showing notification')
        alert('You do not have permission to edit invoices')
        return
      }

      console.log('Calling editInvoice function')
      editInvoice(invoice)
    }

    const editInvoice = (invoice) => {
      if (!canUpdate.value) {
        alert('You do not have permission to edit invoices')
        return
      }
      router.push(`/invoices/edit/${invoice.id}`)
    }

    const confirmDeleteInvoice = (invoice) => {
      if (!canDelete.value) {
        alert('You do not have permission to delete invoices')
        return
      }
      selectedInvoiceId.value = invoice.id
      selectedInvoiceNumber.value = invoice.invoice_number
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      if (!canDelete.value) {
        alert('You do not have permission to delete invoices')
        return
      }

      try {
        loading.value = true
        await invoiceService.deleteInvoice(selectedInvoiceId.value)
        showDeleteModal.value = false
        await loadData()
        alert(`Invoice ${selectedInvoiceNumber.value} deleted successfully`)
      } catch (err) {
        console.error('Error deleting invoice:', err)
        const errorMessage =
          err.response?.data?.detail || err.detail || 'Failed to delete invoice'
        alert(errorMessage)
      } finally {
        loading.value = false
      }
    }

    const deleteInvoice = (invoice) => {
      if (!canDelete.value) {
        alert('You do not have permission to delete invoices')
        return
      }
      confirmDeleteInvoice(invoice)
    }

    const downloadInvoice = async (invoice) => {
      try {
        await invoiceService.downloadInvoice(invoice.id, `invoice-${invoice.invoice_number}.pdf`)
        console.log('Invoice downloaded successfully')
      } catch (err) {
        handleError(err, 'downloadInvoice')
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    const formatPrice = (price) => {
      return parseFloat(price)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }

    const capitalizeFirstLetter = (string) => {
      if (!string) return ''
      return string.charAt(0).toUpperCase() + string.slice(1)
    }

    const getStatusClass = (status) => {
      switch (status) {
        case 'paid':
          return 'bg-success bg-opacity-10 text-success'
        case 'pending':
          return 'bg-warning bg-opacity-10 text-warning'
        case 'overdue':
          return 'bg-red-500 bg-opacity-10 text-danger'
        case 'cancelled':
          return 'bg-gray-500 bg-opacity-10 text-gray-500'
        default:
          return 'bg-gray-500 bg-opacity-10 text-gray-500'
      }
    }



    // Lifecycle
    onMounted(async () => {
      await loadData()
    })

    return {
      // Reactive data
      searchQuery,
      statusFilter,
      dateFilter,
      currentPage,
      itemsPerPage,
      totalItems,
      columns,

      // From composable
      invoices,
      loading,
      error,
      overdueInvoices,

      // Computed
      filteredInvoices,
      showUserContext,
      canCreate,
      canUpdate,
      canDelete,

      // Methods
      loadData,
      handlePageChange,
      viewInvoiceDetails,
      navigateToCreateInvoice,
      markAsPaid,
      sendInvoiceEmail,
      handleEditEvent,
      editInvoice,
      deleteInvoice,
      confirmDeleteInvoice,
      confirmDelete,
      downloadInvoice,
      formatDate,
      formatPrice,
      capitalizeFirstLetter,
      getStatusClass,

      // Modal state
      showDeleteModal,
      selectedInvoiceId,
      selectedInvoiceNumber,
    }
  },
}
</script>

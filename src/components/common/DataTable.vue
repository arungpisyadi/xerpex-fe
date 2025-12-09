<template>
  <div
    class="rounded-sm bg-white px-2 pt-2 pb-0.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4 xl:pb-0"
  >
    <!-- Table Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h4 class="text-xl font-semibold text-black dark:text-white">
        {{ title }}
      </h4>

      <!-- Add Button -->
      <div v-if="showAddButton" class="flex items-center gap-3">
        <button
          @click="$emit('add')"
          class="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
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
                fill=""
              ></path>
            </svg>
          </span>
          Add New
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="flex flex-col">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <!-- Table Header -->
          <thead v-if="columns && columns.length > 0" class="bg-gray-2 dark:bg-meta-4">
            <tr>
              <th
                v-for="(column, index) in columns"
                :key="index"
                :class="[
                  'p-2.5 xl:p-5 font-medium uppercase',
                  column.align === 'center'
                    ? 'text-center'
                    : column.align === 'right'
                      ? 'text-right'
                      : 'text-left',
                ]"
                style="font-size: 0.7rem"
              >
                {{ column.label }}
              </th>
              <th
                v-if="showActions"
                class="p-2.5 xl:p-5 text-center font-medium uppercase"
                style="font-size: 0.7rem"
              >
                Actions
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody>
            <!-- Loading State -->
            <tr v-if="loading">
              <td
                :colspan="(columns?.length || 0) + (showActions ? 1 : 0)"
                class="text-center py-10"
              >
                <div class="flex justify-center items-center">
                  <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="!filteredData.length">
              <td
                :colspan="(columns?.length || 0) + (showActions ? 1 : 0)"
                class="text-center py-10"
              >
                <div class="text-center">
                  <p class="text-lg font-medium text-gray-600 dark:text-gray-400">No data found</p>
                  <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
              v-else
              v-for="(item, rowIndex) in paginatedData"
              :key="rowIndex"
              class="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td
                v-for="(column, colIndex) in columns || []"
                :key="colIndex"
                :class="[
                  'p-2.5 xl:p-5',
                  column.align === 'center'
                    ? 'text-center'
                    : column.align === 'right'
                      ? 'text-right'
                      : 'text-left',
                ]"
              >
                <!-- Default cell renderer -->
                <template v-if="column.type === 'status'">
                  <span
                    :class="[
                      'inline-flex rounded-full bg-opacity-10 py-1 px-3 font-medium',
                      getStatusClass(item[column.key]),
                    ]"
                    style="font-size: 0.7rem"
                  >
                    {{ formatStatus(item[column.key]) }}
                  </span>
                </template>
                <template v-else-if="column.type === 'date'">
                  <span style="font-size: 0.7rem">{{ formatDate(item[column.key]) }}</span>
                </template>
                <template v-else-if="column.type === 'currency'">
                  <span style="font-size: 0.7rem">{{ formatCurrency(item[column.key]) }}</span>
                </template>
                <template v-else>
                  <span style="font-size: 0.7rem">{{ item[column.key] }}</span>
                </template>
              </td>

              <!-- Actions Column -->
              <td v-if="showActions" class="p-2.5 xl:p-5 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <!-- View Button -->
                  <button
                    v-if="showViewButton"
                    @click="$emit('view', item)"
                    class="hover:text-primary transition-colors"
                    title="View"
                  >
                    <svg class="fill-current" width="14" height="14" viewBox="0 0 18 18">
                      <path
                        d="M9 3.75C4.5 3.75 1.5 9 1.5 9C1.5 9 4.5 14.25 9 14.25C13.5 14.25 16.5 9 16.5 9C16.5 9 13.5 3.75 9 3.75ZM9 12.75C7.76 12.75 6.75 11.74 6.75 10.5C6.75 9.26 7.76 8.25 9 8.25C10.24 8.25 11.25 9.26 11.25 10.5C11.25 11.74 10.24 12.75 9 12.75Z"
                      ></path>
                    </svg>
                  </button>

                  <!-- WhatsApp Button -->
                  <a
                    v-if="showWhatsAppButton"
                    class="text-gray-500 hover:text-green-600 transition-colors"
                    title="Send WhatsApp Message"
                    target="_blank"
                    :href="getWhatsAppUrl(item)"
                  >
                    <WhatsAppIcon width="14" height="14" />
                  </a>

                  <!-- Edit Button -->
                  <button
                    v-if="showEditButton"
                    @click="handleEdit(item)"
                    class="hover:text-primary transition-colors"
                    title="Edit"
                    :data-customer-id="item.id"
                  >
                    <svg
                      class="fill-current"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 20H21"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16.5 3.5C16.8978 3.10218 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04016C19.0692 3.14676 19.303 3.30301 19.5 3.5C19.697 3.69699 19.8532 3.9308 19.9598 4.18819C20.0665 4.44558 20.1213 4.72142 20.1213 5C20.1213 5.27858 20.0665 5.55442 19.9598 5.81181C19.8532 6.0692 19.697 6.30301 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>

                  <!-- Delete Button -->
                  <button
                    v-if="showDeleteButton"
                    @click="$emit('delete', item)"
                    class="hover:text-danger transition-colors"
                    title="Delete"
                  >
                    <svg class="fill-current" width="14" height="14" viewBox="0 0 18 18">
                      <path
                        d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502Z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="showPagination && totalPages > 1"
      class="flex flex-wrap items-center justify-between gap-4 mt-6 mb-4"
    >
      <div class="flex items-center gap-2">
        <p class="text-gray-600 dark:text-gray-400" style="font-size: 0.7rem">
          Showing {{ startIndex + 1 }}-{{ Math.min(endIndex, filteredData.length) }} of
          {{ filteredData.length }} entries
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="goToPage(1)"
          :disabled="currentPage === 1"
          class="flex h-9 w-9 items-center justify-center rounded-md border border-stroke"
        >
          <svg class="fill-current" width="8" height="10" viewBox="0 0 8 10">
            <path
              d="M7.33366 1.66683L3.00033 6.0335L7.33366 9.66683L6.00033 9.66683L1.66699 6.0335L6.00033 1.66683L7.33366 1.66683Z"
            />
          </svg>
        </button>

        <button
          v-for="page in displayedPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'flex h-9 min-w-[36px] items-center justify-center rounded-md border px-2',
            currentPage === page ? 'border-primary bg-green-500 text-white' : 'border-stroke',
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="goToPage(totalPages)"
          :disabled="currentPage === totalPages"
          class="flex h-9 w-9 items-center justify-center rounded-md border border-stroke"
        >
          <svg class="fill-current" width="8" height="10" viewBox="0 0 8 10">
            <path
              d="M0.666341 1.66683L4.99967 6.0335L0.666341 9.66683L1.99967 9.66683L6.33301 6.0335L1.99967 1.66683L0.666341 1.66683Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import WhatsAppIcon from '../../icons/WhatsAppIcon.vue'

export default {
  name: 'DataTable',
  components: {
    WhatsAppIcon,
  },
  props: {
    title: {
      type: String,
      default: 'Data Table',
    },
    data: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showActions: {
      type: Boolean,
      default: true,
    },
    showViewButton: {
      type: Boolean,
      default: true,
    },
    showEditButton: {
      type: Boolean,
      default: true,
    },
    showDeleteButton: {
      type: Boolean,
      default: true,
    },
    showWhatsAppButton: {
      type: Boolean,
      default: false,
    },
    waPhoneNumber: {
      type: String,
      default: '',
    },
    showAddButton: {
      type: Boolean,
      default: true,
    },
    showPagination: {
      type: Boolean,
      default: true,
    },
    itemsPerPage: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      currentPage: 1,
      isFilterOpen: false,
    }
  },
  mounted() {
    // console.log('DataTable mounted with props:', {
    //   showWhatsAppButton: this.showWhatsAppButton,
    //   waPhoneNumber: this.waPhoneNumber,
    //   dataLength: this.data?.length || 0
    // });
  },
  computed: {
    filteredData() {
      if (!this.data || !Array.isArray(this.data)) {
        return []
      }
      return this.data
    },
    totalPages() {
      const dataLength = this.filteredData?.length || 0
      return Math.ceil(dataLength / this.itemsPerPage)
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage
    },
    endIndex() {
      return this.startIndex + this.itemsPerPage
    },
    paginatedData() {
      return this.filteredData.slice(this.startIndex, this.endIndex)
    },
    displayedPages() {
      const pages = []
      const maxVisiblePages = 5

      if (this.totalPages <= maxVisiblePages) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i)
        }
      } else {
        const leftSide = Math.floor(maxVisiblePages / 2)
        const rightSide = maxVisiblePages - leftSide - 1

        if (this.currentPage > leftSide && this.currentPage < this.totalPages - rightSide) {
          pages.push(1)
          pages.push('...')

          for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
            pages.push(i)
          }

          pages.push('...')
          pages.push(this.totalPages)
        } else if (this.currentPage <= leftSide) {
          for (let i = 1; i <= maxVisiblePages - 1; i++) {
            pages.push(i)
          }

          pages.push('...')
          pages.push(this.totalPages)
        } else {
          pages.push(1)
          pages.push('...')

          for (let i = this.totalPages - maxVisiblePages + 2; i <= this.totalPages; i++) {
            pages.push(i)
          }
        }
      }

      return pages
    },
  },
  methods: {
    goToPage(page) {
      if (typeof page === 'number') {
        this.currentPage = page
      }
    },
    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString()
    },
    formatCurrency(value) {
      if (value === null || value === undefined) return ''
      return parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },
    getStatusClass(status) {
      if (status === null || status === undefined) return ''

      // Handle boolean status (is_active)
      if (typeof status === 'boolean') {
        return status
          ? 'bg-success/10 text-success border border-success/20'
          : 'bg-red-500/10 text-danger border border-danger/20'
      }

      // Handle string status
      const statusStr = String(status).toLowerCase()
      switch (statusStr) {
        case 'active':
        case 'completed':
        case 'success':
          return 'bg-success/10 text-success border border-success/20'
        case 'inactive':
        case 'cancelled':
        case 'failed':
          return 'bg-red-500/10 text-danger border border-danger/20'
        case 'pending':
        case 'processing':
          return 'bg-warning/10 text-warning border border-warning/20'
        default:
          return 'bg-gray/10 text-gray border border-gray/20'
      }
    },
    formatStatus(status) {
      if (status === null || status === undefined) return ''

      // Handle boolean status
      if (typeof status === 'boolean') {
        return status ? 'Active' : 'Inactive'
      }

      // Handle string status - capitalize first letter
      return String(status).charAt(0).toUpperCase() + String(status).slice(1)
    },
    applyFilters() {
      this.currentPage = 1
      this.$emit('filter-applied')
      this.isFilterOpen = false
    },
    resetFilters() {
      this.currentPage = 1
      this.$emit('filter-reset')
      this.isFilterOpen = false
    },
    getWhatsAppUrl(item) {
      console.log('getWhatsAppUrl called with item:', item)
      console.log('waPhoneNumber:', this.waPhoneNumber)
      const message = `Selamat Siang
Data survey
Nama : ${item.client_name}
Est tgl : ${item.visiting_date}
Est jmlh : ${item.estimated_paxes}
Villa/aula : ${item.villa_types}
Kontak : ${item.phone_number}
Ket: ${item.notes}`
      const encodedMessage = encodeURIComponent(message)
      const url = `https://wa.me/${this.waPhoneNumber}?text=${encodedMessage}`
      console.log('Generated WhatsApp URL:', url)
      return url
    },
    handleEdit(item) {
      this.$emit('edit', item)
    },
  },
}
</script>

<template>
  <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <!-- Table Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <h4 class="text-xl font-semibold text-black dark:text-white">
        {{ title }}
      </h4>

      <!-- Search and Filter -->
      <div class="flex items-center gap-3">
        <!-- Search Input -->
        <div class="relative">
          <input
            type="text"
            placeholder="Search..."
            v-model="searchQuery"
            class="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
                d="M14.0467 11.22L12.6667 9.80667C12.3699 9.5245 11.9955 9.33754 11.5916 9.26983C11.1876 9.20211 10.7727 9.25673 10.4 9.42667L9.80001 8.82667C10.5071 7.88751 10.8299 6.70961 10.7038 5.53371C10.5778 4.35781 10.0115 3.27559 9.12608 2.50375C8.24069 1.73191 7.09292 1.32358 5.90909 1.35362C4.72526 1.38366 3.6004 1.84938 2.75482 2.66476C1.90923 3.48014 1.40518 4.59486 1.34806 5.77725C1.29093 6.95963 1.68552 8.12047 2.44399 9.02255C3.20246 9.92464 4.27566 10.5223 5.45025 10.6823C6.62484 10.8423 7.81206 10.5521 8.76667 9.88L9.36667 10.48C9.18345 10.8479 9.11566 11.2625 9.17125 11.6689C9.22683 12.0752 9.40275 12.4547 9.67334 12.76L11.0867 14.1733C11.3312 14.4178 11.6572 14.5547 12 14.5547C12.3428 14.5547 12.6688 14.4178 12.9133 14.1733L14.0467 13.04C14.2912 12.7955 14.4281 12.4695 14.4281 12.1267C14.4281 11.7839 14.2912 11.4578 14.0467 11.2133V11.22Z"
                fill=""
              ></path>
            </svg>
          </span>
        </div>

        <!-- Add Button -->
        <button
          v-if="showAddButton"
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
      <div class="grid grid-cols-12 rounded-sm bg-gray-2 dark:bg-meta-4">
        <div
          v-for="(column, index) in columns"
          :key="index"
          :class="[
            'p-2.5 xl:p-5',
            column.class || `col-span-${column.span || 1}`,
            column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
          ]"
        >
          <h5 class="text-sm font-medium uppercase xsm:text-base">
            {{ column.label }}
          </h5>
        </div>
        <div v-if="showActions" class="p-2.5 xl:p-5 col-span-1 text-center">
          <h5 class="text-sm font-medium uppercase xsm:text-base">
            Actions
          </h5>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!filteredData.length" class="flex justify-center items-center py-10">
        <div class="text-center">
          <p class="text-lg font-medium text-gray-600 dark:text-gray-400">No data found</p>
          <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      </div>

      <!-- Data Rows -->
      <div v-else v-for="(item, rowIndex) in paginatedData" :key="rowIndex" class="grid grid-cols-12 border-b border-stroke dark:border-strokedark">
        <template v-for="(column, colIndex) in columns" :key="colIndex">
          <div
            :class="[
              'p-2.5 xl:p-5 flex items-center',
              column.class || `col-span-${column.span || 1}`,
              column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : 'justify-start'
            ]"
          >
            <!-- Default cell renderer -->
            <template v-if="column.type === 'status'">
              <span
                :class="[
                  'inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium',
                  getStatusClass(item[column.key])
                ]"
              >
                {{ item[column.key] }}
              </span>
            </template>
            <template v-else-if="column.type === 'date'">
              {{ formatDate(item[column.key]) }}
            </template>
            <template v-else-if="column.type === 'currency'">
              {{ formatCurrency(item[column.key]) }}
            </template>
            <template v-else>
              {{ item[column.key] }}
            </template>
          </div>
        </template>

        <!-- Actions Column -->
        <div v-if="showActions" class="p-2.5 xl:p-5 col-span-1 flex items-center justify-center">
          <div class="flex items-center space-x-2">
            <!-- View Button -->
            <button
              v-if="showViewButton"
              @click="$emit('view', item)"
              class="hover:text-primary"
              title="View"
            >
              <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18">
                <path d="M9 3.75C4.5 3.75 1.5 9 1.5 9C1.5 9 4.5 14.25 9 14.25C13.5 14.25 16.5 9 16.5 9C16.5 9 13.5 3.75 9 3.75ZM9 12.75C7.76 12.75 6.75 11.74 6.75 10.5C6.75 9.26 7.76 8.25 9 8.25C10.24 8.25 11.25 9.26 11.25 10.5C11.25 11.74 10.24 12.75 9 12.75Z"></path>
              </svg>
            </button>

            <!-- Edit Button -->
            <button
              v-if="showEditButton"
              @click="$emit('edit', item)"
              class="hover:text-primary"
              title="Edit"
            >
              <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18">
                <path d="M16.4999 9C16.2789 9 16.0669 9.0878 15.9106 9.24408C15.7544 9.40036 15.6666 9.61232 15.6666 9.83333V14.8333C15.6666 15.0543 15.5788 15.2663 15.4225 15.4226C15.2662 15.5789 15.0542 15.6667 14.8332 15.6667H3.16656C2.94555 15.6667 2.73359 15.5789 2.57731 15.4226C2.42103 15.2663 2.33323 15.0543 2.33323 14.8333V3.16667C2.33323 2.94565 2.42103 2.73369 2.57731 2.57741C2.73359 2.42113 2.94555 2.33333 3.16656 2.33333H8.16657C8.38758 2.33333 8.59954 2.24554 8.75582 2.08926C8.9121 1.93298 8.9999 1.72101 8.9999 1.5C8.9999 1.27899 8.9121 1.06702 8.75582 0.910744C8.59954 0.754464 8.38758 0.666667 8.16657 0.666667H3.16656C2.50352 0.666667 1.86764 0.930059 1.3988 1.3989C0.929957 1.86774 0.666565 2.50363 0.666565 3.16667V14.8333C0.666565 15.4964 0.929957 16.1323 1.3988 16.6011C1.86764 17.0699 2.50352 17.3333 3.16656 17.3333H14.8332C15.4963 17.3333 16.1322 17.0699 16.601 16.6011C17.0698 16.1323 17.3332 15.4964 17.3332 14.8333V9.83333C17.3332 9.61232 17.2454 9.40036 17.0892 9.24408C16.9329 9.0878 16.7209 9 16.4999 9Z"></path>
              </svg>
            </button>

            <!-- Delete Button -->
            <button
              v-if="showDeleteButton"
              @click="$emit('delete', item)"
              class="hover:text-danger"
              title="Delete"
            >
              <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18">
                <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="showPagination && totalPages > 1" class="flex flex-wrap items-center justify-between gap-4 mt-6 mb-4">
      <div class="flex items-center gap-2">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Showing {{ startIndex + 1 }}-{{ Math.min(endIndex, filteredData.length) }} of {{ filteredData.length }} entries
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="goToPage(1)"
          :disabled="currentPage === 1"
          class="flex h-9 w-9 items-center justify-center rounded-md border border-stroke"
        >
          <svg class="fill-current" width="8" height="10" viewBox="0 0 8 10">
            <path d="M7.33366 1.66683L3.00033 6.0335L7.33366 9.66683L6.00033 9.66683L1.66699 6.0335L6.00033 1.66683L7.33366 1.66683Z" />
          </svg>
        </button>

        <button
          v-for="page in displayedPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'flex h-9 min-w-[36px] items-center justify-center rounded-md border px-2',
            currentPage === page ? 'border-primary bg-primary text-white' : 'border-stroke'
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
            <path d="M0.666341 1.66683L4.99967 6.0335L0.666341 9.66683L1.99967 9.66683L6.33301 6.0335L1.99967 1.66683L0.666341 1.66683Z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    title: {
      type: String,
      default: 'Data Table'
    },
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    showActions: {
      type: Boolean,
      default: true
    },
    showViewButton: {
      type: Boolean,
      default: true
    },
    showEditButton: {
      type: Boolean,
      default: true
    },
    showDeleteButton: {
      type: Boolean,
      default: true
    },
    showAddButton: {
      type: Boolean,
      default: true
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    itemsPerPage: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      isFilterOpen: false
    };
  },
  computed: {
    filteredData() {
      if (!this.searchQuery) {
        return this.data;
      }

      const query = this.searchQuery.toLowerCase();
      return this.data.filter(item => {
        return this.columns.some(column => {
          const value = item[column.key];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        });
      });
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    endIndex() {
      return this.startIndex + this.itemsPerPage;
    },
    paginatedData() {
      return this.filteredData.slice(this.startIndex, this.endIndex);
    },
    displayedPages() {
      const pages = [];
      const maxVisiblePages = 5;

      if (this.totalPages <= maxVisiblePages) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        const leftSide = Math.floor(maxVisiblePages / 2);
        const rightSide = maxVisiblePages - leftSide - 1;

        if (this.currentPage > leftSide && this.currentPage < this.totalPages - rightSide) {
          pages.push(1);
          pages.push('...');

          for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
            pages.push(i);
          }

          pages.push('...');
          pages.push(this.totalPages);
        } else if (this.currentPage <= leftSide) {
          for (let i = 1; i <= maxVisiblePages - 1; i++) {
            pages.push(i);
          }

          pages.push('...');
          pages.push(this.totalPages);
        } else {
          pages.push(1);
          pages.push('...');

          for (let i = this.totalPages - maxVisiblePages + 2; i <= this.totalPages; i++) {
            pages.push(i);
          }
        }
      }

      return pages;
    }
  },
  methods: {
    goToPage(page) {
      if (typeof page === 'number') {
        this.currentPage = page;
      }
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString();
    },
    formatCurrency(value) {
      if (value === null || value === undefined) return '';
      return `$${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
    getStatusClass(status) {
      if (!status) return '';

      const statusMap = {
        'active': 'bg-success text-success',
        'pending': 'bg-warning text-warning',
        'cancelled': 'bg-danger text-danger',
        'completed': 'bg-success text-success',
        'confirmed': 'bg-success text-success',
        'rejected': 'bg-danger text-danger'
      };

      return statusMap[status.toLowerCase()] || 'bg-gray-500 text-gray-500';
    },
    applyFilters() {
      this.currentPage = 1;
      this.$emit('filter-applied');
      this.isFilterOpen = false;
    },
    resetFilters() {
      this.searchQuery = '';
      this.currentPage = 1;
      this.$emit('filter-reset');
      this.isFilterOpen = false;
    }
  }
};
</script>

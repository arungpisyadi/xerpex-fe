<template>
  <admin-layout>
    <!-- Notification -->
    <div v-if="notification.show" class="fixed top-4 right-4 z-999999 max-w-sm">
      <div
        :class="[
          'rounded-lg border p-4 shadow-lg',
          notification.type === 'success'
            ? 'border-success bg-success/10 text-success'
            : 'border-danger bg-danger/10 text-danger'
        ]"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg v-if="notification.type === 'success'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">{{ notification.message }}</p>
          </div>
          <div class="ml-auto pl-3">
            <button @click="notification.show = false" class="inline-flex rounded-md p-1.5 hover:bg-black/5">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Bookings' }]" />
    </div>

    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Bookings Management
        </h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="relative">
            <input
              type="text"
              placeholder="Search bookings..."
              v-model="searchQuery"
              class="w-full rounded-md border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <span class="absolute left-3 top-2.5 text-gray-500">
              <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.0467 11.22L12.6667 9.80667C12.3699 9.5245 11.9955 9.33754 11.5916 9.26983C11.1876 9.20211 10.7727 9.25673 10.4 9.42667L9.80001 8.82667C10.5071 7.88194 10.8299 6.70445 10.7037 5.53122C10.5775 4.358 10.0115 3.27615 9.11963 2.50347C8.22779 1.73078 7.07536 1.32464 5.89712 1.36679C4.71887 1.40894 3.59838 1.89621 2.76399 2.73061C1.92959 3.565 1.44232 4.68549 1.40017 5.86374C1.35802 7.04198 1.76416 8.19441 2.53685 9.08625C3.30953 9.97809 4.39138 10.5441 5.5646 10.6703C6.73783 10.7964 7.91533 10.4736 8.86005 9.76667L9.46001 10.3667C9.29007 10.7393 9.23546 11.1542 9.30317 11.5582C9.37089 11.9622 9.55785 12.3366 9.84001 12.6333L11.2533 14.0467C11.3983 14.1924 11.5712 14.3072 11.7622 14.3837C11.9532 14.4602 12.1579 14.4967 12.3633 14.4908C12.5688 14.485 12.7713 14.4368 12.9581 14.3494C13.1448 14.262 13.3112 14.1371 13.4483 13.9833C13.5946 13.8393 13.7094 13.6664 13.7859 13.4754C13.8624 13.2844 13.8989 13.0797 13.8931 12.8743C13.8873 12.6688 13.8391 12.4663 13.7517 12.2795C13.6643 12.0928 13.5394 11.9264 13.3857 11.7893L14.0467 11.22Z" fill="currentColor"/>
              </svg>
            </span>
          </div>
          <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600" @click="openAddBookingModal">
            <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z" fill="white"/>
            </svg>
            Add New Booking
          </button>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto">
        <data-table
          :data="filteredBookings"
          :columns="columns"
          :loading="loading"
          :show-add-button="false"
          @view="viewBooking"
          @edit="editBooking"
          @delete="confirmDeleteBooking"
        />
      </div>
    </div>

    <!-- Add/Edit Booking Modal -->
    <div v-if="showModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70">
      <div class="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default sm:p-7.5">
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">
            {{ isEditing ? 'Edit Booking' : 'Add New Booking' }}
          </h4>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveBooking" novalidate>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Customer Name <span class="text-meta-1">*</span>
              </label>
              <input
                v-model="bookingForm.customer_name"
                type="text"
                placeholder="Enter customer name"
                :class="[
                  'w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:focus:border-primary',
                  formErrors.customer_name ? 'border-danger' : 'border-stroke dark:border-form-strokedark'
                ]"
                required
                @blur="validateField('customer_name')"
              />
              <p v-if="formErrors.customer_name" class="mt-1 text-sm text-danger">{{ formErrors.customer_name }}</p>
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Customer Email <span class="text-meta-1">*</span>
              </label>
              <input
                v-model="bookingForm.customer_email"
                type="email"
                placeholder="Enter customer email"
                :class="[
                  'w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:focus:border-primary',
                  formErrors.customer_email ? 'border-danger' : 'border-stroke dark:border-form-strokedark'
                ]"
                required
                @blur="validateField('customer_email')"
              />
              <p v-if="formErrors.customer_email" class="mt-1 text-sm text-danger">{{ formErrors.customer_email }}</p>
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Customer Phone <span class="text-meta-1">*</span>
              </label>
              <input
                v-model="bookingForm.customer_phone"
                type="text"
                placeholder="Enter customer phone"
                :class="[
                  'w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:focus:border-primary',
                  formErrors.customer_phone ? 'border-danger' : 'border-stroke dark:border-form-strokedark'
                ]"
                required
                @blur="validateField('customer_phone')"
              />
              <p v-if="formErrors.customer_phone" class="mt-1 text-sm text-danger">{{ formErrors.customer_phone }}</p>
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Villa <span class="text-meta-1">*</span>
              </label>
              <select
                v-model="bookingForm.villa_id"
                :class="[
                  'w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:focus:border-primary',
                  formErrors.villa_id ? 'border-danger' : 'border-stroke dark:border-form-strokedark'
                ]"
                required
                @blur="validateField('villa_id')"
              >
                <option value="" disabled>Select a villa</option>
                <option v-for="villa in villas" :key="villa.id" :value="villa.id">
                  {{ villa.name }}
                </option>
              </select>
              <p v-if="formErrors.villa_id" class="mt-1 text-sm text-danger">{{ formErrors.villa_id }}</p>
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Check-in Date <span class="text-meta-1">*</span>
              </label>
              <input
                v-model="bookingForm.check_in_date"
                type="date"
                :class="[
                  'w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:focus:border-primary',
                  formErrors.check_in_date ? 'border-danger' : 'border-stroke dark:border-form-strokedark'
                ]"
                required
                @blur="validateField('check_in_date')"
              />
              <p v-if="formErrors.check_in_date" class="mt-1 text-sm text-danger">{{ formErrors.check_in_date }}</p>
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Check-out Date <span class="text-meta-1">*</span>
              </label>
              <input
                v-model="bookingForm.check_out_date"
                type="date"
                :class="[
                  'w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:focus:border-primary',
                  formErrors.check_out_date ? 'border-danger' : 'border-stroke dark:border-form-strokedark'
                ]"
                required
                @blur="validateField('check_out_date')"
              />
              <p v-if="formErrors.check_out_date" class="mt-1 text-sm text-danger">{{ formErrors.check_out_date }}</p>
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Number of Guests <span class="text-meta-1">*</span>
              </label>
              <input
                v-model.number="bookingForm.num_guests"
                type="number"
                min="1"
                placeholder="Enter number of guests"
                :class="[
                  'w-full rounded border-[1.5px] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:focus:border-primary',
                  formErrors.num_guests ? 'border-danger' : 'border-stroke dark:border-form-strokedark'
                ]"
                required
                @blur="validateField('num_guests')"
              />
              <p v-if="formErrors.num_guests" class="mt-1 text-sm text-danger">{{ formErrors.num_guests }}</p>
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">
                Status
              </label>
              <select
                v-model="bookingForm.status"
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Special Requests
            </label>
            <textarea
              v-model="bookingForm.special_requests"
              placeholder="Enter special requests"
              rows="3"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            ></textarea>
          </div>

          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="closeModal"
              class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
            >
              {{ isEditing ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Booking Modal -->
    <div v-if="showViewModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-30">
      <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default sm:p-7.5">
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">
            Booking Details
          </h4>
          <button @click="closeViewModal" class="text-gray-500 hover:text-gray-700">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedBooking" class="space-y-6">
          <!-- Booking Information Grid -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h5 class="mb-3 font-medium text-black dark:text-white">Customer Information</h5>
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Name:</span>
                  <p class="text-black dark:text-white">{{ selectedBooking.customer_name }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Email:</span>
                  <p class="text-black dark:text-white">{{ selectedBooking.customer_email }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Phone:</span>
                  <p class="text-black dark:text-white">{{ selectedBooking.customer_phone }}</p>
                </div>
              </div>
            </div>

            <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h5 class="mb-3 font-medium text-black dark:text-white">Booking Details</h5>
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Villa:</span>
                  <p class="text-black dark:text-white">{{ selectedBooking.villa_name }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Guests:</span>
                  <p class="text-black dark:text-white">{{ selectedBooking.num_guests }} guests</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
                  <span
                    :class="[
                      'inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium',
                      getStatusClass(selectedBooking.status)
                    ]"
                  >
                    {{ formatStatus(selectedBooking.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Dates and Pricing -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h5 class="mb-3 font-medium text-black dark:text-white">Stay Period</h5>
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Check-in:</span>
                  <p class="text-black dark:text-white">{{ formatDate(selectedBooking.check_in_date) }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Check-out:</span>
                  <p class="text-black dark:text-white">{{ formatDate(selectedBooking.check_out_date) }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Duration:</span>
                  <p class="text-black dark:text-white">{{ calculateNights(selectedBooking.check_in_date, selectedBooking.check_out_date) }} nights</p>
                </div>
              </div>
            </div>

            <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h5 class="mb-3 font-medium text-black dark:text-white">Pricing</h5>
              <div class="space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Price:</span>
                  <p class="text-black dark:text-white">{{ formatCurrency(selectedBooking.total_price) }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Booking ID:</span>
                  <p class="text-black dark:text-white">#{{ selectedBooking.id }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Special Requests -->
          <div v-if="selectedBooking.special_requests" class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h5 class="mb-3 font-medium text-black dark:text-white">Special Requests</h5>
            <p class="text-gray-600 dark:text-gray-400">{{ selectedBooking.special_requests }}</p>
          </div>

          <!-- Timestamps -->
          <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h5 class="mb-3 font-medium text-black dark:text-white">Timeline</h5>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Created:</span>
                <p class="text-black dark:text-white">{{ formatDate(selectedBooking.created_at) }}</p>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Last Updated:</span>
                <p class="text-black dark:text-white">{{ formatDate(selectedBooking.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            type="button"
            @click="closeViewModal"
            class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black bg-opacity-30">
      <div class="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-sm border border-stroke bg-white p-5 shadow-default sm:p-7.5">
        <div class="mb-5 flex items-center justify-between">
          <h4 class="text-xl font-semibold text-black dark:text-white">
            Confirm Delete
          </h4>
          <button @click="showDeleteModal = false" class="text-gray-500 hover:text-gray-700">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.37993C19.1133 -0.12665 18.2943 -0.12665 17.7877 0.37993L9.99988 8.16793L2.21228 0.37993C1.7057 -0.12665 0.886644 -0.12665 0.380059 0.37993C-0.126686 0.88651 -0.126686 1.70557 0.380059 2.21215L8.16766 10.0001L0.380059 17.7881C-0.126686 18.2947 -0.126686 19.1138 0.380059 19.6204C0.632556 19.8729 0.964511 20 1.29647 20C1.62842 20 1.96055 19.8729 2.21287 19.6204L9.99988 11.8324L17.7877 19.6204C18.04 19.8729 18.3721 20 18.7041 20C19.036 20 19.3674 19.8729 19.6205 19.6204C20.1271 19.1138 20.1271 18.2947 19.6205 17.7881L11.8323 10.0001Z" fill=""></path>
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <p class="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this booking? This action cannot be undone.
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
            @click="deleteBooking"
            class="flex justify-center rounded bg-danger py-2 px-6 font-medium text-white hover:bg-opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue';
import DataTable from '../components/common/DataTable.vue';
import { bookingService, villaService } from '../services';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
    DataTable
  },
  data() {
    return {
      bookings: [],
      villas: [],
      loading: false,
      searchQuery: '',
      columns: [
        { key: 'id', label: 'ID', span: 1 },
        { key: 'customer_name', label: 'Customer', span: 2 },
        { key: 'villa_name', label: 'Villa', span: 2 },
        { key: 'check_in_date', label: 'Check-in', span: 1, type: 'date' },
        { key: 'check_out_date', label: 'Check-out', span: 1, type: 'date' },
        { key: 'total_price', label: 'Total', span: 1, type: 'currency' },
        { key: 'status', label: 'Status', span: 1, type: 'status' }
      ],
      showModal: false,
      showViewModal: false,
      showDeleteModal: false,
      isEditing: false,
      selectedBookingId: null,
      selectedBooking: null,
      bookingForm: {
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        villa_id: '',
        check_in_date: '',
        check_out_date: '',
        num_guests: 1,
        special_requests: '',
        status: 'pending'
      },
      formErrors: {},
      notification: {
        show: false,
        type: '',
        message: ''
      }
    };
  },
  computed: {
    filteredBookings() {
      if (!this.searchQuery) {
        return this.bookings;
      }

      const query = this.searchQuery.toLowerCase();
      return this.bookings.filter(booking => {
        return (
          booking.customer_name?.toLowerCase().includes(query) ||
          booking.customer_email?.toLowerCase().includes(query) ||
          booking.customer_phone?.toLowerCase().includes(query) ||
          booking.villa_name?.toLowerCase().includes(query) ||
          booking.status?.toLowerCase().includes(query) ||
          String(booking.id || '').includes(query) ||
          String(booking.total_price || '').includes(query)
        );
      });
    }
  },
  async created() {
    await Promise.all([
      this.fetchBookings(),
      this.fetchVillas()
    ]);
  },
  methods: {
    async fetchBookings() {
      this.loading = true;
      try {
        const response = await bookingService.getBookings();

        // Process bookings to add villa_name
        this.bookings = (response.items || []).map(booking => {
          const villa = this.villas.find(v => v.id === booking.villa_id);
          return {
            ...booking,
            villa_name: villa ? villa.name : 'Unknown Villa'
          };
        });
      } catch (error) {
        console.error('Error fetching bookings:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch bookings';
        this.showNotification('error', errorMessage);
      } finally {
        this.loading = false;
      }
    },
    async fetchVillas() {
      try {
        const response = await villaService.getVillas();
        this.villas = response.items || response || [];
      } catch (error) {
        console.error('Error fetching villas:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch villas';
        this.showNotification('error', errorMessage);
      }
    },
    openAddBookingModal() {
      this.isEditing = false;
      this.bookingForm = {
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        villa_id: '',
        check_in_date: '',
        check_out_date: '',
        num_guests: 1,
        special_requests: '',
        status: 'pending'
      };
      this.showModal = true;
    },
    async viewBooking(booking) {
      try {
        this.loading = true;
        const response = await bookingService.getBookingById(booking.id);
        const villa = this.villas.find(v => v.id === response.villa_id);
        this.selectedBooking = {
          ...response,
          villa_name: villa ? villa.name : 'Unknown Villa'
        };
        this.showViewModal = true;
      } catch (error) {
        console.error('Error fetching booking details:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch booking details';
        this.showNotification('error', errorMessage);
      } finally {
        this.loading = false;
      }
    },
    async editBooking(booking) {
      this.isEditing = true;
      this.selectedBookingId = booking.id;

      // Get detailed booking information
      try {
        const bookingDetails = await bookingService.getBookingById(booking.id);

        this.bookingForm = {
          customer_name: bookingDetails.customer_name,
          customer_email: bookingDetails.customer_email,
          customer_phone: bookingDetails.customer_phone,
          villa_id: bookingDetails.villa_id,
          check_in_date: bookingDetails.check_in_date,
          check_out_date: bookingDetails.check_out_date,
          num_guests: bookingDetails.num_guests,
          special_requests: bookingDetails.special_requests || '',
          status: bookingDetails.status
        };

        this.showModal = true;
      } catch (error) {
        console.error('Error fetching booking details:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch booking details';
        this.showNotification('error', errorMessage);
      }
    },
    confirmDeleteBooking(booking) {
      this.selectedBookingId = booking.id;
      this.showDeleteModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.formErrors = {};
      this.bookingForm = {
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        villa_id: '',
        check_in_date: '',
        check_out_date: '',
        num_guests: 1,
        special_requests: '',
        status: 'pending'
      };
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedBooking = null;
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatCurrency(value) {
      if (value === null || value === undefined) return '';
      return `$${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
    formatStatus(status) {
      if (status === null || status === undefined) return '';
      return String(status).charAt(0).toUpperCase() + String(status).slice(1);
    },
    getStatusClass(status) {
      if (status === null || status === undefined) return '';
      
      const statusStr = String(status).toLowerCase();
      switch (statusStr) {
        case 'confirmed':
        case 'completed':
          return 'bg-success/10 text-success border border-success/20';
        case 'cancelled':
          return 'bg-danger/10 text-danger border border-danger/20';
        case 'pending':
          return 'bg-warning/10 text-warning border border-warning/20';
        default:
          return 'bg-gray/10 text-gray border border-gray/20';
      }
    },
    calculateNights(checkIn, checkOut) {
      if (!checkIn || !checkOut) return 0;
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
    validateField(fieldName) {
      this.formErrors = { ...this.formErrors };
      delete this.formErrors[fieldName];

      switch (fieldName) {
        case 'customer_name':
          if (!this.bookingForm.customer_name || this.bookingForm.customer_name.trim().length < 2) {
            this.formErrors.customer_name = 'Customer name must be at least 2 characters long';
          }
          break;
        case 'customer_email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!this.bookingForm.customer_email || !emailRegex.test(this.bookingForm.customer_email)) {
            this.formErrors.customer_email = 'Please enter a valid email address';
          }
          break;
        case 'customer_phone':
          if (!this.bookingForm.customer_phone || this.bookingForm.customer_phone.trim().length < 8) {
            this.formErrors.customer_phone = 'Phone number must be at least 8 characters long';
          }
          break;
        case 'villa_id':
          if (!this.bookingForm.villa_id) {
            this.formErrors.villa_id = 'Please select a villa';
          }
          break;
        case 'check_in_date':
          if (!this.bookingForm.check_in_date) {
            this.formErrors.check_in_date = 'Check-in date is required';
          } else if (new Date(this.bookingForm.check_in_date) < new Date().setHours(0,0,0,0)) {
            this.formErrors.check_in_date = 'Check-in date cannot be in the past';
          }
          break;
        case 'check_out_date':
          if (!this.bookingForm.check_out_date) {
            this.formErrors.check_out_date = 'Check-out date is required';
          } else if (this.bookingForm.check_in_date && new Date(this.bookingForm.check_out_date) <= new Date(this.bookingForm.check_in_date)) {
            this.formErrors.check_out_date = 'Check-out date must be after check-in date';
          }
          break;
        case 'num_guests':
          if (!this.bookingForm.num_guests || this.bookingForm.num_guests < 1 || this.bookingForm.num_guests > 20) {
            this.formErrors.num_guests = 'Number of guests must be between 1 and 20';
          }
          break;
      }
    },
    validateForm() {
      this.formErrors = {};

      // Validate all fields
      this.validateField('customer_name');
      this.validateField('customer_email');
      this.validateField('customer_phone');
      this.validateField('villa_id');
      this.validateField('check_in_date');
      this.validateField('check_out_date');
      this.validateField('num_guests');

      return Object.keys(this.formErrors).length === 0;
    },
    showNotification(type, message) {
      this.notification = {
        show: true,
        type,
        message
      };

      // Auto hide after 5 seconds
      setTimeout(() => {
        this.notification.show = false;
      }, 5000);
    },
    async saveBooking() {
      if (!this.validateForm()) {
        this.showNotification('error', 'Please fix the validation errors before submitting');
        return;
      }

      try {
        this.loading = true;
        if (this.isEditing) {
          await bookingService.updateBooking(this.selectedBookingId, this.bookingForm);
          this.showNotification('success', 'Booking updated successfully');
        } else {
          await bookingService.createBooking(this.bookingForm);
          this.showNotification('success', 'Booking created successfully');
        }
        this.closeModal();
        await this.fetchBookings();
      } catch (error) {
        console.error('Error saving booking:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to save booking';
        this.showNotification('error', errorMessage);
      } finally {
        this.loading = false;
      }
    },
    async deleteBooking() {
      try {
        this.loading = true;
        await bookingService.deleteBooking(this.selectedBookingId);
        this.showDeleteModal = false;
        await this.fetchBookings();
        this.showNotification('success', 'Booking deleted successfully');
      } catch (error) {
        console.error('Error deleting booking:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete booking';
        this.showNotification('error', errorMessage);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

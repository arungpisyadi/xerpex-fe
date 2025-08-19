<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Settings' }]" />
    </div>

    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div class="mb-6">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          System Settings
        </h2>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>

      <template v-else>
        <!-- Settings Tabs -->
        <div class="mb-6">
          <div class="mb-4.5 flex flex-wrap gap-3 border-b border-stroke pb-5 dark:border-strokedark">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'inline-flex items-center justify-center rounded-md py-3 px-4 text-center font-medium',
                activeTab === tab.id
                  ? 'bg-brand-500 text-white'
                  : tab.id === 'general'
                    ? 'bg-gray-2 text-black hover:bg-brand-500 hover:text-white dark:bg-meta-4 dark:text-white dark:hover:bg-brand-500'
                    : 'bg-gray-2 text-gray-400 cursor-not-allowed dark:bg-meta-4 dark:text-gray-500'
              ]"
              @click="tab.id === 'general' ? activeTab = tab.id : null"
              :disabled="tab.id !== 'general'"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>

        <!-- General Settings -->
        <div v-if="activeTab === 'general'" class="mb-6">
          <div class="rounded-sm border border-stroke bg-white p-6.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 class="mb-6 text-xl font-semibold text-black dark:text-white">
              General Settings
            </h3>

            <form @submit.prevent="saveGeneralSettings">
              <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div class="w-full xl:w-1/2">
                  <label class="mb-2.5 block text-black dark:text-white">
                    Company Name <span class="text-meta-1">*</span>
                  </label>
                  <input
                    v-model="settings.general.companyName"
                    type="text"
                    placeholder="Enter company name"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                    required
                  />
                </div>

                <div class="w-full xl:w-1/2">
                  <label class="mb-2.5 block text-black dark:text-white">
                    Company Email <span class="text-meta-1">*</span>
                  </label>
                  <input
                    v-model="settings.general.companyEmail"
                    type="email"
                    placeholder="Enter company email"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div class="w-full xl:w-1/2">
                  <label class="mb-2.5 block text-black dark:text-white">
                    Company Phone
                  </label>
                  <input
                    v-model="settings.general.companyPhone"
                    type="text"
                    placeholder="Enter company phone"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                  />
                </div>

                <div class="w-full xl:w-1/2">
                  <label class="mb-2.5 block text-black dark:text-white">
                    Time Zone <span class="text-meta-1">*</span>
                  </label>
                  <select
                    v-model="settings.general.timezone"
                    class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                    required
                  >
                    <option value="">Select Time Zone</option>
                    <option value="UTC">UTC</option>
                    <option value="Asia/Jakarta">Asia/Jakarta (UTC+7)</option>
                    <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
                    <option value="America/New_York">America/New_York (UTC-5)</option>
                    <option value="Europe/London">Europe/London (UTC+0)</option>
                  </select>
                </div>
              </div>

              <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">
                  Company Address
                </label>
                <textarea
                  v-model="settings.general.companyAddress"
                  rows="4"
                  placeholder="Enter company address"
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                ></textarea>
              </div>


              <div class="mb-4.5">
                <h4 class="mb-4 text-lg font-medium text-black dark:text-white">Bank Account Information</h4>

                <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div class="w-full xl:w-1/2">
                    <label class="mb-2.5 block text-black dark:text-white">
                      Bank Name
                    </label>
                    <input
                      v-model="settings.general.bankName"
                      type="text"
                      placeholder="Enter bank name"
                      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                    />
                  </div>

                  <div class="w-full xl:w-1/2">
                    <label class="mb-2.5 block text-black dark:text-white">
                      Account Holder Name
                    </label>
                    <input
                      v-model="settings.general.bankAccountHolderName"
                      type="text"
                      placeholder="Enter account holder name"
                      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                    />
                  </div>
                </div>

                <div class="mb-6 flex flex-col gap-6 xl:flex-row">
                  <div class="w-full xl:w-1/2">
                    <label class="mb-2.5 block text-black dark:text-white">
                      Bank Account Number
                    </label>
                    <input
                      v-model="settings.general.bankAccountNumber"
                      type="text"
                      placeholder="Enter bank account number"
                      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                    />
                  </div>

                  <div class="w-full xl:w-1/2">
                    <label class="mb-2.5 block text-black dark:text-white">
                      SWIFT Number
                    </label>
                    <input
                      v-model="settings.general.bankSwiftNumber"
                      type="text"
                      placeholder="Enter SWIFT number"
                      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="flex w-full justify-center rounded bg-brand-500 p-3 font-medium text-gray hover:bg-brand-600 disabled:opacity-50"
              >
                <span v-if="loading" class="mr-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Booking Settings -->
        <div v-if="activeTab === 'booking'" class="mb-6">
          <div class="rounded-sm border border-stroke bg-white p-6.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Booking Settings
            </h3>

            <form @submit.prevent="saveBookingSettings">
              <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div class="w-full xl:w-1/2">
                  <label class="mb-2.5 block text-black dark:text-white">
                    Check-in Time <span class="text-meta-1">*</span>
                  </label>
                  <input
                    v-model="settings.booking.checkInTime"
                    type="time"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                    required
                  />
                </div>

                <div class="w-full xl:w-1/2">
                  <label class="mb-2.5 block text-black dark:text-white">
                    Check-out Time <span class="text-meta-1">*</span>
                  </label>
                  <input
                    v-model="settings.booking.checkOutTime"
                    type="time"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div class="w-full xl:w-1/2">
                  <label class="mb-2.5 block text-black dark:text-white">
                    Minimum Booking Days <span class="text-meta-1">*</span>
                  </label>
                  <input
                    v-model="settings.booking.minBookingDays"
                    type="number"
                    min="1"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                    required
                  />
                </div>

                <div class="w-full xl:w-1/2">
                  <label class="mb-2.5 block text-black dark:text-white">
                    Maximum Booking Days <span class="text-meta-1">*</span>
                  </label>
                  <input
                    v-model="settings.booking.maxBookingDays"
                    type="number"
                    min="1"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">
                  Advance Booking Days
                </label>
                <input
                  v-model="settings.booking.advanceBookingDays"
                  type="number"
                  min="0"
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                />
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Maximum days in advance a booking can be made</p>
              </div>

              <div class="mb-4.5 flex items-center">
                <label class="flex cursor-pointer select-none items-center">
                  <div class="relative">
                    <input
                      type="checkbox"
                      v-model="settings.booking.allowPartialPayment"
                      class="sr-only"
                    />
                    <div class="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                    <div
                      :class="[
                        settings.booking.allowPartialPayment ? 'bg-brand-500 left-[30px]' : 'bg-white left-1',
                        'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                      ]"
                    ></div>
                  </div>
                  <span class="ml-3 text-black dark:text-white">Allow Partial Payment</span>
                </label>
              </div>

              <div class="mb-6" v-if="settings.booking.allowPartialPayment">
                <label class="mb-2.5 block text-black dark:text-white">
                  Minimum Deposit Percentage
                </label>
                <input
                  v-model="settings.booking.minDepositPercentage"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                />
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Percentage of total amount required as deposit</p>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="flex w-full justify-center rounded bg-brand-500 p-3 font-medium text-gray hover:bg-brand-600 disabled:opacity-50"
              >
                <span v-if="loading" class="mr-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Payment Settings -->
        <div v-if="activeTab === 'payment'" class="mb-6">
          <div class="rounded-sm border border-stroke bg-white p-6.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Payment Settings
            </h3>

            <form @submit.prevent="savePaymentSettings">
              <div class="mb-4.5">
                <h4 class="mb-4 text-lg font-medium text-black dark:text-white">Payment Methods</h4>

                <div class="mb-4 flex items-center">
                  <label class="flex cursor-pointer select-none items-center">
                    <div class="relative">
                      <input
                        type="checkbox"
                        v-model="settings.payment.enableCreditCard"
                        class="sr-only"
                      />
                      <div class="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                      <div
                        :class="[
                          settings.payment.enableCreditCard ? 'bg-brand-500 left-[30px]' : 'bg-white left-1',
                          'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                        ]"
                      ></div>
                    </div>
                    <span class="ml-3 text-black dark:text-white">Enable Credit Card Payments</span>
                  </label>
                </div>

                <div class="mb-4 flex items-center">
                  <label class="flex cursor-pointer select-none items-center">
                    <div class="relative">
                      <input
                        type="checkbox"
                        v-model="settings.payment.enableBankTransfer"
                        class="sr-only"
                      />
                      <div class="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                      <div
                        :class="[
                          settings.payment.enableBankTransfer ? 'bg-brand-500 left-[30px]' : 'bg-white left-1',
                          'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                        ]"
                      ></div>
                    </div>
                    <span class="ml-3 text-black dark:text-white">Enable Bank Transfer</span>
                  </label>
                </div>

                <div class="mb-4 flex items-center">
                  <label class="flex cursor-pointer select-none items-center">
                    <div class="relative">
                      <input
                        type="checkbox"
                        v-model="settings.payment.enablePaypal"
                        class="sr-only"
                      />
                      <div class="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                      <div
                        :class="[
                          settings.payment.enablePaypal ? 'bg-brand-500 left-[30px]' : 'bg-white left-1',
                          'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                        ]"
                      ></div>
                    </div>
                    <span class="ml-3 text-black dark:text-white">Enable PayPal</span>
                  </label>
                </div>
              </div>

              <div class="mb-4.5" v-if="settings.payment.enableBankTransfer">
                <label class="mb-2.5 block text-black dark:text-white">
                  Bank Account Details
                </label>
                <textarea
                  v-model="settings.payment.bankAccountDetails"
                  rows="4"
                  placeholder="Enter bank account details"
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                ></textarea>
              </div>

              <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div class="w-full xl:w-1/2">
                  <label class="mb-2.5 block text-black dark:text-white">
                    Payment Due Days
                  </label>
                  <input
                    v-model="settings.payment.paymentDueDays"
                    type="number"
                    min="0"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                  />
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Number of days before check-in that full payment is due</p>
                </div>

                <div class="w-full xl:w-1/2">
                  <label class="mb-2.5 block text-black dark:text-white">
                    Late Payment Fee (%)
                  </label>
                  <input
                    v-model="settings.payment.latePaymentFeePercentage"
                    type="number"
                    min="0"
                    max="100"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="flex w-full justify-center rounded bg-brand-500 p-3 font-medium text-gray hover:bg-brand-600 disabled:opacity-50"
              >
                <span v-if="loading" class="mr-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Notification Settings -->
        <div v-if="activeTab === 'notification'" class="mb-6">
          <div class="rounded-sm border border-stroke bg-white p-6.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Notification Settings
            </h3>

            <form @submit.prevent="saveNotificationSettings">
              <div class="mb-4.5">
                <h4 class="mb-4 text-lg font-medium text-black dark:text-white">Notification Methods</h4>

                <div class="mb-4 flex items-center">
                  <label class="flex cursor-pointer select-none items-center">
                    <div class="relative">
                      <input
                        type="checkbox"
                        v-model="settings.notification.enableEmailNotifications"
                        class="sr-only"
                      />
                      <div class="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                      <div
                        :class="[
                          settings.notification.enableEmailNotifications ? 'bg-brand-500 left-[30px]' : 'bg-white left-1',
                          'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                        ]"
                      ></div>
                    </div>
                    <span class="ml-3 text-black dark:text-white">Enable Email Notifications</span>
                  </label>
                </div>

                <div class="mb-4 flex items-center">
                  <label class="flex cursor-pointer select-none items-center">
                    <div class="relative">
                      <input
                        type="checkbox"
                        v-model="settings.notification.enableSmsNotifications"
                        class="sr-only"
                      />
                      <div class="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                      <div
                        :class="[
                          settings.notification.enableSmsNotifications ? 'bg-brand-500 left-[30px]' : 'bg-white left-1',
                          'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                        ]"
                      ></div>
                    </div>
                    <span class="ml-3 text-black dark:text-white">Enable SMS Notifications</span>
                  </label>
                </div>
              </div>

              <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">
                  Notification Email
                </label>
                <input
                  v-model="settings.notification.notificationEmail"
                  type="email"
                  placeholder="Enter notification email"
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-brand-500 active:border-brand-500 disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-brand-500"
                />
              </div>

              <div class="mb-4.5">
                <h4 class="mb-4 text-lg font-medium text-black dark:text-white">Notification Types</h4>

                <div class="mb-4 flex items-center">
                  <label class="flex cursor-pointer select-none items-center">
                    <div class="relative">
                      <input
                        type="checkbox"
                        v-model="settings.notification.sendBookingConfirmation"
                        class="sr-only"
                      />
                      <div class="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                      <div
                        :class="[
                          settings.notification.sendBookingConfirmation ? 'bg-brand-500 left-[30px]' : 'bg-white left-1',
                          'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                        ]"
                      ></div>
                    </div>
                    <span class="ml-3 text-black dark:text-white">Send Booking Confirmation</span>
                  </label>
                </div>

                <div class="mb-4 flex items-center">
                  <label class="flex cursor-pointer select-none items-center">
                    <div class="relative">
                      <input
                        type="checkbox"
                        v-model="settings.notification.sendPaymentReminders"
                        class="sr-only"
                      />
                      <div class="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                      <div
                        :class="[
                          settings.notification.sendPaymentReminders ? 'bg-brand-500 left-[30px]' : 'bg-white left-1',
                          'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                        ]"
                      ></div>
                    </div>
                    <span class="ml-3 text-black dark:text-white">Send Payment Reminders</span>
                  </label>
                </div>

                <div class="mb-6 flex items-center">
                  <label class="flex cursor-pointer select-none items-center">
                    <div class="relative">
                      <input
                        type="checkbox"
                        v-model="settings.notification.sendCheckInReminders"
                        class="sr-only"
                      />
                      <div class="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                      <div
                        :class="[
                          settings.notification.sendCheckInReminders ? 'bg-brand-500 left-[30px]' : 'bg-white left-1',
                          'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                        ]"
                      ></div>
                    </div>
                    <span class="ml-3 text-black dark:text-white">Send Check-in Reminders</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="flex w-full justify-center rounded bg-brand-500 p-3 font-medium text-gray hover:bg-brand-600 disabled:opacity-50"
              >
                <span v-if="loading" class="mr-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
            </form>
          </div>
        </div>
      </template>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue';
import { settingsService } from '../services';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb
  },
  data() {
    return {
      loading: true,
      activeTab: 'general',
      tabs: [
        { id: 'general', name: 'General' },
        { id: 'booking', name: 'Booking' },
        { id: 'payment', name: 'Payment' },
        { id: 'notification', name: 'Notifications' }
      ],
      settings: {
        general: {
          companyName: '',
          companyEmail: '',
          companyPhone: '',
          companyAddress: '',
          timezone: 'UTC',
          bankName: '',
          bankAccountHolderName: '',
          bankAccountNumber: '',
          bankSwiftNumber: ''
        },
        booking: {
          checkInTime: '14:00',
          checkOutTime: '12:00',
          minBookingDays: 1,
          maxBookingDays: 30,
          advanceBookingDays: 365,
          allowPartialPayment: false,
          minDepositPercentage: 30
        },
        payment: {
          enableCreditCard: true,
          enableBankTransfer: true,
          enablePaypal: true,
          bankAccountDetails: '',
          paymentDueDays: 7,
          latePaymentFeePercentage: 5
        },
        notification: {
          enableEmailNotifications: true,
          enableSmsNotifications: false,
          notificationEmail: '',
          sendBookingConfirmation: true,
          sendPaymentReminders: true,
          sendCheckInReminders: true
        }
      }
    };
  },
  async created() {
    await this.loadSettings();
  },
  methods: {
    async loadSettings() {
      try {
        this.loading = true;
        const generalSettings = await settingsService.getGeneralSettings();
        this.settings.general = generalSettings;
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        this.loading = false;
      }
    },
    async saveGeneralSettings() {
      try {
        this.loading = true;
        await settingsService.updateGeneralSettings(this.settings.general);
        this.$toast?.success('General settings saved successfully') || alert('General settings saved successfully');
      } catch (error) {
        console.error('Error saving general settings:', error);
        this.$toast?.error('Failed to save general settings') || alert('Failed to save general settings');
      } finally {
        this.loading = false;
      }
    },
    async saveBookingSettings() {
      try {
        this.loading = true;
        // For now, we'll use a placeholder since booking settings API might not be implemented yet
        console.log('Booking settings:', this.settings.booking);
        this.$toast?.success('Booking settings saved successfully') || alert('Booking settings saved successfully');
      } catch (error) {
        console.error('Error saving booking settings:', error);
        this.$toast?.error('Failed to save booking settings') || alert('Failed to save booking settings');
      } finally {
        this.loading = false;
      }
    },
    async savePaymentSettings() {
      try {
        this.loading = true;
        // For now, we'll use a placeholder since payment settings API might not be implemented yet
        console.log('Payment settings:', this.settings.payment);
        this.$toast?.success('Payment settings saved successfully') || alert('Payment settings saved successfully');
      } catch (error) {
        console.error('Error saving payment settings:', error);
        this.$toast?.error('Failed to save payment settings') || alert('Failed to save payment settings');
      } finally {
        this.loading = false;
      }
    },
    async saveNotificationSettings() {
      try {
        this.loading = true;
        // For now, we'll use a placeholder since notification settings API might not be implemented yet
        console.log('Notification settings:', this.settings.notification);
        this.$toast?.success('Notification settings saved successfully') || alert('Notification settings saved successfully');
      } catch (error) {
        console.error('Error saving notification settings:', error);
        this.$toast?.error('Failed to save notification settings') || alert('Failed to save notification settings');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb :items="[{ text: 'Home', link: '/' }, { text: 'Settings' }]" />
    </div>

    <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          System Settings
        </h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600" @click="saveSettings">
            Save Changes
          </button>
        </div>
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
                  ? 'bg-primary text-white'
                  : 'bg-gray-2 text-black hover:bg-primary hover:text-white dark:bg-meta-4 dark:text-white dark:hover:bg-primary'
              ]"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </div>
        </div>

        <!-- General Settings -->
        <div v-if="activeTab === 'general'" class="mb-6">
          <div class="mb-5">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Company Name
            </label>
            <input
              v-model="settings.general.companyName"
              type="text"
              placeholder="Enter company name"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div class="mb-5">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Contact Email
            </label>
            <input
              v-model="settings.general.contactEmail"
              type="email"
              placeholder="Enter contact email"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div class="mb-5">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Contact Phone
            </label>
            <input
              v-model="settings.general.contactPhone"
              type="text"
              placeholder="Enter contact phone"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div class="mb-5">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Address
            </label>
            <textarea
              v-model="settings.general.address"
              rows="4"
              placeholder="Enter company address"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            ></textarea>
          </div>

          <div class="mb-5">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Currency
            </label>
            <select
              v-model="settings.general.currency"
              class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="IDR">IDR (Rp)</option>
            </select>
          </div>

          <div class="mb-5">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Time Zone
            </label>
            <select
              v-model="settings.general.timezone"
              class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
            >
              <option value="UTC">UTC</option>
              <option value="Asia/Jakarta">Asia/Jakarta (UTC+7)</option>
              <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
            </select>
          </div>
        </div>

        <!-- Booking Settings -->
        <div v-if="activeTab === 'booking'" class="mb-6">
          <div class="mb-5">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Check-in Time
            </label>
            <input
              v-model="settings.booking.checkInTime"
              type="time"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div class="mb-5">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Check-out Time
            </label>
            <input
              v-model="settings.booking.checkOutTime"
              type="time"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div class="mb-5">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Minimum Booking Days
            </label>
            <input
              v-model="settings.booking.minBookingDays"
              type="number"
              min="1"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div class="mb-5">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Maximum Booking Days
            </label>
            <input
              v-model="settings.booking.maxBookingDays"
              type="number"
              min="1"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div class="mb-5">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Advance Booking Days
            </label>
            <input
              v-model="settings.booking.advanceBookingDays"
              type="number"
              min="0"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <p class="mt-1 text-sm text-gray-500">Maximum days in advance a booking can be made</p>
          </div>

          <div class="mb-5 flex items-center">
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
                    settings.booking.allowPartialPayment ? 'bg-primary left-[30px]' : 'bg-white left-1',
                    'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                  ]"
                ></div>
              </div>
              <span class="ml-3 font-medium text-black dark:text-white">Allow Partial Payment</span>
            </label>
          </div>

          <div class="mb-5" v-if="settings.booking.allowPartialPayment">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Minimum Deposit Percentage
            </label>
            <input
              v-model="settings.booking.minDepositPercentage"
              type="number"
              min="0"
              max="100"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <p class="mt-1 text-sm text-gray-500">Percentage of total amount required as deposit</p>
          </div>
        </div>

        <!-- Payment Settings -->
        <div v-if="activeTab === 'payment'" class="mb-6">
          <div class="mb-5 flex items-center">
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
                    settings.payment.enableCreditCard ? 'bg-primary left-[30px]' : 'bg-white left-1',
                    'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                  ]"
                ></div>
              </div>
              <span class="ml-3 font-medium text-black dark:text-white">Enable Credit Card Payments</span>
            </label>
          </div>

          <div class="mb-5 flex items-center">
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
                    settings.payment.enableBankTransfer ? 'bg-primary left-[30px]' : 'bg-white left-1',
                    'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                  ]"
                ></div>
              </div>
              <span class="ml-3 font-medium text-black dark:text-white">Enable Bank Transfer</span>
            </label>
          </div>

          <div class="mb-5 flex items-center">
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
                    settings.payment.enablePaypal ? 'bg-primary left-[30px]' : 'bg-white left-1',
                    'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                  ]"
                ></div>
              </div>
              <span class="ml-3 font-medium text-black dark:text-white">Enable PayPal</span>
            </label>
          </div>

          <div class="mb-5" v-if="settings.payment.enableBankTransfer">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Bank Account Details
            </label>
            <textarea
              v-model="settings.payment.bankAccountDetails"
              rows="4"
              placeholder="Enter bank account details"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            ></textarea>
          </div>

          <div class="mb-5">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Payment Due Days
            </label>
            <input
              v-model="settings.payment.paymentDueDays"
              type="number"
              min="0"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <p class="mt-1 text-sm text-gray-500">Number of days before check-in that full payment is due</p>
          </div>

          <div class="mb-5">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Late Payment Fee (%)
            </label>
            <input
              v-model="settings.payment.latePaymentFeePercentage"
              type="number"
              min="0"
              max="100"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>

        <!-- Notification Settings -->
        <div v-if="activeTab === 'notification'" class="mb-6">
          <div class="mb-5 flex items-center">
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
                    settings.notification.enableEmailNotifications ? 'bg-primary left-[30px]' : 'bg-white left-1',
                    'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                  ]"
                ></div>
              </div>
              <span class="ml-3 font-medium text-black dark:text-white">Enable Email Notifications</span>
            </label>
          </div>

          <div class="mb-5 flex items-center">
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
                    settings.notification.enableSmsNotifications ? 'bg-primary left-[30px]' : 'bg-white left-1',
                    'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                  ]"
                ></div>
              </div>
              <span class="ml-3 font-medium text-black dark:text-white">Enable SMS Notifications</span>
            </label>
          </div>

          <div class="mb-5">
            <label class="mb-2.5 block font-medium text-black dark:text-white">
              Notification Email
            </label>
            <input
              v-model="settings.notification.notificationEmail"
              type="email"
              placeholder="Enter notification email"
              class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div class="mb-5 flex items-center">
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
                    settings.notification.sendBookingConfirmation ? 'bg-primary left-[30px]' : 'bg-white left-1',
                    'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                  ]"
                ></div>
              </div>
              <span class="ml-3 font-medium text-black dark:text-white">Send Booking Confirmation</span>
            </label>
          </div>

          <div class="mb-5 flex items-center">
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
                    settings.notification.sendPaymentReminders ? 'bg-primary left-[30px]' : 'bg-white left-1',
                    'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                  ]"
                ></div>
              </div>
              <span class="ml-3 font-medium text-black dark:text-white">Send Payment Reminders</span>
            </label>
          </div>

          <div class="mb-5 flex items-center">
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
                    settings.notification.sendCheckInReminders ? 'bg-primary left-[30px]' : 'bg-white left-1',
                    'absolute left-1 top-1 h-6 w-6 rounded-full transition'
                  ]"
                ></div>
              </div>
              <span class="ml-3 font-medium text-black dark:text-white">Send Check-in Reminders</span>
            </label>
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
          contactEmail: '',
          contactPhone: '',
          address: '',
          currency: 'USD',
          timezone: 'UTC'
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
        const settings = await settingsService.getSettings();
        this.settings = settings;
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        this.loading = false;
      }
    },
    async saveSettings() {
      try {
        this.loading = true;
        await settingsService.updateSettings(this.settings);
        alert('Settings saved successfully');
      } catch (error) {
        console.error('Error saving settings:', error);
        alert('Failed to save settings');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

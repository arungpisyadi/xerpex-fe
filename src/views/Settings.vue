<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb page-title="Settings" />
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

            <FormKit
              type="form"
              @submit="saveGeneralSettings"
              :actions="false"

            >
              <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div class="w-full xl:w-1/2">
                  <FormKit
                    type="text"
                    name="companyName"
                    label="Company Name"
                    placeholder="Enter company name"
                    v-model="settings.general.companyName"
                    validation="required"

                  />
                </div>

                <div class="w-full xl:w-1/2">
                  <FormKit
                    type="email"
                    name="companyEmail"
                    label="Company Email"
                    placeholder="Enter company email"
                    v-model="settings.general.companyEmail"
                    validation="required|email"

                  />
                </div>
              </div>

              <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div class="w-full xl:w-1/2">
                  <FormKit
                    type="text"
                    name="companyPhone"
                    label="Company Phone"
                    placeholder="Enter company phone"
                    v-model="settings.general.companyPhone"

                  />
                </div>

                <div class="w-full xl:w-1/2">
                  <FormKit
                    type="textarea"
                    name="companyAddress"
                    label="Company Address"
                    placeholder="Enter company address"
                    v-model="settings.general.companyAddress"

                    rows="4"
                  />
                </div>
              </div>

              <div class="mb-4.5">
                <h4 class="mb-4 text-lg font-medium text-black dark:text-white">Bank Account Information</h4>

                <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div class="w-full xl:w-1/2">
                    <FormKit
                      type="text"
                      name="bankName"
                      label="Bank Name"
                      placeholder="Enter bank name"
                      v-model="settings.general.bankName"

                    />
                  </div>

                  <div class="w-full xl:w-1/2">
                    <FormKit
                      type="text"
                      name="bankAccountHolderName"
                      label="Account Holder Name"
                      placeholder="Enter account holder name"
                      v-model="settings.general.bankAccountHolderName"

                    />
                  </div>
                </div>

                <div class="mb-6 flex flex-col gap-6 xl:flex-row">
                  <div class="w-full xl:w-1/2">
                    <FormKit
                      type="text"
                      name="bankAccountNumber"
                      label="Bank Account Number"
                      placeholder="Enter bank account number"
                      v-model="settings.general.bankAccountNumber"

                    />
                  </div>

                  <div class="w-full xl:w-1/2">
                    <FormKit
                      type="text"
                      name="bankSwiftNumber"
                      label="SWIFT Number"
                      placeholder="Enter SWIFT number"
                      v-model="settings.general.bankSwiftNumber"

                    />
                  </div>
                </div>
              </div>

              <FormKit
                v-if="canUpdateGeneral"
                type="submit"
                :disabled="loading"

              >
                <span v-if="loading" class="mr-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </FormKit>
            </FormKit>
          </div>
        </div>

        <!-- Booking Settings -->
        <div v-if="activeTab === 'booking'" class="mb-6">
          <div class="rounded-sm border border-stroke bg-white p-6.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Booking Settings
            </h3>

            <FormKit
              type="form"
              @submit="saveBookingSettings"

            >
              <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div class="w-full xl:w-1/2">
                  <FormKit
                    type="time"
                    name="checkInTime"
                    label="Check-in Time"
                    v-model="settings.booking.checkInTime"
                    validation="required"

                  />
                </div>

                <div class="w-full xl:w-1/2">
                  <FormKit
                    type="time"
                    name="checkOutTime"
                    label="Check-out Time"
                    v-model="settings.booking.checkOutTime"
                    validation="required"

                  />
                </div>
              </div>

              <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div class="w-full xl:w-1/2">
                  <FormKit
                    type="number"
                    name="minBookingDays"
                    label="Minimum Booking Days"
                    v-model="settings.booking.minBookingDays"
                    validation="required|min:1"
                    min="1"

                  />
                </div>

                <div class="w-full xl:w-1/2">
                  <FormKit
                    type="number"
                    name="maxBookingDays"
                    label="Maximum Booking Days"
                    v-model="settings.booking.maxBookingDays"
                    validation="required|min:1"
                    min="1"

                  />
                </div>
              </div>

              <div class="mb-4.5">
                <FormKit
                  type="number"
                  name="advanceBookingDays"
                  label="Advance Booking Days"
                  v-model="settings.booking.advanceBookingDays"
                  min="0"
                  help="Maximum days in advance a booking can be made"

                />
              </div>

              <div class="mb-4.5 flex items-center">
                <FormKit
                  type="checkbox"
                  name="allowPartialPayment"
                  label="Allow Partial Payment"
                  v-model="settings.booking.allowPartialPayment"

                  decorator-icon
                />
              </div>

              <FormKit
                v-if="settings.booking.allowPartialPayment"
                type="number"
                name="minDepositPercentage"
                label="Minimum Deposit Percentage"
                v-model="settings.booking.minDepositPercentage"
                min="0"
                max="100"
                help="Percentage of total amount required as deposit"

              />

              <FormKit
                v-if="canUpdateGeneral"
                type="submit"
                :disabled="loading"

              >
                <span v-if="loading" class="mr-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </FormKit>
            </FormKit>
          </div>
        </div>

        <!-- Payment Settings -->
        <div v-if="activeTab === 'payment'" class="mb-6">
          <div class="rounded-sm border border-stroke bg-white p-6.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Payment Settings
            </h3>

            <FormKit
              type="form"
              @submit="savePaymentSettings"

            >
              <div class="mb-4.5">
                <h4 class="mb-4 text-lg font-medium text-black dark:text-white">Payment Methods</h4>

                <div class="mb-4 flex items-center">
                  <FormKit
                    type="checkbox"
                    name="enableCreditCard"
                    label="Enable Credit Card Payments"
                    v-model="settings.payment.enableCreditCard"

                    decorator-icon
                  />
                </div>

                <div class="mb-4 flex items-center">
                  <FormKit
                    type="checkbox"
                    name="enableBankTransfer"
                    label="Enable Bank Transfer"
                    v-model="settings.payment.enableBankTransfer"

                    decorator-icon
                  />
                </div>

                <div class="mb-4 flex items-center">
                  <FormKit
                    type="checkbox"
                    name="enablePaypal"
                    label="Enable PayPal"
                    v-model="settings.payment.enablePaypal"

                    decorator-icon
                  />
                </div>
              </div>

              <FormKit
                v-if="settings.payment.enableBankTransfer"
                type="textarea"
                name="bankAccountDetails"
                label="Bank Account Details"
                placeholder="Enter bank account details"
                v-model="settings.payment.bankAccountDetails"
                rows="4"

              />

              <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div class="w-full xl:w-1/2">
                  <FormKit
                    type="number"
                    name="paymentDueDays"
                    label="Payment Due Days"
                    v-model="settings.payment.paymentDueDays"
                    min="0"
                    help="Number of days before check-in that full payment is due"

                  />
                </div>

                <div class="w-full xl:w-1/2">
                  <FormKit
                    type="number"
                    name="latePaymentFeePercentage"
                    label="Late Payment Fee (%)"
                    v-model="settings.payment.latePaymentFeePercentage"
                    min="0"
                    max="100"

                  />
                </div>
              </div>

              <FormKit
                v-if="canUpdateGeneral"
                type="submit"
                :disabled="loading"

              >
                <span v-if="loading" class="mr-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </FormKit>
            </FormKit>
          </div>
        </div>

        <!-- Notification Settings -->
        <div v-if="activeTab === 'notification'" class="mb-6">
          <div class="rounded-sm border border-stroke bg-white p-6.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 class="mb-6 text-xl font-semibold text-black dark:text-white">
              Notification Settings
            </h3>

            <FormKit
              type="form"
              @submit="saveNotificationSettings"

            >
              <div class="mb-4.5">
                <h4 class="mb-4 text-lg font-medium text-black dark:text-white">Notification Methods</h4>

                <div class="mb-4 flex items-center">
                  <FormKit
                    type="checkbox"
                    name="enableEmailNotifications"
                    label="Enable Email Notifications"
                    v-model="settings.notification.enableEmailNotifications"

                    decorator-icon
                  />
                </div>

                <div class="mb-4 flex items-center">
                  <FormKit
                    type="checkbox"
                    name="enableSmsNotifications"
                    label="Enable SMS Notifications"
                    v-model="settings.notification.enableSmsNotifications"

                    decorator-icon
                  />
                </div>
              </div>

              <div class="mb-4.5">
                <FormKit
                  type="email"
                  name="notificationEmail"
                  label="Notification Email"
                  placeholder="Enter notification email"
                  v-model="settings.notification.notificationEmail"

                />
              </div>

              <div class="mb-4.5">
                <h4 class="mb-4 text-lg font-medium text-black dark:text-white">Notification Types</h4>

                <div class="mb-4 flex items-center">
                  <FormKit
                    type="checkbox"
                    name="sendBookingConfirmation"
                    label="Send Booking Confirmation"
                    v-model="settings.notification.sendBookingConfirmation"

                    decorator-icon
                  />
                </div>

                <div class="mb-4 flex items-center">
                  <FormKit
                    type="checkbox"
                    name="sendPaymentReminders"
                    label="Send Payment Reminders"
                    v-model="settings.notification.sendPaymentReminders"

                    decorator-icon
                  />
                </div>

                <div class="mb-6 flex items-center">
                  <FormKit
                    type="checkbox"
                    name="sendCheckInReminders"
                    label="Send Check-in Reminders"
                    v-model="settings.notification.sendCheckInReminders"

                    decorator-icon
                  />
                </div>
              </div>

              <FormKit
                v-if="canUpdateGeneral"
                type="submit"
                :disabled="loading"

              >
                <span v-if="loading" class="mr-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </FormKit>
            </FormKit>
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
import { usePermissions } from '../composables/usePermissions';
import { SystemModule, PermissionAction } from '../types/permissions.types';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb
  },
  setup() {
    const permissions = usePermissions();

    return {
      permissions
    };
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
      if (!this.canUpdateGeneral) {
        this.$toast?.error('You do not have permission to update general settings') || alert('You do not have permission to update general settings');
        return;
      }

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
      if (!this.canUpdateGeneral) {
        this.$toast?.error('You do not have permission to update booking settings') || alert('You do not have permission to update booking settings');
        return;
      }

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
      if (!this.canUpdateGeneral) {
        this.$toast?.error('You do not have permission to update payment settings') || alert('You do not have permission to update payment settings');
        return;
      }

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
      if (!this.canUpdateGeneral) {
        this.$toast?.error('You do not have permission to update notification settings') || alert('You do not have permission to update notification settings');
        return;
      }

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

<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb page-title="Surveys" />
    </div>

    <div
      class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Surveys Management
        </h2>
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="relative">
            <input type="text" placeholder="Search surveys..." v-model="searchQuery"
              class="w-full rounded-md border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary" />
            <span class="absolute left-3 top-2.5 text-gray-500">
              <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14.0467 11.22L12.6667 9.80667C12.3699 9.5245 11.9955 9.33754 11.5916 9.26983C11.1876 9.20211 10.7727 9.25673 10.4 9.42667L9.80001 8.82667C10.5071 7.88194 10.8299 6.70445 10.7037 5.53122C10.5775 4.358 10.0115 3.27615 9.11963 2.50347C8.22779 1.73078 7.07536 1.32464 5.89712 1.36679C4.71887 1.40894 3.59838 1.89621 2.76399 2.73061C1.92959 3.565 1.44232 4.68549 1.40017 5.86374C1.35802 7.04198 1.76416 8.19441 2.53685 9.08625C3.30953 9.97809 4.39138 10.5441 5.5646 10.6703C6.73783 10.7964 7.91533 10.4736 8.86005 9.76667L9.46001 10.3667C9.29007 10.7393 9.23546 11.1542 9.30317 11.5582C9.37089 11.9622 9.55785 12.3366 9.84001 12.6333L11.2533 14.0467C11.3983 14.1924 11.5712 14.3072 11.7622 14.3837C11.9532 14.4602 12.1579 14.4967 12.3633 14.4908C12.5688 14.485 12.7713 14.4368 12.9581 14.3494C13.1448 14.262 13.3112 14.1371 13.4483 13.9833C13.5946 13.8393 13.7094 13.6664 13.7859 13.4754C13.8624 13.2844 13.8989 13.0797 13.8931 12.8743C13.8873 12.6688 13.8391 12.4663 13.7517 12.2795C13.6643 12.0928 13.5394 11.9264 13.3857 11.7893L14.0467 11.22Z"
                  fill="currentColor" />
              </svg>
            </span>
          </div>
          <div>
            <select v-model="statusFilter"
              class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="scheduled">Scheduled</option>
              <option value="visited">Visited</option>
              <option value="quoted">Quoted</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
            </select>
          </div>
          <div>
            <select v-model="priorityFilter"
              class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <button
            v-if="canCreate"
            class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600"
            @click="createNewSurvey">
            <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z"
                fill="white" />
            </svg>
            Add Survey
          </button>
        </div>
      </div>

      <div class="max-w-full overflow-x-auto">
        <data-table
          :show-whatsapp-button="true"
          :data="filteredSurveys"
          :columns="columns"
          :loading="loading"
          :show-add-button="false"
          :wa-phone-number="waPhoneNumber"
          @edit="canUpdate ? editSurvey : null"
          @delete="canDelete ? deleteSurveyConfirm : null"
          @view="viewSurvey"
          :show-edit="canUpdate"
          :show-delete="canDelete"
        />
      </div>
    </div>

    <!-- Create/Edit Survey Modal -->
    <div v-if="showModal" class="fixed inset-0 z-999999 flex items-center justify-center bg-black/70">
      <div
        class="w-full max-w-4xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:p-8 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-black dark:text-white">
            {{ isViewMode ? 'View Survey' : (isEditing ? 'Edit Survey' : 'Add New Survey') }}
          </h3>
          <button @click="closeModal" class="text-gray-500 hover:text-primary">
            <svg class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.16771 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632555 19.8731 0.964493 20 1.29619 20C1.62789 20 1.9596 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z"
                fill=""></path>
            </svg>
          </button>
        </div>

        <template v-if="isViewMode">
          <div class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h5 class="mb-3 font-medium text-black dark:text-white">Basic Information</h5>
                <div class="space-y-3">
                  <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Client Name:</span>
                    <p class="text-black dark:text-white">{{ surveyForm.client_name }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Email:</span>
                    <p class="text-black dark:text-white">{{ surveyForm.email }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Phone Number:</span>
                    <p class="text-black dark:text-white">{{ surveyForm.phone_number }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Estimated Paxes:</span>
                    <p class="text-black dark:text-white">{{ surveyForm.estimated_paxes }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Villa Types:</span>
                    <p class="text-black dark:text-white">{{ surveyForm.villa_types }}</p>
                  </div>
                </div>
              </div>

              <!-- Survey Details -->
              <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h5 class="mb-3 font-medium text-black dark:text-white">Survey Details</h5>
                <div class="space-y-3">
                  <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
                    <p class="text-black dark:text-white">{{ surveyForm.status }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Priority:</span>
                    <p class="text-black dark:text-white">{{ surveyForm.priority }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Sales Account:</span>
                    <p class="text-black dark:text-white">{{ surveyForm.sales_account_name }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Follow-up Date:</span>
                    <p class="text-black dark:text-white">{{ surveyForm.follow_up_date || 'N/A' }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Visiting Date:</span>
                    <p class="text-black dark:text-white">{{ surveyForm.visiting_date || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h5 class="mb-3 font-medium text-black dark:text-white">Notes</h5>
              <p class="text-gray-600 dark:text-gray-400">{{ surveyForm.notes || 'No notes' }}</p>
            </div>

            <!-- Timeline -->
            <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h5 class="mb-3 font-medium text-black dark:text-white">Timeline</h5>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Created:</span>
                  <p class="text-black dark:text-white">{{ formatDate(surveyForm.created_at) }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Last Updated:</span>
                  <p class="text-black dark:text-white">{{ formatDate(surveyForm.updated_at) }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button @click="closeModal" class="px-4 py-2 border border-stroke rounded text-black dark:text-white">
              Cancel
            </button>
            <button @click="sendWhatsApp" class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              <WhatsAppIcon class="w-4 h-4" />
              WhatsApp
            </button>
          </div>
        </template>

        <template v-else>
          <FormKit type="form" :actions="false" @submit="submitSurvey" >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Client Information -->
              <div class="flex flex-col space-y-8">
                <h4
                  class="text-lg font-medium text-black dark:text-white border-b border-stroke dark:border-strokedark pb-2">
                  Client Information
                </h4>

                <FormKit type="text" name="client_name" label="Client Name" placeholder="Enter client name"
                  v-model="surveyForm.client_name" validation="required"  />

                <FormKit type="email" name="email" label="Email" placeholder="Enter email address"
                  v-model="surveyForm.email" validation="email"  />

                <FormKit type="tel" name="phone_number" label="Phone Number" placeholder="Enter phone number"
                  v-model="surveyForm.phone_number"  />

                <FormKit type="number" name="estimated_paxes" label="Estimated Paxes"
                  placeholder="Enter estimated number of guests" v-model="surveyForm.estimated_paxes" min="0"  />

                <FormKit type="text" name="villa_types" label="Villa Types" placeholder="Enter preferred villa types"
                  v-model="surveyForm.villa_types"  />
              </div>

              <!-- Survey Details -->
              <div class="flex flex-col space-y-8">
                <h4
                  class="text-lg font-medium text-black dark:text-white border-b border-stroke dark:border-strokedark pb-2">
                  Survey Details
                </h4>

                <FormKit type="select" name="status" label="Status" v-model="surveyForm.status" validation="required"
                  :options="[
                    { label: 'New', value: 'new' },
                    { label: 'Contacted', value: 'contacted' },
                    { label: 'Scheduled', value: 'scheduled' },
                    { label: 'Visited', value: 'visited' },
                    { label: 'Quoted', value: 'quoted' },
                    { label: 'Closed Won', value: 'closed_won' },
                    { label: 'Closed Lost', value: 'closed_lost' }
                  ]"  />

                <FormKit type="select" name="priority" label="Priority" v-model="surveyForm.priority"
                  validation="required" :options="[
                    { label: 'Low', value: 'low' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'High', value: 'high' },
                    { label: 'Urgent', value: 'urgent' }
                  ]"  />

                <FormKit type="select" name="sales_account_id" label="Sales Account" v-model="surveyForm.sales_account_id"
                  validation="required" :options="[
                    { label: 'Select a sales account', value: '', attrs: { disabled: true } },
                    ...salesAccounts.map(account => ({ label: account.full_name, value: account.id }))
                  ]"  />

                <FormKit type="date" name="follow_up_date" label="Follow-up Date" v-model="surveyForm.follow_up_date"
                   />

                <FormKit type="date" name="visiting_date" label="Visiting Date" v-model="surveyForm.visiting_date"
                   />
              </div>
            </div>

            <FormKit type="textarea" name="notes" label="Notes" placeholder="Enter additional notes"
              v-model="surveyForm.notes" rows="4"  />

            <div class="flex justify-end gap-4 mt-6">
              <FormKit type="button" @click="closeModal" >
                Cancel
              </FormKit>
              <FormKit type="submit" :disabled="submitting" >
                {{ submitting ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
              </FormKit>
            </div>
          </FormKit>
        </template>
      </div>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue';
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue';
import DataTable from '../components/common/DataTable.vue';
import WhatsAppIcon from '../icons/WhatsAppIcon.vue';
import { surveyService } from '../services';
import { usePermissions } from '../composables/usePermissions';
import { SystemModule, PermissionAction } from '../types/permissions.types';

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
    DataTable,
    WhatsAppIcon
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
      submitting: false,
      searchQuery: '',
      statusFilter: '',
      priorityFilter: '',
      surveys: [],
      salesAccounts: [],
      showModal: false,
      isEditing: false,
      isViewMode: false,
      surveyForm: {
        client_name: '',
        email: '',
        phone_number: '',
        estimated_paxes: 0,
        villa_types: '',
        notes: '',
        status: 'new',
        priority: 'medium',
        follow_up_date: '',
        visiting_date: '',
        sales_account_id: '',
        sales_account_name: ''
      },
      columns: [
        { key: 'client_name', label: 'Client', span: 2 },
        { key: 'email', label: 'Email', span: 2 },
        { key: 'status', label: 'Status', span: 1, type: 'status' },
        { key: 'priority', label: 'Priority', span: 1, type: 'status' },
        { key: 'sales_account_name', label: 'Sales Account', span: 2 },
        { key: 'follow_up_date', label: 'Follow-up', span: 2, type: 'date' },
        { key: 'visiting_date', label: 'Visit Date', span: 2, type: 'date' }
      ],
      waPhoneNumber: import.meta.env.VITE_WA_SALES_ADMIN || ''
    };
  },
  computed: {
    canCreate() {
      return this.permissions.canPerform(SystemModule.SURVEYS, PermissionAction.CREATE);
    },
    canUpdate() {
      return this.permissions.canPerform(SystemModule.SURVEYS, PermissionAction.UPDATE);
    },
    canDelete() {
      return this.permissions.canPerform(SystemModule.SURVEYS, PermissionAction.DELETE);
    },
    filteredSurveys() {
      let filtered = [...this.surveys];

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(survey =>
          survey.client_name?.toLowerCase().includes(query) ||
          survey.email?.toLowerCase().includes(query) ||
          survey.phone_number?.toLowerCase().includes(query) ||
          survey.villa_types?.toLowerCase().includes(query) ||
          survey.sales_account_name?.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      if (this.statusFilter) {
        filtered = filtered.filter(survey => survey.status === this.statusFilter);
      }

      // Apply priority filter
      if (this.priorityFilter) {
        filtered = filtered.filter(survey => survey.priority === this.priorityFilter);
      }

      // Add sales account name for display
      return filtered.map(survey => ({
        ...survey,
        sales_account_name: survey.sales_account_name || survey.salesman?.full_name || 'Unassigned'
      }));
    }
  },
  async created() {
    console.log('Surveys.vue created, waPhoneNumber:', this.waPhoneNumber);
    await Promise.all([
      this.fetchSurveys(),
      this.fetchSalesAccounts()
    ]);
  },
  methods: {
    async fetchSurveys() {
      try {
        this.loading = true;
        const response = await surveyService.getSurveys();
        this.surveys = response || [];
      } catch (error) {
        console.error('Error fetching surveys:', error);
        // Show error notification
      } finally {
        this.loading = false;
      }
    },
    async fetchSalesAccounts() {
      try {
        // Use the new get-sales endpoint
        const response = await surveyService.getSales();
        this.salesAccounts = response || [];
      } catch (error) {
        console.error('Error fetching sales accounts:', error);
        // Show error notification
      }
    },
    createNewSurvey() {
      if (!this.canCreate) {
        console.error('You do not have permission to create surveys');
        return;
      }

      this.isEditing = false;
      this.surveyForm = {
        client_name: '',
        email: '',
        phone_number: '',
        estimated_paxes: 0,
        villa_types: '',
        notes: '',
        status: 'new',
        priority: 'medium',
        follow_up_date: '',
        visiting_date: '',
        sales_account_id: '',
        sales_account_name: ''
      };
      this.showModal = true;
    },
    editSurvey(survey) {
      if (!this.canUpdate) {
        console.error('You do not have permission to edit surveys');
        return;
      }

      this.isEditing = true;
      this.surveyForm = {
        id: survey.id,
        client_name: survey.client_name || '',
        email: survey.email || '',
        phone_number: survey.phone_number || '',
        estimated_paxes: survey.estimated_paxes || 0,
        villa_types: survey.villa_types || '',
        notes: survey.notes || '',
        status: survey.status || 'new',
        priority: survey.priority || 'medium',
        follow_up_date: survey.follow_up_date || '',
        visiting_date: survey.visiting_date || '',
        sales_account_id: survey.sales_account_id || survey.salesman?.id || survey.salesman_id || '',
        sales_account_name: survey.sales_account_name || survey.salesman?.full_name || 'Unassigned'
      };
      this.showModal = true;
    },
    viewSurvey(survey) {
      this.isViewMode = true;
      this.isEditing = false;
      this.surveyForm = {
        id: survey.id,
        client_name: survey.client_name || '',
        email: survey.email || '',
        phone_number: survey.phone_number || '',
        estimated_paxes: survey.estimated_paxes || 0,
        villa_types: survey.villa_types || '',
        notes: survey.notes || '',
        status: survey.status || 'new',
        priority: survey.priority || 'medium',
        follow_up_date: survey.follow_up_date || '',
        visiting_date: survey.visiting_date || '',
        sales_account_id: survey.sales_account_id || survey.salesman?.id || survey.salesman_id || '',
        sales_account_name: survey.sales_account_name || survey.salesman?.full_name || 'Unassigned'
      };
      this.showModal = true;
    },
    async submitSurvey() {
      try {
        this.submitting = true;

        // Prepare form data, convert empty email to null
        const formData = {
          ...this.surveyForm,
          email: this.surveyForm.email?.trim() || null
        };

        if (this.isEditing) {
          await surveyService.updateSurvey(formData.id, formData);
        } else {
          await surveyService.createSurvey(formData);
        }

        this.closeModal();
        await this.fetchSurveys();
        // Show success notification
      } catch (error) {
        console.error('Error saving survey:', error);
        // Show error notification
      } finally {
        this.submitting = false;
      }
    },
    deleteSurveyConfirm(survey) {
      if (!this.canDelete) {
        console.error('You do not have permission to delete surveys');
        return;
      }

      if (confirm(`Are you sure you want to delete the survey for ${survey.client_name}?`)) {
        this.deleteSurvey(survey.id);
      }
    },
    async deleteSurvey(id) {
      if (!this.canDelete) {
        console.error('You do not have permission to delete surveys');
        return;
      }

      try {
        await surveyService.deleteSurvey(id);
        await this.fetchSurveys();
        // Show success notification
      } catch (error) {
        console.error('Error deleting survey:', error);
        // Show error notification
      }
    },
    closeModal() {
      this.showModal = false;
      this.isEditing = false;
      this.isViewMode = false;
      this.surveyForm = {
        client_name: '',
        email: '',
        phone_number: '',
        estimated_paxes: 0,
        villa_types: '',
        notes: '',
        status: 'new',
        priority: 'medium',
        follow_up_date: '',
        visiting_date: '',
        sales_account_id: '',
        sales_account_name: ''
      };
    },
    sendWhatsApp() {
      const phone = import.meta.env.VITE_WA_SALES_ADMIN;
      const message = `Selamat Siang,\n\nBerikut data survey:\n\nClient Name: ${this.surveyForm.client_name}\nEmail: ${this.surveyForm.email}\nPhone: ${this.surveyForm.phone_number}\nEstimated Paxes: ${this.surveyForm.estimated_paxes}\nVilla Types: ${this.surveyForm.villa_types}\nNotes: ${this.surveyForm.notes}\nStatus: ${this.surveyForm.status}\nPriority: ${this.surveyForm.priority}\nFollow-up Date: ${this.surveyForm.follow_up_date}\nVisiting Date: ${this.surveyForm.visiting_date}`;
      const encodedMessage = encodeURIComponent(message);
      if (phone) {
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
      }
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
    }
  }
};
</script>

<template>
  <admin-layout>
    <div class="mb-6">
      <page-breadcrumb page-title="User Detail" />
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- User Profile Card -->
        <div class="md:col-span-1">
          <div
            class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <div class="flex flex-col items-center">
              <div
                class="mb-4 h-20 w-20 rounded-full bg-primary bg-opacity-10 flex items-center justify-center"
              >
                <span class="text-2xl font-bold text-primary">{{
                  getUserInitials(user.full_name)
                }}</span>
              </div>
              <h3 class="mb-1 text-xl font-semibold text-black dark:text-white">
                {{ user.full_name }}
              </h3>
              <p class="mb-4 text-sm text-gray-500">{{ user.role }}</p>
              <div class="w-full border-t border-stroke pt-4 dark:border-strokedark">
                <div class="mb-3 flex items-center">
                  <span class="mr-2 text-gray-500">
                    <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18">
                      <path
                        d="M16.1999 2.7C15.4999 1.9 14.5999 1.5 13.5999 1.5H4.3999C3.3999 1.5 2.4999 1.9 1.7999 2.7C0.9999 3.5 0.5999 4.4 0.5999 5.4V12.6C0.5999 13.6 0.9999 14.5 1.7999 15.3C2.5999 16.1 3.4999 16.5 4.3999 16.5H13.5999C14.5999 16.5 15.4999 16.1 16.2999 15.3C17.0999 14.5 17.3999 13.6 17.3999 12.6V5.4C17.3999 4.4 16.9999 3.5 16.1999 2.7ZM15.7999 12.6C15.7999 13.2 15.5999 13.7 15.1999 14.1C14.7999 14.5 14.2999 14.7 13.6999 14.7H4.3999C3.7999 14.7 3.2999 14.5 2.8999 14.1C2.4999 13.7 2.2999 13.2 2.2999 12.6V5.4C2.2999 4.8 2.4999 4.3 2.8999 3.9C3.2999 3.5 3.7999 3.3 4.3999 3.3H13.5999C14.1999 3.3 14.6999 3.5 15.0999 3.9C15.4999 4.3 15.6999 4.8 15.6999 5.4V12.6H15.7999Z"
                      />
                      <path
                        d="M13.6001 5.39995C13.3001 5.39995 13.1001 5.19995 13.1001 4.89995V2.99995C13.1001 2.69995 13.3001 2.49995 13.6001 2.49995C13.9001 2.49995 14.1001 2.69995 14.1001 2.99995V4.89995C14.1001 5.19995 13.9001 5.39995 13.6001 5.39995Z"
                      />
                      <path
                        d="M4.40006 5.39995C4.10006 5.39995 3.90006 5.19995 3.90006 4.89995V2.99995C3.90006 2.69995 4.10006 2.49995 4.40006 2.49995C4.70006 2.49995 4.90006 2.69995 4.90006 2.99995V4.89995C4.90006 5.19995 4.70006 5.39995 4.40006 5.39995Z"
                      />
                      <path
                        d="M9.00006 10.8999C8.70006 10.8999 8.40006 10.7999 8.20006 10.5999L6.70006 9.0999C6.40006 8.7999 6.40006 8.3999 6.70006 8.0999C7.00006 7.7999 7.40006 7.7999 7.70006 8.0999L8.90006 9.2999L10.2001 7.8999C10.5001 7.5999 10.9001 7.5999 11.2001 7.8999C11.5001 8.1999 11.5001 8.5999 11.2001 8.8999L9.70006 10.4999C9.60006 10.7999 9.30006 10.8999 9.00006 10.8999Z"
                      />
                    </svg>
                  </span>
                  <span class="text-sm text-black dark:text-white"
                    >Username: {{ user.username }}</span
                  >
                </div>
                <div class="mb-3 flex items-center">
                  <span class="mr-2 text-gray-500">
                    <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18">
                      <path
                        d="M15.3001 7.79995C15.1001 7.79995 14.8001 7.69995 14.7001 7.39995C14.1001 6.19995 13.1001 5.19995 11.9001 4.59995C11.6001 4.39995 11.5001 4.09995 11.7001 3.79995C11.9001 3.49995 12.2001 3.39995 12.5001 3.59995C13.9001 4.39995 15.0001 5.49995 15.8001 6.99995C16.0001 7.29995 15.9001 7.69995 15.6001 7.89995C15.5001 7.79995 15.4001 7.79995 15.3001 7.79995Z"
                      />
                      <path
                        d="M2.69995 7.79995C2.59995 7.79995 2.49995 7.79995 2.39995 7.69995C2.09995 7.59995 1.99995 7.19995 2.19995 6.89995C2.99995 5.49995 4.09995 4.29995 5.49995 3.59995C5.79995 3.39995 6.19995 3.49995 6.29995 3.79995C6.49995 4.09995 6.39995 4.49995 6.09995 4.59995C4.89995 5.19995 3.89995 6.19995 3.29995 7.39995C3.09995 7.69995 2.89995 7.79995 2.69995 7.79995Z"
                      />
                      <path
                        d="M9.00001 16.3C7.90001 16.3 6.80001 16.2 5.80001 15.9C5.50001 15.8 5.30001 15.5 5.40001 15.2C5.50001 14.9 5.80001 14.7 6.10001 14.8C8.80001 15.5 11.9 15.2 14.3 13.9C14.6 13.7 15 13.8 15.2 14.1C15.4 14.4 15.3 14.8 15 15C13.2 15.9 11.1 16.3 9.00001 16.3Z"
                      />
                      <path
                        d="M9.00001 16.3C6.90001 16.3 4.80001 15.9 3.00001 15C2.70001 14.9 2.60001 14.4 2.80001 14.1C3.00001 13.8 3.40001 13.7 3.70001 13.9C6.10001 15.2 9.20001 15.5 11.9 14.8C12.2 14.7 12.5 14.9 12.6 15.2C12.7 15.5 12.5 15.8 12.2 15.9C11.2 16.2 10.1 16.3 9.00001 16.3Z"
                      />
                      <path
                        d="M9.00002 16.3C8.70002 16.3 8.50002 16.1 8.50002 15.8V13.8C8.50002 13.5 8.70002 13.3 9.00002 13.3C9.30002 13.3 9.50002 13.5 9.50002 13.8V15.8C9.50002 16.1 9.30002 16.3 9.00002 16.3Z"
                      />
                      <path
                        d="M9.00002 9.30005C7.40002 9.30005 6.10002 8.00005 6.10002 6.40005C6.10002 4.80005 7.40002 3.50005 9.00002 3.50005C10.6 3.50005 11.9 4.80005 11.9 6.40005C11.9 8.00005 10.6 9.30005 9.00002 9.30005ZM9.00002 4.40005C7.90002 4.40005 7.00002 5.30005 7.00002 6.40005C7.00002 7.50005 7.90002 8.40005 9.00002 8.40005C10.1 8.40005 11 7.50005 11 6.40005C11 5.30005 10.1 4.40005 9.00002 4.40005Z"
                      />
                    </svg>
                  </span>
                  <span class="text-sm text-black dark:text-white">Email: {{ user.email }}</span>
                </div>
                <div class="flex items-center">
                  <span class="mr-2 text-gray-500">
                    <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18">
                      <path
                        d="M9.00001 16.5C8.70001 16.5 8.50001 16.3 8.50001 16V2C8.50001 1.7 8.70001 1.5 9.00001 1.5C9.30001 1.5 9.50001 1.7 9.50001 2V16C9.50001 16.3 9.30001 16.5 9.00001 16.5Z"
                      />
                      <path
                        d="M12.5 12.9C12.4 12.9 12.3 12.9 12.2 12.8L9.00001 10.8L5.80001 12.8C5.50001 13 5.10001 12.9 5.00001 12.6C4.80001 12.3 4.90001 11.9 5.20001 11.8L8.70001 9.60001C8.90001 9.50001 9.10001 9.50001 9.30001 9.60001L12.8 11.8C13.1 12 13.2 12.3 13 12.6C12.9 12.8 12.7 12.9 12.5 12.9Z"
                      />
                    </svg>
                  </span>
                  <span class="text-sm text-black dark:text-white"
                    >Created: {{ formatDate(user.created_at) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Activity -->
        <div class="md:col-span-2">
          <div
            class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">User Activity</h4>

            <div v-if="activities.length === 0" class="text-center py-8">
              <p class="text-gray-500 dark:text-gray-400">No activity found for this user.</p>
            </div>

            <div v-else class="flex flex-col">
              <div
                v-for="(activity, index) in activities"
                :key="index"
                class="mb-4 border-b border-stroke pb-4 dark:border-strokedark last:mb-0 last:border-0 last:pb-0"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-primary bg-opacity-10"
                  >
                    <span class="text-primary">
                      <svg class="fill-current" width="16" height="16" viewBox="0 0 16 16">
                        <path
                          d="M8.00001 14.6667C7.73335 14.6667 7.46668 14.6 7.26668 14.4C6.80001 14 6.33335 13.6 5.93335 13.2667C4.46668 12 3.26668 10.4667 2.40001 8.73333C1.73335 7.33333 1.33335 5.86667 1.33335 4.33333C1.33335 3.2 1.73335 2.13333 2.46668 1.33333C3.20001 0.533333 4.20001 0.133333 5.33335 0.133333C6.13335 0.133333 6.93335 0.333333 7.60001 0.733333C7.80001 0.866667 8.00001 1.06667 8.20001 1.2C8.40001 1.06667 8.60001 0.866667 8.80001 0.733333C9.46668 0.333333 10.2667 0.133333 11.0667 0.133333C12.2 0.133333 13.2 0.533333 13.9334 1.33333C14.6667 2.13333 15.0667 3.2 15.0667 4.33333C15.0667 5.86667 14.6667 7.33333 14 8.73333C13.1334 10.4667 11.9334 12 10.4667 13.2667C10.0667 13.6 9.60001 14 9.13335 14.4C8.93335 14.6 8.66668 14.6667 8.40001 14.6667H8.00001ZM5.33335 1.33333C4.53335 1.33333 3.80001 1.6 3.26668 2.2C2.73335 2.8 2.46668 3.53333 2.46668 4.33333C2.46668 5.66667 2.80001 6.93333 3.40001 8.13333C4.20001 9.73333 5.33335 11.0667 6.66668 12.2C7.06668 12.5333 7.46668 12.8667 7.86668 13.2C7.93335 13.2667 8.06668 13.2667 8.13335 13.2C8.53335 12.8667 8.93335 12.5333 9.33335 12.2C10.6667 11.0667 11.8 9.73333 12.6 8.13333C13.2 6.93333 13.5334 5.66667 13.5334 4.33333C13.5334 3.53333 13.2667 2.8 12.7334 2.2C12.2 1.6 11.4667 1.33333 10.6667 1.33333C10.0667 1.33333 9.46668 1.53333 9.00001 1.86667C8.66668 2.13333 8.40001 2.4 8.20001 2.73333C8.06668 2.93333 7.86668 3.06667 7.66668 3.06667C7.46668 3.06667 7.26668 2.93333 7.13335 2.73333C6.93335 2.4 6.66668 2.13333 6.33335 1.86667C5.86668 1.53333 5.26668 1.33333 4.66668 1.33333H5.33335Z"
                        />
                      </svg>
                    </span>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium text-black dark:text-white">
                      {{ activity.action }}
                    </h5>
                    <p class="text-xs text-gray-500">{{ formatDate(activity.timestamp) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </admin-layout>
</template>

<script>
import AdminLayout from '../components/layout/AdminLayout.vue'
import PageBreadcrumb from '../components/common/PageBreadcrumb.vue'
import { userService } from '../services'

export default {
  components: {
    AdminLayout,
    PageBreadcrumb,
  },
  data() {
    return {
      loading: true,
      user: {},
      activities: [],
    }
  },
  async created() {
    await this.fetchUserData()
  },
  methods: {
    async fetchUserData() {
      try {
        const userId = this.$route.params.id

        // Fetch user data
        this.user = await userService.getUserById(userId)

        // Fetch user activities
        const activitiesResponse = await userService.getUserActivities(userId)
        this.activities = activitiesResponse.items || []
      } catch (error) {
        console.error('Error fetching user data:', error)
        // Show error notification
      } finally {
        this.loading = false
      }
    },
    getUserInitials(name) {
      if (!name) return ''

      return name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },
    formatDate(dateString) {
      if (!dateString) return ''

      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },
}
</script>

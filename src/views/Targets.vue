<template>
    <admin-layout>
        <!-- Notification -->
        <div v-if="notification.show" class="fixed top-4 right-4 z-999999 max-w-sm">
            <div
                :class="[
                    'rounded-lg border p-4 shadow-lg',
                    notification.type === 'success'
                        ? 'border-success bg-success/10 text-success'
                        : 'border-danger bg-red-500/10 text-danger',
                ]"
            >
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <svg
                            v-if="notification.type === 'success'"
                            class="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <svg
                            v-else
                            class="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm font-medium">{{ notification.message }}</p>
                    </div>
                    <div class="ml-auto pl-3">
                        <button
                            @click="notification.show = false"
                            class="inline-flex rounded-md p-1.5 hover:bg-black/5"
                        >
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="mb-6">
            <page-breadcrumb page-title="Targets" />
        </div>

        <div
            class="bg-white px-2 pt-2 pb-0.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4 xl:pb-0"
        >
            <div class="mb-6">
                <h2 class="text-title-md2 font-bold text-black dark:text-white">
                    Targets Management
                </h2>
            </div>

            <div v-if="loading" class="flex justify-center items-center py-20">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
                ></div>
            </div>

            <template v-else>
                <!-- Sales Users Targets -->
                <div class="space-y-6">
                    <div
                        v-for="salesUser in salesUsers"
                        :key="salesUser.id"
                        class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
                    >
                        <!-- Accordion Header -->
                        <div
                            class="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-meta-4"
                            @click="toggleAccordion(salesUser.id)"
                        >
                            <div class="flex items-center">
                                <div
                                    class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3"
                                >
                                    <span class="text-sm font-medium text-primary">{{
                                        salesUser.full_name?.charAt(0)?.toUpperCase()
                                    }}</span>
                                </div>
                                <div>
                                    <h3
                                        class="text-lg font-semibold text-black dark:text-white"
                                    >
                                        {{ salesUser.full_name }}
                                    </h3>
                                    <p class="text-sm text-gray-500">
                                        {{ salesUser.email }}
                                    </p>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <svg
                                    :class="[
                                        'h-5 w-5 transition-transform',
                                        expandedUsers[salesUser.id] ? 'rotate-180' : '',
                                    ]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </div>
                        </div>

                        <!-- Accordion Content -->
                        <div
                            v-if="expandedUsers[salesUser.id]"
                            class="border-t border-stroke dark:border-strokedark"
                        >
                            <div class="p-6">
                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    <div
                                        v-for="month in months"
                                        :key="month.value"
                                        class="rounded-sm border border-stroke bg-gray-50 p-4 dark:border-strokedark dark:bg-meta-4"
                                    >
                                        <h4
                                            class="text-md font-medium text-black dark:text-white mb-4"
                                        >
                                            {{ month.label }}
                                        </h4>
                                        <FormKit
                                            type="form"
                                            :actions="false"
                                            @submit="
                                                saveTarget(salesUser.id, month.value)
                                            "
                                            :key="`form-${salesUser.id}-${month.value}`"
                                            :ref="`form-${salesUser.id}-${month.value}`"
                                        >
                                            <FormKit
                                                type="number"
                                                :name="`target-${month.value}`"
                                                label="Target Amount"
                                                v-model="
                                                    targets[salesUser.id][month.value]
                                                "
                                                placeholder="0.00"
                                                min="0"
                                                step="1000"
                                                validation="required|min:0"
                                                :validation-messages="{
                                                    required: 'Target amount is required',
                                                    min:
                                                        'Target amount must be greater than 0',
                                                }"
                                            />
                                            <div class="flex justify-end mt-4">
                                                <FormKit
                                                    v-if="canUpdateTargets"
                                                    type="submit"
                                                    :disabled="saving[salesUser.id]"
                                                >
                                                    Save
                                                </FormKit>
                                            </div>
                                        </FormKit>
                                    </div>
                                </div>
                                <div class="flex justify-end mt-6">
                                    <button
                                        v-if="canUpdateTargets"
                                        @click="saveAllTargets(salesUser.id)"
                                        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                                        :disabled="saving[salesUser.id]"
                                    >
                                        {{
                                            saving[salesUser.id]
                                                ? "Saving..."
                                                : "Save All Targets"
                                        }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="salesUsers.length === 0" class="text-center py-10">
                    <p class="text-gray-500">No sales users found</p>
                </div>
            </template>
        </div>
    </admin-layout>
</template>

<script>
import AdminLayout from "../components/layout/AdminLayout.vue";
import PageBreadcrumb from "../components/common/PageBreadcrumb.vue";
import { TargetsService } from "../services/targets.service";
import { usePermissions } from "../composables/usePermissions";
import { SystemModule, PermissionAction } from "../types/permissions.types";

export default {
    components: {
        AdminLayout,
        PageBreadcrumb,
    },
    setup() {
        const permissions = usePermissions();

        return {
            permissions,
        };
    },
    data() {
        return {
            loading: false,
            salesUsers: [],
            targets: {},
            expandedUsers: {},
            saving: {},
            notification: {
                show: false,
                type: "",
                message: "",
            },
            months: [
                { value: 1, label: "January" },
                { value: 2, label: "February" },
                { value: 3, label: "March" },
                { value: 4, label: "April" },
                { value: 5, label: "May" },
                { value: 6, label: "June" },
                { value: 7, label: "July" },
                { value: 8, label: "August" },
                { value: 9, label: "September" },
                { value: 10, label: "October" },
                { value: 11, label: "November" },
                { value: 12, label: "December" },
            ],
        };
    },
    computed: {
        canUpdateTargets() {
            return this.permissions.canPerform(
                SystemModule.SETTINGS_TARGETS,
                PermissionAction.UPDATE
            );
        },
    },
    async created() {
        await this.loadData();
    },
    methods: {
        async loadData() {
            try {
                this.loading = true;

                // Step 1: Get sales users
                const salesUsers = await TargetsService.getSalesUsers();
                this.salesUsers = salesUsers;

                // Initialize targets and expanded state
                this.targets = {};
                this.expandedUsers = {};
                this.saving = {};

                salesUsers.forEach((user) => {
                    this.targets[user.id] = {};
                    this.expandedUsers[user.id] = false;
                    this.saving[user.id] = false;

                    // Initialize all months with empty values
                    this.months.forEach((month) => {
                        this.targets[user.id][month.value] = "";
                    });
                });

                // Step 2: Get existing targets
                const existingTargets = await TargetsService.getAllTargets();

                if (existingTargets && existingTargets.length > 0) {
                    // Step 3: Distribute targets based on sales id
                    this.distributeTargets(existingTargets);
                }
            } catch (error) {
                console.error("Error loading data:", error);
                this.showNotification("error", "Failed to load targets data");
            } finally {
                this.loading = false;
            }
        },
        distributeTargets(targets) {
            targets.forEach((target) => {
                // Validate month value
                if (target.month < 1 || target.month > 12) return;

                if (this.targets[target.user_id]) {
                    this.targets[target.user_id][target.month] =
                        target.target_amount || "";
                }
            });
        },
        toggleAccordion(userId) {
            this.expandedUsers[userId] = !this.expandedUsers[userId];
        },
        async saveTarget(userId, month) {
            if (!this.canUpdateTargets) {
                this.showNotification(
                    "error",
                    "You do not have permission to update targets"
                );
                return;
            }

            try {
                // Validate month value
                if (month < 1 || month > 12) {
                    this.showNotification("error", "Invalid month value");
                    return;
                }

                const targetAmount = this.targets[userId][month];
                if (!targetAmount || targetAmount <= 0) {
                    this.showNotification("error", "Please enter a valid target amount");
                    return;
                }

                const targetData = {
                    user_id: userId,
                    month: month,
                    target_amount: parseFloat(targetAmount),
                    year: new Date().getFullYear(),
                };

                // Check if target exists for update or create
                const existingTargets = await TargetsService.getAllTargets();
                const existingTarget = existingTargets.find(
                    (t) => t.user_id === userId && t.month === month
                );

                if (existingTarget) {
                    await TargetsService.updateTarget(existingTarget.id, targetData);
                } else {
                    await TargetsService.createTarget(targetData);
                }

                this.showNotification("success", "Target saved successfully");
            } catch (error) {
                console.error("Error saving target:", error);
                this.showNotification("error", "Failed to save target");
            }
        },
        async saveAllTargets(userId) {
            if (!this.canUpdateTargets) {
                this.showNotification(
                    "error",
                    "You do not have permission to update targets"
                );
                return;
            }

            try {
                this.saving[userId] = true;
                const submitPromises = [];

                for (const month of this.months) {
                    const formRef = this.$refs[`form-${userId}-${month.value}`];
                    if (formRef) {
                        submitPromises.push(formRef.submit());
                    }
                }

                await Promise.all(submitPromises);
                this.showNotification("success", "All targets saved successfully");
            } catch (error) {
                console.error("Error saving all targets:", error);
                this.showNotification("error", "Failed to save some targets");
            } finally {
                this.saving[userId] = false;
            }
        },
        showNotification(type, message) {
            this.notification = {
                show: true,
                type,
                message,
            };

            // Auto hide after 5 seconds
            setTimeout(() => {
                this.notification.show = false;
            }, 5000);
        },
    },
};
</script>

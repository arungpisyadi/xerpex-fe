<template>
  <aside
    :class="[
      'fixed mt-16 lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200 flex flex-col',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div class="py-8 hidden md:flex justify-start flex-shrink-0">
      <router-link to="/" class="flex items-cente block">
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="dark:hidden"
          src="/images/logo/xerpex-logo.svg"
          alt="Xerpex"
          width="150"
          height="40"
        />
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="hidden dark:block"
          src="/images/logo/xerpex-logo-dark.svg"
          alt="Xerpex"
          width="150"
          height="40"
        />
        <img v-else src="/images/logo/xerpex-icon.svg" alt="Xerpex" width="32" height="32" />
        <span class="text-3xl ml-2">XerpexSys</span>
      </router-link>
      <span class="block text-sm w-full -mt-4">Kebunsu</span>
    </div>
    <div class="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear no-scrollbar min-h-0">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2 class="mb-4 text-xs uppercase flex leading-[20px] text-gray-400 justify-start">
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <!-- Section divider -->
                <div v-if="item.isSectionDivider" class="pt-2 pb-1">
                  <div class="border-t border-gray-200 dark:border-gray-700"></div>
                  <div
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="text-[10px] uppercase text-gray-400 mt-2 px-2 tracking-wider"
                  >
                    {{ item.sectionName }}
                  </div>
                </div>

                <!-- Regular menu item -->
                <router-link
                  v-else
                  :to="item.path"
                  :class="[
                    'menu-item group justify-start',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{
                    item.name
                  }}</span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  DocsIcon,
  HorizontalDots,
  HomeIcon,
  SettingsIcon,
  SurveyIcon,
  PackageIcon,
  BarChartIcon,
  UserGroupIcon,
  DollarBillIcon,
  PieChartIcon,
} from '../../icons'
import { useSidebar } from '@/composables/useSidebar'
import { usePermissions } from '@/composables/usePermissions'
import { SystemModule, PermissionAction } from '@/types/permissions.types'

const route = useRoute()

const { isExpanded, isMobileOpen, isHovered } = useSidebar()

import authService from '@/services/auth.service'
const isAdmin = computed(() => authService.isAdmin())

// Use permissions composable
const { canPerform, forceRefreshPermissions, permissionContext } = usePermissions()

// Ensure permissions are refreshed on mount and auth state changes
onMounted(() => {
  forceRefreshPermissions()
})

watch(
  () => permissionContext.isAuthenticated,
  (newAuth, oldAuth) => {
    if (newAuth !== oldAuth) {
      forceRefreshPermissions()
    }
  },
)

// Menu item to SystemModule mapping
const menuModuleMap = {
  Users: SystemModule.USER,
  Villas: SystemModule.VILLAS,
  Packages: SystemModule.PACKAGES,
  Bookings: SystemModule.BOOKINGS,
  Surveys: SystemModule.SURVEYS,
  Customers: SystemModule.CUSTOMERS,
  Quotations: SystemModule.QUOTES,
  Invoices: SystemModule.INVOICES,
  Payments: SystemModule.PAYMENTS,
  General: SystemModule.SETTINGS_GENERAL,
  Targets: SystemModule.SETTINGS_TARGETS,
}

// XerpeX ERP navigation structure with permission-based filtering
const menuGroups = computed(() => {
  const flatItems = []

  // Dashboard
  flatItems.push({
    icon: GridIcon,
    name: 'Dashboard',
    path: '/',
  })

  // Users
  if (canPerform(SystemModule.USER, PermissionAction.VIEW)) {
    flatItems.push({
      icon: UserCircleIcon,
      name: 'Users',
      path: '/users',
      module: SystemModule.USER,
    })
  }

  // Villas
  if (canPerform(SystemModule.VILLAS, PermissionAction.VIEW)) {
    flatItems.push({
      icon: HomeIcon,
      name: 'Villas',
      path: '/villas',
      module: SystemModule.VILLAS,
    })
  }

  // Packages
  if (canPerform(SystemModule.PACKAGES, PermissionAction.VIEW)) {
    flatItems.push({
      icon: PackageIcon,
      name: 'Packages',
      path: '/packages',
      module: SystemModule.PACKAGES,
    })
  }

  // Surveys
  if (canPerform(SystemModule.SURVEYS, PermissionAction.VIEW)) {
    flatItems.push({
      icon: SurveyIcon,
      name: 'Surveys',
      path: '/surveys',
      module: SystemModule.SURVEYS,
    })
  }

  // Revenues section - check if any revenue items are visible
  const revenueItems = [
    { name: 'Customers', path: '/customers', module: SystemModule.CUSTOMERS, icon: UserGroupIcon },
    { name: 'Quotations', path: '/quotes', module: SystemModule.QUOTES, icon: DocsIcon },
    { name: 'Invoices', path: '/invoices', module: SystemModule.INVOICES, icon: DocsIcon },
    { name: 'Payments', path: '/payments', module: SystemModule.PAYMENTS, icon: DollarBillIcon },
    { name: 'Bookings', path: '/bookings', module: SystemModule.BOOKINGS, icon: CalenderIcon },
  ].filter((item) => canPerform(item.module, PermissionAction.VIEW))

  if (revenueItems.length > 0) {
    // Add section divider
    flatItems.push({
      isSectionDivider: true,
      sectionName: 'Revenues',
    })

    // Add revenue items
    revenueItems.forEach((item) => {
      flatItems.push(item)
    })
  }

  // Reports section - check if any reports items are visible
  const reportsItems = [
    {
      name: 'Sales Report',
      path: '/reports/sales',
      module: SystemModule.REPORTS_SALES,
      icon: PieChartIcon,
    },
  ].filter((item) => canPerform(item.module, PermissionAction.VIEW))

  if (reportsItems.length > 0) {
    // Add section divider
    flatItems.push({
      isSectionDivider: true,
      sectionName: 'Reports',
    })

    // Add reports items
    reportsItems.forEach((item) => {
      flatItems.push(item)
    })
  }

  // Settings section - check if any settings items are visible
  const settingsItems = [
    {
      name: 'General',
      path: '/settings',
      module: SystemModule.SETTINGS_GENERAL,
      icon: SettingsIcon,
    },
    {
      name: 'Targets',
      path: '/targets',
      module: SystemModule.SETTINGS_TARGETS,
      icon: BarChartIcon,
    },
  ].filter((item) => canPerform(item.module, PermissionAction.VIEW))

  if (settingsItems.length > 0) {
    // Add section divider
    flatItems.push({
      isSectionDivider: true,
      sectionName: 'Settings',
    })

    // Add settings items
    settingsItems.forEach((item) => {
      flatItems.push(item)
    })
  }

  return [
    {
      title: 'Main',
      items: flatItems,
    },
  ]
})

const isActive = (path) => route.path === path
</script>

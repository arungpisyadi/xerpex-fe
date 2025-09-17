<template>
  <aside :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]" @mouseenter="!isExpanded && (isHovered = true)" @mouseleave="isHovered = false">
    <div class="py-8 flex justify-start">
      <router-link to="/" class="flex items-cente block">
        <img v-if="isExpanded || isHovered || isMobileOpen" class="dark:hidden" src="/images/logo/xerpex-logo.svg"
          alt="Xerpex" width="150" height="40" />
        <img v-if="isExpanded || isHovered || isMobileOpen" class="hidden dark:block"
          src="/images/logo/xerpex-logo-dark.svg" alt="Xerpex" width="150" height="40" />
        <img v-else src="/images/logo/xerpex-icon.svg" alt="Xerpex" width="32" height="32" />
        <span class="text-3xl ml-2">XerpexSys</span>
      </router-link>
      <span class="block text-sm w-full -mt-4">Kebunsu</span>
    </div>
    <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
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
                <a v-if="item.subItems" href="#" @click.prevent="toggleSubmenu(groupIndex, index)" :class="[
                    'menu-item group w-full justify-start',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                  ]">
                  <span :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]">
                    <component :is="item.icon" />
                  </span>
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{ item.name }}</span>
                  <ChevronDownIcon v-if="isExpanded || isHovered || isMobileOpen" :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(
                          groupIndex,
                          index
                        ),
                      },
                    ]" />
                </a>
                <router-link v-else-if="item.path" :to="item.path" :class="[
                    'menu-item group justify-start',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]">
                  <span :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]">
                    <component :is="item.icon" />
                  </span>
                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">{{ item.name }}</span>
                </router-link>
                <transition @enter="startTransition" @after-enter="endTransition" @before-leave="startTransition"
                  @after-leave="endTransition">
                  <div v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                    ">
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link :to="subItem.path" :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(
                                subItem.path
                              ),
                              'menu-dropdown-item-inactive': !isActive(
                                subItem.path
                              ),
                            },
                          ]">
                          {{ subItem.name }}
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  DocsIcon,
  ChevronDownIcon,
  HorizontalDots,
  HomeIcon,
  SettingsIcon,
  SurveyIcon,
  PackageIcon,
  BarChartIcon,
} from "../../icons";
import { useSidebar } from "@/composables/useSidebar";
import { usePermissions } from "@/composables/usePermissions";
import { SystemModule, PermissionAction } from "@/types/permissions.types";

const route = useRoute();

const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

import authService from '@/services/auth.service';
const isAdmin = computed(() => authService.isAdmin());

// Use permissions composable
const {
  canPerform,
  forceRefreshPermissions,
  permissionContext
} = usePermissions();

// Ensure permissions are refreshed on mount and auth state changes
onMounted(() => {
  forceRefreshPermissions();
});

watch(() => permissionContext.isAuthenticated, (newAuth, oldAuth) => {
  if (newAuth !== oldAuth) {
    forceRefreshPermissions();
  }
});

// Menu item to SystemModule mapping
const menuModuleMap = {
  "Users": SystemModule.USER,
  "Villas": SystemModule.VILLAS,
  "Packages": SystemModule.PACKAGES,
  "Bookings": SystemModule.BOOKINGS,
  "Surveys": SystemModule.SURVEYS,
  "Customers": SystemModule.CUSTOMERS,
  "Quotes": SystemModule.QUOTES,
  "Invoices": SystemModule.INVOICES,
  "Payments": SystemModule.PAYMENTS,
  "General": SystemModule.SETTINGS_GENERAL,
  "Targets": SystemModule.SETTINGS_TARGETS,
};

// XerpeX ERP navigation structure with permission-based filtering
const menuGroups = computed(() => {
  const allItems = [
    {
      icon: GridIcon,
      name: "Dashboard",
      path: "/",
    },
    {
      icon: UserCircleIcon,
      name: "Users",
      path: "/users",
      module: SystemModule.USER,
    },
    {
      icon: HomeIcon,
      name: "Villas",
      path: "/villas",
      module: SystemModule.VILLAS,
    },
    {
      icon: PackageIcon,
      name: "Packages",
      path: "/packages",
      module: SystemModule.PACKAGES,
    },
    {
      icon: CalenderIcon,
      name: "Bookings",
      path: "/bookings",
      module: SystemModule.BOOKINGS,
    },
    {
      icon: SurveyIcon,
      name: "Surveys",
      path: "/surveys",
      module: SystemModule.SURVEYS,
    },
    {
      icon: DocsIcon,
      name: "Revenues",
      subItems: [
        { name: "Customers", path: "/customers", module: SystemModule.CUSTOMERS },
        { name: "Quotes", path: "/quotes", module: SystemModule.QUOTES },
        { name: "Invoices", path: "/invoices", module: SystemModule.INVOICES },
        { name: "Payments", path: "/payments", module: SystemModule.PAYMENTS },
      ],
    },
    {
      icon: SettingsIcon,
      name: "Settings",
      subItems: [
        { name: "General", path: "/settings", module: SystemModule.SETTINGS_GENERAL },
        { name: "Targets", path: "/targets", module: SystemModule.SETTINGS_TARGETS },
      ],
    },
  ];

  // Filter items based on permissions
  const filteredItems = allItems.filter(item => {
    // Dashboard is always visible
    if (item.name === "Dashboard") {
      return true;
    }

    // For items with subItems (like Revenues and Settings)
    if (item.subItems) {
      // Filter subItems based on permissions
      const visibleSubItems = item.subItems.filter(subItem =>
        subItem.module ? canPerform(subItem.module, PermissionAction.VIEW) : true
      );

      // If no subItems are visible, hide the parent item
      if (visibleSubItems.length === 0) {
        return false;
      }

      // Update subItems to only show visible ones
      item.subItems = visibleSubItems;
      return true;
    }

    // For regular items, check VIEW permission
    if (item.module) {
      return canPerform(item.module, PermissionAction.VIEW);
    }

    return true;
  });

  return [
    {
      title: "Main",
      items: filteredItems,
    }
  ];
});

const isActive = (path) => route.path === path;

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.value.some((group) =>
    group.items.some(
      (item) =>
        item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
    )
  );
});

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      menuGroups.value[groupIndex].items[itemIndex].subItems?.some((subItem) =>
        isActive(subItem.path)
      ))
  );
};

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};
</script>

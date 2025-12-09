<template>
  <div class="min-h-screen xl:flex">
    <app-sidebar v-if="isAuthenticated" />
    <Backdrop v-if="isAuthenticated" />
    <div
      class="flex-1 transition-all duration-300 ease-in-out"
      :class="[
        isAuthenticated && (isExpanded || isHovered)
          ? 'lg:ml-[290px]'
          : isAuthenticated
            ? 'lg:ml-[90px]'
            : '',
      ]"
    >
      <app-header v-if="isAuthenticated" />
      <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppSidebar from './XerpexSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useSidebar } from '@/composables/useSidebar'
import Backdrop from './Backdrop.vue'
const { isExpanded, isHovered } = useSidebar()

// Authentication state
const isAuthenticated = ref(false)

// Check authentication status on component mount
onMounted(() => {
  // Check if user is logged in (has valid token)
  const token = localStorage.getItem('token')
  isAuthenticated.value = !!token

  // Listen for auth events
  window.addEventListener('auth:login', () => {
    isAuthenticated.value = true
  })

  window.addEventListener('auth:logout', () => {
    isAuthenticated.value = false
  })
})
</script>

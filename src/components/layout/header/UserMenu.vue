<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center justify-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
      @click.prevent="toggleDropdown"
      aria-label="Toggle menu"
    >
      <MenuIcon class="w-6 h-6" />
    </button>

    <!-- Dropdown Start -->
    <div
      v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
    >
      <div>
        <span class="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
          {{ userData?.full_name || 'User' }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {{ userData?.email || 'Loading...' }}
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        <li v-for="item in menuItems" :key="item.href">
          <router-link
            :to="item.href"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <!-- SVG icon would go here -->
            <component
              :is="item.icon"
              class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
            />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <router-link
        to="/signin"
        @click="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <LogoutIcon
          class="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
        />
        Sign out
      </router-link>
    </div>
    <!-- Dropdown End -->
  </div>
</template>

<script setup>
import { UserCircleIcon, MenuIcon, LogoutIcon, SettingsIcon, InfoCircleIcon } from '@/icons'
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import authService from '@/services/auth.service'

const dropdownOpen = ref(false)
const dropdownRef = ref(null)
const userData = ref(null)

// Function to fetch user data from backend
const fetchUserData = async () => {
  try {
    // First try to get cached user data
    userData.value = authService.getUser()

    // If no cached data, fetch from backend
    if (!userData.value) {
      userData.value = await authService.getCurrentUser()
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

const menuItems = [{ href: '/profile', icon: UserCircleIcon, text: 'Edit profile' }]

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const router = useRouter()

const signOut = async () => {
  try {
    // Call the logout method from auth service
    await authService.logout()

    // Dispatch auth:logout event to update authentication state
    window.dispatchEvent(new Event('auth:logout'))

    // Close dropdown and redirect to signin page
    closeDropdown()

    // No need to navigate here as we already have router-link to="/signin"
    console.log('Successfully signed out')
  } catch (error) {
    console.error('Error signing out:', error)
    // Still redirect to signin page even if there's an error
    router.push('/signin')
  }
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchUserData() // Fetch user data when component is mounted

  // Listen for login events to refresh user data
  window.addEventListener('auth:login', fetchUserData)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('auth:login', fetchUserData)
})
</script>

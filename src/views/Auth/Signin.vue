<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"
      >
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <!-- "Back to dashboard" button removed -->
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div class="mb-5 sm:mb-8">
                <h1
                  class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"
                >
                  Sign In
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and password to sign in!
                </p>
              </div>
              <div>
                <!-- Social login buttons and divider removed -->
                <!-- Authentication error message -->
                <div
                  v-if="authError"
                  class="mb-4 p-3 rounded-lg bg-error-50 text-error-700 dark:bg-error-900/30 dark:text-error-400"
                >
                  <p>{{ authError }}</p>
                  <!-- Display details message if available -->
                  <p v-if="authDetails" class="mt-2 text-sm">
                    <strong>Details:</strong> {{ authDetails }}
                  </p>
                </div>

                <FormKit
                  type="form"
                  @submit="loginUser"
                  :actions="false"
                  :disabled="isLoading"
                  submit-behavior="live"
                >
                  <!-- Email -->
                  <FormKit
                    type="email"
                    name="email"
                    label="Email"
                    v-model="email"
                    validation="required|email"
                    placeholder="info@gmail.com"
                  >
                  </FormKit>

                  <!-- Password -->
                  <FormKit
                    type="password"
                    name="password"
                    label="Password"
                    v-model="password"
                    validation="required"
                    placeholder="Enter your password"
                  >
                  </FormKit>

                  <!-- Checkbox -->
                  <FormKit
                    type="checkbox"
                    name="keepLoggedIn"
                    label="Keep me logged in"
                    v-model="keepLoggedIn"
                  >
                  </FormKit>
                  <div class="flex items-center justify-between"></div>

                  <!-- Submit Button -->
                  <FormKit type="submit" :disabled="isLoading"> </FormKit>
                </FormKit>
                <!-- <div class="mt-5">
                  <p
                    class="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start"
                  >
                    Don't have an account?
                    <router-link
                      to="/signup"
                      class="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      >Sign Up</router-link
                    >
                  </p>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <div
          class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid"
        >
          <div class="flex items-center justify-center z-1">
            <common-grid-shape />
            <div class="flex flex-col items-center max-w-xs">
              <router-link to="/" class="block mb-4">
                <!-- <img width="{231}" height="{48}" src="/images/logo/xerpex-auth-logo.svg" alt="Xerpex" /> -->
                <p class="text-center text-3xl text-gray-300 dark:text-white/60">
                  XerpexSys<br />Kebunsu Project
                </p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
// @ts-ignore - Import auth service without type checking
import authService from '@/services/auth.service'
import { usePermissions } from '@/composables/usePermissions'

// Simple flag to prevent navigation during login process
const isLoggingIn = ref(false)

// Prevent form submission - simpler approach
const preventSubmit = (event: Event) => {
  if (isLoggingIn.value) {
    console.log('Preventing form submission during login')
    event.preventDefault()
    event.stopPropagation()
    return false
  }
}

// Add minimal event listeners when component is mounted
onMounted(() => {
  // Add event listeners - only what's necessary
  window.addEventListener('submit', preventSubmit, true)

  // Check for stored error message
  const storedError = localStorage.getItem('login_error')
  if (storedError) {
    authError.value = storedError
    localStorage.removeItem('login_error')
  }
})

// Remove event listeners when component is unmounted
onUnmounted(() => {
  window.removeEventListener('submit', preventSubmit, true)
})

const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const keepLoggedIn = ref(false)

// Initialize permissions composable
const { refreshPermissions } = usePermissions()

// Validation state
const authError = ref('')
const authDetails = ref('') // Added for detailed error messages
const isLoading = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Login method that works with FormKit form submission
const loginUser = async (formData: any) => {
  // Add guard at function start
  if (isLoading.value || isLoggingIn.value) {
    console.log('Login already in progress, ignoring duplicate submission')
    return
  }

  console.log('loginUser called with FormKit data:', formData)

  // Set flags immediately
  isLoading.value = true
  isLoggingIn.value = true // Set flag to prevent navigation/reloads
  authError.value = ''
  authDetails.value = ''

  try {
    const result = await authService.login({
      username: formData.email,
      password: formData.password,
    })

    console.log('Auth service login called with:', { username: formData.email, password: '***' })
    console.log('Making API request to /auth/login/json')
    console.log('Login API response:', result)
    console.log('Login successful:', result)

    // ADD DIAGNOSTIC LOGGING FOR SURVEY USER
    if (result && result.user) {
      console.log('User data:', result.user)
      console.log('User role from API:', result.user.role)
      console.log('Is user authenticated:', authService.isAuthenticated())

      // Check if role exists in mapping
      const ROLE_MAPPING = {
        admin: 'ADMIN',
        manager: 'MANAGER',
        finance: 'FINANCE',
        sales: 'SALES',
        'survey-admin': 'SURVEY',
        staff: 'STAFF',
      }
      console.log(
        'Role mapping exists for',
        result.user.role,
        ':',
        result.user.role in ROLE_MAPPING,
      )
    }

    // Successful login - force complete refresh to clear cached state
    console.log('Login successful, forcing permission refresh and page reload...')

    // Clear any potentially cached permission state
    localStorage.removeItem('cached_permissions')
    localStorage.removeItem('cached_user_role')

    // Get redirect from query OR localStorage as fallback
    const redirectPath = route.query.redirect
      ? String(route.query.redirect)
      : localStorage.getItem('pendingRedirect') || '/'

    // Clear stored redirect after use
    localStorage.removeItem('pendingRedirect')

    console.log('REDIRECT DEBUG: extracted redirectPath:', redirectPath)
    console.log('REDIRECT DEBUG: route.query.redirect:', route.query.redirect)
    console.log(
      'REDIRECT DEBUG: authService.isAuthenticated() before refresh:',
      authService.isAuthenticated(),
    )

    // Force complete permission refresh
    try {
      refreshPermissions()
      await nextTick()

      console.log(
        'REDIRECT DEBUG: authService.isAuthenticated() after refresh:',
        authService.isAuthenticated(),
      )

      // Clear all potential cached data that could interfere with role-based UI
      sessionStorage.clear()

      // Force a page reload to ensure completely clean state
      // This guarantees that all components re-initialize with the new user's data
      console.log('Forcing page reload to ensure clean state...')

      // Store the redirect path for after reload
      localStorage.setItem('post_login_redirect', redirectPath)

      // Force reload the entire page
      window.location.href = redirectPath
    } catch (error) {
      console.error('Permission refresh failed, forcing page reload anyway:', error)
      // Store redirect and reload anyway
      localStorage.setItem('post_login_redirect', redirectPath)
      window.location.href = redirectPath
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected login error:', error)
    authError.value = error instanceof Error ? error.message : 'An unexpected error occurred'
    throw error // Re-throw to let FormKit handle the error state
  } finally {
    isLoading.value = false
    isLoggingIn.value = false // Reset flag
  }
}
</script>

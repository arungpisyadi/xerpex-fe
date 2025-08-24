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
                <div v-if="authError" class="mb-4 p-3 rounded-lg bg-error-50 text-error-700 dark:bg-error-900/30 dark:text-error-400">
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
                  :classes="{
                    form: 'space-y-5'
                  }"
                >
                  <!-- Email -->
                  <FormKit
                    type="email"
                    name="email"
                    label="Email"
                    v-model="email"
                    validation="required|email"
                    placeholder="info@gmail.com"
                    :classes="{
                      outer: '',
                      wrapper: '',
                      label: 'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400',
                      input: 'dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800',
                      message: 'mt-1 text-sm text-error-500'
                    }"
                  >
                    <template #label="{ label }">
                      {{ label }}<span class="text-error-500">*</span>
                    </template>
                  </FormKit>

                  <!-- Password -->
                  <FormKit
                    type="password"
                    name="password"
                    label="Password"
                    v-model="password"
                    validation="required"
                    placeholder="Enter your password"
                    :classes="{
                      outer: '',
                      wrapper: 'relative',
                      label: 'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400',
                      input: 'dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800',
                      message: 'mt-1 text-sm text-error-500'
                    }"
                  >
                    <template #label="{ label }">
                      {{ label }}<span class="text-error-500">*</span>
                    </template>
                  </FormKit>

                  <!-- Checkbox -->
                  <div class="flex items-center justify-between">
                    <FormKit
                      type="checkbox"
                      name="keepLoggedIn"
                      label="Keep me logged in"
                      v-model="keepLoggedIn"
                      :classes="{
                        outer: 'mb-0',
                        wrapper: 'mb-0 flex items-center',
                        label: 'text-sm font-medium text-gray-700 cursor-pointer select-none dark:text-gray-400 ml-3',
                        input: 'sr-only',
                        decorator: 'mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] hover:border-brand-500 dark:hover:border-brand-500',
                        decoratorIcon: 'w-3.5 h-3.5'
                      }"
                      :decorator-classes="{
                        base: keepLoggedIn
                          ? 'border-brand-500 bg-brand-500'
                          : 'bg-transparent border-gray-300 dark:border-gray-700'
                      }"
                    >
                      <template #decoratorIcon>
                        <span :class="keepLoggedIn ? '' : 'opacity-0'">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                              stroke="white"
                              stroke-width="1.94437"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                      </template>
                    </FormKit>
                  </div>

                  <!-- Submit Button -->
                  <FormKit
                    type="submit"
                    :disabled="isLoading"
                    :classes="{
                      input: 'flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-70 disabled:cursor-not-allowed'
                    }"
                  >
                    <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isLoading ? 'Signing In...' : 'Sign In' }}
                  </FormKit>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
// @ts-ignore - Import auth service without type checking
import authService from '@/services/auth.service'

// Simple flag to prevent navigation during login process
const isLoggingIn = ref(false);

// Prevent form submission - simpler approach
const preventSubmit = (event: Event) => {
  if (isLoggingIn.value) {
    console.log('Preventing form submission during login');
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
};

// Add minimal event listeners when component is mounted
onMounted(() => {
  // Add event listeners - only what's necessary
  window.addEventListener('submit', preventSubmit, true);

  // Check for stored error message
  const storedError = localStorage.getItem('login_error');
  if (storedError) {
    authError.value = storedError;
    localStorage.removeItem('login_error');
  }
});

// Remove event listeners when component is unmounted
onUnmounted(() => {
  window.removeEventListener('submit', preventSubmit, true);
});

const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const keepLoggedIn = ref(false)

// Validation state
const authError = ref('')
const authDetails = ref('') // Added for detailed error messages
const isLoading = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Login method that works with FormKit form submission
const loginUser = async (formData: any) => {
  console.log('loginUser called with FormKit data:', formData);

  isLoading.value = true;
  isLoggingIn.value = true; // Set flag to prevent navigation/reloads
  authError.value = '';
  authDetails.value = '';

  try {
    const result = await authService.login({
      username: formData.email,
      password: formData.password
    });

    // Successful login - LoginResponse contains access_token, token_type, and user
    console.log('Login successful:', result);

    // Successful login - redirect to dashboard
    console.log('Login successful, redirecting...');
    const redirectPath = route.query.redirect ? String(route.query.redirect) : '/';
    router.push(redirectPath);

  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected login error:', error);
    authError.value = error instanceof Error ? error.message : 'An unexpected error occurred';
    throw error; // Re-throw to let FormKit handle the error state
  } finally {
    isLoading.value = false;
    isLoggingIn.value = false; // Reset flag
  }
};
</script>

<template>
  <theme-provider>
    <div class="dark:bg-boxdark-2 dark:text-bodydark">
      <div class="flex h-screen overflow-hidden">
        <!-- Only show sidebar when user is logged in and not on a fullscreen page -->
        <XerpexSidebar v-if="isAuthenticated && !isFullScreen" />
        <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <router-view />
        </div>
      </div>
    </div>
  </theme-provider>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import XerpexSidebar from './components/layout/XerpexSidebar.vue';
import ThemeProvider from './components/layout/ThemeProvider.vue';
import { useSidebarProvider } from './composables/useSidebar';
import { authService } from './services';

export default {
  components: {
    XerpexSidebar,
    ThemeProvider
  },
  setup() {
    // Initialize the sidebar provider
    useSidebarProvider();

    // Authentication state
    const isAuthenticated = ref(false);

    // Route state
    const route = useRoute();

    // Check if current route requires fullscreen layout
    const isFullScreen = computed(() => {
      return route.meta?.fullScreen === true;
    });

    // Check authentication status
    const checkAuth = async () => {
      try {
        // Check if user is logged in (has valid token)
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token validity with the server
          const user = await authService.getCurrentUser();
          isAuthenticated.value = !!user;
        } else {
          isAuthenticated.value = false;
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        isAuthenticated.value = false;
      }
    };

    // Check auth on component mount
    onMounted(() => {
      checkAuth();

      // Listen for auth events
      window.addEventListener('auth:login', () => {
        isAuthenticated.value = true;
      });

      window.addEventListener('auth:logout', () => {
        isAuthenticated.value = false;
      });
    });

    return {
      isAuthenticated,
      isFullScreen
    };
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.125rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item:hover {
  background-color: #f3f4f6;
}

.dark .menu-item:hover {
  background-color: #1e293b;
}

.menu-item-active {
  color: #3b82f6;
  background-color: #f3f4f6;
}

.dark .menu-item-active {
  background-color: #1e293b;
}

.menu-item-inactive {
  color: #4b5563;
}

.dark .menu-item-inactive {
  color: #9ca3af;
}

.menu-item-icon-active {
  color: #3b82f6;
}

.menu-item-icon-inactive {
  color: #4b5563;
}

.dark .menu-item-icon-inactive {
  color: #9ca3af;
}

.menu-item-text {
  font-size: 0.875rem;
}

.menu-dropdown-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-dropdown-item:hover {
  background-color: #f3f4f6;
}

.dark .menu-dropdown-item:hover {
  background-color: #1e293b;
}

.menu-dropdown-item-active {
  color: #3b82f6;
}

.menu-dropdown-item-inactive {
  color: #4b5563;
}

.dark .menu-dropdown-item-inactive {
  color: #9ca3af;
}

.menu-dropdown-badge {
  border-radius: 0.25rem;
  background-opacity: 0.1;
  padding: 0.125rem 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.menu-dropdown-badge-active {
  background-color: #3b82f6;
  color: #3b82f6;
}

.menu-dropdown-badge-inactive {
  background-color: #f3f4f6;
  color: #6b7280;
}

.dark .menu-dropdown-badge-inactive {
  background-color: #1e293b;
  color: #d1d5db;
}
</style>

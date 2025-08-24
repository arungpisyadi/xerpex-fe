import { defineFormKitConfig } from '@formkit/vue'
import { createProPlugin, inputs } from '@formkit/pro'

export default defineFormKitConfig({
  plugins: [
    createProPlugin(import.meta.env.VITE_FORMKIT_PRO_KEY, inputs)
  ],
  theme: 'genesis',
})

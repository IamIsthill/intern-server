// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        threads: false, // ⛔ Disable parallel test execution
        isolate: true, // Optional: share global context between tests
        coverage: {
            reporter: ['text', 'html'],
        },
    },
})

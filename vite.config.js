import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'V2TimerComponent',
            fileName: (format) => `v2-timer-component.${format}.js`,
        },
    },
});

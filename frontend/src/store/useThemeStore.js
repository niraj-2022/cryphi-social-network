import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("cryphi-theme") || 'coffee',
    setTheme: (theme) => {
        localStorage.setItem("cryphi-theme", theme);
        set({theme})
    },
}));
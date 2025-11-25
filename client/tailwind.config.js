/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#06B6D4', // Electric Cyan
                secondary: '#A855F7', // Neon Purple
                accent: '#22D3EE', // Bright Aqua
                success: '#84CC16', // Lime Green
                warning: '#FB923C', // Coral Orange
                danger: '#F43F5E', // Rose Red
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'glow-primary': '0 0 15px rgba(6, 182, 212, 0.5)',
                'glow-secondary': '0 0 15px rgba(168, 85, 247, 0.5)',
                'glow-accent': '0 0 15px rgba(34, 211, 238, 0.5)',
                'glow-success': '0 0 15px rgba(132, 204, 22, 0.5)',
                'glow-warning': '0 0 15px rgba(251, 146, 60, 0.5)',
                'glow-danger': '0 0 15px rgba(244, 63, 94, 0.5)',
                'glow-primary-lg': '0 0 25px rgba(6, 182, 212, 0.6)',
                'glow-secondary-lg': '0 0 25px rgba(168, 85, 247, 0.6)',
            },
            backgroundImage: {
                'gradient-neon': 'linear-gradient(to right, #06B6D4, #A855F7, #EC4899)',
                'gradient-primary-secondary': 'linear-gradient(to right, #06B6D4, #A855F7)',
                'gradient-dark-neon': 'linear-gradient(135deg, #06B6D4, #A855F7)',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 10px rgba(6, 182, 212, 0.3)' },
                    '50%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.6)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
            animation: {
                'fade-in': 'fadeIn 200ms ease-out',
                'slide-up': 'slideUp 300ms ease-out',
                'slide-down': 'slideDown 300ms ease-out',
                'scale-in': 'scaleIn 200ms ease-out',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
        },
    },
    plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'message-bg': '#E0F7FA',
                'message-ivory': '#FDFCF0',
                'message-primary': '#4DD0E1',
                'message-secondary': '#FFAB91',
                'message-gold': '#FFD54F',
                'message-text': '#5D4037',
            },
            fontFamily: {
                serif: ['"Noto Serif KR"', 'serif'],
            },
            keyframes: {
                shake: {
                    '0%, 100%': { transform: 'rotate(0deg)' },
                    '25%': { transform: 'rotate(5deg)' },
                    '75%': { transform: 'rotate(-5deg)' },
                },
                drop: {
                    '0%': { transform: 'translateY(-100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            animation: {
                shake: 'shake 0.5s ease-in-out infinite',
                drop: 'drop 0.5s ease-out forwards',
            }
        },
    },
    plugins: [],
}

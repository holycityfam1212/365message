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
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(147, 51, 234, 0.5)' },
                    '100%': { boxShadow: '0 0 20px rgba(147, 51, 234, 0.8)' },
                },
                drop: {
                    '0%': { transform: 'translateY(-300px)', opacity: 0 },
                    '60%': { transform: 'translateY(10px)', opacity: 1 },
                    '80%': { transform: 'translateY(-5px)' },
                    '100%': { transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: 0, transform: 'scale(0.98)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                },
                sparkle: {
                    '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
                    '50%': { opacity: '0.8', transform: 'scale(1.2)' },
                }
            },
            animation: {
                shake: 'shake 0.5s ease-in-out infinite',
                drop: 'drop 0.5s ease-out forwards',
                float: 'float 6s ease-in-out infinite',
                sparkle: 'sparkle 3s ease-in-out infinite',
            }
        },
    },
    plugins: [],
}

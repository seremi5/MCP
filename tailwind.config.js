/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-green-50', 'bg-green-100', 'bg-green-200',
    'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-200',
    'bg-red-50', 'bg-red-100', 'bg-red-200',
    'bg-blue-50', 'bg-blue-100', 'bg-blue-200',
    'text-green-800', 'text-yellow-800', 'text-red-800', 'text-blue-800',
    'border-green-200', 'border-yellow-200', 'border-red-200', 'border-blue-200'
  ]
}

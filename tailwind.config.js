/** @type {import('tailwindcss').Config} */
export default {
	important: '#root',
	corePlugins: {
		preflight: true,
	},
  content: ["./*.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}


module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}", "./src/**/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				bgColorPrimary: "var(--bgColorPrimary)",
				bgColorSecondary: "var(--bgColorSecondary)",
				bgColorDropdown: "var(--bgColorDropdown)",
				textColorPrimary: "var(--textColorPrimary)",
				textColorSecondary: "var(--textColorSecondary)",
				btnColorPrimary: "var(--btnColorPrimary)",
				btnColorSecondary: "var(--btnColorSecondary)"
			},
		},
	},
	plugins: [],
};

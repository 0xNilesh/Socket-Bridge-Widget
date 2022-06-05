module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}", "./src/**/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				pr: "var(--bg1)",
				bgLight: "var(--bgl)",
				fc: "var(--fc)",
				bg2: "#1C1D20",
			},
		},
	},
	plugins: [],
};

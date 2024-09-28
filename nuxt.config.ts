// https://nuxt.com/docs/api/configuration/nuxt-config

export default {
	ssr: false,
	target: "static",
	compatibilityDate: "2024-04-03",
	pages: true,
	typescript: "strict",
	generate: {
		fallback: true,
	},
	devtools: { enabled: false },
	modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt", "@element-plus/nuxt", "nuxt-echarts", "@nuxtjs/tailwindcss"],
	echarts: {
		charts: ["BarChart"],
		components: ["DatasetComponent", "GridComponent", "TooltipComponent"],
	},
	runtimeConfig: {
		public: {
			BASE_URL: process.env.BASE_URL,
		},
	},
	tailwindcss: {
		jit: true,
	},
};
8;

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
			BASE_URL_PUBLICA: process.env.BASE_URL_PUBLICA,
			BASE_URL_INTERNA: process.env.BASE_URL_INTERNA,
		},
	},
	tailwindcss: {
		jit: true,
	},
};
8;

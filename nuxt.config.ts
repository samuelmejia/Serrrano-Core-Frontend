// https://nuxt.com/docs/api/configuration/nuxt-config

export default {
	ssr: true,
	compatibilityDate: "2024-04-03",
	devtools: { enabled: false },
	modules: ["@element-plus/nuxt", "nuxt-echarts", "@nuxtjs/tailwindcss"],
	echarts: {
		charts: ["BarChart"],
		components: ["DatasetComponent", "GridComponent", "TooltipComponent"],
	},
	runtimeConfig: {
		public: {
			SUPABASE_BASE_URL: process.env.SUPABASE_BASE_URL,
			SUPABASE_REST_URL: process.env.SUPABASE_REST_URL,
			SUPABASE_KEY: process.env.SUPABASE_KEY,
		},
	},
	tailwindcss: {
		jit: true,
	},
};

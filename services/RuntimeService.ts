import type { RuntimeConfig } from "nuxt/schema";

export default class RuntimeService {
	private static instance: RuntimeService | null = null;
	private static config: RuntimeConfig | null = null;

	private constructor(rc: RuntimeConfig) {
		RuntimeService.config = rc;
	}

	static getInstance(rc: RuntimeConfig): RuntimeService {
		if (this.instance == null) this.instance = new RuntimeService(rc);

		return this.instance;
	}

	static getConfig(): RuntimeConfig {
		return RuntimeService.config!;
	}
}

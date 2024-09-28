import { defineStore } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import type { TLevantamientoActualModel } from "../Types/TLevantamientoActualModel";

export const LevantamientoStore = defineStore({
	id: "pinia-levantamiento",

	state: () => {
		return {
			levantamiento: <TLevantamientoActualModel>{},
		};
	},

	actions: {
		set(newState: TLevantamientoActualModel) {
			this.levantamiento = newState;
		},
	},

	getters: {
		get: (state: any): TLevantamientoActualModel => {
			return state.levantamiento;
		},
	},

	persist: {
		storage: sessionStorage,
	},
});

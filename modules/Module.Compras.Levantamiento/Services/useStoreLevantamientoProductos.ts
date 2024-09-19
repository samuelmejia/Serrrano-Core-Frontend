import { defineStore } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import type { TProductoModel } from "../Types/TProductoModel";

export const useStoreLevantamientoProductos = defineStore({
	id: "pinia-levantamiento-productos",

	state: () => {
		return {
			productos: <TProductoModel[]>{},
		};
	},

	actions: {
		set(newState: TProductoModel[]) {
			this.productos = newState;
		},
	},

	getters: {
		get: (state: any): TProductoModel[] => {
			return state.productos;
		},
	},

	persist: {
		storage: sessionStorage,
	},
});

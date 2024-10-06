import { defineStore } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import type { TLevantamientoActualModel } from "../Types/TLevantamientoActualModel";
import API from "~/modules/_Module.API/API";

type TDataDomain = {
	id: number;
	idEtapa: number;
	descripcion: string;
	proceso: string;
};

type TData = {
	id: number;
	descripcion: string;
};

export const EstadoSolicitarStore = defineStore({
	id: "pinia-levantamiento-estado-solicitar",

	state: () => {
		return {
			estados: <TData[]>[],
		};
	},

	actions: {
		set(newState: TData[]) {
			this.estados = newState;
		},

		load() {
			const body = {
				idEtapa: 1,
				proceso: "1.1",
			};

			const api = new API();
			api.post<TDataDomain[]>("/Levantamiento/ftEstados", body).then((res) => {
				if (!!res) {
					this.estados = res.map((x: TDataDomain) => {
						return { id: x.id, descripcion: x.descripcion };
					});
				}
			});
		},
	},

	getters: {
		get: (state: any): TData[] => {
			return state.estados;
		},
	},

	persist: {
		storage: sessionStorage,
	},
});

import API from "~/modules/_Module.API/API";
import type { TLevantamientoActualDomain } from "./TipoDomain";

export default class LevantamientoAPI {
	constructor() {}

	async POST_IniciarLevantamiento(): Promise<{ estado: boolean; mensaje: string }> {
		const api = new API();
		const resData = await api.post<any>("/Levantamiento/CreaLevantamiento", "192.168.22.10");

		if (!!resData) {
			return {
				estado: true,
				mensaje: resData,
			};
		}

		return {
			estado: false,
			mensaje: "Error al iniciar el levantamiento",
		};
	}

	async POST_AgregarProductoLevantamiento(param_codigo: string): Promise<{ estado: boolean; mensaje: string }> {
		const api = new API();
		const resData = await api.post<string>("", { busqueda: param_codigo });

		if (!!resData) {
			return {
				estado: true,
				mensaje: resData,
			};
		}
		return {
			estado: false,
			mensaje: "Error al agregar el producto del levantamiento",
		};
	}

	async POST_QuitarProductoLevantamiento(param_codigo: string): Promise<{ estado: boolean; mensaje: string }> {
		const api = new API();
		const resData = await api.post<string>("/EliminarProducto", { id: param_codigo });

		if (!!resData) {
			return {
				estado: true,
				mensaje: resData,
			};
		}
		return {
			estado: false,
			mensaje: "Error al quitar el producto del levantamiento",
		};
	}

	async GET_LevantamientoProductos(idLevantamiento: number): Promise<any> {
		const api = new API();
		const resData = await api.get<string>("/Levantamiento/GetLevantamientoProducto", { id: idLevantamiento });

		if (!!resData) {
			return {
				estado: true,
				mensaje: resData,
			};
		}
		return {
			estado: false,
			mensaje: "Error al quitar el producto del levantamiento",
		};
	}

	async POST_StatusLevantamiento(): Promise<{ estado: boolean; body: TLevantamientoActualDomain | null }> {
		const api = new API();
		const resData = await api.post<TLevantamientoActualDomain>("/Levantamiento/StatusLevantamiento", "192.168.22.10");
		//TODO: Cambiar luego

		if (!!resData) {
			return {
				estado: true,
				body: resData,
			};
		}

		return {
			estado: false,
			body: null,
		};
	}
}

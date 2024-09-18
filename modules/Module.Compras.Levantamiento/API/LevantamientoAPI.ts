import API from "~/modules/_Module.API/API";

export default class LevantamientoAPI {
	constructor() {}

	async POST_IniciarLevantamiento(): Promise<{ estado: boolean; mensaje: string }> {
		const api = new API();
		const resData = await api.post<string>("", {});

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
		const resData = await api.post<string>("", { busqueda: param_codigo });

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
}

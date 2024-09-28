import Mensajes from "~/helpers/Mensajes";
import type { TLevantamientoProductoModel, TProductoModel } from "../Types/TProductoModel";
import LevantamientoAPI from "../API/LevantamientoAPI";
import ProductosAPI from "../API/ProductosAPI";
import type { TLevantamientoActualModel } from "../Types/TLevantamientoActualModel";
import TokenAPI from "~/modules/_Module.API/TokenAPI";

export default class LevantamientosHistorialService {
	api;
	levantamientos = <TLevantamientoActualModel[]>{};

	constructor() {
		this.api = new LevantamientoAPI();
		this.levantamientos = <TLevantamientoActualModel[]>[];
	}

	async loadData(): Promise<void> {
		const respuesta = await this.api.GET_GetLevantamientos();

		console.log("respuesta de Load", respuesta);

		if (respuesta.estado && respuesta.body.length > 0) {
			this.levantamientos = respuesta.body;
		}
	}
}

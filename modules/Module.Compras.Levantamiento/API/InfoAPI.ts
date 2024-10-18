import API from "~/modules/_Module.API/API";
import type { TInfoMarcaDomain, TInfoProveedorDomain } from "../_Data/TipoInformacion";

export default class InfoAPI {
	constructor() {}

	async GET_Proveedores(): Promise<TInfoProveedorDomain[]> {
		const api = new API();

		try {
			const resData = await api.get<TInfoProveedorDomain[]>("/Informacion/Proveedores");

			if (!resData) {
				return [];
			}
			return resData;
		} catch (e) {
			console.error(e);
			return [];
		}
	}
}

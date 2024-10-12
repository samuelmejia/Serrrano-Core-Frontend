import API from "~/modules/_Module.API/API";
import type { TInfoProveedorDomain } from "../_Data/TipoInformacion";

export default class InformacionService {
	constructor() {}

	async getProveedores(): Promise<TInfoProveedorDomain[]> {
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

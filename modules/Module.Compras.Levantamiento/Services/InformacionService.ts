import API from "~/modules/_Module.API/API";
import type { TDetalleKardexDomain, TEncabezadoKardexDomain, TInfoMarcaDomain, TInfoProveedorDomain } from "../_Data/TipoInformacion";

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

	async getMarcas(IDProveedor: string): Promise<TInfoMarcaDomain[]> {
		const api = new API();

		try {
			const resData = await api.get<TInfoMarcaDomain[]>("/Informacion/ProveedoresMarca", { IDProveedor });
			if (!resData) {
				return [];
			}
			return resData;
		} catch (e) {
			console.error(e);
			return [];
		}
	}

	async encabezadoKardex(codProducto: string): Promise<TEncabezadoKardexDomain> {
		const api = new API();

		try {
			const resData = await api.get<TEncabezadoKardexDomain>("/Informacion/EncabezadoKardex", { codProducto });
			if (!resData) {
				return {} as TEncabezadoKardexDomain;
			}
			return resData;
		} catch (e) {
			console.error(e);
			return {} as TEncabezadoKardexDomain;
		}
	}

	async detalleKardex(codProducto: string): Promise<TDetalleKardexDomain[]> {
		const api = new API();

		try {
			const resData = await api.get<TDetalleKardexDomain[]>("/Informacion/DetalleKardex", { codProducto });
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

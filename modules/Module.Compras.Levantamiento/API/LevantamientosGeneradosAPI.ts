import API from "~/modules/_Module.API/API";
import type { TLevantamientoActualDomain, TLevantamientoProductoDomain } from "../_Data/TipoDomain";
import type { TLevantamientoProductoModel } from "../Types/TProductoModel";
import type { TLevantamientoActualModel } from "../Types/TLevantamientoActualModel";
import Fechas from "~/helpers/Fechas";

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

	async POST_AgregarProductoLevantamiento(idLevantamiento: number, producto: TLevantamientoProductoModel): Promise<{ estado: boolean; mensaje: string }> {
		const api = new API();
		const resData = await api.post<string>("/Levantamiento/PILevantamientoProducto", {
			idLevantamiento,
			codProducto: producto.codigo,
			descripcion: producto.descripcion,
		});

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

	async POST_QuitarProductoLevantamiento(idLevantamiento: number, codProducto: string): Promise<{ estado: boolean; mensaje: string }> {
		const api = new API();

		console.log("POST_QuitarProductoLevantamiento", idLevantamiento, codProducto);
		const resData = await api.delete<string>("/Levantamiento/PDLevantamientoProducto", { idLevantamiento, codProducto });

		if (!!resData) {
			return {
				estado: true,
				mensaje: resData,
			};
		}
		return {
			estado: false,
			mensaje: "",
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

	async POST_StatusLevantamiento(): Promise<{ estado: boolean; body: TLevantamientoActualModel | null }> {
		const api = new API();
		const resData = await api.post<TLevantamientoActualDomain>("/Levantamiento/StatusLevantamiento");
		//TODO: Cambiar luego

		if (!!resData) {
			return {
				estado: true,
				body: this.convertLevantamientoDomainToModel(resData),
			};
		}

		return {
			estado: false,
			body: null,
		};
	}

	convertLevantamientoDomainToModel(levantamiento: TLevantamientoActualDomain): TLevantamientoActualModel {
		let lA = <TLevantamientoActualModel>{};

		if (levantamiento) {
			const b = levantamiento;
			(lA.area = b.area),
				(lA.id = 1), //TODO:: cambiar luego por el id real
				(lA.fechaCreacion = b.fechaCreacion ? Fechas.Date_To_String(new Date(b.fechaCreacion)) : ""),
				(lA.horaCreacion = b.fechaCreacion ? Fechas.Time_To_String(new Date(b.fechaCreacion)) : ""),
				(lA.fechaCierre = b.fechaCierre ? Fechas.Date_To_String(new Date(b.fechaCierre)) : ""),
				(lA.horaCierre = b.fechaCierre ? Fechas.Time_To_String(new Date(b.fechaCierre)) : ""),
				(lA.usuarioResponsable = b.usuarioResponsable),
				(lA.ipAddress = b.ipAddress),
				(lA.area = b.area),
				(lA.pasillo = b.pasillo || ""),
				(lA.observaciones = b.observaciones || ""),
				(lA.estado = b.estado);
		}

		return lA;
	}

	async GET_GetProductosLevantamiento(idLevantamiento: number): Promise<{ estado: boolean; body: TLevantamientoProductoModel[] }> {
		const api = new API();
		const resData = await api.get<TLevantamientoProductoDomain[]>("/Levantamiento/ftLevantamientoProducto", { id: idLevantamiento });

		if (!!resData) {
			return {
				estado: true,
				body: resData.map((x) => this.convertLevantamientoProductoDomainToModel(x)),
			};
		}

		return {
			estado: false,
			body: [],
		};
	}
	/*

	async GET_AllLevantamientos(): Promise<{ estado: boolean; body: TLevantamientoDomain[] }> {
		const api = new API();
		const resData = await api.get<TLevantamientoDomain[]>("/Levantamiento/ftAll");

		if (!!resData) {
			return {
				estado: true,
				body: resData,
			};
		}

		return {
			estado: false,
			body: [],
		};
	}*/

	convertLevantamientoProductoDomainToModel(producto: TLevantamientoProductoDomain) {
		return <TLevantamientoProductoModel>{
			id: producto.id,
			idLevantamiento: producto.idLevantamiento,
			codigo: producto.codProducto,
			descripcion: producto.descripcion,
			fecha: Fechas.Date_To_String(new Date(producto.fechaHora)),
			hora: Fechas.Time_To_String(new Date(producto.fechaHora)),
			observaciones: producto.observaciones,
			detalles: [], //TODO: agregar detalles
		};
	}
}

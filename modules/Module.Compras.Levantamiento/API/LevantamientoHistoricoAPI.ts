import API from "~/modules/_Module.API/API";
import type { TLevantamientoActualDomain, TLevantamientoProductoDomain, TProductoDetalleDomain } from "../_Data/TiposLevantamiento";
import type { TLevantamientoProductoModel } from "../Types/TProductoModel";
import type { TLevantamientoActualModel } from "../Types/TLevantamientoActualModel";
import Fechas from "~/helpers/Fechas";
import type { TProductoDetalleModel } from "../Types/TProductoDetalleExistenciasModel";

export default class LevantamientoHistoricoAPI {
	constructor() {}

	async GET_GetAllLevantamientos(): Promise<TLevantamientoActualModel[]> {
		const api = new API();
		const resData = await api.get<TLevantamientoActualDomain[]>("/Levantamiento/ListaLevantamientos?id=3");

		if (!!resData) {
			return resData.map(this.convertLevantamientoDomainToModel);
		}
		return [];
	}

	async GET_GetAllLevantamientosFiltrados(idLevantamiento: number): Promise<TLevantamientoActualModel[]> {
		const api = new API();
		const resData = await api.get<TLevantamientoActualDomain[]>(`/Levantamiento/ListaLevantamientos?id=${idLevantamiento}`);

		if (!!resData) {
			return resData.map(this.convertLevantamientoDomainToModel);
		}
		return [];
	}

	convertLevantamientoDomainToModel(levantamiento: TLevantamientoActualDomain): TLevantamientoActualModel {
		let lA = <TLevantamientoActualModel>{};

		if (levantamiento) {
			const b = levantamiento;
			(lA.area = b.area),
				(lA.id = b.id), //TODO:: cambiar luego por el id real
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

	convertLevantamientoProductoDomainToModel(producto: TLevantamientoProductoDomain) {
		return <TLevantamientoProductoModel>{
			id: producto.id,
			idLevantamiento: producto.idLevantamiento,
			codigo: producto.codProducto,
			descripcion: producto.descripcion,
			marca: producto.marca || "",
			fecha: Fechas.Date_To_String(new Date(producto.fechaHora)),
			hora: Fechas.Time_To_String(new Date(producto.fechaHora)),
			observaciones: producto.observaciones,
			detalleExistencias: [],
			detalles: producto.levantamientoDetalle.map((x: TProductoDetalleDomain) => {
				return <TProductoDetalleModel>{
					idLevantamiento: x.idLevantamientoProducto,
					codigoTienda: x.idTiendas,
					nombreTienda: "",
					disponible: x.disponible,
					encontrado: x.encontrado,
					solicitar: x.idEstado,
				};
			}),
		};
	}

	async POST_ActualizarLevantamiento(body: any): Promise<{ estado: boolean; mensaje: string }> {
		const api = new API();
		const resData = await api.put<string>("/Levantamiento/PULevantamiento", body);

		if (!!resData) {
			return {
				estado: true,
				mensaje: resData,
			};
		}

		return {
			estado: false,
			mensaje: "Error al finalizar el levantamiento",
		};
	}
}

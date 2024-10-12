import API from "~/modules/_Module.API/API";
import type { TDetalleProductoDomain, TLevantamientoActualDomain, TLevantamientoProductoDomain, TProductoDetalleDomain } from "../_Data/TiposLevantamiento";
import type { TLevantamientoProductoModel } from "../Types/TProductoModel";
import type { TLevantamientoActualModel } from "../Types/TLevantamientoActualModel";
import Fechas from "~/helpers/Fechas";
import type { TProductoDetalleExistenciasModel, TProductoDetalleModel } from "../Types/TProductoDetalleExistenciasModel";

export default class LevantamientoAPI {
	constructor() {}

	async POST_IniciarLevantamiento(): Promise<{ estado: boolean; mensaje: string }> {
		const api = new API();
		const resData = await api.post<any>("/Levantamiento/CreaLevantamiento");

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
		const body = {
			idLevantamiento,
			codProducto: producto.codigo,
			descripcion: producto.descripcion,
		};

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
		const resData = await api.post<TLevantamientoActualDomain>("/Levantamiento/StatusLevantamiento", {}, false);

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
				(lA.id = b.id),
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

	async POST_GuardarProgresoProducto(producto: TLevantamientoProductoModel): Promise<{ estado: boolean; mensaje: string }> {
		const objetoEnviar = {
			idLevantamiento: producto.idLevantamiento,
			codProducto: producto.codigo,
			observaciones: producto.observaciones,
			levantamientoDetalle: producto.detalles
				.filter((x) => x.solicitar != 0)
				.map((x) => {
					return {
						idLevantamientoProducto: x.idLevantamiento,
						idTiendas: x.codigoTienda,
						disponible: +x.disponible,
						encontrado: +x.encontrado,
						idEstado: +x.solicitar,
					};
				}),
		};

		const api = new API();
		const resData = await api.post<any>("/Levantamiento/PGGuardarProgreso", [objetoEnviar]);

		if (!!resData) {
			return {
				estado: true,
				mensaje: resData.message,
			};
		}
		return {
			estado: false,
			mensaje: "Error al guardar el progreso del producto",
		};
	}

	async POST_GuardarProgresoTodos(productos: TLevantamientoProductoModel[]): Promise<{ estado: boolean; mensaje: string }> {
		const objetoEnviar = productos.map((producto) => {
			const d =
				!producto.detalles || producto.detalles.length == 0
					? []
					: producto.detalles
							.filter((x) => x.solicitar != 0)
							.map((x) => {
								return {
									idLevantamientoProducto: x.idLevantamiento,
									idTiendas: x.codigoTienda,
									disponible: +x.disponible,
									encontrado: +x.encontrado,
									idEstado: +x.solicitar,
								};
							});

			return {
				idLevantamiento: producto.idLevantamiento,
				codProducto: producto.codigo,
				observaciones: producto.observaciones || "",
				levantamientoDetalle: d,
			};
		});

		const api = new API();
		const resData = await api.post<any>("/Levantamiento/PGGuardarProgreso", objetoEnviar);

		if (!!resData) {
			return {
				estado: true,
				mensaje: resData.message,
			};
		}
		return {
			estado: false,
			mensaje: "Error al guardar el progreso del producto",
		};
	}

	async POST_FinalizarLevantamiento(body: any): Promise<{ estado: boolean; mensaje: string }> {
		console.log("POST_FinalizarLevantamiento", body);

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

	///----------------- Historial

	async GET_GetLevantamientos(): Promise<{ estado: boolean; body: TLevantamientoActualModel[] }> {
		const api = new API();
		const resData = await api.get<TLevantamientoActualDomain[]>("/Levantamiento/GetAllLevantamientos");

		if (!!resData) {
			return {
				estado: true,
				body: resData.map((x) => this.convertLevantamientoDomainToModel(x)),
			};
		}

		return {
			estado: false,
			body: [],
		};
	}

	async GET_DetalleProducto(param_codigo: string): Promise<TProductoDetalleExistenciasModel[]> {
		const api = new API();
		const resData = await api.get<TDetalleProductoDomain[]>("/Producto/ExistenciaProducto", { busqueda: param_codigo });

		if (!!resData) {
			return resData.map((x: TDetalleProductoDomain) => {
				return <TProductoDetalleExistenciasModel>{
					codigo: x.id,
					codigoTienda: x.tndID,
					nombreTienda: x.tndNombre,
					reservado: x.reservado,
					enTransito: x.enTransito,
					confirmado: x.confirmado,
					existencia: x.existencia,
					disponible: x.disponible,
					stockMinimo: x.prdStockMinimo,
					stockMaximo: x.prdStockMaximo,
				};
			});
		}

		return [];
	}
}

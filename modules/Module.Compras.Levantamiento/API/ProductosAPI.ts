import type { TLevantamientoProductoModel, TProductoModel } from "../Types/TProductoModel";
import type { TProductoDetalleExistenciasModel } from "../Types/TProductoDetalleExistenciasModel";
import API from "~/modules/_Module.API/API";
import type { TDetalleProductoDomain, TProductoDomain } from "../_Data/TiposLevantamiento";

export default class ProductosAPI {
	constructor() {}

	async GET_AllProductosGenerales(): Promise<TProductoModel[]> {
		const api = new API();
		const resData = await api.get<TProductoDomain[]>("/Producto/AllProducto");

		if (!!resData) {
			return resData.map((x: TProductoDomain) => {
				return <TProductoModel>{
					codigo: x.id,
					nombre: x.nombre,
					modelo: x.marca,
					linea: x.linea,
					categoria: x.categoria,
					marca: x.marca,
					stockTotal: x.stockTotal,
					impuesto: +x.impuesto,
					estadoAgregado: false,
					observaciones: "",
					fechaUltimaCompra: x.fechaUltimaCompra,
					fechaUltimaVenta: x.fechaUltimaVenta,
					estado: x.estado,
					detalleExistencias: [],
				};
			});
		}

		return [];
	}

	async GET_ProductosFiltrado(campo_filtro: string): Promise<TProductoModel[]> {
		const api = new API();
		const resData = await api.get<TProductoDomain[]>("/Producto/Producto", { busqueda: campo_filtro });

		if (!!resData) {
			return resData.map((x: TProductoDomain) => {
				return <TProductoModel>{
					codigo: x.id,
					nombre: x.nombre,
					modelo: x.marca,
					linea: x.linea,
					categoria: x.categoria,
					marca: x.marca,
					stockTotal: x.stockTotal,
					impuesto: +x.impuesto,
					estadoAgregado: false,
					observaciones: "",
					fechaUltimaCompra: x.fechaUltimaCompra,
					fechaUltimaVenta: x.fechaUltimaVenta,
					estado: x.estado,
					detalleExistencias: [],
				};
			});
		}

		return [];
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

	async POST_guardarProgresoLevantamiento(idLevantamiento: number, producto: TLevantamientoProductoModel): Promise<void> {
		const productoFormateado = {
			idLevantamiento,
			codigo: producto.codigo,
			observaciones: producto.observaciones,
			detalles: producto.detalles?.map((x) => {
				return {
					idTienda: x.codigoTienda,
					encontrado: x.encontrado,
					estado: x.solicitar,
				};
			}),
		};

		const api = new API();
		await api.post<string>("/Levantamiento/ProgresoLevantamiento", productoFormateado);
	}
}

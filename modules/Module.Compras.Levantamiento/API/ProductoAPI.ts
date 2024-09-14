import FetchHeaders from "~/modules/_Module.API/_FetchHeaders";
import ServiceAPI from "~/modules/_Module.API/ServiceAPI";
import type { TProductoModel } from "../Types/TProductoModel";
import type { TProductoDetalleModel } from "../Types/TProductoDetalleModel";

type TProductoDomain = {
	id: string;
	nombre: string;
	linea: string;
	categoria: string;
	marca: string;
	impuesto: string;
	stockTotal: number;
	fechaUltimaCompra: string;
	fechaUltimaVenta: string;
	estado: string;
};

type TDetalleProductoDomain = {
	id: string;
	tndID: string;
	tndNombre: string;
	reservado: number;
	enTransito: number;
	confirmado: number;
	existencia: number;
	disponible: number;
	prdStockMinimo: number;
	prdStockMaximo: number;
};

export type { TProductoDomain, TDetalleProductoDomain };

export default class ProductosLevantamientoAPI extends ServiceAPI {
	constructor() {
		super();
	}

	//Valores iniciales de los productos
	async GET_AllProductosGenerales(): Promise<TProductoModel[]> {
		try {
			const response = await fetch(`${this.restURL}/Producto/AllProducto`, {
				method: "GET",
				headers: FetchHeaders.headers,
			});

			const data = await response.json();

			if (!response.ok) {
				throw data;
			}

			return data.map((x: TProductoDomain) => {
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
					fechaUltimaCompra: x.fechaUltimaCompra,
					fechaUltimaVenta: x.fechaUltimaVenta,
					estado: x.estado,
				};
			});
		} catch (e: any) {
			console.log("ERR::ProductosLevantamientoAPI.GET_AllProductosGenerales", e);
			return [];
		}
	}

	async GET_ProductosFiltrado(campo_filtro: string): Promise<TProductoModel[]> {
		try {
			const queryParam = new URLSearchParams({ busqueda: campo_filtro });

			const response = await fetch(`${this.restURL}/Producto/Producto?${queryParam}`, {
				method: "GET",
				headers: FetchHeaders.headers,
			});

			const data = await response.json();

			if (!response.ok) {
				throw data;
			}

			return data.map((x: TProductoDomain) => {
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
					fechaUltimaCompra: x.fechaUltimaCompra,
					fechaUltimaVenta: x.fechaUltimaVenta,
					estado: x.estado,
				};
			});
		} catch (e: any) {
			console.log("ERR::ProductosLevantamientoAPI.GET_ProductosFiltrado", e);
			return [];
		}
	}

	async GET_DetalleProducto(param_codigo: string): Promise<TProductoDetalleModel[]> {
		try {
			const queryParam = new URLSearchParams({ busqueda: param_codigo });

			const response = await fetch(`${this.restURL}/Producto/ExistenciaProducto?${queryParam}`, {
				method: "GET",
				headers: FetchHeaders.headers,
			});

			const data = await response.json();

			if (!response.ok) {
				throw data;
			}

			return data.map((x: TDetalleProductoDomain) => {
				return <TProductoDetalleModel>{
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
		} catch (e: any) {
			console.log("ERR::ProductosLevantamientoAPI.GET_DetalleProducto", e);
			return [];
		}
	}
}

import API from "~/modules/_Module.API/API";
import type { TLevantamientoActualDomain, TLevantamientoProductoDomain, TProductoDetalleDomain } from "../_Data/TiposLevantamiento";
import type { TLevantamientoProductoModel } from "../Types/TProductoModel";
import type { TLevantamientoActualModel } from "../Types/TLevantamientoActualModel";
import Fechas from "~/helpers/Fechas";
import type { TProductoDetalleModel } from "../Types/TProductoDetalleExistenciasModel";
import type { TPedidoDomain, TPedidoModel, TPedidoProductoDomain, TPedidoProductoModel } from "../_Data/TiposPedidos";

type TPedidoCompleto = TPedidoDomain & { productos: TPedidoProductoDomain[] };

export default class PedidosAPI {
	constructor() {}

	async GET_GetAllPedidosFiltrados(descripcion: string, idEstado: number): Promise<TPedidoModel[]> {
		const api = new API();
		const resData = await api.get<TPedidoDomain[]>(`/pedidos`, { descripcion, idEstado });

		if (!!resData) {
			return resData.map(this.convertPedidoDomainToModel);
		}
		return [];
	}

	async Get_DetallePedido(idPedido: number): Promise<TPedidoModel> {
		const api = new API();
		const resData = await api.get<TPedidoCompleto[]>(`/pedidos/get`, { idPedido });

		console.log("Get_DetallePedido", resData);
		if (!!resData) {
			return resData.map((d) => this.convertPedidoCompletoToModel(d))[0];
		}
		return <TPedidoModel>{};
	}

	private convertPedidoDomainToModel(pedido: TPedidoDomain): TPedidoModel {
		return {
			id: pedido.id,
			descripcion: pedido.descripcion,
			fechaCreacion: pedido.fechaCreacion ? Fechas.Date_To_String(new Date(pedido.fechaCreacion)) : "",
			horaCreacion: pedido.fechaCreacion ? Fechas.Time_To_String(new Date(pedido.fechaCreacion)) : "",
			usuarioResponsable: pedido.usuarioResponsable,
			ipAddress: pedido.ipAddress,
			fechaCierre: pedido.fechaCierre ? Fechas.Date_To_String(new Date(pedido.fechaCierre)) : "",
			horaCierre: pedido.fechaCierre ? Fechas.Time_To_String(new Date(pedido.fechaCierre)) : "",
			observaciones: pedido.observaciones,
			estado: pedido.estado,
			fechaEntrega: pedido.fechaEntrega,
		};
	}

	private convertPedidoCompletoToModel(pedido: TPedidoCompleto): TPedidoModel {
		return {
			id: pedido.id,
			descripcion: pedido.descripcion,
			fechaCreacion: pedido.fechaCreacion ? Fechas.Date_To_String(new Date(pedido.fechaCreacion)) : "",
			horaCreacion: pedido.fechaCreacion ? Fechas.Time_To_String(new Date(pedido.fechaCreacion)) : "",
			usuarioResponsable: pedido.usuarioResponsable,
			ipAddress: pedido.ipAddress,
			fechaCierre: pedido.fechaCierre ? Fechas.Date_To_String(new Date(pedido.fechaCierre)) : "",
			horaCierre: pedido.fechaCierre ? Fechas.Time_To_String(new Date(pedido.fechaCierre)) : "",
			observaciones: pedido.observaciones,
			estado: pedido.estado,
			fechaEntrega: pedido.fechaEntrega,
			productos: pedido.productos.map((p) => this.convertirProductoDomainToModel(p)),
		};
	}

	private convertirProductoDomainToModel(producto: any): TPedidoProductoModel {
		const intento = {
			id: producto.id,
			codProducto: producto.codProducto,
			descripcion: producto.descripcionProducto ? producto.descripcionProducto : "",
			marca: producto.marca || "",
			fecha: producto.fechaHora ? Fechas.Date_To_String(new Date(producto.fechaHora)) : "",
			hora: producto.fechaHora ? Fechas.Time_To_String(new Date(producto.fechaHora)) : "",
			fechaEntrega: producto.fechaEntregaProducto ? Fechas.Date_To_String(new Date(producto.fechaEntregaProducto)) : "",
			cantidad: producto.cantidad ? producto.cantidad : 0,
			observaciones: producto.observaciones ? producto.observaciones : "",
			idPedido: producto.IdPedido,
		};

		return intento;
	}
}

import API from "~/modules/_Module.API/API";
import Fechas from "~/helpers/Fechas";
import type { TPedidoDomain, TPedidoModel, TPedidoProductoDomain, TPedidoProductoModel } from "../../Module.Compras.Gestiones/_data/TiposPedidos";

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

	async POST_copiarLevantamientoToPedido(idLevantamiento: number): Promise<{ estado: boolean; mensaje: string }> {
		const api = new API();
		const resData = await api.post<{ message: string }>("/pedidos/copiarLevantamiento", { idLevantamiento });

		if (!!resData) {
			return {
				estado: true,
				mensaje: resData.message,
			};
		}

		return {
			estado: false,
			mensaje: "Error al generar la copia",
		};
	}

	async POST_NuevoActualizarPedido(pedido: TPedidoModel): Promise<{ estado: boolean; mensaje: string }> {
		const body = {
			idPedido: pedido.id,
			descripcion: pedido.descripcion,
			fechaEntrega: pedido.fechaEntrega,
		};

		const api = new API();
		const resData = await api.post<{ message: string }>(`/pedidos`, body);

		if (!!resData) {
			return {
				estado: true,
				mensaje: resData.message,
			};
		}

		return {
			estado: false,
			mensaje: "Error al generar la copia",
		};
	}

	async POST_AgregarProductoEnPedido(producto: TPedidoProductoModel): Promise<{ estado: boolean; mensaje: string }> {
		console.log("POST_AgregarProductoEnPedido", producto);
		console.log("idPedido", producto.idPedido);
		const body = {
			idPedido: producto.idPedido,
			codProducto: producto.codProducto,
			descripcionProducto: producto.descripcion,
			marca: producto.marca,
			cantidad: producto.cantidad,
			fechaEntregaProducto: !!producto.fechaEntrega ? producto.fechaEntrega : "2024-12-31",
			observacionesProducto: producto.observaciones,
		};

		const api = new API();
		const resData = await api.post<{ message: string }>(`/pedidos/agregar`, body);

		if (!!resData) {
			return {
				estado: true,
				mensaje: resData.message,
			};
		}

		return {
			estado: false,
			mensaje: "Error al generar la copia",
		};
	}

	async Delete_ProductoEnPedido(idPedido: number, codProducto: string): Promise<{ estado: boolean; mensaje: string }> {
		const api = new API();
		const resData = await api.delete<{ message: string }>(`/pedidos/eliminar`, { idPedido, codProducto });

		if (!!resData) {
			return {
				estado: true,
				mensaje: resData.message,
			};
		}

		return {
			estado: false,
			mensaje: "Error al generar la copia",
		};
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
			fechaEntrega: pedido.fechaEntrega ? Fechas.Date_To_String(new Date(pedido.fechaEntrega)) : "",
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
			fechaEntrega: pedido.fechaEntrega ? Fechas.Date_To_String(new Date(pedido.fechaEntrega)) : "",
			productos: pedido.productos.map((p) => this.convertirProductoDomainToModel(p)),
		};
	}

	private convertirProductoDomainToModel(producto: TPedidoProductoDomain): TPedidoProductoModel {
		const intento = {
			id: producto.idPedidoProducto,
			codProducto: producto.codProducto,
			descripcion: producto.descripcionProducto ? producto.descripcionProducto : "",
			marca: producto.marca || "",
			fecha: producto.fechaHora ? Fechas.Date_To_String(new Date(producto.fechaHora)) : "",
			hora: producto.fechaHora ? Fechas.Time_To_String(new Date(producto.fechaHora)) : "",
			fechaEntrega: producto.fechaEntregaProducto ? Fechas.Date_To_String(new Date(producto.fechaEntregaProducto)) : "",
			cantidad: producto.cantidad ? producto.cantidad : 0,
			observaciones: producto.observacionesProducto ? producto.observacionesProducto : "",
			idPedido: producto.idPedido,
		};

		return intento;
	}
}

import Mensajes from "~/helpers/Mensajes";
import PedidosAPI from "../API/PedidosAPI";
import type { TPedidoModel, TPedidoProductoModel } from "../_data/TiposPedidos";

export default class PedidosService {
	api;

	constructor() {
		this.api = new PedidosAPI();
	}

	async getListPedidosFiltrado(descripcion: string, idEstado: number): Promise<TPedidoModel[]> {
		return this.api.GET_GetAllPedidosFiltrados(descripcion, idEstado);
	}

	async getPedidoConProductos(idPedido: number): Promise<TPedidoModel> {
		return this.api.Get_DetallePedido(idPedido);
	}

	async copiarLevantamientoToPedido(idLevantamiento: number): Promise<boolean> {
		const respuesta = await this.api.POST_copiarLevantamientoToPedido(idLevantamiento);
		if (respuesta.estado) {
			Mensajes.exito(respuesta.mensaje);
		}
		return respuesta.estado;
	}

	async crearPedido(descripcion: string, fechaEntrega: string): Promise<boolean> {
		const respuesta = await this.api.POST_NuevoPedido(-1, descripcion, fechaEntrega);
		if (respuesta.estado) {
			Mensajes.exito(respuesta.mensaje);
		}
		return respuesta.estado;
	}

	async actualizarPedido(idPedido: number, descripcion: string, fechaEntrega: string): Promise<boolean> {
		const respuesta = await this.api.POST_NuevoPedido(idPedido, descripcion, fechaEntrega);
		if (respuesta.estado) {
			Mensajes.exito(respuesta.mensaje);
		}
		return respuesta.estado;
	}

	async actualizarObservaciones(idPedido: number, descripcion: string, fechaEntrega: string): Promise<boolean> {
		const respuesta = await this.api.POST_NuevoPedido(idPedido, descripcion, fechaEntrega);
		if (respuesta.estado) {
			Mensajes.exito(respuesta.mensaje);
		}
		return respuesta.estado;
	}

	async guardarProductoDePedido(producto: TPedidoProductoModel, mensaje: string = "Producto actualizado."): Promise<boolean> {
		const respuesta = await this.api.POST_AgregarProductoEnPedido(producto);
		if (respuesta.estado) {
			Mensajes.exito(mensaje);
		}
		return respuesta.estado;
	}

	async eliminarProductoDePedido(idPedido: number, codProducto: string): Promise<boolean> {
		const respuesta = await this.api.Delete_ProductoEnPedido(idPedido, codProducto);
		if (respuesta.estado) {
			Mensajes.exito("Producto eliminado.");
		}
		return respuesta.estado;
	}
}

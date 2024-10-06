import Mensajes from "~/helpers/Mensajes";
import type { TProductoDetalleModel } from "../Types/TProductoDetalleExistenciasModel";
import PedidosAPI from "../API/PedidosAPI";
import type { TPedidoDomain, TPedidoModel } from "../_Data/TiposPedidos";

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
}

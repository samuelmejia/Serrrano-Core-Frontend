import Mensajes from "~/helpers/Mensajes";
import type { TProductoModel } from "../Types/TProductoModel";
import LevantamientoAPI from "../API/LevantamientoAPI";
import ProductosAPI from "../API/ProductosAPI";

export default class LevantamientoService {
	api;
	data: Map<string, TProductoModel>;

	constructor() {
		this.api = new LevantamientoAPI();
		this.data = new Map<string, TProductoModel>();
	}

	async loadData(): Promise<void> {
		//Cargar productos que existen en el levantamiento
	}

	async iniciarLevantamiento(): Promise<void> {
		console.log("LevantamientoService -> iniciarLevantamiento");

		const respuesta = await this.api.POST_IniciarLevantamiento();
		if (respuesta.estado) Mensajes.exito(respuesta.mensaje);
		else Mensajes.fallo(respuesta.mensaje);
	}

	async agregarProductoLevantamiento(codigo: string): Promise<void> {
		const producto = this.data.get(codigo);

		if (!!producto) {
			const respuesta = await this.api.POST_QuitarProductoLevantamiento(codigo);

			if (respuesta.estado) {
				producto.estadoAgregado = true;
				this.data.set(codigo, producto);

				await this.getDetalleProducto(producto);
			}
		}
	}

	async quitarProductoLevantamiento(codigo: string): Promise<void> {
		const producto = this.data.get(codigo);

		if (!!producto) {
			const respuesta = await this.api.POST_QuitarProductoLevantamiento(codigo);
			if (respuesta.estado) {
				producto.estadoAgregado = false;
				this.data.set(codigo, producto);
			}
		}
	}

	async getDetalleProducto(producto: TProductoModel): Promise<void> {
		const apiProducto = new ProductosAPI();

		if (!!producto.detalleExistencias) return;

		const detalles = await apiProducto.GET_DetalleProducto(producto.codigo);

		producto.detalleExistencias = detalles;
		this.data.set(producto.codigo, producto);
	}

	getListProductosAgregados(): TProductoModel[] {
		const respuesta = Array.from(this.data.values()).filter((p) => p.estadoAgregado);

		if (!respuesta || respuesta.length === 0) return [];

		return respuesta;
	}

	getCantidadProductosAgregados(): number {
		return Array.from(this.data.values()).filter((p) => p.estadoAgregado).length;
	}
}

import Mensajes from "~/helpers/Mensajes";
import type { TLevantamientoProductoModel, TProductoModel } from "../Types/TProductoModel";
import LevantamientoAPI from "../API/LevantamientoAPI";
import ProductosAPI from "../API/ProductosAPI";
import type { TLevantamientoActualModel } from "../Types/TLevantamientoActualModel";
import TokenAPI from "~/modules/_Module.API/TokenAPI";

export default class LevantamientoService {
	api;
	data: Map<string, TLevantamientoProductoModel>;
	infoLevantamiento = <TLevantamientoActualModel>{};

	constructor() {
		this.api = new LevantamientoAPI();
		this.data = new Map<string, TLevantamientoProductoModel>();
	}

	async loadProductosLevantamiento(): Promise<void> {
		const respuesta = await this.api.GET_GetProductosLevantamiento(this.infoLevantamiento.id);
		if (respuesta.estado && respuesta.body.length > 0) {
			for (let p of <TLevantamientoProductoModel[]>respuesta.body) {
				this.data.set(p.codigo, p);
			}
		}
	}

	async statusLevantamiento(): Promise<boolean> {
		const respuesta = await this.api.POST_StatusLevantamiento();

		if (respuesta.estado && !!respuesta.body) {
			this.infoLevantamiento = respuesta.body;
		}
		return respuesta.estado;
	}

	async iniciarLevantamiento(): Promise<boolean> {
		const respuesta = await this.api.POST_IniciarLevantamiento();
		if (respuesta.estado) Mensajes.exito(respuesta.mensaje);

		return respuesta.estado;
	}

	convertirEnTipoLevantamiento(idLevantamiento: number, producto: TProductoModel): TLevantamientoProductoModel {
		const tiendas = TokenAPI.getPermisosTienda();

		return {
			id: 0,
			idLevantamiento,
			codigo: producto.codigo,
			descripcion: producto.nombre,
			fecha: "",
			hora: "",
			observaciones: "",
			detalleExistencias: [],
			detalles: [],
		};
	}

	async agregarProductoLevantamiento(producto: TProductoModel): Promise<void> {
		const productoLevantamiento = this.convertirEnTipoLevantamiento(this.infoLevantamiento.id, producto);

		if (!!producto && !this.data.has(producto.codigo)) {
			let respuesta = await this.api.POST_AgregarProductoLevantamiento(this.infoLevantamiento.id, productoLevantamiento);

			if (respuesta.estado) {
				this.data.set(productoLevantamiento.codigo, productoLevantamiento);
				this.getDetalleDeProductoEnLevantamiento(productoLevantamiento); //corre asyncronamente
			}
		}
	}

	async quitarProductoLevantamiento(codigo: string): Promise<void> {
		const producto = this.data.get(codigo);

		if (!!producto) {
			const respuesta = await this.api.POST_QuitarProductoLevantamiento(this.infoLevantamiento.id, codigo);
			if (respuesta.estado) {
				this.data.delete(codigo);
			}
		}
	}

	async getDetalleDeProductoEnLevantamiento(producto: TLevantamientoProductoModel): Promise<void> {
		const detalles = await this.api.GET_DetalleProducto(producto.codigo);

		if (!!detalles) {
			producto.detalleExistencias = detalles;
			this.data.set(producto.codigo, producto);
		}
	}

	getListProductosAgregados(): TLevantamientoProductoModel[] {
		return Array.from(this.data.values());
	}

	getCantidadProductosAgregados(): number {
		return this.getListProductosAgregados().length;
	}

	getProductoUnico(codigo: string): TLevantamientoProductoModel | null {
		const encontrado = this.data.get(codigo);

		if (!!encontrado) {
			return encontrado;
		}
		return null;
	}

	async guardarProgresoProducto(producto: TLevantamientoProductoModel): Promise<void> {
		console.log("LevantamientoService -> guardarProgresoProducto");
		//pendiente
	}
}

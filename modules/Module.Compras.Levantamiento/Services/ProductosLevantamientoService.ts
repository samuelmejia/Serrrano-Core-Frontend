import ProductosLevantamientoAPI from "../API/ProductoAPI";
import type { TProductoModel } from "../Types/TProductoModel";

export default class ProductosLevantamientoService {
	api;
	data: Map<string, TProductoModel>;

	constructor() {
		this.api = new ProductosLevantamientoAPI();
		this.data = new Map<string, TProductoModel>();
	}

	async loadData(): Promise<void> {
		const productosIniciales = await this.api.GET_AllProductosGenerales();
		productosIniciales.map((x) => {
			this.data.set(x.codigo, x);
		});
	}

	async filtrarProductos(campoFiltro: string): Promise<void> {
		const nuevosProductos = await this.api.GET_ProductosFiltrado(campoFiltro);

		for (let x of nuevosProductos) {
			if (!this.data.has(x.codigo)) {
				this.data.set(x.codigo, x);
				console.log("agregado");
			}
		}

		console.log("nuevosProductos", nuevosProductos, "this.data", this.data.size);
	}

	getAllProductos(): TProductoModel[] {
		return Array.from(this.data.values());
	}

	async agregarProductoRevision(codigo: string): Promise<void> {
		const producto = this.data.get(codigo);

		if (!!producto) {
			producto.estadoAgregado = true;
			this.data.set(codigo, producto);

			await this.getDetalleProducto(producto);
		}
	}

	async quitarProductoRevision(codigo: string): Promise<void> {
		const producto = this.data.get(codigo);

		if (!!producto) {
			producto.estadoAgregado = false;
			this.data.set(codigo, producto);
		}
	}

	async getDetalleProducto(producto: TProductoModel): Promise<void> {
		if (!!producto.detalleExistencias) return; //ya tiene los detalles

		const detalles = await this.api.GET_DetalleProducto(producto.codigo);

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

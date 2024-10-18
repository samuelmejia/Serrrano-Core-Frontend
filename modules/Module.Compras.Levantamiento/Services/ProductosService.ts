import ProductosLevantamientoAPI from "../API/ProductosAPI";
import type { TProductoModel } from "../Types/TProductoModel";

export default class ProductosService {
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

	async loadPrecargados(idProveedor: string, idMarca: string, modelo: string): Promise<void> {
		const productosIniciales = await this.api.GET_AllProductosPrecargados(idProveedor, idMarca, modelo);
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
	}

	getAllProductos(): TProductoModel[] {
		return Array.from(this.data.values());
	}

	getProductoEspecifico(codigo: string): TProductoModel | undefined {
		return this.data.get(codigo);
	}

	actualizarEstadoProductoListado(codigo: string, estado: boolean): void {
		const productoActual = this.data.get(codigo);
		if (!!productoActual) {
			productoActual.estadoAgregado = estado;
			this.data.set(productoActual.codigo, productoActual);
		}
	}

	//Duplicado en LevantamientoService, pero facilita asignar detalles a un producto asi
	async getDetalleDeProductoEnProductos(producto: TProductoModel): Promise<void> {
		const detalles = await this.api.GET_DetalleProducto(producto.codigo);

		if (!!detalles) {
			producto.detalleExistencias = detalles;
			this.data.set(producto.codigo, producto);
		}
	}
}

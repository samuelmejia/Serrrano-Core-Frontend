import LevantamientoService from "../Services/LevantamientoService";
import ProductosService from "../Services/ProductosService";
import type { TLevantamientoProductoModel, TProductoModel } from "../Types/TProductoModel";

export default class LevantamientoController {
	private static instance: LevantamientoController | null;
	public servicioLevantamiento;
	public servicioProductos;

	private constructor() {
		this.servicioLevantamiento = new LevantamientoService();
		this.servicioProductos = new ProductosService();

		this.estatusLevantamiento();
	}

	public static getInstance(): LevantamientoController {
		if (!LevantamientoController.instance) {
			LevantamientoController.instance = new LevantamientoController();
		}

		return LevantamientoController.instance;
	}

	public static destroyInstance(): void {
		LevantamientoController.instance = null;
	}

	//--------------------------- Levantamiento

	async estatusLevantamiento(): Promise<boolean> {
		return this.servicioLevantamiento.statusLevantamiento();
	}

	async loadProductosLevantamiento(): Promise<void> {
		await this.servicioLevantamiento.loadProductosLevantamiento();
	}

	async iniciarLevantamiento(): Promise<boolean> {
		return this.servicioLevantamiento.iniciarLevantamiento();
	}

	async agregarProductoLevantamiento(producto: TProductoModel): Promise<void> {
		await this.servicioLevantamiento.agregarProductoLevantamiento(producto);

		const encontrado = this.servicioLevantamiento.getProductoUnico(producto.codigo);
		//Si se encuentra significa que si esta en el carrito
		if (!!encontrado) {
			producto.estadoAgregado = true;
			this.servicioProductos.actualizarEstadoProductoListado(producto.codigo, true);
		}
	}

	async quitarProductoLevantamiento(producto: TProductoModel): Promise<void> {
		await this.servicioLevantamiento.quitarProductoLevantamiento(producto.codigo);
	}

	getListProductosAgregadosLevantamiento(): TLevantamientoProductoModel[] {
		return this.servicioLevantamiento.getListProductosAgregados();
	}

	getCantidadProductosAgregadosLevantamiento(): number {
		return this.servicioLevantamiento.getCantidadProductosAgregados();
	}

	async guardarProgresoProducto(producto: TLevantamientoProductoModel): Promise<void> {
		await this.servicioLevantamiento.guardarProgresoProducto(producto);
	}

	//--------------------------- Productos

	async loadDataInicialProductos(): Promise<void> {
		return this.servicioProductos.loadData();
	}

	getAllProductos(): TProductoModel[] {
		return this.servicioProductos.getAllProductos();
	}

	async filtrarProductos(campoFiltro: string): Promise<void> {
		await this.servicioProductos.filtrarProductos(campoFiltro);
	}

	async getDetalleProducto(producto: TProductoModel): Promise<void> {
		await this.servicioProductos.getDetalleProducto(producto);
	}

	actualizarEstadoProductoListado(codigo: string, estado: boolean = true): void {
		this.servicioProductos.actualizarEstadoProductoListado(codigo, estado);
	}

	async getProductoEspecifico(codigo: string): Promise<TProductoModel | null> {
		let productoDevuelto = this.servicioProductos.getProductoEspecifico(codigo);

		//Intento para buscar el producto
		if (!productoDevuelto) {
			await this.servicioProductos.getDetalleProductoById(codigo);
			productoDevuelto = this.servicioProductos.getProductoEspecifico(codigo);
		}

		if (!!productoDevuelto) {
			return productoDevuelto;
		}
		return null;
	}
}

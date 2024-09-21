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

	//--------------------------- Levantamiento

	async estatusLevantamiento(): Promise<boolean> {
		return this.servicioLevantamiento.statusLevantamiento();
	}

	async loadProductosLevantamiento(): Promise<void> {
		await this.servicioLevantamiento.loadData();
	}

	async iniciarLevantamiento(): Promise<void> {
		await this.servicioLevantamiento.iniciarLevantamiento();
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

	async actualizarProductoLevantamiento(producto: TLevantamientoProductoModel): Promise<void> {
		await this.servicioLevantamiento.actualizarProductoLevantamiento(producto);
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

	actualizarEstadoProductoListado(codigo: string): void {
		this.servicioProductos.actualizarEstadoProductoListado(codigo, true);
	}

	getProductoEspecifico(codigo: string): TProductoModel | null {
		const productoDevuelto = this.servicioProductos.getProductoEspecifico(codigo);
		if (!!productoDevuelto) {
			return productoDevuelto;
		}
		return null;
	}
}

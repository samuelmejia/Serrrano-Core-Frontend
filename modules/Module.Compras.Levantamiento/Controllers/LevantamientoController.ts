import LevantamientoService from "../Services/LevantamientoService";
import ProductosService from "../Services/ProductosService";
import type { TProductoModel } from "../Types/TProductoModel";

export default class LevantamientoController {
	private static instance: LevantamientoController | null;
	public servicioLevantamiento;
	public servicioProductos;

	private constructor() {
		this.servicioLevantamiento = new LevantamientoService();
		this.servicioProductos = new ProductosService();
	}

	public static getInstance(): LevantamientoController {
		if (!LevantamientoController.instance) {
			LevantamientoController.instance = new LevantamientoController();
		}

		return LevantamientoController.instance;
	}

	//--------------------------- Levantamiento

	async estatusLevantamiento(): Promise<void> {
		//pendiente, se debe extraer de la BD al abrir la ventana
	}

	async iniciarLevantamiento(): Promise<void> {
		await this.servicioLevantamiento.iniciarLevantamiento();
	}

	async agregarProductoLevantamiento(producto: TProductoModel): Promise<void> {
		await this.servicioLevantamiento.agregarProductoLevantamiento(producto.codigo);
	}

	async quitarProductoLevantamiento(producto: TProductoModel): Promise<void> {
		await this.servicioLevantamiento.quitarProductoLevantamiento(producto.codigo);
	}

	getListProductosAgregadosLevantamiento(): TProductoModel[] {
		return this.servicioLevantamiento.getListProductosAgregados();
	}

	getCantidadProductosAgregadosLevantamiento(): number {
		return this.servicioLevantamiento.getCantidadProductosAgregados();
	}

	async loadProductosLevantamiento(): Promise<void> {
		//pendiente, se debe extraer de la BD cuando ya existe el carrito lleno
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
}

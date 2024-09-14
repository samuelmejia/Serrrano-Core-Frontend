import ProductosLevantamientoService from "../Services/ProductosLevantamientoService";

export default class ComprasLevantamientoController {
	public serviceProductos;

	constructor() {
		this.serviceProductos = new ProductosLevantamientoService();
	}
}

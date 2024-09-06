import type { TProductoLevantamientoModel } from "../types/TProductoLevantamientoModel";
import { dataLevantamiento } from "../_Data/ComprasLevantamiento_Test";
export default class ComprasLevantamientoService {
	data: TProductoLevantamientoModel[];

	constructor() {
		this.data = dataLevantamiento;
	}

	getAllProductos(): TProductoLevantamientoModel[] {
		return this.data;
	}

	cambiarEstadoAgregado(codigo: string): void {
		const producto = this.data.find((p) => p.codigo === codigo);
		if (producto) {
			producto.estadoAgregado = !producto.estadoAgregado;
		}
	}

	getListProductosAgregados(): TProductoLevantamientoModel[] {
		return this.data.filter((p) => p.estadoAgregado);
	}

	getCantidadProductosAgregados(): number {
		return this.data.filter((p) => p.estadoAgregado).length;
	}
}

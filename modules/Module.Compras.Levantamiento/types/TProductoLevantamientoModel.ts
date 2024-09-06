import type { TBodegaModel } from "./TBodegaModel";
import type { TCostosOperacionModel } from "./TCostosOperacionModel";

type TProductoLevantamientoModel = {
	codigo: string;
	nombre: string;
	codigoBarras: string[];
	modelo: string;
	categoria: string;
	marca: string;
	precioVenta: number;
	stockTotal: number;
	estadoAgregado: boolean;
	detalleCostos?: TCostosOperacionModel;
	existenciaBodegas?: TBodegaModel[];
};

export type { TProductoLevantamientoModel };

import type { TProductoDetalleExistenciasModel, TProductoDetalleModel } from "./TProductoDetalleExistenciasModel";

type TProductoModel = {
	codigo: string;
	nombre: string;
	modelo: string;
	linea: string;
	categoria: string;
	marca: string;
	stockTotal: number;
	impuesto: number;
	fechaUltimaCompra: string;
	fechaUltimaVenta: string;
	estadoAgregado: boolean;
	detalleExistencias: TProductoDetalleExistenciasModel[];
};

type TLevantamientoProductoModel = {
	id: number;
	idLevantamiento: number;
	codigo: string;
	descripcion: string;
	fecha: string;
	hora: string;
	observaciones: string;
	detalleExistencias: TProductoDetalleExistenciasModel[];
	detalles: TProductoDetalleModel[];
};

export type { TProductoModel, TLevantamientoProductoModel };

import type { TProductoDetalleModel } from "./TProductoDetalleModel";

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
	detalleExistencias?: TProductoDetalleModel[];
};

type TLevantamientoDomain = {
	id: number;
	fechaCreacion: string;
	horaCreacion: string;
	usuarioResponsable: string;
	ipAddress: string;
	area: string;
	pasillo: string;
	observaciones: string;
	idEstado: string;
};

export type { TProductoModel };

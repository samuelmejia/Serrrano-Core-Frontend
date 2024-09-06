import type { TBodegaModel } from "./TBodegaModel";

type TBodegaRevisadoModel = TBodegaModel & { fecha: string; hora: string; movimiento: number; stockFisico: number };

type TProductoRevisadoModel = {
	codigoProducto: string;
	codigoAlmacen: string;
	stockSistema: number;
	bodegas: TBodegaRevisadoModel[];
};

export type { TProductoRevisadoModel };

type TProductoDetalleExistenciasModel = {
	codigo: string;
	codigoTienda: string;
	nombreTienda: string;
	reservado: number;
	enTransito: number;
	confirmado: number;
	existencia: number;
	disponible: number;
	stockMinimo: number;
	stockMaximo: number;
};

type TProductoDetalleModel = {
	idLevantamiento: number;
	codigoTienda: string;
	nombreTienda: string;
	disponible: number;
	encontrado: number;
	solicitar: number;
};

export type { TProductoDetalleExistenciasModel, TProductoDetalleModel };

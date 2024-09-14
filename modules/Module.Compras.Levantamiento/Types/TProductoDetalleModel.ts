type TProductoDetalleModel = {
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
	movimiento: number;
	encontrado: number;
	solicitado: number;
};

export type { TProductoDetalleModel };

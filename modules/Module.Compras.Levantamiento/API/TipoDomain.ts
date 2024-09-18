type TProductoDomain = {
	id: string;
	nombre: string;
	linea: string;
	categoria: string;
	marca: string;
	impuesto: string;
	stockTotal: number;
	fechaUltimaCompra: string;
	fechaUltimaVenta: string;
	estado: string;
};

type TDetalleProductoDomain = {
	id: string;
	tndID: string;
	tndNombre: string;
	reservado: number;
	enTransito: number;
	confirmado: number;
	existencia: number;
	disponible: number;
	prdStockMinimo: number;
	prdStockMaximo: number;
};

export type { TProductoDomain, TDetalleProductoDomain };

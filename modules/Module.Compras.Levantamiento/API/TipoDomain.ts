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

type TLevantamientoActualDomain = {
	id: number;
	fechaCreacion: string;
	fechaCierre: string | null;
	usuarioResponsable: string;
	ipAddress: string;
	area: string;
	pasillo: string | null;
	observaciones: string | null;
	estado: string;
};

type TProductoLevantamientoDomain = {
	id: number;
	idLevantamiento: number;
	codProducto: string;
	descripcion: string;
	fechaHora: string;
	observaciones: string;
	estado: string;
};

export type { TProductoDomain, TDetalleProductoDomain, TLevantamientoActualDomain, TProductoLevantamientoDomain };

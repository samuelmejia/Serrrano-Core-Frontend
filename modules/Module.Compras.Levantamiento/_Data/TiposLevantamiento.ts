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

type TProductoDetalleDomain = {
	idLevantamientoProducto: number;
	idTiendas: string;
	disponible: number;
	encontrado: number;
	idEstado: number;
	fechaHoraDetalle: string;
};

type TLevantamientoProductoDomain = {
	id: number;
	idLevantamiento: number;
	codProducto: string;
	descripcion: string;
	marca: string;
	fechaHora: string;
	observaciones: string;
	levantamientoDetalle: TProductoDetalleDomain[];
};

export type { TProductoDomain, TDetalleProductoDomain, TProductoDetalleDomain, TLevantamientoActualDomain, TLevantamientoProductoDomain };

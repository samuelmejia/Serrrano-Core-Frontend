type TPedidoDomain = {
	id: number;
	fechaCreacion: string;
	fechaCierre: string;
	descripcion: string;
	usuarioResponsable: string;
	ipAddress: string;
	fechaEntrega: string;
	observaciones: string;
	estado: string;
};

type TPedidoModel = {
	id: number;
	fechaCreacion: string;
	horaCreacion: string;
	fechaCierre: string;
	horaCierre: string;
	descripcion: string;
	usuarioResponsable: string;
	ipAddress: string;
	fechaEntrega: string;
	observaciones: string;
	estado: string;
	productos?: TPedidoProductoModel[];
};

type TPedidoProductoDomain = {
	id: number;
	codProducto: string;
	descripcion: string;
	fechaHora: string;
	fechaEntrega: string;
	cantidad: number;
	observaciones: string;
	idPedido: number;
};

type TPedidoProductoModel = {
	id: number;
	codProducto: string;
	descripcion: string;
	marca: string;
	fecha: string;
	hora: string;
	fechaEntrega: string;
	cantidad: number;
	observaciones: string;
	idPedido: number;
};

export type { TPedidoDomain, TPedidoProductoDomain, TPedidoModel, TPedidoProductoModel };

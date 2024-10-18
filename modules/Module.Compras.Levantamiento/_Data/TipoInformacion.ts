type TInfoProveedorDomain = {
	idProveedor: string;
	nombreProveedor: string;
	direccion: string;
	telefono: string;
	email: string;
	rtn: string;
	activo: string;
};

type TInfoMarcaDomain = {
	idProveedor: string;
	idMarca: number;
	nombreMarca: string;
};

type TEncabezadoKardexDomain = {
	idCategoria: number;
	categoria: string;
	idLinea: number;
	linea: string;
	unidadDeMedida: string;
	empaque: number;
	espesor: number;
	entradas: number;
	compras: number;
	salidas: number;
	ventas: number;
	saldo: number;
};

type TDetalleKardexDomain = {
	linea: number;
	bodega: string;
	docN: string;
	fecha: string;
	hora: string;
	tipo: string;
	tipoKardex: string;
	referencia: string;
	rtnCodigo: string;
	cliente: string;
	cantidad: number;
	piezaCaja: number;
	saldo: number;
};

export type { TInfoProveedorDomain, TInfoMarcaDomain, TEncabezadoKardexDomain, TDetalleKardexDomain };

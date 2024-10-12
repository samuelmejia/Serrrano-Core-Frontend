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
	idMarca: string;
	nombre: string;
};

export type { TInfoProveedorDomain, TInfoMarcaDomain };

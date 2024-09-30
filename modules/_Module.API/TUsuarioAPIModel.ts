type TUsuarioAPIDomain = {
	token: {
		idUsuario: string;
		token: string;
		refreshToken: string;
		expiraTime: number;
		msg: null;
	};
	usuarioTiendas: {
		usuario: string;
		nombre: string;
		idAlmacen: string;
		nombreAlmacen: string;
		status: string;
	}[];
};

type TPermisoTiendaModel = {
	idAlmacen: string;
	nombreAlmacen: string;
};

type TUsuarioAPIModel = {
	token: string;
	refreshToken: string;
	timeExpire: Date;
	idUsuario: string;
	nombre: string;
	usuarioTiendas: TPermisoTiendaModel[];
};

export type { TUsuarioAPIDomain, TUsuarioAPIModel, TPermisoTiendaModel };

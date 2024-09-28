import FetchHeaders from "../_Module.API/_FetchHeaders";
import API from "../_Module.API/API";
import TokenAPI from "../_Module.API/TokenAPI";
import type { TUsuarioAPIDomain, TUsuarioAPIModel } from "../_Module.API/TUsuarioAPIModel";

export default class UsuarioAPI {
	constructor() {
		TokenAPI.getInstance();
	}

	private convertDomainToModel(data: TUsuarioAPIDomain): TUsuarioAPIModel {
		{
			return {
				token: data.token.token,
				timeExpire: data.token.expiraTime,
				idUsuario: data.token.idUsuario,
				nombre: data.usuarioTiendas[0].nombre,
				usuarioTiendas: data.usuarioTiendas.map((tienda) => ({
					idAlmacen: tienda.idAlmacen,
					nombreAlmacen: tienda.nombreAlmacen,
				})),
			};
		}
	}

	async iniciarSesion(email: string, password: string): Promise<{ status: boolean; mensaje: string }> {
		const api = new API();
		const resData = await api.post<TUsuarioAPIDomain>("/Auth", {
			Correo: email,
			Password: password,
		});

		if (!resData) return { status: false, mensaje: "Error al iniciar sesión" };

		if (!!resData) {
			const data = this.convertDomainToModel(resData);

			TokenAPI.setDataToken(data);

			return {
				status: true,
				mensaje: "Usuario autenticado!",
			};
		}

		return {
			status: false,
			mensaje: "",
		};
	}

	async solicitarRestablecerContrasena(email: string) {}

	cerrarSesion() {
		if (!!window) {
			window.localStorage.removeItem(TokenAPI.direccionLS);

			FetchHeaders.deleteInstance();
		}
	}
}

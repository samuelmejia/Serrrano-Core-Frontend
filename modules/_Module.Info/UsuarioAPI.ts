import FetchHeaders from "../_Module.API/_FetchHeaders";
import API from "../_Module.API/API";
import TokenAPI from "../_Module.API/TokenAPI";
import type { TUsuarioAPIDomain, TUsuarioAPIModel } from "../_Module.API/TUsuarioAPIModel";
import { hash } from "spark-md5";

export default class UsuarioAPI {
	constructor() {
		TokenAPI.getInstance();
	}

	private convertDomainToModel(data: TUsuarioAPIDomain): TUsuarioAPIModel {
		{
			let tiempoExpiracion = new Date();
			tiempoExpiracion.setSeconds(tiempoExpiracion.getSeconds() + data.token.expiraTime);

			return {
				token: data.token.token,
				refreshToken: data.token.refreshToken,
				timeExpire: tiempoExpiracion,
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
			Usuario: email,
			Password: hash(password),
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

	async refreshToken() {
		const api = new API();
		const resData = await api.post<TUsuarioAPIDomain>("/Auth", {
			refresh_token: TokenAPI.getRefreshToken(),
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

	cerrarSesion() {
		if (!!window) {
			window.localStorage.removeItem(TokenAPI.direccionLS);

			FetchHeaders.deleteInstance();
		}
	}
}

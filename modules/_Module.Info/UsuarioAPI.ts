import FetchHeaders from "~/Modules/_Module.API/_FetchHeaders";
import TokenAPI from "~/Modules/_Module.API/TokenAPI";
import RuntimeService from "~/services/RuntimeService";
import type { TUsuarioAPIModel } from "~/Modules/_Module.API/TUsuarioAPIModel";

export default class UsuarioAPI {
	private baseURL = "";

	constructor() {
		this.baseURL = RuntimeService.getConfig().public.BASE_URL;
		TokenAPI.getInstance();
	}

	async iniciarSesion(email: string, password: string): Promise<{ status: boolean; mensaje: string }> {
		const REST_API_INICIAR_SESION = `${this.baseURL}/api/Auth`;

		try {
			const response = await fetch(REST_API_INICIAR_SESION, {
				method: "POST",
				headers: FetchHeaders.headers,
				body: JSON.stringify({
					Correo: email,
					Password: password,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw data;
			}

			let dataToken: TUsuarioAPIModel = {
				token: data.access_token,
				timeExpire: data.expires_at,
				usuario: data.usuario,
			};

			TokenAPI.setDataToken(dataToken);

			return {
				status: true,
				mensaje: "ok",
			};
		} catch (e: any) {
			console.log("ERR:: iniciarSesion::", e.error_description);
			return {
				status: false,
				mensaje: e.mensaje,
			};
		}
	}

	async solicitarRestablecerContrasena(email: string) {
		const REST_API_SOLICITAR = `${this.baseURL}/auth/v1/recover`;

		try {
			const response = await fetch(REST_API_SOLICITAR, {
				method: "POST",
				headers: FetchHeaders.headers,
				body: JSON.stringify({
					email: email,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw data;
			}

			return {
				status: true,
				mensaje: "ok",
			};
		} catch (e: any) {
			console.log("ERR:: solicitarRestablecerContrasena::", e.error_description);
			return {
				status: false,
				mensaje: e.error_description,
			};
		}
	}

	cerrarSesion() {
		if (!!window) {
			window.localStorage.removeItem(TokenAPI.direccionLS);

			FetchHeaders.deleteInstance();
		}
	}
}

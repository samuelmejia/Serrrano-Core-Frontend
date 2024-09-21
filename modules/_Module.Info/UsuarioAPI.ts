import Mensajes from "~/helpers/Mensajes";
import FetchHeaders from "../_Module.API/_FetchHeaders";
import API from "../_Module.API/API";
import TokenAPI from "../_Module.API/TokenAPI";
import type { TUsuarioAPIModel } from "../_Module.API/TUsuarioAPIModel";

/*import FetchHeaders from "~/Modules/_Module.API/_FetchHeaders";
import TokenAPI from "~/Modules/_Module.API/TokenAPI";
import RuntimeService from "~/services/RuntimeService";
import API from "../_Module.API/API";
*/

type TRespuestaAuth = {
	idUsuario: string;
	token: string;
	refreshToken: string;
	expiraTime: string;
	msg: string;
};

export default class UsuarioAPI {
	constructor() {
		TokenAPI.getInstance();
	}

	async iniciarSesion(email: string, password: string): Promise<{ status: boolean; mensaje: string }> {
		const api = new API();
		const resData = await api.post<TRespuestaAuth>("/Auth", {
			Correo: "test@gmail.com",
			Password: "test",
		});

		if (!!resData) {
			let dataToken: TUsuarioAPIModel = {
				token: resData.token,
				timeExpire: 50000, //TODO: obtener el tiempo correcto
				usuario: resData.idUsuario,
			};

			TokenAPI.setDataToken(dataToken);

			return {
				status: true,
				mensaje: resData.msg,
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

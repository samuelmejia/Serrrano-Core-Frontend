import type { TUsuarioAPIModel } from "./TUsuarioAPIModel";
import FetchHeaders from "./_FetchHeaders";

type TDataUsuario = {
	contraseña: null;
	correo: string;
	id: number;
	idRol: number;
	nombre: string;
};

export type { TDataUsuario };

export default class TokenAPI {
	private static instance: TokenAPI | null = null;

	static direccionLS = "data-token";
	private constructor() {}

	public static getInstance(): TokenAPI {
		if (this.instance === null) {
			this.instance = new TokenAPI();
		}
		return this.instance;
	}

	static setDataToken(data: TUsuarioAPIModel) {
		if (!!window) {
			window.localStorage.setItem(TokenAPI.direccionLS, JSON.stringify(data));
			FetchHeaders.actualizarTokenEnHeaders();
		}
	}

	static setToken(token: string) {
		if (!!window) {
			window.localStorage.setItem(TokenAPI.direccionLS, token);
			FetchHeaders.actualizarTokenEnHeaders();
		}
	}

	static hasToken(): boolean {
		return TokenAPI.getToken().length > 0;
	}

	static getToken(): string {
		const dataJSON = window.localStorage.getItem(TokenAPI.direccionLS) || "{}";
		const dataToken = <TUsuarioAPIModel>JSON.parse(dataJSON);

		return dataToken.token || "";
	}

	static getUsuario(): TDataUsuario {
		const dataJSON = window.localStorage.getItem(TokenAPI.direccionLS) || "{}";
		const dataToken = <TUsuarioAPIModel>JSON.parse(dataJSON);

		return <TDataUsuario>dataToken.usuario;
	}

	static getMinutosRestantes(): number {
		const dataJSON = window.localStorage.getItem(TokenAPI.direccionLS) || "{}";
		const dataToken = <TUsuarioAPIModel>JSON.parse(dataJSON);

		const fechaActual = new Date();
		const fechaExpiracion = new Date(dataToken.timeExpire);

		console.log("fechaActual", fechaActual);
		console.log("dataToken.timeExpire", dataToken.timeExpire);
		console.log("fechaExpiracion", fechaExpiracion);

		const diferencia = fechaExpiracion.getTime() - fechaActual.getTime();

		if (isNaN(diferencia)) return 0;

		return Math.floor(diferencia / (1000 * 60));
	}
}

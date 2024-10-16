import type { THeaders } from "./_THeaders";
import RuntimeService from "~/services/RuntimeService";
import TokenAPI from "./TokenAPI";

export default class FetchHeaders {
	private static instance: FetchHeaders | null = null;

	static restURL = "";
	static baseURL = "";
	static headers: THeaders = {
		"Content-Type": "application/json",
	};

	private constructor() {
		FetchHeaders.headers["apikey"];
		const inicioRuta = +location.hostname.substring(0, location.hostname.indexOf("."));
		/*
		45: ubicado en la publica
		 0: localhost
		10: ubicado en la interna
		*/

		FetchHeaders.baseURL = inicioRuta == 45 || inicioRuta == 0 ? RuntimeService.getConfig().public.BASE_URL_PUBLICA : RuntimeService.getConfig().public.BASE_URL_INTERNA;
	}

	public static getInstance() {
		if (this.instance === null) {
			this.instance = new FetchHeaders();
		}

		return this.instance;
	}

	static actualizarTokenEnHeaders() {
		const token = TokenAPI.getToken();

		if (token != "") {
			FetchHeaders.headers["Authorization"] = `Bearer ${token}`;
		} else {
			console.log("jwtToken no existente");
		}
	}

	static deleteInstance() {
		FetchHeaders.instance = null;
	}
}

import Mensajes from "~/helpers/Mensajes";
import FetchHeaders from "./_FetchHeaders";
import type { THeaders } from "./_THeaders";

type RouteConfig<T> = {
	ruta: string;
	method: "GET" | "POST" | "PUT" | "DELETE";
	catch?: any;
};

export default class API {
	private baseRestURL: string = "";
	private rutas: Map<string, RouteConfig<any>> = new Map();

	constructor() {
		FetchHeaders.getInstance();
		FetchHeaders.actualizarTokenEnHeaders();
		this.baseRestURL = FetchHeaders.baseURL;
	}

	public set<T>(nombre: string, config: RouteConfig<T>): void {
		this.rutas.set(nombre, config);
	}

	public async get<T>(nombreRuta: string, objectParams: THeaders = {}): Promise<T | null> {
		if (!nombreRuta || nombreRuta.length == 0) {
			throw new Error(`La ruta ${nombreRuta} no está definida.`);
		}

		let url = `${this.baseRestURL}${nombreRuta}`;

		if (Object.keys(objectParams).length > 0) {
			const queryParam = new URLSearchParams(objectParams);
			url = `${this.baseRestURL}${nombreRuta}?${queryParam}`;
		}

		const options: RequestInit = {
			method: "GET",
			headers: FetchHeaders.headers,
		};

		try {
			const response = await fetch(url, options);

			if (!response.ok) {
				throw new (await response.json())();
			}

			const data: T = await response.json();
			return data;
		} catch (error: any) {
			console.log(`ERR_GET:: en la ruta ${nombreRuta}:`, error);
			return null;
		}
	}

	public async post<T>(nombreRuta: string, bodyData: any = null): Promise<T | null> {
		if (!nombreRuta || nombreRuta.length == 0) {
			throw new Error(`La ruta ${nombreRuta} no está definida.`);
		}

		const url = `${this.baseRestURL}${nombreRuta}`;

		const options: RequestInit = {
			method: "POST",
			headers: FetchHeaders.headers,
		};

		if (bodyData != null) {
			options.body = JSON.stringify(bodyData);
		}

		try {
			const response = await fetch(url, options);

			if (!response.ok) {
				throw await response.json();
			}

			const data: T = await response.json();
			return data;
		} catch (error: any) {
			Mensajes.fallo(error);
			console.error(`ERR_POST:: en la ruta ${nombreRuta}:`, error);
			return null;
		}
	}

	public async patch<T>(nombreRuta: string, bodyData: any): Promise<T | null> {
		if (!nombreRuta || nombreRuta.length == 0) {
			throw new Error(`La ruta ${nombreRuta} no está definida.`);
		}

		const url = `${this.baseRestURL}${nombreRuta}`;

		const options: RequestInit = {
			method: "PUT",
			headers: FetchHeaders.headers,
			body: JSON.stringify(bodyData),
		};

		try {
			const response = await fetch(url, options);

			if (!response.ok) {
				throw await response.json();
			}

			const data: T = await response.json();
			return data;
		} catch (error: any) {
			console.error(`ERR_PUT:: en la ruta ${nombreRuta}:`, error);
			return null;
		}
	}

	public async delete<T>(nombreRuta: string, bodyData: any): Promise<T | null> {
		if (!nombreRuta || nombreRuta.length == 0) {
			throw new Error(`La ruta ${nombreRuta} no está definida.`);
		}

		const url = `${this.baseRestURL}${nombreRuta}`;

		const options: RequestInit = {
			method: "DELETE",
			headers: FetchHeaders.headers,
			body: JSON.stringify(bodyData),
		};

		try {
			const response = await fetch(url, options);

			if (!response.ok) {
				throw (await response.json())();
			}

			const data: T = await response.json();
			return data;
		} catch (error: any) {
			console.log("error", error);
			console.error(`ERR_DELETE:: en la ruta ${nombreRuta}:`, error);

			Mensajes.fallo(error.message);
			return null;
		}
	}
}

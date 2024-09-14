import FetchHeaders from "~/modules/_Module.API/_FetchHeaders";
import ServiceAPI from "~/modules/_Module.API/ServiceAPI";

export default class BodegasLevantamientoAPI extends ServiceAPI {
	constructor() {
		super();
		FetchHeaders.getInstance();
	}

	async GET_AllBodegas(): Promise<any[]> {
		try {
			const response = await fetch(``, {
				method: "GET",
				headers: FetchHeaders.headers,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new data();
			}

			return [];
		} catch (e: any) {
			console.log("ERR::ProductosLevantamientoAPI.GET_AllBodegas", e);
			return [];
		}
	}
}

import FetchHeaders from "~/modules/_Module.API/_FetchHeaders";
import API from "~/modules/_Module.API/API";

export default class BodegasLevantamientoAPI {
	constructor() {}

	async GET_AllBodegas(): Promise<any[] | null> {
		const api = new API();
		const resData = api.get<any[]>("");

		if (!!resData) {
			return resData;
		}
		return [];
	}
}

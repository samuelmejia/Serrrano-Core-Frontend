import FetchHeaders from "./_FetchHeaders";
import type { THeaders } from "./_THeaders";

export default class ServiceAPI {
	protected restURL = "";
	protected headers = <THeaders>{};

	constructor() {
		FetchHeaders.getInstance();

		this.headers = FetchHeaders.headers;
		this.restURL = FetchHeaders.restURL;
	}
}

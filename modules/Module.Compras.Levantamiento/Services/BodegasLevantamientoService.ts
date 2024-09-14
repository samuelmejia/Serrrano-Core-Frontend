import type { TBodegaModel } from "../Types/TBodegaModel";
import { dataBodegas } from "../_Data/Bodegas_Test";

export default class BodegasLevantamientoService {
	data: TBodegaModel[];

	constructor() {
		this.data = [];
	}

	async loadData(): Promise<void> {
		this.data = await dataBodegas;

		return;
	}

	getAllBodegas(): TBodegaModel[] {
		return this.data;
	}
}

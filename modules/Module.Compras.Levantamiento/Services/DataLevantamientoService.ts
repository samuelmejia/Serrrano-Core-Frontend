type TData = {
	id: number;
	descripcion: string;
};

export default class DataLevantamientoService {
	private data: TData[];

	constructor() {
		const arr = [
			{ id: 4, descripcion: "SOLICITAR" },
			{ id: 5, descripcion: "NO SOLICITAR" },
			{ id: 6, descripcion: "DESCONTINUADO" },
		];

		this.data = arr;
	}

	getEstadosProductoLevantamiento(): TData[] {
		return this.data;
	}
}

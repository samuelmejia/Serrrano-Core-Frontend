export default class Numeros {
	static convertirDecimal(valor: number, decimales: number) {
		return new Intl.NumberFormat("es-HN", { style: "decimal", minimumFractionDigits: decimales, maximumFractionDigits: decimales }).format(valor);
	}

	static convertirEnPorcentaje(val: number, simbolo: boolean = false): string {
		let simbolo_positivo = "";
		if (simbolo) {
			simbolo_positivo = val > 0 ? "+" : "";
		}

		return simbolo_positivo + Math.floor(val * 100) + "%";
	}

	static formatoComplejo(value: number, decimales: number = 1) {
		if (isNaN(value)) {
			return "Invalid number";
		}

		value = Number(value);

		if (value >= 1_000_000_000) {
			const formattedValue = +(value / 1_000_000).toFixed(decimales);
			return `${Numeros.convertirDecimal(formattedValue, decimales)} Mll`;
		}
		if (value >= 10_000_000) {
			const formattedValue = +(value / 1_000_000).toFixed(decimales);
			return `${Numeros.convertirDecimal(formattedValue, decimales)} Mll`;
		} else if (value >= 1_000_000) {
			const formattedValue = (value / 1_000_000).toFixed(decimales);
			return `${formattedValue} Mll`;
		} else if (value >= 1_000) {
			return Numeros.convertirDecimal(value, decimales);
		} else {
			return Numeros.convertirDecimal(value, 2);
		}
	}
}

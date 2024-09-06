export default class Texto {
	static limitarTexto(texto: string, limite: number) {
		return texto.length > limite ? texto.substring(0, limite) + "..." : texto;
	}
}

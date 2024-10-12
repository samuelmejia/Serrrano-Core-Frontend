import Mensajes from "~/helpers/Mensajes";
import type { TLevantamientoProductoModel, TProductoModel } from "../Types/TProductoModel";
import LevantamientoAPI from "../API/LevantamientoAPI";
import ProductosAPI from "../API/ProductosAPI";
import type { TLevantamientoActualModel } from "../Types/TLevantamientoActualModel";
import TokenAPI from "~/modules/_Module.API/TokenAPI";
import type { TProductoDetalleModel } from "../Types/TProductoDetalleExistenciasModel";

export default class LevantamientoService {
	api;
	data: Map<string, TLevantamientoProductoModel>;
	infoLevantamiento = <TLevantamientoActualModel>{};

	constructor() {
		this.api = new LevantamientoAPI();
		this.data = new Map<string, TLevantamientoProductoModel>();
	}

	async loadProductosLevantamiento(): Promise<void> {
		const respuesta = await this.api.GET_GetProductosLevantamiento(this.infoLevantamiento.id);
		if (respuesta.estado && respuesta.body.length > 0) {
			for (let p of <TLevantamientoProductoModel[]>respuesta.body) {
				this.data.set(p.codigo, p);
			}
		}

		console.log("Productos en levantamiento", this.getListProductosAgregados());
	}

	async statusLevantamiento(): Promise<boolean> {
		const respuesta = await this.api.POST_StatusLevantamiento();

		if (respuesta.estado && !!respuesta.body) {
			this.infoLevantamiento = respuesta.body;
		}
		return respuesta.estado;
	}

	async iniciarLevantamiento(): Promise<boolean> {
		const respuesta = await this.api.POST_IniciarLevantamiento();
		if (respuesta.estado) Mensajes.exito(respuesta.mensaje);

		return respuesta.estado;
	}

	convertirEnTipoLevantamiento(idLevantamiento: number, producto: TProductoModel): TLevantamientoProductoModel {
		const tiendas = TokenAPI.getPermisosTienda();

		return {
			id: 0,
			idLevantamiento,
			codigo: producto.codigo,
			descripcion: producto.nombre,
			marca: producto.marca || "",
			fecha: "",
			hora: "",
			observaciones: "",
			detalleExistencias: [],
			detalles: [],
		};
	}

	async agregarProductoLevantamiento(producto: TProductoModel): Promise<void> {
		const productoLevantamiento = this.convertirEnTipoLevantamiento(this.infoLevantamiento.id, producto);

		if (!!producto && !this.data.has(producto.codigo)) {
			let respuesta = await this.api.POST_AgregarProductoLevantamiento(this.infoLevantamiento.id, productoLevantamiento);

			if (respuesta.estado) {
				this.data.set(productoLevantamiento.codigo, productoLevantamiento);
				this.getDetalleDeProductoEnLevantamiento(productoLevantamiento); //corre asyncronamente
			}
		}
	}

	async quitarProductoLevantamiento(codigo: string): Promise<void> {
		const producto = this.data.get(codigo);

		if (!!producto) {
			const respuesta = await this.api.POST_QuitarProductoLevantamiento(this.infoLevantamiento.id, codigo);
			if (respuesta.estado) {
				this.data.delete(codigo);
			}
		}
	}

	async getDetalleDeProductoEnLevantamiento(producto: TLevantamientoProductoModel): Promise<void> {
		const detalles = await this.api.GET_DetalleProducto(producto.codigo);

		console.log("detalles consultados", detalles);
		console.log("detalles en memoria", producto.detalles);

		const detallesEscritos = detalles.map((d) => {
			const encontrado = producto.detalles.find((x) => x.codigoTienda == d.codigoTienda);
			if (!!encontrado) {
				return <TProductoDetalleModel>{
					idLevantamiento: producto.id,
					codigoTienda: d.codigoTienda,
					nombreTienda: d.nombreTienda,
					disponible: d.disponible,
					encontrado: encontrado.encontrado,
					solicitar: encontrado.solicitar,
				};
			} else {
				return <TProductoDetalleModel>{
					idLevantamiento: producto.id,
					codigoTienda: d.codigoTienda,
					nombreTienda: d.nombreTienda,
					disponible: d.disponible,
					encontrado: 0,
					solicitar: 0,
				};
			}
		});

		if (!!detalles) {
			producto.detalleExistencias = detalles;
			producto.detalles = detallesEscritos;
			this.data.set(producto.codigo, producto);
		}
	}

	getListProductosAgregados(): TLevantamientoProductoModel[] {
		return Array.from(this.data.values());
	}

	getCantidadProductosAgregados(): number {
		return this.getListProductosAgregados().length;
	}

	getProductoUnico(codigo: string): TLevantamientoProductoModel | null {
		const encontrado = this.data.get(codigo);

		if (!!encontrado) {
			return encontrado;
		}
		return null;
	}

	construirDetalleProducto(producto: TLevantamientoProductoModel, idAlmacenesPermitidos: string[]): void {
		const detalles: TProductoDetalleModel[] = [];

		for (let existencias of producto.detalleExistencias) {
			if (idAlmacenesPermitidos.includes(existencias.codigoTienda)) {
				detalles.push({
					idLevantamiento: this.infoLevantamiento.id,
					codigoTienda: existencias.codigoTienda,
					nombreTienda: existencias.nombreTienda,
					disponible: existencias.disponible,
					encontrado: 0,
					solicitar: 0,
				});
			}
		}
		producto.detalles = detalles;
		this.data.set(producto.codigo, producto);
	}

	actualizarRegistroDetalleDeProducto(producto: TLevantamientoProductoModel, detalles: TProductoDetalleModel): void {
		const productoEncontrado = this.data.get(producto.codigo);

		if (!!productoEncontrado) {
			const detalleEncontrado = productoEncontrado.detalles.find((d) => d.codigoTienda == detalles.codigoTienda);

			if (!!detalleEncontrado) {
				productoEncontrado.detalles = productoEncontrado.detalles.map((d) => (d.codigoTienda == detalles.codigoTienda ? detalles : d));
				this.data.set(producto.codigo, productoEncontrado);
			}
		}
	}

	async guardarProgresoProducto(producto: TLevantamientoProductoModel): Promise<void> {
		this.api.POST_GuardarProgresoProducto(producto);
	}

	async guardarProgresoProductosTodos(): Promise<void> {
		const respuesta = await this.api.POST_GuardarProgresoTodos(this.getListProductosAgregados());
		if (respuesta.estado) Mensajes.exito("Progreso de todos los productos guardado exitosamente.");
	}

	async finalizarLevantamiento(idLevantamiento: number, area: string, pasillo: string, observaciones: string): Promise<boolean> {
		const body = {
			id: idLevantamiento,
			area: area,
			pasillo: pasillo,
			observaciones: observaciones,
			estado: 3,
		};

		const respuesta = await this.api.POST_FinalizarLevantamiento(body);
		if (respuesta.estado) {
			Mensajes.exito("Levantamiento finalizado exitosamente.");
			this.data.clear();
			this.infoLevantamiento = <TLevantamientoActualModel>{};
		}
		return respuesta.estado;
	}
}

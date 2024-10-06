import Mensajes from "~/helpers/Mensajes";
import type { TLevantamientoProductoModel, TProductoModel } from "../Types/TProductoModel";
import LevantamientoAPI from "../API/LevantamientoAPI";
import ProductosAPI from "../API/ProductosAPI";
import type { TLevantamientoActualModel } from "../Types/TLevantamientoActualModel";
import TokenAPI from "~/modules/_Module.API/TokenAPI";
import type { TProductoDetalleModel } from "../Types/TProductoDetalleExistenciasModel";
import LevantamientoHistoricoAPI from "../API/LevantamientoHistoricoAPI";

export default class LevantamientoHistorialService {
	api;
	dataLevantamientos: TLevantamientoActualModel[];
	data: Map<string, TLevantamientoProductoModel>;
	infoLevantamiento = <TLevantamientoActualModel>{};

	constructor() {
		this.api = new LevantamientoHistoricoAPI();
		this.dataLevantamientos = [];
		this.data = new Map<string, TLevantamientoProductoModel>();
	}

	async loadLevantamientos(): Promise<void> {
		this.dataLevantamientos = await this.api.GET_GetAllLevantamientos();

		console.log("Historico de Levantamientos cargados", this.getListLevantamientos());
	}

	getListLevantamientos(): TLevantamientoActualModel[] {
		return this.dataLevantamientos;
	}

	getListLevantamientoFiltrado(idEstado: number): Promise<TLevantamientoActualModel[]> {
		return this.api.GET_GetAllLevantamientosFiltrados(idEstado);
	}

	async loadInfoLevantamiento(idLevantamiento: number): Promise<void> {
		const encontrado = this.dataLevantamientos.find((x) => x.id === idLevantamiento);

		if (!!encontrado) {
			this.infoLevantamiento = encontrado;
		}
	}

	async loadProductosLevantamiento(idLevantamiento: number): Promise<void> {
		const respuesta = await this.api.GET_GetProductosLevantamiento(idLevantamiento);
		if (respuesta.estado && respuesta.body.length > 0) {
			for (let p of <TLevantamientoProductoModel[]>respuesta.body) {
				this.data.set(p.codigo, p);
			}
		}

		console.log("Productos en levantamiento", this.getListProductosAgregados());
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

	async actualizarLevantamiento(idLevantamiento: number, area: string, pasillo: string, observaciones: string, idEstado: number): Promise<boolean> {
		const body = {
			id: idLevantamiento,
			area: area,
			pasillo: pasillo,
			observaciones: observaciones,
			estado: idEstado,
		};

		const respuesta = await this.api.POST_ActualizarLevantamiento(body);
		if (respuesta.estado) {
			Mensajes.exito("Levantamiento actualizado.");
			this.data.clear();
			this.infoLevantamiento = <TLevantamientoActualModel>{};
		}
		return respuesta.estado;
	}

	async copiarLevantamientoToPedido(idLevantamiento: number): Promise<boolean> {
		const respuesta = await this.api.POST_copiarLevantamientoToPedido(idLevantamiento);
		if (respuesta.estado) {
			Mensajes.exito("Copia generada.");
		}
		return respuesta.estado;
	}
}

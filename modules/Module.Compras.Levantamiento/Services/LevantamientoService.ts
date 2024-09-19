import Mensajes from "~/helpers/Mensajes";
import type { TProductoModel } from "../Types/TProductoModel";
import LevantamientoAPI from "../API/LevantamientoAPI";
import ProductosAPI from "../API/ProductosAPI";
import type { TLevantamientoActualDomain } from "../API/TipoDomain";
import Fechas from "~/helpers/Fechas";
import type { TLevantamientoActualModel } from "../Types/TLevantamientoActualModel";
import { useStoreLevantamientoProductos } from "./useStoreLevantamientoProductos";

export default class LevantamientoService {
	api;
	data: Map<string, TProductoModel>;
	infoLevantamiento = <TLevantamientoActualModel>{};

	constructor() {
		this.api = new LevantamientoAPI();
		this.data = new Map<string, TProductoModel>();

		const storeProductos = useStoreLevantamientoProductos();

		if (!!storeProductos.get && storeProductos.get.length > 0)
			for (let p of storeProductos.get) {
				this.data.set(p.codigo, p);
			}
	}

	async loadData(): Promise<void> {
		//Cargar productos que existen en el levantamiento
	}

	async statusLevantamiento(): Promise<boolean> {
		const respuesta = await this.api.POST_StatusLevantamiento();

		//levantamientoActual
		let lA = <TLevantamientoActualModel>{};

		if (respuesta.estado && !!respuesta.body) {
			const b = respuesta.body;
			(lA.area = b.area),
				(lA.id = b.id),
				(lA.fechaCreacion = b.fechaCreacion ? Fechas.Date_To_String(new Date(b.fechaCreacion)) : ""),
				(lA.horaCreacion = b.fechaCreacion ? Fechas.Time_To_String(new Date(b.fechaCreacion)) : ""),
				(lA.fechaCierre = b.fechaCierre ? Fechas.Date_To_String(new Date(b.fechaCierre)) : ""),
				(lA.horaCierre = b.fechaCierre ? Fechas.Time_To_String(new Date(b.fechaCierre)) : ""),
				(lA.usuarioResponsable = b.usuarioResponsable),
				(lA.ipAddress = b.ipAddress),
				(lA.area = b.area),
				(lA.pasillo = b.pasillo || ""),
				(lA.observaciones = b.observaciones || ""),
				(lA.estado = b.estado);
		}

		this.infoLevantamiento = lA;

		return respuesta.estado;
	}

	async iniciarLevantamiento(): Promise<void> {
		console.log("LevantamientoService -> iniciarLevantamiento");

		const respuesta = await this.api.POST_IniciarLevantamiento();
		if (respuesta.estado) Mensajes.exito(respuesta.mensaje);
		else Mensajes.fallo(respuesta.mensaje);
	}

	async agregarProductoLevantamiento(producto: TProductoModel): Promise<void> {
		console.log("LevantamientoService -> agregarProductoLevantamiento");
		if (!!producto) {
			/*
			const respuesta = await this.api.POST_AgregarProductoLevantamiento(codigo);

			if (respuesta.estado) {
				producto.estadoAgregado = true;
				this.data.set(codigo, producto);

				await this.getDetalleProducto(producto);
			}
			*/

			producto.estadoAgregado = true;
			this.data.set(producto.codigo, producto);

			await this.getDetalleProducto(producto);

			const storeProductos = useStoreLevantamientoProductos();
			storeProductos.set(this.getListProductosAgregados());
		}
	}

	async quitarProductoLevantamiento(codigo: string): Promise<void> {
		const producto = this.data.get(codigo);

		if (!!producto) {
			/*
			const respuesta = await this.api.POST_QuitarProductoLevantamiento(codigo);
			if (respuesta.estado) {
				producto.estadoAgregado = false;
				this.data.set(codigo, producto);
			}*/

			producto.estadoAgregado = false;
			this.data.set(codigo, producto);
			const storeProductos = useStoreLevantamientoProductos();
			storeProductos.set(this.getListProductosAgregados());
		}
	}

	async getDetalleProducto(producto: TProductoModel): Promise<void> {
		const apiProducto = new ProductosAPI();

		if (!!producto.detalleExistencias) return;

		const detalles = await apiProducto.GET_DetalleProducto(producto.codigo);

		producto.detalleExistencias = detalles;
		this.data.set(producto.codigo, producto);
	}

	getListProductosAgregados(): TProductoModel[] {
		const respuesta = Array.from(this.data.values()).filter((p) => p.estadoAgregado);

		if (!respuesta || respuesta.length === 0) return [];

		return respuesta;
	}

	getCantidadProductosAgregados(): number {
		return Array.from(this.data.values()).filter((p) => p.estadoAgregado).length;
	}
}

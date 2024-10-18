<script setup lang="ts">
import type { CheckboxValueType } from "element-plus";

import type { TLevantamientoProductoModel, TProductoModel } from "~/modules/Module.Compras.Levantamiento/Types/TProductoModel";
import type { TProductoDetalleModel } from "~/modules/Module.Compras.Levantamiento/Types/TProductoDetalleExistenciasModel";
import TokenAPI from "~/modules/_Module.API/TokenAPI";
import type { TPermisoTiendaModel } from "~/modules/_Module.API/TUsuarioAPIModel";
import LevantamientoHistorialService from "~/modules/Module.Compras.Levantamiento/Services/LevantamientoHistorialService";
import type { TLevantamientoActualModel } from "~/modules/Module.Compras.Levantamiento/Types/TLevantamientoActualModel";
import { EstadoSolicitarStore } from "~/modules/Module.Compras.Levantamiento/API/EstadoSolicitarStore";

import { useWindowSize } from "@vueuse/core";
import PedidosService from "~/modules/Module.Compras.Gestiones/services/PedidosService";
import type { TPedidoModel, TPedidoProductoModel } from "~/modules/Module.Compras.Gestiones/_data/TiposPedidos";
import Texto from "~/helpers/Texto";
import Mensajes from "~/helpers/Mensajes";
import Fechas from "~/helpers/Fechas";
const { width, height } = useWindowSize();
const storeEstadoSolicitar = EstadoSolicitarStore();
storeEstadoSolicitar.load();

//COMUNICACION DE COMPONENTE
const props = defineProps<{
	infoLevantamiento: TLevantamientoActualModel;
}>();

const emit = defineEmits(["actualizar-lista"]);

//VARIABLES REACTIVAS
const stampReactivo = ref(0);
const stampActualizacionDetalles = ref(0);

const servicioPedidos = new PedidosService();
const servicioHistorico = new LevantamientoHistorialService();

const chkTrabajarPedidos = ref(false);
const listPedidosAbiertos = ref<TPedidoModel[]>([]);
let dataRevision = <TLevantamientoProductoModel[]>[];

servicioHistorico.loadProductosLevantamiento(props.infoLevantamiento.id).then(() => {
	dataRevision = servicioHistorico.getListProductosAgregados();
	console.log("dataRevision", dataRevision);
	stampReactivo.value++;
});

servicioPedidos.getListPedidosFiltrado("", 9).then((data) => {
	listPedidosAbiertos.value = data;
});

const productoVisualizado = ref<TLevantamientoProductoModel | null>(dataRevision[0]);

function cambiarProductoMostrado(producto: TLevantamientoProductoModel) {
	productoVisualizado.value = producto;
	stampActualizacionDetalles.value++;
}

const defaultPageRevision = ref<number | null>(null);

const checkAll = ref(false);
const indeterminate = ref(false);
const valoresChecks = ref<CheckboxValueType[]>([]);
const bodegasExistentes = ref<TPermisoTiendaModel[]>(TokenAPI.getPermisosTienda());

watch(valoresChecks, (val) => {
	if (val.length === 0) {
		checkAll.value = false;
		indeterminate.value = false;
	} else if (val.length === bodegasExistentes.value.length) {
		checkAll.value = true;
		indeterminate.value = false;
	} else {
		indeterminate.value = true;
	}
});

const mostrarCopiaPedidoModal = ref(false);
const mostrarEnviarProductoToPedidoModal = ref(false);

const productoMandar = ref<TLevantamientoProductoModel | null>(null);
const pedidoActualTrabajado = ref<string>(""); //string porque se utiliza en select
const infoPedidoMostrar = ref<TPedidoModel | null>(null);
const cantidadMandar = ref<number>(0);

function mandarProductoToPedido(producto: TLevantamientoProductoModel) {
	if (pedidoActualTrabajado.value == "0" || pedidoActualTrabajado.value == "") {
		Mensajes.fallo("Debe seleccionar un pedido para mandar el producto");
		return;
	}

	productoMandar.value = producto;
	infoPedidoMostrar.value = listPedidosAbiertos.value.find((x) => x.id == +pedidoActualTrabajado.value) ?? null;
	cantidadMandar.value = 0;
	mostrarEnviarProductoToPedidoModal.value = true;
}

type TDataEstado = {
	id: string;
	descripcion: string;
};

const listaEstados: TDataEstado[] = [
	{ id: "3", descripcion: "FINALIZADO" },
	{ id: "7", descripcion: "APROBADO" },
	{ id: "8", descripcion: "DECLINADO" },
];

const mostrarEstadoLevantamientoModal = ref(false);

const estadoPorModificar = ref<string>(listaEstados.find((x) => x.descripcion == props.infoLevantamiento.estado)?.id ?? "");

async function cambiarEstado() {
	const inf = props.infoLevantamiento;
	const respuesta = await servicioHistorico.actualizarLevantamiento(inf.id, inf.area, inf.pasillo, inf.observaciones, +estadoPorModificar.value);

	if (respuesta) {
		mostrarEstadoLevantamientoModal.value = false;
		emit("actualizar-lista");
	}
}

async function generarCopiadoLevantamientoToPedido() {
	await servicioPedidos.copiarLevantamientoToPedido(props.infoLevantamiento.id);
	emit("actualizar-lista");
}

async function enviarProductoToPedido() {
	const producto = productoMandar.value;
	const pedido = infoPedidoMostrar.value;

	if (!producto || !pedido) {
		Mensajes.fallo("No se ha seleccionado un producto o pedido");
		return;
	}

	let productoPedido: TPedidoProductoModel = {
		id: producto.id,
		codProducto: producto.codigo,
		descripcion: producto.descripcion,
		marca: producto.marca,
		fecha: Fechas.Date_To_String(new Date()),
		hora: Fechas.Time_To_String(new Date()),
		fechaEntrega: "2024-12-31",
		cantidad: cantidadMandar.value,
		observaciones: producto.observaciones,
		idPedido: pedido.id,
	};
	await servicioPedidos.guardarProductoDePedido(productoPedido, "Producto agregado a Pedido.");
	mostrarEnviarProductoToPedidoModal.value = false;
}
</script>

<template>
	<div class="grid" style="grid-template-columns: 70% 25%; column-gap: 5%">
		<div class="grid" :class="width <= 900 ? 'grid-cols-6 gap-2' : 'grid-cols-12 gap-6'">
			<div class="col-span-6 sm:col-span-3">
				<label for="product-name" class="text-sm font-medium text-gray-900 block mb-1">Creador</label>
				<input
					type="text"
					:value="props.infoLevantamiento.usuarioResponsable"
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full px-2 py-1 text-center"
				/>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="category" class="text-sm font-medium text-gray-900 block mb-1">Fecha Creación</label>
				<input
					type="text"
					:value="props.infoLevantamiento.fechaCreacion"
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full px-2 py-1 text-center"
				/>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="brand" class="text-sm font-medium text-gray-900 block mb-1">Area</label>
				<input
					type="text"
					:value="props.infoLevantamiento.area"
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full px-2 py-1"
				/>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="price" class="text-sm font-medium text-gray-900 block mb-1">Pasillo</label>
				<input
					type="text"
					:value="props.infoLevantamiento.pasillo"
					class="text-center shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full px-2 py-1"
				/>
			</div>
		</div>
		<div v-if="props.infoLevantamiento.estado != 'DECLINADO'">
			<div class="text-sm font-medium text-gray-900 mb-1 flex gap-x-4">
				<label for="pedido-trabajar" class="text-sm font-medium text-gray-900 flex items-center">
					<input type="checkbox" id="pedido-trabajar" v-model="chkTrabajarPedidos" class="border" />
					<span class="select-none">Trabajar con Pedidos</span>
				</label>
				<div class="flex items-center">
					<el-tooltip class="box-item" effect="dark" content="Click para generar una copia de todo el Levantamiento hacia Pedido" placement="top">
						<span :disabled="!chkTrabajarPedidos" @click="chkTrabajarPedidos ? (mostrarCopiaPedidoModal = true) : ''"
							><i class="far fa-clipboard" :class="!chkTrabajarPedidos ? 'text-gray-200' : 'text-gray-900 hover:text-gray-500'"></i
						></span>
					</el-tooltip>
				</div>
			</div>
			<select class="bg-blue-100 py-1 mb-1 px-1 border rounded" v-model="pedidoActualTrabajado" :disabled="!chkTrabajarPedidos">
				<option value="">----</option>
				<template v-for="pedido of listPedidosAbiertos">
					<option :value="pedido.id">{{ Texto.limitarTexto(pedido.descripcion, 30) }}</option>
				</template>
			</select>
		</div>
	</div>
	<br />
	<div class="grid grid-paneles-carrito">
		<div :key="stampReactivo">
			<TableFull
				:espacio-botones="true"
				:usar-filtrado-externo="false"
				:page-size="10"
				:default-page="defaultPageRevision"
				tam-campo-busqueda="60%"
				v-if="!!dataRevision"
				:data-recibida="dataRevision"
				:filter="[{ descripcion: 'string' }]"
			>
				<template v-slot:thead="{ th }">
					<tr style="font-size: 0.9rem" class="bg-gray-50 text-gray-700 px-2 py-2 select-none grid" :class="chkTrabajarPedidos ? 'tr-tabla-revision' : 'tr-tabla-revision-compacta'">
						<th>CODIGO</th>
						<th>NOMBRE</th>
						<th>MARCA</th>
						<th v-if="chkTrabajarPedidos">MANDAR</th>
					</tr>
				</template>
				<template v-slot:tbody="{ dataMostrada, paginaActual }">
					<tr
						class="grid py-1 cursor-pointer hover:bg-gray-200"
						:class="chkTrabajarPedidos ? 'tr-tabla-revision' : 'tr-tabla-revision-compacta'"
						style="font-size: 0.9rem"
						v-for="row of <TLevantamientoProductoModel[]>dataMostrada"
						@click="cambiarProductoMostrado(row)"
					>
						<td class="flex items-center justify-center">{{ row.codigo }}</td>
						<td class="text-left">
							<p>{{ row.descripcion }}</p>
						</td>
						<td>{{ row.marca }}</td>
						<td v-if="chkTrabajarPedidos" class="text-center">
							<el-button type="info" size="small" plain @click="mandarProductoToPedido(row)"><i class="fas fa-paper-plane"></i></el-button>
						</td>
					</tr>
				</template>
			</TableFull>
			<section class="my-2 w-full flex gap-x-4">
				<div class="flex flex-col w-fit">
					<b>Estado Levantamiento: </b>
					<el-tooltip class="box-item" effect="dark" content="Click para cambiar estado" placement="top">
						<span @click="mostrarEstadoLevantamientoModal = true" class="border py-1 px-2 text-center cursor-pointer">{{ props.infoLevantamiento.estado }}</span>
					</el-tooltip>
				</div>
			</section>
		</div>
		<div>
			<TableFull :espacio-botones="true" :key="stampActualizacionDetalles" :usar-filtrado-externo="false" :page-size="10" v-if="!!productoVisualizado" :data-recibida="productoVisualizado.detalles">
				<template #botones> </template>
				<template #thead="{ th }">
					<tr style="font-size: 0.9rem" class="bg-gray-50 text-gray-700 py-2 select-none grid tr-tabla-detalles">
						<th>UBICACION</th>
						<th>DISP.</th>
						<th>ENCONT.</th>
						<th>SOLICITADO</th>
					</tr>
				</template>
				<template v-slot:tbody="{ dataMostrada }">
					<tr :key="row.codigoTienda" class="grid py-1 tr-tabla-detalles" style="font-size: 0.9rem" v-for="row of <TProductoDetalleModel[]>dataMostrada">
						<td class="text-left pl-2">
							{{ TokenAPI.getPermisosTienda().find((bodega) => bodega.idAlmacen == row.codigoTienda)?.nombreAlmacen }}
						</td>
						<td class="text-center">{{ row.disponible }}</td>
						<td class="px-2">
							<input type="text" class="text-center py-1 border-black" :value="row.encontrado" style="width: 100%" />
						</td>
						<td class="px-2">
							<input type="text" class="text-center py-1 border" :value="storeEstadoSolicitar.get.find((x) => x.id == row.solicitar)?.descripcion" style="width: 100%" />
						</td>
					</tr>
				</template>
			</TableFull>
			<fieldset v-if="!!productoVisualizado" style="border: 1px solid #e5e7eb" class="px-4 py-2">
				<legend class="px-1 font-bold">Información Producto</legend>
				<div class="grid" style="grid-template-columns: 50% 50%">
					<div class="flex flex-col">
						<span><b>Código: </b> {{ productoVisualizado.codigo }}</span>

						<span><b>Nombre: </b> {{ productoVisualizado.descripcion }}</span>
					</div>

					<div class="flex flex-col">
						<b>Observaciones:</b>
						<textarea v-model="productoVisualizado.observaciones" class="border w-full bg-yellow-100" readonly></textarea>
					</div>
				</div>
			</fieldset>
		</div>
	</div>

	<el-dialog v-model="mostrarEstadoLevantamientoModal" title="Cambiar Estado de Levantamiento" :width="width >= 900 ? '30%' : '60%'">
		<main class="flex flex-col gap-y-2 items-end">
			<el-select v-model="estadoPorModificar" placeholder="Seleccione un estado" clearable>
				<el-option v-for="estado of listaEstados" :key="estado.id" :label="estado.descripcion" :value="estado.id" />
			</el-select>
			<el-button class="w-min" type="success" @click="cambiarEstado">Cambiar</el-button>
		</main>
	</el-dialog>

	<el-dialog v-model="mostrarCopiaPedidoModal" title="Generar Copia" :width="width >= 900 ? '30%' : '60%'">
		<main class="flex flex-col gap-y-2 items-end">
			<p class="w-full text-center">¿Proceder a crear una copia a partir de todos los elementos SOLICITADOS de este Levantamiento?</p>
			<el-button class="w-min" type="success" @click="generarCopiadoLevantamientoToPedido">Aceptar</el-button>
		</main>
	</el-dialog>

	<el-dialog v-model="mostrarEnviarProductoToPedidoModal" title="Enviar a Pedido" :width="width >= 900 ? '30%' : '60%'" top="8vh">
		<main class="flex flex-col gap-y-2" v-if="!!infoPedidoMostrar && !!productoMandar">
			<div class="col-span-6 sm:col-span-3">
				<label for="product-name" class="text-sm font-medium text-gray-900 block mb-1">Descripción</label>
				<input
					type="text"
					:value="infoPedidoMostrar.descripcion"
					readonly
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full px-2 py-1 text-center"
				/>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="category" class="text-sm font-medium text-gray-900 block mb-1">Fecha Creación</label>
				<input
					type="text"
					:value="infoPedidoMostrar.fechaCreacion"
					readonly
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full px-2 py-1 text-center"
				/>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="category" class="text-sm font-medium text-gray-900 block mb-1">Responsable</label>
				<input
					type="text"
					:value="infoPedidoMostrar.usuarioResponsable"
					readonly
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full px-2 py-1 text-center"
				/>
			</div>
			<br />
			<br />
			<div class="col-span-6 sm:col-span-3">
				<label for="category" class="text-sm font-medium text-gray-900 block mb-1">Código</label>
				<input
					type="text"
					:value="productoMandar.codigo"
					readonly
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full px-2 py-1 text-center"
				/>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="category" class="text-sm font-medium text-gray-900 block mb-1">Descripción</label>
				<input
					type="text"
					:value="productoMandar.descripcion"
					readonly
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full px-2 py-1 text-center"
				/>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="category" class="text-sm font-medium text-gray-900 block mb-1">Marca</label>
				<input
					type="text"
					:value="productoMandar.marca"
					readonly
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full px-2 py-1 text-center"
				/>
			</div>
			<div class="grid items-end" style="grid-template-columns: 50% 50%">
				<div>
					<label for="category" class="text-sm font-medium text-gray-900 block mb-1">Cantidad</label>
					<input type="text" v-model="cantidadMandar" class="shadow-sm border border-gray-300 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full px-2 py-1 text-center" />
				</div>
				<div class="flex justify-end pt-2">
					<el-button class="w-min" @click="enviarProductoToPedido" type="success">Guardar</el-button>
				</div>
			</div>
		</main>
	</el-dialog>
</template>

<style lang="scss">
.el-dialog__headerbtn {
	background-color: #e222;

	.el-icon.el-dialog__close {
		color: #111;
	}
	.el-icon.el-dialog__close:hover {
		color: #f00;
	}
}

.el-select-dropdown.is-multiple .el-select-dropdown__item.is-selected {
	color: #ea580caa !important;
}

.el-select-dropdown.is-multiple .el-select-dropdown__item.is-selected::after {
	background-color: #ea580caa !important;
}
</style>

<style lang="css" scoped>
.grid-paneles-carrito {
	grid-template-columns: 58% 41%;
	column-gap: 1%;
}

@media screen and (max-width: 900px) {
	.grid-paneles-carrito {
		grid-template-columns: 100%;
		row-gap: 1%;
	}
}

.tr-tabla-revision {
	grid-template-columns: 1fr 5fr 1fr 1fr;
	font-size: 0.9rem !important;
}

.tr-tabla-revision-compacta {
	grid-template-columns: 1fr 5fr 1fr;
	font-size: 0.9rem !important;
}

.tr-tabla-detalles {
	grid-template-columns: 3fr 1fr 1fr 2fr;
	font-size: 0.9rem !important;
}

.tr-detalles_no-usar {
	color: #bbb;

	input[type="text"] {
		user-select: none;
	}
	select {
		filter: opacity(0.1);
		user-select: none;
	}
}
</style>

<script setup lang="ts">
import { Delete as IconDelete } from "@element-plus/icons-vue";

import type { CheckboxValueType } from "element-plus";

import TokenAPI from "~/modules/_Module.API/TokenAPI";
import type { TPermisoTiendaModel } from "~/modules/_Module.API/TUsuarioAPIModel";
import { EstadoSolicitarStore } from "~/modules/Module.Compras.Levantamiento/API/EstadoSolicitarStore";

import { useWindowSize } from "@vueuse/core";
import type { TPedidoDomain, TPedidoModel, TPedidoProductoModel } from "~/modules/Module.Compras.Gestiones/_data/TiposPedidos";
import PedidosService from "~/modules/Module.Compras.Gestiones/services/PedidosService";
import Mensajes from "~/helpers/Mensajes";
import Fechas from "~/helpers/Fechas";
const { width, height } = useWindowSize();
const storeEstadoSolicitar = EstadoSolicitarStore();
storeEstadoSolicitar.load();

//COMUNICACION DE COMPONENTE
const props = defineProps<{
	infoPedido: TPedidoDomain;
}>();

//VARIABLES REACTIVAS
const stampReactivo = ref(0);

const servicioPedido = new PedidosService();

const dataRevision = ref<TPedidoModel | null>(null);

function obtenerProductosPedidos() {
	servicioPedido.getPedidoConProductos(props.infoPedido.id).then((data) => {
		dataRevision.value = data;
		stampReactivo.value++;
	});
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

const mostrarDetallesModal = ref(false);

type TDataEstado = {
	id: string;
	descripcion: string;
};

const listaEstados: TDataEstado[] = [
	{ id: "9", descripcion: "ABIERTO" },
	{ id: "10", descripcion: "EN ESPERA" },
	{ id: "11", descripcion: "CANCELADO" },
	{ id: "12", descripcion: "CERRADO" },
];

const mostrarEstadoLevantamientoModal = ref(false);

const estadoPorModificar = ref<string>(listaEstados.find((x) => x.descripcion == props.infoPedido.estado)?.id ?? "");

function cambiarEstado() {
	mostrarEstadoLevantamientoModal.value = false;
	console.log("estadoPorModificar", estadoPorModificar.value);
}

function ingresoPedido(detalle: TPedidoProductoModel, origen: string) {}

async function guardarRegistro(producto: TPedidoProductoModel) {
	await servicioPedido.guardarProductoDePedido(producto);
	obtenerProductosPedidos();
}

async function quitarRegistro(producto: TPedidoProductoModel) {
	await servicioPedido.eliminarProductoDePedido(props.infoPedido.id, producto.codProducto);
	obtenerProductosPedidos();
}

async function guardardatosPedido() {
	const fE = Fechas.Date_To_String(new Date(datePickerPedido.value));
	await servicioPedido.actualizarPedido(props.infoPedido.id, descripcion.value, fE);
}

onMounted(() => {
	obtenerProductosPedidos();
});

const input3 = ref("");

const descripcion = ref("");
const datePickerPedido = ref("");

onMounted(() => {
	if (props.infoPedido.fechaEntrega) {
		datePickerPedido.value = props.infoPedido.fechaEntrega;
	}
	descripcion.value = props.infoPedido.descripcion;
});
</script>

<template>
	<div class="grid">
		<div class="grid" :class="width <= 900 ? 'grid-cols-6 gap-2' : 'grid-cols-12 gap-6'">
			<div class="col-span-6 sm:col-span-2">
				<label for="product-name" class="text-sm font-medium text-gray-900 block mb-1">Creador</label>
				<input
					type="text"
					:value="props.infoPedido.usuarioResponsable"
					readonly
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full px-2 py-1 text-center"
				/>
			</div>
			<div class="col-span-6 sm:col-span-2">
				<label class="text-sm font-medium text-gray-900 block mb-1">Fecha Creación</label>
				<input
					type="text"
					:value="props.infoPedido.fechaCreacion"
					readonly
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full px-2 py-1 text-center"
				/>
			</div>
			<div class="col-span-6 sm:col-span-4">
				<label class="text-sm font-medium text-gray-900 block mb-1">Descripción</label>
				<input
					type="text"
					:value="props.infoPedido.descripcion"
					class="shadow-sm bg-green-100 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full px-2 py-1 text-center"
				/>
			</div>
			<div class="col-span-6 sm:col-span-2">
				<label class="text-sm font-medium text-gray-900 block mb-1">Fecha Entrega</label>

				<el-date-picker v-model="datePickerPedido" class="bg-green-100" type="date" placeholder="Fecha" />
			</div>
			<div class="col-span-6 sm:col-span-2 flex flex-col items-center">
				<label class="text-sm font-medium text-gray-900 block mb-1">Guardar</label>
				<el-button type="info" @click="guardardatosPedido" plain><i class="fas fa-save"></i></el-button>
			</div>
		</div>
	</div>
	<br />
	<div class="grid grid-paneles-carrito">
		<div :key="stampReactivo">
			<TableFull
				:espacio-botones="true"
				:usar-filtrado-externo="false"
				:page-size="7"
				:default-page="defaultPageRevision"
				tam-campo-busqueda="60%"
				v-if="!!dataRevision?.productos"
				:data-recibida="dataRevision.productos"
				:filter="[{ descripcion: 'string' }]"
			>
				<template v-slot:thead="{ th }">
					<tr style="font-size: 0.9rem" class="bg-gray-50 text-gray-700 px-2 py-2 select-none grid tr-tabla-revision">
						<th>CODIGO</th>
						<th>DESCRIPCION</th>
						<th>MARCA</th>
						<th>INF.P</th>
						<th>CANTIDAD</th>
						<th>OBSERVACIONES</th>
						<th>GUARDAR</th>
						<th>ELIMINAR</th>
					</tr>
				</template>
				<template v-slot:tbody="{ dataMostrada, paginaActual }">
					<tr class="grid py-1 cursor-pointer hover:bg-gray-200 tr-tabla-revision" style="font-size: 0.9rem" v-for="row of <TPedidoProductoModel[]>dataMostrada">
						<td class="flex items-center justify-center">{{ row.codProducto }}</td>
						<td class="text-left">
							<input type="text" class="p-1 border border-black" v-model="row.descripcion" @input="ingresoPedido(row, 'observaciones')" style="width: 100%" />
						</td>
						<td class="text-center">
							{{ row.marca }}
						</td>
						<td class="text-center">
							<a tabindex="-1" :href="`/inventario/info-producto?codProducto=${row.codProducto}`" target="_blank">
								<el-button tabindex="-1" type="info" plain><i class="fas fa-external-link-alt"></i></el-button>
							</a>
						</td>
						<td class="text-left">
							<input type="text" class="text-center py-1 border border-black" v-model="row.cantidad" @input="ingresoPedido(row, 'cantidad')" style="width: 100%" />
						</td>
						<td class="text-left px-2">
							<input type="text" class="text-center py-1 border border-black" v-model="row.observaciones" @input="ingresoPedido(row, 'observaciones')" style="width: 100%" />
						</td>
						<td class="text-center">
							<el-button @click="guardarRegistro(row)" type="success" plain><i class="fas fa-save"></i></el-button>
						</td>
						<td class="text-center">
							<el-button type="danger" @click="quitarRegistro(row)" :icon="IconDelete" circle />
						</td>
					</tr>
				</template>
			</TableFull>
			<section class="my-2 grid" style="grid-template-columns: 60% 40%">
				<div class="flex flex-col w-min">
					<b>Estado: </b>
					<el-tooltip class="box-item" effect="dark" content="Click para cambiar estado" placement="top">
						<span @click="mostrarEstadoLevantamientoModal = true" class="cursor-pointer">{{ props.infoPedido.estado }}</span>
					</el-tooltip>
				</div>
				<div>
					<b>Observaciones: </b>
					<textarea class="w-full p-1 bg-yellow-100" v-model="props.infoPedido.observaciones"></textarea>
				</div>
			</section>
		</div>
		<div></div>
	</div>

	<el-dialog v-model="mostrarEstadoLevantamientoModal" title="Cambiar Estado de Pedido" width="500">
		<main class="flex flex-col gap-y-2 items-end">
			<el-select v-model="estadoPorModificar" placeholder="Seleccione un estado" clearable>
				<el-option v-for="estado of listaEstados" :key="estado.id" :label="estado.descripcion" :value="estado.id" />
			</el-select>
			<el-button class="w-min" type="success" @click="cambiarEstado">Cambiar</el-button>
		</main>
	</el-dialog>

	<el-dialog v-model="mostrarDetallesModal" title="Detalle de Producto" width="80%">
		<div style="border-top: 1px solid gray" class="mt-0 pt-4"></div>
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
	grid-template-columns: 100%;
}

@media screen and (max-width: 900px) {
	.grid-paneles-carrito {
		grid-template-columns: 100%;
		row-gap: 1%;
	}
}

.tr-tabla-revision {
	grid-template-columns: 1fr 5fr 1fr 1fr 1fr 2fr 1fr 1fr;
	font-size: 0.9rem;
}
</style>

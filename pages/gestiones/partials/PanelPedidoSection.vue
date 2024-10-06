<script setup lang="ts">
import type { CheckboxValueType } from "element-plus";

import TokenAPI from "~/modules/_Module.API/TokenAPI";
import type { TPermisoTiendaModel } from "~/modules/_Module.API/TUsuarioAPIModel";
import { EstadoSolicitarStore } from "~/modules/Module.Compras.Levantamiento/API/EstadoSolicitarStore";

import { useWindowSize } from "@vueuse/core";
import type { TPedidoDomain, TPedidoModel, TPedidoProductoModel } from "~/modules/Module.Compras.Levantamiento/_Data/TiposPedidos";
import PedidosService from "~/modules/Module.Compras.Levantamiento/Services/PedidosService";
const { width, height } = useWindowSize();
const storeEstadoSolicitar = EstadoSolicitarStore();
storeEstadoSolicitar.load();

//COMUNICACION DE COMPONENTE
const props = defineProps<{
	infoLevantamiento: TPedidoDomain;
}>();

//VARIABLES REACTIVAS
const stampReactivo = ref(0);
const stampActualizacionDetalles = ref(0);
const stampActualizacionExistencias = ref(0);

const servicioPedido = new PedidosService();

const dataRevision = ref<TPedidoModel | null>(null);

servicioPedido.getPedidoConProductos(props.infoLevantamiento.id).then((data) => {
	dataRevision.value = data;
	stampReactivo.value++;
});

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
	{ id: "3", descripcion: "FINALIZADO" },
	{ id: "7", descripcion: "APROBADO" },
	{ id: "8", descripcion: "DECLINADO" },
];

const mostrarEstadoLevantamientoModal = ref(false);

const estadoPorModificar = ref<string>(listaEstados.find((x) => x.descripcion == props.infoLevantamiento.estado)?.id ?? "");

function cambiarEstado() {
	mostrarEstadoLevantamientoModal.value = false;
	console.log("estadoPorModificar", estadoPorModificar.value);
}

function ingresoPedido(detalle: TPedidoProductoModel, origen: string) {}
</script>

<template>
	<div class="grid">
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
				v-if="!!dataRevision?.productos"
				:data-recibida="dataRevision.productos"
				:filter="[{ descripcion: 'string' }]"
			>
				<template v-slot:thead="{ th }">
					<tr style="font-size: 0.9rem" class="bg-gray-50 text-gray-700 px-2 py-2 select-none grid tr-tabla-revision">
						<th>CODIGO</th>
						<th>DESCRIPCION</th>
						<th>MARCA</th>
						<th>KARDEX</th>
						<th>CANTIDAD</th>
						<th>OBSERVACIONES</th>
						<th>GUARDAR</th>
					</tr>
				</template>
				<template v-slot:tbody="{ dataMostrada, paginaActual }">
					<tr class="grid py-1 cursor-pointer hover:bg-gray-200 tr-tabla-revision" style="font-size: 0.9rem" v-for="row of <TPedidoProductoModel[]>dataMostrada">
						<td class="flex items-center justify-center">{{ row.codProducto }}</td>
						<td class="text-left">
							<input type="text" class="p-1 border border-black" v-model="row.descripcion" @input="ingresoPedido(row, 'observaciones')" style="width: 100%" />
						</td>
						<td class="text-left">
							{{ row.marca }}
						</td>
						<td class="text-center">
							<a :href="`/inventario/kardex?codProducto=${row.codProducto}`" target="_blank">
								<el-button type="info" plain><i class="fas fa-external-link-alt"></i></el-button>
							</a>
						</td>
						<td class="text-left">
							<input type="text" class="text-center py-1 border border-black" v-model="row.cantidad" @input="ingresoPedido(row, 'cantidad')" style="width: 100%" />
						</td>
						<td class="text-left px-2">
							<input type="text" class="text-center py-1 border border-black" v-model="row.observaciones" @input="ingresoPedido(row, 'observaciones')" style="width: 100%" />
						</td>
						<td class="text-center">
							<el-button type="success" plain><i class="fas fa-save"></i></el-button>
						</td>
					</tr>
				</template>
			</TableFull>
			<section class="my-2">
				<div class="flex flex-col w-min">
					<b>Estado: </b>
					<el-tooltip class="box-item" effect="dark" content="Click para cambiar estado" placement="top">
						<span @click="mostrarEstadoLevantamientoModal = true" class="cursor-pointer">{{ props.infoLevantamiento.estado }}</span>
					</el-tooltip>
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
	grid-template-columns: 1fr 4fr 1fr 1fr 1fr 2fr 1fr;
	font-size: 0.9rem;
}
</style>

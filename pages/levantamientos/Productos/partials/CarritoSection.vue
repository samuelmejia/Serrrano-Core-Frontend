<script setup lang="ts">
import DetallesProductoModal from "~/components/Compras.Levantamiento/DetallesProductoModal.vue";

import { Delete as IconDelete } from "@element-plus/icons-vue";
import type { CheckboxValueType } from "element-plus";

import type { TLevantamientoProductoModel, TProductoModel } from "~/modules/Module.Compras.Levantamiento/Types/TProductoModel";
import type { TProductoDetalleExistenciasModel, TProductoDetalleModel } from "~/modules/Module.Compras.Levantamiento/Types/TProductoDetalleExistenciasModel";
import LevantamientoController from "~/modules/Module.Compras.Levantamiento/Controllers/LevantamientoController";
import TokenAPI from "~/modules/_Module.API/TokenAPI";
import type { TPermisoTiendaModel } from "~/modules/_Module.API/TUsuarioAPIModel";
import Mensajes from "~/helpers/Mensajes";

import { EstadoSolicitarStore } from "~/modules/Module.Compras.Levantamiento/API/EstadoSolicitarStore";

import { useWindowSize } from "@vueuse/core";

const { width, height } = useWindowSize();
const storeEstadoSolicitar = EstadoSolicitarStore();
storeEstadoSolicitar.load();

const controller = LevantamientoController.getInstance();

//COMUNICACION DE COMPONENTE
const props = defineProps<{
	stampReactivo: number;
}>();

const emit = defineEmits(["emitProductoQuitadoLevantamiento"]);

watch(
	() => props.stampReactivo,
	() => {
		dataRevision = controller.servicioLevantamiento.getListProductosAgregados();
	}
);

let dataRevision = controller.servicioLevantamiento.getListProductosAgregados();

//VARIABLES REACTIVAS
const stampActualizacionDetalles = ref(0);
const stampActualizacionExistencias = ref(0);

const productoVisualizado = ref<TLevantamientoProductoModel | null>(dataRevision[0]);

function contruirDetallesEncontrado(producto: TLevantamientoProductoModel) {
	const almacenesPermitidos = TokenAPI.getPermisosTienda().map((x) => x.idAlmacen);
	controller.servicioLevantamiento.construirDetalleProducto(producto, almacenesPermitidos);
}

function cambiarProductoMostrado(producto: TLevantamientoProductoModel) {
	productoVisualizado.value = producto;
	stampActualizacionDetalles.value++;
}

const defaultPageRevision = ref<number | null>(null);

async function quitarDeLevantamiento(producto: TLevantamientoProductoModel, paginaActual: number) {
	defaultPageRevision.value = paginaActual;

	await controller.servicioLevantamiento.quitarProductoLevantamiento(producto.codigo);
	dataRevision = controller.servicioLevantamiento.getListProductosAgregados();
	emit("emitProductoQuitadoLevantamiento", producto);

	setTimeout(() => {
		defaultPageRevision.value = null;
		productoVisualizado.value = null;
		stampActualizacionDetalles.value++;
	}, 500);
}

const checkAll = ref(false);
const indeterminate = ref(false);
const valoresChecks = ref<CheckboxValueType[]>([]);
const bodegasExistentes = ref<TPermisoTiendaModel[]>(TokenAPI.getPermisosTienda());

/*
const bodegasExistentes = [
	{
		value: "0101",
		label: "(1) TIENDA PRINCIPAL",
	},
	{
		value: "0102",
		label: "(2) BODEGA PRINCIPAL",
	},
	{
		value: "0103",
		label: "(3) PINTURA",
	},
	{
		value: "0104",
		label: "(4) PATIO SUCURSAL",
	},
	{
		value: "0105",
		label: "(5) MADERA",
	},
	{
		value: "0106",
		label: "(6) CAJA RAPIDA",
	},
	{
		value: "0107",
		label: "(7) WILLIE WARREN",
	},
	{
		value: "0108",
		label: "INVENTATIO EN BIP",
	},
];*/

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

const handleCheckAll = (val: CheckboxValueType) => {
	indeterminate.value = false;
	if (val) {
		valoresChecks.value = bodegasExistentes.value.map((x) => x.idAlmacen);
	} else {
		valoresChecks.value = [];
	}
};

onMounted(() => {
	handleCheckAll(true);

	console.log("dataRevision[0]", dataRevision[0]);

	controller.getDetalleDeProductoEnLevantamiento(dataRevision[0]).then(() => {
		productoVisualizado.value = dataRevision[0];
		stampActualizacionDetalles.value++;
	});

	for (let producto of dataRevision) {
		controller.getDetalleDeProductoEnLevantamiento(producto);
	}
});

function finalizarRevision() {
	mostrarPanelFinalizar.value = true;
}

async function completarProcesoFinalizar() {
	//Mensajes.fallo(`Funcion no implementada: ${controller.servicioLevantamiento.infoLevantamiento.id} ${JSON.stringify(dataFinalizar.value)}`);
	const idLevantamiento = controller.servicioLevantamiento.infoLevantamiento.id;
	const dF = dataFinalizar.value;

	const respuesta = await controller.servicioLevantamiento.finalizarLevantamiento(idLevantamiento, dF.area, dF.pasillo, dF.observaciones);
	if (respuesta) {
		setTimeout(() => {
			location.reload();
		}, 1000);
	} else {
		Mensajes.fallo("Error al finalizar el levantamiento");
	}
}

function guardarProgreso() {
	controller.servicioLevantamiento.guardarProgresoProductosTodos();
}

const mostrarDetallesModal = ref(false);
const productoMostrarDetalle = ref(<TLevantamientoProductoModel>{});

function verDetalleProducto(producto: TLevantamientoProductoModel) {
	productoMostrarDetalle.value = producto;
	stampActualizacionExistencias.value++;

	mostrarDetallesModal.value = true;
}

function ingresoProducto(detalle: TProductoDetalleModel, origen: string) {
	if (!!productoVisualizado.value && !!productoVisualizado.value.detalles) {
		const index = productoVisualizado.value.detalles.findIndex((x) => x.codigoTienda == detalle.codigoTienda);
		productoVisualizado.value.detalles[index] = detalle;
		controller.servicioLevantamiento.actualizarRegistroDetalleDeProducto(productoVisualizado.value, detalle);
	}
}

const mostrarPanelFinalizar = ref(false);
const dataFinalizar = ref({
	area: "",
	pasillo: "",
	observaciones: "",
});
</script>

<template>
	<div style="border-top: 1px solid gray" class="mb-4"></div>
	<div class="grid" style="grid-template-columns: 54% 45%; column-gap: 1%">
		<div class="flex items-center space-x-2"></div>
		<div class="flex select-none justify-between py-2">
			<div class="flex items-end py-1">
				<div @click="guardarProgreso" class="cursor-pointer select-none flex justify-start space-x-2 text-white bg-[#67c23a] px-4 hover:bg-[#7d4]">
					<span class="menu-hover my-1 py-1"> Guardar Progreso </span>
				</div>
			</div>
			<div class="group relative cursor-pointer py-1">
				<div class="flex items-center justify-between space-x-2 text-white bg-orange-400 px-4 hover:bg-orange-300">
					<span class="menu-hover my-1 py-1"> Opciones </span>
					<i class="fas fa-ellipsis-v"></i>
				</div>

				<div class="invisible absolute z-50 flex w-full flex-col bg-gray-100 text-gray-800 shadow-xl group-hover:visible">
					<a @click="finalizarRevision" class="block border-b border-gray-100 px-2 py-1 text-gray-500 hover:text-white hover:bg-orange-500">Finalizar</a>

					<!--
					<a @click="finalizarAnular" class="block border-b border-gray-100 px-2 py-1 text-gray-500 hover:text-white hover:bg-orange-500">Anular Todo</a>
					-->
				</div>
			</div>
		</div>
	</div>
	<div class="grid grid-paneles-carrito">
		<TableFull
			:espacio-botones="true"
			:key="props.stampReactivo"
			:usar-filtrado-externo="false"
			:page-size="5"
			:default-page="defaultPageRevision"
			tam-campo-busqueda="60%"
			v-if="!!dataRevision"
			:data-recibida="dataRevision"
			:filter="[{ nombre: 'string' }]"
		>
			<template v-slot:thead="{ th }">
				<tr style="font-size: 0.9rem" class="bg-gray-50 text-gray-700 px-2 py-2 select-none grid tr-tabla-revision">
					<th>CODIGO</th>
					<th>NOMBRE</th>
					<th>DETALLE</th>
					<th>QUITAR</th>
				</tr>
			</template>
			<template v-slot:tbody="{ dataMostrada, paginaActual }">
				<tr
					class="grid py-1 cursor-pointer hover:bg-gray-200 tr-tabla-revision"
					:class="!!productoVisualizado && productoVisualizado.codigo == row.codigo ? 'bg-gray-100' : ''"
					style="font-size: 0.9rem"
					v-for="row of <TLevantamientoProductoModel[]>dataMostrada"
					@click="cambiarProductoMostrado(row)"
				>
					<td class="flex items-center justify-center">{{ row.codigo }}</td>
					<td class="text-left">
						<p>{{ row.descripcion }}</p>
					</td>
					<td class="flex items-center justify-center">
						<el-button type="info" plain @click="verDetalleProducto(row)" style="width: min-content"><i class="fas fa-eye"></i></el-button>
					</td>
					<td class="flex items-center justify-center">
						<el-button type="danger" @click="quitarDeLevantamiento(row, paginaActual)" :icon="IconDelete" circle />
					</td>
				</tr>
			</template>
		</TableFull>
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
					<tr
						:key="row.codigoTienda"
						class="grid py-1 tr-tabla-detalles"
						:class="!valoresChecks.includes(row.codigoTienda) ? 'tr-detalles_no-usar' : ''"
						style="font-size: 0.9rem"
						v-for="row of <TProductoDetalleModel[]>dataMostrada"
					>
						<td class="text-left pl-2">
							{{ row.nombreTienda }}
						</td>
						<td class="text-center">{{ row.disponible }}</td>
						<td class="px-2">
							<input
								type="text"
								class="text-center py-1 border-black"
								v-model="row.encontrado"
								@input="ingresoProducto(row, 'encontrado')"
								:class="valoresChecks.includes(row.codigoTienda) ? 'border' : ''"
								:disabled="!valoresChecks.includes(row.codigoTienda)"
								style="width: 100%"
							/>
						</td>
						<td class="px-2">
							<select v-model="row.solicitar" @change="ingresoProducto(row, 'solicitar')" class="bg-white border py-1 pl-1 rounded" :disabled="!valoresChecks.includes(row.codigoTienda)">
								<template v-for="estado of storeEstadoSolicitar.get">
									<option :value="estado.id">{{ estado.descripcion }}</option>
								</template>
							</select>
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
						<textarea v-model="productoVisualizado.observaciones" class="border w-full bg-yellow-100"></textarea>
					</div>
				</div>
			</fieldset>
		</div>
	</div>

	<el-dialog v-model="mostrarDetallesModal" title="Detalle de Producto" width="80%">
		<div style="border-top: 1px solid gray" class="mt-0 pt-4">
			<DetallesProductoModal
				:key="stampActualizacionExistencias"
				v-if="mostrarDetallesModal"
				:codigo="productoMostrarDetalle.codigo"
				:descripcion="productoMostrarDetalle.descripcion"
				:detalle-existencias="productoMostrarDetalle.detalleExistencias"
			/>
		</div>
	</el-dialog>

	<el-dialog v-model="mostrarPanelFinalizar" title="Información de Finalización" width="60%">
		<div style="border-top: 1px solid gray" class="mt-0 pt-4">
			<div class="mb-6">
				<label class="block text-gray-800 font-bold mb-2"> Area </label>
				<input v-model="dataFinalizar.area" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
			</div>
			<div class="mb-6">
				<label class="block text-gray-800 font-bold mb-2" for="pasillo"> Pasillo </label>
				<input v-model="dataFinalizar.pasillo" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
			</div>
			<div class="mb-6">
				<label class="block text-gray-800 font-bold mb-2" for="email"> Observaciones </label>
				<input v-model="dataFinalizar.observaciones" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
			</div>
			<div class="mb-6 flex justify-end">
				<el-button type="success" @click="completarProcesoFinalizar" size="large"> Finalizar </el-button>
			</div>
		</div>
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
	grid-template-columns: 54% 45%;
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
}

.tr-tabla-detalles {
	grid-template-columns: 3fr 1fr 1fr 2fr;
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

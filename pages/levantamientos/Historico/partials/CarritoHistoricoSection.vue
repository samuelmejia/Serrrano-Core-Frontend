<script setup lang="ts">
import DetallesProductoModal from "~/components/Compras.Levantamiento/DetallesProductoModal.vue";

import { Delete } from "@element-plus/icons-vue";
import type { CheckboxValueType } from "element-plus";

import type { TLevantamientoProductoModel, TProductoModel } from "~/modules/Module.Compras.Levantamiento/Types/TProductoModel";
import type { TProductoDetalleModel } from "~/modules/Module.Compras.Levantamiento/Types/TProductoDetalleExistenciasModel";
import DataLevantamientoService from "~/modules/Module.Compras.Levantamiento/Services/DataLevantamientoService";
import TokenAPI from "~/modules/_Module.API/TokenAPI";
import type { TPermisoTiendaModel } from "~/modules/_Module.API/TUsuarioAPIModel";
import LevantamientoHistorialService from "~/modules/Module.Compras.Levantamiento/Services/LevantamientoHistorialService";
import type { TLevantamientoActualModel } from "~/modules/Module.Compras.Levantamiento/Types/TLevantamientoActualModel";

//COMUNICACION DE COMPONENTE
const props = defineProps<{
	infoLevantamiento: TLevantamientoActualModel;
}>();

const emit = defineEmits(["emitProductoQuitadoLevantamiento"]);

//VARIABLES REACTIVAS
const stampReactivo = ref(0);
const stampActualizacionDetalles = ref(0);
const stampActualizacionExistencias = ref(0);

const servicioHistorico = new LevantamientoHistorialService();

let dataRevision = <TLevantamientoProductoModel[]>[];

servicioHistorico.loadProductosLevantamiento(props.infoLevantamiento.id).then(() => {
	dataRevision = servicioHistorico.getListProductosAgregados();
	console.log("dataRevision", dataRevision);
	stampReactivo.value++;
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

const mostrarDetallesModal = ref(false);
const productoMostrarDetalle = ref(<TLevantamientoProductoModel>{});

const servicioData = new DataLevantamientoService();
</script>

<template>
	<div class="grid">
		<div class="grid grid-cols-12 gap-12">
			<div class="col-span-6 sm:col-span-3">
				<label for="product-name" class="text-sm font-medium text-gray-900 block mb-1">Creador</label>
				<input
					type="text"
					:value="props.infoLevantamiento.usuarioResponsable"
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full p-1"
				/>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="category" class="text-sm font-medium text-gray-900 block mb-1">Fecha Creación</label>
				<input
					type="text"
					:value="props.infoLevantamiento.fechaCreacion"
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full p-1"
				/>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="brand" class="text-sm font-medium text-gray-900 block mb-1">Area</label>
				<input
					type="text"
					:value="props.infoLevantamiento.area"
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full p-1"
				/>
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="price" class="text-sm font-medium text-gray-900 block mb-1">Pasillo</label>
				<input
					type="text"
					:value="props.infoLevantamiento.pasillo"
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-cyan-600 focus:border-cyan-600 block w-full p-1"
				/>
			</div>
		</div>
	</div>
	<br />
	<div style="grid-template-columns: 54% 45%; column-gap: 1%" class="grid">
		<TableFull
			:espacio-botones="true"
			:key="stampReactivo"
			:usar-filtrado-externo="false"
			:page-size="10"
			:default-page="defaultPageRevision"
			tam-campo-busqueda="60%"
			v-if="!!dataRevision"
			:data-recibida="dataRevision"
			:filter="[{ descripcion: 'string' }]"
		>
			<template v-slot:thead="{ th }">
				<tr style="font-size: 0.9rem" class="bg-gray-50 text-gray-700 px-2 py-2 select-none grid tr-tabla-revision">
					<th>CODIGO</th>
					<th>NOMBRE</th>
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
					<tr :key="row.codigoTienda" class="grid py-1 tr-tabla-detalles" style="font-size: 0.9rem" v-for="row of <TProductoDetalleModel[]>dataMostrada">
						<td class="text-left pl-2">
							{{ TokenAPI.getPermisosTienda().find((bodega) => bodega.idAlmacen == row.codigoTienda)?.nombreAlmacen }}
						</td>
						<td class="text-center">{{ row.disponible }}</td>
						<td class="px-2">
							<input type="text" class="text-center py-1 border-black" v-model="row.encontrado" style="width: 100%" />
						</td>
						<td class="px-2">
							<select v-model="row.solicitar" class="bg-white border py-1 pl-1 rounded">
								<template v-for="estado of servicioData.getEstadosProductoLevantamiento()">
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
						<textarea v-model="productoVisualizado.observaciones" class="border w-full"></textarea>
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
.tr-tabla-revision {
	grid-template-columns: 1fr 5fr;
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

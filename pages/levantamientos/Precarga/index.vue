<script setup lang="ts">
import DetallesProductoModal from "~/components/Compras.Levantamiento/DetallesProductoModal.vue";
import PanelInfoProducto from "~/components/Compras.Levantamiento/PanelInfoProducto.vue";
import CarritoSection from "./partials/CarritoSection.vue";
import TableFull from "~/components/TableFull.vue";
import Numeros from "~/helpers/Numeros";
import Texto from "~/helpers/Texto";
import LevantamientoController from "~/modules/Module.Compras.Levantamiento/Controllers/LevantamientoController";
import type { TLevantamientoProductoModel, TProductoModel } from "~/modules/Module.Compras.Levantamiento/Types/TProductoModel";
import SpinnerLoading from "~/components/SpinnerLoading.vue";

import { useWindowSize } from "@vueuse/core";
import InformacionService from "~/modules/Module.Compras.Levantamiento/Services/InformacionService";
import type { TInfoProveedorDomain } from "~/modules/Module.Compras.Levantamiento/_Data/TipoInformacion";
const { width, height } = useWindowSize();

definePageMeta({
	layout: "general",
	title: "Precarga",
	subTitle: "Visualiza los productos en base a un filtrado",
});

const loadingState = reactive({
	mostrar: false,
	texto: "",
});

const stampActualizacionTabla = ref(0);
const stampActualizacionRegistros = ref(0);
const stampActualizacionAgregados = ref(0);
const stampActualizacionExistencias = ref(0);

const controller = LevantamientoController.getInstance();

async function cambiarEstadoAgregado(producto: TProductoModel) {
	await controller.agregarProductoLevantamiento(producto);

	console.log("controller.getListProductosAgregadosLevantamiento()", controller.getListProductosAgregadosLevantamiento());

	stampActualizacionAgregados.value++;
}

async function mostrarDetalleProducto(producto: TProductoModel) {
	loadingState.mostrar = true;
	loadingState.texto = "Cargando Detalle";

	if (producto.detalleExistencias.length == 0) {
		controller.getDetalleDeProductoEnProductos(producto).then(() => {
			productoMostrarDetalle.value = producto;
			stampActualizacionExistencias.value++;
		});
	}

	productoMostrarDetalle.value = producto;
	mostrarDetallesProductoModal.value = true;
	loadingState.mostrar = false;
}

const mostrarRevisadosModal = ref(false);
const mostrarDetallesProductoModal = ref(false);
const mostrarFormularioIniciarPrecarga = ref(false);

const productoMostrarDetalle = ref(<TProductoModel>{});

let defaultCampoBusqueda = "";
async function llamarFiltradoExterno(valueBusqueda: string) {
	if (valueBusqueda.length < 2) {
		alert("La busqueda debe tener al menos 2 caracteres");
		return;
	}

	await controller.filtrarProductos(valueBusqueda);
	defaultCampoBusqueda = valueBusqueda;
	stampActualizacionTabla.value++;
}

function quitarDeLevantamiento(producto: TLevantamientoProductoModel) {
	controller.actualizarEstadoProductoListado(producto.codigo, false);
	revisarListaProductosAgregados();

	stampActualizacionAgregados.value++;
}

function revisarListaProductosAgregados() {
	const productosYaAgregados = controller.getListProductosAgregadosLevantamiento();

	controller;
	productosYaAgregados.forEach((producto) => {
		controller.actualizarEstadoProductoListado(producto.codigo);
	});

	stampActualizacionTabla.value++; // Se ocupa que sea la tabla
	stampActualizacionRegistros.value++;
	stampActualizacionAgregados.value++;
}

watch(mostrarRevisadosModal, (newValue) => {
	if (newValue) revisarListaProductosAgregados();
});

const levantamientoEnProceso = ref(false);

async function confirmarInicioLevantamiento() {
	try {
		mostrarFormularioIniciarPrecarga.value = true;
	} catch (e: any) {}
}

onMounted(async () => {
	await controller.servicioProductos.loadData();

	stampActualizacionTabla.value++;
	stampActualizacionRegistros.value++;

	controller.estatusLevantamiento().then(async (respuesta: boolean) => {
		if (respuesta) {
			levantamientoEnProceso.value = true;
			await controller.loadProductosLevantamiento();
			revisarListaProductosAgregados();
		}
	});
});

const esperaCarga = ref(true);

setTimeout(() => {
	esperaCarga.value = false;
}, 2500);

mostrarFormularioIniciarPrecarga.value = true;

const stampProveedores = ref(0);
const stampMarcas = ref(0);

const proveedor = ref("");
let opcionesProveedor: { value: string; label: string }[] = [];

const servicioInformacion = new InformacionService();

onMounted(() => {
	servicioInformacion.getProveedores().then((proveedores) => {
		opcionesProveedor = proveedores.map((x) => {
			return { value: x.idProveedor, label: x.nombreProveedor };
		});

		console.log("opcionesProveedor", opcionesProveedor);
		stampProveedores.value++;
	});
});

const mostrarModalProveedores = ref(false);

const infoProveedor = ref<TInfoProveedorDomain | null>(null);
function seleccionarProveedor(proveedor: TInfoProveedorDomain) {
	console.log("seleccionarProveedor", proveedor);
	infoProveedor.value = proveedor;
	mostrarModalProveedores.value = false;
}
</script>

<template>
	<div class="min-w-full my-2 flex flex-row justify-end gap-1">
		<div v-if="!levantamientoEnProceso">
			<el-button type="primary" :key="stampActualizacionAgregados" @click="confirmarInicioLevantamiento">Iniciar Levantamiento <i class="ml-2 fas fa-exclamation"></i></el-button>
		</div>
		<div v-if="levantamientoEnProceso" class="flex flex-col">
			<el-button type="info" :key="stampActualizacionAgregados" @click="mostrarRevisadosModal = !mostrarRevisadosModal"
				>Productos en Revisión: {{ controller.getCantidadProductosAgregadosLevantamiento() }}<i class="ml-2 fas fa-box-open"></i
			></el-button>
			<i style="font-size: 0.8rem">Click para ver el panel de revision</i>
		</div>
	</div>

	<div v-loading="esperaCarga" style="min-height: 80vh">
		<TableFull
			:espacio-botones="true"
			:usar-filtrado-externo="true"
			:page-size="10"
			@emit-filtrado-externo="llamarFiltradoExterno"
			:key="stampActualizacionTabla"
			:tam-campo-busqueda="width <= 900 ? '50%' : '30%'"
			:default-campo-busqueda="defaultCampoBusqueda"
			v-if="!!controller.getAllProductos()"
			:data-recibida="controller.getAllProductos()"
			:filter="[{ codigo: 'string' }, { nombre: 'string' }, { modelo: 'string' }, { marca: 'string' }]"
		>
			<template v-slot:thead="{ th }">
				<tr style="font-size: 0.9rem" :class="levantamientoEnProceso ? `tr-registro-en-levantamiento` : `tr-registro-no-levantamiento`" class="bg-gray-50 text-gray-700 px-4 py-2 select-none grid">
					<th>CODIGO</th>
					<th>NOMBRE</th>
					<th>MARCA</th>
					<th v-if="width >= 900">CATEGORIA</th>
					<th class="cursor-pointer" @click="th.setSort({ fechaUltimaVenta: 'date' })" v-html="th.mostrarLabel({ fechaUltimaVenta: 'ULTIMA V.' })"></th>
					<th class="cursor-pointer" @click="th.setSort({ stockTotal: 'number' })" v-html="th.mostrarLabel({ stockTotal: 'STOCK T.' })"></th>
					<th>INF.PRD</th>
					<th v-if="levantamientoEnProceso">AGREGAR</th>
				</tr>
			</template>
			<template v-slot:tbody="{ dataMostrada }">
				<tr
					class="grid py-1"
					:class="levantamientoEnProceso ? `tr-registro-en-levantamiento` : `tr-registro-no-levantamiento`"
					:key="row.codigo"
					style="font-size: 0.9rem"
					v-for="row of <TProductoModel[]>dataMostrada"
				>
					<td class="text-center">{{ row.codigo }}</td>
					<td class="text-left">
						<el-tooltip class="box-item" effect="dark" :content="row.nombre" placement="top-start">
							{{ Texto.limitarTexto(row.nombre, width >= 900 ? 50 : 35) }}
						</el-tooltip>
					</td>
					<td class="text-center">{{ row.modelo }}</td>
					<td v-if="width >= 900" class="text-left">
						<el-tooltip class="box-item" effect="dark" :content="row.categoria" placement="top-start">
							{{ Texto.limitarTexto(row.categoria, 15) }}
						</el-tooltip>
					</td>
					<td class="text-right pr-6" style="text-wrap: nowrap">{{ row.fechaUltimaVenta }}</td>
					<td class="text-right pr-6">{{ Numeros.convertirDecimal(row.stockTotal, 1) }}</td>
					<td class="text-center">
						<el-button type="success" :size="width <= 900 ? 'small' : ''" @click="mostrarDetalleProducto(row)" style="width: min-content"><i class="fas fa-eye"></i></el-button>
					</td>
					<td v-if="levantamientoEnProceso" class="text-center" :key="stampActualizacionAgregados">
						<el-button v-if="!row.estadoAgregado" :size="width <= 900 ? 'small' : ''" @click="cambiarEstadoAgregado(row)" type="primary"><i class="fas fa-plus-square"></i></el-button>
						<el-button v-if="row.estadoAgregado" :size="width <= 900 ? 'small' : ''" type="warning"><i class="fas fa-check-square"></i></el-button>
					</td>
				</tr>
			</template>
		</TableFull>
	</div>

	<el-dialog style="min-height: 90vh; margin: 5vh auto" v-model="mostrarRevisadosModal" title="Productos en Proceso de Revisión" :width="width <= 900 ? '90%' : '80%'">
		<CarritoSection v-if="controller.getCantidadProductosAgregadosLevantamiento() > 0" :stamp-reactivo="stampActualizacionAgregados" @emit-producto-quitado-levantamiento="quitarDeLevantamiento" />
	</el-dialog>

	<el-dialog v-model="mostrarDetallesProductoModal" title="Detalle de Producto" :width="width <= 900 ? '95%' : '90%'">
		<div style="border-top: 1px solid gray" class="mt-0 pt-4">
			<PanelInfoProducto :key="stampActualizacionExistencias" v-if="mostrarDetallesProductoModal" :producto="productoMostrarDetalle" />
		</div>
	</el-dialog>

	<el-dialog v-model="mostrarFormularioIniciarPrecarga" title="Iniciar Levantamiento con Precarga" :width="width <= 900 ? '70%' : '60%'">
		<div style="border-top: 1px solid gray" class="mt-0 pt-4">
			<div class="mb-6">
				<label class="block text-gray-800 font-bold mb-2"> Proveedor </label>
				<div class="grid gap-x-4" style="grid-template-columns: 0.5fr 1fr 2fr">
					<div class="text-center">
						<el-button @click="mostrarModalProveedores = true" type="info" plain><i class="fas fa-search"></i></el-button>
					</div>
					<input
						:value="infoProveedor ? infoProveedor.rtn : ''"
						readonly
						class="shadow bg-gray-100 border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
						type="text"
					/>
					<input
						:value="infoProveedor ? infoProveedor.nombreProveedor : ''"
						readonly
						class="shadow bg-gray-100 border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
						type="text"
					/>
				</div>
			</div>
			<div class="mb-6">
				<label class="block text-gray-800 font-bold mb-2"> Marca </label>
				<div class="grid gap-x-4" style="grid-template-columns: 0.5fr 1fr 2fr">
					<div class="text-center">
						<el-button type="info" plain><i class="fas fa-search"></i></el-button>
					</div>
					<input value="" readonly class="shadow bg-gray-100 border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" type="text" />
					<span></span>
				</div>
			</div>
			<div class="mb-6">
				<label class="block text-gray-800 font-bold mb-2"> Modelo </label>
				<div class="grid gap-x-4" style="grid-template-columns: 0.5fr 1fr 2fr">
					<div class="text-center"></div>
					<input value="" class="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" type="text" />
				</div>
			</div>
			<div class="mb-6 flex justify-end">
				<el-button type="success" @click="" size="large"> Iniciar </el-button>
			</div>
		</div>
	</el-dialog>

	<el-dialog v-model="mostrarModalProveedores" title="Buscar Proveedor" :width="width <= 900 ? '80%' : '65%'">
		<BuscarProveedor @cancelar="mostrarModalProveedores = false" @proveedor-encontrado="seleccionarProveedor" />
	</el-dialog>

	<SpinnerLoading :visible="loadingState.mostrar" :texto-mostrar="loadingState.texto" />
</template>

<style scoped lang="css">
.tr-registro-en-levantamiento {
	grid-template-columns: 1fr 5fr 2fr 2fr 1.25fr 1fr 1fr 1fr;
}

.tr-registro-no-levantamiento {
	grid-template-columns: 1fr 5fr 2fr 2fr 1fr 1fr 1fr;
}

@media screen and (max-width: 900px) {
	.tr-registro-en-levantamiento {
		grid-template-columns: 1.25fr 5fr 1.5fr 1.5fr 1fr 1fr 1fr;
		font-size: 0.8rem !important;
	}

	.tr-registro-no-levantamiento {
		grid-template-columns: 1.25fr 5fr 2fr 1fr 1fr 1fr;
		font-size: 0.8rem !important;
	}
}
</style>

<script setup lang="ts">
import Levantamiento_Detalles from "~/components/Compras.Levantamiento/Detalles.vue";
import Levantamiento_Productos from "~/pages/compras/Levantamiento/partials/Productos.vue";
import TableFull from "~/components/TableFull.vue";
import Numeros from "~/helpers/Numeros";
import Texto from "~/helpers/Texto";
import ComprasLevantamientoController from "~/modules/Module.Compras.Levantamiento/Controllers/ComprasLevantamientoController";
import type { TProductoModel } from "~/modules/Module.Compras.Levantamiento/Types/TProductoModel";
import SpinnerLoading from "~/components/SpinnerLoading.vue";

definePageMeta({
	layout: "general",
	title: "Listado de Productos",
	subTitle: "Revisa el inventario para seleccionar los productos que necesitas",
});

const loadingState = reactive({
	mostrar: false,
	texto: "",
});

const stampActualizacionTabla = ref(0);
const stampActualizacionRegistros = ref(0);
const stampActualizacionAgregados = ref(0);

const controller = new ComprasLevantamientoController();

controller.serviceProductos.loadData().then(() => {
	console.log("data cargada:: ", controller.serviceProductos.getAllProductos().length);
	stampActualizacionTabla.value++;
	stampActualizacionRegistros.value++;
});

async function cambiarEstadoAgregado(producto: TProductoModel) {
	await controller.serviceProductos.agregarProductoRevision(producto.codigo);

	stampActualizacionRegistros.value++;
	stampActualizacionAgregados.value++;
}

async function mostrarDetalleProducto(producto: TProductoModel) {
	loadingState.mostrar = true;
	loadingState.texto = "Cargando Detalle";

	await controller.serviceProductos.getDetalleProducto(producto);

	productoMostrarDetalle.value = producto;
	mostrarDetallesModal.value = true;
	loadingState.mostrar = false;
}

const mostrarRevisadosModal = ref(false);
const mostrarDetallesModal = ref(false);

const productoMostrarDetalle = ref(<TProductoModel>{});

let defaultCampoBusqueda = "";
async function llamarFiltradoExterno(valueBusqueda: string) {
	if (valueBusqueda.length < 2) {
		alert("La busqueda debe tener al menos 2 caracteres");
		return;
	}

	await controller.serviceProductos.filtrarProductos(valueBusqueda);
	defaultCampoBusqueda = valueBusqueda;
	stampActualizacionTabla.value++;
}

function quitarDeRevision() {
	actualizarListaAgregados();
	stampActualizacionAgregados.value++;
}

function actualizarListaAgregados() {
	stampActualizacionRegistros.value++;
}

watch(mostrarRevisadosModal, (newValue) => {
	if (newValue) actualizarListaAgregados();
});
</script>

<template>
	<div class="min-w-full my-2 flex flex-col items-end">
		<el-button type="info" :key="stampActualizacionAgregados" @click="mostrarRevisadosModal = !mostrarRevisadosModal"
			>Productos en Revisión: {{ controller.serviceProductos.getCantidadProductosAgregados() }}<i class="ml-2 fas fa-box-open"></i
		></el-button>
		<i style="font-size: 0.8rem">Click para ver el panel de revision</i>
	</div>
	<TableFull
		:usar-filtrado-externo="true"
		:page-size="10"
		@emit-Filtrado-externo="llamarFiltradoExterno"
		:key="stampActualizacionTabla"
		tam-campo-busqueda="30%"
		:default-campo-busqueda="defaultCampoBusqueda"
		v-if="!!controller.serviceProductos.getAllProductos()"
		:data-recibida="controller.serviceProductos.getAllProductos()"
		:filter="[{ codigo: 'string' }, { nombre: 'string' }, { modelo: 'string' }, { marca: 'string' }]"
	>
		<template v-slot:thead="{ th }">
			<tr style="font-size: 0.9rem; grid-template-columns: 1fr 5fr 2fr 2fr 1fr 1fr 1fr 1fr" class="bg-gray-50 text-gray-700 px-4 py-3 select-none grid">
				<th>CODIGO</th>
				<th>NOMBRE</th>
				<th>MARCA</th>
				<th>CATEGORIA</th>
				<th class="cursor-pointer" @click="th.setSort({ fechaUltimaVenta: 'date' })" v-html="th.mostrarLabel({ fechaUltimaVenta: 'ULTIMA V.' })"></th>
				<th class="cursor-pointer" @click="th.setSort({ stockTotal: 'number' })" v-html="th.mostrarLabel({ stockTotal: 'STOCK T.' })"></th>
				<th>DETALLES</th>
				<th>AGREGAR</th>
			</tr>
		</template>
		<template v-slot:tbody="{ dataMostrada }">
			<tr class="grid py-1" :key="row.codigo" style="font-size: 0.9rem; grid-template-columns: 1fr 5fr 2fr 2fr 1fr 1fr 1fr 1fr" v-for="row of <TProductoModel[]>dataMostrada">
				<td class="text-center">{{ row.codigo }}</td>
				<td class="text-left">
					<el-tooltip class="box-item" effect="dark" :content="row.nombre" placement="top-start">
						{{ Texto.limitarTexto(row.nombre, 50) }}
					</el-tooltip>
				</td>
				<td class="text-center">{{ row.modelo }}</td>
				<td class="text-left">
					<el-tooltip class="box-item" effect="dark" :content="row.categoria" placement="top-start">
						{{ Texto.limitarTexto(row.categoria, 15) }}
					</el-tooltip>
				</td>
				<td class="text-right pr-6">{{ row.fechaUltimaVenta }}</td>
				<td class="text-right pr-6">{{ Numeros.convertirDecimal(row.stockTotal, 0) }}</td>
				<td class="text-center">
					<el-button type="success" @click="mostrarDetalleProducto(row)" style="width: min-content"><i class="fas fa-eye"></i></el-button>
				</td>
				<td class="text-center" :key="stampActualizacionRegistros">
					<el-button v-if="!row.estadoAgregado" @click="cambiarEstadoAgregado(row)" type="primary"><i class="fas fa-plus-square"></i></el-button>
					<el-button v-if="row.estadoAgregado" type="warning"><i class="fas fa-check-square"></i></el-button>
				</td>
			</tr>
		</template>
	</TableFull>

	<el-dialog style="min-height: 90vh; margin: 5vh auto" :modal="true" v-model="mostrarRevisadosModal" title="Productos en Proceso de Revisión" width="90%">
		<Levantamiento_Productos
			v-if="controller.serviceProductos.getCantidadProductosAgregados() > 0"
			:servicio-productos="controller.serviceProductos"
			:stamp-reactivo="stampActualizacionAgregados"
			@emit-producto-quitado-revision="quitarDeRevision"
		/>
	</el-dialog>

	<el-dialog v-model="mostrarDetallesModal" title="Detalle de Producto" width="80%">
		<div style="border-top: 1px solid gray" class="mt-0 pt-4">
			<Levantamiento_Detalles v-if="mostrarDetallesModal" :producto-visualizado="productoMostrarDetalle" />
		</div>
	</el-dialog>

	<SpinnerLoading :visible="loadingState.mostrar" :texto-mostrar="loadingState.texto" />
</template>

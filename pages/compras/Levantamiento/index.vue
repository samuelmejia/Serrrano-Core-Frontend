<script setup lang="ts">
import Detalles from "~/components/Compras.Levantamiento/Detalles.vue";
import Productos from "~/pages/compras/Levantamiento/partials/Productos.vue";
import TableFull from "~/components/TableFull.vue";
import ComprasLevantamientoController from "~/modules/Module.Compras.Levantamiento/Controllers/ComprasLevantamientoController";
import type { TProductoModel } from "~/modules/Module.Compras.Levantamiento/Types/TProductoModel";
import SpinnerLoading from "~/components/SpinnerLoading.vue";

definePageMeta({
	layout: "general",
	title: "Levantamientos",
	subTitle: "Ver y utilizar los levantamientos realizados",
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
			<tr style="font-size: 0.9rem; grid-template-columns: 1fr 5fr 2fr 1fr 1fr 1fr 1fr 1fr" class="bg-gray-50 text-gray-700 px-4 py-3 select-none grid">
				<th>CODIGO</th>
				<th>DETALLES</th>
				<th>CREADOR</th>
				<th>CANTIDAD</th>
				<th>CREACION</th>
				<th>ULT. MODIF.</th>
				<th>ESTADO</th>
				<th>VER</th>
			</tr>
		</template>
		<template v-slot:tbody="{ dataMostrada }">
			<tr class="grid py-1" :key="row.codigo" style="font-size: 0.9rem; grid-template-columns: 1fr 5fr 2fr 1fr 1fr 1fr 1fr 1fr" v-for="row of <TProductoModel[]>dataMostrada">
				<td class="text-center">{{ row.codigo }}</td>
				<td class="text-left">Comentario o descripcion de la ubicacion y objetivo del levantamiento</td>
				<td class="text-center">Usuario</td>
				<td class="text-center">{{ Math.ceil(Math.random() * 10) }}</td>
				<td class="text-right pr-6">{{ row.fechaUltimaVenta }}</td>
				<td class="text-right pr-6">{{ row.fechaUltimaVenta }}</td>
				<td>Pendiente</td>
				<td class="text-center" :key="stampActualizacionRegistros">
					<el-button type="warning"><i class="fas fa-eye"></i></el-button>
				</td>
			</tr>
		</template>
	</TableFull>

	<el-dialog style="min-height: 90vh; margin: 5vh auto" :modal="true" v-model="mostrarRevisadosModal" title="Productos en Proceso de Revisión" width="90%">
		<Productos
			v-if="controller.serviceProductos.getCantidadProductosAgregados() > 0"
			:servicio-productos="controller.serviceProductos"
			:stamp-reactivo="stampActualizacionAgregados"
			@emit-producto-quitado-revision="quitarDeRevision"
		/>
	</el-dialog>

	<el-dialog v-model="mostrarDetallesModal" title="Detalle de Producto" width="80%">
		<div style="border-top: 1px solid gray" class="mt-0 pt-4">
			<Detalles v-if="mostrarDetallesModal" :producto-visualizado="productoMostrarDetalle" />
		</div>
	</el-dialog>

	<SpinnerLoading :visible="loadingState.mostrar" :texto-mostrar="loadingState.texto" />
</template>

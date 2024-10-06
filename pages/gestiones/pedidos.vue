<script setup lang="ts">
import TableFull from "~/components/TableFull.vue";
import SpinnerLoading from "~/components/SpinnerLoading.vue";
import PanelPedidoSection from "./partials/PanelPedidoSection.vue";

import { useWindowSize } from "@vueuse/core";
import type { TPedidoModel } from "~/modules/Module.Compras.Levantamiento/_Data/TiposPedidos";
import PedidosService from "~/modules/Module.Compras.Levantamiento/Services/PedidosService";
const { width, height } = useWindowSize();

definePageMeta({
	layout: "general",
	title: "Pedidos",
	subTitle: "Productos seleccionados para solicitar a proveedor",
});

const loadingState = reactive({
	mostrar: false,
	texto: "",
});

const stampActualizacionTabla = ref(0);
const stampActualizacionRegistros = ref(0);
const stampActualizacionAgregados = ref(0);

const servicioPedidos = new PedidosService();

async function mostrarDetallesLevantamiento(levantamiento: TPedidoModel) {
	mostrarRevisadosModal.value = true;
	infoLevantamiento.value = levantamiento;
	stampActualizacionAgregados.value++;
}

const infoLevantamiento = ref<TPedidoModel | null>(null);
const mostrarRevisadosModal = ref(false);
const mostrarIniciarPedido = ref(false);

function actualizarListaAgregados() {
	stampActualizacionRegistros.value++;
}

watch(mostrarRevisadosModal, (newValue) => {
	if (newValue) actualizarListaAgregados();
});

type TDataEstado = {
	id: string;
	descripcion: string;
};

const listaEstados: TDataEstado[] = [
	{ id: "9", descripcion: "Abierto" },
	{ id: "10", descripcion: "En Espera" },
	{ id: "11", descripcion: "Cancelado" },
	{ id: "12", descripcion: "Cerrado" },
];

const historicoFiltrar = ref<string>("9");
const pedidosList = ref<TPedidoModel[]>([]);

watch(historicoFiltrar, () => {
	obtenerLevantamientos();
});

function obtenerLevantamientos() {
	servicioPedidos.getListPedidosFiltrado("", +historicoFiltrar.value).then((lista) => {
		pedidosList.value = lista;
		stampActualizacionTabla.value++;

		console.log("pedidosList", pedidosList.value);
	});
	mostrarRevisadosModal.value = false;
}
obtenerLevantamientos();
</script>

<template>
	<div class="min-w-full my-2 flex flex-row justify-end gap-1">
		<div>
			<el-button type="primary" @click="mostrarIniciarPedido = true">Iniciar Pedido<i class="ml-2 fas fa-plus-circle"></i></el-button>
		</div>
	</div>
	<div>
		<label>Filtrado de Pedidos: </label>
		<select v-model="historicoFiltrar" class="bg-white border py-1 pl-1 rounded">
			<template v-for="estado of listaEstados">
				<option :value="estado.id">{{ estado.descripcion }}</option>
			</template>
		</select>
	</div>
	<TableFull
		:usar-filtrado-externo="false"
		:page-size="10"
		:key="stampActualizacionTabla"
		tam-campo-busqueda="30%"
		v-if="!!pedidosList"
		:data-recibida="pedidosList"
		:filter="[{ codigo: 'string' }, { nombre: 'string' }, { modelo: 'string' }, { marca: 'string' }]"
	>
		<template v-slot:thead="{ th }">
			<tr class="tr-levantamientos-previos bg-gray-100 text-gray-700 px-4 py-3 select-none grid">
				<th>ID</th>
				<th v-if="width >= 900">CREADOR</th>
				<th>DESCRIPCION</th>
				<th v-if="width >= 900">CREACION</th>
				<th>CIERRE</th>
				<th>ENTREGA</th>
				<th>VER</th>
			</tr>
		</template>
		<template v-slot:tbody="{ dataMostrada }">
			<tr class="grid py-1 tr-levantamientos-previos" :key="row.id" v-for="row of <TPedidoModel[]>dataMostrada">
				<td class="text-center">{{ row.id }}</td>
				<td v-if="width >= 900" class="text-left">{{ row.usuarioResponsable }}</td>
				<td class="text-left pl-2">{{ row.descripcion }}</td>
				<td v-if="width >= 900" class="text-center">{{ row.fechaCreacion }}</td>
				<td class="text-center pr-2" style="text-wrap: nowrap">{{ !row.fechaCierre ? "N/A" : row.fechaCierre }}</td>
				<td class="text-center pl-2" style="text-wrap: nowrap">{{ !row.fechaEntrega ? "N/A" : row.fechaEntrega }}</td>

				<td class="text-center" :key="stampActualizacionRegistros" @click="mostrarDetallesLevantamiento(row)">
					<el-button :type="historicoFiltrar == '9' ? 'warning' : historicoFiltrar == '10' ? 'success' : 'danger'" :size="width <= 900 ? 'small' : ''"><i class="fas fa-eye"></i></el-button>
				</td>
			</tr>
		</template>
	</TableFull>

	<el-dialog style="min-height: 90vh; margin: 5vh auto" v-model="mostrarRevisadosModal" title="Detalles de Pedido" :width="width <= 900 ? '90%' : '80%'">
		<PanelPedidoSection :stamp-reactivo="stampActualizacionAgregados" :key="infoLevantamiento.id" v-if="!!infoLevantamiento" :info-levantamiento="infoLevantamiento" />
	</el-dialog>

	<el-dialog v-model="mostrarIniciarPedido" title="Iniciar Pedido" :width="width <= 900 ? '90%' : '80%'">
		<div style="border-top: 1px solid gray" class="mt-0 pt-4">Informacion de Levantamiento</div>
	</el-dialog>

	<SpinnerLoading :visible="loadingState.mostrar" :texto-mostrar="loadingState.texto" />
</template>

<style lang="scss" scoped>
.tr-levantamientos-previos {
	font-size: 0.9rem;
	grid-template-columns: 1fr 1fr 4fr 1fr 1fr 1fr 1fr;
}

@media screen and (max-width: 900px) {
	.tr-levantamientos-previos {
		font-size: 0.8rem;
		grid-template-columns: 1fr 3fr 1fr 2fr 1fr;
	}
}
</style>

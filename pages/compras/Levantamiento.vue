<script setup lang="ts">
import TableFull from "~/components/TableFull.vue";
import Numeros from "~/helpers/Numeros";
import Texto from "~/helpers/Texto";
import ComprasLevantamientoController from "~/modules/Module.Compras.Levantamiento/Controllers/ComprasLevantamientoController";
import type { TProductoLevantamientoModel } from "~/modules/Module.Compras.Levantamiento/types/TProductoLevantamientoModel";

definePageMeta({
	layout: "general",
	title: "Gestion de Levantamiento",
	subTitle: "Revisa el inventario para seleccionar los productos que necesitas",
});

const stampActualizacionRegistros = ref(0);
const controller = new ComprasLevantamientoController();

function cambiarEstadoAgregado(producto: TProductoLevantamientoModel) {
	controller.serviceListaLevantamiento.cambiarEstadoAgregado(producto.codigo);

	stampActualizacionRegistros.value++;
}

function mostrarDetalleProducto(producto: TProductoLevantamientoModel) {
	productoMostrarDetalle.value = producto;
	mostrarDetallesModal.value = true;
}

const mostrarRevisadosModal = ref(false);
const mostrarDetallesModal = ref(false);

const productoMostrarDetalle = ref(<TProductoLevantamientoModel>{});
</script>

<template>
	<div class="min-w-full my-2 flex flex-col items-end">
		<el-button type="info" :key="stampActualizacionRegistros" @click="mostrarRevisadosModal = !mostrarRevisadosModal"
			>Productos Revisados: {{ controller.serviceListaLevantamiento.getCantidadProductosAgregados() }}<i class="ml-2 fas fa-box-open"></i
		></el-button>
		<i style="font-size: 0.8rem">Click para ver el panel de revision</i>
	</div>
	<TableFull
		:page-size="10"
		tam-campo-busqueda="30%"
		v-if="!!controller.serviceListaLevantamiento.getAllProductos()"
		:data-recibida="controller.serviceListaLevantamiento.getAllProductos()"
		:filter="[{ codigo: 'string' }, { nombre: 'string' }, { codigoBarras: 'array' }, { modelo: 'string' }, { marca: 'string' }]"
	>
		<template v-slot:thead="{ th }">
			<tr class="bg-gray-50 text-gray-700 px-4 py-3 select-none grid" style="font-size: 0.9rem; grid-template-columns: 1fr 3fr 2fr 2fr 2fr 2fr 1fr 1fr 1fr">
				<th class="uppercase">ID</th>
				<th class="uppercase">Nombre</th>
				<th class="uppercase">Modelo</th>
				<th class="uppercase">Categoria</th>
				<th class="uppercase">Marca</th>
				<th class="uppercase cursor-pointer" @click="th.setSort({ precioVenta: 'number' })" v-html="th.mostrarLabel({ precioVenta: 'Precio Venta' })"></th>
				<th class="uppercase cursor-pointer" @click="th.setSort({ stockTotal: 'number' })" v-html="th.mostrarLabel({ stockTotal: 'Stock T.' })"></th>
				<th class="uppercase">Detalles</th>
				<th class="uppercase">Agregar</th>
			</tr>
		</template>
		<template v-slot:tbody="{ dataMostrada }">
			<tr
				class="grid py-1"
				:key="stampActualizacionRegistros"
				style="font-size: 0.9rem; grid-template-columns: 1fr 3fr 2fr 2fr 2fr 2fr 1fr 1fr 1fr"
				v-for="row of <TProductoLevantamientoModel[]>dataMostrada"
			>
				<td class="text-center">{{ row.codigo }}</td>
				<td class="text-left">{{ row.nombre }}</td>
				<td class="text-left">{{ row.modelo }}</td>
				<td class="text-left">{{ Texto.limitarTexto(row.categoria, 15) }}</td>
				<td class="text-left">{{ row.marca }}</td>
				<td class="text-right">{{ Numeros.convertirDecimal(row.precioVenta, 2) }}</td>
				<td class="text-right">{{ row.stockTotal }}</td>
				<td class="text-center">
					<el-button type="success" @click="mostrarDetalleProducto(row)" style="width: min-content"><i class="fas fa-eye"></i></el-button>
				</td>
				<td class="text-center">
					<el-button v-if="!row.estadoAgregado" @click="cambiarEstadoAgregado(row)" type="primary"><i class="fas fa-plus-square"></i></el-button>
					<el-button v-if="row.estadoAgregado" type="warning"><i class="fas fa-check-square"></i></el-button>
				</td>
			</tr>
		</template>
	</TableFull>

	<el-dialog v-model="mostrarRevisadosModal" title="Productos Revisados" width="80%">
		<div style="border-top: 1px solid gray" class="mt-0 pt-4">
			<p>Ejemplo de texto dentro de modal</p>
			<ul>
				<li v-for="producto of controller.serviceListaLevantamiento.getListProductosAgregados()" :key="producto.codigo">
					<b>{{ producto.nombre }} </b> <span class="ml-2"> {{ producto.categoria }}</span>
				</li>
			</ul>
		</div>
	</el-dialog>

	<el-dialog v-model="mostrarDetallesModal" title="Detalle de Producto" width="80%">
		<div style="border-top: 1px solid gray" class="mt-0 pt-4">
			<p>Ejemplo de detalle producto</p>
			<p>
				{{ productoMostrarDetalle }}
			</p>
		</div>
	</el-dialog>
</template>

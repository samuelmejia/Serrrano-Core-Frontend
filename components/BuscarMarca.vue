<script setup lang="ts">
import DOM from "~/helpers/DOM";
import InformacionService from "~/modules/Module.Compras.Levantamiento/Services/InformacionService";
import type { TInfoMarcaDomain } from "~/modules/Module.Compras.Levantamiento/_Data/TipoInformacion";

const props = defineProps<{
	idProveedor: string;
}>();

const emit = defineEmits(["marcaEncontrada", "cancelar"]);

const cargando = ref(false);
const servicioInfo = new InformacionService();

const stampReactivo = ref(0);

let marcas = <TInfoMarcaDomain[]>[];

function seleccionarMarca(marca: TInfoMarcaDomain) {
	emit("marcaEncontrada", marca);
}

cargando.value = true;
function cargarMarcas() {
	servicioInfo.getMarcas(props.idProveedor).then((c) => {
		if (!!c) {
			marcas = c;
			stampReactivo.value++;
			cargando.value = false;
		}
	});
}

watch(
	() => props.idProveedor,
	() => {
		cargarMarcas();
	}
);

onMounted(() => {
	DOM.quitarFocusBotonCerrarElDialog();
	cargarMarcas();
});
</script>

<template>
	<div v-loading="cargando" :key="stampReactivo" style="min-height: 50vh">
		<TableFull :page-size="10" :dataRecibida="marcas" :espacio-botones="true" :stamp="stampReactivo" :usar-filtrado-externo="false" tamCampoBusqueda="50%" :filter="[{ nombreMarca: 'string' }]">
			<template #thead>
				<tr class="busqueda-marcas bg-gray-100" style="">
					<th>ID</th>
					<th>Nombre Marca</th>
					<th>Opciones</th>
				</tr>
			</template>
			<template #tbody="{ dataMostrada }">
				<tr class="busqueda-marcas hover:bg-gray-100" v-for="marca in <TInfoMarcaDomain[]>dataMostrada" :key="marca.idMarca">
					<td style="text-align: center; padding-right: 5px">{{ marca.idMarca }}</td>
					<td>{{ marca.nombreMarca }}</td>
					<td style="text-align: center"><el-button type="info" plain @click="seleccionarMarca(marca)">Seleccionar</el-button></td>
				</tr>
			</template>
		</TableFull>
	</div>
	<div class="mt-8 mb-4">
		<el-button type="warning" @click="emit('cancelar')">Cancelar</el-button>
	</div>
</template>

<style lang="scss" scoped>
.busqueda-marcas {
	display: grid;
	padding: 0px 0.5rem;
	grid-template-columns: 1fr 3fr 1fr;
}
</style>

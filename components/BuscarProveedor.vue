<script setup lang="ts">
import DOM from "~/helpers/DOM";
import InformacionService from "~/modules/Module.Compras.Levantamiento/Services/InformacionService";
import type { TInfoProveedorDomain } from "~/modules/Module.Compras.Levantamiento/_Data/TipoInformacion";

const emit = defineEmits(["proveedorEncontrado", "cancelar"]);
const cargando = ref(false);

const servicioInfo = new InformacionService();

const stampReactivo = ref(0);

let proveedores = <TInfoProveedorDomain[]>[];

function seleccionarProveedor(proveedor: TInfoProveedorDomain) {
	emit("proveedorEncontrado", proveedor);
}

cargando.value = true;
servicioInfo.getProveedores().then((c) => {
	if (!!c) {
		proveedores = c;
		stampReactivo.value++;
		cargando.value = false;
	}
});
onMounted(() => {
	DOM.quitarFocusBotonCerrarElDialog();
});
</script>

<template>
	<div v-loading="cargando" :key="stampReactivo" style="min-height: 50vh">
		<TableFull
			:page-size="10"
			:dataRecibida="proveedores"
			:espacio-botones="true"
			:stamp="stampReactivo"
			:usar-filtrado-externo="false"
			tamCampoBusqueda="50%"
			:filter="[{ idProveedor: 'string' }, { rtn: 'string' }, { nombreProveedor: 'string' }]"
		>
			<template #thead>
				<tr class="busqueda-proveedores bg-gray-100" style="">
					<th>ID</th>
					<th>RTN</th>
					<th>Nombre</th>
					<th>Opciones</th>
				</tr>
			</template>
			<template #tbody="{ dataMostrada }">
				<tr class="busqueda-proveedores hover:bg-gray-100" v-for="(proveedor, index) in <TInfoProveedorDomain[]>dataMostrada" :key="index">
					<td style="text-align: left">{{ proveedor.idProveedor }}</td>
					<td style="text-align: left">{{ proveedor.rtn }}</td>
					<td>{{ proveedor.nombreProveedor }}</td>
					<td style="text-align: center"><el-button type="info" plain @click="seleccionarProveedor(proveedor)">Seleccionar</el-button></td>
				</tr>
			</template>
		</TableFull>
	</div>
	<div class="mt-8 mb-4">
		<el-button type="warning" @click="emit('cancelar')">Cancelar</el-button>
	</div>
</template>

<style lang="scss" scoped>
.busqueda-proveedores {
	display: grid;
	padding: 0px 0.5rem;
	grid-template-columns: 1fr 1fr 3fr 1fr;
}
</style>

<script setup lang="ts">
import DOM from "~/helpers/DOM";
import InformacionService from "~/modules/Module.Compras.Levantamiento/Services/InformacionService";
import type { TInfoProveedorDomain } from "~/modules/Module.Compras.Levantamiento/_Data/TipoInformacion";

const emit = defineEmits(["proveedorEncontrado", "cancelar"]);

const servicioInfo = new InformacionService();

const stampReactivo = ref(0);

let proveedores = <TInfoProveedorDomain[]>[];

servicioInfo.getProveedores().then((c) => {
	if (!!c) {
		proveedores = c;
		stampReactivo.value++;
	}
});

function seleccionarProveedor(proveedor: TInfoProveedorDomain) {
	emit("proveedorEncontrado", proveedor);
}

onMounted(() => {
	DOM.quitarFocusBotonCerrarElDialog();
});
</script>

<template>
	<div :key="stampReactivo" style="min-height: 50vh">
		<TableFull
			:page-size="10"
			:dataRecibida="proveedores"
			:espacio-botones="true"
			:stamp="stampReactivo"
			:usar-filtrado-externo="false"
			tamCampoBusqueda="50%"
			:filter="[{ nombreProveedor: 'string' }]"
		>
			<template #thead>
				<tr class="busqueda-proveedores bg-gray-100" style="">
					<th>RTN</th>
					<th>Nombre</th>
					<th>Opciones</th>
				</tr>
			</template>
			<template #tbody="{ dataMostrada }">
				<tr class="busqueda-proveedores hover:bg-gray-100" v-for="proveedor in <TInfoProveedorDomain[]>dataMostrada" :key="proveedor.nombreProveedor">
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
	grid-template-columns: 2fr 4fr 1fr;
}
</style>

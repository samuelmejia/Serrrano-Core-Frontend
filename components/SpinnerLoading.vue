<script setup lang="ts">
import { ElLoading } from "element-plus";

const props = defineProps<{
	visible: boolean;
	textoMostrar: string;
}>();

let loadingInstance: any = null;

watch(
	() => props.visible,
	(newValue) => {
		if (newValue && !loadingInstance) {
			loadingInstance = ElLoading.service({
				lock: true,
				text: props.textoMostrar,
				background: "rgba(0, 0, 0, 0.7)",
			});
		} else if (!newValue && loadingInstance) {
			loadingInstance.close();
			loadingInstance = null;
		}
	}
);

onUnmounted(() => {
	if (loadingInstance) {
		loadingInstance.close();
	}
});
</script>

<template></template>

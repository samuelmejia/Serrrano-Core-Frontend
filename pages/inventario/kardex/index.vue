<script setup lang="ts">
definePageMeta({
	layout: "general",
	title: "Kardex",
	subTitle: "Ver movimiento de productos",
});

const route = useRoute();
const codProducto = ref(route.query.codProducto);
</script>

<template>
	<p>Preparado para el kardex del producto</p>
	<p>codigoProducto: {{ codProducto }}</p>
</template>

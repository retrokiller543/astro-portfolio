<template>
    <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
            <li v-for="(crumb, index) in breadcrumbs" :key="crumb.path"
                :class="{ 'is-active': index === breadcrumbs.length - 1 }">
                <a @click="onNavigate(crumb.path)">{{ crumb.name }}</a>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    props: {
        breadcrumbs: {
            type: Array,
            required: true,
        },
    },
    methods: {
        onNavigate(path) {
            this.$emit('navigate', path);
        }
    }
};
</script>
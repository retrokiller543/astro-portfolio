<template>
    <div class="panel">
        <p class="panel-heading">
            Repository: {{ repo }}
        </p>
        <a class="panel-block" v-if="currentPath !== ''" @click="navigateTo(parentPath)">
            <span class="panel-icon">
                <FolderOpenIcon />
            </span>
            ..
        </a>
        <a v-for="file in files" :key="file.path" class="panel-block" @click="handleClick(file)">
            <span class="panel-icon">
                <FolderIcon v-if="file.type === 'dir'" />
                <FileIcon v-else-if="file.type === 'file'" />
                <FolderIcon v-else />
            </span>
            {{ file.name }}
        </a>
    </div>
</template>

<script>
import FolderIcon from '@assets/icons/FolderIcon.vue';
import FileIcon from '@assets/icons/FileIcon.vue';
import FolderOpenIcon from '@assets/icons/FolderOpenIcon.vue';

export default {
    components: {
        FolderIcon,
        FileIcon,
        FolderOpenIcon,
    },
    props: {
        files: {
            type: Array,
            required: true,
        },
        currentPath: {
            type: String,
            required: true,
        },
        repo: {
            type: String,
            required: true,
        },
        parentPath: {
            type: String,
            required: true,
        },
        navigateTo: {
            type: Function,
            required: true,
        },
        handleClick: {
            type: Function,
            required: true,
        },
    },
};
</script>

<style scoped>
.panel {
    flex: 1;
    transition: width 0.3s ease-in-out, height 0.3s ease-in-out;
    width: 100%;
    height: max-content;

    &.open-file {
        width: 30%;
    }
}

.panel-heading {
    color: var(--bulma-text-dark);
}

.panel-block {
    cursor: pointer;
}
</style>
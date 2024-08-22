<template>
    <div v-if="loading" class="file-explorer">
        <!-- Breadcrumb for navigation -->
        <Breadcrumbs :breadcrumbs="breadcrumbs" @navigate="navigateTo" />

        <!-- Main content area with directory listing and file preview side by side -->
        <div class="content-area">
            <!-- Panel for directory listing -->
            <FileList :files="files" :currentPath="currentPath" :repo="repo" :parentPath="parentPath"
                :navigateTo="navigateTo" :handleClick="handleClick" />

            <!-- File preview, only render if a file is selected -->
            <FilePreview v-if="selectedFileContent" :file="{ name: selectedFileName, content: selectedFileContent }" />
        </div>
    </div>

    <div v-else class="spinner">
        <div class="loader is-centered "></div>
        <p>Loading...</p>
    </div>
</template>

<script lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// @ts-ignore
import Breadcrumbs from './Breadcrumbs.vue';
// @ts-ignore
import FileList from './FileList.vue';
// @ts-ignore
import FilePreview from './FilePreview.vue';
// @ts-ignore
import type { FileData } from './FilePreview.vue';

export default {
    components: {
        Breadcrumbs,
        FileList,
        FilePreview
    },
    props: {
        owner: {
            type: String,
            required: true
        },
        repo: {
            type: String,
            required: true
        },
        path: {
            type: String,
            default: ''
        }
    },
    emits: ['navigate', 'filesFetched', 'fileSelected', 'error'],
    setup(props, { emit }) {
        const files = ref([]);
        const loading = ref(true);
        const selectedFileContent = ref('');
        const selectedFileName = ref('');
        const currentPath = ref(props.path);
        const breadcrumbs = ref([{ name: props.repo, path: '' }]);
        const isMarkdownFile = ref(false);

        const parentPath = computed(() => {
            const parts = currentPath.value.split('/').filter(Boolean);
            parts.pop();
            return parts.join('/');
        });

        const fetchFiles = async (path: string) => {
            loading.value = true;
            selectedFileContent.value = '';
            selectedFileName.value = '';
            isMarkdownFile.value = false;
            try {
                const response = await fetch(`https://api.github.com/repos/${props.owner}/${props.repo}/contents/${path}`);
                files.value = await response.json();

                // Sort files: directories first, then files by extension and alphabetically
                files.value.sort((a: FileData, b: FileData) => {
                    if (a.type === 'dir' && b.type !== 'dir') return -1;
                    if (a.type !== 'dir' && b.type === 'dir') return 1;
                    if (a.type === 'file' && b.type === 'file') {
                        const extA = a.name.split('.').pop().toLowerCase();
                        const extB = b.name.split('.').pop().toLowerCase();
                        if (extA < extB) return -1;
                        if (extA > extB) return 1;
                    }

                    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                });

                // Emit the filesFetched event after files are successfully fetched
                emit('filesFetched', files.value);

                // Check for README file
                // @ts-ignore
                const readmeFile: FileData = files.value.find(file => file.name === 'README.md');
                if (readmeFile) {
                    fetchFileContent(readmeFile.path);
                }

                updateBreadcrumbs(path);
            } catch (error) {
                console.error('Error fetching files:', error);
                emit('error', error); // Emit an error event if file fetching fails
            } finally {
                //loading.value = false;
            }
        };

        const updateBreadcrumbs = (path: string) => {
            const parts = path.split('/').filter(Boolean);
            breadcrumbs.value = [{ name: props.repo, path: '' }];
            let currentPath = '';
            parts.forEach((part: any) => {
                currentPath += `${part}/`;
                breadcrumbs.value.push({ name: part, path: currentPath.slice(0, -1) });
            });
        };

        const handleClick = (file: { type: string; path: any; }) => {
            if (file.type === 'dir') {
                navigateTo(file.path);
            } else {
                fetchFileContent(file.path);
            }
        };

        const fetchFileContent = async (filePath: string) => {
            try {
                const response = await fetch(`https://api.github.com/repos/${props.owner}/${props.repo}/contents/${filePath}`);
                const file = await response.json();
                selectedFileContent.value = atob(file.content);
                selectedFileName.value = file.name;
                isMarkdownFile.value = filePath.toLowerCase().endsWith('.md');

                // Emit the fileSelected event after a file is selected
                emit('fileSelected', { name: file.name, content: selectedFileContent.value });
            } catch (error) {
                console.error('Error fetching file content:', error);
                emit('error', error); // Emit an error event if file content fetching fails
            }
        };

        const navigateTo = (path: string) => {
            currentPath.value = path;
            fetchFiles(path);
            emit('navigate', path); // Emit the navigate event when navigating to a different directory
        };

        const parsedMarkdown = computed(() => {
            const raw = marked(selectedFileContent.value);
            return DOMPurify.sanitize(raw);
        });

        onMounted(() => {
            fetchFiles(currentPath.value);
        });

        watch(() => props.path, (newPath) => {
            currentPath.value = newPath;
            fetchFiles(newPath);
        });

        return {
            files,
            loading,
            selectedFileContent,
            selectedFileName,
            breadcrumbs,
            navigateTo,
            handleClick,
            parentPath,
            currentPath,
            isMarkdownFile,
            parsedMarkdown
        };
    }
};
</script>

<style scoped lang="scss">
.file-explorer {
    display: flex;
    flex-direction: column;
}

.breadcrumb {
    margin-bottom: 1rem;
}

/* Flexbox layout for side-by-side display */
.content-area {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    flex-direction: row;
}

.panel {
    flex: 1;
    /* Take full width by default */
    transition: width 0.3s ease-in-out;
    transition: height 0.3s ease-in-out;
    width: 100%;
    height: max-content;

    &.open-file {
        width: 30%;
    }
}

.spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    flex-direction: column;
    font-size: 5rem;
}

/* [data-theme="nord"] .panel-heading {
    color: var(--bulma-text-dark);
}

[data-theme="dark"] .panel-heading {
    color: var(--bulma-text-dark)
}

[data-them="light"] .panel-heading {
    color: hsl(var(--bulma-panel-h), var(--bulma-panel-s), var(--bulma-panel-heading-color-l)) !important;
} */


.file-preview {
    width: 70%;
    white-space: pre-wrap;
    overflow-wrap: break-word;
}

/* Fade transition for file preview */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.panel-block {
    cursor: pointer;
}

/* Mobile styles */
@media screen and (max-width: 768px) {
    .content-area {
        flex-direction: column;
        /* Stack the content vertically on mobile */
    }

    .panel {
        width: 100%;
    }

    .open-file {
        width: 100%;
    }

    .file-preview {
        width: 100%;
    }
}
</style>
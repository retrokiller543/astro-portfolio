<template>
    <div class="file-explorer">
        <!-- Breadcrumb for navigation -->
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li v-for="(crumb, index) in breadcrumbs" :key="crumb.path"
                    :class="{ 'is-active': index === breadcrumbs.length - 1 }">
                    <a @click="navigateTo(crumb.path)">{{ crumb.name }}</a>
                </li>
            </ul>
        </nav>

        <!-- Main content area with directory listing and file preview side by side -->
        <div class="content-area">
            <!-- Panel for directory listing -->
            <div class="panel" :class="{ 'open-file': selectedFileContent }">
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

            <!-- File preview, only render if a file is selected -->
            <transition name="fade">
                <div v-if="selectedFileContent" class="box file-preview">
                    <h2 class="subtitle">{{ selectedFileName }}</h2>
                    <div v-if="isMarkdownFile" v-html="parsedMarkdown"></div>
                    <pre v-else>{{ selectedFileContent }}</pre>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

import FileIcon from '@assets/icons/FileIcon.vue';
import FolderIcon from '@assets/icons/FolderIcon.vue';
import FolderOpenIcon from '@assets/icons/FolderOpenIcon.vue';

export default {
    components: {
        FileIcon,
        FolderIcon,
        FolderOpenIcon
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
    setup(props) {
        const files = ref([]);
        const loading = ref(true);
        const selectedFileContent = ref('');
        const selectedFileName = ref('');
        const currentPath = ref(props.path);
        const breadcrumbs = ref([{ name: props.repo, path: '' }]);
        const isMarkdownFile = ref(false);

        const parentPath = computed(() => {
            const parts = currentPath.value.split('/').filter(Boolean);
            parts.pop();  // Remove the last part to get the parent directory
            return parts.join('/');
        });

        const fetchFiles = async (path) => {
            loading.value = true;
            selectedFileContent.value = '';
            selectedFileName.value = '';
            isMarkdownFile.value = false;
            try {
                const response = await fetch(`https://api.github.com/repos/${props.owner}/${props.repo}/contents/${path}`);
                files.value = await response.json();

                // Sort files: directories first, then files by extension and alphabetically
                files.value.sort((a, b) => {
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

                // check for readme file
                const readmeFile = files.value.find(file => file.name === 'README.md');
                
                if (readmeFile) {
                    fetchFileContent(readmeFile.path);
                }

                updateBreadcrumbs(path);
            } catch (error) {
                console.error('Error fetching files:', error);
            } finally {
                loading.value = false;
            }
        };

        const updateBreadcrumbs = (path) => {
            const parts = path.split('/').filter(Boolean);
            breadcrumbs.value = [{ name: props.repo, path: '' }];
            let currentPath = '';
            parts.forEach(part => {
                currentPath += `${part}/`;
                breadcrumbs.value.push({ name: part, path: currentPath.slice(0, -1) });
            });
        };

        const handleClick = (file) => {
            if (file.type === 'dir') {
                navigateTo(file.path);
            } else {
                fetchFileContent(file.path);
            }
        };

        const fetchFileContent = async (filePath) => {
            try {
                const response = await fetch(`https://api.github.com/repos/${props.owner}/${props.repo}/contents/${filePath}`);
                const file = await response.json();
                selectedFileContent.value = atob(file.content);
                selectedFileName.value = file.name;
                isMarkdownFile.value = filePath.toLowerCase().endsWith('.md');
            } catch (error) {
                console.error('Error fetching file content:', error);
            }
        };

        const navigateTo = (path) => {
            currentPath.value = path;
            fetchFiles(path);
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
        /* Full width for both panel and preview on mobile */
    }

    .open-file {
        width: 100%;
    }

    .file-preview {
        width: 100%;
    }
}
</style>
<template>
    <transition name="fade">
        <div class="box file-preview" v-if="file">
            <h2 class="subtitle">{{ file.name }}</h2>
            <div v-if="isMarkdownFile" v-html="parsedMarkdown"></div>
            <pre v-else>{{ file.content }}</pre>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export interface FileData {
    name: string;
    content: string;
}

export default defineComponent({
    props: {
        file: {
            type: Object as () => FileData,
            required: true
        },
    },
    setup(props) {
        const isMarkdownFile = computed(() => props.file.name.toLowerCase().endsWith('.md'));

        marked.use({
            gfm: true,
            breaks: true,
            hooks: {
                postprocess(html) {
                    return DOMPurify.sanitize(html);
                },
            }
        });

        const parsedMarkdown = computed(() => {
            if (isMarkdownFile.value) {
                return marked(props.file.content);
            }
            return '';
        });

        return {
            isMarkdownFile,
            parsedMarkdown
        };
    }
});
</script>

<style scoped>
.file-preview {
    width: 70%;
    white-space: pre-wrap;
    overflow-wrap: break-word;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
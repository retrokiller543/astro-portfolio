<template>
    <transition name="fade">
        <div class="box file-preview" v-if="file">
            <h2 class="subtitle">{{ file.name }}</h2>
            <div v-if="isMarkdownFile" v-html="parsedMarkdown"></div>
            <pre v-else>
                <code v-html="highlightedCode"></code>
            </pre>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { marked } from 'marked';
import prism from "prismjs";
import DOMPurify from 'dompurify';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-bash';
import 'prismjs/themes/prism.css';

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
            highlight: function (code, lang) {
                return prism.highlight(code, prism.languages[lang], lang);
            },
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

        const highlightedCode = computed(() => {
            if (!isMarkdownFile.value) {
                // check if the file has grammer with prismjs
                const fileExtension = props.file.name.split('.').pop()?.toLowerCase();
                const language = fileExtension && prism.languages[fileExtension] ? fileExtension : 'none';
                if (prism.languages[language]) {
                    return prism.highlight(props.file.content, prism.languages[language], language);
                } else {
                    return props.file.content;
                }
            }
            return '';
        });

        return {
            isMarkdownFile,
            parsedMarkdown,
            highlightedCode
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
<template>
    <div class="section">
        <div class="container">
            <!-- Search input with filter toggle button -->
            <div class="field has-addons">
                <div class="control has-icons-left is-expanded">
                    <input type="text" placeholder="Search..." v-model="searchTerm" class="input" @input="search" />
                    <span class="icon is-left">
                        <SearchIcon />
                    </span>
                </div>
                <div class="control">
                    <button class="button is-primary" @click="toggleFilters">
                        <span class="icon">
                            <i class="fas fa-filter"></i>
                        </span>
                        <span>Filters</span>
                    </button>
                </div>
            </div>

            <!-- Filters dropdown, hidden initially -->
            <div v-show="filtersVisible" class="box">
                <!-- Tags filter dropdown -->
                <div class="field">
                    <label class="label">Filter by Tag</label>
                    <div class="control has-icons-left">
                        <div class="select is-fullwidth">
                            <select v-model="selectedTag" @change="search">
                                <option value="">All Tags</option>
                                <option v-for="tag in availableTags" :key="tag" :value="tag">
                                    {{ tag }}
                                </option>
                            </select>
                        </div>
                        <span class="icon is-left">
                            <LableIcon />
                        </span>
                    </div>
                </div>

                <!-- Authors filter dropdown -->
                <div class="field">
                    <label class="label">Filter by Author</label>
                    <div class="control has-icons-left">
                        <div class="select is-fullwidth">
                            <select v-model="selectedAuthor" @change="search">
                                <option value="">All Authors</option>
                                <option v-for="author in availableAuthors" :key="author" :value="author">
                                    {{ author }}
                                </option>
                            </select>
                        </div>
                        <span class="icon is-left">
                            <PersonIcon />
                        </span>
                    </div>
                </div>
            </div>

            <!-- Search Results -->
            <div class="box" id="results">
                <div v-if="showResults">
                    <!-- @vue-ignore -->
                    <div v-for="result in results" :key="result.item.slug" class="panel-block">
                        <div class="card">
                            <div class="card-content">
                                <h3 class="title is-4">
                                    <!-- @vue-ignore -->
                                    <a :href="`/blog/${result.item.slug}`" class="is-link">
                                        <!-- @vue-ignore -->
                                        {{ result.item.data.title }}
                                    </a>
                                </h3>
                                <p class="subtitle is-6">
                                    <!-- @vue-ignore -->
                                    {{ result.item.data.subtitle }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p class="has-text-grey-light">No results found.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// @ts-ignore
import type { CollectionEntry } from 'astro:content';
import Fuse from 'fuse.js';
import SearchIcon from '../../assets/icons/SearchIcon.vue';
import PersonIcon from '../../assets/icons/PersonIcon.vue';
import LableIcon from '../../assets/icons/LableIcon.vue';

export default defineComponent({
    components: {
        SearchIcon,
        PersonIcon,
        LableIcon,
    },
    props: {
        posts: {
            type: Array as () => Array<CollectionEntry<'blog'>>,
            required: true,
        },
    },
    data() {
        return {
            searchTerm: '',
            selectedTag: '',
            selectedAuthor: '',
            availableTags: this.getUniqueTags(),
            availableAuthors: this.getUniqueAuthors(),
            fuse: new Fuse(this.posts, {
                keys: [
                    { name: 'data.title', weight: 0.4 },
                    { name: 'id', weight: 0.3 },
                    { name: 'slug', weight: 0.3 },
                    { name: 'data.subtitle', weight: 0.25 },
                    { name: 'data.description', weight: 0.25 },
                    { name: 'data.tags.id', weight: 0.2 },
                    { name: 'data.author.id', weight: 0.05 },
                ],
                includeMatches: true,
                minMatchCharLength: 2,
                threshold: 0.5,
                includeScore: true,
                useExtendedSearch: true,
            }),
            results: [],
            showResults: false,
            filtersVisible: false, // State to toggle filters visibility
        };
    },
    methods: {
        getUniqueTags() {
            return [
                ...new Set(
                    this.posts.flatMap((post) => {
                        return post.data.tags.map((tag) => tag.id);
                    })
                ),
            ];
        },
        getUniqueAuthors() {
            return [...new Set(this.posts.map((post) => post.data.author.id))];
        },
        search() {
            let filteredResults = this.fuse.search(this.searchTerm);

            if (this.selectedTag) {
                filteredResults = filteredResults.filter((result) =>
                    result.item.data.tags.some((tag) => tag.id === this.selectedTag)
                );
            }

            if (this.selectedAuthor) {
                filteredResults = filteredResults.filter(
                    (result) => result.item.data.author.id === this.selectedAuthor
                );
            }

            if (filteredResults.length > 0) {
                this.results = filteredResults;
                this.showResults = true;
            } else {
                this.showResults = false;
            }
        },
        toggleFilters() {
            this.filtersVisible = !this.filtersVisible;
        },
    },
});
</script>

<style scoped>
.section {
    padding-top: 2rem;
    padding-bottom: 2rem;
}

.input,
.select {
    margin-bottom: 1rem;
    width: 100%;
}

.box {
    margin-top: 1rem;
    padding: 1rem;
}

.card {
    margin-bottom: 1rem;
}

.button {
    min-width: 120px;
}
</style>

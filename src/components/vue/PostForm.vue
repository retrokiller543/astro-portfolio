<template>
    <form>
        <div class="field">
            <label class="label" for="title">Title</label>
            <div class="control">
                <input class="input" type="text" v-model="form.title" id="title" />
            </div>
        </div>

        <div class="field">
            <label class="label" for="content">Content</label>
            <div class="control">
                <textarea class="textarea" v-model="form.content" id="content"></textarea>
            </div>
        </div>

        <div class="field is-grouped">
            <div class="control">
                <button class="button is-link" type="submit" @click="submitForm">Submit</button>
            </div>
        </div>
    </form>
</template>

<script lang="ts">
import BlogApiClient, { type BlogPost } from "../../api/BlogClient";

export default {
    data() {
        return {
            form: {
                title: "",
                content: "",
            },

            blogApiClient: new BlogApiClient(),
        };
    },
    methods: {
        submitForm() {
            const post: BlogPost = {
                title: this.form.title,
                content: this.form.content,
            };

            this.blogApiClient
                .createPost(post)
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
};
</script>
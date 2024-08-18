<template>
    <div class="container">
        <form @submit.prevent="handleLogin" class="box">
            <div class="field">
                <label class="label" for="username">Email/Username:</label>
                <div class="control">
                    <input class="input" type="text" v-model="username" required />
                </div>
            </div>
            <div class="field">
                <label class="label" for="password">Password:</label>
                <div class="control">
                    <input class="input" type="password" v-model="password" required />
                </div>
            </div>
            <div class="field">
                <div class="control">
                    <button class="button is-primary" type="submit">Login</button>
                </div>
            </div>
        </form>

        <hr />

        <!-- OAuth Google Login -->
        <div class="field">
            <div class="control">
                <button class="button is-link" @click="handleGoogleLogin">Login with Google</button>
            </div>
        </div>
    </div>
</template>

<script>
import { BLOG_API_BASE_URL } from 'astro:env/client';

export default {
    data() {
        return {
            username: '',
            password: ''
        };
    },

    methods: {
        async handleLogin() {
            console.error("Login with email and password not implemented yet");
        },
        handleGoogleLogin() {
            window.location.href = BLOG_API_BASE_URL + '/oauth/google/login';
        }
    }
};
</script>
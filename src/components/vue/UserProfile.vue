<template>
    <div class="user-profile">
        <h1 class="title">
            <span v-if="userStore && authStore">{{ userStore.username }}</span>
            <span v-else>Loading...</span>
        </h1>
        <div v-if="userStore && authStore">
            <p>Email: {{ userStore.email }}</p>
            <p>Full Name: {{ userStore.first_name }} {{ userStore.last_name }}</p>
            <p>Username: {{ userStore.username }}</p>
            <p>Created At: {{ new Date(userStore.created_at).toLocaleString() }}</p>
            <p>Last Login: {{ userStore.last_login ? new Date(userStore.last_login).toLocaleString() : 'Never' }}</p>
            <img v-if="userStore.picture" :src="userStore.picture" alt="Profile Picture" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { userInfo, setUserInfo, isAuthenticated } from "@stores/authStore";
import { useStore } from '@nanostores/vue';
import AuthApiClient from "@/api/AuthClient";

export default defineComponent({
    props: {
        id: {
            type: String,
            required: true
        }
    },
    setup() {
        const userStore = useStore(userInfo);
        const authStore = useStore(isAuthenticated);

        return {
            userStore: userStore,
            authStore: authStore
        };
    },

    methods: {
        async getUserInfo() {
            const client = new AuthApiClient();
            try {
                const response = await client.getUserInfo({ username: this.id });
                setUserInfo(response);
                console.log("User info fetched:", response);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        },
    },
    mounted() {
        if (!this.authStore) {
            console.log("No user is authenticated, fetching...");
            return;
        } else {
            console.log("User is authenticated");
        }

        if (!this.userStore) {
            console.log("No user info is stored, fetching...");
            this.getUserInfo();
        } else {
            console.log("User info is already stored");
        }
    },
});
</script>
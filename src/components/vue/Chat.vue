<template>
    <div>
        <div>
            <button @click="toggleConnection">{{ connectionButtonLabel }}</button>
            <span>Status:</span>
            <span :style="{ backgroundColor: statusColor }">{{ connectionStatus }}</span>
        </div>

        <div id="log">
            <!-- @vue-ignore -->
            <p v-for="(message, index) in messages" :key="index" :class="'msg msg--' + message.type">
                <!-- @vue-ignore -->
                {{ message.text }}
            </p>
        </div>

        <form @submit.prevent="sendMessage">
            <input type="text" v-model="message" autocomplete="off" id="text" />
            <input type="submit" id="send" />
        </form>
    </div>
</template>

<script lang="ts">
// @ts-ignore
import { BLOG_API_BASE_URL } from "astro:env/client";

export default {
    data() {
        return {
            socket: null,
            connectionStatus: 'disconnected',
            connectionButtonLabel: 'Connect',
            statusColor: 'red',
            message: '',
            messages: []
        };
    },
    methods: {
        log(text, type = 'status') {
            this.messages.push({ text, type });
            this.$nextTick(() => {
                const logElement = document.getElementById('log');

                if (!logElement) return;

                logElement.scrollTop = logElement.scrollHeight;
            });
        },
        connect() {
            this.disconnect();
            /* let proto = BLOG_API_BASE_URL.startsWith('http') ? 'wss' : 'ws';
            proto = BLOG_API_BASE_URL.startsWith('https') ? 'wss' : 'ws';
            let host = BLOG_API_BASE_URL.split('//')[1];
            host = host.startsWith('localhost') ? '127.0.0.1' : host; */
            const wsUri = `${BLOG_API_BASE_URL}/ws`;

            this.log('Connecting...');
            this.socket = new WebSocket(wsUri);

            this.socket.onopen = () => {
                this.log('Connected');
                this.updateConnectionStatus(true);
            };

            this.socket.onmessage = (ev) => {
                this.log('Received: ' + ev.data, 'message');
            };

            this.socket.onclose = () => {
                this.log('Disconnected');
                this.socket = null;
                this.updateConnectionStatus(false);
            };
        },
        disconnect() {
            if (this.socket) {
                this.log('Disconnecting...');
                this.socket.close();
                this.socket = null;
                this.updateConnectionStatus(false);
            }
        },
        updateConnectionStatus(connected) {
            if (connected) {
                this.connectionStatus = 'connected';
                this.connectionButtonLabel = 'Disconnect';
                this.statusColor = 'transparent';
                this.$nextTick(() => this.$refs.text.focus());
            } else {
                this.connectionStatus = 'disconnected';
                this.connectionButtonLabel = 'Connect';
                this.statusColor = 'red';
            }
        },
        toggleConnection() {
            if (this.socket) {
                this.disconnect();
            } else {
                this.connect();
            }
        },
        sendMessage() {
            if (this.message.trim()) {
                this.log('Sending: ' + this.message);
                this.socket.send(this.message);
                this.message = '';
            }
            this.$refs.text.focus();
        }
    }
};
</script>

<style scoped>
/* Add any additional scoped styles here */
</style>
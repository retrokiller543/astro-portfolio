<template>
    <div class="notifications-container">
        <div v-for="notification in notifications" :key="notification.id" class="notification is-danger is-light">
            <p>{{ notification.message }}</p>
            <button class="delete" @click="remove(notification.id)"></button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@nanostores/vue';
import { notificationStore, removeNotification } from '@stores/notifcationStore';

export default defineComponent({
    setup() {
        const notifications = useStore(notificationStore);

        const remove = (id: string) => {
            removeNotification(id);
        };

        return {
            notifications,
            remove,
        };
    },
});
</script>

<style scoped>
.notifications-container {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.notification {
    animation: slide-in 0.3s ease-out;
}

@keyframes slide-in {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
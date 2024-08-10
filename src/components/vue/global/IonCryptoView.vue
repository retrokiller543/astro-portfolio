<template>
    <main class="is-flex">
      <IonCryptoMenu @menuToggled="sidebarOpened" client:idle />
      <section class="of-auto content" :class="{'main-content': sidebarOpen}">
        <slot></slot>
      </section>
      <button
        client:idle
        @click="openConfig"
        class="button is-primary is-fixed-bottom-right"
      >
        Config
      </button>
      <IonConfigModal client:idle v-if="showModal" @close="closeModal" @submit="submitConfig" />
    </main>
  </template>
  
  <script lang="ts">
  import IonConfigModal from './IonConfigModal.vue';
  import IonCryptoMenu from './IonCryptoMenu.vue';

  import { ref } from 'vue';
  import { type Config, get_default_config } from '../../../models/config.ts';
  
  export default {
    components: {
      IonConfigModal,
      IonCryptoMenu,
    },
    props: {
      onConfigSaved: {
        type: Function,
      },
    },

    data() {
      return {
        sidebarOpen: true,
      };
    },

    methods: {
      submitConfig(config: Config) {
        this.$emit('configSaved', config);
        this.closeModal();
      },
      openConfig() {
        this.showModal = true;
      },
      sidebarOpened(isOpen: boolean) {
        this.sidebarOpen = isOpen;
      },
    },
    emits: ['configSaved'],
    setup() {
      const showModal = ref(false);
  
      const closeModal = () => {
        showModal.value = false;
      };
  
      return {
        showModal,
        closeModal,
      };
    },
  };
  </script>
  
  <style scoped>
  .is-fixed-bottom-right {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 41;
  }

  .content {
    transition: margin-left 0.3s ease-in-out;
    padding-top: 5rem;
    margin-left: 2rem;
    margin-right: 2rem;
  }

  .main-content {
      margin-left: 17rem;
    }
  </style>
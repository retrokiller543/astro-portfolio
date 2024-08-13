<template>
  <main class="is-flex">
    <SidebarMenu :sections="sections" @menuToggled="sidebarOpened" client:load transition:presit />
    <section class="of-auto content" :class="{ 'main-content': sidebarOpen }">
      <button @click="goBack" class="button is-back">
        Go Back
      </button>
      <article class="shifted">
        <slot></slot>
      </article>
    </section>
    <IonConfigModal client:idle @close="closeModal" @submit="submitConfig" />
  </main>
</template>

<script lang="ts">
import IonConfigModal from './IonConfigModal.vue';
import SidebarMenu from './SidebarMenu.vue';

import { ref } from 'vue';
import { type Config } from '../../../models/config.ts';
import { sections } from "@/config/cryptoSidebarConfig";

export default {
  components: {
    IonConfigModal,
    SidebarMenu,
  },
  props: {
    onConfigSaved: {
      type: Function,
    },
  },

  data() {
    return {
      sidebarOpen: false,
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
    goBack() {
      window.history.back();
    },
  },
  emits: ['configSaved'],
  created() {
    const savedState = window.localStorage.getItem('isMenuOpen');
    this.sidebarOpen = savedState === 'true'; // Set sidebarOpen based on localStorage
  },
  computed: {
    sections() {
      return sections;
    },
  },
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

<style scoped lang="scss">
$z-index-fixed-button: 41;
$fixed-bottom-spacing: 1rem;
$back-button-top: 6rem;
$back-button-left: 0rem;
$content-padding-top: 5rem;
$content-margin-left: 2rem;
$content-margin-right: 2rem;
$content-width: 100%;
$content-padding-right: 4rem;
$main-content-margin-left: 17rem;
$shifted-margin-top: 5rem;

.is-fixed-bottom-right {
  position: fixed;
  bottom: $fixed-bottom-spacing;
  right: $fixed-bottom-spacing;
  z-index: $z-index-fixed-button;
}

.is-back {
  position: absolute;
  top: $back-button-top;
  left: $back-button-left;
}

.content {
  transition: margin-left 0.3s ease-in-out;
  padding-top: $content-padding-top;
  margin-left: $content-margin-left;
  margin-right: $content-margin-right;
  width: $content-width;
  position: relative;
  padding-right: $content-padding-right;
}

.main-content {
  margin-left: $main-content-margin-left;
}

.shifted {
  margin-top: $shifted-margin-top;
}
</style>
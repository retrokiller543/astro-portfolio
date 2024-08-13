<template>
  <div>
    <button id="config-button" class="button is-primary is-fixed-bottom-right" @click="toggleModal"> Config </button>
    <div v-if="isModalOpen" class="modal is-active">
      <IonModal @close="close">
        <template #body>
          <div class="box">
            <h2 class="title is-4">Configure Crypto Engine</h2>

            <form @submit.prevent="submitForm">
              <div v-for="(value, key) in formObj" :key="key" class="field">
                <label class="label">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</label>
                <div class="control">
                  <input v-if="getInputType(value) !== 'checkbox'" class="input" v-model="form[key]"
                    :type="getInputType(value)" :required="isRequired(value)" />
                  <label v-else class="checkbox">
                    <input v-model="form[key]" :type="getInputType(value)" :required="isRequired(value)"
                      @change="key === 'base64' && toggleBase64()" />
                    Enable {{ key.charAt(0).toUpperCase() + key.slice(1) }}
                  </label>
                </div>
              </div>



              <div class="field is-grouped">
                <div class="control">
                  <button class="button is-link" type="submit">Save</button>
                </div>
                <div class="control">
                  <button class="button is-light" @click="close">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </template>
      </IonModal>
    </div>
  </div>
</template>

<script lang="ts">
import IonModal from './IonModal.vue';

import { defineComponent, reactive, ref } from 'vue';
import { useConfigStore } from '../stores/config';
import { BASE64_ALPHABET, ALPHABET, type Config } from '../../../models/config';

export default defineComponent({
  components: {
    IonModal
  },
  emits: ['close', 'closeModal', 'configSaved'],
  methods: {
    toggleModal() {
      this.isModalOpen = !this.isModalOpen;
    },
    getComponentType(value: any) {
      if (typeof value === 'boolean') return 'checkbox';
      if (typeof value === 'number') return 'number';
      if (typeof value === 'string') return 'input';

      return 'input';
    },
    getInputType(value: any) {
      if (typeof value === 'boolean') return 'checkbox';
      if (typeof value === 'number') return 'number';
      if (typeof value === 'string') return 'text';

      return 'text';
    },
    isRequired(value: any) {
      if (value === 'alfabet') return true;
      return false;
    },
    toggleBase64() {
      if (this.form.base64) {
        this.form.alphabet = BASE64_ALPHABET;
      } else {
        this.form.alphabet = ALPHABET;
      }
    }
  },
  computed: {
    formObj() {
      return {
        alphabet: this.form.alphabet,
        base64: this.form.base64
      }
    }
  },

  setup(props, { emit }) {
    const configStore = useConfigStore();
    let form: Config = reactive(configStore.config);
    const isModalOpen = ref(false);

    const formType: Config = reactive({
      alphabet: form.alphabet,
      base64: form.base64
    })

    const close = () => {
      isModalOpen.value = false;
      emit('close');
      emit('closeModal');
    };

    const submitForm = () => {
      emit('configSaved', form);
      configStore.setConfig(form);
      close();
    };

    return {
      form,
      formType,
      close,
      submitForm,
      isModalOpen
    };
  },
});
</script>


<style scoped lang="scss">
$z-index-fixed-button: 41;
$fixed-bottom-spacing: 1rem;

.is-fixed-bottom-right {
  position: fixed;
  bottom: $fixed-bottom-spacing;
  right: $fixed-bottom-spacing;
  z-index: $z-index-fixed-button;
}
</style>
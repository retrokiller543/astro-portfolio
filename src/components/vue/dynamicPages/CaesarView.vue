<template>
    <IonCryptoView>
        <div>
            <h1 class="title">Caesar</h1>
            <article class="section">
                <section class="section">
                    <h2 class="title">Encrypt</h2>
                    <form @submit.prevent="submitEncryptForm">
                        <div class="field">
                            <label class="label">Key</label>
                            <div class="control is-flex">
                                <input class="input" type="number" v-model="encryptionForm.key" />
                                <button class="button is-info ml-2" type="button" @click="generateRandomKey">
                                    Generate Random Key
                                </button>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Plaintext</label>
                            <div class="control">
                                <input class="input" type="text" v-model="encryptionForm.plaintext" />
                            </div>
                        </div>

                        <div class="field is-grouped">
                            <div class="control">
                                <button class="button is-info" type="submit">Encrypt</button>
                            </div>
                        </div>
                    </form>
                </section>

                <section v-if="encrypted_str" class="section">
                    <h2 class="title">Results</h2>
                    <p class="subtitle">{{ encrypted_str }}</p>
                    <p class="subtitle">Encryption Time: {{ encryptionTime }} ms</p>
                </section>
            </article>

            <article class="section">
                <section class="section">
                    <h2 class="title">Decrypt</h2>
                    <form @submit.prevent="submitDecryptForm">
                        <div class="field">
                            <label class="label">Key</label>
                            <div class="control is-flex">
                                <input class="input" type="number" v-model="decryptionForm.key" />
                                <button class="button is-info ml-2" type="button" @click="generateRandomKey">
                                    Generate Random Key
                                </button>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Plaintext</label>
                            <div class="control">
                                <input class="input" type="text" v-model="decryptionForm.plaintext" />
                            </div>
                        </div>

                        <div class="field is-grouped">
                            <div class="control">
                                <button class="button is-info" type="submit">Decrypt</button>
                            </div>
                        </div>
                    </form>
                </section>

                <section v-if="decypted_str" class="section" style="z-index: 100;">
                    <h2 class="title">Results</h2>
                    <p class="subtitle">{{ decypted_str }}</p>
                    <p class="subtitle">Decrypted Time: {{ decryptionTime }} ms</p>
                </section>
            </article>
        </div>
    </IonCryptoView>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { type Config, caesar_encrypt, caesar_decrypt } from '../../../api/ApiClient';
import IonCryptoView from '../global/IonCryptoView.vue';
import { useConfigStore } from '../stores/config';
import timingMixin from '../mixins/timingMixin';

export default defineComponent({
    components: {
        IonCryptoView,
    },
    mixins: [timingMixin],
    data() {
        return {
            encryptionForm: {
                key: 0,
                plaintext: '',
            },
            decryptionForm: {
                key: 0,
                plaintext: '',
            },
            encrypted: '',
            decrypted: '',
        };
    },
    computed: {
        config() {
            return this.configStore.config;
        },
        encrypted_str(): string {
            return this.encrypted;
        },
        decypted_str(): string {
            return this.decrypted;
        }
    },
    methods: {
        configSaved(config: Config) {
            console.log(config);
        },
        submitEncryptForm() {
            this.encryptionTime = this.timeOperation(() => {
                const data = {
                    key: this.encryptionForm.key,
                    input: this.encryptionForm.plaintext,
                    config: this.configStore.config
                }

                caesar_encrypt(data).then((res) => {
                    this.encrypted = res;
                });
            });
        },
        submitDecryptForm() {
            this.decryptionTime = this.timeOperation(() => {
                const data = {
                    key: this.encryptionForm.key,
                    input: this.encryptionForm.plaintext,
                    config: this.configStore.config
                }

                caesar_decrypt(data).then((res) => {
                    this.decrypted = res;
                });
            });
        },
        generateRandomKey() {
            const key = Math.floor(Math.random() * this.config.alfabet.length) + 1;
            this.encryptionForm.key = key;
            this.decryptionForm.key = key;
        }
    },
    setup() {
        const configStore = useConfigStore();
        return {
            configStore,
        };
    }
});
</script>

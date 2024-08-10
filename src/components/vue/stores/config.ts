import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { fetchConfig, type Config } from '../../../api/ApiClient';
import { ALPHABET } from '../../../models/config';

export const useConfigStore = defineStore('config', () => {
  // Initialize with default values
  const config = ref<Config>({
    alphabet: ALPHABET,
    base64: false,
  });

  // Fetch and set the config asynchronously
  async function fetchAndSetConfig() {
    const fetchedConfig = await fetchConfig({ get_default: true, get_base64: false });
    if (fetchedConfig) {
      config.value = fetchedConfig;
    }
  }

  // Computed properties
  const alphabet = computed(() => config.value.alphabet);
  const base64 = computed(() => config.value.base64);

  // Method to manually set the config
  function setConfig(newConfig: Config) {
    config.value = newConfig;
  }

  // Call the fetchAndSetConfig function asynchronously
  fetchAndSetConfig();

  return { config, alphabet, base64, setConfig };
});
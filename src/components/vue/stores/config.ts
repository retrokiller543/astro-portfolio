import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { fetchConfig, type Config } from '@api/ApiClient';
import { ALPHABET } from '@models/config';

export const useConfigStore = defineStore('config', () => {
  // Load initial config from localStorage if available, otherwise use defaults
  const storedConfig = localStorage.getItem('config');
  const config = ref<Config>(storedConfig ? JSON.parse(storedConfig) : {
    alphabet: ALPHABET,
    base64: false,
  });

  // Fetch and set the config asynchronously
  async function fetchAndSetConfig() {
    const fetchedConfig = await fetchConfig({ get_default: true, get_base64: false });
    if (fetchedConfig) {
      config.value = fetchedConfig;
      saveConfigToLocalStorage(); // Save to localStorage after fetching
    }
  }

  // Computed properties
  const alphabet = computed(() => config.value.alphabet);
  const base64 = computed(() => config.value.base64);

  // Method to manually set the config
  function setConfig(newConfig: Config) {
    config.value = newConfig;
    saveConfigToLocalStorage(); // Save to localStorage when config changes
  }

  // Save config to localStorage
  function saveConfigToLocalStorage() {
    localStorage.setItem('config', JSON.stringify(config.value));
  }

  // Watch for changes in config and save them to localStorage
  watch(config, (newConfig) => {
    saveConfigToLocalStorage();
  }, { deep: true });

  // Fetch the config on store initialization
  fetchAndSetConfig();

  return { config, alphabet, base64, setConfig };
});
import { defineStore } from "pinia";

const LS_KEY_ESPRESSOS = "settings";

export const useSettingStore = defineStore(LS_KEY_ESPRESSOS, {
  state: () => ({
    settings: JSON.parse(localStorage.getItem(LS_KEY_ESPRESSOS)) || { espressoID: "new", extractionTime: "", grindSize: "", grindTime: "" },
  }),
  actions: {
    updateSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings };
      this.updateLocalStorage();
    },
    updateLocalStorage() {
      try {
        localStorage.setItem(LS_KEY_ESPRESSOS, JSON.stringify(this.settings));
      } catch (error) {
        console.error("Error saving the Data to LocalStorage:", error);
      }
    },
  },
  getters: {
    // Getter für jede Einstellung
    extractionTime(state) {
      return state.settings.extractionTime;
    },
    grindSize(state) {
      return state.settings.grindSize;
    },
    grindTime(state) {
      return state.settings.grindTime;
    },
  },
});

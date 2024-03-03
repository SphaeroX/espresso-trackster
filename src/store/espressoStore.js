import { defineStore } from "pinia";

const LS_KEY_ESPRESSOS = "espressos";

export const useEspressoStore = defineStore("espresso", {
  state: () => ({
    espressos: JSON.parse(localStorage.getItem(LS_KEY_ESPRESSOS) || "[]"),
  }),
  actions: {
    /**
     * Creates a new Espresso
     * @param {Object} espressoData - Espresso Object
     * @param {string} espressoData.name
     * @param {string} espressoData.manufacturer
     * @param {number} espressoData.arabicaPercentage
     * @param {number} espressoData.robustaPercentage
     * @returns {boolean}
     */
    createEspresso(espressoData) {
      try {
        const espresso = {
          id: Date.now() + Math.random().toString(16).slice(2),
          ...espressoData,
        };

        this.validateEspresso(espresso);
        this.espressos.push(espresso);
        return this.updateLocalStorage();
      } catch (error) {
        console.error(error);

        return false;
      }
    },
    removeEspresso(id) {
      this.espressos = this.espressos.filter((espresso) => espresso.id !== id);
      this.updateLocalStorage();
    },
    modifyEspresso(id, updatedEspresso) {
      const index = this.espressos.findIndex((espresso) => espresso.id === id);

      if (index !== -1) {
        this.espressos[index] = {
          ...this.espressos[index],
          ...updatedEspresso,
        };
        return this.updateLocalStorage();
      }
    },
    updateLocalStorage() {
      try {
        const update = localStorage.setItem(LS_KEY_ESPRESSOS, JSON.stringify(this.espressos));
        return update;
      } catch (error) {
        console.error("Error saving the Data to LocalStorage:", error);
        return false;
      }
    },
    validateEspresso(espressoObject) {
      const { id, name, manufacturer, arabicaPercentage, robustaPercentage } = espressoObject;

      if (!id || !name || !manufacturer || typeof arabicaPercentage !== "number" || typeof robustaPercentage !== "number") {
        throw new Error("Invalid Espresso Data.");
      }
      if (arabicaPercentage + robustaPercentage !== 100) {
        throw new Error("The sum of Arabica and Robusta percentages must equal 100.");
      }
    },
  },
  getters: {
    allEspressos: (state) => {
      return state.espressos;
    },
    getEspressoById: (state) => {
      return (id) => state.espressos.find((espresso) => espresso.id === id);
    },
    filteredEspressos: (state) => {
      return (criteria) => state.espressos.filter((espresso) => espresso.criteria === criteria);
    },
    getAsSelect: (state) => {
      let selects = state.espressos.map((espresso) => ({
        state: `${espresso.name} (${espresso.manufacturer})`,
        abbr: espresso.id,
      }));

      selects.unshift({
        state: "--- Create new ---", // Der Text, der im Dropdown angezeigt wird
        abbr: "new", // Der Wert, der bei Auswahl dieses Eintrags verwendet wird
      });

      return selects;
    },
    getEspressoDatabase: (state) => {
      let database = state.espressos.map((espresso) => ({
        id: espresso.id,
        name: espresso.name,
        manufacturer: espresso.manufacturer,
        arabica: espresso.arabicaPercentage,
        robusta: espresso.robustaPercentage,
        shots: 0,
      }));

      return database;
    },
  },
});

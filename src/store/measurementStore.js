import { defineStore } from "pinia";

const LS_KEY_MEASUREMENTS = "espressoMeasurements";

export const useMeasurementStore = defineStore("measurement", {
  state: () => ({
    measurements: JSON.parse(localStorage.getItem(LS_KEY_MEASUREMENTS) || "[]"),
  }),
  actions: {
    /**
     * Adds a new measurement to the list of measurements and updates the LocalStorage.
     * @param {Object} measurementObject - The object containing the details of the measurement.
     * @param {string} measurementObject.espressoID - The unique ID of the espresso that the measurement belongs to.
     * @param {number} measurementObject.grindSize - The grind size of the coffee beans, as a float number.
     * @param {number} measurementObject.grindTime - The grinding time in seconds, as a float number.
     * @param {number} measurementObject.grindAmount - The amount of ground coffee in grams, as a float number.
     * @param {number} measurementObject.extractionAmount - The amount of extracted espresso in milliliters, as a float number.
     * @param {number} measurementObject.extractionFactor - The factor between grind size and extrusion, as a float number.
     * @param {string} measurementObject.taste - The taste description of the espresso.
     * @param {string} measurementObject.notes - Additional notes or observations about the measurement.
     * @returns {boolean} Returns `true` if the measurement was successfully added, otherwise `false`.
     * @throws {Error} Throws an error if the validation of the measurement object fails.
     */
    createMeasurement(measurementObject) {
      try {
        measurementObject.id = Date.now() + Math.random().toString(16).slice(2);
        measurementObject.timestamp = new Date().toISOString();
        this.validateMeasurement(measurementObject);
        this.measurements.push(measurementObject);
        this.updateLocalStorage();
        return true;
      } catch (error) {
        console.error("Add Measurement Error:", error);
        return false;
      }
    },
    removeMeasurement(id) {
      const initialLength = this.measurements.length;
      this.measurements = this.measurements.filter((measurement) => measurement.id !== id);
      const finalLength = this.measurements.length;
      if (initialLength !== finalLength) {
        this.updateLocalStorage();
      }
    },
    deleteAllByEspresso(espressoID) {
      const initialLength = this.measurements.length;
      this.measurements = this.measurements.filter((measurement) => measurement.espressoID !== espressoID);
      const finalLength = this.measurements.length;

      if (initialLength !== finalLength) {
        this.updateLocalStorage();
      }
    },
    getMeasurementsByEspressoID(espressoID) {
      return this.measurements.filter((measurement) => measurement.espressoID === espressoID);
    },
    updateLocalStorage() {
      try {
        localStorage.setItem(LS_KEY_MEASUREMENTS, JSON.stringify(this.measurements));
      } catch (error) {
        console.error("LocalStorage Update Error:", error);
      }
    },
    convertDataToTimestamp(isoTimestamp) {
      const milliseconds = Date.parse(isoTimestamp);
      const unixTimestamp = milliseconds / 1000;
      return unixTimestamp;
    },
    validateMeasurement(measurementObject) {
      const requiredFields = ["espressoID", "grindSize", "grindTime", "grindAmount", "extractionTime", "extractionAmount", "extractionFactor", "isValid", "notes"];
      const floatFields = ["grindSize", "grindTime", "grindAmount", "extractionTime", "extractionAmount", "extractionFactor"];

      const hasAllFields = requiredFields.every((field) => field in measurementObject);
      if (!hasAllFields) {
        throw new Error("Measurement object is missing required fields.");
      }

      const areAllFloats = floatFields.every((field) => typeof measurementObject[field] === "number" && !isNaN(measurementObject[field]));

      if (!areAllFloats) {
        throw new Error("grindSize, grindTime, grindAmount, extractionTime, extractionAmount, extractionFactor must be float numbers.");
      }

      if (typeof measurementObject.isValid !== "boolean") {
        throw new Error("isValid must be a boolean.");
      }
    },
  },
  getters: {
    getAllShotsLength: (state) => {
      return state.measurements.length;
    },
    getShots: (state) => (espressoArray) => {
      const updatedEspressos = JSON.parse(JSON.stringify(espressoArray));

      updatedEspressos.forEach((espresso) => {
        const count = state.measurements.filter((measurement) => {
          const measurementID = typeof measurement.espressoID === "object" ? measurement.espressoID.abbr : measurement.espressoID;
          return measurementID === espresso.id;
        }).length;

        espresso.shots = count;
      });

      return updatedEspressos;
    },
    getShotsById: (state) => (id) => {
      return state.measurements
        .filter((measurement) => measurement.espressoID === id)
        .map((shot) => {
          const date = new Date(shot.timestamp);
          shot.timestamp = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
          return shot;
        })
        .reverse();
    },
    getAllShots: (state) => {
      return state.measurements
        .map((shot) => {
          const date = new Date(shot.timestamp);
          shot.timestamp = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
          return shot;
        })
        .reverse();
    },
    noteLog:
      (state) =>
      (id = false) => {
        const filteredMeasurements = id ? state.measurements.filter((m) => m.espressoID === id) : state.measurements;

        const logString = filteredMeasurements.reduce((acc, m) => {
          if (m.notes === null || m.notes.trim() === "") return acc;

          const date = new Date();
          const dateString = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
          const grindDetails = `${m.grindSize}/${m.grindTime}/${m.grindAmount}/${m.extractionAmount}`;
          const note = m.notes;
          const measurementString = `${dateString}\n${grindDetails}\n${note}\n===========================`;

          return `${acc}${measurementString}\n`;
        }, "");

        return `Grindsize/Grindtime/In/Out\n===========================\n${logString.trim()}`;
      },
  },
});

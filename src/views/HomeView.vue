<template>
  <v-container>
    <v-expansion-panels v-model="panel">

      <v-expansion-panel title="Measurement">
        <v-expansion-panel-text>
          <v-sheet width="90%" class="mx-auto">
            <v-form fast-fail @submit.prevent>
              <v-select v-model="input_espressoId" :items="select_espressoItems" item-title="state" item-value="abbr" persistent-hint return-object single-line variant="underlined"></v-select>
              <v-text-field v-model="input_grindSize" label="Grind Size" type="number"></v-text-field>
              <v-text-field v-model="input_grindTime" label="Grind Time (s)" type="number"></v-text-field>
              <v-text-field v-model="input_grindAmount" label="Grind Amount (g)" type="number"></v-text-field>
              <v-text-field v-model="input_extractionAmount" label="Extraction Amount (ml)" type="number"></v-text-field>
              <v-textarea v-model="input_notes" clearable label="Notes (optional)"></v-textarea>
              <v-switch color="primary" v-model="input_isValid" label="This shot was tasty!"></v-switch>
              <v-btn type="submit" block class="mt-2" @click="saveMeasurement">Submit</v-btn>
            </v-form>
          </v-sheet>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card flat title="Measurement History" class="mt-5">
      <template v-slot:text>
        <v-text-field v-model="espressoDatabaseSearch" label="Search" prepend-inner-icon="mdi-magnify" single-line variant="outlined" hide-details></v-text-field>
      </template>

      <v-data-table :headers="espressoDatabaseHeaders" :items="espressoDatabase" :search="espressoDatabaseSearch">
        <template v-slot:item.shots="{ item }">
          <v-btn @click="showHistory(item.id)">{{ item.shots }}</v-btn>
        </template></v-data-table>
    </v-card>
  </v-container>

  <!-- Create Espresso Dialog -->
  <v-dialog v-model="createEspressoDialog" width="90%">
    <v-card max-width="90%" class="pb-5">
      <v-card-title class="d-flex justify-space-between align-center">
        Create new Espresso
        <v-btn icon="mdi-close" variant="text" @click="createEspressoDialog = false"></v-btn>
      </v-card-title>
      <v-card-text>
        <v-sheet width="90%" class="mx-auto mt-10">
          <v-form fast-fail @submit.prevent>
            <v-text-field v-model="input_espressoManufacturer" label="Manufacturer"></v-text-field>
            <v-text-field v-model="input_espressoName" label="Name"></v-text-field>
            <v-text-field v-model="input_espressoArabica" label="Arabica %" type="Number"></v-text-field>
            <v-text-field v-model="input_espressoRobusta" label="Robusta %" type="Number"></v-text-field>
          </v-form>
        </v-sheet>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" @click="createEspressoDialog = false" class="mx-5">Close</v-btn>
        <v-btn color="green" @click="saveEspresso" variant="tonal" class="mx-5">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Show ShotHistory Dialog -->
  <v-dialog v-model="shotHistoryDialog" transition="dialog-bottom-transition" fullscreen>

    <v-card>
      <v-toolbar>
        <v-toolbar-title>Shot History </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="shotHistoryDialog = false"></v-btn>
      </v-toolbar>


      <v-card-text>a</v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useEspressoStore } from '@/store/espressoStore.js';
import { useMeasurementStore } from '@/store/measurementStore.js';
</script>

<script>
export default {
  data: () => ({
    panel: [],
    createEspressoDialog: false,
    shotHistoryDialog: false,
    select_espressoItems: [],
    input_espressoId: [{ state: 'Select or create new...', abbr: false }],
    input_espressoName: null,
    input_espressoManufacturer: null,
    input_espressoArabica: null,
    input_espressoRobusta: null,
    input_grindSize: null,
    input_grindTime: null,
    input_grindAmount: null,
    input_extractionAmount: null,
    input_notes: null,
    input_isValid: false,
    espressoDatabaseSearch: '',
    espressoDatabase: [],
    espressoDatabaseHeaders: [
      {
        align: 'start',
        key: 'manufacturer',
        title: 'Manufacturer',
      },
      { key: 'name', title: 'Name' },
      { key: 'arabica', title: 'Arabica (%)' },
      { key: 'robusta', title: 'Robusta (%)' },
      { key: 'shots', title: 'Shots' },
    ],
  }),
  mounted() {
    this.espressoStore = useEspressoStore();
    this.measurementStore = useMeasurementStore();

    this.select_espressoItems = this.espressoStore.getAsSelect;
    this.espressoDatabase = this.espressoStore.getEspressoDatabase;
    this.espressoDatabase = this.measurementStore.getShots(this.espressoDatabase);
  },
  methods: {
    saveEspresso() {
      const espressoData = {
        name: this.input_espressoName,
        manufacturer: this.input_espressoManufacturer,
        arabicaPercentage: Number(this.input_espressoArabica),
        robustaPercentage: Number(this.input_espressoRobusta),
      }
      this.espressoStore.createEspresso(espressoData);
      this.createEspressoDialog = false;
    },
    saveMeasurement() {
      const measurementData = {
        espressoID: this.input_espressoId.abbr,
        grindSize: parseFloat(this.input_grindSize),
        grindTime: parseFloat(this.input_grindTime),
        grindAmount: parseFloat(this.input_grindAmount),
        extractionAmount: parseFloat(this.input_extractionAmount),
        isValid: Boolean(this.input_isValid),
        notes: this.input_notes,
      }
      if (this.measurementStore.createMeasurement(measurementData)) {
        this.espressoDatabase = this.measurementStore.getShots(this.espressoDatabase);
        this.panel = [];
      }
    },
    showHistory(id) {
      this.shotHistoryDialog = true;
      console.log(id);
    }
  },
  watch: {
    'input_espressoId.abbr': function (newValue) {
      if (newValue === 'new') {
        this.createEspressoDialog = true;
        this.input_espressoId = [{ state: 'Select or create new...', abbr: false }];
      }
    }
  }
}
</script>
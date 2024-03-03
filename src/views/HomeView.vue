<template>
  <v-container>
    @todo when click in those fields select all instant
    <v-expansion-panels v-model="panel">

      <v-expansion-panel title="Create Measurement">
        <v-expansion-panel-text>
          <v-sheet width="90%" class="mx-auto">
            <v-form fast-fail @submit.prevent>
              <v-select v-model="input_espressoId" :items="select_espressoItems" item-title="state" item-value="abbr" persistent-hint return-object single-line variant="underlined"></v-select>
              <v-text-field v-model="input_grindSize" label="Grind Size" type="number"></v-text-field>
              <v-text-field v-model="input_grindTime" label="Grind Time (s)" type="number"></v-text-field>
              <v-text-field v-model="input_grindAmount" label="Grind Amount (g)" type="number"></v-text-field>
              <v-text-field v-model="input_extractionTime" label="Brewtime (s)" type="number"></v-text-field>
              <v-text-field v-model="input_extractionAmount" label="Extraction Amount (g)" type="number"></v-text-field>
              <v-text-field v-model="input_extractionFactor" label="Extraction Factor" type="number"></v-text-field>
              <v-textarea v-model="input_notes" clearable label="Notes (optional)"></v-textarea>
              <v-switch color="primary" v-model="input_isValid" label="This shot was tasty!"></v-switch>
              <v-btn type="submit" block class="mt-2" @click="saveMeasurement">Submit</v-btn>
            </v-form>
          </v-sheet>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card flat title="Espressos" class="mt-5">
      <template v-slot:text>
        <v-text-field v-model="espressoDatabaseSearch" label="Search" prepend-inner-icon="mdi-magnify" single-line variant="outlined" hide-details></v-text-field>
      </template>
      <v-data-table :headers="espressoDatabaseHeaders" :items="espressoDatabase" :search="espressoDatabaseSearch">

        <template v-slot:item.shots="{ item }">
          <v-btn @click="showHistory(item.id)">{{ item.shots }}</v-btn>
        </template>
      </v-data-table>
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
        <v-toolbar-title>{{ historyTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="shotHistoryDialog = false"></v-btn>
      </v-toolbar>

      <!-- History Table -->
      <v-card-text>
        <v-card flat title="History" class="mt-5">

          <template v-slot:text>
            <v-text-field v-model="historyDatabaseSearch" label="Search" prepend-inner-icon="mdi-magnify" single-line variant="outlined" hide-details></v-text-field>
          </template>
          <v-data-table :headers="historyDatabaseHeaders" :items="historyDatabase" :search="historyDatabaseSearch">

            <template v-slot:item.id="{ item }">
              <v-btn color="red" @click="removeMeasurement(item.id)">X</v-btn>
            </template>
          </v-data-table>
        </v-card>

        <!-- Note Log -->
        <v-card flat title="Note Log" class="mt-5">
          <v-card-text>
            <v-textarea :value="noteLog"></v-textarea>
          </v-card-text>
        </v-card>

        <v-card falt title="Analyse Charts" class="text-center mt-5">
          <v-btn class="ma-2" color="success" @click="prepareDataForMatrix()">Correlation Matrix</v-btn>
          <v-btn class="ma-2" color="success" @click="showDiagramm('grindSize-grindTime-isValid')">Grind Size vs. Grind Time</v-btn>
          <v-btn class="ma-2" color="success" @click="showDiagramm('grindAmount-extractionTime-isValid')">Grind Amount vs. Extraction Time</v-btn>
          <v-btn class="ma-2" color="success" @click="showDiagramm('grindSize-extractionTime-isValid')">Grind Size vs. Extraction Time</v-btn>
          <v-btn class="ma-2" color="success" @click="showDiagramm('grindAmount-grindSize-isValid')">Grind Amount vs. Grind Size</v-btn>
        </v-card>
        @todo "all" id include
        @todo analyse button with diagrams
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Show Diagram Dialog -->
  <v-dialog v-model="diagramDialog" transition="dialog-bottom-transition" fullscreen>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Analyse of {{ historyTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="diagramDialog = false"></v-btn>
      </v-toolbar>

      <v-card-text>
        <v-container>
          <v-row>
            <canvas ref="canvas"></canvas>
          </v-row>

          <v-container v-if="showCorrelationMatrix">
            <v-simple-table dense>

              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Variable</th>
                    <th v-for="(item, index) in matrixLabels" :key="index" class="text-left">{{ item }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in correlationMatrix" :key="rowIndex">
                    <td>{{ matrixLabels[rowIndex] }}</td>
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-container>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useEspressoStore } from '@/store/espressoStore.js';
import { useMeasurementStore } from '@/store/measurementStore.js';
import { useSettingStore } from '@/store/settingStore.js';
</script>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  data: () => ({
    panel: [],
    createEspressoDialog: false,
    shotHistoryDialog: false,
    select_espressoItems: [],
    input_espressoId: [{ state: 'Select Espresso...', abbr: false }],
    input_espressoName: null,
    input_espressoManufacturer: null,
    input_espressoArabica: null,
    input_espressoRobusta: null,
    input_grindSize: null,
    input_grindTime: null,
    input_grindAmount: null,
    input_extractionTime: null,
    input_extractionAmount: null,
    input_extractionFactor: null,
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
    historyTitle: null,
    historyId: null,
    historyEspressoId: null,
    historyDatabaseSearch: '',
    historyDatabaseHeaders: [
      {
        align: 'start',
        key: 'timestamp',
        title: 'Time',
      },
      { key: 'grindSize', title: 'Grindsize' },
      { key: 'grindTime', title: 'GTime' },
      { key: 'grindAmount', title: 'GAmount' },
      { key: 'extractionTime', title: 'Brewtime' },
      { key: 'extractionAmount', title: 'Extraction' },
      { key: 'extractionFactor', title: 'Factor' },
      { key: 'isValid', title: 'Good' },
      { key: 'id', title: 'Delete' },
    ],
    historyDatabase: [],
    diagramDialog: false,
    noteLog: null,
    myChart: null,
    shots: [],
    espressoData: [],
    correlationMatrix: [],
    matrixLabels: ['GrindSize', 'GrindTime', 'GrindAmount', 'ExtractionTime', 'ExtractionAmount', 'ExtractionFactor'],
    showCorrelationMatrix: false
  }),
  mounted() {
    this.espressoStore = useEspressoStore();
    this.measurementStore = useMeasurementStore();
    this.settingStore = useSettingStore();

    this.input_grindSize = this.settingStore.grindSize;
    this.input_grindTime = this.settingStore.grindTime;
    this.input_extractionTime = this.settingStore.extractionTime;

    this.select_espressoItems = this.espressoStore.getAsSelect;
    this.updateTable();
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
      this.select_espressoItems = this.espressoStore.getAsSelect;
      this.updateTable();
      this.createEspressoDialog = false;
    },
    saveMeasurement() {
      if (this.input_espressoId.abbr == "new" || this.input_espressoId.abbr == undefined) {
        alert("Espresso must be selected");
        return false;
      }

      const measurementData = {
        espressoID: this.input_espressoId.abbr,
        grindSize: parseFloat(this.input_grindSize),
        grindTime: parseFloat(this.input_grindTime),
        grindAmount: parseFloat(this.input_grindAmount),
        extractionTime: parseFloat(this.input_extractionTime),
        extractionAmount: parseFloat(this.input_extractionAmount),
        extractionFactor: parseFloat(this.input_extractionFactor),
        isValid: Boolean(this.input_isValid),
        notes: this.input_notes,
      }

      const fieldsToCheck = ['grindSize', 'grindTime', 'grindAmount', 'extractionTime', 'extractionAmount', 'extractionFactor'];
      const invalidField = fieldsToCheck.find(field => isNaN(measurementData[field]));

      if (invalidField) {
        alert(`The field ${invalidField} must be a valid number.`);
        return false;
      }

      if (this.measurementStore.createMeasurement(measurementData)) {
        this.updateTable();
        this.panel = [];
      }

      this.settingStore.updateSettings({
        espressoID: this.input_espressoId.abbr,
        extractionTime: this.input_extractionTime,
        grindSize: this.input_grindSize,
        grindTime: this.input_grindTime
      });
    },
    updateTable() {
      this.espressoDatabase = this.espressoStore.getEspressoDatabase;
      this.espressoDatabase = this.measurementStore.getShots(this.espressoDatabase);

      const allShotsCount = this.measurementStore.getAllShotsLength;

      this.espressoDatabase.unshift({
        id: "all",
        manufacturer: "All Esspreso",
        name: "Average",
        arabica: '-',
        robusta: '-',
        shots: allShotsCount
      });
    },
    calculateFactor() {
      const extractionAmountNumeric = parseFloat(this.input_extractionAmount);
      const grindAmountNumeric = parseFloat(this.input_grindAmount);
      this.input_extractionFactor = parseFloat((extractionAmountNumeric / grindAmountNumeric).toFixed(2));
    },
    showHistory(id) {
      if (id == "all") {
        this.shotHistoryDialog = true;
        this.historyTitle = "All Shots";
        this.historyEspressoId = false;
        this.historyDatabase = this.measurementStore.getAllShots;
        this.noteLog = this.measurementStore.noteLog();
        return;
      } else {
        const espresso = this.espressoStore.getEspressoById(id);
        this.shotHistoryDialog = true;
        this.historyTitle = espresso.name;
        this.historyEspressoId = espresso.id;
        this.historyDatabase = this.measurementStore.getShotsById(id);
        this.noteLog = this.measurementStore.noteLog(id);
      }

    },
    removeMeasurement(id) {
      this.measurementStore.removeMeasurement(id);
      if (this.historyEspressoId) {
        this.historyDatabase = this.measurementStore.getShotsById(this.historyEspressoId);
      } else {
        this.historyDatabase = this.measurementStore.getAllShots;
      }
      this.updateTable();
    },
    async renderChart(plotType) {
      if (this.myChart) {
        this.myChart.destroy();
      }

      await this.$nextTick();

      if (this.$refs.canvas) {
        const ctx = this.$refs.canvas.getContext('2d');
        const shots = this.measurementStore.getShotsById(this.historyEspressoId);

        let xAxisLabel = '';
        let yAxisLabel = '';
        const scatterData = shots.map(shot => {
          let dataPoint = { isValid: shot.isValid, x: 0, y: 0, extractionTime: shot.extractionTime };

          switch (plotType) {
            case 'grindSize-grindTime-isValid':
              dataPoint.x = shot.grindSize;
              dataPoint.y = shot.grindTime;
              xAxisLabel = 'Grind Size';
              yAxisLabel = 'Grind Time';
              break;
            case 'grindAmount-extractionTime-isValid':
              dataPoint.x = shot.grindAmount;
              dataPoint.y = shot.extractionTime;
              xAxisLabel = 'Grind Amount';
              yAxisLabel = 'Extraction Time';
              break;
            case 'grindSize-extractionTime-isValid':
              dataPoint.x = shot.grindSize;
              dataPoint.y = shot.extractionTime;
              xAxisLabel = 'Grind Size';
              yAxisLabel = 'Extraction Time';
              break;
            case 'grindAmount-grindSize-isValid':
              dataPoint.x = shot.grindAmount;
              dataPoint.y = shot.grindSize;
              xAxisLabel = 'Grind Amount';
              yAxisLabel = 'Grind Size';
              break;
          }

          return dataPoint;
        });

        const validShots = scatterData.filter(shot => shot.isValid).map(shot => ({ x: shot.x, y: shot.y }));
        const invalidShots = scatterData.filter(shot => !shot.isValid).map(shot => ({ x: shot.x, y: shot.y }));

        this.myChart = new Chart(ctx, {
          type: 'scatter',
          data: {
            datasets: [{
              label: 'Good Shots',
              data: validShots,
              backgroundColor: 'rgba(0, 255, 0, 0.5)',
              pointRadius: 5
            }, {
              label: 'Bad Shots',
              data: invalidShots,
              backgroundColor: 'rgba(255, 0, 0, 0.5)',
              pointRadius: 5
            }]
          },
          options: {
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                title: {
                  display: true,
                  text: xAxisLabel
                }
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: yAxisLabel
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const shot = scatterData[context.dataIndex];
                    let label = context.dataset.label || '';

                    if (label) {
                      label += ': ';
                    }

                    // Grundlegende Informationen
                    label += `X: ${context.parsed.x}, Y: ${context.parsed.y}`;

                    // Erweiterte Informationen basierend auf dem Plot-Typ
                    switch (plotType) {
                      case 'grindSize-grindTime-isValid':
                        label += `\nGrind Size: ${shot.x} `;
                        label += `\nGrind Time: ${shot.y} `;
                        break;
                      case 'grindAmount-extractionTime-isValid':
                        label += `\nGrind Amount: ${shot.x}`;
                        label += `\nExtraction Time: ${shot.y}`;
                        break;
                      case 'grindSize-extractionTime-isValid':
                        label += `\nGrind Size: ${shot.x}`;
                        label += `\nExtraction Time: ${shot.y}`;
                        break;
                      case 'grindAmount-grindSize-isValid':
                        label += `\nGrind Amount: ${shot.x}`;
                        label += `\nGrind Size: ${shot.y}`;
                        break;
                    }

                    // Status des Espresso Shots hinzufügen
                    label += `\nShot Status: ${shot.isValid ? 'Good' : 'Bad'}`;

                    // Extraktionszeit hinzufügen, wenn sie nicht bereits enthalten ist
                    if (!label.includes('Extraction Time')) {
                      label += `\nExtraction Time: ${shot.extractionTime}`;
                    }

                    // Weitere relevante Informationen können hier hinzugefügt werden, wie z.B. Notizen, falls vorhanden
                    if (shot.notes) {
                      label += `\nNotes: ${shot.notes}`;
                    }

                    return label;
                  }
                }

              },
              legend: {
                display: true
              }
            },
            responsive: true,
            maintainAspectRatio: true
          },
        });
      } else {
        console.error('Canvas ref was not found!');
      }
    },
    showDiagramm(type) {
      this.showCorrelationMatrix = false;
      this.diagramDialog = true;
      this.renderChart(type);
    },
    calculatePearsonCorrelation(x, y) {
      if (x.length !== y.length || x.length === 0) return null;
      let sumX = 0, sumY = 0, sumXY = 0;
      let squareSumX = 0, squareSumY = 0;
      const n = x.length;

      for (let i = 0; i < n; i++) {
        if (typeof x[i] !== 'number' || typeof y[i] !== 'number') return null;
        sumX += x[i];
        sumY += y[i];
        sumXY += (x[i] * y[i]);
        squareSumX += (x[i] * x[i]);
        squareSumY += (y[i] * y[i]);
      }

      const numerator = n * sumXY - sumX * sumY;
      const denominator = Math.sqrt((n * squareSumX - sumX * sumX) * (n * squareSumY - sumY * sumY));

      if (denominator === 0) return 0;
      const correlation = numerator / denominator;
      return isFinite(correlation) ? parseFloat(correlation.toFixed(2)) : null;
    },
    createCorrelationMatrix(data) {
      const matrix = [];
      for (let i = 0; i < data.length; i++) {
        matrix[i] = [];
        for (let j = 0; j < data.length; j++) {
          if (i === j) {
            matrix[i][j] = 1;
          } else {
            const correlation = this.calculatePearsonCorrelation(data.map(row => row[i]), data.map(row => row[j]));
            matrix[i][j] = correlation;
          }
        }
      }
      return matrix;
    },
    prepareDataForMatrix() {
      this.diagramDialog = true;

      this.showCorrelationMatrix = true;
      const shots = this.measurementStore.getShotsById(this.historyEspressoId);
      const data = shots.map(shot => [
        shot.grindSize,
        shot.grindTime,
        shot.grindAmount,
        shot.extractionTime,
        shot.extractionAmount,
        shot.extractionFactor,
      ]);

      const limitedArray = this.createCorrelationMatrix(data).slice(0, 6).map(entry => entry.slice(0, 6));
      this.correlationMatrix = limitedArray;
    },
  },
  watch: {
    'input_espressoId.abbr': function (newValue) {
      if (newValue === 'new') {
        this.createEspressoDialog = true;
        this.input_espressoId = [{ state: 'Select Espresso...', abbr: false }];
      }
    },
    input_extractionAmount(newValue) {
      const isNewValueNumeric = !isNaN(parseFloat(newValue));
      const isGrindAmountNumeric = !isNaN(parseFloat(this.input_grindAmount));

      if (isNewValueNumeric && isGrindAmountNumeric) {
        this.calculateFactor();
      }
    },
    input_grindAmount(newValue) {
      const isNewValueNumeric = !isNaN(parseFloat(newValue));
      const isExtractionAmountNumeric = !isNaN(parseFloat(this.input_extractionAmount));

      if (isNewValueNumeric && isExtractionAmountNumeric) {
        this.calculateFactor();
      }
    },
  }
}
</script>

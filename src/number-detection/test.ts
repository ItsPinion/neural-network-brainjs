import { read } from "../lib/localStorage";
import * as brain from "brain.js";
import Chart from "chart.js/auto";
import { demoTrainingData } from "./demoTrainingData";
import { clearCanvas } from "./utils";
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const run = document.getElementById("run") as HTMLButtonElement;
const pixelSize = 25;
const dimensions = 20;
canvas.width = dimensions * pixelSize;
canvas.height = dimensions * pixelSize;

const net = new brain.NeuralNetwork({
  hiddenLayers: [50, 100, 50],
});
const trainingData = read("neuralNetworkTrainingData");

trainingData &&
  net.train(
    demoTrainingData.length > trainingData.length
      ? demoTrainingData
      : trainingData,
    {
      log: (stats) => {
        console.log(stats);
      },
      activation: "sigmoid",
      errorThresh: 0.002,
    }
  );

const chartElement = document.getElementById("myChart") as HTMLCanvasElement;

const chart = new Chart(chartElement, {
  type: "bar",
  data: {
    labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    datasets: [
      {
        label: "Percentage",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

let isDrawing = false;

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  draw(e);
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  draw(e);
});

window.addEventListener("mouseup", () => {
  isDrawing = false;
});

let ascii = Array.from({ length: dimensions }, () =>
  Array.from({ length: dimensions }, () => 0)
);

function draw(e: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left - ((e.clientX - rect.left) % pixelSize);
  const y = e.clientY - rect.top - ((e.clientY - rect.top) % pixelSize);

  ascii[y / pixelSize][x / pixelSize] = 1;

  ctx.fillStyle = "white";
  ctx.fillRect(x, y, pixelSize, pixelSize);
}

function resetBoard() {
  if (!ascii.flat().some((v) => v === 1)) {
    alert("You must draw a number on the board");
    return;
  }
  const result = Object.values(net.run(ascii.flat()));

  chart.data.datasets[0].data = result.map((v) => (v || 0) * 100);
  chart.update();

  scrollBy(0, window.innerHeight);

  ascii = Array.from({ length: dimensions }, () =>
    Array.from({ length: dimensions }, () => 0)
  );

  clearCanvas(ctx);
  console.log(read("neuralNetworkTrainingData")?.length);
}

run.addEventListener("click", resetBoard);
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    resetBoard();
  }
});

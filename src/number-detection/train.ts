import { create, read, update } from "../lib/localStorage";
import { clearCanvas } from "./utils";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const input = document.getElementById("input") as HTMLDivElement;
const finish = document.getElementById("finish") as HTMLButtonElement;
const pixelSize = 25;
const dimensions = 20;
canvas.width = dimensions * pixelSize;
canvas.height = dimensions * pixelSize;

function draw(e: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left - ((e.clientX - rect.left) % pixelSize);
  const y = e.clientY - rect.top - ((e.clientY - rect.top) % pixelSize);

  ascii[y / pixelSize][x / pixelSize] = 1;
  console.log(JSON.stringify(ascii));

  ctx.fillStyle = "white";
  ctx.fillRect(x, y, pixelSize, pixelSize);
}

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
let isDrawing = false;

input.innerHTML = Math.floor(Math.random() * 9).toString();

function resetBoard() {
  if (!ascii.flat().some((v) => v === 1)) {
    console.log("No numbers found");
    return;
  }

  const output = Array.from({ length: 10 }, () => 0);
  output[+input.innerHTML] = 1;

  update("neuralNetworkTrainingData", {
    input: ascii.flat(),
    output,
  });

  ascii = Array.from({ length: dimensions }, () =>
    Array.from({ length: dimensions }, () => 0)
  );

  clearCanvas(ctx);
  input.innerHTML = Math.floor(Math.random() * 10).toString();
  console.log(read("neuralNetworkTrainingData")?.length);
}

finish.addEventListener("click", resetBoard);
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    resetBoard();
  }
});

create("neuralNetworkTrainingData", []);

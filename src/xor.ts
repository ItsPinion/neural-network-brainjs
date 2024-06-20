import "./style.css";
import * as brain from "brain.js";

const config = {
  binaryThresh: 0.5, // ¯\_(ツ)_/¯
  hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid' // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh']
};

// create a simple feed forward neural network with backpropagation
const net = new brain.NeuralNetwork(config);

net.train([{
    input: [0, 0],
    output: [0]
  },
  {
    input: [0, 1],
    output: [1]
  },
  {
    input: [1, 0],
    output: [1]
  },
  {
    input: [1, 1],
    output: [0]
  }
]);


const input1 = document.getElementById("input1") as HTMLInputElement;
const input2 = document.getElementById("input2") as HTMLInputElement;
const run = document.getElementById("run") as HTMLButtonElement;
const output = document.getElementById("output") as HTMLDivElement;

run.addEventListener("click", () => {
  const result = Object.values(
    net.run([Number(input1.value), Number(input2.value)])
  )
    [0] || NaN;

  output.innerHTML = `${result} or ${Math.round(result)}`;
});

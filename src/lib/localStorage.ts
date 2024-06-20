import {
  NeuralNetworkTrainingDataItem,
  NeuralNetworkTrainingDataKey,
} from "./types";

export function create(
  key: NeuralNetworkTrainingDataKey,
  initialValue: NeuralNetworkTrainingDataItem[]
): void {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(initialValue));
  }
}
export function update(
  key: NeuralNetworkTrainingDataKey,
  newValue: NeuralNetworkTrainingDataItem
): void {
  const oldValue = read(key);
  if (oldValue) {
    oldValue.push(newValue);
  }
  localStorage.setItem(key, JSON.stringify(oldValue));
}
export function read(
  key: NeuralNetworkTrainingDataKey
): NeuralNetworkTrainingDataItem[] {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : [];
}

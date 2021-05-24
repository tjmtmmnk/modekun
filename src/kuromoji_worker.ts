import { expose } from "comlink";

const doSomething = () => {
  console.log("uooooooooooo");
};
const _exports = {
  doSomething,
};
export type MyFirstWorker = typeof _exports;

expose(_exports);

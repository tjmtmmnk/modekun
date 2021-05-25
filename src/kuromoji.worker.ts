import * as comlink from "comlink";

export class A {
  async B() {
    console.log("aaaaaaaaaaa");
  }
}

comlink.expose(A);

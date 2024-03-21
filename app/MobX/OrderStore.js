import { action, makeObservable, observable } from "mobx";

class OrderStore {
  destination = "";

  constructor() {
    makeObservable(this, {
      destination: observable,
      setDestination: action.bound,
    });
  }

  setDestination(destination) {
    this.destination = destination;
  }
}

export const orderStore = new OrderStore();

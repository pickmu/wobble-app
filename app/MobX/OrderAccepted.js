import { action, makeObservable, observable } from "mobx";

class OrderAcceptedStore {
  orderAccepted = false;

  constructor() {
    makeObservable(this, {
      orderAccepted: observable,
      setOrderAccepted: action.bound
    });
  }

  setOrderAccepted(value) {
    this.orderAccepted = value;
  }
}

export const orderAcceptedStore = new OrderAcceptedStore();

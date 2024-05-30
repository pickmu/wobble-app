import { action, makeObservable, observable } from "mobx";

class OrderAcceptedStore {
  orderAccepted = false;
  showComponent = true;

  constructor() {
    makeObservable(this, {
      orderAccepted: observable,
      showComponent: observable,
      setOrderAccepted: action.bound,
      setShowComponent: action.bound,
    });
  }

  setOrderAccepted(value) {
    this.orderAccepted = value;
  }

  setShowComponent(value) {
    this.showComponent = value;
  }
}

export const orderAcceptedStore = new OrderAcceptedStore();

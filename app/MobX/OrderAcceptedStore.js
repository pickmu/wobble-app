import { action, makeObservable, observable } from "mobx";

class OrderAcceptedStore {
  orderAccepted = false;
  showComponent = true;
  orderCanceled = false;

  constructor() {
    makeObservable(this, {
      orderAccepted: observable,
      showComponent: observable,
      orderCanceled: observable,
      setOrderAccepted: action.bound,
      setShowComponent: action.bound,
      setOrderCanceled: action.bound,
    });
  }

  setOrderAccepted(value) {
    this.orderAccepted = value;
  }

  setShowComponent(value) {
    this.showComponent = value;
  }

  setOrderCanceled(value) {
    this.orderCanceled = value;
  }
}

export const orderAcceptedStore = new OrderAcceptedStore();

import { action, makeObservable, observable } from "mobx";

class OrderAcceptedStore {
  orderAccepted = false;
  showComponent = true;
  orderCanceled = false;
  driverDistance = 0;
  driverDuration = 0;

  constructor() {
    makeObservable(this, {
      orderAccepted: observable,
      showComponent: observable,
      orderCanceled: observable,
      driverDistance: observable,
      driverDuration: observable,
      setOrderAccepted: action.bound,
      setShowComponent: action.bound,
      setOrderCanceled: action.bound,
      setDriverDistance: action.bound,
      setDriverDuration: action.bound,
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

  setDriverDuration(value) {
    this.driverDuration = value;
  }

  setDriverDistance(value) {
    this.driverDistance = value;
  }
}

export const orderAcceptedStore = new OrderAcceptedStore();

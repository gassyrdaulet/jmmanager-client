import axios from "axios";
import Auth from "./AuthService";

export default class OrderService {
  static options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  static async searchOrder(telephoneNumber, id, status) {
    let filteredResult = [];
    const { data } = await axios.get(
      (Auth.isTestingOnPhone ? Auth.ip : Auth.localip) + "/api/orders/search",
      {
        params: {
          telephoneNumber,
          id,
          status,
        },
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    data.map((resultElement) => {
      const {
        id,
        telephoneNumber,
        creationDate,
        finishedDate,
        sum,
        userName,
        pickup,
        addressString,
        deliverName,
        deliveryPriceForStore,
        goodsString,
        comment,
        incomeForUser,
        status: searchedStatus,
      } = resultElement;
      const date = new Date(creationDate);
      const date2 = new Date(finishedDate);
      const newDataElement = {
        id,
        pickup:
          (parseInt(pickup) === 1 ? "Самовывоз: " : "Доставка: ") +
          "\n" +
          addressString,
        goodsString,
        telephoneNumber,
        sum,
        deliverName,
        deliveryPriceForStore,
        creationDate: date,
        finishedDate: date2,
        userName,
        incomeForUser,
        status:
          searchedStatus === 0
            ? "НОВЫЙ"
            : searchedStatus === 1
            ? "АКТИВНЫЙ"
            : "ЗАВЕРШЕН",
        comment,
      };
      filteredResult.push(newDataElement);
    });
    return filteredResult;
  }

  static async newOrder(body, orderStatus) {
    const data = await axios.post(
      (Auth.isTestingOnPhone ? Auth.ip : Auth.localip) + "/api/orders/create",
      body,
      {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
          orderStatus,
        },
      }
    );
    return data.data.message;
  }

  static async editOrder(id, body) {
    const data = await axios.patch(
      (Auth.isTestingOnPhone ? Auth.ip : Auth.localip) +
        "/api/orders/edit/" +
        id,
      body,
      {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return data.data.message;
  }

  static async finishOrder(id, data) {
    await axios.patch(
      (Auth.isTestingOnPhone ? Auth.ip : Auth.localip) +
        "/api/orders/finish/" +
        id,
      {},
      {
        params: {
          cancel: data[0],
          whileDelivering: data[1] ? 1 : 0,
          didPay: data[2] ? 1 : 0,
        },
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
  }

  static async acceptOrder(id, deliveryInfo) {
    await axios.patch(
      (Auth.isTestingOnPhone ? Auth.ip : Auth.localip) +
        "/api/orders/accept/" +
        id,
      deliveryInfo,
      {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
  }

  static async getOrderInfo(id) {
    const { data } = await axios.get(
      (Auth.isTestingOnPhone ? Auth.ip : Auth.localip) +
        "/api/orders/details/" +
        id,
      {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const {
      status,
      creationDate,
      incomeForUser,
      income,
      comment,
      prototype,
      deliver,
      children,
      paymentSum,
      finishedDate,
      deliverName,
      deliveryPriceForStore,
      deliveryPriceForCustomer,
      retOrEx,
      goods,
      goodsCount,
      pickup,
      prices,
      goodsNamesString,
      cancelOrWhileDel,
      sum,
      discount,
      user,
      userName,
      addressString,
      telephoneNumber,
    } = data;
    const date = new Date(creationDate);
    const date2 = new Date(finishedDate);
    const goodsNames = goodsNamesString.split("&&");
    const orderInfo = [
      status === 0
        ? "Новый"
        : status === 1
        ? "Ожидается Доставка/Самовывоз"
        : status === 2 && cancelOrWhileDel === 1
        ? "Отменен"
        : status === 2 && retOrEx
        ? "Возвращен"
        : status === 2
        ? "Выдан"
        : "Неопределен",
      date.toLocaleString("ru", OrderService.options),
      finishedDate
        ? date2.toLocaleString("ru", OrderService.options)
        : "Ожидается выдача",
      deliveryPriceForStore,
      deliveryPriceForCustomer,
      { id: user, name: userName },
      sum,
      paymentSum,
      discount,
    ];
    const customerInfo = [addressString, telephoneNumber];
    const orderCompound = [
      goods,
      goodsCount,
      prices,
      goodsNames,
      { incomeForUser, income, status },
    ];
    const deliveryInfo = [
      pickup === 0 ? "Доставка" : "Самовывоз",
      { id: deliver, name: deliverName },
    ];
    const extraInfo = [
      comment,
      { order: prototype },
      children === 1 ? "Есть" : "Отсутствует",
    ];
    return { orderInfo, customerInfo, orderCompound, deliveryInfo, extraInfo };
  }

  static async getOrderInfoForEdit(id, type = "edit") {
    const { data } = await axios.get(
      (Auth.isTestingOnPhone ? Auth.ip : Auth.localip) +
        "/api/orders/details/" +
        id,
      {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    console.log(data);
    const {
      payment,
      addressString,
      retOrEx,
      status,
      deliverName,
      goodsNamesString,
      comment,
      deliver,
      deliveryPriceForStore,
      deliveryPriceForCustomer,
      goods,
      goodsCount,
      pickup,
      discount,
      user,
      userName,
      address,
      telephoneNumber,
    } = data;
    if (status === 2 && type === "edit") {
      null.f();
    }
    if ((status === 1 || status === 0) && type === "ret") {
      null.f();
    }
    const goodsNames = goodsNamesString.split("&&");
    const goodsCountEdit = [];
    const paymentEdit = [];
    let n = 0;
    let n2 = 0;
    Object.keys(goods).map((key) => {
      goodsCountEdit.push([
        goods[key],
        Math.abs(parseInt(goodsCount[key])),
        0,
        0,
        n,
      ]);
      n++;
    });
    if (payment) {
      Object.keys(payment).map((key) => {
        paymentEdit.push([payment[key].percent, payment[key].sum, n2]);
        n2++;
      });
    }
    const delivery = pickup === 1 ? false : true;
    return {
      retOrEx,
      status,
      deliverName,
      id,
      delivery,
      addressString,
      paymentEdit,
      goodsCountEdit,
      goodsNames,
      comment,
      deliver,
      deliveryPriceForStore,
      deliveryPriceForCustomer,
      goods,
      goodsCount,
      pickup,
      discount,
      user,
      userName,
      address,
      telephoneNumber,
    };
  }

  static async getFinishedOrders(firstDate, secondDate) {
    const filteredResult = [];
    const { data } = await axios.post(
      (Auth.isTestingOnPhone ? Auth.ip : Auth.localip) + "/api/orders/finished",
      {
        firstDate,
        secondDate,
      },
      {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    data.map((resultElement) => {
      const {
        id,
        telephoneNumber,
        creationDate,
        finishedDate,
        sum,
        userName,
        pickup,
        addressString,
        deliverName,
        cancelOrWhileDel,
        deliveryPriceForStore,
        goodsString,
        comment,
        incomeForUser,
      } = resultElement;
      const date = new Date(creationDate);
      const date2 = new Date(finishedDate);
      const newDataElement = {
        id,
        pickup:
          (parseInt(pickup) === 1 ? "Самовывоз: " : "Доставка: ") +
          "\n" +
          addressString,
        goodsString,
        telephoneNumber,
        sum,
        deliverName,
        deliveryPriceForStore,
        creationDate: date,
        finishedDate: date2,
        userName,
        incomeForUser,
        cancelOrWhileDel: cancelOrWhileDel === 0 ? "ВЫДАН" : "ОТМЕНЕН",
        comment,
      };
      filteredResult.push(newDataElement);
    });
    return filteredResult;
  }

  static async getPickupOrders() {
    const filteredResult = [];
    const { data } = await axios.get(
      (Auth.isTestingOnPhone ? Auth.ip : Auth.localip) + "/api/orders/",
      {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          status: 1,
          pickup: 1,
        },
      }
    );
    data.map((resultElement) => {
      const {
        id,
        telephoneNumber,
        creationDate,
        sum,
        userName,
        pickup,
        addressString,
        goodsString,
        comment,
      } = resultElement;
      const date = new Date(creationDate);
      const newDataElement = {
        id,
        pickup:
          (parseInt(pickup) === 1 ? "Самовывоз: " : "Доставка: ") +
          "\n" +
          addressString,
        goodsString,
        telephoneNumber,
        sum,
        creationDate: date,
        userName,
        comment,
      };
      filteredResult.push(newDataElement);
    });
    return filteredResult;
  }

  static async getDeliveryOrders() {
    const filteredResult = [];
    const { data } = await axios.get(
      (Auth.isTestingOnPhone ? Auth.ip : Auth.localip) + "/api/orders/",
      {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          status: 1,
          pickup: 0,
        },
      }
    );
    data.map((resultElement) => {
      const {
        id,
        telephoneNumber,
        creationDate,
        sum,
        userName,
        pickup,
        addressString,
        goodsString,
        comment,
        deliverName,
        deliveryPriceForStore,
      } = resultElement;
      const date = new Date(creationDate);
      const newDataElement = {
        id,
        pickup:
          (parseInt(pickup) === 1 ? "Самовывоз: " : "Доставка: ") +
          "\n" +
          addressString,
        goodsString,
        telephoneNumber,
        sum,
        deliverName,
        deliveryPriceForStore,
        creationDate: date,
        userName,
        comment,
      };
      filteredResult.push(newDataElement);
    });
    return filteredResult;
  }

  static async getNewOrders() {
    const filteredResult = [];
    const { data } = await axios.get(
      (Auth.isTestingOnPhone ? Auth.ip : Auth.localip) + "/api/orders/",
      {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          status: 0,
          pickup: 0,
        },
      }
    );
    data.map((resultElement) => {
      const {
        id,
        telephoneNumber,
        creationDate,
        sum,
        userName,
        pickup,
        addressString,
        goodsString,
        comment,
      } = resultElement;
      const date = new Date(creationDate);
      const newDataElement = {
        id,
        pickup:
          (parseInt(pickup) === 1 ? "Самовывоз: " : "Доставка: ") +
          "\n" +
          addressString,
        goodsString,
        telephoneNumber,
        sum,
        creationDate: date,
        userName,
        comment,
      };
      filteredResult.push(newDataElement);
    });
    return filteredResult;
  }
}

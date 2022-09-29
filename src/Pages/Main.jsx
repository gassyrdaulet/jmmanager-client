import React from "react";
import cl from "./Main.module.css";
import { useState, useMemo } from "react";
import Tabs from "../components/Tabs";
import Table from "../components/Table";
import OrderService from "../API/OrderService";
import GoodService from "../API/GoodService";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MyInput from "../UI/MyInput";
import MyColoredButton from "../UI/MyColoredButton";
import DateInput from "../components/DateInput";
import { AuthContext } from "../context";
import MyButton from "../UI/MyButton";
import MyModal from "../UI/MyModal";
import Form from "../components/CreateOrderForm";
import { useInput } from "../hooks/useInput";
import Select from "react-select";
import debounce from "lodash.debounce";

export default function Main({ openedTab }) {
  const { setIsAuth } = useContext(AuthContext);
  const router = useNavigate();
  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    localStorage.removeItem("balance");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    router("/login");
  };

  const selectStyle = {
    option: (provided) => ({
      ...provided,
      fontSize: 12,
    }),
    menu: (provided) => ({
      ...provided,
      height: 100,
    }),
    menuList: (provided) => ({
      ...provided,
      height: 100,
      zIndex: 1000,
    }),
    control: () => ({
      position: "relative",
      background: "white",
      margin: "5px",
      display: "flex",
      width: 190,
      height: 35,
      fontSize: 13,
      border: "1px solid gray",
      borderRadius: "2px",
      cursor: "pointer",
      zIndex: 100,
    }),
  };
  const options = [
    { value: 0, label: "Новые" },
    { value: 1, label: "Активные" },
    { value: 2, label: "Архивные" },
  ];
  // const [yesterDay] = useState((new Date(Date.now() - 18*60*60*1000)).toISOString().substring(0,10))
  // const [toDay] = useState((new Date(Date.now() + 6*60*60*1000)).toISOString().substring(0,10))
  // const [yesterDay] = useState((new Date(Date.now() + 6*60*60*1000)).toISOString().substring(0,10))

  const [newOrder, setNewOrder] = useState(false);
  const [searchStatus, setSearchStatus] = useState(0);
  const [orders, setOrders] = useState([]);
  const [newGoodActive, setNewGoodActive] = useState(false);
  const [moreActive, setMoreActive] = useState(false);
  const [searchTableVisible, setSearchTableVisible] = useState(false);
  const [pickupOrders, setPickupOrders] = useState([]);
  const [deliveryOrders, setDeliveryOrders] = useState([]);
  const [finishedOrders, setFinishedOrders] = useState([]);
  const [searchedOrders, setSearchedOrders] = useState([]);
  const [isSearchedOrdersLoading, setIsSearchedOrdersLoading] = useState(false);
  const [prices, setPrices] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFinishedLoading, setIsFinishedLoading] = useState(false);

  const firstPrice = useInput("", { isEmpty: true }, "number");
  const secondPrice = useInput("", { isEmpty: true }, "number");
  const name = useInput("", { isEmpty: true }, "text");
  const searchValue = useInput("", { isEmpty: true }, "text");
  const telephoneNumber = useInput("", { isEmpty: true }, "text");
  const goodsFilter = useInput("", { noValidation: true }, "text");

  const newGood = async () => {
    await GoodService.newGood({
      NAME: name.props.value,
      FIRST_PRICE: firstPrice.props.value,
      SECOND_PRICE: secondPrice.props.value,
    });
    setNewGoodActive(false);
    getOrders();
    router("/main/prices");
  };

  const getOrders = async () => {
    try {
      setOrders(await OrderService.getNewOrders());
      setPickupOrders(await OrderService.getPickupOrders());
      setDeliveryOrders(await OrderService.getDeliveryOrders());
      setPrices(await GoodService.getAllGoods());
      setFinishedOrders(
        await OrderService.getFinishedOrders(
          localStorage.getItem("firstDate"),
          localStorage.getItem("secondDate")
        )
      );
    } catch (e) {
      e.response.data.message === "Token expired."
        ? logout()
        : router("/error");
    }
  };
  const _updateOrders = async () => {
    try {
      setIsLoading(true);
      setOrders(await OrderService.getNewOrders());
      setPickupOrders(await OrderService.getPickupOrders());
      setDeliveryOrders(await OrderService.getDeliveryOrders());
      setPrices(await GoodService.getAllGoods());
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false)(e.response.data.message === "Token expired.")
        ? logout()
        : router("/error");
    }
  };
  const _updateFinishedOrders = async () => {
    try {
      setIsFinishedLoading(true);
      setFinishedOrders(
        await OrderService.getFinishedOrders(
          localStorage.getItem("firstDate"),
          localStorage.getItem("secondDate")
        )
      );
      setIsFinishedLoading(false);
    } catch (e) {
      setIsFinishedLoading(false)(e.response.data.message === "Token expired.")
        ? logout()
        : router("/error");
    }
  };

  const updateOrders = debounce(_updateOrders, 500);
  const updateFinishedOrders = debounce(_updateFinishedOrders, 500);

  // const [isLoading, updateOrders] = useTimeout(500, _updateOrders)
  // const [isFinishedLoading, updateFinishedOrders] = useTimeout(500, _updateFinishedOrders)

  const handleSearchButton = async () => {
    setSearchTableVisible(true);
    searchOrders();
  };
  const _searchOrders = async () => {
    setIsSearchedOrdersLoading(true);
    setSearchedOrders(
      await OrderService.searchOrder(
        telephoneNumber.props.value,
        searchValue.props.value,
        searchStatus
      )
    );
    setIsSearchedOrdersLoading(false);
  };

  const searchOrders = debounce(_searchOrders, 200);

  useEffect(() => {
    async function fetchDAta() {
      getOrders();
    }
    fetchDAta();
  }, []);
  const filteredGoods = useMemo(() => {
    try {
      const temp = [...prices].filter(
        (price) =>
          price.NAME.toLowerCase().includes(
            goodsFilter.props.value.toLowerCase()
          ) ||
          (price.ID + "")
            .toLowerCase()
            .includes(goodsFilter.props.value.toLowerCase())
      );
      return temp;
    } catch (e) {
      console.log(e);
      return [];
    }
  }, [goodsFilter.props.value, prices]);

  return (
    <div className={cl.Main}>
      <h1 className={cl.MainTitle}>ЗАКАЗЫ</h1>
      <div className={cl.Tools + " " + (moreActive ? cl.MaxHeight90 : "")}>
        <div className={cl.SearchVertical}>
          <div className={cl.Search}>
            <MyInput
              onBlur={searchValue.props.onBlur}
              onChange={searchValue.props.onChange}
              value={searchValue.props.value}
              placeholder="Поиск по ID"
              inputMode={"numeric"}
              type="text"
            />
            <MyButton
              disabled={searchValue.valid && telephoneNumber.valid}
              onClick={handleSearchButton}
              color="blue"
            >
              Найти
            </MyButton>
          </div>
          {moreActive ? (
            <div className={cl.More}>
              <MyInput
                onBlur={telephoneNumber.props.onBlur}
                onChange={telephoneNumber.props.onChange}
                value={telephoneNumber.props.value}
                placeholder="Номер телефона"
                inputMode={"tel"}
              />
              <Select
                defaultValue={0}
                options={options}
                onChange={(value) => setSearchStatus(value.value)}
                styles={selectStyle}
                placeholder="Новые"
              />
            </div>
          ) : (
            ""
          )}
          <div className={cl.Hor}>
            <p
              onClick={() => setMoreActive(!moreActive)}
              className={cl.Reference}
            >
              {!moreActive ? "расширенный поиск" : "свернуть поиск"}
            </p>
            {searchTableVisible ? (
              <p
                onClick={() => setSearchTableVisible(false)}
                className={cl.Reference}
              >
                закрыть поиск
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className={cl.ButtonsHor}>
          <MyColoredButton color="green" onClick={() => router("/main/create")}>
            Новый Заказ
          </MyColoredButton>
          {localStorage.getItem("role") === "1" ||
          localStorage.getItem("role") === "2" ? (
            <MyColoredButton
              color="lightsky"
              onClick={() => setNewGoodActive(true)}
            >
              Новый Товар
            </MyColoredButton>
          ) : (
            ""
          )}
        </div>
      </div>
      {searchTableVisible ? (
        <div className={cl.SearchTable}>
          <h2 className={cl.Center + " " + cl.WithBotLine}>Поиск</h2>
          <Table
            isLoading={isSearchedOrdersLoading}
            key={6}
            heads={[
              "№",
              "Идентификатор",
              "Доставка / Самовывоз",
              "Товары",
              "Номер телефона",
              "Сумма",
              "Курьер",
              "Стоимость доставки для магазина",
              "Дата поступления заказа",
              "Дата завершения заказа",
              "Продавец",
              "Профит \n (для продавца)",
              "Статус",
              "Комментарий",
            ]}
            data={searchedOrders}
          />
        </div>
      ) : (
        <Tabs openedTab={openedTab} updateData={updateOrders}>
          <div tabname="Новые" id="1" link="recent">
            <Table
              isLoading={isLoading}
              key={1}
              heads={[
                "№",
                "Идентификатор",
                "Доставка / Самовывоз",
                "Товары",
                "Номер телефона",
                "Сумма",
                "Дата поступления заказа",
                "Продавец",
                "Комментарий",
              ]}
              data={orders}
            />
          </div>
          <div tabname="Самовывоз" id="2" link="pickup">
            <Table
              isLoading={isLoading}
              key={2}
              heads={[
                "№",
                "Идентификатор",
                "Доставка / Самовывоз",
                "Товары",
                "Номер телефона",
                "Суммв",
                "Дата поступления заказа",
                "Продавец",
                "Комментарий",
              ]}
              data={pickupOrders}
            />
          </div>
          <div tabname="Доставка" id="3" link="delivery">
            <Table
              isLoading={isLoading}
              key={3}
              heads={[
                "№",
                "Идентификатор",
                "Доставка / Самовывоз",
                "Товары",
                "Номер телефона",
                "Сумма",
                "Курьер",
                "Стоимость доставки для магазина",
                "Дата поступления заказа",
                "Продавец",
                "Комментарий",
              ]}
              data={deliveryOrders}
            />
          </div>
          <div tabname="Цены" id="4" link="prices">
            <div className={cl.Hor2}>
              Фильтр: <MyInput {...goodsFilter.props} type={"text"} />
            </div>
            <Table
              which={"цены"}
              isLoading={isLoading}
              key={4}
              heads={[
                "№",
                "Идентификатор",
                "Наименование",
                "Закупочная цена",
                "Розничная цена",
                "Дата последнего обновления",
              ]}
              data={filteredGoods}
            />
          </div>
          <div tabname="Архив" id="5" link="archive">
            <div className={cl.TextWrapper}>
              <p>Загрузить заказы</p>
            </div>
            <DateInput
              dates={{
                yesterDay: localStorage.getItem("firstDate"),
                toDay: localStorage.getItem("secondDate"),
              }}
              updateFinishedOrders={updateFinishedOrders}
            ></DateInput>
            <Table
              which={"архив"}
              isLoading={isLoading || isFinishedLoading}
              key={5}
              heads={[
                "№",
                "Идентификатор",
                "Доставка / Самовывоз",
                "Товары",
                "Номер телефона",
                "Сумма",
                "Курьер",
                "Стоимость доставки для магазина",
                "Дата поступления заказа",
                "Дата завершения заказа",
                "Продавец",
                "Профит \n (для продавца)",
                "Статус",
                "Комментарий",
              ]}
              data={finishedOrders}
            />
          </div>
        </Tabs>
      )}
      <MyModal visible={newOrder} setVisible={setNewOrder}>
        <Form />
      </MyModal>
      <MyModal visible={newGoodActive} setVisible={setNewGoodActive}>
        <div>
          <p className={cl.Center + " " + cl.WithBottomLine}>Новый товар</p>
          <MyInput {...name.props} inputMode={"text"} placeholder="Название" />
          <MyInput
            {...firstPrice.props}
            inputMode={"numeric"}
            placeholder="Закупочная цена"
          />
          <MyInput
            {...secondPrice.props}
            inputMode={"numeric"}
            placeholder="Розничная цена"
          />
          <div className={cl.Buttons + " " + cl.JustifyCenter}>
            <MyButton
              onClick={newGood}
              color="blue"
              disabled={name.valid || firstPrice.valid || secondPrice.valid}
            >
              Подтвердить
            </MyButton>
          </div>
        </div>
      </MyModal>
    </div>
  );
}

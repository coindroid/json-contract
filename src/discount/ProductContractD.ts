import ProductContract, {ProductContractBuild} from "../core/ProductContract";
import DiscountContract from "./DiscountContract";
import Option from "../core/Option";
import Property from "../core/Property";
import {objectToProperties} from "../lib/util";
import Form from "../core/Form";

/**
 * Описывает контракт с скидками
 */
export default class ProductContractD extends ProductContract implements ProductContractDBuild {
  /**
   * Локальные скидки, которые может применить этот контракт. При применении этих скидок проверка [[DiscountContract.selects]]
   * игнорируется, проверяются только условия [[DiscountContract.conditions]].
   */
  discounts: DiscountContract[];
  /**
   * Разрешение на применение скидок
   */
  discountAllowed: boolean;
  /**
   * Разрешение на суммирование скидок, то есть применение более одной скидки одновременно
   */
  discountCumulativeAllowed: boolean;

  /**
   * Если [[discountAllowed]] не передан, устанавливает его в true.
   * Если [[discountCumulativeAllowed]] не передан, устанавливает его в true.
   * @param options - [[Option]][], которые хранит этот контракт
   * @param childForms
   * @param contractId
   * @param name - название
   * @param locale - локализация
   * @param description - описание
   * @param specificationMinVersion - Минимальная версия модуля обработки контракта
   * @param prefix - префикс
   * @param badge -
   * @param price - цена
   * @param currency - валюта
   * @param start - время начала работы
   * @param finish - время завершения работы
   * @param discountAllowed - разрешение на применение скидок
   * @param discountCumulativeAllowed - разрешение на суммирование скидок
   * @param revision -
   * @param deliveryTime - время доставки
   * @param discounts -
   * @param args - иные параметры
   */
  constructor(options: Option[], childForms: Form[], contractId: string, name: string, locale: string, description: string,
              specificationMinVersion: number, prefix: string, badge: string, price: number, currency: string, start: number,
              finish: number, discountAllowed: boolean, discountCumulativeAllowed: boolean, revision: number, deliveryTime: number,
              discounts: DiscountContract[], args?: Property<ProductContract>[]) {
    super(options, childForms, name, contractId, locale, description, specificationMinVersion, prefix, badge, price,
      currency, start, finish, revision, deliveryTime, args);
    this.discounts = discounts || [];
    this.discountAllowed = discountAllowed || true;
    this.discountCumulativeAllowed = discountCumulativeAllowed || true;
  }

  /**
   * Создаёт новый ProductContractD из JSON, содержащим все необходимые поля. Обязательность полей см. в конструкторе.
   * При передаче как параметра екземпляра ProductContractD будет осущствлена попытка его скопировать, однако для таких целей
   * лучше использовать метод [[clone]]. Данный метод выступает как парсер из JSON в объект, а не как клонирование
   * @param childForms
   * @param options - [[Option]][], которые хранит этот контракт
   * @param name - название
   * @param locale - локализация
   * @param description - описание
   * @param specificationMinVersion - Минимальная версия модуля обработки контракта
   * @param prefix - префикс
   * @param badge -
   * @param price - цена
   * @param currency - валюта
   * @param start - время начала работы
   * @param finish - время завершения работы
   * @param discountAllowed - разрешение на применение скидок
   * @param discountCumulativeAllowed - разрешение на суммирование скидок
   * @param revision -
   * @param deliveryTime - время доставки
   * @param discounts -
   * @param args - иные параметры
   */
  public static build({locale, childContracts, contractId, name, options, discountCumulativeAllowed, badge, deliveryTime, currency, description,
                        discountAllowed, prefix, finish, price, revision, specificationMinVersion, start, discounts,
                        ...args}: ProductContractDBuild): ProductContractD {
    options = options.map(opt => Option.getOption(opt));
    return new ProductContractD(options, childContracts, contractId, name, locale, description, specificationMinVersion,
      prefix, badge, price, currency, start, finish, discountAllowed, discountCumulativeAllowed, revision, deliveryTime,
      discounts, objectToProperties(<any>args));
  }

  /**
   * Создаёт глубокую копию текущего екземпляра
   */
  public clone(): ProductContractD {
    return ProductContractD.build(this.getJSON());
  }

  /**
   *  Создаёт JSON из текущего экземпляра. Метод противоположный [[build]]
   */
  public getJSON(): any {
    return Object.assign({}, this, super.getJSON());
  }
}

/**
 * Содержит поля [[ProductContractD]], который могут быть переданы при его создании с помощью метода build
 */
export interface ProductContractDBuild extends ProductContractBuild {
  discounts: DiscountContract[];
  discountAllowed: boolean;
  discountCumulativeAllowed: boolean;
}

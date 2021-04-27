import Option from "./Option";
import Form from "./Form";
import Property from "./Property";
import {objectToProperties} from "../lib/util";

/**
 * Класс, являющийся шаблоном для заполнения. Хранит в себе общие данные для будущего документа. В документе хранится два
 * экземпляра ProductContract, один для хранения начальных настроек, второй для изменения с помощью [[Action]]
 */
export default class ProductContract extends Form implements ProductContractBuild {
  /**
   * Название
   */
  name: string;
  /**
   * Локализация
   */
  locale: string;
  /**
   * Описание
   */
  description: string;
  /**
   * UUID
   */
  contractId: string;
  /**
   * Минимальная версия модуля обработки контракта
   */
  specificationMinVersion: number;
  /**
   * Префикс
   */
  prefix: string;
  /**
   *
   */
  badge: string;
  /**
   * Цена контракта
   */
  price: number;
  /**
   * Валюта
   */
  currency: string;
  /**
   * Время начала работы контракта
   */
  start: number;
  /**
   * Время завершения работы контракта
   */
  finish: number;
  /**
   *
   */
  revision: number;
  /**
   * Время доставки
   */
  deliveryTime: number;
  /**
   * Хеш контракта
   */
  controlHash: string;

  /**
   * Любые другие поля для внешних модулей
   */
  [x: string]: any;

  /**
   * @param options - [[Option]][], которые хранит этот контракт
   * @param childContracts - дочерние контракты
   * @param contractId - id контракта
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
   * @param revision -
   * @param deliveryTime - время доставки
   * @param args - иные параметры
   */
  constructor(options: Option[], childContracts: Form[], contractId: string, name: string, locale: string, description: string,
              specificationMinVersion: number, prefix: string, badge: string, price: number, currency: string,
              start: number, finish: number, revision: number, deliveryTime: number, args?: Property<ProductContract>[]) {
    super(options, childContracts);
    this.name = name;
    this.locale = locale;
    this.description = description;
    this.contractId = contractId;
    this.specificationMinVersion = specificationMinVersion;
    this.prefix = prefix;
    this.badge = badge;
    this.price = price;
    this.currency = currency;
    this.start = start;
    this.finish = finish;
    this.revision = revision;
    this.deliveryTime = deliveryTime;
    this.controlHash = '';

    if (args)
      for (let i of args)
        this[i.property] = i.value;
  }

  /**
   * Создаёт новый ProductContract из JSON, содержащим все необходимые поля. Обязательность полей см. в конструкторе.
   * При передаче как параметра экземпляра ProductContract будет осуществлена попытка его скопировать, однако для таких целей
   * лучше использовать метод [[clone]]. Данный метод выступает как парсер из JSON в объект, а не как клонирование
   *
   * @param options - [[Option]][], которые хранит этот контракт
   * @param childForms - дочерние контракты
   * @param contractId - id контракта
   * @param name - название
   * @param locale - локализация
   * @param description - описание
   * @param specificationMinVersion - Минимальная версия модуля обработки контракта
   * @param badge -
   * @param price - цена
   * @param currency - валюта
   * @param start - время начала работы
   * @param finish - время завершения работы
   * @param revision -
   * @param deliveryTime - время доставки
   * @param args - иные параметры
   * @param childContracts - дочерние контракты
   */
  public static build({locale, name, options, contractId, badge, deliveryTime, currency, description, prefix,
                        finish, price, revision, specificationMinVersion, start, ...args
                      }: ProductContractBuild, childContracts?: ProductContract[]): ProductContract {
    childContracts = childContracts || [];
    options = options.map(opt => Option.getOption(<any>{...opt, childContracts}));
    return new ProductContract(options, childContracts, contractId, name, locale, description, specificationMinVersion,
      prefix, badge, price, currency, start, finish, revision, deliveryTime, objectToProperties(<ProductContract>args));
  }

  /**
   * Создаёт глубокую копию текущего экземпляра
   */
  public clone(): ProductContract {
    return ProductContract.build(this.getJSON(), <ProductContract[]>this.childContracts);
  }

  /**
   * Создаёт JSON из текущего экземпляра. Метод противоположный [[build]]
   */
  public getJSON(): any {
    return Object.assign({}, this, super.getJSON());
  }
}

/**
 * Содержит поля [[ProductContract]], который могут быть переданы при его создании с помощью метода build
 */
export interface ProductContractBuild extends ProductContractInput, Form {
  locale: string;
  specificationMinVersion: number;
  badge: string;
  revision: number;
}

/**
 * Интерфейс, содержащий поля, которые могут быть изменены с помощью [[Action]] в [[ProductContract]]
 */
export interface ProductContractInput {
  contractId: string;
  name: string;
  description: string;
  prefix: string;
  price: number;
  currency: string;
  start: number;
  finish: number;
  deliveryTime: number;
}

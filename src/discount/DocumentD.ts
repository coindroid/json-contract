import Document, {DocumentBuild, DocumentDry, Value} from "../core/Document";
import DiscountContract from "./DiscountContract";
import ProductContractD from "./ProductContractD";
import Property from "../core/Property";
import {objectToProperties} from "../lib/util";
import ProductContract from "../core/ProductContract";

/**
 * Описывает документ с вохможность добавления и обработки скидок. Скидки действуют не на сам документ, а только на
 * productContractModified
 */
export default class DocumentD extends Document implements DocumentDiscountBuild {
  /**
   * Список скидок, применяемых к текущему документу
   */
  discountContracts: DiscountContract[];
  /**
   * Аналогично родительскому полю (см. [[Document]])
   */
  productContract: ProductContractD;
  /**
   * Аналогично родительскому полю (см. [[Document]])
   */
  productContractModified: ProductContractD;

  constructor(productContract: ProductContractD);
  constructor(productContract: ProductContractD, values?: Value[], childContracts?: ProductContract[], args?: Property<Document>[])
  /**
   * Аналогично родительскому конструктору (см. [[Document]])
   * @param productContract
   * @param values
   * @param childContracts
   * @param args
   */
  constructor(productContract: ProductContractD, values?: Value[], childContracts?: ProductContract[], args?: Property<Document>[]) {
    super(productContract, values, childContracts, args);
    this.discountContracts = [];
    this.productContract = productContract;
    this.productContractModified = productContract.clone();
  }

  /**
   * Создаёт экземпляр документа из JSON. Поля JSON аналогичны конструктору. Обработка проихсодит рекурсивно, то есть
   * создаются новые [[Value]] и [[ProductContractD]]
   *
   * @param productContract - [[ProductContractD]], может быть JSON или екземляр класса. Если это JSON, то будет создан новый екземпляр [[ProductContractD]] на его основе,
   * если это екземпляр, то он будет скопирован, опять же, рекурсивно
   * @param values - Массив пар id-значение. При создании не проверяется, для проверки используйте родительским метод validate
   * @param childContracts
   * @param args - Дополнительные поля (для внешних модулей)
   * @return new [[DocumentD]]
   */
  public static build({productContract, values, childContracts, ...args}: DocumentDiscountBuild): DocumentD {
    const valuesObj = values.map(v => new Value(v.id, v.value));
    productContract = ProductContractD.build(productContract);
    childContracts = childContracts || [];
    childContracts = childContracts.map(c => ProductContract.build(c));
    return new DocumentD(productContract, valuesObj, childContracts, objectToProperties(<any>args));
  }

  /**
   * Применяет все активные для данного документа скидки. То есть проверяется, что они [[productContract]] и
   * [[productContractModified]] соответсвуют заданому [[DiscountContract]]. Если [[ProductContractD]] запрещает применять несколько скидок,
   * то применяет только первую. После чего расчитывает цену, время доставки,
   * а так же редактирует [[productContractModified]] поле в соответствии с выбраными [[OptionsSelect]].
   * Иными словами, этот метод активирует все [[Action]] для выбраных [[OptionsSelect]]
   *
   * @param contract - [[ProductContractD]] который использовать для сброса. Если не передан, то используется [[productContract]] поле
   * @return Успешность расчёта
   */
  public processing(contract?: ProductContractD): boolean {
    this.productContractModified = (contract || this.productContract).clone();

    for (let discount of this.discountContracts) {
      if (discount.isActive(this)) {
        discount.activate(this);
        if (!this.productContractModified.discountCumulativeAllowed)
          break;
      }
    }

    return super.processing(this.productContractModified);
  }

  /**
   * Пытается применить переданный [[DiscountContract]] к текущему документу. Если [[ProductContractD]] позволяет
   * применять скидки и если скидку возможно применить, то сразу же выполняет все её [[Action]].
   * @param discount - Скидка, которую следует проверить и, возможно, применить
   * @return Была ли применена скидка
   */
  public addDiscount(discount: DiscountContract): boolean {
    if (!discount.isActive(this))
      return false;

    if (!this.productContract.discountAllowed)
      return false;

    this.discountContracts.push(discount);

    this.productContractModified = this.productContract.clone();
    for (let discount of this.discountContracts) {
      discount.activate(this);
      if (!this.productContractModified.discountCumulativeAllowed)
        break;
    }

    return true;
  }

  /**
   * "Осущает" документ. Создаёт объект, который содержит только поля, необходимые для воссоздания его в другом модуле.
   * поле [[productContract]] заменяется на его [[ProductContract.contractId]], а [[discountContracts]] на массив из
   * [[DiscountContract.id]] каждой применённой скидки
   */
  public dry(): DocumentDDry {
    let res = {} as DocumentDDry;
    for (let i in this) {
      if (i == 'productContract')
        res.productContract = this.productContract.contractId;
      else if (i == 'discountContracts')
        res.discountContracts = this.discountContracts.map(d => d.id);
      else if (this.hasOwnProperty(i) && i != 'productContractModified')
        res[i] = this[i];
    }
    return res;
  }
}

/**
 * Описывает поля для создания [[DocumentD]] из JSON
 */
interface DocumentDiscountBuild extends DocumentBuild {
  discountContracts: DiscountContract[];
  productContract: ProductContractD;
}

export interface DocumentDDry extends DocumentDry {
  discountContracts: string[]
}

import Option, {OptionTypes} from "./Option";
import Document, {Value} from "./Document";
import Reason from "./Reason";

/**
 * Содержит в [[Option]][] и методы для обработки [[Option]] в зависимости от значения, что для него записано
 */
export default class Form implements FormBuilder {
  /**
   * Массив [[Option]]. По сути это набор полей для ввода, которые в этом классе проверяются и при необходимости иным образом
   * обрабатываются
   */
  options: Option[];
  /**
   *
   */
  childContracts: Form[];

  /**
   *
   * @param options
   * @param childContracts
   */
  public constructor(options?: Option[], childContracts?: Form[]) {
    this.options = options || [];
    this.childContracts = childContracts || [];
  }

  /**
   * Создаёт документ из JSON. Используется только при клонировании. Как и другие методы build делает глубокое создание моделей
   * @param options
   * @param childContracts
   */
  protected static build({options}: Form, childContracts?: Form[]): Form {
    options = options.map(opt => Option.getOption(opt));
    return new Form(options, childContracts);
  }

  /**
   * Проверяет, что переданный документ содержит валидные значения для options этого экземпляра
   * @param document - Документ, подлежащий проверке
   */
  public validate(document: Document): boolean {
    for (let option of this.options) {
      const value = document.values.filter(v => v.id === option.id)[0] || {} as Value;
      if (option.type === OptionTypes.SELECT) {
        if (!(<OptionSelect>option).validate(value.value, document)) {
          return false;
        }
      } else if (!option.validate(value.value)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Возвращает причину не валидности документа или undefined если документ валидный.
   * @param document
   */
  public getRejectReason(document: Document): Reason | undefined {
    for (let option of this.options) {
      let value = document.values.filter(v => v.id === option.id)[0] || {} as Value;
      if (option.type === OptionTypes.SELECT || option.type === OptionTypes.CONTRACT) {
        const reason = (<OptionSelect>option).getRejectReason(value.value, document);
        if (reason) {
          reason.rejectOption = `${option.id}${reason.rejectOption ? ':' + reason.rejectOption : ''}`;
          return reason;
        }
      } else {
        const reason = option.getRejectReason(value.value);
        if (reason) {
          reason.rejectOption = option.id;
          return reason;
        }
      }
    }
    return undefined;
  }

  /**
   * Рассчитывает цену, время доставки, а так же редактирует productContractModified переданного [[Document]] в соответствии
   * с выбранными [[OptionsSelect]]. Иными словами, этот метод активирует все [[Action]] для выбранных [[SelectItem]].
   * @param document - документ, который нужно обработать
   * @param contract - [[ProductContract]] который использовать для сброса. Если не передан, то используется productContract
   * переданного документа
   */
  public processing(document: Document, contract?: ProductContract): void {
    document.productContractModified = (contract || document.productContract).clone();
    const modifiers = this.getModifiers(document);
    modifiers.forEach(modifier => modifier.action.activate(document.productContractModified));
  }

  /**
   * Создаёт глубокую копию текущего экземпляра.
   */
  public clone(): Form {
    return Form.build(this.getJSON(), this.childContracts);
  }

  /**
   * Создаёт JSON из текущего экземпляра. Метод противоположный [[build]].
   */
  public getJSON(): any {
    const clone = Object.assign({}, this);
    clone.options = this.options.map(opt => opt.getJSON());
    return clone;
  }

  /**
   * Возвращает все [[SelectItem]], которые в данный момент выбраны для текущих options в переданном документе.
   * @param document - документ
   */
  private getModifiers(document: Document): SelectItem[] {
    const optionsSelect = <OptionSelect[]>this.options.filter(opt => opt instanceof OptionSelect);
    let selectedOptions = optionsSelect.map(m => m.getSelected(document.getValue(m.id)));
    selectedOptions = selectedOptions.filter(sm => !!sm);
    return <SelectItem[]>selectedOptions;
  }
}

/**
 * Интерфейс для создания [[Form]]
 */
export interface FormBuilder {
  options: Option[];
}

import OptionSelect from "./OptionSelect";
import SelectItem from "./SelectItem";
import ProductContract from "./ProductContract";

import Option from "./Option";
import Form, {FormBuilder} from "./Form";
import Action, {ActionBuilder} from "./Action";
import ProductContract from "./ProductContract";

/**
 * Описывает строку выбора в [[OptionSelect]]. Этот класс может иметь дочерние [[Option]][] и выполнять действия [[Action]] над
 * документом, с которым в данный момент происходит работа.
 */
export default class SelectItem {
  /**
   * id экземпляра
   */
  id: string;
  /**
   * Строка для отображения
   */
  label: string;
  /**
   * Описание
   */
  description?: string;
  /**
   * Любые прочие данные
   */
  anyData?: string;
  /**
   * Действия, которые следует выполнить при выборе текущего экземпляра
   */
  action: Action;
  /**
   * Form, хранящий [[Option]][], которые следует отображать при выборе текущего экземпляра
   */
  form: Form;

  /**
   * @param id - id
   * @param label - подпись
   * @param form - [[Form]], хранящий необходимые [[Option]][]
   * @param action - [[Action]], который будет выполнен при выборе этого экземпляра
   * @param description - описание
   * @param anyData - другие данные
   */
  constructor(id: string, label: string, form: Form, action: Action, description?: string, anyData?: string) {
    this.id = id;
    this.label = label;
    this.description = description;
    this.form = form;
    this.action = action;
    this.anyData = anyData;
  }

  /**
   * Создаёт SelectItem и вложенные в него [[Form]] и [[Action]].
   * @param id - id
   * @param label - метка
   * @param description - описание
   * @param options - опции для отображения (см. [[Form]])
   * @param changeProperties - изменение свойств (см. [[Action]])
   * @param hideOptionsById - массив id опций, которые нужно скрыть (см. [[Action]])
   * @param modifyDeliveryTime - изменение времени доставки (см. [[Action]])
   * @param modifyPrice - изменение цены (см. [[Action]])
   * @param setDiscountInPercentage - установка скидки (см. [[Action]])
   * @param showOptionsById - массив id опций, которые нужно показать (см. [[Action]])
   * @param setCustomProperties - изменение свойств (см. [[Action]])
   * @param anyData - другие данные
   * @param childContracts
   */
  public static buildItem({
                            id, label, description, options, changeProperties, hideOptionsById, modifyDeliveryTime,
                            modifyPrice, setDiscountInPercentage, showOptionsById, setCustomProperties, anyData, childContracts
                          }: SelectItemBuilder): SelectItem {
    if (options)
      options = options.map(opt => Option.getOption(<any>{...opt, childContracts}));

    const formObj = new Form(options);
    const actionObj = Action.build({
      setDiscountInPercentage,
      showOptionsById,
      modifyPrice,
      modifyDeliveryTime,
      hideOptionsById,
      changeProperties,
      setCustomProperties
    });

    return new SelectItem(id, label, formObj, actionObj, description, anyData);
  }

  /**
   * Создаёт JSON из текущего экземпляра. Метод противоположный [[build]].
   */
  public getJSON(): SelectItemBuilder {
    const res = <SelectItemBuilder>{
      id: this.id,
      label: this.label,
      description: this.description,
      anyData: this.anyData
    };
    res.options = this.form.options.map(opt => opt.getJSON());
    res.modifyPrice = this.action.modifyPrice ? this.action.modifyPrice.getJSON() : undefined;
    res.modifyDeliveryTime = this.action.modifyDeliveryTime ? this.action.modifyDeliveryTime.getJSON() : undefined;
    res.setDiscountInPercentage = this.action.setDiscountInPercentage;
    res.hideOptionsById = this.action.hideOptionsById;
    res.showOptionsById = this.action.showOptionsById;
    res.changeProperties = this.action.changeProperties;
    res.setCustomProperties = this.action.setCustomProperties;
    return res;
  }
}

/**
 * Интерфейс для создания [[SelectItem]] с помощью метода build
 */
export interface SelectItemBuilder extends FormBuilder, ActionBuilder<ProductContract> {
  id: string;
  label: string;
  description?: string;
  anyData?: string;
  childContracts?: ProductContract[];
}

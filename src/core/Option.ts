import Reason from "./Reason";

/**
 * Класс, описывающий значение для ввода. По сути является описанием некоторого поля ввода и параметров его валидации.
 */
export default class Option {
  /**
   * id экземпляра. Указывается в [[Value.id]]
   */
  id: string;
  /**
   * Тип поля. Доступны варианты
   * - string - строка
   * - number - цифра
   * - select - выбор из нескольких
   * Подробности смотреть в классах наследниках
   */
  type: string;
  /**
   * Подпись к полю ввода
   */
  label: string;
  /**
   * Указывает обязательно ли поле к заполнению
   */
  isRequired: boolean;
  /**
   * Указывает отображать ли поле. Если true, то поле не отображается
   */
  isHidden: boolean;
  /**
   * Описание к полю ввода
   */
  description?: string;
  /**
   * Любые прочие данные
   */
  anyData?: string;


  constructor(id: string, type: string, label: string)
  constructor(id: string, type: string, label: string, isRequired: boolean)
  constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean)
  constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean, description?: string)
  constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean, description?: string, anyData?: string)
  /**
   * Если [[isRequired]] не передан, то он считается false. Аналогично [[isHidden]].
   * @param id - id
   * @param type - тип
   * @param label - подпись
   * @param isRequired - обязательно ли
   * @param isHidden - скрывать ли опцию
   * @param description - описание
   * @param anyData - любые данные
   */
  constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean, description?: string, anyData?: string) {
    this.id = id;
    this.type = type;
    this.label = label;
    this.description = description;
    this.anyData = anyData;
    this.isRequired = isRequired || false;
    this.isHidden = isHidden || false;
  }

  /**
   * Создаёт экземпляр [[Option]] из JSON. Если передать объект, то будет создана его копия.
   * @param id - id
   * @param type - тип
   * @param label - подпись
   * @param isRequired - обязательно ли
   * @param isHidden - скрывать ли опцию
   * @param description - описание
   * @param anyData - любые данные
   */
  public static buildOption({id, type, label, isRequired, isHidden, description, anyData}: Option): Option {
    return new Option(id, type, label, isRequired, isHidden, description, anyData);
  }

  /**
   * Создаёт экземпляр того класса, тип которого указан в type в параметре data.
   * Например, если data.type = 'number', то будет создан и отдан [[OptionNumber]].
   * @param data - JSON объект для создания нового [[Option]] или экземпляр [[Option]] для клонирования
   */
  public static getOption<T extends Option>(data: T): Option {
    switch (data.type) {
      case OptionTypes.STRING:
        return OptionString.buildOption(data);
      case OptionTypes.NUMBER:
        return OptionNumber.buildOption(data);
      case OptionTypes.SELECT:
        return OptionSelect.buildOption(<any>data);
      case OptionTypes.CONTRACT:
        return OptionContract.buildOption(<any>data);
    }
    return Option.buildOption(data);
  }

  /**
   * Базовая проверка значения. Если значение не спрятано ([[isHidden]]=false) и оно является обязательны([[isRequired]]=true)
   * и значение передано пустым, то валидация не будет пройдена. В ином случае валидация пройдена.
   * @param value - значение для проверки
   */
  public validate(value: any): boolean {
    if (!this.isHidden) {
      if (this.isRequired) {
        if (!value)
          return false;
      }
    }
    return true;
  }

  /**
   * Возвращает причину не валидности значения или undefined если значение валидное
   * @param value - значение для проверки
   * @return Возможные значения
   * - Reason {
   *   code: 'IR',
   *   label: 'is required'
   * }
   */
  public getRejectReason(value: any): Reason | undefined {
    if (!this.isHidden) {
      if (this.isRequired) {
        if (!value)
          return new Reason('IR', 'is required');
      }
    }
    return undefined;
  }

  /**
   * Возвращает текущий экземпляр как JSON. Метод противоположный [[build]].
   */
  public getJSON(): Option {
    return Object.assign({}, this);
  }
}

/**
 * Возможные типы [[Option]]. В данный момент доступны
 * - string
 * - number
 * - select
 */
export enum OptionTypes {
  STRING = 'string',
  NUMBER = 'number',
  SELECT = 'select',
  CONTRACT = 'contract'
}

import OptionString from "./OptionString";
import OptionNumber from "./OptionNumber";
import OptionSelect from "./OptionSelect";
import OptionContract from "./OptionContract";

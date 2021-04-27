import Option from "./Option";
import Reason from "./Reason";
import ProductContract from "./ProductContract";
import Document from "./Document";

export default class OptionContract extends Option {

  productContract?: ProductContract;
  productContractId?: string;

  constructor(id: string, type: string, label: string, isRequired?: boolean, isHidden?: boolean, description?: string, anyData?: string, productContract?: ProductContract, productContractId?: string) {
    super(id, type, label, isRequired, isHidden, description, anyData);
    this.productContract = productContract;
    this.productContractId = productContractId;
  }

  public static buildOption({anyData, description, productContractId, id, isRequired, isHidden, label, type, childContracts}: OptionContractBuilder): OptionContract {
    childContracts = childContracts || [];
    const productContract = childContracts.find(c => c.contractId === productContractId);
    if (!productContract) {
      throw new Error(`Product contract with id ${productContractId} was not found in childContracts argument array`);
    }
    return new OptionContract(id, type, label, isRequired, isHidden, description, anyData, productContract, productContractId);
  }

  validate(value: any): boolean {
    if (value) {
      if (this.productContract) {
        const innerDoc = new Document(this.productContract, value);
        if (!this.productContract.validate(innerDoc)) {
          return false;
        }
      }
    }
    return super.validate(value);
  }

  getRejectReason(value: any): Reason | undefined {
    if (value) {
      if (this.productContract) {
        const innerDoc = new Document(this.productContract, value);
        const rejectReason = this.productContract.getRejectReason(innerDoc);
        if (rejectReason) {
          return rejectReason;
        }
      }
    }
    return super.getRejectReason(value);
  }
}

export interface OptionContractBuilder extends Option {
  productContractId: string;
  childContracts: ProductContract[];
}

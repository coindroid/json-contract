'use strict';

import {Document} from "..";
import should = require("should");
import Reason from '../core/Reason';
import {Value} from "../core/Document";
import ProductContract from "../core/ProductContract";

const document1Data = require('./data/document1-data.json');
const document1Expected = require('./data/document1-expected.json');
const simpleProductContractData = require('./data/productContract-data.json');
const simpleProductContractExpected = require('./data/productContract-expected.json');
const numberProductContract = require('./data/productContract-with-number-option.json');
const stringProductContract = require('./data/productContract-with-string-option.json');
const selectProductContractSimple = require('./data/productContract-with-simple-select-option.json');
const selectProductContractComplex = require('./data/productContract-with-complex-select-option.json');
const contractProductContract = require('./data/productContract-with-contract-option.json');
const contractProductContractComplex = require('./data/productContract-with-complex-contract-option.json');
const numberRequiredProductContract = require('./data/productContract-with-number-option-required.json');

describe('Document', () => {

  it('should correct create document from JSON', () => {
    document1Data.productContract = simpleProductContractData;
    const document = Document.build(document1Data);

    document1Expected.productContract = simpleProductContractExpected;
    document1Expected.productContractModified = simpleProductContractExpected;
    document.should.match(document1Expected);
  });

  describe('validation and rejection errors', () => {

    let document: Document;

    beforeEach(() => {
      document1Data.productContract = simpleProductContractData;
      document = Document.build(document1Data);
    });

    it('should return ok if string options is required, but hidden and not set', () => {
      const stringValue = document.values.find(v => v.id === 'stringOption');
      if (!stringValue) {
        throw new Error('There is not string option');
      }

      stringValue.value = undefined;

      document.check().should.be.true();
      should(document.getRejectReason()).be.undefined();
    });

    it('should return reject if select options is required but not set', () => {
      const selectValue = document.values.find(v => v.id === 'selectOption');
      if (!selectValue) {
        throw new Error('There is not select option');
      }

      selectValue.value = undefined;

      document.check().should.be.false();
      const reason = new Reason('IR', 'is required');
      reason.rejectOption = 'selectOption';
      should(document.getRejectReason()).be.eql(reason);
    });

    it('should return ok if number options not is required and is not set', () => {
      const numberValue = document.values.find(v => v.id === 'numberOption');
      if (!numberValue) {
        throw new Error('There is not number option');
      }

      numberValue.value = undefined;

      document.check().should.be.true();
      should(document.getRejectReason()).be.undefined();
    });

    describe('for number options', () => {

      beforeEach(() => {
        document = Document.build({
          values: [
            {
              id: 'numberOption',
              value: 50
            }
          ],
          productContract: numberProductContract
        });
      });

      it('should return ok', () => {
        document.check().should.be.true();
        should(document.getRejectReason()).be.undefined();
      });

      it('should reject if number options is not match regex', () => {
        const numberValue = document.values.find(v => v.id === 'numberOption');
        if (!numberValue) {
          throw new Error('There is not number option');
        }

        numberValue.value = 19;

        document.check().should.be.false();
        const reason = new Reason('RME', 'regex matching error');
        reason.rejectOption = 'numberOption';
        should(document.getRejectReason()).be.eql(reason);
      });

      it('should reject if number options is larger than maximum', () => {
        const numberValue = document.values.find(v => v.id === 'numberOption');
        if (!numberValue) {
          throw new Error('There is not number option');
        }

        numberValue.value = 200;

        document.check().should.be.false();
        const reason = new Reason('LTM', 'larger than max');
        reason.rejectOption = 'numberOption';
        should(document.getRejectReason()).be.eql(reason);
      });

      it('should reject if number options is less than minimal', () => {
        const numberValue = document.values.find(v => v.id === 'numberOption');
        if (!numberValue) {
          throw new Error('There is not number option');
        }

        numberValue.value = 5;

        document.check().should.be.false();
        const reason = new Reason('STM', 'smaller than min');
        reason.rejectOption = 'numberOption';
        should(document.getRejectReason()).be.eql(reason);
      });

      it('should reject if number options has type string', () => {
        const numberValue = document.values.find(v => v.id === 'numberOption');
        if (!numberValue) {
          throw new Error('There is not number option');
        }

        numberValue.value = '50';

        document.check().should.be.false();
        const reason = new Reason('IT', 'incorrect type');
        reason.rejectOption = 'numberOption';
        should(document.getRejectReason()).be.eql(reason);
      });

    });

    describe('for string options', () => {

      beforeEach(() => {
        document = Document.build({
          values: [
            {
              id: 'stringOption',
              value: 'test'
            }
          ],
          productContract: stringProductContract
        });
      });

      it('should return ok', () => {
        document.check().should.be.true();
        should(document.getRejectReason()).be.undefined();
      });

      it('should reject if string options is not match regex', () => {
        const stringValue = document.values.find(v => v.id === 'stringOption');
        if (!stringValue) {
          throw new Error('There is not string option');
        }

        stringValue.value = '$#!?*';

        document.check().should.be.false();
        const reason = new Reason('RME', 'regex matching error');
        reason.rejectOption = 'stringOption';
        should(document.getRejectReason()).be.eql(reason);
      });

      it('should reject if string option length is larger than maximum length', () => {
        const stringValue = document.values.find(v => v.id === 'stringOption');
        if (!stringValue) {
          throw new Error('There is not string option');
        }

        stringValue.value = 'qwertyuiopasd';

        document.check().should.be.false();
        const reason = new Reason('LTML', 'larger than max length');
        reason.rejectOption = 'stringOption';
        should(document.getRejectReason()).be.eql(reason);
      });

      it('should reject if string option length is less than minimal length', () => {
        const stringValue = document.values.find(v => v.id === 'stringOption');
        if (!stringValue) {
          throw new Error('There is not string option');
        }

        stringValue.value = '12';

        document.check().should.be.false();
        const reason = new Reason('STML', 'smaller than min length');
        reason.rejectOption = 'stringOption';
        should(document.getRejectReason()).be.eql(reason);
      });

      it('should reject if string options has type string', () => {
        const stringValue = document.values.find(v => v.id === 'stringOption');
        if (!stringValue) {
          throw new Error('There is not string option');
        }

        stringValue.value = 50;

        document.check().should.be.false();
        const reason = new Reason('IT', 'incorrect type');
        reason.rejectOption = 'stringOption';
        should(document.getRejectReason()).be.eql(reason);
      });

    });

    describe('for simple select options', () => {

      beforeEach(() => {
        document = Document.build({
          values: [
            {
              id: 'selectOption',
              value: 's-1'
            }
          ],
          productContract: selectProductContractSimple
        });
      });

      it('should return ok', () => {
        document.check().should.be.true();
        should(document.getRejectReason()).be.undefined();
      });

      it('should reject if option not selected', () => {
        const selectValue = document.values.find(v => v.id === 'selectOption');
        if (!selectValue) {
          throw new Error('There is not select option');
        }

        selectValue.value = 'broken';

        document.check().should.be.false();
        const reason = new Reason('NC', 'not checked');
        reason.rejectOption = 'selectOption';
        should(document.getRejectReason()).be.eql(reason);
      });

    });

    describe('for complex select option', () => {

      beforeEach(() => {
        document = Document.build({
          values: [
            {
              id: 'selectOption',
              value: 'selectWithNumberString'
            },
            {
              id: 'numberOptionRequired',
              value: 5
            }
          ],
          productContract: selectProductContractComplex
        });
      });

      it('should return ok', () => {
        document.check().should.be.true();
        should(document.getRejectReason()).be.undefined();
      });

      it('should reject if number option is larger than max', () => {
        const numberValue = document.values.find(v => v.id === 'numberOptionRequired');
        if (!numberValue) {
          throw new Error('There is not number option');
        }

        numberValue.value = 15;

        document.check().should.be.false();
        const reason = new Reason('LTM', 'larger than max');
        reason.rejectOption = 'selectOption:numberOptionRequired';
        should(document.getRejectReason()).be.eql(reason);
      });

      it('should reject if selected radio with required value and value not set', async () => {
        const selectValue = document.values.find(v => v.id === 'selectOption');
        if (!selectValue) {
          throw new Error('There is not select option');
        }

        selectValue.value = 'selectWithSelect';

        document.check().should.be.false();
        const reason = new Reason('IR', 'is required');
        reason.rejectOption = 'selectOption:selectOptionInner';
        should(document.getRejectReason()).be.eql(reason);
      });


      it('should return ok if selected radio with required value and value set', async () => {
        const selectValue = document.values.find(v => v.id === 'selectOption');
        if (!selectValue) {
          throw new Error('There is not select option');
        }

        selectValue.value = 'selectWithSelect';

        document.values.push({
          id: 'selectOptionInner',
          value: 's-1'
        });

        document.check().should.be.true();
        should(document.getRejectReason()).be.undefined();
      });

    });

    describe('for contract option', () => {

      beforeEach(() => {

        document = Document.build({
          values: [
            {
              id: 'contractOption',
              value: [
                {
                  id: 'numberOption',
                  value: 50
                }
              ]
            }
          ],
          productContract: contractProductContract,
          childContracts: [
            numberProductContract
          ]
        });
      });

      it('should return ok', () => {
        document.check().should.be.true();
        should(document.getRejectReason()).be.undefined();
      });

      it('should reject if number options in inner contract is larger than maximum', () => {
        const contract = document.values.find(v => v.id === 'contractOption');
        if (!contract) {
          throw new Error('There is not contract option');
        }

        const numberValue = contract.value.find((v: Value) => v.id === 'numberOption');
        numberValue.value = 200;

        document.check().should.be.false();
        const reason = new Reason('LTM', 'larger than max');
        reason.rejectOption = 'contractOption:numberOption';
        should(document.getRejectReason()).be.eql(reason);
      });

    });

    describe('for complex contract option', () => {

      beforeEach(() => {
        document = Document.build({
          values: [
            {
              id: 'selectOption',
              value: 'selectWithStringContract'
            },
            {
              id: 'stringOption',
              value: 'test'
            },
            {
              id: 'contractOption',
              value: [
                {
                  id: 'numberOptionRequired',
                  value: 18
                }
              ]
            }
          ],
          productContract: contractProductContractComplex,
          childContracts: [
            numberRequiredProductContract,
            stringProductContract
          ]
        });
      });

      it('should return ok', () => {
        document.check().should.be.true();
        should(document.getRejectReason()).be.undefined();
      });

      it('should reject with required error', () => {
        const contractValue = document.values.find(v => v.id === 'contractOption');
        if (!contractValue) {
          throw new Error('There is not contract option');
        }

        contractValue.value = [];

        document.check().should.be.false();
        const reason = new Reason('IR', 'is required');
        reason.rejectOption = 'selectOption:contractOption:numberOptionRequired';
        should(document.getRejectReason()).be.eql(reason);
      });

    });

  });

  it('should add option', () => {
    const document = Document.build({
      values: [],
      productContract: simpleProductContractData
    });

    document.addOption('selectOption', 's-1').should.be.true();

    document.values.should.match([{
      id: 'selectOption',
      value: 's-1'
    }]);
  });

  describe('addOption', () => {

    it('should add option in select options', () => {
      const document = Document.build({
        values: [],
        productContract: selectProductContractComplex
      });

      document.addOption('selectOption', 'selectWithNumberString').should.be.true();
      document.addOption('numberOptionRequired', 5).should.be.true();

      document.values.should.match([{
        id: 'selectOption',
        value: 'selectWithNumberString'
      }, {
        id: 'numberOptionRequired',
        value: 5
      }]);
    });

    it('should reject if option not found', () => {
      const document = Document.build({
        values: [],
        productContract: selectProductContractComplex
      });

      document.addOption('brokenOption', 'value').should.be.false();

      document.values.should.match([]);
    });

    it('should reject if option not valid', () => {
      const document = Document.build({
        values: [],
        productContract: selectProductContractComplex
      });

      document.addOption('selectOption', 'brokenSelect').should.be.false();

      document.values.should.match([]);
    });

    it('should update value if it has been set previously', () => {
      const document = Document.build({
        values: [],
        productContract: selectProductContractComplex
      });

      document.addOption('selectOption', 'selectWithNumberString').should.be.true();
      document.addOption('numberOptionRequired', 5).should.be.true();
      document.addOption('numberOptionRequired', 7).should.be.true();

      document.values.should.match([{
        id: 'selectOption',
        value: 'selectWithNumberString'
      }, {
        id: 'numberOptionRequired',
        value: 7
      }]);
    });

    it('should remove unselected options', () => {
      const document = Document.build({
        values: [],
        productContract: selectProductContractComplex
      });

      document.addOption('selectOption', 'selectWithNumberString').should.be.true();
      document.addOption('numberOptionRequired', 5).should.be.true();

      document.values.should.match([{
        id: 'selectOption',
        value: 'selectWithNumberString'
      }, {
        id: 'numberOptionRequired',
        value: 5
      }]);

      document.addOption('selectOption', 'selectWithSelect').should.be.true();
      document.addOption('selectOptionInner', 's-1').should.be.true();

      document.values.should.match([{
        id: 'selectOption',
        value: 'selectWithSelect'
      }, {
        id: 'selectOptionInner',
        value: 's-1'
      }]);
    });

    describe('and activate action', () => {

      it('should modify price', () => {

      });

    });

  });

});

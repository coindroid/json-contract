'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var should = require("should");
var Reason_1 = require("../core/Reason");
var document1Data = require('./data/document1-data.json');
var document1Expected = require('./data/document1-expected.json');
var simpleProductContractData = require('./data/productContract-data.json');
var simpleProductContractExpected = require('./data/productContract-expected.json');
var numberProductContract = require('./data/productContract-with-number-option.json');
var stringProductContract = require('./data/productContract-with-string-option.json');
var selectProductContractSimple = require('./data/productContract-with-simple-select-option.json');
var selectProductContractComplex = require('./data/productContract-with-complex-select-option.json');
var contractProductContract = require('./data/productContract-with-contract-option.json');
var contractProductContractComplex = require('./data/productContract-with-complex-contract-option.json');
var numberRequiredProductContract = require('./data/productContract-with-number-option-required.json');
describe('Document', function () {
    it('should correct create document from JSON', function () {
        document1Data.productContract = simpleProductContractData;
        var document = __1.Document.build(document1Data);
        document1Expected.productContract = simpleProductContractExpected;
        document1Expected.productContractModified = simpleProductContractExpected;
        document.should.match(document1Expected);
    });
    describe('validation and rejection errors', function () {
        var document;
        beforeEach(function () {
            document1Data.productContract = simpleProductContractData;
            document = __1.Document.build(document1Data);
        });
        it('should return ok if string options is required, but hidden and not set', function () {
            var stringValue = document.values.find(function (v) { return v.id === 'stringOption'; });
            if (!stringValue) {
                throw new Error('There is not string option');
            }
            stringValue.value = undefined;
            document.check().should.be.true();
            should(document.getRejectReason()).be.undefined();
        });
        it('should return reject if select options is required but not set', function () {
            var selectValue = document.values.find(function (v) { return v.id === 'selectOption'; });
            if (!selectValue) {
                throw new Error('There is not select option');
            }
            selectValue.value = undefined;
            document.check().should.be.false();
            var reason = new Reason_1.default('IR', 'is required');
            reason.rejectOption = 'selectOption';
            should(document.getRejectReason()).be.eql(reason);
        });
        it('should return ok if number options not is required and is not set', function () {
            var numberValue = document.values.find(function (v) { return v.id === 'numberOption'; });
            if (!numberValue) {
                throw new Error('There is not number option');
            }
            numberValue.value = undefined;
            document.check().should.be.true();
            should(document.getRejectReason()).be.undefined();
        });
        describe('for number options', function () {
            beforeEach(function () {
                document = __1.Document.build({
                    values: [
                        {
                            id: 'numberOption',
                            value: 50
                        }
                    ],
                    productContract: numberProductContract
                });
            });
            it('should return ok', function () {
                document.check().should.be.true();
                should(document.getRejectReason()).be.undefined();
            });
            it('should reject if number options is not match regex', function () {
                var numberValue = document.values.find(function (v) { return v.id === 'numberOption'; });
                if (!numberValue) {
                    throw new Error('There is not number option');
                }
                numberValue.value = 19;
                document.check().should.be.false();
                var reason = new Reason_1.default('RME', 'regex matching error');
                reason.rejectOption = 'numberOption';
                should(document.getRejectReason()).be.eql(reason);
            });
            it('should reject if number options is larger than maximum', function () {
                var numberValue = document.values.find(function (v) { return v.id === 'numberOption'; });
                if (!numberValue) {
                    throw new Error('There is not number option');
                }
                numberValue.value = 200;
                document.check().should.be.false();
                var reason = new Reason_1.default('LTM', 'larger than max');
                reason.rejectOption = 'numberOption';
                should(document.getRejectReason()).be.eql(reason);
            });
            it('should reject if number options is less than minimal', function () {
                var numberValue = document.values.find(function (v) { return v.id === 'numberOption'; });
                if (!numberValue) {
                    throw new Error('There is not number option');
                }
                numberValue.value = 5;
                document.check().should.be.false();
                var reason = new Reason_1.default('STM', 'smaller than min');
                reason.rejectOption = 'numberOption';
                should(document.getRejectReason()).be.eql(reason);
            });
            it('should reject if number options has type string', function () {
                var numberValue = document.values.find(function (v) { return v.id === 'numberOption'; });
                if (!numberValue) {
                    throw new Error('There is not number option');
                }
                numberValue.value = '50';
                document.check().should.be.false();
                var reason = new Reason_1.default('IT', 'incorrect type');
                reason.rejectOption = 'numberOption';
                should(document.getRejectReason()).be.eql(reason);
            });
        });
        describe('for string options', function () {
            beforeEach(function () {
                document = __1.Document.build({
                    values: [
                        {
                            id: 'stringOption',
                            value: 'test'
                        }
                    ],
                    productContract: stringProductContract
                });
            });
            it('should return ok', function () {
                document.check().should.be.true();
                should(document.getRejectReason()).be.undefined();
            });
            it('should reject if string options is not match regex', function () {
                var stringValue = document.values.find(function (v) { return v.id === 'stringOption'; });
                if (!stringValue) {
                    throw new Error('There is not string option');
                }
                stringValue.value = '$#!?*';
                document.check().should.be.false();
                var reason = new Reason_1.default('RME', 'regex matching error');
                reason.rejectOption = 'stringOption';
                should(document.getRejectReason()).be.eql(reason);
            });
            it('should reject if string option length is larger than maximum length', function () {
                var stringValue = document.values.find(function (v) { return v.id === 'stringOption'; });
                if (!stringValue) {
                    throw new Error('There is not string option');
                }
                stringValue.value = 'qwertyuiopasd';
                document.check().should.be.false();
                var reason = new Reason_1.default('LTML', 'larger than max length');
                reason.rejectOption = 'stringOption';
                should(document.getRejectReason()).be.eql(reason);
            });
            it('should reject if string option length is less than minimal length', function () {
                var stringValue = document.values.find(function (v) { return v.id === 'stringOption'; });
                if (!stringValue) {
                    throw new Error('There is not string option');
                }
                stringValue.value = '12';
                document.check().should.be.false();
                var reason = new Reason_1.default('STML', 'smaller than min length');
                reason.rejectOption = 'stringOption';
                should(document.getRejectReason()).be.eql(reason);
            });
            it('should reject if string options has type string', function () {
                var stringValue = document.values.find(function (v) { return v.id === 'stringOption'; });
                if (!stringValue) {
                    throw new Error('There is not string option');
                }
                stringValue.value = 50;
                document.check().should.be.false();
                var reason = new Reason_1.default('IT', 'incorrect type');
                reason.rejectOption = 'stringOption';
                should(document.getRejectReason()).be.eql(reason);
            });
        });
        describe('for simple select options', function () {
            beforeEach(function () {
                document = __1.Document.build({
                    values: [
                        {
                            id: 'selectOption',
                            value: 's-1'
                        }
                    ],
                    productContract: selectProductContractSimple
                });
            });
            it('should return ok', function () {
                document.check().should.be.true();
                should(document.getRejectReason()).be.undefined();
            });
            it('should reject if option not selected', function () {
                var selectValue = document.values.find(function (v) { return v.id === 'selectOption'; });
                if (!selectValue) {
                    throw new Error('There is not select option');
                }
                selectValue.value = 'broken';
                document.check().should.be.false();
                var reason = new Reason_1.default('NC', 'not checked');
                reason.rejectOption = 'selectOption';
                should(document.getRejectReason()).be.eql(reason);
            });
        });
        describe('for complex select option', function () {
            beforeEach(function () {
                document = __1.Document.build({
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
            it('should return ok', function () {
                document.check().should.be.true();
                should(document.getRejectReason()).be.undefined();
            });
            it('should reject if number option is larger than max', function () {
                var numberValue = document.values.find(function (v) { return v.id === 'numberOptionRequired'; });
                if (!numberValue) {
                    throw new Error('There is not number option');
                }
                numberValue.value = 15;
                document.check().should.be.false();
                var reason = new Reason_1.default('LTM', 'larger than max');
                reason.rejectOption = 'selectOption:numberOptionRequired';
                should(document.getRejectReason()).be.eql(reason);
            });
            it('should reject if selected radio with required value and value not set', function () { return __awaiter(void 0, void 0, void 0, function () {
                var selectValue, reason;
                return __generator(this, function (_a) {
                    selectValue = document.values.find(function (v) { return v.id === 'selectOption'; });
                    if (!selectValue) {
                        throw new Error('There is not select option');
                    }
                    selectValue.value = 'selectWithSelect';
                    document.check().should.be.false();
                    reason = new Reason_1.default('IR', 'is required');
                    reason.rejectOption = 'selectOption:selectOptionInner';
                    should(document.getRejectReason()).be.eql(reason);
                    return [2];
                });
            }); });
            it('should return ok if selected radio with required value and value set', function () { return __awaiter(void 0, void 0, void 0, function () {
                var selectValue;
                return __generator(this, function (_a) {
                    selectValue = document.values.find(function (v) { return v.id === 'selectOption'; });
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
                    return [2];
                });
            }); });
        });
        describe('for contract option', function () {
            beforeEach(function () {
                document = __1.Document.build({
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
            it('should return ok', function () {
                document.check().should.be.true();
                should(document.getRejectReason()).be.undefined();
            });
            it('should reject if number options in inner contract is larger than maximum', function () {
                var contract = document.values.find(function (v) { return v.id === 'contractOption'; });
                if (!contract) {
                    throw new Error('There is not contract option');
                }
                var numberValue = contract.value.find(function (v) { return v.id === 'numberOption'; });
                numberValue.value = 200;
                document.check().should.be.false();
                var reason = new Reason_1.default('LTM', 'larger than max');
                reason.rejectOption = 'contractOption:numberOption';
                should(document.getRejectReason()).be.eql(reason);
            });
        });
        describe('for complex contract option', function () {
            beforeEach(function () {
                document = __1.Document.build({
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
            it('should return ok', function () {
                document.check().should.be.true();
                should(document.getRejectReason()).be.undefined();
            });
            it('should reject with required error', function () {
                var contractValue = document.values.find(function (v) { return v.id === 'contractOption'; });
                if (!contractValue) {
                    throw new Error('There is not contract option');
                }
                contractValue.value = [];
                document.check().should.be.false();
                var reason = new Reason_1.default('IR', 'is required');
                reason.rejectOption = 'selectOption:contractOption:numberOptionRequired';
                should(document.getRejectReason()).be.eql(reason);
            });
        });
    });
    it('should add option', function () {
        var document = __1.Document.build({
            values: [],
            productContract: simpleProductContractData
        });
        document.addOption('selectOption', 's-1').should.be.true();
        document.values.should.match([{
                id: 'selectOption',
                value: 's-1'
            }]);
    });
    describe('addOption', function () {
        it('should add option in select options', function () {
            var document = __1.Document.build({
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
        it('should reject if option not found', function () {
            var document = __1.Document.build({
                values: [],
                productContract: selectProductContractComplex
            });
            document.addOption('brokenOption', 'value').should.be.false();
            document.values.should.match([]);
        });
        it('should reject if option not valid', function () {
            var document = __1.Document.build({
                values: [],
                productContract: selectProductContractComplex
            });
            document.addOption('selectOption', 'brokenSelect').should.be.false();
            document.values.should.match([]);
        });
        it('should update value if it has been set previously', function () {
            var document = __1.Document.build({
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
        it('should remove unselected options', function () {
            var document = __1.Document.build({
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
        describe('and activate action', function () {
            it('should modify price', function () {
            });
        });
    });
});

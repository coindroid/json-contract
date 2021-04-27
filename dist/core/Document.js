"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Value = void 0;
var ProductContract_1 = require("./ProductContract");
var OptionSelect_1 = require("./OptionSelect");
var util_1 = require("../lib/util");
var uuid = require("uuid");
var Option_1 = require("./Option");
var Document = (function () {
    function Document(productContract, values, childContracts, args) {
        this.productContract = productContract;
        this.controlHash = '';
        this.values = values || [];
        this.documentId = uuid.v4();
        this.productContractModified = this.productContract.clone();
        this.childContracts = childContracts || [];
        if (args)
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var i = args_1[_i];
                this[i.property] = i.value;
            }
    }
    Document.build = function (_a) {
        var productContract = _a.productContract, values = _a.values, childContracts = _a.childContracts, args = __rest(_a, ["productContract", "values", "childContracts"]);
        values = values.map(function (v) { return new Value(v.id, v.value); });
        childContracts = childContracts || [];
        childContracts = childContracts.map(function (c) { return ProductContract_1.default.build(c); });
        productContract = ProductContract_1.default.build(productContract, childContracts);
        return new Document(productContract, values, childContracts, util_1.objectToProperties(args));
    };
    Document.prototype.check = function () {
        return this.productContract.validate(this);
    };
    Document.prototype.getRejectReason = function () {
        return this.productContract.getRejectReason(this);
    };
    Document.prototype.addOption = function (id, value) {
        var option = this.findOptionById(id, this.productContract.options);
        if (!option)
            return false;
        if (!option.validate(value))
            return false;
        var oldValue = this.values.find(function (v) { return v.id === id; });
        if (oldValue) {
            if (option.type === Option_1.OptionTypes.SELECT) {
                var oldOptionIds_1 = this.getOptionsOfSelectItem(option, oldValue.value).map(function (o) { return o.id; });
                this.values = this.values.filter(function (v) { return !oldOptionIds_1.includes(v.id); });
            }
            oldValue.value = value;
        }
        else
            this.values.push(new Value(id, value));
        if (option instanceof OptionSelect_1.default) {
            var selected = option.getSelected(value);
            if (selected) {
                selected.action.activate(this.productContractModified);
            }
        }
        return true;
    };
    Document.prototype.getValue = function (id) {
        var value = this.values.find(function (v) { return v.id === id; });
        return value && value.value;
    };
    Document.prototype.processing = function (contract) {
        if (!this.check())
            return false;
        this.productContract.processing(this, contract);
        return true;
    };
    Document.prototype.dry = function () {
        var res = {};
        for (var i in this) {
            if (i == 'productContract')
                res.productContract = this.productContract.contractId;
            else if (this.hasOwnProperty(i) && i != 'productContractModified')
                res[i] = this[i];
        }
        return res;
    };
    Document.prototype.findOptionById = function (id, options) {
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var opt = options_1[_i];
            if (opt.id === id) {
                return opt;
            }
            if (opt.type === Option_1.OptionTypes.SELECT) {
                var selected = opt.getSelected(this.getValue(opt.id));
                if (selected) {
                    return this.findOptionById(id, selected.form.options);
                }
            }
        }
    };
    Document.prototype.getOptionsOfSelectItem = function (selectOption, selected) {
        var selectedItem = selectOption.options.find(function (opt) { return opt.id === selected; });
        if (selectedItem) {
            return selectedItem.form.options;
        }
        return [];
    };
    return Document;
}());
exports.default = Document;
var Value = (function () {
    function Value(id, value) {
        this.id = id;
        this.value = value;
    }
    return Value;
}());
exports.Value = Value;

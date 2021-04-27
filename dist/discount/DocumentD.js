"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Document_1 = require("../core/Document");
var ProductContractD_1 = require("./ProductContractD");
var util_1 = require("../lib/util");
var ProductContract_1 = require("../core/ProductContract");
var DocumentD = (function (_super) {
    __extends(DocumentD, _super);
    function DocumentD(productContract, values, childContracts, args) {
        var _this = _super.call(this, productContract, values, childContracts, args) || this;
        _this.discountContracts = [];
        _this.productContract = productContract;
        _this.productContractModified = productContract.clone();
        return _this;
    }
    DocumentD.build = function (_a) {
        var productContract = _a.productContract, values = _a.values, childContracts = _a.childContracts, args = __rest(_a, ["productContract", "values", "childContracts"]);
        var valuesObj = values.map(function (v) { return new Document_1.Value(v.id, v.value); });
        productContract = ProductContractD_1.default.build(productContract);
        childContracts = childContracts || [];
        childContracts = childContracts.map(function (c) { return ProductContract_1.default.build(c); });
        return new DocumentD(productContract, valuesObj, childContracts, util_1.objectToProperties(args));
    };
    DocumentD.prototype.processing = function (contract) {
        this.productContractModified = (contract || this.productContract).clone();
        for (var _i = 0, _a = this.discountContracts; _i < _a.length; _i++) {
            var discount = _a[_i];
            if (discount.isActive(this)) {
                discount.activate(this);
                if (!this.productContractModified.discountCumulativeAllowed)
                    break;
            }
        }
        return _super.prototype.processing.call(this, this.productContractModified);
    };
    DocumentD.prototype.addDiscount = function (discount) {
        if (!discount.isActive(this))
            return false;
        if (!this.productContract.discountAllowed)
            return false;
        this.discountContracts.push(discount);
        this.productContractModified = this.productContract.clone();
        for (var _i = 0, _a = this.discountContracts; _i < _a.length; _i++) {
            var discount_1 = _a[_i];
            discount_1.activate(this);
            if (!this.productContractModified.discountCumulativeAllowed)
                break;
        }
        return true;
    };
    DocumentD.prototype.dry = function () {
        var res = {};
        for (var i in this) {
            if (i == 'productContract')
                res.productContract = this.productContract.contractId;
            else if (i == 'discountContracts')
                res.discountContracts = this.discountContracts.map(function (d) { return d.id; });
            else if (this.hasOwnProperty(i) && i != 'productContractModified')
                res[i] = this[i];
        }
        return res;
    };
    return DocumentD;
}(Document_1.default));
exports.default = DocumentD;

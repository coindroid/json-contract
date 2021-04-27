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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var Option_1 = require("./Option");
var Form_1 = require("./Form");
var util_1 = require("../lib/util");
var ProductContract = (function (_super) {
    __extends(ProductContract, _super);
    function ProductContract(options, childContracts, contractId, name, locale, description, specificationMinVersion, prefix, badge, price, currency, start, finish, revision, deliveryTime, args) {
        var _this = _super.call(this, options, childContracts) || this;
        _this.name = name;
        _this.locale = locale;
        _this.description = description;
        _this.contractId = contractId;
        _this.specificationMinVersion = specificationMinVersion;
        _this.prefix = prefix;
        _this.badge = badge;
        _this.price = price;
        _this.currency = currency;
        _this.start = start;
        _this.finish = finish;
        _this.revision = revision;
        _this.deliveryTime = deliveryTime;
        _this.controlHash = '';
        if (args)
            for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                var i = args_1[_i];
                _this[i.property] = i.value;
            }
        return _this;
    }
    ProductContract.build = function (_a, childContracts) {
        var locale = _a.locale, name = _a.name, options = _a.options, contractId = _a.contractId, badge = _a.badge, deliveryTime = _a.deliveryTime, currency = _a.currency, description = _a.description, prefix = _a.prefix, finish = _a.finish, price = _a.price, revision = _a.revision, specificationMinVersion = _a.specificationMinVersion, start = _a.start, args = __rest(_a, ["locale", "name", "options", "contractId", "badge", "deliveryTime", "currency", "description", "prefix", "finish", "price", "revision", "specificationMinVersion", "start"]);
        childContracts = childContracts || [];
        options = options.map(function (opt) { return Option_1.default.getOption(__assign(__assign({}, opt), { childContracts: childContracts })); });
        return new ProductContract(options, childContracts, contractId, name, locale, description, specificationMinVersion, prefix, badge, price, currency, start, finish, revision, deliveryTime, util_1.objectToProperties(args));
    };
    ProductContract.prototype.clone = function () {
        return ProductContract.build(this.getJSON(), this.childContracts);
    };
    ProductContract.prototype.getJSON = function () {
        return Object.assign({}, this, _super.prototype.getJSON.call(this));
    };
    return ProductContract;
}(Form_1.default));
exports.default = ProductContract;

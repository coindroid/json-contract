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
Object.defineProperty(exports, "__esModule", { value: true });
var Option_1 = require("./Option");
var SelectItem_1 = require("./SelectItem");
var Reason_1 = require("./Reason");
var OptionSelect = (function (_super) {
    __extends(OptionSelect, _super);
    function OptionSelect(id, type, label, options, isRequired, isHidden, description, anyData) {
        var _this = _super.call(this, id, type, label, isRequired, isHidden, description, anyData) || this;
        _this.options = options;
        return _this;
    }
    OptionSelect.buildOption = function (_a) {
        var anyData = _a.anyData, description = _a.description, id = _a.id, isRequired = _a.isRequired, isHidden = _a.isHidden, label = _a.label, options = _a.options, type = _a.type, childContracts = _a.childContracts;
        var optionsObj = options.map(function (opt) { return SelectItem_1.default.buildItem(__assign(__assign({}, opt), { childContracts: childContracts })); });
        return new OptionSelect(id, type, label, optionsObj, isRequired, isHidden, description, anyData);
    };
    OptionSelect.prototype.validate = function (value, document) {
        if (value) {
            var checked = this.options.filter(function (opt) { return opt.id === value; })[0];
            if (this.isRequired)
                if (!checked)
                    return false;
            if (checked)
                if (checked.form.options.length)
                    if (document)
                        if (!checked.form.validate(document))
                            return false;
        }
        return _super.prototype.validate.call(this, value);
    };
    OptionSelect.prototype.getRejectReason = function (value, document) {
        if (value) {
            var checked = this.options.filter(function (opt) { return opt.id === value; })[0];
            if (this.isRequired)
                if (!checked)
                    return new Reason_1.default('NC', 'not checked');
            if (checked.form.options.length) {
                if (document) {
                    var reason = checked.form.getRejectReason(document);
                    if (reason)
                        return reason;
                }
            }
        }
        return _super.prototype.getRejectReason.call(this, value);
    };
    OptionSelect.prototype.getSelected = function (value) {
        return this.options.find(function (opt) { return opt.id === value; });
    };
    OptionSelect.prototype.getJSON = function () {
        var clone = _super.prototype.getJSON.call(this);
        clone.options = this.options.map(function (opt) { return opt.getJSON(); });
        return clone;
    };
    return OptionSelect;
}(Option_1.default));
exports.default = OptionSelect;

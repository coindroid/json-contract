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
Object.defineProperty(exports, "__esModule", { value: true });
var Option_1 = require("./Option");
var Reason_1 = require("./Reason");
var OptionNumber = (function (_super) {
    __extends(OptionNumber, _super);
    function OptionNumber(id, type, label, isRequired, isHidden, description, anyData, min, max, regex) {
        var _this = _super.call(this, id, type, label, isRequired, isHidden, description, anyData) || this;
        _this.min = min;
        _this.max = max;
        _this.regex = regex;
        return _this;
    }
    OptionNumber.buildOption = function (_a) {
        var anyData = _a.anyData, description = _a.description, id = _a.id, isRequired = _a.isRequired, isHidden = _a.isHidden, label = _a.label, max = _a.max, min = _a.min, regex = _a.regex, type = _a.type;
        return new OptionNumber(id, type, label, isRequired, isHidden, description, anyData, min, max, regex);
    };
    OptionNumber.prototype.validate = function (value) {
        if (value) {
            if (typeof value !== 'number')
                return false;
            if (this.min)
                if (value < this.min)
                    return false;
            if (this.max)
                if (value > this.max)
                    return false;
            if (this.regex)
                if (!value.toString().match(this.regex))
                    return false;
        }
        return _super.prototype.validate.call(this, value);
    };
    OptionNumber.prototype.getRejectReason = function (value) {
        if (value) {
            if (typeof value !== 'number')
                return new Reason_1.default('IT', 'incorrect type');
            if (this.min)
                if (value < this.min)
                    return new Reason_1.default('STM', 'smaller than min');
            if (this.max)
                if (value > this.max)
                    return new Reason_1.default('LTM', 'larger than max');
            if (this.regex)
                if (!value.toString().match(this.regex))
                    return new Reason_1.default('RME', 'regex matching error');
        }
        return _super.prototype.getRejectReason.call(this, value);
    };
    return OptionNumber;
}(Option_1.default));
exports.default = OptionNumber;

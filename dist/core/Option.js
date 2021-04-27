"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionTypes = void 0;
var Reason_1 = require("./Reason");
var Option = (function () {
    function Option(id, type, label, isRequired, isHidden, description, anyData) {
        this.id = id;
        this.type = type;
        this.label = label;
        this.description = description;
        this.anyData = anyData;
        this.isRequired = isRequired || false;
        this.isHidden = isHidden || false;
    }
    Option.buildOption = function (_a) {
        var id = _a.id, type = _a.type, label = _a.label, isRequired = _a.isRequired, isHidden = _a.isHidden, description = _a.description, anyData = _a.anyData;
        return new Option(id, type, label, isRequired, isHidden, description, anyData);
    };
    Option.getOption = function (data) {
        switch (data.type) {
            case OptionTypes.STRING:
                return OptionString_1.default.buildOption(data);
            case OptionTypes.NUMBER:
                return OptionNumber_1.default.buildOption(data);
            case OptionTypes.SELECT:
                return OptionSelect_1.default.buildOption(data);
            case OptionTypes.CONTRACT:
                return OptionContract_1.default.buildOption(data);
        }
        return Option.buildOption(data);
    };
    Option.prototype.validate = function (value) {
        if (!this.isHidden) {
            if (this.isRequired) {
                if (!value)
                    return false;
            }
        }
        return true;
    };
    Option.prototype.getRejectReason = function (value) {
        if (!this.isHidden) {
            if (this.isRequired) {
                if (!value)
                    return new Reason_1.default('IR', 'is required');
            }
        }
        return undefined;
    };
    Option.prototype.getJSON = function () {
        return Object.assign({}, this);
    };
    return Option;
}());
exports.default = Option;
var OptionTypes;
(function (OptionTypes) {
    OptionTypes["STRING"] = "string";
    OptionTypes["NUMBER"] = "number";
    OptionTypes["SELECT"] = "select";
    OptionTypes["CONTRACT"] = "contract";
})(OptionTypes = exports.OptionTypes || (exports.OptionTypes = {}));
var OptionString_1 = require("./OptionString");
var OptionNumber_1 = require("./OptionNumber");
var OptionSelect_1 = require("./OptionSelect");
var OptionContract_1 = require("./OptionContract");

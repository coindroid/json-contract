"use strict";
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
var Form_1 = require("./Form");
var Action_1 = require("./Action");
var SelectItem = (function () {
    function SelectItem(id, label, form, action, description, anyData) {
        this.id = id;
        this.label = label;
        this.description = description;
        this.form = form;
        this.action = action;
        this.anyData = anyData;
    }
    SelectItem.buildItem = function (_a) {
        var id = _a.id, label = _a.label, description = _a.description, options = _a.options, changeProperties = _a.changeProperties, hideOptionsById = _a.hideOptionsById, modifyDeliveryTime = _a.modifyDeliveryTime, modifyPrice = _a.modifyPrice, setDiscountInPercentage = _a.setDiscountInPercentage, showOptionsById = _a.showOptionsById, setCustomProperties = _a.setCustomProperties, anyData = _a.anyData, childContracts = _a.childContracts;
        if (options)
            options = options.map(function (opt) { return Option_1.default.getOption(__assign(__assign({}, opt), { childContracts: childContracts })); });
        var formObj = new Form_1.default(options);
        var actionObj = Action_1.default.build({
            setDiscountInPercentage: setDiscountInPercentage,
            showOptionsById: showOptionsById,
            modifyPrice: modifyPrice,
            modifyDeliveryTime: modifyDeliveryTime,
            hideOptionsById: hideOptionsById,
            changeProperties: changeProperties,
            setCustomProperties: setCustomProperties
        });
        return new SelectItem(id, label, formObj, actionObj, description, anyData);
    };
    SelectItem.prototype.getJSON = function () {
        var res = {
            id: this.id,
            label: this.label,
            description: this.description,
            anyData: this.anyData
        };
        res.options = this.form.options.map(function (opt) { return opt.getJSON(); });
        res.modifyPrice = this.action.modifyPrice ? this.action.modifyPrice.getJSON() : undefined;
        res.modifyDeliveryTime = this.action.modifyDeliveryTime ? this.action.modifyDeliveryTime.getJSON() : undefined;
        res.setDiscountInPercentage = this.action.setDiscountInPercentage;
        res.hideOptionsById = this.action.hideOptionsById;
        res.showOptionsById = this.action.showOptionsById;
        res.changeProperties = this.action.changeProperties;
        res.setCustomProperties = this.action.setCustomProperties;
        return res;
    };
    return SelectItem;
}());
exports.default = SelectItem;

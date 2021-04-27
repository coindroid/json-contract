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
var Condition_1 = require("./Condition");
var ConditionDocument = (function (_super) {
    __extends(ConditionDocument, _super);
    function ConditionDocument() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConditionDocument.build = function (data) {
        return _super.buildCondition.call(this, data, this);
    };
    return ConditionDocument;
}(Condition_1.default));
exports.default = ConditionDocument;

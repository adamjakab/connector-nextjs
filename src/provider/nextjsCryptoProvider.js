"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextjsCryptoProvider = void 0;
var jssha_1 = require("jssha");
var NextjsCryptoProvider = /** @class */ (function () {
    function NextjsCryptoProvider() {
    }
    NextjsCryptoProvider.prototype.getSha256Hash = function (secretKey, stringToHash) {
        var jws = new jssha_1.default("SHA-256", "TEXT", {
            hmacKey: { value: secretKey, format: "TEXT" },
        });
        jws.update(stringToHash);
        return jws.getHash("HEX");
    };
    return NextjsCryptoProvider;
}());
exports.NextjsCryptoProvider = NextjsCryptoProvider;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connector_javascript_1 = require("@queue-it/connector-javascript");
var queue_token_1 = require("@queue-it/queue-token");
var nextjsCryptoProvider_1 = require("./nextjsCryptoProvider");
var NextjsHttpContextProvider = /** @class */ (function () {
    function NextjsHttpContextProvider(request, response, bodyString) {
        this.request = request;
        this.response = response;
        this._httpRequest = new RequestProvider(request, bodyString);
        this._httpResponse = new ResponseProvider(response);
        this._cryptoProvider = new nextjsCryptoProvider_1.NextjsCryptoProvider();
    }
    NextjsHttpContextProvider.prototype.getHttpClientProvider = function () {
        return null;
    };
    NextjsHttpContextProvider.prototype.getHttpRequest = function () {
        return this._httpRequest;
    };
    NextjsHttpContextProvider.prototype.getHttpResponse = function () {
        return this._httpResponse;
    };
    NextjsHttpContextProvider.prototype.setOutputCookie = function (setCookie) {
        this._outputCookie = setCookie;
    };
    NextjsHttpContextProvider.prototype.getOutputCookie = function () {
        return this._outputCookie;
    };
    NextjsHttpContextProvider.prototype.setEnqueueTokenProvider = function (customerId, secretKey, validityTime, clientIp, withKey) {
        this._enqueueTokenProvider = new connector_javascript_1.DefaultEnqueueTokenProvider(customerId, secretKey, validityTime, clientIp, withKey, queue_token_1.Token, queue_token_1.Payload);
    };
    NextjsHttpContextProvider.prototype.getEnqueueTokenProvider = function () {
        return this._enqueueTokenProvider || null;
    };
    NextjsHttpContextProvider.prototype.getCryptoProvider = function () {
        return this._cryptoProvider;
    };
    return NextjsHttpContextProvider;
}());
exports.default = NextjsHttpContextProvider;
var RequestProvider = /** @class */ (function () {
    function RequestProvider(req, bodyString) {
        this.req = req;
        this.bodyString = bodyString;
    }
    RequestProvider.prototype.getUserAgent = function () {
        return this.getHeader("user-agent");
    };
    RequestProvider.prototype.getHeader = function (name) {
        if (name.toLowerCase() == "x-queueit-clientip") {
            return this.getUserHostAddress();
        }
        var headerValue = this.req.headers.get(name);
        if (!headerValue)
            return "";
        return headerValue;
    };
    RequestProvider.prototype.getAbsoluteUri = function () {
        return this.req.nextUrl.toString();
    };
    RequestProvider.prototype.getUserHostAddress = function () {
        return this.req.ip;
    };
    RequestProvider.prototype.getCookieValue = function (cookieKey) {
        var _a, _b;
        /* Nextjs Version 13+ */
        return ((_b = (_a = this.req.cookies.get(cookieKey)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "THERE IS NO COOKIE AVAILABLE");
    };
    RequestProvider.prototype.getRequestBodyAsString = function () {
        return this.bodyString;
    };
    return RequestProvider;
}());
var ResponseProvider = /** @class */ (function () {
    function ResponseProvider(res) {
        this.res = res;
    }
    ResponseProvider.prototype.setCookie = function (cookieName, cookieValue, domain, expiration, httpOnly, isSecure) {
        // expiration is in secs, but Date needs it in milisecs
        var expirationDate = new Date(expiration * 1000);
        /* Nextjs Version 13+ */
        this.res.cookies.set({
            name: cookieName,
            value: cookieValue,
            domain: domain,
            path: "/",
            expires: expirationDate,
            secure: isSecure,
            sameSite: false,
            httpOnly: httpOnly,
        });
    };
    return ResponseProvider;
}());

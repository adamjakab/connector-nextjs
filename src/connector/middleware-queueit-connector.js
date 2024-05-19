"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var connector_javascript_1 = require("@queue-it/connector-javascript");
var server_1 = require("next/server");
var NextjsHttpContextProvider_1 = require("../provider/NextjsHttpContextProvider");
//@FIXME: How do we get config?
var getInlineIntegrationConfigString = function () { return __awaiter(void 0, void 0, void 0, function () {
    var integrationsConfig;
    return __generator(this, function (_a) {
        integrationsConfig = {};
        return [2 /*return*/, JSON.stringify(integrationsConfig)];
    });
}); };
/** QUEUE-IT SECRETS & SETTINGS FROM .env */
var QueueIT_Settings = {
    customerId: process.env.QUEUEIT_CUSTOMER_ID,
    secretKey: process.env.QUEUEIT_SECRET_KEY,
    apiKey: process.env.QUEUEIT_API_KEY,
    isEnqueueTokenEnabled: parseInt(process.env.QUEUEIT_ENQT_ENABLED) === 1,
    enqueueTokenValidityTime: parseInt(process.env.QUEUEIT_ENQT_VALIDITY_TIME),
    isEnqueueTokenKeyEnabled: parseInt(process.env.QUEUEIT_ENQT_KEY_ENABLED) === 1,
    isRequestBodyCheckEnabled: parseInt(process.env.QUEUEIT_REQ_BODY_ENABLED) === 1,
};
function HandleNextjsRequest(request, response) {
    return __awaiter(this, void 0, void 0, function () {
        var integrationsConfigString, requestBodyString, _a, httpContextProvider, requestUrl, queueitToken, requestUrlWithoutToken, validationResult, headerName, redirectResponse, responseHeaders, res, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, getInlineIntegrationConfigString()];
                case 1:
                    integrationsConfigString = _b.sent();
                    if (!QueueIT_Settings.isRequestBodyCheckEnabled) return [3 /*break*/, 3];
                    return [4 /*yield*/, request.text()];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = "";
                    _b.label = 4;
                case 4:
                    requestBodyString = _a;
                    httpContextProvider = new NextjsHttpContextProvider_1.default(request, response, requestBodyString);
                    if (QueueIT_Settings.isEnqueueTokenEnabled) {
                        httpContextProvider.setEnqueueTokenProvider(QueueIT_Settings.customerId, QueueIT_Settings.secretKey, QueueIT_Settings.enqueueTokenValidityTime, request.ip || "", QueueIT_Settings.isEnqueueTokenKeyEnabled);
                    }
                    requestUrl = httpContextProvider._httpRequest.getAbsoluteUri();
                    queueitToken = request.nextUrl.searchParams.get(connector_javascript_1.KnownUser.QueueITTokenKey);
                    request.nextUrl.searchParams.delete(connector_javascript_1.KnownUser.QueueITTokenKey);
                    requestUrlWithoutToken = httpContextProvider._httpRequest.getAbsoluteUri();
                    return [4 /*yield*/, connector_javascript_1.KnownUser.validateRequestByIntegrationConfig(requestUrlWithoutToken, queueitToken, integrationsConfigString, QueueIT_Settings.customerId, QueueIT_Settings.secretKey, httpContextProvider, QueueIT_Settings.apiKey)];
                case 5:
                    validationResult = _b.sent();
                    if (validationResult.doRedirect()) {
                        // Adding no cache headers to prevent browsers to cache requests
                        response.headers.append("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
                        response.headers.append("Pragma", "no-cache");
                        response.headers.append("Expires", "Fri, 01 Jan 1990 00:00:00 GMT");
                        if (validationResult.isAjaxResult) {
                            headerName = validationResult.getAjaxQueueRedirectHeaderKey();
                            response.headers.append(headerName, validationResult.getAjaxRedirectUrl());
                            response.headers.append("Access-Control-Expose-Headers", headerName);
                            // Render page
                            return [2 /*return*/, response];
                        }
                        else {
                            redirectResponse = server_1.NextResponse.redirect(validationResult.redirectUrl);
                            redirectResponse.headers.append("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
                            redirectResponse.headers.append("Pragma", "no-cache");
                            redirectResponse.headers.append("Expires", "Fri, 01 Jan 1990 00:00:00 GMT");
                            return [2 /*return*/, redirectResponse];
                        }
                    }
                    else {
                        // Request can continue - we remove queueittoken form querystring parameter to avoid sharing of user specific token
                        if (requestUrl !== requestUrlWithoutToken &&
                            validationResult.actionType === "Queue") {
                            responseHeaders = new Headers(response.headers);
                            responseHeaders.set("location", requestUrlWithoutToken);
                            res = server_1.NextResponse.next({
                                headers: responseHeaders,
                                status: 302,
                            });
                            return [2 /*return*/, res];
                        }
                        else {
                            // No change - Continue
                            return [2 /*return*/, response];
                        }
                    }
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _b.sent();
                    // There was an error validating the request
                    // Use your own logging framework to log the Exception
                    console.log("Queue-it connector error:", e_1);
                    // In any case let the user continue
                    return [2 /*return*/, server_1.NextResponse.next()];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.default = HandleNextjsRequest;

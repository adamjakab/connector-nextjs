import { IConnectorContextProvider, ICryptoProvider, IEnqueueTokenProvider, IHttpClientProvider, IHttpRequest, IHttpResponse } from "@queue-it/connector-javascript";
import { NextRequest, NextResponse } from "next/server";
export default class NextjsHttpContextProvider implements IConnectorContextProvider {
    request: NextRequest;
    response: NextResponse;
    _httpRequest: IHttpRequest;
    _httpResponse: IHttpResponse;
    _outputCookie: string | undefined;
    _enqueueTokenProvider: IEnqueueTokenProvider | undefined;
    _cryptoProvider: ICryptoProvider;
    isError: boolean | undefined;
    constructor(request: NextRequest, response: NextResponse, bodyString: string);
    getHttpClientProvider(): IHttpClientProvider | null;
    getHttpRequest(): IHttpRequest;
    getHttpResponse(): IHttpResponse;
    setOutputCookie(setCookie: string): void;
    getOutputCookie(): string | undefined;
    setEnqueueTokenProvider(customerId: string, secretKey: string, validityTime: number, clientIp: string, withKey: boolean): void;
    getEnqueueTokenProvider(): IEnqueueTokenProvider | null;
    getCryptoProvider(): ICryptoProvider;
}

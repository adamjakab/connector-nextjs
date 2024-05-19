import { KnownUser } from "@queue-it/connector-javascript";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import NextjsHttpContextProvider from "../provider/NextjsHttpContextProvider";
import type ConnectorSettings from "../type/connector-settings";

//@FIXME: How do we get config?
const getInlineIntegrationConfigString = async () => {
  const integrationsConfig = {};
  return JSON.stringify(integrationsConfig);
};

/** QUEUE-IT SECRETS & SETTINGS FROM .env */
const QueueIT_Settings: ConnectorSettings = {
  customerId: process.env.QUEUEIT_CUSTOMER_ID as string,
  secretKey: process.env.QUEUEIT_SECRET_KEY as string,
  apiKey: process.env.QUEUEIT_API_KEY as string,
  isEnqueueTokenEnabled:
    parseInt(process.env.QUEUEIT_ENQT_ENABLED as string) === 1,
  enqueueTokenValidityTime: parseInt(
    process.env.QUEUEIT_ENQT_VALIDITY_TIME as string
  ),
  isEnqueueTokenKeyEnabled:
    parseInt(process.env.QUEUEIT_ENQT_KEY_ENABLED as string) === 1,

  isRequestBodyCheckEnabled:
    parseInt(process.env.QUEUEIT_REQ_BODY_ENABLED as string) === 1,
};

async function HandleNextjsRequest(
  request: NextRequest,
  response: NextResponse
) {
  try {
    var integrationsConfigString = await getInlineIntegrationConfigString();

    const requestBodyString: string = QueueIT_Settings.isRequestBodyCheckEnabled
      ? await request.text()
      : "";

    var httpContextProvider = new NextjsHttpContextProvider(
      request,
      response,
      requestBodyString
    );

    if (QueueIT_Settings.isEnqueueTokenEnabled) {
      httpContextProvider.setEnqueueTokenProvider(
        QueueIT_Settings.customerId,
        QueueIT_Settings.secretKey,
        QueueIT_Settings.enqueueTokenValidityTime,
        request.ip || "",
        QueueIT_Settings.isEnqueueTokenKeyEnabled
      );
    }

    var requestUrl = httpContextProvider._httpRequest.getAbsoluteUri();
    const queueitToken = request.nextUrl.searchParams.get(
      KnownUser.QueueITTokenKey
    ) as string;
    request.nextUrl.searchParams.delete(KnownUser.QueueITTokenKey);
    var requestUrlWithoutToken =
      httpContextProvider._httpRequest.getAbsoluteUri();
    // The requestUrlWithoutToken is used to match Triggers and as the Target url (where to return the users to).
    // It is therefor important that this is exactly the url of the users browsers. So, if your webserver is
    // behind e.g. a load balancer that modifies the host name or port, reformat requestUrlWithoutToken before proceeding.

    var validationResult = await KnownUser.validateRequestByIntegrationConfig(
      requestUrlWithoutToken,
      queueitToken,
      integrationsConfigString,
      QueueIT_Settings.customerId,
      QueueIT_Settings.secretKey,
      httpContextProvider,
      QueueIT_Settings.apiKey
    );

    if (validationResult.doRedirect()) {
      // Adding no cache headers to prevent browsers to cache requests
      response.headers.append(
        "Cache-Control",
        "no-cache, no-store, must-revalidate, max-age=0"
      );
      response.headers.append("Pragma", "no-cache");
      response.headers.append("Expires", "Fri, 01 Jan 1990 00:00:00 GMT");

      if (validationResult.isAjaxResult) {
        // In case of ajax call send the user to the queue by sending a custom queue-it header and redirecting user to queue from javascript
        var headerName = validationResult.getAjaxQueueRedirectHeaderKey();
        response.headers.append(
          headerName,
          validationResult.getAjaxRedirectUrl()
        );
        response.headers.append("Access-Control-Expose-Headers", headerName);

        // Render page
        return response;
      } else {
        // Send the user to the queue - either because hash was missing or because is was invalid
        const redirectResponse = NextResponse.redirect(
          validationResult.redirectUrl
        );
        redirectResponse.headers.append(
          "Cache-Control",
          "no-cache, no-store, must-revalidate, max-age=0"
        );
        redirectResponse.headers.append("Pragma", "no-cache");
        redirectResponse.headers.append(
          "Expires",
          "Fri, 01 Jan 1990 00:00:00 GMT"
        );

        return redirectResponse;
      }
    } else {
      // Request can continue - we remove queueittoken form querystring parameter to avoid sharing of user specific token
      if (
        requestUrl !== requestUrlWithoutToken &&
        validationResult.actionType === "Queue"
      ) {
        var responseHeaders = new Headers(response.headers);
        responseHeaders.set("location", requestUrlWithoutToken);

        const res = NextResponse.next({
          headers: responseHeaders,
          status: 302,
        });

        return res;
      } else {
        // No change - Continue
        return response;
      }
    }
  } catch (e) {
    // There was an error validating the request
    // Use your own logging framework to log the Exception
    console.log("Queue-it connector error:", e);

    // In any case let the user continue
    return NextResponse.next();
  }
}

export default HandleNextjsRequest;

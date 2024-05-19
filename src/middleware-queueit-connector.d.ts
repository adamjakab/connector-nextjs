import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
declare function HandleNextjsRequest(request: NextRequest, response: NextResponse): Promise<NextResponse<unknown>>;
export default HandleNextjsRequest;

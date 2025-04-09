export class ApiRequest {
  async request(
    endpoint: string,
    method: string,
    body?: object | ArrayBuffer,
    headers?: Headers
  ): Promise<object | string> {
    const url = "/api/" + endpoint;
    const request: RequestInit = {
      method: method,
      headers: headers || new Headers({
        "Content-type": "application/json",
      }),
    };

    if (body) {
      if (headers?.get("Content-type")?.includes("image")) {
        request.body = body as ArrayBuffer;
      } else {
        request.body = JSON.stringify(body as object);
      }
    }
    try {
      const resp = await fetch(url, request);
      if (resp.ok) {
        const contentType = resp.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const response = await resp.json();
          return response;
        } else {
          const response = await resp.text();
          return response;
        }
      } else {
        const error = await resp.text();
        throw new Error(error);
      }
    } catch (err) {
      throw new Error("Request failed:\n" + (err as Error).message);
    }
  }
}

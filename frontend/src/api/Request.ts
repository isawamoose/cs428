export class ApiRequest {
  async request(
    endpoint: string,
    method: string,
    body?: object
  ): Promise<object | string> {
    const url = "/api/" + endpoint;
    const request: RequestInit = {
      method: method,
      headers: new Headers({
        "Content-type": "application/json",
      }),
    };

    if (body) {
      request.body = JSON.stringify(body);
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
        const error = await resp.json();
        throw new Error(error.errorMessage);
      }
    } catch (err) {
      throw new Error("Request failed:\n" + (err as Error).message);
    }
  }
}

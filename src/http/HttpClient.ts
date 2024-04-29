/**
 * Options for @see HttpClient.
 */
export interface HttpClientOptions {
  /**
   * Prefix (typical root URL). Used so that each method only have to specify path.
   */
  urlPrefix?: string;

  /**
   * Default content type to use if none is specified in the request method.
   */
  contentType?: string;
}

/**
 * A HTTP client implementation built on top of fetch().
 */
export class HttpClient {
  /**
   *
   * @param urlPrefix Can be used to specify the URL early (to allow only path to be used in all methods).
   * @param defaultContentType Content type to use if not specified in the constructor
   */
  constructor(private options?: HttpClientOptions) {}

  /**
   *
   * @param url URL to make the request against.
   * @param options Request options.
   * @returns Response from server.
   */
  async request(url: string, options?: RequestInit): Promise<HttpResponse> {
    const token = localStorage.getItem("jwt");
    if (token && options) {
      const headers = options?.headers
        ? new Headers(options.headers)
        : new Headers();
      headers.set("Authorization", "Bearer " + token);
    }

    if (this.options.urlPrefix) {
      url = this.options.urlPrefix + url;
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      return {
        statusCode: response.status,
        statusReason: response.statusText,
        success: false,
        contentType: response.headers.get("content-type"),
        body: await response.text(),
        charset: response.headers.get("charset"),

        as() {
          throw new Error("No response received");
        },
      };
    }

    let body: unknown | null = null;
    if (response.status !== 204) {
      body = await response.json();
    }

    return {
      success: true,
      statusCode: response.status,
      statusReason: response.statusText,
      contentType: response.headers.get("content-type"),
      body: body,
      charset: response.headers.get("charset"),
      as<T>() {
        return <T>body;
      },
    };
  }

  /**
   * GET a resource.
   * @param url URL to get resource from.
   * @param queryString Optional query string.
   * @param options Request options.
   * @returns HTTP response.
   */
  async get(
    url: string,
    queryString?: Record<string, string>,
    options?: RequestInit
  ): Promise<HttpResponse> {
    if (!options) {
      options = {
        method: "GET",
        headers: {
          "content-type": this.options.contentType ?? "application/json",
        },
      };
    } else {
      options.method = "GET";
    }

    if (queryString) {
      let prefix = "&";
      if (url.indexOf("?") === -1) {
        prefix = "?";
      }

      for (const key in queryString) {
        const value = queryString[key];
        url += `${prefix}${key}=${value}`;
        prefix = "&";
      }
    }

    return this.request(url, options);
  }

  /**
   * POST a resource.
   * @param url URL to post to.
   * @param data Data to post.
   * @param options Request options.
   * @returns HTTP response.
   */
  async post(
    url: string,
    data: BodyInit,
    options?: RequestInit
  ): Promise<HttpResponse> {
    if (!options) {
      options = {
        method: "POST",
        body: data,
        headers: {
          "content-type": this.options.contentType ?? "application/json",
        },
      };
    } else {
      options.method = "POST";
      options.body = data;
    }

    return this.request(url, options);
  }

  /**
   * DELETE a resource.
   * @param url url to resource.
   * @param options request options.
   * @returns response.
   */
  async put(
    url: string,
    data: BodyInit,
    options?: RequestInit
  ): Promise<HttpResponse> {
    if (!options) {
      options = {
        method: "PUT",
        headers: {
          "content-type": this.options.contentType ?? "application/json",
        },
      };
    } else {
      options.method = "DELETE";
    }

    return this.request(url, options);
  }

  /**
   * DELETE a resource.
   * @param url url to resource.
   * @param options request options.
   * @returns response.
   */
  async delete(url: string, options?: RequestInit): Promise<HttpResponse> {
    if (!options) {
      options = {
        method: "DELETE",
        headers: {
          "content-type": this.options.contentType ?? "application/json",
        },
      };
    } else {
      options.method = "DELETE";
    }

    return this.request(url, options);
  }
}

/**
 * Response for request methods in @see HttpClient
 */
export interface HttpResponse {

    /**
     * Http status code.
     */
  statusCode: number;

  /**
   * Reason to why the status code was used.
   */
  statusReason: string;

  /**
   * this is a 2x response.
   */
  success: boolean;

  /**
   * Content type of response body.
   */
  contentType: string | null;

  /**
   * Body returned.
   * 
   * Body has been read and deserialized from json (if the request content type was 'application/json' which is per default is).
   */
  body: unknown;

  /**
   * Charset used in body.
   */
  charset: string | null;

  /**
   * Cast body to a type.
   */
  as<T>(): T;
}

/**
 * Error thrown when a request fails.
 */
export class HttpError extends Error {
  message: string;
  response: HttpResponse;

  constructor(response: HttpResponse) {
    super(response.statusReason);
    this.message = response.statusReason;
    this.response = response;
  }
}

/**
 * HTTP request options.
 */
export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  mode?: "cors" | "no-cors" | "*cors" | "same-origin";
  cache:
    | "default"
    | "no-store"
    | "reload"
    | "no-cache"
    | "force-cache"
    | "only-if-cached";
  credentials: "omit" | "same-origin" | "include";
  headers: Map<string, string>;
  redirect: "follow" | "manual" | "*follow" | "error";
  referrerPolicy:
    | "no-referrer"
    | "*no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";

    /**
     * Will be serialized if the content type is json (and the body is an object).
     */
  body: unknown;
}

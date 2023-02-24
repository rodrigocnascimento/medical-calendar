/**
 * Http Cliente Params
 *
 * @export
 * @interface IHttpRequestOption
 */
export interface IHttpRequestOption {
  readonly url: string;
  readonly method?: string;
  readonly headers?: any;
  readonly body?: any;
}

/**
 *
 * Http client interface
 * @export
 * @interface IHttp
 */
export interface IHttp {
  request(requestOption: IHttpRequestOption): Promise<any>;
  setBearerTokenHeader(token: any): any;
}

/**
 *
 * Don't have much to say, but it's a basic class that implements
 * the fetch Nodejs builtin  lib
 * @class Http
 * @implements {IHttp}
 */
class Http implements IHttp {
  private bearerToken: string = "";

  public setBearerTokenHeader(token: any) {
    this.bearerToken = `Bearer ${token}`;
  }

  /**
   * Trigger the request to the server
   *
   * @param {IHttpRequestOption} requestOption http client request options
   * @return {*}  {Promise<any>}
   * @memberof Http
   */
  async request(requestOption: IHttpRequestOption): Promise<any> {
    let option: RequestInit = {
      method: "GET",
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    };

    if (requestOption.method) {
      option = {
        ...option,
        method: requestOption.method,
      };
    }

    if (this?.bearerToken) {
      option = {
        ...option,
        headers: {
          ...option.headers,
          Authorization: this?.bearerToken,
        },
      };
    }

    option.headers = new Headers(option.headers);

    if (requestOption?.body && !["GET", "HEAD"].includes(option.method as string)) {
      option = {
        ...option,
        body: JSON.stringify(requestOption?.body),
      };
    }

    return fetch(requestOption.url, option);
  }
}

export default Http;

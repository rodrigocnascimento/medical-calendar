import { IHttp } from "infrastructure/adapter/http";
import { ITokenStorage } from "infrastructure/adapter/storage/token";
import { AuthCredentials, JWTAccessToken } from "modules/auth";

export interface IAuthRepository {
  checkCredentials({
    username,
    password,
  }: AuthCredentials): Promise<JWTAccessToken>;
}

export class AuthRepository implements IAuthRepository {
  /**
   * the serverURL
   *
   * @type {string}
   * @memberof AuthRepository
   */
  readonly baseUrl: string = "";

  /**
   * http client
   *
   * @type {IHttp}
   * @memberof AuthRepository
   */
  readonly http: IHttp;

  /**
   * Creates an instance of AuthRepository.
   * @param {string} baseUrl server url
   * @param {IHttp} http http client
   * @memberof AuthRepository
   */
  constructor(baseUrl: string, http: IHttp, userToken: ITokenStorage) {
    this.baseUrl = baseUrl + "/auth/login";
    this.http = http;
    this.http.setBearerTokenHeader(userToken.getRawToken());
  }

  async checkCredentials({
    username,
    password,
  }: AuthCredentials): Promise<JWTAccessToken> {
    const response = await this.http.request({
      method: "POST",
      url: this.baseUrl,
      body: { username, password },
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(jsonResponse);
      throw new Error("Erro ao realizar o login!", {
        cause: jsonResponse.message,
      });
    }

    return jsonResponse;
  }
}

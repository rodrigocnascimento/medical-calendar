import { IHttp } from "infrastructure/adapter/http";
import { ITokenStorage } from "infrastructure/adapter/storage/token";
import { AuthCredentials, JWTAccessToken } from "modules/auth";

export interface IAuthRepository {
  checkCredentials({
    username,
    password,
  }: AuthCredentials): Promise<JWTAccessToken>;
  repoUrl: string;
}

export class AuthRepository implements IAuthRepository {
  /**
   * the serverURL
   *
   * @type {string}
   * @memberof AuthRepository
   */
  private readonly _repoUrl: URL;

  /**
   * http client
   *
   * @type {IHttp}
   * @memberof AuthRepository
   */
  private readonly http: IHttp;

  /**
   * Creates an instance of AuthRepository.
   * @param {string} baseUrl server url
   * @param {IHttp} http http client
   * @memberof AuthRepository
   */
  constructor(baseUrl: string, http: IHttp, userToken: ITokenStorage) {
    this._repoUrl = new URL("/auth/login", baseUrl);
    this.http = http;
    this.http.setBearerTokenHeader(userToken.getRawToken());
  }

  /**
   * The repository URLK
   *
   * @readonly
   * @type {string}
   * @memberof AuthRepository
   */
  get repoUrl(): string {
    return this._repoUrl.toString();
  }

  async checkCredentials({
    username,
    password,
  }: AuthCredentials): Promise<JWTAccessToken> {
    const response = await this.http.request({
      method: "POST",
      url: this.repoUrl,
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

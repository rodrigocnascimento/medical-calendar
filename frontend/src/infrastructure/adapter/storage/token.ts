import { JWTUserToken } from "modules/auth";
import Storage from "./index";

export interface ITokenStorage {
  getRawToken(name?: string): string;
  get(name?: string): JWTUserToken | undefined;
  set(value: string, name?: string): void;
  remove(name?: string): void;
}

export default class TokenStorage {
  /**
   * The store name, the ideintifier key of the token. Default is "user".
   *
   * @private
   * @type {string}
   * @memberof TokenStorage
   */
  private name: string;

  /**
   * The API to manage the store
   *
   * @private
   * @type {Storage}
   * @memberof TokenStorage
   */
  private storage: Storage;

  constructor(storage: Storage, tokenStorage?: string) {
    this.name = tokenStorage || "user";
    this.storage = storage;
  }

  /**
   * Returns the token in raw state
   *
   * @param {string} [name=user] name storage name where the token is stored. Default is "user".
   * @return {string} the accessToken property request payload
   * @memberof TokenStorage
   */
  public getRawToken(name?: string): string {
    return this.storage.get(name ?? this.name);
  }

  /**
   * The accessToken payload decoded
   *
   * @param {string} [name=user] name of the store. Default is "user".
   * @return {*}
   * @memberof TokenStorage
   */
  public get(name?: string): JWTUserToken | undefined {
    const tokenStore = this.storage.get(name ?? this.name);

    if (!tokenStore) return undefined;

    return this.parseJwt(tokenStore);
  }

  /**
   * Set a value to a store. This method will stringify the
   * value to allow store on localStorage
   *
   * @param {unknown} value
   * @param {string} [name=user] name of the storage. Default is "user".
   * @memberof TokenStorage
   */
  public set(value: string, name?: string): void {
    this.storage.set(name ?? this.name, value);
  }

  /**
   * Totally remove the store.
   *
   * @param {string} [name=user] the store. Default is user.
   * @memberof TokenStorage
   */
  public remove(name?: string): void {
    this.storage.remove(name ?? this.name);
  }

  /**
   * Validate a JWT token verifying if it's expired.
   * @param {JWTUserToken} decodedToken the JWT parsed
   * @returns
   */
  private tokenIsExpired(decodedToken: JWTUserToken): JWTUserToken {
    const { exp } = decodedToken;

    const expired = Date.now() >= exp * 1000;

    decodedToken.expired = expired;

    return decodedToken;
  }

  /**
   * Will parse the Jwt content and return the corresponding object.
   *
   * @param token the JWT token
   * @returns Parsed JWT
   */
  private parseJwt(token: string): JWTUserToken {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      // TODO TAKE CARE OF THIS!!! THIS IS EVIL. is it?
      window
        .atob(base64)
        .split("")
        .map(function (char: string) {
          return "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    const decodedPayload = this.tokenIsExpired(JSON.parse(jsonPayload));

    return decodedPayload;
  }
}

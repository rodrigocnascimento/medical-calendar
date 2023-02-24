import { IHttp } from "../../infrastructure/adapter/http";
import TokenStorage from "../../infrastructure/adapter/storage/token";
import {
  CreateUserDTO,
  UserDTO,
  UpdateUserDTO,
  FilterUserDTO,
} from "./user.dto";

export class UserRepository {
  /**
   * the serverURL
   *
   * @type {string}
   * @memberof UserRepository
   */
  readonly baseUrl: string = "";

  /**
   * http client
   *
   * @type {IHttp}
   * @memberof UserRepository
   */
  readonly http: IHttp;

  /**
   * Creates an instance of UserRepository.
   * @param {string} baseUrl server url
   * @param {IHttp} http http client
   * @memberof UserRepository
   */
  constructor(baseUrl: string, http: IHttp, userToken: TokenStorage) {
    this.baseUrl = baseUrl + "/users";
    this.http = http;
    this.http.setBearerTokenHeader(userToken.getRawToken());
  }

  /**
   * create a pet
   *
   * @param {CreateUserDTO} user data
   * @return {*}  {Promise<boolean>} returns true when the operation was succeded
   * @memberof UserRepository
   */
  async createUser(user: CreateUserDTO): Promise<UserDTO> {
    const response = await this.http.request({
      method: "POST",
      url: this.baseUrl,
      body: user,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(jsonResponse));
    }

    return jsonResponse;
  }

  /**
   * The same as create but is as PATCH
   * @param user user UpdateUserDTO
   * @returns
   */
  async editUser(userId: string, user: UpdateUserDTO): Promise<UserDTO> {
    const response = await this.http.request({
      method: "PATCH",
      url: this.baseUrl + `/${userId}`,
      body: user,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(jsonResponse));
    }

    return jsonResponse;
  }

  /**
   * Remove the user
   * @param id user id
   * @returns
   */
  async removeUser(id: string): Promise<UserDTO> {
    const response = await this.http.request({
      method: "DELETE",
      url: this.baseUrl + `/${id}`,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(jsonResponse));
    }

    return jsonResponse;
  }

  /**
   * Return all the users based on filter
   * @param {FilterUserDTO} queryFilter filter to query the user
   * @returns 
   */
  async getAll(queryFilter: FilterUserDTO): Promise<UserDTO[]> {
    const queryUrl = new URL(this.baseUrl);

    if (queryFilter) {
      for (const [name, value] of Object.entries(queryFilter)) {
        queryUrl.searchParams.set(name, value as string);
      }
    }

    const response = await this.http.request({
      url: queryUrl.toString(),
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(jsonResponse));
    }

    return jsonResponse;
  }

  /**
   * Return the selected user
   * @param id User id
   * @returns
   */
  async getById(id: string): Promise<UserDTO> {
    const response = await this.http.request({
      url: this.baseUrl + `/${id}`,
    });

    return await response.json();
  }
}

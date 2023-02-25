import { IHttp } from "../../infrastructure/adapter/http";
import TokenStorage from "../../infrastructure/adapter/storage/token";
import { CreateUserDTO, UserDTO, UpdateUserDTO, FilterUserDTO } from "./user.interfaces";

export interface IUserRepository {
  createUser(user: CreateUserDTO): Promise<UserDTO>;
  editUser(user: UpdateUserDTO): Promise<UserDTO>;
  removeUser(id: string): Promise<UserDTO>;
  getAll(queryFilter?: FilterUserDTO): Promise<UserDTO[]>;
  getById(id: string): Promise<UserDTO>;
}

export class UserRepository implements IUserRepository {
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
    delete user.id;
    const response = await this.http.request({
      method: "POST",
      url: this.baseUrl,
      body: user,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(jsonResponse);
      throw new Error("Erro ao criar o usuário!", {
        cause: jsonResponse.message,
      });
    }

    return jsonResponse;
  }

  /**
   * The same as create but is as PATCH
   * @param user user UpdateUserDTO
   * @returns
   */
  async editUser(user: UpdateUserDTO): Promise<UserDTO> {
    const response = await this.http.request({
      method: "PATCH",
      url: this.baseUrl + `/${user.id}`,
      body: user,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(jsonResponse);
      throw new Error("Erro ao editar o usuário!", {
        cause: jsonResponse.message,
      });
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
      console.error(jsonResponse);
      throw new Error("Erro ao remove o usuário!", {
        cause: jsonResponse.message,
      });
    }

    return jsonResponse;
  }

  /**
   * Return all the users based on filter
   * @param {FilterUserDTO} queryFilter filter to query the user
   * @returns
   */
  async getAll(queryFilter?: FilterUserDTO): Promise<UserDTO[]> {
    const queryUrl = new URL(this.baseUrl);

    if (queryFilter) {
      Object.entries(queryFilter).forEach(([key, value]) => {
        queryUrl.searchParams.set(key, value as string);
      });
    }

    const response = await this.http.request({
      url: queryUrl.toString(),
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(jsonResponse);
      throw new Error("Erro ao buscar o usuário!", {
        cause: jsonResponse.message,
      });
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

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(jsonResponse);
      throw new Error("Erro ao buscar o usuário!", {
        cause: jsonResponse.message,
      });
    }

    return jsonResponse;
  }
}

import { IHttp } from "infrastructure/adapter/http";
import { ITokenStorage } from "infrastructure/adapter/storage/token";
import { CreateUserDTO, UserDTO, UpdateUserDTO, FilterUserDTO } from "./index";

export interface IUserRepository {
  create(user: CreateUserDTO): Promise<UserDTO>;
  edit(user: UpdateUserDTO): Promise<UserDTO>;
  remove(id: string): Promise<UserDTO>;
  getAll(queryFilter?: FilterUserDTO): Promise<UserDTO[]>;
  getById(id: string): Promise<UserDTO>;
  repoUrl: string;
  setSearchParams(searchParams: FilterUserDTO): void;
}

export class UserRepository implements IUserRepository {
  /**
   * the serverURL
   *
   * @type {string}
   * @memberof UserRepository
   */
  private readonly _repoUrl: URL;

  /**
   * http client
   *
   * @type {IHttp}
   * @memberof UserRepository
   */
  private readonly http: IHttp;

  /**
   * Creates an instance of UserRepository.
   * @param {string} baseUrl server url
   * @param {IHttp} http http client
   * @memberof UserRepository
   */
  constructor(baseUrl: string, http: IHttp, userToken: ITokenStorage) {
    this._repoUrl = new URL("/users", baseUrl);
    this.http = http;
    this.http.setBearerTokenHeader(userToken.getRawToken());
  }

  /**
   * The repository URLK
   *
   * @readonly
   * @type {string}
   * @memberof UserRepository
   */
  get repoUrl(): string {
    return this._repoUrl.toString();
  }

  /**
   * Set the url search params
   *
   * @private
   * @param {FilterUserDTO} searchParams the search params
   * @memberof UserRepository
   */
  setSearchParams(searchParams: FilterUserDTO) {
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        this._repoUrl.searchParams.set(key, value as string);
      });
    }
  }

  /**
   * create a pet
   *
   * @param {CreateUserDTO} user data
   * @return {*}  {Promise<boolean>} returns true when the operation was succeded
   * @memberof UserRepository
   */
  async create(user: CreateUserDTO): Promise<UserDTO> {
    const response = await this.http.request({
      method: "POST",
      url: this.repoUrl,
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
  async edit(user: UpdateUserDTO): Promise<UserDTO> {
    const response = await this.http.request({
      method: "PATCH",
      url: this.repoUrl.concat(`/${user.id}`),
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
  async remove(id: string): Promise<UserDTO> {
    const response = await this.http.request({
      method: "DELETE",
      url: this.repoUrl.concat(`/${id}`),
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
  async getAll(queryFilter: FilterUserDTO): Promise<UserDTO[]> {
    this.setSearchParams(queryFilter);

    const response = await this.http.request({
      url: this.repoUrl,
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
      url: this.repoUrl.concat(`/${id}`),
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

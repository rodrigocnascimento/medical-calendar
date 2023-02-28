import { IHttp } from "infrastructure/adapter/http";
import { ITokenStorage } from "infrastructure/adapter/storage/token";
import {
  MedicalRegistriesDTO,
  CreateMedicalRegistriesDTO,
  UpdateMedicalRegistriesDTO,
  FilterMedicalRegistriesDTO,
} from "./index";

export interface IMedicalRegistryRepository {
  create(registry: CreateMedicalRegistriesDTO): Promise<MedicalRegistriesDTO>;
  edit(
    medicalRegistryId: string,
    medicalRegistry: UpdateMedicalRegistriesDTO
  ): Promise<MedicalRegistriesDTO>;
  remove(id: string): Promise<MedicalRegistriesDTO>;
  getById(id: string): Promise<MedicalRegistriesDTO>;
  repoUrl: string;
  setSearchParams(searchParams: FilterMedicalRegistriesDTO): void;
}

export class MedicalRegistryRepository {
  /**
   * the serverURL
   *
   * @type {string}
   * @memberof MedicalRegistriesRepository
   */
  private readonly _repoUrl: URL;

  /**
   * http client
   *
   * @type {IHttp}
   * @memberof MedicalRegistriesRepository
   */
  private readonly http: IHttp;

  /**
   * Creates an instance of MedicalRegistriesRepository.
   * @param {string} repoUrl server url
   * @param {IHttp} http http client
   * @memberof MedicalRegistriesRepository
   */
  constructor(baseUrl: string, http: IHttp, userToken: ITokenStorage) {
    this._repoUrl = new URL("/medical-registries", baseUrl);
    this.http = http;
    this.http.setBearerTokenHeader(userToken.getRawToken());
  }

  /**
   * The repository URLK
   *
   * @readonly
   * @type {string}
   * @memberof MedicalRegistriesRepository
   */
  get repoUrl(): string {
    return this._repoUrl.toString();
  }

  /**
   * Set the url search params
   *
   * @private
   * @param {FilterMedicalRegistriesDTO} searchParams the search params
   * @memberof MedicalRegistriesRepository
   */
  setSearchParams(searchParams: FilterMedicalRegistriesDTO) {
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        this._repoUrl.searchParams.set(key, value as string);
      });
    }
  }
  /**
   * Create an appoitnment
   *
   * @param {CreateMedicalRegistriesDTO} registry medical registry data
   * @return {*}  {Promise<boolean>} returns true when the operation was succeded
   * @memberof MedicalRegistriesRepository
   */
  async create(
    registry: CreateMedicalRegistriesDTO
  ): Promise<MedicalRegistriesDTO> {
    const response = await this.http.request({
      method: "POST",
      url: this.repoUrl,
      body: registry,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(jsonResponse));
    }

    return jsonResponse;
  }

  /**
   *  Update an appoitnment
   * @param appointmentId appoitnment id
   * @param appointment appoitnment data
   * @returns
   */
  async edit(
    medicalRegistryId: string,
    medicalRegistry: UpdateMedicalRegistriesDTO
  ): Promise<MedicalRegistriesDTO> {
    const response = await this.http.request({
      method: "PATCH",
      url: this.repoUrl.concat(`/${medicalRegistryId}`),
      body: medicalRegistry,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(jsonResponse));
    }

    return jsonResponse;
  }

  /**
   * Remove the appoitnment
   * @param id appoitnment id
   * @returns
   */
  async remove(id: string): Promise<MedicalRegistriesDTO> {
    const response = await this.http.request({
      method: "DELETE",
      url: this.repoUrl.concat(`/${id}`),
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(jsonResponse));
    }

    return jsonResponse;
  }

  /**
   * Return the selected appoitnment
   * @param id Appoitnment id
   * @returns
   */
  async getById(id: string): Promise<MedicalRegistriesDTO> {
    const response = await this.http.request({
      url: this.repoUrl.concat(`/${id}`),
    });

    return await response.json();
  }
}

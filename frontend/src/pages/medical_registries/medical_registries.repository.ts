import { IHttp } from "../../infrastructure/adapter/http";
import { ITokenStorage } from "../../infrastructure/adapter/storage/token";
import {
  MedicallRegistriesDTO,
  CreateMedicallRegistriesDTO,
  UpdateMedicallRegistriesDTO,
} from "./index";

export interface IMedicalRegistryRepository {
  create(registry: CreateMedicallRegistriesDTO): Promise<MedicallRegistriesDTO>;
  edit(
    medicalRegistryId: string,
    medicalRegistry: UpdateMedicallRegistriesDTO
  ): Promise<MedicallRegistriesDTO>;
  remove(id: string): Promise<MedicallRegistriesDTO>;
  getById(id: string): Promise<MedicallRegistriesDTO>;
}

export class MedicalRegistryRepository {
  /**
   * the serverURL
   *
   * @type {string}
   * @memberof MedicalRegistriesRepository
   */
  readonly baseUrl: string = "";

  /**
   * http client
   *
   * @type {IHttp}
   * @memberof MedicalRegistriesRepository
   */
  readonly http: IHttp;

  /**
   * Creates an instance of MedicalRegistriesRepository.
   * @param {string} baseUrl server url
   * @param {IHttp} http http client
   * @memberof MedicalRegistriesRepository
   */
  constructor(baseUrl: string, http: IHttp, userToken: ITokenStorage) {
    this.baseUrl = baseUrl + "/medical-registries";
    this.http = http;
    this.http.setBearerTokenHeader(userToken.getRawToken());
  }

  /**
   * Create an appoitnment
   *
   * @param {CreateMedicallRegistriesDTO} registry medical registry data
   * @return {*}  {Promise<boolean>} returns true when the operation was succeded
   * @memberof MedicalRegistriesRepository
   */
  async create(registry: CreateMedicallRegistriesDTO): Promise<MedicallRegistriesDTO> {
    console.log("oi", registry);
    const response = await this.http.request({
      method: "POST",
      url: this.baseUrl,
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
    medicalRegistry: UpdateMedicallRegistriesDTO
  ): Promise<MedicallRegistriesDTO> {
    const response = await this.http.request({
      method: "PATCH",
      url: this.baseUrl + `/${medicalRegistryId}`,
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
  async remove(id: string): Promise<MedicallRegistriesDTO> {
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
   * Return the selected appoitnment
   * @param id Appoitnment id
   * @returns
   */
  async getById(id: string): Promise<MedicallRegistriesDTO> {
    const response = await this.http.request({
      url: this.baseUrl + `/${id}`,
    });

    return await response.json();
  }
}

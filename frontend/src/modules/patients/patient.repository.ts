import { IHttp } from "infrastructure/adapter/http";
import { ITokenStorage } from "infrastructure/adapter/storage/token";
import {
  CreatePatientDTO,
  FilterPatientDTO,
  PatientDTO,
  UpdatePatientDTO,
} from "./patient.interfaces";
import { serverEndpoint } from "env-constants";

export interface IPatientRepository {
  create(patient: CreatePatientDTO): Promise<PatientDTO>;
  edit(patient: UpdatePatientDTO): Promise<PatientDTO>;
  remove(id: string): Promise<PatientDTO>;
  getAll(queryFilter?: FilterPatientDTO): Promise<PatientDTO[]>;
  getById(id: string): Promise<PatientDTO>;
  lgpdDeletion(id: string): Promise<{
    generatedMaps: [];
    raw: [];
    affected: number;
  }>;
  repoUrl: string;
  setSearchParams(searchParams: FilterPatientDTO): void;
}

export class PatientRepository implements IPatientRepository {
  /**
   * the serverURL
   *
   * @type {string}
   * @memberof PatientRepository
   */
  private readonly _repoUrl: URL;
  /**
   * http client
   *
   * @type {IHttp}
   * @memberof PatientRepository
   */
  private readonly http: IHttp;

  /**
   * Creates an instance of PatientRepository.
   * @param {string} baseUrl server url
   * @param {IHttp} http http client
   * @memberof PatientRepository
   */
  constructor(baseUrl: string, http: IHttp, userToken: ITokenStorage) {
    this._repoUrl = new URL("/patients", baseUrl);
    this.http = http;
    this.http.setBearerTokenHeader(userToken.getRawToken());
  }

  /**
   * The repository URLK
   *
   * @readonly
   * @type {string}
   * @memberof PatientRepository
   */
  get repoUrl(): string {
    return this._repoUrl.toString();
  }

  /**
   * Set the url search params
   *
   * @private
   * @param {FilterPatientDTO} searchParams the search params
   * @memberof PatientRepository
   */
  setSearchParams(searchParams: FilterPatientDTO) {
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        this._repoUrl.searchParams.set(key, value as string);
      });
    }
  }

  /**
   * create a pet
   *
   * @param {CreatePatientDTO} patient data
   * @return {*}  {Promise<boolean>} returns true when the operation was succeded
   * @memberof PatientRepository
   */
  async create(patient: CreatePatientDTO): Promise<PatientDTO> {
    const response = await this.http.request({
      method: "POST",
      url: this.repoUrl,
      body: patient,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(jsonResponse);
      throw new Error("Erro ao criar o paciente!", {
        cause: jsonResponse.message,
      });
    }

    return jsonResponse;
  }

  /**
   * The same as create but is as PATCH
   * @param patient patient UpdatePatientDTO
   * @returns
   */
  async edit(patient: UpdatePatientDTO): Promise<PatientDTO> {
    const response = await this.http.request({
      method: "PATCH",
      url: this.repoUrl,
      body: patient,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(jsonResponse);
      throw new Error("Erro ao editar o paciente!", {
        cause: jsonResponse.message,
      });
    }

    return jsonResponse;
  }

  /**
   * Remove the patient
   * @param id patient id
   * @returns
   */
  async remove(id: string): Promise<PatientDTO> {
    const response = await this.http.request({
      method: "DELETE",
      url: this.repoUrl + `/${id}`,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(jsonResponse);
      throw new Error("Erro ao remover o paciente!", {
        cause: jsonResponse.message,
      });
    }

    return jsonResponse;
  }

  /**
   * Returns the list of all patients
   * @returns All patientes
   */
  async getAll(queryFilter: FilterPatientDTO): Promise<PatientDTO[]> {
    this.setSearchParams(queryFilter);

    const response = await this.http.request({
      url: this.repoUrl,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(jsonResponse);
      throw new Error("Erro ao buscar o paciente!", {
        cause: jsonResponse.message,
      });
    }

    return jsonResponse;
  }

  /**
   * Return the selected patient
   * @param id Patient id
   * @returns
   */
  async getById(id: string): Promise<PatientDTO> {
    const response = await this.http.request({
      url: this.repoUrl.concat(`/${id}`),
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(jsonResponse);
      throw new Error("Erro ao buscar o paciente!", {
        cause: jsonResponse.message,
      });
    }

    return jsonResponse;
  }

  async lgpdDeletion(id: string): Promise<{
    generatedMaps: [];
    raw: [];
    affected: number;
  }> {
    const response = await this.http.request({
      url: serverEndpoint.concat(`/lgpd/deletion/${id}`),
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(jsonResponse);
      throw new Error("Erro ao excluir o paciente!", {
        cause: jsonResponse.message,
      });
    }

    return jsonResponse;
  }
}

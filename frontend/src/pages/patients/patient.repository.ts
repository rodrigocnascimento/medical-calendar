import { IHttp } from "../../infrastructure/adapter/http";
import TokenStorage from "../../infrastructure/adapter/storage/token";
import { CreatePatientDTO, PatientDTO, UpdatePatientDTO } from "./patient.dto";

export class PatientRepository {
  /**
   * the serverURL
   *
   * @type {string}
   * @memberof PatientRepository
   */
  readonly baseUrl: string = "";

  /**
   * http client
   *
   * @type {IHttp}
   * @memberof PatientRepository
   */
  readonly http: IHttp;

  /**
   * Creates an instance of PatientRepository.
   * @param {string} baseUrl server url
   * @param {IHttp} http http client
   * @memberof PatientRepository
   */
  constructor(baseUrl: string, http: IHttp, userToken: TokenStorage) {
    this.baseUrl = baseUrl + "/patients";
    this.http = http;
    this.http.setBearerTokenHeader(userToken.getRawToken());
  }

  /**
   * create a pet
   *
   * @param {CreatePatientDTO} patient data
   * @return {*}  {Promise<boolean>} returns true when the operation was succeded
   * @memberof PatientRepository
   */
  async createPatient(patient: CreatePatientDTO): Promise<PatientDTO> {
    const response = await this.http.request({
      method: "POST",
      url: this.baseUrl,
      body: patient,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      throw new Error('Erro ao criar o paciente!', {
        cause: jsonResponse.message[0]
      });
    }

    return jsonResponse;
  }

  /**
   * The same as create but is as PATCH
   * @param patient patient UpdatePatientDTO
   * @returns
   */
  async editPatient(patient: UpdatePatientDTO): Promise<PatientDTO> {
    const response = await this.http.request({
      method: "PATCH",
      url: this.baseUrl,
      body: patient,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      throw new Error('Erro ao editar o paciente!', {
        cause: jsonResponse.message[0]
      });
    }

    return jsonResponse;
  }

  /**
   * Remove the patient
   * @param id patient id
   * @returns
   */
  async removePatient(id: string): Promise<PatientDTO> {
    const response = await this.http.request({
      method: "DELETE",
      url: this.baseUrl + `/${id}`,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      throw new Error('Erro ao editar o paciente!', {
        cause: jsonResponse.message[0]
      });
    }

    return jsonResponse;
  }

  /**
   * Returns the list of all patients
   * @returns All patientes
   */
  async getAll(): Promise<PatientDTO[]> {
    const response = await this.http.request({
      url: this.baseUrl,
    });

    return await response.json();
  }

  /**
   * Return the selected patient
   * @param id Patient id
   * @returns
   */
  async getById(id: string): Promise<PatientDTO> {
    const response = await this.http.request({
      url: this.baseUrl + `/${id}`,
    });

    return await response.json();
  }
}

import { IHttp } from "../../infrastructure/adapter/http";
import TokenStorage from "../../infrastructure/adapter/storage/token";
import { PatientDTO } from "./dto";

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

  async getAll(): Promise<PatientDTO[]> {
    const response = await this.http.request({
      url: this.baseUrl,
    });

    return await response.json();
  }
}

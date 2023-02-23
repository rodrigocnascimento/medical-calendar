import { IHttp } from "../../infrastructure/adapter/http";
import TokenStorage from "../../infrastructure/adapter/storage/token";
import {
  AppointmentDTO,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "./appointment.dto";

export class AppointmentRepository {
  /**
   * the serverURL
   *
   * @type {string}
   * @memberof AppointmentRepository
   */
  readonly baseUrl: string = "";

  /**
   * http client
   *
   * @type {IHttp}
   * @memberof AppointmentRepository
   */
  readonly http: IHttp;

  /**
   * Creates an instance of AppointmentRepository.
   * @param {string} baseUrl server url
   * @param {IHttp} http http client
   * @memberof AppointmentRepository
   */
  constructor(baseUrl: string, http: IHttp, userToken: TokenStorage) {
    this.baseUrl = baseUrl + "/medical-appointments";
    this.http = http;
    this.http.setBearerTokenHeader(userToken.getRawToken());
  }

  /**
   * Create an appoitnment
   *
   * @param {CreateAppointmentDTO} appointment data
   * @return {*}  {Promise<boolean>} returns true when the operation was succeded
   * @memberof AppointmentRepository
   */
  async createAppointment(
    appointment: CreateAppointmentDTO
  ): Promise<AppointmentDTO> {
    const response = await this.http.request({
      method: "POST",
      url: this.baseUrl,
      body: appointment,
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
  async editAppointment(
    appointmentId: string,
    appointment: UpdateAppointmentDTO
  ): Promise<AppointmentDTO> {
    const response = await this.http.request({
      method: "PATCH",
      url: this.baseUrl + `/${appointmentId}`,
      body: appointment,
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
  async removeAppointment(id: string): Promise<AppointmentDTO> {
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
   * Returns the list of all appoitnments
   * @returns All appoitnments
   */
  async getAll(): Promise<AppointmentDTO[]> {
    const response = await this.http.request({
      url: this.baseUrl,
    });

    return await response.json();
  }

  /**
   * Return the selected appoitnment
   * @param id Appoitnment id
   * @returns
   */
  async getById(id: string): Promise<AppointmentDTO> {
    const response = await this.http.request({
      url: this.baseUrl + `/${id}`,
    });

    return await response.json();
  }
}

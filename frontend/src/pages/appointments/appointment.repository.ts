import { IHttp } from "../../infrastructure/adapter/http";
import { ITokenStorage } from "../../infrastructure/adapter/storage/token";
import {
  AppointmentDTO,
  CreateAppointmentDTO,
  FilterAppointmentDTO,
  UpdateAppointmentDTO,
} from "./appointment.interfaces";

export interface IAppointmentRepository {
  create(appointment: CreateAppointmentDTO): Promise<AppointmentDTO>;
  edit(appointment: UpdateAppointmentDTO): Promise<AppointmentDTO>;
  remove(id: string): Promise<AppointmentDTO>;
  getAll(): Promise<AppointmentDTO[]>;
}

export class AppointmentRepository implements IAppointmentRepository {
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
  constructor(baseUrl: string, http: IHttp, userToken: ITokenStorage) {
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
  async create(appointment: CreateAppointmentDTO): Promise<AppointmentDTO> {
    const response = await this.http.request({
      method: "POST",
      url: this.baseUrl,
      body: appointment,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(jsonResponse);
      throw new Error("Erro ao criar o agendamento!", {
        cause: jsonResponse.message,
      });
    }

    return jsonResponse;
  }

  /**
   *  Update an appoitnment
   * @param appointmentId appoitnment id
   * @param appointment appoitnment data
   * @returns
   */
  async edit(appointment: UpdateAppointmentDTO): Promise<AppointmentDTO> {
    const response = await this.http.request({
      method: "PATCH",
      url: this.baseUrl + `/${appointment.id}`,
      body: appointment,
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
   * Remove the appoitnment
   * @param id appoitnment id
   * @returns
   */
  async remove(id: string): Promise<AppointmentDTO> {
    const response = await this.http.request({
      method: "DELETE",
      url: this.baseUrl + `/${id}`,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(jsonResponse);
      throw new Error("Erro ao remover o agendamento!", {
        cause: jsonResponse.message,
      });
    }

    return jsonResponse;
  }

  /**
   * Returns the list of all appointments but considering only
   * doctors. So, when this query runs it will specifically fetch the
   * doctors, based on his logged in access_token, the JWT token
   * @returns All appoitnments
   */
  async getAll(queryFilter?: FilterAppointmentDTO): Promise<AppointmentDTO[]> {
    const queryUrl = new URL(this.baseUrl + "/by-doctor");

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
   * Return the selected appoitnment
   * @param id Appoitnment id
   * @returns
   */
  async getById(id: string): Promise<AppointmentDTO> {
    const response = await this.http.request({
      url: this.baseUrl + `/${id}`,
    });

    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(jsonResponse);
      throw new Error("Erro ao buscar o agendamento!", {
        cause: jsonResponse.message,
      });
    }

    return jsonResponse;
  }
}

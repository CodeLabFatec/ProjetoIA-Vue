import type IRegistroResponse from "@/interfaces/IRegistroResponse";
import api from "./api";

class RegistroEntradasSaidas {
  async getRegistroLength(
    tipo: "entrada" | "saida",
    redzone_id?: number
  ): Promise<{ status: number; data?: number }> {
    try {
      const { data, status } = await api.get(
        `/${tipo}-redzone/people-by-redzone-filter${
          redzone_id ? `?redZoneId=${redzone_id}` : ""
        }`
      );

      return {
        status,
        data: data?.peopleByRedZone,
      };
    } catch (err) {
      console.log('length', err);
      return {status: 500 };
    }
  }

  async getRegistros(
    tipo: "entrada" | "saida",
    redzone_id?: number
  ): Promise<{ status: number; data?: IRegistroResponse[] }> {
    try {
      const { data, status } = await api.get(`/${tipo}-redzone`);

      const data_filtered = redzone_id
        ? (data as IRegistroResponse[] | undefined)?.filter(
            (item) => item.redZone.id == redzone_id
          )
        : data;

      return { data: data_filtered, status };
    } catch (err) {
      console.log("registros", err);
      return { status: 500 };
    }
  }
}

export default new RegistroEntradasSaidas();

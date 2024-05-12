import type IRegistroResponse from "@/interfaces/IRegistroResponse";
import api from "./api";

class RegistroEntradasSaidas {
  async getRegistroLength(
    tipo: "entrada" | "saida",
    redzone_id?: number,
    area_id?: number
  ): Promise<{ status: number; data?: number }> {
    try {
      const params = {} as any;
      if (redzone_id) params.redZoneId = `${redzone_id}`;
      if (area_id) params.areaId = `${area_id}`;
      const { data, status } = await api.get(
        `/${tipo}-redzone/people-by-redzone-filter`,
        { params }
      );

      return {
        status,
        data: data?.peopleByRedZone,
      };
    } catch (err) {
      console.log("length", err);
      return { status: 500 };
    }
  }

  async getRegistros(
    tipo: "entrada" | "saida",
    redzone_id?: number,
    area_id?: number
  ): Promise<{ status: number; data?: IRegistroResponse[] }> {
    const params = {} as any;
    if (redzone_id) params.redZoneId = `${redzone_id}`;
    if (area_id) params.areaId = `${area_id}`;
    try {
      const { data, status } = await api.get(`/${tipo}-redzone`, { params });

      return { data, status };
    } catch (err) {
      console.log("registros", err);
      return { status: 500 };
    }
  }
}

export default new RegistroEntradasSaidas();

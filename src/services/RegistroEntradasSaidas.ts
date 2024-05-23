import type IRegistroResponse from "@/interfaces/IRegistroResponse";
import api from "./api";

class RegistroEntradasSaidas {
  async getRegistroLength(
    tipo: "entrada" | "saida",
    redzone_id?: number,
    area_id?: number,
    date?: Date | Date[],
  ): Promise<{ status: number; data?: number }> {
    try {
      const params = {} as any;
      if (redzone_id) params.redZoneId = `${redzone_id}`;
      if (area_id) params.areaId = `${area_id}`;
      if (date) {
        if (Array.isArray(date)) {
          params.startDate = `${date[0].getFullYear()}-${(date[0].getMonth() + 1).toString().padStart(2, '0')}-${date[0].getDate().toString().padStart(2, '0')}T${date[0].getHours().toString().padStart(2, '0')}:${date[0].getMinutes().toString().padStart(2, '0')}:${date[0].getSeconds().toString().padStart(2, '0')}Z`;
          params.endDate = `${date[1].getFullYear()}-${(date[1].getMonth() + 1).toString().padStart(2, '0')}-${date[1].getDate().toString().padStart(2, '0')}`;
        } else {
          params.specificDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        }
      }

      const { data, status } = await api.get(
        `/${tipo}-redzone/people-by-redzone-filter`,
        { params }
      );

      // for tests only
      // const {data, status} = {
      //   status: 200,
      //   data: {peopleByRedZone: 24},
      // }

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
    area_id?: number,
    date?: Date | Date[],
    refresh = false,
  ): Promise<{ status: number; data?: IRegistroResponse[] }> {
    const params = {} as any;
    if (redzone_id) params.redZoneId = `${redzone_id}`;
    if (area_id) params.areaId = `${area_id}`;
    if (date) {
      if (Array.isArray(date)) {
        params.startDate = `${date[0].getFullYear()}-${(date[0].getMonth() + 1).toString().padStart(2, '0')}-${date[0].getDate().toString().padStart(2, '0')}T${date[0].getHours().toString().padStart(2, '0')}:${date[0].getMinutes().toString().padStart(2, '0')}:${date[0].getSeconds().toString().padStart(2, '0')}Z`;
          if (!refresh) params.endDate = `${date[1].getFullYear()}-${(date[1].getMonth() + 1).toString().padStart(2, '0')}-${date[1].getDate().toString().padStart(2, '0')}`;
      } else {
        params.specificDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      }
    }
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

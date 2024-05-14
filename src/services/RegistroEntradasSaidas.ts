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
          params.dateStart = `${date[0].getFullYear()}-${date[0].getMonth().toString().padStart(2, '0')}-${date[0].getDate().toString().padStart(2, '0')}`;
          params.dateEnd = `${date[1].getFullYear()}-${date[1].getMonth().toString().padStart(2, '0')}-${date[1].getDate().toString().padStart(2, '0')}`;
        } else {
          params.date = `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        }
      }
      console.log({params})
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
    area_id?: number,
    date?: Date | Date[]
  ): Promise<{ status: number; data?: IRegistroResponse[] }> {
    const params = {} as any;
    if (redzone_id) params.redZoneId = `${redzone_id}`;
    if (area_id) params.areaId = `${area_id}`;
    if (date) {
      if (Array.isArray(date)) {
        params.dateStart = `${date[0].getFullYear()}-${date[0].getMonth().toString().padStart(2, '0')}-${date[0].getDate().toString().padStart(2, '0')}`;
        params.dateEnd = `${date[1].getFullYear()}-${date[1].getMonth().toString().padStart(2, '0')}-${date[1].getDate().toString().padStart(2, '0')}`;
      } else {
        params.date = `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
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

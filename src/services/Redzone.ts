import type IRedzone from "@/interfaces/IRedzone";
import api from "./api";

class Redzone {
  async getRedzones(
    area_id?: number
  ): Promise<{ data: IRedzone[]; status: number }> {
    try {
      const params = {} as any;
      if (area_id) params.areaId = area_id;
      const response = await api.get("/redzone", { params });
      const { data, status } = response
      console.log(response)
      // for tests only
      // const area = {
      //   id: 1,
      //   nome: "area 1",
      //   descricao: "lorem ipsum",
      // }
      // const { data, status } = {
      //   status: 200,
      //   data: !area_id ? [
      //     { id: 1, nome: "1", descricao: "1", data: new Date().toISOString(), area },
      //     { id: 2, nome: "2", descricao: "1", data: new Date().toISOString(), area },
      //     { id: 3, nome: "3", descricao: "1", data: new Date().toISOString(), area },
      //   ] : [
      //     { id: 1, nome: "1", descricao: "1", data: new Date().toISOString(), area },
      //     { id: 2, nome: "2", descricao: "1", data: new Date().toISOString(), area },
      //   ]
      // };

      return { data: status == 200 ? data : [], status };
    } catch (err) {
      console.log(err);
      return { data: [], status: 500 };
    }
  }

  async getRedzonesByID(
    id: number
  ): Promise<{ data?: IRedzone; status: number }> {
    try {
      const { data, status } = await api.get(`/redzone/${id}`);
      return { data, status };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }

  async create(redzone: {
    nome: string;
    descricao: string;
    areaId: number;
  }): Promise<{ status: number }> {
    try {
      const { status } = await api.post("/redzone", redzone);
      return { status };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }

  async update(redzone: {
    id: number;
    nome: string;
    descricao: string;
    areaId: number;
  }): Promise<{ status: number }> {
    try {
      const { status } = await api.put(`/redzone/${redzone.id}`, redzone);
      return { status };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }

  async delete(id: number): Promise<{ status: number }> {
    try {
      const { status } = await api.delete(`/redzone/${id}`);
      return { status };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }

  async activateById(id: number): Promise<{ status: number }> {
    try {
      const { status } = await api.put(`/redzone/activate/${id}`);
      return { status };
    } catch (err) {
      return { status: 500 };
    }
  }
}

export default new Redzone();

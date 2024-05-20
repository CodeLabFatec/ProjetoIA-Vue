import type IArea from "@/interfaces/IArea";
import api from "./api";

class Area {
  async getAreas(): Promise<{ status: number; data: IArea[] }> {
    try {
      const { data, status } = await api.get('/area');

      return { data, status };
    } catch (err) {
      console.log(err);
      return { status: 500, data: [] };
    }
  }

  async getByID(
    id: number
  ): Promise<{ data?: IArea; status: number }> {
    try {
      const { data, status } = await api.get(`/area/${id}`);
      return { data, status };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }

  async create(area: {
    nome: string;
    descricao: string;
  }): Promise<{ status: number }> {
    try {
      const { status } = await api.post("/area", area);
      return { status };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }

  async update(area: {
    id: number;
    nome: string;
    descricao: string;
  }): Promise<{ status: number }> {
    try {
      const { status } = await api.put(`/area/${area.id}`, area);
      return { status };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }

  async deleteById(id: number): Promise<{ status: number }> {
    try {
      const { status } = await api.delete(`/area/${id}`);
      return { status };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }
}

export default new Area();

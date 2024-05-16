import type IArea from "@/interfaces/IArea";
import api from "./api";

class Area {
  async getAreas(): Promise<{ status: number; data: IArea[] }> {
    try {
      // const { data, status } = await api.get('/area');

      // for tests only
      const { data, status } = {
        status: 200,
        data: [
          {
            id: 1,
            nome: "area 1",
            descricao: "lorem ipsum",
          },
          {
            id: 2,
            nome: "area 2",
            descricao: "lorem ipsum",
          },
          {
            id: 3,
            nome: "area 3",
            descricao: "lorem ipsum",
          },
        ],
      };

      return { data, status };
    } catch (err) {
      console.log(err);
      return { status: 500, data: [] };
    }
  }

  async delete(id: number): Promise<{ status: number }> {
    try {
      const { status } = await api.delete(`/area/${id}`);
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
}

export default new Area();

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
}

export default new Area();

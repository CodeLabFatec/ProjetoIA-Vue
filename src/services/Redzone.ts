import type IRedzone from "@/interfaces/IRedzone";
import api from "./api";

class Redzone {
  async getRedzones(): Promise<{ data: IRedzone[]; status: number }> {
    try {
      const { data, status } = await api.get("/redzone");
      return { data: status == 200 ? data : [], status };
    } catch (err) {
      console.log(err);
      return { data: [], status: 500 };

      // uncomment just for tests
      // return {
      //   data: [
      //     {
      //       data: new Date().toISOString(),
      //       descricao: "lorem ipsum",
      //       id: 1,
      //       nome: "nome redzone",
      //     },
      //   ],
      //   status: 200,
      // };
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
}

export default new Redzone();

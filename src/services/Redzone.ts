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
    }
  }
}

export default new Redzone();

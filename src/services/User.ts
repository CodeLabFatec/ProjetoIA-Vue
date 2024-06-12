import type IUser from "@/interfaces/IUser";
import api from "./api";
import type { ISelectOption } from "@/interfaces/ISelectOption";

class User {
  activateById(arg0: number) {
    throw new Error("Method not implemented.");
  }
  [x: string]: any;
  async getUsers(): Promise<{ status: number; data: IUser[] }> {
    try {
      const { data, status } = await api.get("/user");
      return { data, status };
    } catch (err) {
      console.log(err);
      return { status: 500, data: [] };
    }
  }

  async getByID(id: number): Promise<{ data?: IUser; status: number }> {
    try {
      const { data, status } = await api.get(`/user/${id}`);
      return { data, status };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }

  async create(user: any): Promise<{ status: number }> {
    try {
      const { status } = await api.post("/user", user);
      return { status };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }

  async update(id: any, user: any): Promise<{ status: number }> {
    try {
      const { status } = await api.put(`/user/${id}`, user);
      return { status };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }

  async deleteById(id: number): Promise<{ status: number }> {
    try {
      const { status } = await api.delete(`/user/${id}`);
      return { status };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }

  private async getPapersSelect(): Promise<ISelectOption[]> {
    const { data } = await api.get("/user/selectPapeis");

    return data;
  }
  private async getAreasSelect(): Promise<ISelectOption[]> {
    const { data } = await api.get("/area/select");

    return data;
  }
  private async getRedzoneSelect(): Promise<ISelectOption[]> {
    const { data } = await api.get("/redzone/select");

    return data;
  }

  async getCreateInfo(): Promise<CreateInfo | null> {
    try {
      const [papeisResult, areasResult, redzonesResult] =
        await Promise.allSettled([
          this.getPapersSelect(),
          this.getAreasSelect(),
          this.getRedzoneSelect(),
        ]);

      const papeis =
        papeisResult.status === "fulfilled" ? papeisResult.value : [];
      const areas = areasResult.status === "fulfilled" ? areasResult.value : [];
      const redzones =
        redzonesResult.status === "fulfilled" ? redzonesResult.value : [];

      return {
        papeis,
        areas,
        redzones,
      };
    } catch (err) {
      return null;
    }
  }
}

type CreateInfo = {
  areas: ISelectOption[];
  redzones: ISelectOption[];
  papeis: ISelectOption[];
};

export default new User();

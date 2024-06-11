import type IUser from "@/interfaces/IUser";
import api from "./api";

class User {
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

  async create(user: IUser): Promise<{ status: number }> {
    try {
      const { status } = await api.post("/user", user);
      return { status };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }

  async update(user: IUser): Promise<{ status: number }> {
    try {
      const { status } = await api.put(`/user/${user.id}`, user);
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
}

export default new User();

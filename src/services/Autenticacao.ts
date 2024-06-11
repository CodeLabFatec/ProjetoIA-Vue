import type { ILoginResponse } from "@/interfaces/ILoginResponse";
import api from "./api";

interface ILogin {
  email: string;
  senha: string;
}

class Autenticacao {
  async login(login: ILogin): Promise<{ data?: ILoginResponse, status: number }> {
    const {data, status} = await api.post(
      '/login',
      {
        email: login.email,
        password: login.senha,
      },
    );
    return { 
      status,
      data: status == 200 ? (data as ILoginResponse) : undefined
     };
  }

  async submitEmail(email: string): Promise<{ status: number }> {
    console.log(email);
    return { status: 200 };
  }

  async changePassword(
    code: string,
    password: string
  ): Promise<{ status: number }> {
    console.log(code, password);
    return { status: 200 };
  }
}

export default new Autenticacao();

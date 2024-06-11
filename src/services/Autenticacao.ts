import api from "./api";

interface ILogin {
  email: string;
  senha: string;
}

class Autenticacao {
  async login(login: ILogin): Promise<{ status: number }> {
    console.log(login);
    return { status: 200 };
  }

  async submitEmail(email: string): Promise<{ status: number }> {
    const { status } = await api.post(`/recover`, { email });

    return { status };
  }

  async changePassword(
    code: string,
    password: string
  ): Promise<{ status: number }> {
    const { status } = await api.post("/token", { token: code, password });

    return { status };
  }
}

export default new Autenticacao();

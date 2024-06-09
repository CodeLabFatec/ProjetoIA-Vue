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

interface ILogin {
  email: string;
  senha: string;
}

class Autenticacao {
  async login(login: ILogin): Promise<{ status: number }> {
    console.log(login);
    return { status: 200 };
  }
}

export default new Autenticacao();

import type IRedzone from "@/interfaces/IRedzone";

class Redzone {
  async getRedzones(): Promise<{ data: IRedzone[]; status: number }> {
    const status = 200;

    const list: IRedzone[] = [
      {
        data_cadastro: new Date(2002).toUTCString(),
        descricao: "teste 1",
        id: 1,
        nome: "teste 1",
      },
      {
        data_cadastro: new Date().toUTCString(),
        descricao: "teste",
        id: 2,
        nome: "teste 2",
      },
      {
        data_cadastro: new Date().toUTCString(),
        descricao: "teste",
        id: 3,
        nome: "teste 3",
      },
      {
        data_cadastro: new Date().toUTCString(),
        descricao: "teste",
        id: 4,
        nome: "teste 4",
      },
    ];

    return { data: list, status };
  }
}

export default new Redzone();

import type IRedzone from "@/interfaces/IRedzone";

class Redzone {
  async getRedzones(): Promise<{ data: IRedzone[]; status: number }> {
    const status = 200;

    const list: IRedzone[] = [
      {
        data_cadastro: new Date().toUTCString(),
        descricao: "teste",
        id: 1,
        nome: "teste",
      },
      {
        data_cadastro: new Date().toUTCString(),
        descricao: "teste",
        id: 2,
        nome: "teste",
      },
      {
        data_cadastro: new Date().toUTCString(),
        descricao: "teste",
        id: 3,
        nome: "teste",
      },
      {
        data_cadastro: new Date().toUTCString(),
        descricao: "teste",
        id: 4,
        nome: "teste",
      },
    ];

    return { data: list, status };
  }
}

export default new Redzone();

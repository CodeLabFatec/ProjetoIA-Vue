interface IPapel {
  id: number;
  nome: string;
  descricao: string;
}

export interface ILoginResponse {
  nome: string;
  email: string;
  idPapel: number;
  token: string;
}

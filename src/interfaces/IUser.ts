export default interface IUser {
  id?: number;
  nome: string;
  email: string;
  papel: {
    id: number;
    nome: string;
    descricao: string;
  };
  status: boolean;
}

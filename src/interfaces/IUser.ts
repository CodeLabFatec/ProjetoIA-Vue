import type IArea from "./IArea";
import type IRedzone from "./IRedzone";

export default interface IUser {
  id?: number;
  nome: string;
  email: string;
  papel: {
    id: number;
    nome: string;
    descricao: string;
  };
  areas?: IArea[];
  redzones?: IRedzone[];
}

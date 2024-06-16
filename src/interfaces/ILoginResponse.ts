import type IArea from "./IArea";
import type IRedzone from "./IRedzone";

export interface ILoginResponse {
  idUsuario: number;
  nome: string;
  email: string;
  idPapel: number;
  token: string;
  areas: IArea[];
  redzones: IRedzone[];
}

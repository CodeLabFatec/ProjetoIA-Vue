import type IArea from "./IArea";

export default interface IRedzone {
  id: number;
  nome: string;
  descricao: string;
  data: string;
  area: IArea;
  status: boolean;
  status_str: string;
}

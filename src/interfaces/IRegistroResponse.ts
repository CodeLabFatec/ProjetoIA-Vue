import type IRedzone from "./IRedzone";

export default interface IRegistroResponse {
  id: number,
  data: string,
  redzone: IRedzone,
}
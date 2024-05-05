import type IDiaPessoas from "./IDiaPessoas";
import type IRegistroEntradaSaida from "./IRegistroEntradaSaida";

export default interface IDashboardResponse {
  grafico: IDiaPessoas[],
  tabela: IRegistroEntradaSaida[],
  indicadores: {
    total_pessoas: number,
    total_entradas: number,
  },
}
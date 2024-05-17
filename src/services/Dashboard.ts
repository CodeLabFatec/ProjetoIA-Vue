import type IDashboardResponse from "@/interfaces/IDashboardResponse";
import RegistroEntradasSaidas from "./RegistroEntradasSaidas";
import type IRegistroResponse from "@/interfaces/IRegistroResponse";

class Dashboard {
  private convertRegisterArray = (
    list: IRegistroResponse[],
    tipo: "entrada" | "saida"
  ) => {
    return list.map((item) => ({
      data: item.data,
      tipo,
      redzone: item.redZone.nome,
    }));
  };

  private filterRegisterByDate = (list: IRegistroResponse[], date: string) => {
    const filtered_list = list.filter((item) => {
      const item_date = new Date(item.data).toISOString().split("T")[0];
      return item_date === date;
    });

    return filtered_list;
  };

  private convertRegistersInGraphicData = (
    list: IRegistroResponse[],
    pre_period?: string[]
  ) => {
    let day_array: string[] = [];

    const period = pre_period
      ? pre_period.map((date) => new Date(date))
      : undefined;

    const pre_date = new Date();
    const pre_date_str = `${pre_date.getFullYear()}-${pre_date.getMonth() + 1}-${pre_date.getDate()}`
    if (!period || !period.length) {
      for (let i = 0; i < 7; i++) {
        let data = new Date(pre_date_str);
        data.setDate(data.getDate() - i);
        let dataString = data.toISOString().split("T")[0];
        day_array.push(dataString);
      }
    } else if (period.length > 1) {
      const ms_diference = Math.abs(period[0].getTime() - period[1].getTime());
      const day_distance = Math.ceil(ms_diference / (1000 * 60 * 60 * 24)) + 1;
      for (let i = 0; i < day_distance; i++) {
        let date = new Date(period[0]);
        date.setDate(date.getDate() + i);
        let date_string = date.toISOString().split('T')[0];
        day_array.push(date_string);
      }
      // day_array = period.map((date) => date.toISOString().split("T")[0]);
    } else {
      day_array.push(period[0].toISOString().split('T')[0]);
    }

    const register_groupedby_date = day_array.map((date) => ({
      data: date,
      valor: this.filterRegisterByDate(list, date),
    }));

    return register_groupedby_date;
  };

  async getDashboard(
    id_redzone?: number,
    id_area?: number,
    date?: Date | Date[]
  ): Promise<{ status: number; data?: IDashboardResponse }> {
    const date_string = date ? (
      Array.isArray(date) ? 
      date.map(item => `${item.getFullYear()}-${item.getMonth() + 1}-${item.getDate()}`) 
      : [`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`]
    ) : undefined;
    try {
      const [total_entradas, total_saidas, entradas, saidas] = (
        await Promise.allSettled([
          RegistroEntradasSaidas.getRegistroLength(
            "entrada",
            id_redzone,
            id_area,
            date
          ),
          RegistroEntradasSaidas.getRegistroLength(
            "saida",
            id_redzone,
            id_area,
            date
          ),
          RegistroEntradasSaidas.getRegistros(
            "entrada",
            id_redzone,
            id_area,
            date
          ),
          RegistroEntradasSaidas.getRegistros(
            "saida",
            id_redzone,
            id_area,
            date
          ),
        ])
      ).map((result) =>
        result.status === "fulfilled" ? result.value : { status: 500 }
      );

      if (
        total_entradas.status == 200 &&
        total_saidas.status == 200 &&
        entradas.status == 200 &&
        saidas.status == 200
      ) {
        const merged_entradas_saidas = [
          ...this.convertRegisterArray(
            entradas.data as IRegistroResponse[],
            "entrada"
          ),
          ...this.convertRegisterArray(
            saidas.data as IRegistroResponse[],
            "saida"
          ),
        ].sort((a, b) => {
          let data_a = new Date(a.data);
          let data_b = new Date(b.data);

          return data_b.getTime() - data_a.getTime();
        });

        const info_dashboard: IDashboardResponse = {
          grafico: this.convertRegistersInGraphicData(
            entradas.data as IRegistroResponse[],
            date_string
          ),
          tabela: merged_entradas_saidas,
          indicadores: {
            total_pessoas:
              (total_entradas.data as number) - (total_saidas.data as number),
            total_entradas: total_entradas.data as number,
          },
        };

        return { status: 200, data: info_dashboard };
      } else {
        return { status: 500 };
      }
    } catch (e) {
      console.log(e);
      return { status: 500 };
    }
  }
}

export default new Dashboard();

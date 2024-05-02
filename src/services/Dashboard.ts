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
      redzone: item.redzone.nome,
    }));
  };

  private filterRegisterByDate = (list: IRegistroResponse[], date: string) => {
    return list.filter(item => {
      const item_date = new Date(item.data).toISOString().split('T')[0];
      return item_date === date;
    });
  }

  private convertRegistersInGraphicData = (list: IRegistroResponse[]) => {
    let last_7days_list: string[] = [];
  
    for (let i = 0; i < 7; i++) {
      let data = new Date();
      data.setDate(data.getDate() - i);
      let dataString = data.toISOString().split("T")[0];
      last_7days_list.push(dataString);
    }
  
    const register_groupedby_date = last_7days_list.map(date => ({
      data: date,
      valor: this.filterRegisterByDate(list, date).length
    }));

    return register_groupedby_date;
  };

  async getDashboard(
    id_redzone?: number
  ): Promise<{ status: number; data?: IDashboardResponse }> {
    try {
      const total_entradas = await RegistroEntradasSaidas.getRegistroLength(
        "entrada",
        id_redzone
      );

      const total_saidas = await RegistroEntradasSaidas.getRegistroLength(
        "saida",
        id_redzone
      );

      const entradas = await RegistroEntradasSaidas.getRegistros(
        "entrada",
        id_redzone
      );

      const saidas = await RegistroEntradasSaidas.getRegistros(
        "saida",
        id_redzone
      );

      if (
        total_entradas.data &&
        total_entradas.status == 200 &&
        total_saidas.data &&
        total_saidas.status == 200 &&
        entradas.data &&
        entradas.status == 200 &&
        saidas.data &&
        saidas.status == 200
      ) {
        const merged_entradas_saidas = this.convertRegisterArray(
          entradas.data,
          "entrada"
        )
          .concat(this.convertRegisterArray(saidas.data, "saida"))
          .sort((a, b) => {
            let data_a = new Date(a.data);
            let data_b = new Date(b.data);

            return data_b.getTime() - data_a.getTime();
          });

        const info_dashboard: IDashboardResponse = {
          grafico: this.convertRegistersInGraphicData(entradas.data),
          tabela: merged_entradas_saidas,
          indicadores: {
            total_pessoas: total_entradas.data - total_saidas.data,
            total_entradas: total_entradas.data,
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

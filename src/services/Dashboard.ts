import type IDashboardResponse from "@/interfaces/IDashboardResponse";
import api from "./api";

class Dashboard {
  async getDashboard(id_redzone?: number): Promise<{ status: number; data?: IDashboardResponse }> {
    try {
      // const resp = await api.get('/dashboard');

      console.log('getting')
      const data: IDashboardResponse = {
        grafico: [
          {
            data: "2024-04-29",
            valor: 150,
          },
          {
            data: "2024-04-28",
            valor: 76,
          },
          {
            data: "2024-04-27",
            valor: 150,
          },
          {
            data: "2024-04-26",
            valor: 122,
          },
          {
            data: "2024-04-25",
            valor: 76,
          },
          {
            data: "2024-04-24",
            valor: 88,
          },
          {
            data: "2024-04-23",
            valor: 91,
          },
        ],
        tabela: [
          {
            data: "2024-04-29",
            tipo: "entrada",
            redzone: "Área A",
          },
          {
            data: "2024-04-29",
            tipo: "saida",
            redzone: "Área B",
          },
        ],
        indicadores: {
          total_pessoas: 300,
          total_entradas: 200,
        },
      };

      return { status: 200, data };
    } catch (e) {
      console.log(e);
      return { status: 500 };
    }
  }
}

export default new Dashboard();

import type IRegistroResponse from "@/interfaces/IRegistroResponse";
import api from "./api";

class RegistroEntradasSaidas {
  async getRegistroLength(
    tipo: "entrada" | "saida",
    redzone_id?: number
  ): Promise<{ status: number; data?: number }> {
    try {
      const { data, status } = await api.get(
        `/${tipo}-redzone/people-by-redzone-filter${
          redzone_id ? `?redZoneId=${redzone_id}` : ""
        }`
      );

      // for tests only
      // const { data, status } = {
      //   data: {
      //     peopleByRedzone: 23,
      //   },
      //   status: 200,
      // };

      return {
        status,
        data: data?.peopleByRedzone,
      };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }

  async getRegistros(
    tipo: "entrada" | "saida",
    redzone_id?: number
  ): Promise<{ status: number; data?: IRegistroResponse[] }> {
    try {
      const { data, status } = await api.get(
        `/${tipo}-redzone${redzone_id ? `?redZoneId=${redzone_id}` : ""}`
      );

      // for tests only
      // const { data, status } = {
      //   status: 200,
      //   data: [
      //     {
      //       id: 1,
      //       data: new Date().toISOString(),
      //       redzone: {
      //         data: new Date().toISOString(),
      //         descricao: `
      //       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mollis nunc et rhoncus sagittis. Mauris arcu tellus, venenatis at molestie id, dapibus ut purus. Mauris sed orci justo. Duis imperdiet tempor mattis. Nam accumsan pulvinar risus, sed vulputate massa. Quisque ut semper nibh, sit amet hendrerit lacus. Mauris nisl leo, dignissim nec nibh ut, scelerisque egestas nibh. Sed volutpat, lacus a varius fermentum, dolor felis pellentesque libero, at sagittis justo urna sed tortor. In non odio semper, feugiat metus at, laoreet libero. Vivamus molestie tellus ut mauris tristique semper.
      //       `,
      //         id: 1,
      //         nome: "nome redzone",
      //       },
      //     },
      //   ],
      // };

      return { data, status };
    } catch (err) {
      console.log(err);
      return { status: 500 };
    }
  }
}

export default new RegistroEntradasSaidas();

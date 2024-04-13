import api from "./api";

class Relatorio {
  async getRelatorio(type_relatorio: '7-days' | '14-days'): Promise<{ status: number }> {
    const endpoint = type_relatorio == '7-days' ? '/report-7-days' : '/report-14-days'
    try {
      const resp = await api.get(endpoint, { responseType: "blob" });

      const date = new Date()

      const filename = `relatorio-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}.xlsx`

      const downloadFile = new Blob([resp.data]);
      const url = window.URL.createObjectURL(downloadFile);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);

      return { status: 200 };
    } catch (e) {
      console.log(e);
      return { status: 500 };
    }
  }
}

export default new Relatorio();

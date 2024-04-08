import type { ISelectedDate } from "@/interfaces/ISelectedDate";
import api from "./api";

// /report-7-days
// /report-14-days

class Relatorio {
  async getRelatorio7Dias() {
    // const { data } = await api.get("/report-7-days");
    // return data;
    console.log('7 dias');
  }
  
  async getRelatorio14Dias() {
    // const { data } = await api.get("/report-14-days");
    // return data;
    console.log('14 dias');
  }

  async getRelatorio(date: ISelectedDate) {
    if (date == null) {
      // se data não foi informado
      
      // const { data } = await api.get("/relatorio");
      // return data;
      console.log("getRelatório sem data");
    } else {
      const convertDate = (item: Date) => {
        return item.toISOString().split("T")[0];
      };

      if (Array.isArray(date)) {
        // se foi informado data início e fim
        const request_json: Object = {
          date_start: convertDate(date[0]),
          date_end: convertDate(date[1]),
        };
        // request_json = {
        //   "date_start": "2024-04-01",
        //   "date_end": "2024-04-18"
        // }
        
        // const { data } = await api.get("/relatorio", request_json);
        // return data;
        console.log('getRelatorio com data inicio e fim', {request_json})
      } else {
        // se foi informado uma única data
        const request_json: Object = {
          date: convertDate(date),
        };
        // request_json = {"date": "2024-04-18"}
        
        // const { data } = await api.get("/relatorio", request_json);
        // return data;
        console.log('getRelatorio com data única', {request_json})
      };
    }
  }
}

export default new Relatorio();

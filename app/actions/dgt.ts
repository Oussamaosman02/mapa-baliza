"use server";

import { decodeData } from "@/utils/decode";
import fs from "fs";
import { DgtResponse } from "../types/dgt";

export const getAllDgtData = async (): Promise<DgtResponse | undefined> => {
  try {
    const data = await fetch(
      "https://etraffic.dgt.es/etrafficWEB/api/cache/getFilteredData",
      {
        headers: {
          accept: "*/*",
          "accept-language": "es-ES,es;q=0.8",
          "cache-control": "no-cache",
          "content-type": "application/json",
          pragma: "no-cache",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Brave";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
        },
        referrer: "https://etraffic.dgt.es/etrafficWEB/",
        body: '{"filtrosVia":["Carreteras cortadas","Tráfico lento","Circulación restringida","Desvíos y embolsamientos","Otras vialidades"],"filtrosCausa":["Obras","Accidente","Meteorológicos","Restricciones de circulación","Otras incidencias"]}',
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    const res = await data.text();
    const decodedData = decodeData(res);
    console.log(decodedData);
    fs.writeFileSync("data.json", decodedData);
    return JSON.parse(decodedData);
  } catch (error) {
    console.log(error);
  }
};

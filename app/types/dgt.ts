export interface DgtSituation {
  situationId: string;
  id: string;
  tipoVialidad: string;
  subtipoVialidad: string;
  fechaInicio: string;
  fechaFin: string | null;
  caracter: string;
  nivelServicio: string | null;
  estado: string;
  fuente: string;
  causa: string;
  subcausa: string;
  carriageway: string | null;
  carril: string[];
  carretera: string;
  sentido: string;
  orientacion: string | null;
  hacia: string | null;
  pkIni: number;
  pkFin: number;
  cAutonomaIni: string;
  provinciaIni: string;
  municipioIni: string;
  cAutonomaFin: string;
  provinciaFin: string;
  municipioFin: string;
  geometria: string; // GeoJSON stringified
  singularidad: string | null;
  tipoVehiculo1: string;
  tipoVehiculo2: string | null;
  tipoCarga: string | null;
  valorEmisions: string | null;
  valor: string | null;
  tipoRestriccion: string | null;
}

export interface DgtResponse {
  situationsRecords: DgtSituation[];
}

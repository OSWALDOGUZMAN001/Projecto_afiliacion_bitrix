import { useEffect, useState } from "react";

import StatsCard from "./StatsCard";


const API_URL = "http://localhost:3000/api/companies/resumen";


export default function Dashboard() {

  const [resumen, setResumen] = useState(null);

  const [error, setError] = useState(false);


  async function cargarResumen() {

    try {

      const response = await fetch(API_URL);

      setResumen(await response.json());

      setError(false);

    } catch {

      setError(true);

    }

  }


  useEffect(() => {

    cargarResumen();

    // UploadCSV avisa cuando termina una importacion
    window.addEventListener("carga-finalizada", cargarResumen);

    return () => window.removeEventListener("carga-finalizada", cargarResumen);

  }, []);


  const carga = resumen?.ultimaCarga;

  const valor = (numero) => (carga ? numero : "-");


  return (
    <>

      <div className="grid">

        <StatsCard
          title="Empresas cargadas"
          value={valor(carga?.totalRegistros)}
          icon="🏢"
        />

        <StatsCard
          title="Creadas Bitrix"
          value={valor(carga?.creados)}
          icon="✓"
          type="success"
        />

        <StatsCard
          title="Omitidas y duplicadas"
          value={valor((carga?.omitidos ?? 0) + (carga?.duplicados ?? 0))}
          icon="⏳"
          type="warning"
        />

        <StatsCard
          title="Errores"
          value={valor(carga?.errores)}
          icon="×"
          type="danger"
        />

      </div>


      <p className="dashboard-info">

        {
          error
            ? "No se pudo conectar con el servidor"
            : carga
              ? `Última carga: ${carga.nombreArchivo} · ${new Date(carga.fechaCarga).toLocaleString("es-CO")} · Total empresas creadas en Bitrix: ${resumen.totalCreadas}`
              : "Aún no se ha realizado ninguna carga"
        }

      </p>

    </>
  );
}

import StatsCard from "./StatsCard";

export default function Dashboard() {
  return (
    <div className="grid">

      <StatsCard
        title="Empresas cargadas"
        value="8"
        icon="🏢"
      />

      <StatsCard
        title="Pendientes Bitrix"
        value="8"
        icon="⏳"
        type="warning"
      />

      <StatsCard
        title="Creadas Bitrix"
        value="0"
        icon="✓"
        type="success"
      />

      <StatsCard
        title="Errores"
        value="0"
        icon="×"
        type="danger"
      />

    </div>
  );
}
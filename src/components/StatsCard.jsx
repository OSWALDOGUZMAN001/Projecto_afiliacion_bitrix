export default function StatsCard({
  title,
  value,
  icon,
  type = ""
}) {
  return (
    <div className={`card stats ${type}`}>
      <div className="stats-icon">
        {icon}
      </div>

      <div>
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

function SolutionCard({ title, description }) {
  return (
    <div className="solution-card">
      <h3 className="solution-title">{title}</h3>
      <p className="solution-description">{description}</p>
    </div>
  );
}

export default SolutionCard;

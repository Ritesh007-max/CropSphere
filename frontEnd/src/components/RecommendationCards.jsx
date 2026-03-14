import { AlertTriangle, CalendarRange, Droplets, IndianRupee, Leaf, ShieldAlert } from "lucide-react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getIcon(type) {
  const icons = {
    recommendation: Leaf,
    profitability: IndianRupee,
    resources: Droplets,
    weather: CalendarRange,
    risk: ShieldAlert,
    "action-plan": AlertTriangle,
  };

  return icons[type] || Leaf;
}

function CardBody({ card }) {
  const { content, type } = card;

  if (type === "recommendation") {
    return (
      <>
        <strong>{content.crop}</strong>
        <p>{content.reason}</p>
        <div className="metric-row">
          <span>Success rate</span>
          <strong>{content.successRate}/100</strong>
        </div>
      </>
    );
  }

  if (type === "profitability") {
    return (
      <div className="stack">
        <div className="metric-row"><span>Gross revenue</span><strong>{formatCurrency(content.grossRevenue)}</strong></div>
        <div className="metric-row"><span>Estimated cost</span><strong>{formatCurrency(content.estimatedCost)}</strong></div>
        <div className="metric-row"><span>Net profit</span><strong>{formatCurrency(content.netProfit)}</strong></div>
      </div>
    );
  }

  if (type === "resources") {
    return (
      <div className="stack">
        <p>{content.water}</p>
        <p>{content.irrigation}</p>
        <p>{content.labour}</p>
        <p>{content.budget}</p>
        <ul>
          {content.inputs.map((input) => (
            <li key={input}>{input}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (type === "weather") {
    return (
      <div className="stack">
        <p>{content.plantingWindow}</p>
        <p>Crop cycle: {content.cropDuration}</p>
      </div>
    );
  }

  if (type === "risk") {
    return (
      <div className="stack">
        <strong className={`risk-badge risk-${content.level}`}>{content.level}</strong>
        <p>{content.note}</p>
      </div>
    );
  }

  return (
    <ul>
      {content.map((step) => (
        <li key={step.dayRange}>
          <strong>{step.dayRange}</strong>
          <span>{step.task}</span>
        </li>
      ))}
    </ul>
  );
}

function RecommendationCards({ recommendations }) {
  const primaryRecommendation = recommendations?.[0] || null;

  if (!primaryRecommendation) {
    return (
      <section className="results-shell empty-state">
        <h2>Predictions appear here</h2>
        <p>Submit farm details to generate crop recommendations, success rate, profitability, resources, weather fit, risk, and a 30-day plan.</p>
      </section>
    );
  }

  return (
    <section className="results-shell">
      <div className="top-crop-strip">
        {recommendations.map((item, index) => (
          <div key={item.cropId} className={`top-crop-item ${index === 0 ? "top-crop-item-active" : ""}`}>
            <strong>{item.cropName}</strong>
            <span>{item.successRate}/100</span>
          </div>
        ))}
      </div>
      <div className="results-header">
        <div>
          <span className="eyebrow">Recommended crop</span>
          <h2>{primaryRecommendation.cropName}</h2>
        </div>
        <div className="score-pill">{primaryRecommendation.successRate}/100 success rate</div>
      </div>
      <div className="cards-grid">
        {primaryRecommendation.cards.map((card) => {
          const Icon = getIcon(card.type);

          return (
            <article key={card.id} className="result-card">
              <div className="card-title">
                <Icon size={18} />
                <h3>{card.title}</h3>
              </div>
              <CardBody card={card} />
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default RecommendationCards;

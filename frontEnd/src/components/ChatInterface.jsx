import { Bot, ChevronRight, LoaderCircle, Sprout } from "lucide-react";
import InputBox from "./inputBox";
import RecommendationCards from "./RecommendationCards";

function ChatInterface({
  sessions,
  activeSessionId,
  onSelectSession,
  formState,
  districts,
  onFieldChange,
  onSubmit,
  loading,
  errorMessage,
  activeRecommendations,
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="eyebrow">Farm Plans</span>
          <h2>Previous sessions</h2>
        </div>
        <div className="session-list">
          {sessions.map((session) => (
            <button
              type="button"
              key={session.id}
              className={`session-card ${activeSessionId === session.id ? "active" : ""}`}
              onClick={() => onSelectSession(session.id)}
            >
              <div>
                <strong>{session.title}</strong>
                <p>{session.subtitle}</p>
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </aside>

      <main className="main-panel">
        <div className="panel-topbar">
          <div className="brand">
            <div className="brand-mark">
              <Sprout size={18} />
            </div>
            <div>
              <strong>AgriMind AI</strong>
              <p>Guided crop decisions for the next planting cycle</p>
            </div>
          </div>
          <button type="button" className="primary-action" onClick={onSubmit} disabled={loading}>
            {loading ? <LoaderCircle size={16} className="spin" /> : <Bot size={16} />}
            <span>{loading ? "Analyzing..." : "Recommend crops"}</span>
          </button>
        </div>

        <InputBox
          formState={formState}
          districts={districts}
          onFieldChange={onFieldChange}
        />

        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

        <RecommendationCards recommendations={activeRecommendations} />
      </main>
    </div>
  );
}

export default ChatInterface;

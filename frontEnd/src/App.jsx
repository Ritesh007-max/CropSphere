import { useEffect, useState } from "react";
import axios from "axios";
import ChatInterface from "./components/ChatInterface";
import { regionOptions } from "./data/options";

const API_BASE_URL = "/api/recommend-crop";

const defaultFormState = {
  state: "Andhra Pradesh",
  district: "West Godavari",
  landSize: 8,
  irrigation: true,
  waterSource: "canal",
  budget: "medium",
  labour: "medium",
  previousCrop: "",
};

function App() {
  const [formState, setFormState] = useState(defaultFormState);
  const [districts, setDistricts] = useState(regionOptions);
  const [sessions, setSessions] = useState([
    {
      id: "draft-session",
      title: "Current plan",
      subtitle: "No recommendation generated yet",
      recommendations: null,
      profile: defaultFormState,
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState("draft-session");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    axios
      .get(`${API_BASE_URL}/regions`)
      .then((response) => {
        if (!ignore) {
          setDistricts(response.data);
        }
      })
      .catch(() => {
        if (!ignore) {
          setDistricts(regionOptions);
          setErrorMessage("Backend not reachable. Start the Express server on port 5000.");
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const activeSession = sessions.find((session) => session.id === activeSessionId) || sessions[0];

  function updateField(field, value) {
    setFormState((current) => {
      if (field === "state") {
        return {
          ...current,
          state: value,
          district: (districts[value] || [])[0] || "",
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });
  }

  function handleSelectSession(sessionId) {
    const selected = sessions.find((session) => session.id === sessionId);
    if (!selected) {
      return;
    }

    setActiveSessionId(sessionId);
    setFormState(selected.profile);
  }

  async function handleSubmit() {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(API_BASE_URL, formState);
      const topRecommendations = response.data.topRecommendations || [];
      const topRecommendation = topRecommendations[0] || null;
      const sessionId = `session-${Date.now()}`;
      const nextSession = {
        id: sessionId,
        title: `${formState.state} / ${formState.district}`,
        subtitle: topRecommendation ? `${topRecommendation.cropName} at ${topRecommendation.successRate}/100 success rate` : "No crop match",
        recommendations: topRecommendations,
        profile: { ...formState },
      };

      setSessions((current) => [nextSession, ...current]);
      setActiveSessionId(sessionId);
    } catch (error) {
      console.error("Recommendation request failed", error);
      const nextMessage = error.response?.data?.error || "Unable to reach the recommendation API. Start the backend server on http://localhost:5000 and retry.";
      setErrorMessage(nextMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ChatInterface
      sessions={sessions}
      activeSessionId={activeSessionId}
      onSelectSession={handleSelectSession}
      formState={formState}
      districts={districts}
      onFieldChange={updateField}
      onSubmit={handleSubmit}
      loading={loading}
      errorMessage={errorMessage}
      activeRecommendations={activeSession?.recommendations || null}
    />
  );
}

export default App;

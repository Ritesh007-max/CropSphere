import { useEffect, useState } from "react";
import axios from "axios";
import ChatInterface from "./components/ChatInterface";
import { regionOptions } from "./data/options";

const API_BASE_URL = "/api/recommend-crop";

const defaultFormState = {
  state: "Andhra Pradesh",
  district: "West Godavari",
  landArea: 5,
  budget: 50000,
  labour: "medium",
  previousCrop: "",
};

function App() {
  const [formState, setFormState] = useState(defaultFormState);
  const [districts, setDistricts] = useState(regionOptions);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    axios
      .get(`${API_BASE_URL}/regions`)
      .then((response) => {
        if (!ignore) setDistricts(response.data);
      })
      .catch(() => {
        if (!ignore) setDistricts(regionOptions);
      });
    return () => { ignore = true; };
  }, []);

  function updateField(field, value) {
    setFormState((current) => {
      if (field === "state") {
        return { ...current, state: value, district: (districts[value] || [])[0] || "" };
      }
      return { ...current, [field]: value };
    });
  }

  async function handleSubmit() {
    setLoading(true);
    setErrorMessage("");
    setResult(null);
    setActiveFilter(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/farm-input`, formState);
      const data = response.data;
      setResult(data);

      // Save to session history
      const session = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        state: formState.state,
        district: formState.district,
        topCrop: data.top_crops?.[0]?.crop || "N/A",
        score: data.top_crops?.[0]?.suitability_score || 0,
        result: data,
        formState: { ...formState },
      };
      setSessions((prev) => [session, ...prev]);
    } catch (error) {
      const nextMessage =
        error.response?.data?.error ||
        "Unable to reach the recommendation API. Ensure the backend is running on port 5000.";
      setErrorMessage(nextMessage);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectSession(session) {
    setResult(session.result);
    setFormState(session.formState);
    setActiveFilter(null);
    setSidebarOpen(false);
  }

  return (
    <ChatInterface
      formState={formState}
      districts={districts}
      onFieldChange={updateField}
      onSubmit={handleSubmit}
      loading={loading}
      errorMessage={errorMessage}
      result={result}
      sessions={sessions}
      onSelectSession={handleSelectSession}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    />
  );
}

export default App;

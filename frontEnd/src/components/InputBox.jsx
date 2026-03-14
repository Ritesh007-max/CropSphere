function InputBox({ formState, districts, onFieldChange }) {
  return (
    <div className="workspace-grid">
      <section className="hero-card">
        <span className="eyebrow">AgriMind AI</span>
        <h1>How can I help you today?</h1>
        <p>
          Share your farm conditions and AgriMind AI will estimate success rate,
          profit, resource needs, risk, and the first 30 days of action.
        </p>
      </section>

      <section className="form-card">
        <div className="section-header">
          <span>1. Farm Location</span>
        </div>
        <div className="field-grid">
          <label>
            <span>State</span>
            <select value={formState.state} onChange={(event) => onFieldChange("state", event.target.value)}>
              <option value="">Select state</option>
              {Object.keys(districts).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>District</span>
            <select value={formState.district} onChange={(event) => onFieldChange("district", event.target.value)} disabled={!formState.state}>
              <option value="">Select district</option>
              {(districts[formState.state] || []).map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="form-card">
        <div className="section-header">
          <span>2. Land & Resources</span>
        </div>
        <div className="slider-group">
          <div className="slider-copy">
            <span>Land size</span>
            <strong>{formState.landSize} acres</strong>
          </div>
          <input type="range" min="1" max="50" value={formState.landSize} onChange={(event) => onFieldChange("landSize", Number(event.target.value))} />
        </div>
        <div className="toggle-row">
          <div>
            <span>Irrigation available</span>
            <small>{formState.irrigation ? "Yes" : "No"}</small>
          </div>
          <button type="button" className={`toggle ${formState.irrigation ? "active" : ""}`} onClick={() => onFieldChange("irrigation", !formState.irrigation)}>
            <span />
          </button>
        </div>
        <label>
          <span>Water source</span>
          <select value={formState.waterSource} onChange={(event) => onFieldChange("waterSource", event.target.value)}>
            <option value="">Select source</option>
            <option value="canal">Canal</option>
            <option value="borewell">Borewell</option>
            <option value="drip">Drip</option>
            <option value="rainfed">Rainfed</option>
          </select>
        </label>
      </section>

      <section className="form-card">
        <div className="section-header">
          <span>3. Budget & Labour</span>
        </div>
        <div className="field-grid">
          <label>
            <span>Budget range</span>
            <select value={formState.budget} onChange={(event) => onFieldChange("budget", event.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label>
            <span>Labour available</span>
            <select value={formState.labour} onChange={(event) => onFieldChange("labour", event.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
      </section>

      <section className="form-card">
        <div className="section-header">
          <span>4. Crop History</span>
        </div>
        <label>
          <span>Previous crop</span>
          <select value={formState.previousCrop} onChange={(event) => onFieldChange("previousCrop", event.target.value)}>
            <option value="">Skip for now</option>
            {["Rice", "Maize", "Cotton", "Soybean", "Wheat", "Pulses", "Groundnut", "Vegetables", "Black Gram", "Green Gram", "Chilli"].map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </label>
      </section>
    </div>
  );
}

export default InputBox;

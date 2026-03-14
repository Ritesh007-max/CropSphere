import { MapPin, Landmark, Tractor, IndianRupee, Users, Wheat } from "lucide-react";
import { previousCropOptions } from "../data/options";

function InputBox({ formState, districts, onFieldChange }) {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 text-white p-6 sm:p-8 shadow-xl shadow-brand-600/15">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-500/20 blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-brand-400/10 blur-2xl translate-y-1/2 -translate-x-1/4" />
        <div className="relative">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-brand-200 bg-white/10 px-3 py-1 rounded-full mb-4">
            AgriMind AI — Decision Engine
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl leading-tight mb-2">
            Grow smarter, harvest better
          </h1>
          <p className="text-brand-100/80 max-w-lg text-sm leading-relaxed">
            Enter your farm details below and AgriMind AI will analyse real-time weather, 
            evaluate 25 crops, and recommend the top 3 best-fit options for your farm.
          </p>
        </div>
      </section>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Location */}
        <div className="bg-white rounded-2xl border border-gray-200/70 p-5 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-300" id="section-location">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
              <MapPin size={16} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-sm text-gray-900">Farm Location</h3>
              <p className="text-[11px] text-gray-400">Where is your farm?</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">State</label>
              <select id="input-state" value={formState.state}
                onChange={(e) => onFieldChange("state", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-surface-100 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all hover:border-gray-300"
              >
                <option value="">Select state</option>
                {Object.keys(districts).map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">District</label>
              <select id="input-district" value={formState.district}
                onChange={(e) => onFieldChange("district", e.target.value)}
                disabled={!formState.state}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-surface-100 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all hover:border-gray-300 disabled:opacity-50"
              >
                <option value="">Select district</option>
                {(districts[formState.state] || []).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Land Area */}
        <div className="bg-white rounded-2xl border border-gray-200/70 p-5 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-300" id="section-land">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Landmark size={16} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-sm text-gray-900">Land Area</h3>
              <p className="text-[11px] text-gray-400">How much land do you have?</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-medium text-gray-500">Acreage</label>
              <span className="text-sm font-display font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-lg">
                {formState.landArea} acres
              </span>
            </div>
            <input
              id="input-land-area"
              type="range" min="1" max="100" step="1"
              value={formState.landArea}
              onChange={(e) => onFieldChange("landArea", Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-gray-400 px-0.5">
              <span>1 acre</span>
              <span>50 acres</span>
              <span>100 acres</span>
            </div>
          </div>
        </div>

        {/* Card 3: Budget */}
        <div className="bg-white rounded-2xl border border-gray-200/70 p-5 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-300" id="section-budget">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <IndianRupee size={16} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-sm text-gray-900">Budget</h3>
              <p className="text-[11px] text-gray-400">Your total farming budget</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[12px] font-medium text-gray-500">Total Budget</label>
              <span className="text-sm font-display font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                ₹{Number(formState.budget).toLocaleString("en-IN")}
              </span>
            </div>
            <input
              id="input-budget"
              type="range" min="5000" max="500000" step="5000"
              value={formState.budget}
              onChange={(e) => onFieldChange("budget", Number(e.target.value))}
            />
            <div className="flex justify-between text-[10px] text-gray-400 px-0.5">
              <span>₹5K</span>
              <span>₹2.5L</span>
              <span>₹5L</span>
            </div>
          </div>
        </div>

        {/* Card 4: Labour & Crop History */}
        <div className="bg-white rounded-2xl border border-gray-200/70 p-5 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-300" id="section-labour">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
              <Users size={16} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-sm text-gray-900">Labour & History</h3>
              <p className="text-[11px] text-gray-400">Resources & previous crop</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">
                <span className="flex items-center gap-1"><Tractor size={12} /> Labour</span>
              </label>
              <select id="input-labour" value={formState.labour}
                onChange={(e) => onFieldChange("labour", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-surface-100 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all hover:border-gray-300"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">
                <span className="flex items-center gap-1"><Wheat size={12} /> Previous Crop</span>
              </label>
              <select id="input-previous-crop" value={formState.previousCrop}
                onChange={(e) => onFieldChange("previousCrop", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-surface-100 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all hover:border-gray-300"
              >
                <option value="">None / Skip</option>
                {previousCropOptions.map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputBox;

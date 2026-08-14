"use client";

import { useEffect, useState, useCallback } from "react";
import { Save } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5024";

interface AppSettings {
  id?: string;
  applicationName: string;
  allowStudentRegistration: boolean;
  allowTeacherRegistration: boolean;
  maxFileSizeMB: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) setSettings(await res.json());
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) setMessage("Settings saved successfully!");
    } catch (error) {
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (!settings) return <div className="p-6 text-gray-500">Loading settings...</div>;

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Application Name</label>
          <input 
            type="text" 
            value={settings.applicationName}
            onChange={(e) => setSettings({...settings, applicationName: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Allow Student Signup</span>
            <input 
              type="checkbox" 
              checked={settings.allowStudentRegistration}
              onChange={(e) => setSettings({...settings, allowStudentRegistration: e.target.checked})}
              className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50">
            <span className="text-sm font-medium text-gray-700">Allow Teacher Signup</span>
            <input 
              type="checkbox" 
              checked={settings.allowTeacherRegistration}
              onChange={(e) => setSettings({...settings, allowTeacherRegistration: e.target.checked})}
              className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Upload File Size (MB)</label>
          <input 
            type="number" 
            min="1"
            max="100"
            value={settings.maxFileSizeMB}
            onChange={(e) => setSettings({...settings, maxFileSizeMB: Number(e.target.value)})}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="pt-4 border-t flex items-center justify-between">
          <span className={`text-sm ${message.includes("success") ? "text-emerald-600" : "text-red-500"}`}>
            {message}
          </span>
          <button 
            type="submit" 
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> 
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
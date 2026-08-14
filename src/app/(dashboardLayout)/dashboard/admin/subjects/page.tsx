"use client";
import { useEffect, useState, useCallback } from "react";
import { Trash2, Plus } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5024";

interface Subject {
  id: number;
  code: string;
  name: string;
  courseName?: string;
}

interface Course {
  id: number;
  name: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [courseId, setCourseId] = useState("");

  const fetchData = useCallback(async () => {
    const headers = { "Authorization": `Bearer ${localStorage.getItem("token")}` };
    const [subRes, crsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/admin/subjects`, { headers }),
      fetch(`${API_BASE_URL}/api/admin/courses`, { headers })
    ]);
    setSubjects(await subRes.json());
    setCourses(await crsRes.json());
  }, []);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API_BASE_URL}/api/admin/subjects`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ name, code, courseId: Number(courseId) })
    });
    setName(""); setCode(""); setCourseId("");
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this subject?")) return;
    await fetch(`${API_BASE_URL}/api/admin/subjects/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Manage Subjects</h2>
      
      <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-end flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-gray-700">Course</label>
          <select required value={courseId} onChange={(e) => setCourseId(e.target.value)} className="mt-1 block w-full p-2 border border-gray-200 rounded-lg">
            <option value="">Select Course...</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-gray-700">Subject Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Database Systems" className="mt-1 block w-full p-2 border border-gray-200 rounded-lg" />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="text-sm font-medium text-gray-700">Subject Code</label>
          <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. CSE-3101" className="mt-1 block w-full p-2 border border-gray-200 rounded-lg" />
        </div>
        <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4"/> Add Subject
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-sm text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Code</th>
              <th className="px-6 py-4 font-semibold">Subject</th>
              <th className="px-6 py-4 font-semibold">Course</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subjects.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{s.code}</td>
                <td className="px-6 py-4 text-gray-600">{s.name}</td>
                <td className="px-6 py-4 text-emerald-600 bg-emerald-50/50">{s.courseName}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
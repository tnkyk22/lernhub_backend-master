"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Faculty {
  Id: number;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

interface ApiError {
  message: {
    name: string;
    clientVersion: string;
  };
}

export default function FacultyTable() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newFacultyName, setNewFacultyName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const filteredFaculties = faculties.filter((faculty) =>
    faculty.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function addFaculty(e: React.FormEvent) {
    e.preventDefault();
    if (!newFacultyName.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await axios.post("/api/faculty", { name: newFacultyName });
      if (res.status === 200 && res.data) {
        setFaculties(prev => [res.data, ...prev]);
        setNewFacultyName("");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มคณะ";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteFaculty(id: number, name: string) {
    const isConfirmed = window.confirm(`ต้องการลบคณะ "${name}" หรือไม่?`);
    if (!isConfirmed) return;

    try {
        const res = await axios.delete(`/api/faculty/${id}`);
        if (res.status === 200) {
            setFaculties(prev => prev.filter((faculty) => faculty.Id !== id));
            alert("ลบคณะสำเร็จ"); // แสดง alert เมื่อการลบสำเร็จ
        }
    } catch (error: any) {
        // แสดง alert เมื่อเกิดข้อผิดพลาด
        const errorMessage = error.response?.data?.error || "เกิดข้อผิดพลาดในการลบคณะ";
        alert(errorMessage);
    }
}

  async function editFaculty(id: number, currentName: string) {
    const newName = prompt(`แก้ไขชื่อของ "${currentName}":`, currentName);
    if (!newName || newName === currentName) return;

    try {
      const res = await axios.put(`/api/faculty/${id}`, { name: newName });
      if (res.status === 200) {
        setFaculties(prev => 
          prev.map((faculty) =>
            faculty.Id === id ? { ...faculty, Name: newName } : faculty
          )
        );
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "เกิดข้อผิดพลาดในการแก้ไขคณะ";
      alert(errorMessage);
    }
  }

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("/api/faculty");
        
        // Check if response contains error message
        if (res.data && 'message' in res.data && typeof res.data.message === 'object') {
          const apiError = res.data as ApiError;
          throw new Error(`Database Error: ${apiError.message.name}`);
        }

        // Validate that response is an array
        if (!Array.isArray(res.data)) {
          throw new Error("รูปแบบข้อมูลที่ได้รับไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
        }

        setFaculties(res.data);
      } catch (err: any) {
        console.error("API error:", err);
        let errorMessage: string;

        if (err.response?.data?.message?.name === 'PrismaClientValidationError') {
          errorMessage = "เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล กรุณาลองใหม่อีกครั้ง";
        } else {
          errorMessage = err.message || err.response?.data?.message || "ไม่สามารถดึงข้อมูลคณะได้";
        }

        setError(errorMessage);
        setFaculties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculties();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">กำลังโหลด...</span>
      </div>
    );
  }

  return (
    <div className="p-6 font-prompt">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 mb-4">
          <button 
            onClick={() => window.history.back()} 
            className="bg-gray-200 p-2 rounded-lg h-12 hover:bg-gray-300 transition duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </button>
          <div className="flex items-center">
            <div className="flex items-center bg-[#0099FF] text-white px-4 py-2 rounded-l-lg">
              <span className="text-2xl font-semibold">รายชื่อคณะ</span>
            </div>
            <div className="bg-blue-200 text-[#262626] px-3 py-2 rounded-r-lg text-lg font-light h-12 flex items-center">
              {filteredFaculties.length}/{faculties.length} คณะ
            </div>
          </div>
        </div>

        <div className="relative mb-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="🔎 ค้นหาชื่อคณะ"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-4 py-2 h-12 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 bg-gray-200 px-2 py-1 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              ✖
            </button>
          )}
        </div>
      </div>

      <form onSubmit={addFaculty} className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="กรอกชื่อคณะ"
          value={newFacultyName}
          onChange={(e) => setNewFacultyName(e.target.value)}
          className="border rounded px-4 py-2 h-12 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !newFacultyName.trim()}
          className={`bg-[#0099FF] text-white rounded h-12 px-4 transition duration-200 w-24
            ${isSubmitting || !newFacultyName.trim() 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-blue-600'}`}
        >
          {isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่มคณะ'}
        </button>
      </form>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">เกิดข้อผิดพลาด! </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-md">
            <thead className="bg-gray-100 font-medium">
              <tr>
                <th className="p-3 border border-gray-300 text-center">#</th>
                <th className="p-3 border border-gray-300 text-left">ชื่อคณะ</th>
                <th className="p-3 border border-gray-300 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculties.length > 0 ? (
                filteredFaculties.map((faculty, index) => (
                  <tr key={faculty.Id} className="hover:bg-gray-50">
                    <td className="p-3 border text-center">{index + 1}</td>
                    <td className="p-3 border">{faculty.Name}</td>
                    <td className="p-3 border text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => editFaculty(faculty.Id, faculty.Name)}
                          className="bg-yellow-500 text-[#262626] px-3 py-1 rounded hover:bg-yellow-600 transition duration-200"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => deleteFaculty(faculty.Id, faculty.Name)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-gray-500 p-4">
                    ไม่พบคณะที่ตรงกับ "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Faculty {
    Id: number;
    Name: string;
}

interface Department {
    Id: number;
    Name: string;
    facultyId: number;
    FacultyName?: string; // เพิ่ม field สำหรับชื่อคณะ
}

export default function DepartmentTable() {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [selectedFaculty, setSelectedFaculty] = useState<number | "">("");
    const [newDepartName, setNewDepartName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        async function fetchData() {
            try {
                const facultyRes = await axios.get("/api/faculty");
                setFaculties(facultyRes.data);

                const departmentRes = await axios.get("/api/department");
                const allDepartments = departmentRes.data.map((dep: Department) => ({
                    ...dep,
                    FacultyName: facultyRes.data.find((f: Faculty) => f.Id === dep.facultyId)?.Name || "ไม่ทราบ"
                }));

                setDepartments(allDepartments);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch data.");
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredDepartments = departments.filter((d) =>
        d.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    async function AddDepart() {
        if (!selectedFaculty) {
            alert("กรุณาเลือกคณะก่อนเพิ่มสาขา");
            return;
        }
        try {
            const res = await axios.post("/api/department", { Name: newDepartName, facultyId: selectedFaculty });
            if (res.status === 200) {
                const newDepartment = {
                    ...res.data,
                    FacultyName: faculties.find((f) => f.Id === selectedFaculty)?.Name || "ไม่ทราบ"
                };
                setDepartments([...departments, newDepartment]);
                setNewDepartName("");
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาด", error);
        }
    }

    async function DeleteDepartment(id: number) {
        try {
            const res = await axios.delete(`/api/department/${id}`);
            if (res.status === 200) {
                setDepartments(departments.filter((d) => d.Id !== id));
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาด", error);
        }
    }

    const EditDepartment = async (id: number, newName: string) => {
        try {
            console.log("🟢 Sending PUT request:", { id, newName });
    
            const response = await axios.put(`/api/department/${id}`, {
                name: newName, // ตรวจสอบว่ามีค่า name หรือไม่
            });
    
            console.log("✅ Update Success:", response.data);
        } catch (error) {
            console.error("❌ Update Failed:", error);
        }
    };
    

    const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
    const currentDepartments = filteredDepartments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-6 font-prompt">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => window.history.back()} className="bg-gray-200 p-2 rounded-lg h-12 hover:bg-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        </svg>
                    </button>
                    <div className="flex items-center">
                        <div className="flex items-center bg-[#00C851] text-white px-4 py-2 rounded-l-lg">
                            <span className="text-2xl font-semibold">รายชื่อสาขา</span>
                        </div>
                        <div className="bg-green-200 text-[#262626] px-3 py-2 rounded-r-lg text-lg font-light h-12 flex items-center">
                            {filteredDepartments.length}/{departments.length} สาขา
                        </div>
                    </div>
                </div>

                <div className="mb-4 flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="🔎 ค้นหาชื่อสาขา"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border rounded px-4 py-2 h-12 w-full"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-9 bg-gray-200 px-2 py-1 rounded-lg hover:bg-gray-300"
                        >
                            ✖
                        </button>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <label className="block mb-1">คณะ :</label>
                <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(Number(e.target.value) || "")}
                    className="border rounded p-2 w-full"
                >
                    <option value="">เลือกคณะ</option>
                    {faculties.map((faculty) => (
                        <option key={faculty.Id} value={faculty.Id}>{faculty.Name}</option>
                    ))}
                </select>
            </div>

            {selectedFaculty && (
                <div className="mb-4 flex gap-2 w-full">
                    <input
                        type="text"
                        placeholder="ใส่ชื่อสาขาใหม่"
                        value={newDepartName}
                        onChange={(e) => setNewDepartName(e.target.value)}
                        className="border px-2 rounded h-12 w-full"
                    />
                    <button
                        onClick={AddDepart}
                        className="bg-[#00C851] text-white px-2 rounded hover:bg-green-600 h-12 w-24"
                    >
                        เพิ่มสาขา
                    </button>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border border-gray-300 text-center">#</th>
                            <th className="p-3 border border-gray-300 text-left">ชื่อสาขา</th>
                            <th className="p-3 border border-gray-300 text-left">ชื่อคณะ</th>
                            <th className="p-3 border border-gray-300 text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDepartments.length > 0 ? (
                            currentDepartments.map((D, index) => (
                                <tr key={D.Id} className="hover:bg-gray-50">
                                    <td className="p-3 border border-gray-300 text-center">{index + 1}</td>
                                    <td className="p-3 border border-gray-300">{D.Name}</td>
                                    <td className="p-3 border border-gray-300 ">{D.FacultyName}</td>
                                    <td className="p-3 border border-gray-300 text-center flex gap-2 justify-center">
                                        <button
                                            onClick={() => DeleteDepartment(D.Id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            ลบ
                                        </button>
                                        <button
                                            onClick={() => {
                                                const newName = prompt(`แก้ไขชื่อของ "${D.Name}":`, D.Name);
                                                if (newName) EditDepartment(D.Id, newName);
                                            }}
                                            className="bg-yellow-500 text-[#262626] px-3 py-1 rounded hover:bg-yellow-600"
                                        >
                                            แก้ไข
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center text-gray-500 p-4">
                                    ไม่พบสาขาที่ตรงกับ &quot;{searchQuery}&quot;
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">◄</button>
                <span>หน้า {currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">►</button>
            </div>
        </div>
    );
}

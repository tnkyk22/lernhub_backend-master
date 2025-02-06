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
}

interface User {
    Id: number;
    UserName: string;
    Email: string;
    facultyId: number;
    departmentId: number;
    Faculty?: Faculty;
    Department?: Department;
}

export default function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("/api/users");
                setUsers(res.data);
            } catch (err) {
                setError("Failed to fetch users.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            user.UserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.Email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    async function deleteUser (id: number, name: string) {
        const isConfirmed = window.confirm(`ต้องการลบผู้ใช้ "${name}" หรือไม่?`);
        if (!isConfirmed) return;
    
        try {
            const res = await axios.delete(`/api/users/${id}`);
            if (res.status === 200) {
                setUsers(users.filter((user) => user.Id !== id));
                alert("ลบผู้ใช้สำเร็จ"); // แสดง alert เมื่อการลบสำเร็จ
            }
        } catch (error: any) {
            console.error("เกิดข้อผิดพลาด", error);
            const errorMessage = error.response?.data?.error || "ไม่สามารถลบผู้ใช้งาน เนื่องจากมีการอัปโหลดโน้ตสรุป"; 
            alert(errorMessage);
        }
    }

    return (
        <div className="p-6 font-prompt">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2 mb-4">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-gray-200 p-2 rounded-lg h-12 hover:bg-gray-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        </svg>
                    </button>
                    <div className="flex items-center">
                        <div className="flex items-center bg-[#0099FF] text-white px-4 py-2 rounded-l-lg">
                            <span className="text-2xl font-semibold">รายชื่อผู้ใช้</span>
                        </div>
                        <div className="bg-blue-200 text-[#262626] px-3 py-2 rounded-r-lg text-lg font-light h-12 flex items-center">
                            {filteredUsers.length}/{users.length} คน
                        </div>
                    </div>
                </div>
                <div className="mb-4 flex items-center gap-2 relative">
                    <input
                        type="text"
                        placeholder="🔎 ค้นหาผู้ใช้งาน"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border rounded px-4 py-2 h-12 w-full"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 bg-gray-200 px-2 py-1 rounded-lg hover:bg-gray-300"
                        >
                            ✖
                        </button>
                    )}
                </div>
            </div>
            {loading ? (
                <p className="text-center text-gray-500">กำลังโหลด...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 shadow-md">
                        <thead className="bg-gray-100 font-medium">
                            <tr>
                                <th className="p-3 border border-gray-300 text-center">ID</th>
                                <th className="p-3 border border-gray-300 text-left">ชื่อผู้ใช้</th>
                                <th className="p-3 border border-gray-300 text-left">อีเมล</th>
                                <th className="p-3 border border-gray-300 text-left">คณะ</th>
                                <th className="p-3 border border-gray-300 text-left">สาขา</th>
                                <th className="p-3 border border-gray-300 text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.Id} className="hover:bg-gray-50">
                                        <td className="p-3 border text-center">{user.Id}</td>
                                        <td className="p-3 border">{user.UserName}</td>
                                        <td className="p-3 border">{user.Email}</td>
                                        <td className="p-3 border">{user.Faculty?.Name ?? "-"}</td>
                                        <td className="p-3 border">{user.Department?.Name ?? "-"}</td>
                                        <td className="p-3 border text-center flex gap-2 justify-center">
                                            <button
                                                onClick={() => deleteUser (user.Id, user.UserName)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                ลบ
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center text-gray-500 p-4">
                                        ไม่พบผู้ใช้งานที่ตรงกับ "{searchQuery}"
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
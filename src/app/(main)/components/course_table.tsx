"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Course {
    Id: number;
    Course_Id: string;
    Sheet?: any[];
}

export default function CourseTable() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newCourseId, setNewCourseId] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const filteredCourses = courses.filter((course) =>
        course.Course_Id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get("/api/course");
                setCourses(res.data);
            } catch (err) {
                setError("Failed to fetch courses.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    async function addCourse() {
        if (!newCourseId.trim()) {
            return alert("กรุณากรอก Course ID");
        }
        try {
            const res = await axios.post("/api/course", { Course_Id: newCourseId });
            if (res.status === 201) {
                setCourses([...courses, res.data]);
                setNewCourseId("");
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาด", error);
        }
    }

    async function deleteCourse(id: number, courseId: string) {
        const isConfirmed = window.confirm(`ต้องการลบรหัสวิชา "${courseId}" หรือไม่?`);
        if (!isConfirmed) return;
    
        try {
            const res = await axios.delete(`/api/course/${id}`);
            if (res.status === 200) {
                setCourses(courses.filter((course) => course.Id !== id));
                alert("ลบรหัสวิชาสำเร็จ"); // แสดง alert เมื่อการลบสำเร็จ
            }
        } catch (error: any) {
            console.error("เกิดข้อผิดพลาด", error);
            // แสดง alert เมื่อเกิดข้อผิดพลาด
            const errorMessage = error.response?.data?.error || "เกิดข้อผิดพลาดในการลบรหัสวิชา เนื่องจากมีชื่อวิชาที่เกี่ยวข้อง"; 
            alert(errorMessage);
        }
    }

    async function editCourse(id: number, newId: string) {
        if (!newId.trim()) return;
        try {
            const res = await axios.put(`/api/course/${id}`, { Course_Id: newId });
            if (res.status === 200) {
                setCourses(
                    courses.map((course) =>
                        course.Id === id ? { ...course, Course_Id: newId } : course
                    )
                );
            }
        } catch (error) {
            console.error("Failed to edit course", error);
        }
    }

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
                        <div className="flex items-center bg-[#A833FF] text-white px-4 py-2 rounded-l-lg">
                            <span className="text-2xl font-semibold">รายชื่อหมวดวิชา</span>
                        </div>
                        <div className="bg-purple-200 text-[#262626] px-3 py-2 rounded-r-lg text-lg font-light h-12 flex items-center">
                            {filteredCourses.length}/{courses.length} หมวดวิชา
                        </div>
                    </div>
                </div>
                <div className="mb-4 flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="🔎 ค้นหาหมวดวิชา"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border rounded px-4 py-2 h-12 w-full"
                    />
                </div>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    placeholder="หมวดวิชา"
                    value={newCourseId}
                    onChange={(e) => setNewCourseId(e.target.value)}
                    className="border rounded p-2 h-12 w-full"
                />
                <button
                    onClick={addCourse}
                    className="bg-[#A833FF] text-white px-4 py-2 rounded hover:bg-purple-600 h-12 w-36"
                >
                    เพิ่มหมวดวิชา
                </button>
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
                                <th className="p-3 border border-gray-300 text-center">#</th>
                                <th className="p-3 border border-gray-300 text-center">หมวดวิชา</th>
                                <th className="p-3 border border-gray-300 text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.length > 0 ? (
                                filteredCourses.map((course, index) => (
                                    <tr key={course.Id} className="hover:bg-gray-50">
                                        <td className="p-3 border border-gray-300 text-center">{index + 1}</td>
                                        <td className="p-3 border border-gray-300 text-center">{course.Course_Id}</td>
                                        <td className="p-3 border border-gray-300 text-center flex gap-2 justify-center">
                                            <button
                                                onClick={() => deleteCourse(course.Id, course.Course_Id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                ลบ
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const newId = prompt(`แก้ไขรหัสของ "${course.Course_Id}":`, course.Course_Id);
                                                    if (newId) editCourse(course.Id, newId);
                                                }}
                                                className="bg-yellow-500 text-[#262626] px-3 py-1 rounded hover:bg-yellow-600">
                                                แก้ไข
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center text-gray-500 p-4">
                                        ไม่พบรหัสวิชาที่ตรงกับ &quot;{searchQuery}&quot;
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
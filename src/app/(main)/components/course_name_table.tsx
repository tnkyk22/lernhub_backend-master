"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Course {
    Id: number;
    Course_Id: string;
}

interface CourseName {
    Id: number;
    Name: string;
    courseId: number;
    Course_Id?: string;
}

export default function CourseNameTable() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [courseNames, setCourseNames] = useState<CourseName[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<number | "">("");
    const [newCourseName, setNewCourseName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);
            const courseRes = await axios.get("/api/course");
            const courseNameRes = await axios.get("/api/course_name");

            const allCourseNames = courseNameRes.data.map((cn: CourseName) => ({
                ...cn,
                Course_Id: courseRes.data.find((c: Course) => c.Id === cn.courseId)?.Course_Id || "ไม่ทราบ"
            }));

            setCourses(courseRes.data);
            setCourseNames(allCourseNames);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch data.");
            setLoading(false);
        }
    }

    const filteredCourseNames = courseNames.filter((cn) =>
        cn.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    async function AddCourseName() {
        if (!selectedCourse) {
            alert("กรุณาเลือกหลักสูตรก่อนเพิ่มชื่อหลักสูตรย่อย");
            return;
        }
        try {
            const res = await axios.post("/api/course_name", { Name: newCourseName, courseId: selectedCourse });
            if (res.status === 201) {
                setNewCourseName("");
                fetchData();
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาด", error);
        }
    }

    async function DeleteCourseName(id: number) {
        try {
            const res = await axios.delete(`/api/course_name/${id}`);
            if (res.status === 200) {
                fetchData();
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาด", error);
        }
    }
    async function editCourseName(id: number, newName: string) {
        if (!newName.trim()) return;
    
        try {
            const res = await axios.put(`/api/course_name/${id}`, { name: newName }); // แก้ key เป็น `name`
            if (res.status === 200) {
                setCourseNames(
                    courseNames.map((course) =>
                        course.Id === id ? { ...course, Name: newName } : course
                    )
                );
            }
        } catch (error) {
            console.error("Failed to edit course name", error);
        }
    }    

    const totalPages = Math.ceil(filteredCourseNames.length / itemsPerPage);
    const currentCourseNames = filteredCourseNames.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                        <div className="flex items-center bg-[#00CED1] text-white px-4 py-2 rounded-l-lg">
                            <span className="text-2xl font-semibold">รายชื่อรหัสวิชา</span>
                        </div>
                        <div className="bg-[#c8fdfe] text-[#262626] px-3 py-2 rounded-r-lg text-lg font-light h-12 flex items-center">
                            {filteredCourseNames.length}/{courseNames.length} รหัสวิชา
                        </div>
                    </div>
                </div>

                <div className="mb-4 flex items-center gap-2 relative">
                    <input
                        type="text"
                        placeholder="🔎 ค้นหารหัสวิชา"
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

            <div className="mb-4">
                <label className="block mb-1">หมวดวิชา :</label>
                <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(Number(e.target.value) || "")}
                    className="border rounded p-2 w-full"
                >
                    <option value="">เลือกหมวดวิชา</option>
                    {courses.map((course) => (
                        <option key={course.Id} value={course.Id}>{course.Course_Id}</option>
                    ))}
                </select>
            </div>

            {selectedCourse && (
                <div className="mb-4 flex gap-2 w-full">
                    <input
                        type="text"
                        placeholder="ใส่ชื่อหลักสูตรย่อยใหม่"
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        className="border px-2 rounded h-12 w-full"
                    />
                    <button onClick={AddCourseName} className="bg-[#00C851] text-white px-2 rounded hover:bg-green-600 h-12 w-24">
                        เพิ่ม
                    </button>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 shadow-md">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border border-gray-300 text-center">#</th>
                            <th className="p-3 border border-gray-300 text-left">หมวดวิชา</th>
                            <th className="p-3 border border-gray-300 text-left">รหัสวิชา</th>
                            <th className="p-3 border border-gray-300 text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCourseNames.length > 0 ? (
                            currentCourseNames.map((cn, index) => (
                                <tr key={cn.Id} className="hover:bg-gray-50">
                                    <td className="p-3 border border-gray-300 text-center">{index + 1}</td>
                                    <td className="p-3 border border-gray-300">{cn.Course_Id}</td>
                                    <td className="p-3 border border-gray-300">{cn.Name}</td>
                                    <td className="p-3 border border-gray-300 text-center flex gap-2 justify-center">
                                        <button onClick={() => DeleteCourseName(cn.Id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                            ลบ
                                        </button>
                                        <button
                                            onClick={() => {
                                                const newName = prompt(`แก้ไขชื่อวิชา "${cn.Name}":`, cn.Name);
                                                if (newName) editCourseName(cn.Id, newName);
                                            }}
                                            className="bg-yellow-500 text-[#262626] px-3 py-1 rounded hover:bg-yellow-600">
                                            แก้ไข
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center text-gray-500 p-4">
                                    ไม่พบชื่อวิชาที่ตรงกับ "{searchQuery}"
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

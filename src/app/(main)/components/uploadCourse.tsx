"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Course {
    Id: number;
    Course_Id: string;
    Sheet?: any[];
}

interface Sheet {
    Id: number;
    Name: string;
    Path: string;
    Thumbnail?: string;
    NoteType: string;
    CreatedById: number;
    CreatedAt: string;
    UpdatedAt: string;
    courseId?: number | null;
}

export default function UploadCourseTable() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoursesAndSheets = async () => {
            try {
                const courseRes = await axios.get("/api/course");
                const sheetRes = await axios.get("/api/sheet"); // Assuming you have an endpoint for sheets
                setCourses(courseRes.data);
                setSheets(sheetRes.data);
            } catch (err) {
                setError("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };
        fetchCoursesAndSheets();
    }, []);

    // Group sheets by courseId and count the number of sheets for each courseId
    const groupedSheets = sheets.reduce((acc, sheet) => {
        const courseId = sheet.courseId;
        if (courseId) {
            if (!acc[courseId]) {
                acc[courseId] = { count: 0, courseId: courseId };
            }
            acc[courseId].count += 1;
        }
        return acc;
    }, {} as { [key: number]: { count: number; courseId: number } });

    const groupedSheetsArray = Object.values(groupedSheets);

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
                        <div className="flex items-center bg-[#FF2D7A] text-white px-4 py-2 rounded-l-lg">
                            <span className="text-2xl font-semibold">รายงานจำนวนไฟล์ในแต่ละวิชา</span>
                        </div>
                        <div className="bg-pink-200 text-[#262626] px-3 py-2 rounded-r-lg text-lg font-light h-12 flex items-center">
                        </div>
                    </div>
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
                                <th className="p-3 border border-gray-300 text-center">รหัสวิชา</th>
                                <th className="p-3 border border-gray-300 text-center">จำนวนไฟล์</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length > 0 ? (
                                courses.map((course) => {
                                    const sheetCount = groupedSheets[course.Id]?.count || 0; // Get the count of sheets for this course
                                    return (
                                        <tr key={course.Id} className="hover:bg-gray-50">
                                            <td className="p-3 border border-gray-300 text-center">{course.Course_Id}</td>
                                            <td className="p-3 border border-gray-300 text-center">{sheetCount}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center text-gray-500 p-4">
                                        ไม่พบข้อมูล
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
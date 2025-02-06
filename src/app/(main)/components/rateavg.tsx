"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Rating {
    Score: number;
    User: { Id: number; Email: string };
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
    Ratings: Rating[]; // เพิ่ม Ratings ใน interface
}

export default function RateAVGTable() {
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchSheets = async () => {
            try {
                const response = await axios.get("/api/sheet"); // URL ของ API ที่ให้ข้อมูลชีท
                setSheets(response.data);
            } catch (err) {
                setError("Failed to fetch sheets.");
            } finally {
                setLoading(false);
            }
        };
        fetchSheets();
    }, []);

    // กรองข้อมูลเพื่อแสดงเฉพาะ NoteType ที่เป็น "Note" และ "Sheet"
    const filteredSheets = sheets.filter(sheet =>
        sheet.NoteType === "Note" || sheet.NoteType === "Sheet"
    );

    // คำนวณคะแนนเฉลี่ย
    const calculateAverageRating = (ratings: Rating[]): number => {
        if (ratings.length === 0) return 0;
        const totalScore = ratings.reduce((acc, rating) => acc + rating.Score, 0);
        return totalScore / ratings.length; // คืนค่าคะแนนเฉลี่ยเป็น number
    };

    // คำนวณคะแนนเฉลี่ยรวมสำหรับ Note และ Sheet
    const calculateOverallAverage = (type: string): number => {
        const relevantSheets = filteredSheets.filter(sheet => sheet.NoteType === type);
        const totalAverage = relevantSheets.reduce((acc, sheet) => acc + calculateAverageRating(sheet.Ratings), 0);
        return relevantSheets.length > 0 ? (totalAverage / relevantSheets.length).toFixed(2) : 0;
    };

    // การแบ่งหน้า
    const totalPages = Math.ceil(filteredSheets.length / itemsPerPage);
    const currentSheets = filteredSheets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                            <span className="text-2xl font-semibold">รายงานผลคะแนนเฉลี่ยความพึงพอใจ</span>
                        </div>
                        <div className="bg-pink-200 text-[#262626] px-3 py-2 rounded-r-lg text-lg font-light h-12 flex items-center">
                        </div>
                    </div>
                </div>
            </div>
            {/* ตารางคะแนนเฉลี่ยรวม */}
            <div className="overflow-x-auto mb-5">
                <table className="w-full border-collapse border border-gray-300 shadow-md">
                    <thead className="bg-gray-100 font-medium">
                        <tr>
                            <th className="p-3 border border-gray-300 text-center">ประเภท</th>
                            <th className="p-3 border border-gray-300 text-center">คะแนนเฉลี่ย</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-gray-50">
                            <td className="p-3 border border-gray-300 text-center">Note</td>
                            <td className="p-3 border border-gray-300 text-center">
                                {calculateOverallAverage("Note")}
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="p-3 border border-gray-300 text-center">Sheet</td>
                            <td className="p-3 border border-gray-300 text-center">
                                {calculateOverallAverage("Sheet")}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">กำลังโหลด...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full border-collapse border border-gray-300 shadow-md">
                            <thead className="bg-gray-100 font-medium">
                                <tr>
                                    <th className="p-3 border border-gray-300 text-center">ชื่อโน้ตสรุป</th>
                                    <th className="p-3 border border-gray-300 text-center">ประเภท</th>
                                    <th className="p-3 border border-gray-300 text-center">คะแนนเฉลี่ย</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentSheets.length > 0 ? (
                                    currentSheets.map((sheet) => (
                                        <tr key={sheet.Id} className="hover:bg-gray-50">
                                            <td className="p-3 border border-gray-300 text-center">{sheet.Name}</td>
                                            <td className="p-3 border border-gray-300 text-center">{sheet.NoteType}</td>
                                            <td className="p-3 border border-gray-300 text-center">
                                                {calculateAverageRating(sheet.Ratings)} {/* แสดงคะแนนเฉลี่ย */}
                                            </td>
                                        </tr>
                                    ))
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
                    <div className="flex justify-center items-center gap-2 mt-4">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">◄</button>
                        <span>หน้า {currentPage} / {totalPages}</span>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">►</button>
                    </div>
                </div>
            )}
        </div>
    );
}
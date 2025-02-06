"use client";
import { useEffect, useState } from "react";
import axios from "axios";

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

export default function UploadStatTable() {
    const [sheets, setSheets] = useState<Sheet[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    // Group sheets by NoteType and count the number of sheets for each NoteType
    const groupedSheets = sheets.reduce((acc, sheet) => {
        const noteType = sheet.NoteType;
        if (noteType) {
            if (!acc[noteType]) {
                acc[noteType] = { count: 0, noteType: noteType };
            }
            acc[noteType].count += 1;
        }
        return acc;
    }, {} as { [key: string]: { count: number; noteType: string } });

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
                            <span className="text-2xl font-semibold">รายงานสถิติการอัปโหลดไฟล์</span>
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
                                <th className="p-3 border border-gray-300 text-center">ประเภทโน้ต</th>
                                <th className="p-3 border border-gray-300 text-center">จำนวนไฟล์</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedSheetsArray.length > 0 ? (
                                groupedSheetsArray.map((group) => (
                                    <tr key={group.noteType} className="hover:bg-gray-50">
                                        <td className="p-3 border border-gray-300 text-center">{group.noteType}</td>
                                        <td className="p-3 border border-gray-300 text-center">{group.count}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="text-center text-gray-500 p-4">
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
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Report {
  Id: number;
  Content: string;
  ReportDate: string;
  Thumbnail: string;
  User: User;
  Sheet?: {
    Name: string;
  };
}

interface User {
  UserName: string;
}

export default function ReportSheetTable() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredReports = reports.filter((report) => {
    const sheetNameMatch = report.Sheet?.Name.toLowerCase().includes(searchQuery.toLowerCase());
    const userNameMatch = report.User.UserName.toLowerCase().includes(searchQuery.toLowerCase());
    return sheetNameMatch || userNameMatch;
});

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get("/api/reports"); // เปลี่ยน endpoint
        const reports: Report[] = res.data;
        setReports(reports);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch sheets.");
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <div className="p-4 text-center">กำลังโหลด...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const currentReports = filteredReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
              <span className="text-2xl font-semibold">ข้อมูลการแจ้งปัญหา</span>
            </div>
            <div className="bg-pink-200 text-[#262626] px-3 py-2 rounded-r-lg text-lg font-light h-12 flex items-center">
              {filteredReports.length}/{reports.length} ปัญหา
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="🔎 ค้นหาชื่อข้อมูลการแจ้งปัญหา"
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
     
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200 shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border border-gray-300 text-center">ID</th>
              <th className="p-3 border border-gray-300 text-left">ชื่อเอกสาร</th>
              <th className="p-3 border border-gray-300 text-left">เนื้อหารายงาน</th>
              <th className="p-3 border border-gray-300 text-left">วันที่รายงาน</th>
              <th className="p-3 border border-gray-300 text-left">ผู้รายงาน</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length > 0 ? (
              currentReports.map((report) => (
                <tr key={report.Id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300 text-center">{report.Id}</td>
                  <td className="p-3 border border-gray-300">
                    {report.Sheet ? report.Sheet.Name : 'N/A'}
                  </td>
                  <td className="p-3 border border-gray-300">{report.Content}</td>
                  <td className="p-3 border border-gray-300">
                    {new Date(report.ReportDate).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false, // ใช้ 24 ชั่วโมง
                    })}
                  </td>
                  <td className="p-3 border border-gray-300">{report.User.UserName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 p-4">
                  ไม่พบปัญหาที่ตรงกับ "{searchQuery}"
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

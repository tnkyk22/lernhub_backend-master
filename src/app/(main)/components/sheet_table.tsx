import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

// Define interfaces
interface Sheet {
  Id: number;
  Name: string;
  Path: string;
  Thumbnail?: string;
  NoteType: string;
  CreatedBy: Users;
  CreatedById: number;
  CreatedAt: string;
  UpdatedAt: string;
  Course?: Course | null;
  courseId?: number | null;
  Course_name?: CourseName | null;
  course_nameId?: number | null;
  Ratings: Rating[];
  Reports: Reports[];
}

interface Users {
  Id: number;
  UserName: string;
}

interface Course {
  Id: number;
  Name: string;
  Course_Id: string;
}

interface CourseName {
  Id: number;
  Name: string;
}

interface Rating {
  Id: number;
  Score: number;
}

interface Reports {
  Id: number;
  Reason: string;
}

export default function SheetTable() {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSheets = sheets.filter((sheet) =>
    sheet.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function deleteSheet(id: number) {
    try {
      const res = await axios.delete(`/api/sheet/${id}`);
      if (res.status === 200) {
        setSheets(sheets.filter((sheet) => sheet.Id !== id));
      }
    } catch (error) {
      console.error("Failed to delete sheet:", error);
    }
  }

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const res = await axios.get("/api/sheet");
        const sortedData = res.data.sort(
          (a: Sheet, b: Sheet) =>
            new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
        );
        setSheets(sortedData);
      } catch (err) {
        console.error("❌ Failed to fetch sheets:", err);
        setError("Failed to fetch sheets.");
      } finally {
        setLoading(false);
      }
    };
    fetchSheets();
  }, []);

  const totalPages = Math.ceil(filteredSheets.length / itemsPerPage);
    const currentSheets = filteredSheets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="p-4 text-center">กำลังโหลด...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

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
            <div className="flex items-center bg-[#FF5733] text-white px-4 py-2 rounded-l-lg">
              <span className="text-2xl font-semibold">โน้ตสรุป</span>
            </div>
            <div className="bg-orange-200 text-[#262626] px-3 py-2 rounded-r-lg text-lg font-light h-12 flex items-center">
              {filteredSheets.length}/{sheets.length} รายการ
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="🔎 ค้นหาชื่อข่าวประชาสัมพันธ์"
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
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border border-gray-300 text-center">#</th>
              <th className="p-3 border border-gray-300 text-left">ชื่อชีท</th>
              <th className="p-3 border border-gray-300 text-left">แสดง</th>
              <th className="p-3 border border-gray-300 text-left">
                รูปหน้าปก
              </th>
              <th className="p-3 border border-gray-300 text-left">วิชา</th>
              <th className="p-3 border border-gray-300 text-left">
                ประเภทโน้ต
              </th>
              <th className="p-3 border border-gray-300 text-left">
                ผู้อัปโหลด
              </th>
              <th className="p-3 border border-gray-300 text-left">
                เวลาอัปโหลด
              </th>
              <th className="p-3 border border-gray-300 text-left">
                แก้ไขล่าสุด
              </th>
              <th className="p-3 border border-gray-300 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {currentSheets.length > 0 ? (
              currentSheets.map((sheet , index) => (
                <tr key={sheet.Id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300 text-center">
                  {index + 1}
                  </td>
                  <td className="p-3 border border-gray-300">{sheet.Name}</td>
                  <td className="p-3 border border-gray-300">
                    <a
                      href={`/uploads/${sheet.Path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      คลิกเพื่อดู
                    </a>
                  </td>
                  <td className="p-3 border border-gray-300">
                    <Image
                      src={
                        sheet.Thumbnail
                          ? sheet.Thumbnail
                          : "/placeholder-image.png"
                      }
                      width={64}
                      height={64}
                      alt={`Thumbnail of ${sheet.Name}`}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-3 border border-gray-300">
                    {sheet.Course
                      ? `${sheet.Course.Course_Id}${sheet.Course_name?.Name}`
                      : "-"}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {sheet.NoteType}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {sheet.CreatedBy.UserName}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {new Date(sheet.CreatedAt).toLocaleString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {new Date(sheet.UpdatedAt).toLocaleString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3 border border-gray-300 text-center">
                    <button
                      onClick={() => deleteSheet(sheet.Id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="p-3 border border-gray-300 text-center"
                >
                  ไม่พบโน้ตสรุปที่ตรงกับ "{searchQuery}"
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

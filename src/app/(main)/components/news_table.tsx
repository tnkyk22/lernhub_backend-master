"use client";
import { useState, useEffect } from "react";
import { NextPage } from "next";
import axios from "axios";
import NewsCreateContentPage from "./news_content";
import Image from "next/image";

interface NewsItem {
  Id: number;
  Thumbnail: string;
  NewsTitle: string;
  NewsContent: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export default function NewsTable() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [iniId, setIniId] = useState<string>("");
  const [iniTitle, setIniTitle] = useState<string>("");
  const [iniContent, setIniContent] = useState<string>("");
  const [iniThumbnail, setIniThumbnail] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredNews = newsList.filter((news) => {
    return news.NewsTitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  
  const fetchNews = async () => {
    try {
      const response = await axios.get("/api/news");
      const data: NewsItem[] = response.data;

      // เรียงข้อมูลจากวันที่สร้างล่าสุดไปเก่าสุด
      const sortedData = data.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());

      setNewsList(sortedData);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };


  const handleDelete = async (id: number) => {
    if (confirm("คุณต้องการลบข่าวนี้หรือไม่?")) {
      try {
        const response = await axios.delete(`/api/news/${id}`);
        if (response.status === 200) {
          setNewsList(newsList.filter((news) => news.Id !== id));
          alert("ลบข่าวสำเร็จ");
        } else {
          alert("เกิดข้อผิดพลาดในการลบข่าว");
        }
      } catch (error) {
        console.error("Error deleting news:", error);
        alert("เกิดข้อผิดพลาดในการลบข่าว");
      }
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const currentNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
            <div className="flex items-center bg-[#FFBB33] text-white px-4 py-2 rounded-l-lg">
              <span className="text-2xl font-semibold">ข่าวประชาสัมพันธ์</span>
            </div>
            <div className="bg-yellow-200 text-[#262626] px-3 py-2 rounded-r-lg text-lg font-light h-12 flex items-center">
              {filteredNews.length}/{newsList.length} ข่าว
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
      <NewsCreateContentPage
        isOpened={isOpened}
        onClose={() => setIsOpened(false)}
        func={fetchNews}
        isUpdate={isUpdate}
        initialData={{
          id: iniId,
          title: iniTitle,
          content: iniContent,
          thumbnail: iniThumbnail,
        }}
      />
      <div className="flex justify-end items-center">
        <button
          className="mb-4 bg-[#FFBB33] text-whit font-medium px-3 py-2 rounded hover:bg-yellow-500"
          onClick={() => {
            setIsUpdate(false);
            setIsOpened(true);
          }}
        >
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-square-plus"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
            เพิ่มข่าวใหม่
          </div>
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 font-medium">
            <th className="border border-gray-300 px-4 py-2">รูปปก</th>
            <th className="border border-gray-300 px-4 py-2 text-left">ชื่อข่าวประชาสัมพันธ์</th>
            <th className="border border-gray-300 px-4 py-2 text-left">วันที่อัปโหลด</th>
            <th className="border border-gray-300 px-4 py-2">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {currentNews.length > 0 ? (
            currentNews.map((news) => (
              <tr key={news.Id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  <Image
                    src={news.Thumbnail}
                    alt={news.NewsTitle}
                    className="max-h-16 mx-auto"
                    width={64}
                    height={64}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-left">
                  {news.NewsTitle}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-left">
                  {new Date(news.CreatedAt).toLocaleString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    className="bg-yellow-500 text-[#262626] px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() => {
                      setIsUpdate(true);
                      setIsOpened(true);

                      setIniId(news.Id.toString());
                      setIniTitle(news.NewsTitle);
                      setIniContent(news.NewsContent);
                      setIniThumbnail(news.Thumbnail);
                    }}
                  >
                    แก้ไข
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(news.Id)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center text-gray-500 p-4">
                ไม่พบข่าวประชาสัมพันธ์ที่ตรงกับ &quot;${searchQuery}&quot;
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-center items-center gap-2 mt-4">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">◄</button>
        <span>หน้า {currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">►</button>
      </div>
    </div>
  );
}

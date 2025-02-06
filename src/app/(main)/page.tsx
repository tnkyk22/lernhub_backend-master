// pages/index.tsx
"use client";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [majors, setMajors] = useState<any[]>([]);
  const [sheets, setSheets] = useState<any[]>([]);
  const [adminEmail, setAdminEmail] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      try {
        const decodedToken: any = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          localStorage.removeItem("token");
          router.push("/login");
        }
        setAdminEmail(decodedToken.Email);
      } catch (error) {
        router.push("/login");
      }
    }
  }, [router]);

  const menuItems = [
    {
      id: 1,
      name: "ผู้ใช้งาน",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-book-user"
        >
          <path d="M15 13a3 3 0 1 0-6 0" />
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
          <circle cx="12" cy="8" r="2" />
        </svg>
      ),
      color: "border-l-[5px] border-[#007AFF] bg-[#f7f7f7] hover:bg-[#007AFF]", // น้ำเงินสด
      link: "/users",
    },
    {
      id: 2,
      name: "คณะ",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-school"
        >
          <path d="M14 22v-4a2 2 0 1 0-4 0v4" />
          <path d="m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10" />
          <path d="M18 5v17" />
          <path d="m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6" />
          <path d="M6 5v17" />
          <circle cx="12" cy="9" r="2" />
        </svg>
      ),
      color: "border-l-[5px] border-[#0099FF] bg-[#f7f7f7] hover:bg-[#0099FF]", // ฟ้าสด
      link: "/faculty",
    },
    {
      id: 3,
      name: "สาขา",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-graduation-cap"
        >
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
          <path d="M22 10v6" />
          <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
        </svg>
      ),
      color: "border-l-[5px] border-[#00C851] bg-[#f7f7f7] hover:bg-[#00C851]", // เขียวสด
      link: "/department",
    },
    {
      id: 4,
      name: "รหัสหมวดวิชา",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-book-key"><path d="m19 3 1 1" /><path d="m20 2-4.5 4.5" /><path d="M20 8v13a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H14" /><circle cx="14" cy="8" r="2" /></svg>
      ),
      color: "border-l-[5px] border-[#A833FF] bg-[#f7f7f7] hover:bg-[#A833FF]", // ม่วงสด
      link: "/course",
    },
    {
      id: 5,
      name: "รหัสวิชา",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-file-text"
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </svg>
      ),
      color: "border-l-[5px] border-[#00CED1] bg-[#f7f7f7] hover:bg-[#00CED1]",
      link: "/course_name",
    },
    {
      id: 6,
      name: "ข่าวประชาสัมพันธ์",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-megaphone"
        >
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      ),
      color: "border-l-[5px] border-[#FFBB33] bg-[#f7f7f7] hover:bg-[#FFBB33]", // เหลืองสด
      link: "/news",
    },
    {
      id: 7,
      name: "โน้ตสรุป",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-book-open-text"
        >
          <path d="M12 7v14" />
          <path d="M16 12h2" />
          <path d="M16 8h2" />
          <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
          <path d="M6 12h2" />
          <path d="M6 8h2" />
        </svg>
      ),
      color: "border-l-[5px] border-[#FF5733] bg-[#f7f7f7] hover:bg-[#FF5733]", // ส้มสด
      link: "/sheet",
    }
  ];

  return (
    <div className="flex h-screen">
      <div className="flex flex-col gap-3 w-1/4 font-prompt bg-[#eeeeee] p-10 items-center">
        <h1 className="text-3xl font-bold flex items-center text-[#262626]">LearnHub&nbsp;<span className="text-[#FFBB33] font-bold">CMRU</span></h1>
        <h1 className="text-base font-normal flex items-center text-[#262626]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sticker w-6 h-6 text-[#262626]"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" /><path d="M14 3v4a2 2 0 0 0 2 2h4" /><path d="M8 13h.01" /><path d="M16 13h.01" /><path d="M10 16s.8 1 2 1c1.3 0 2-1 2-1" /></svg>
          &nbsp;: {adminEmail}
        </h1>
        <hr className="w-full border-t border-gray-300" />
        {menuItems.map((item) => (
          <Link href={item.link} key={item.id}>
            <div
              key={item.id}
              className={`flex items-center px-4 py-3 rounded-r-lg shadow-sm ${item.color} text-[#383838] hover:text-white w-72`}
            >
              <div className="text-3xl mr-4 ">{item.icon}</div>
              <div className="text-lg font-medium">{item.name}</div>
            </div>
          </Link>
        ))}
        <hr className="w-full border-t border-gray-300" />
        <div
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="flex items-center px-4 py-3 rounded-lg shadow-lg bg-red-500 hover:bg-red-600 text-white cursor-pointer w-72"
        >
          <div className="text-3xl mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-log-out"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          </div>
          <div className="text-lg font-medium">ออกจากระบบ</div>
        </div>
      </div>

      <div className="w-3/4 p-20 font-prompt gap-5 flex flex-col h-screen">
        <div className="w-full bg-yellow-300 rounded-xl p-5 flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">Hi, {adminEmail} </p>
            <p className="text-lg font-medium">Welcome to LearnHub CMRU</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-smile w-20 h-20"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" x2="9.01" y1="9" y2="9" /><line x1="15" x2="15.01" y1="9" y2="9" /></svg>
        </div>
        <h1 className="text-xl font-normal text-center">รายงาน</h1>
        <hr className="w-full border-t border-gray-300" />
        <div className="grid gap-5 grid-cols-2">
          <button onClick={() => router.push("/uploadCourse")}
            className="border-l-[5px] border-[#FF2D7A] bg-[#f7f7f7] hover:bg-[#FF2D7A] p-2 hover:text-white">รายงานจำนวนไฟล์ในแต่ละวิชา</button>
          <button onClick={() => router.push("/uploadStat")}
            className="border-l-[5px] border-[#FF2D7A] bg-[#f7f7f7] hover:bg-[#FF2D7A] p-2 hover:text-white">รายงานสถิติการอัปโหลดไฟล์</button>
          <button onClick={() => router.push("/rateavg")}
            className="border-l-[5px] border-[#FF2D7A] bg-[#f7f7f7] hover:bg-[#FF2D7A] p-2 hover:text-white">รายงานผลคะแนนเฉลี่ยความพึงพอใจ</button>
          <button onClick={() => router.push("/reports")}
            className="border-l-[5px] border-[#FF2D7A] bg-[#f7f7f7] hover:bg-[#FF2D7A] p-2 hover:text-white">รายงานข้อมูลการแจ้งปัญหา</button>
        </div>
      </div>
    </div>
  );
}

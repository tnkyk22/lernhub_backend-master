import { useState, useEffect } from "react";
import axios from "axios";

export default function NewsCreateContentModal({
  isOpened,
  func,
  onClose,
  isUpdate = false,
  initialData = { id: "", title: "", content: "", thumbnail: "" },
}: {
  isOpened: boolean;
  onClose: () => void;
  func: () => void;
  isUpdate?: boolean;
  initialData?: {
    id: string;
    title: string;
    content: string;
    thumbnail: string;
  };
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpened) {
      setTitle(isUpdate ? initialData.title : "");
      setContent(isUpdate ? initialData.content : "");
      setPreviewImage(
        isUpdate && initialData.thumbnail ? `/uploads/${initialData.thumbnail}` : null
      );
      setCoverImage(null);
    }
  }, [isOpened, isUpdate, initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || (!coverImage && !isUpdate)) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    const formData = new FormData();
    formData.append("NewsTitle", title);
    formData.append("NewsContent", content);
    if (coverImage) {
      formData.append("thumbnail", coverImage);
    }

    try {
      let res;
      if (isUpdate) {
        res = await axios.put(`/api/news/${initialData.id}`, formData);
      } else {
        res = await axios.post("/api/news", formData);
      }

      if (res.status === 200) {
        alert(isUpdate ? "แก้ไขข่าวสำเร็จ!" : "เพิ่มข่าวสำเร็จ!");
        func();
        onClose();
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข่าว");
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการบันทึกข่าว");
    }
  };

  return (
    isOpened && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-prompt">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold bg-[#FFBB33] px-3 py-1 rounded text-[#262626]">
              {isUpdate ? "แก้ไขข่าวประชาสัมพันธ์" : "เพิ่มข่าวประชาสัมพันธ์ใหม่"}
            </h1>
            <button
              onClick={onClose}
              className="text-gray-700 bg-gray-100 hover:text-white hover:bg-red-500 p-1 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block font-medium mb-1">
                ชื่อข่าวประชาสัมพันธ์ :
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block font-medium mb-1">
                เนื้อหาข่าวประชาสัมพันธ์ :
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border rounded px-3 py-2 h-32"
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="coverImage" className="block font-medium mb-1">
                รูปปกข่าวประชาสัมพันธ์ :
              </label>
              <input
                type="file"
                id="coverImage"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-2 max-h-40 rounded"
                />
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 mr-2"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="bg-[#FFBB33] text-white px-4 py-2 rounded hover:bg-yellow-500"
              >
                {isUpdate ? "แก้ไขข่าว" : "เพิ่มข่าว"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}

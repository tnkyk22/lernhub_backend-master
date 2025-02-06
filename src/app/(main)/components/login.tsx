"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.post(`/api/admins/login`, { Email, Password });
            const token = response.data.token;

            localStorage.setItem("token", token);

            router.push("/");
        } catch (error) {
            setError("Login failed. Please check your email or password.");
            console.error("Login failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 font-prompt">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">เข้าสู่ระบบ</h2>
                <form>
                    <div className="mb-4">
                        <input
                            type="email"
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="อีเมล"
                            required
                            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="รหัสผ่าน"
                            required
                            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                        />
                    </div>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <button
                        type="button"
                        onClick={handleLogin}
                        disabled={loading}
                        className={`w-full py-3 rounded-md font-medium transition-colors ${loading
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-gray-700 text-white hover:bg-gray-800"
                            }`}
                    >
                        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                    </button>
                </form>
            </div>
        </div>
    );
}

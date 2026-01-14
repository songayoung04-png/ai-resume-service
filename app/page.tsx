"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [formData, setFormData] = useState({
    samples: "",
    experience: "",
    company_name: "",
    question: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/generate", formData);
      setResult(response.data.resume);
    } catch (error) {
      alert("서버 연결 실패! 백엔드를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">🚀 AI 자소서 생성기</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full p-3 border rounded text-black bg-white border-gray-300 focus:outline-blue-500"
            placeholder="지원 기업 (예: 삼성전자)"
            value={formData.company_name}
            onChange={(e) => setFormData({...formData, company_name: e.target.value})}
          />
          <input 
            className="w-full p-3 border rounded text-black bg-white border-gray-300 focus:outline-blue-500"
            placeholder="자소서 문항 (예: 지원동기)"
            value={formData.question}
            onChange={(e) => setFormData({...formData, question: e.target.value})}
          />
          <textarea 
            className="w-full p-3 border rounded text-black bg-white border-gray-300 focus:outline-blue-500"
            rows={3}
            placeholder="나의 말투 샘플을 입력하세요"
            value={formData.samples}
            onChange={(e) => setFormData({...formData, samples: e.target.value})}
          />
          <textarea 
            className="w-full p-3 border rounded text-black bg-white border-gray-300 focus:outline-blue-500"
            rows={5}
            placeholder="실제 경험 소재를 적어주세요"
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "AI가 작성 중..." : "자소서 생성하기"}
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-xl font-bold mb-4 text-blue-800">✨ 완성된 자소서</h2>
            <div className="text-black whitespace-pre-wrap leading-relaxed">{result}</div>
          </div>
        )}
      </div>
    </main>
  );
}
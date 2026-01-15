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
      // 백엔드 주소 확인 (포트 8000)
      const response = await axios.post("https://ai-resume-service04.onrender.com.onrender.com/generate ", formData);
      setResult(response.data.resume);
    } catch (error) {
      console.error(error);
      alert("백엔드 연결 실패! 터미널 1(8000포트)이 켜져 있는지 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 text-black">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-8">🚀 AI 자소서 생성기</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">지원 기업</label>
            <input 
              className="w-full p-3 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="예: 삼성전자"
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">자소서 문항</label>
            <input 
              className="w-full p-3 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="예: 지원 동기 및 입사 후 포부"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">나의 말투 샘플 (2~3문장)</label>
            <textarea 
              className="w-full p-3 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              placeholder="본인이 평소에 쓰는 문체를 입력하세요."
              value={formData.samples}
              onChange={(e) => setFormData({...formData, samples: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">핵심 경험 소재</label>
            <textarea 
              className="w-full p-3 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={5}
              placeholder="자소서에 녹일 경험을 자유롭게 적어주세요."
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? "AI가 고심해서 작성 중..." : "AI 자소서 생성하기"}
          </button>
        </form>

        {result && (
          <div className="mt-10 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <h2 className="text-xl font-bold mb-4 text-blue-800 underline decoration-blue-300 decoration-4">✨ 완성된 자소서</h2>
            <div className="whitespace-pre-wrap leading-relaxed text-gray-800">{result}</div>
          </div>
        )}
      </div>
    </main>
  );
}
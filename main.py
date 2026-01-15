from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
import os
from fastapi.middleware.cors import CORSMiddleware

# 환경변수 로드
load_dotenv()

app = FastAPI()

# CORS 설정 (프론트엔드 연결 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResumeRequest(BaseModel):
    samples: str
    experience: str
    company_name: str
    question: str

# LLM 설정
llm = ChatOpenAI(model="gpt-4o-mini", api_key=os.getenv("OPENAI_API_KEY"))

# 💡 프롬프트를 훨씬 정교하게 수정했습니다.
system_template = """
당신은 최고의 취업 컨설턴트입니다. 
사용자의 경험을 바탕으로 {company_name}의 '{question}' 문항에 대한 자기소개서를 작성해야 합니다.

[작성 지침]
1. 사용자의 '경험 소재'는 과거의 활동입니다. 이 경험을 통해 얻은 역량을 강조하세요.
2. 절대로 사용자가 {company_name}에서 이미 일하고 있는 것처럼 쓰지 마세요. 
3. 이 경험을 바탕으로 {company_name}에 입사하여 어떻게 기여할 것인지(입사 후 포부)를 자연스럽게 연결하세요.
4. 말투 샘플({samples})의 분위기와 어미를 반드시 유지하세요.
5. 문장은 '소제목 - 본문(스타 기법: 상황-행동-결과) - 입사 후 기여점' 순서로 구성하세요.
"""

prompt_template = ChatPromptTemplate.from_messages([
    ("system", system_template),
    ("user", "지원 기업: {company_name}\n문항: {question}\n말투 샘플: {samples}\n나의 경험 소재: {experience}")
])

@app.post("/generate")
async def generate_resume(request: ResumeRequest):
    try:
        chain = prompt_template | llm
        response = chain.invoke({
            "company_name": request.company_name,
            "question": request.question,
            "samples": request.samples,
            "experience": request.experience
        })
        return {"resume": response.content}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
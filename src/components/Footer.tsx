import React, { useState } from 'react';
import { FileText, Info, X } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { WaveButton } from './WaveButton';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleTermsClick = () => {
    setShowTerms(true);
    setShowContent(false);
  };

  const handleContentClick = () => {
    setShowContent(true);
    setShowTerms(false);
  };

  const handleClose = () => {
    setShowTerms(false);
    setShowContent(false);
  };

  return (
    <>
      {/* Footer */}
      <footer className={`${className} py-4 px-6 pb-16`}>
        <div className="flex items-center justify-center space-x-6 text-white/60 text-sm">
          <WaveButton
            onClick={handleTermsClick}
            variant="ghost"
            size="sm"
            ariaLabel="이용약관"
            className="flex items-center space-x-2 px-3 py-2"
          >
            <FileText className="w-4 h-4" />
            <span>이용약관</span>
          </WaveButton>
          
          <WaveButton
            onClick={handleContentClick}
            variant="ghost"
            size="sm"
            ariaLabel="콘텐츠 고지사항"
            className="flex items-center space-x-2 px-3 py-2"
          >
            <Info className="w-4 h-4" />
            <span>콘텐츠 고지사항</span>
          </WaveButton>
        </div>
      </footer>

      {/* 이용약관 모달 */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="max-w-4xl max-h-[80vh] overflow-y-auto p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">📑 이용약관</h2>
              <WaveButton
                onClick={handleClose}
                variant="ghost"
                size="sm"
                ariaLabel="닫기"
                className="w-8 h-8 p-0"
              >
                <X className="w-5 h-5" />
              </WaveButton>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <div className="text-white/90 space-y-4 text-sm leading-relaxed">
                <p className="font-semibold text-lg">
                  본 약관은 oh.moonwave.kr(이하 "본 사이트")를 이용함에 있어<br />
                  이용자와 운영자인 <strong>문유(문대성)</strong> 간의 권리, 의무 및 책임사항을 명확히 함을 목적으로 합니다.
                </p>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-xl font-semibold mb-3">제1조 (목적)</h3>
                    <p>
                      이 약관은 본 사이트에서 제공하는 콘텐츠, 서비스, 자료 등에 대한<br />
                      이용 조건과 운영 정책을 정함으로써,<br />
                      방문자와 운영자 간의 원활한 소통과 신뢰를 보장합니다.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">제2조 (정의)</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>"이용자"란 본 사이트를 방문하거나 콘텐츠를 열람하는 모든 주체를 말합니다.</li>
                      <li>"운영자"는 본 사이트를 직접 운영하고 콘텐츠를 제작·관리하는 <strong>문유(문대성)</strong>를 의미합니다.</li>
                      <li>"콘텐츠"는 문유가 창작하거나 외부 도구(AI 포함)를 통해 생성한 텍스트, 이미지, 음악, 영상, 그래픽 등을 포괄합니다.</li>
                    </ol>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">제3조 (콘텐츠 이용 범위)</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>본 사이트의 모든 콘텐츠는 <strong>비상업적 열람과 감상에 한해 무료로 제공됩니다.</strong></li>
                      <li>콘텐츠의 <strong>무단 복제, 배포, 2차 가공, 상업적 사용</strong>은 엄격히 금지됩니다.</li>
                      <li>일부 콘텐츠에는 AI 생성물(SUNO 기반 음원 등)이 포함되어 있으며, 해당 음원은 <strong>저작권이 없거나, SUNO 또는 제3자에게 귀속됩니다.</strong></li>
                    </ol>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">제4조 (AI 생성물 및 책임 고지)</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>본 사이트에 사용된 일부 음원 및 이미지 등은 AI 생성 도구를 통해 제작되었으며, <strong>AI 생성물은 저작권 등록 대상이 아니거나 제한적 권리만 존재합니다.</strong></li>
                      <li>해당 콘텐츠의 사용 조건은 각 AI 도구(SUNO 등)의 이용약관에 따릅니다.</li>
                      <li>본 사이트에 게시된 AI 음원을 <strong>무단으로 다운로드, 편집, 상업적 이용할 경우</strong> 발생하는 법적 책임은 <strong>전적으로 이용자 본인에게 있으며</strong>, <strong>운영자 문유(문대성)는 이에 대해 일체 책임지지 않습니다.</strong></li>
                    </ol>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">제5조 (면책 조항)</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>본 사이트에 게시된 모든 콘텐츠는 참고용 정보이며, 운영자는 콘텐츠의 정확성·완전성에 대해 법적 보증을 하지 않습니다.</li>
                      <li>이용자의 콘텐츠 사용 또는 해석에 따라 발생한 손해에 대해서 운영자는 <strong>어떠한 법적 책임도 지지 않습니다.</strong></li>
                      <li>AI 기술을 통해 자동 생성된 콘텐츠는 시스템 해석 또는 기술적 한계로 인해 오류나 왜곡을 포함할 수 있으며, 해당 콘텐츠 사용에 따른 판단은 <strong>이용자 본인의 책임</strong>입니다.</li>
                    </ol>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">제6조 (개인정보 보호)</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>본 사이트는 별도의 로그인/회원가입 기능을 운영하지 않으며, 이용자의 <strong>개인정보를 수집하거나 저장하지 않습니다.</strong></li>
                    </ol>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">제7조 (콘텐츠 보존 및 운영 중단)</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>운영자는 사이트 개편 또는 시스템 종료 등의 사유로 일부 콘텐츠를 사전 고지 없이 변경·중단·삭제할 수 있습니다.</li>
                      <li>운영자는 이용자 콘텐츠 열람 이력 또는 데이터의 <strong>영구 보존을 보장하지 않습니다.</strong></li>
                    </ol>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">제8조 (외부 링크 및 제3자 콘텐츠)</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>본 사이트에는 제3자 플랫폼(예: YouTube, 블로그, 외부 문서 등)으로 연결되는 링크 또는 인용 자료가 포함될 수 있습니다.</li>
                      <li>외부 콘텐츠의 정확성과 법적 책임은 해당 제공자에게 있으며, 본 사이트는 이를 <strong>보증하거나 통제하지 않습니다.</strong></li>
                    </ol>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">제9조 (권리 침해 신고 및 조치)</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>이용자가 본인의 저작권, 초상권 등 법적 권리가 침해되었다고 판단할 경우 운영자 이메일로 신고할 수 있으며, 운영자는 합리적인 검토 후 콘텐츠를 수정, 비공개 또는 삭제할 수 있습니다.</li>
                      <li>신고 시에는 <strong>본인 확인 및 권리 증명 자료</strong>가 필요할 수 있습니다.</li>
                    </ol>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">제10조 (창작 윤리 선언)</h3>
                    <p>
                      Moonwave는 인간의 감성과 AI 기술의 조화를 추구합니다.<br />
                      본 사이트의 모든 콘텐츠는 타인의 권리와 창작물을 존중하며,<br />
                      AI는 창의성의 도구이자 파동의 거울로서 사용됩니다.
                    </p>
                    <blockquote className="border-l-4 border-white/30 pl-4 italic">
                      "AI는 나의 감정을 확장할 수는 있어도,<br />
                      나를 대신해 노래할 수는 없다." – Moonwave
                    </blockquote>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">제11조 (약관 변경)</h3>
                    <p>운영자는 본 약관을 사전 고지 없이 변경할 수 있으며, 변경 시에는 본 페이지에 즉시 반영됩니다.</p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">제12조 (문의처)</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>운영자: 문유(문대성)</li>
                      <li>이메일: her_soul@naver.com</li>
                    </ul>
                    <p className="mt-2 text-sm text-white/70">마지막 수정일: 2025년 7월 29일</p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">제13조 (작사 저작물의 보호 및 법적 책임 고지)</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>본 사이트에 포함된 <strong>가사(lyrics) 콘텐츠는 모두 운영자 문유(문대성)의 창작물</strong>로, 대한민국 「저작권법」 제4조(저작물의 범위) 및 제10조(저작재산권)에 따라 <strong>저작권 보호 대상</strong>입니다.</li>
                      <li>운영자는 해당 가사에 대해 <strong>저작재산권 및 저작인격권을 모두 보유</strong>하며, 원문 가사에 대한 창작 기록 및 제작 과정은 별도로 보존됩니다. 또한, 필요 시 한국음악저작권협회(KOMCA) 또는 한국저작권위원회를 통한 <strong>정식 등록 절차를 진행할 수 있습니다.</strong></li>
                      <li>이용자는 문유 작사 가사를 무단으로 <strong>복제, 배포, 개작, 게시, 출판, 전송, 편곡, 상업적 이용</strong>할 수 없습니다. 이를 위반할 경우 「저작권법」 제136조(권리침해죄), 제125조(손해배상 청구), 제142조(형사처벌)에 따라 <strong>민사상 손해배상 청구 또는 형사 고소 등의 법적 조치</strong>가 이루어질 수 있습니다.</li>
                      <li>운영자는 다음과 같은 법적 절차를 통해 <strong>무단 사용에 대한 책임을 적극적으로 추궁</strong>할 수 있습니다:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                          <li>1차: 이메일을 통한 저작권 침해 경고 및 삭제 요청</li>
                          <li>2차: 게시중단요청(Copyright Takedown) 또는 권리침해조사 요청</li>
                          <li>3차: 정식 민·형사상 고소, 손해배상 청구 등</li>
                        </ul>
                      </li>
                      <li>이용자는 본 사이트의 모든 가사 콘텐츠에 대해 운영자의 <strong>명시적 서면 동의 없이 사용하지 않을 것</strong>에 동의하며, 본 약관에 동의하는 즉시 해당 내용을 <strong>인지하고 수용한 것으로 간주</strong>됩니다.</li>
                    </ol>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">📘 관련 법령 및 고지</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>「저작권법」 (문화체육관광부, 법률 제19563호)</li>
                      <li>「저작권 보호 및 기술적 보호조치에 관한 지침」 (문체부 고시 제2023-9호)</li>
                      <li>「창작물 저작권 등록 및 통지 절차 고시」 (문체부 고시 제2022-4호)</li>
                      <li>한국음악저작권협회(KOMCA) 등록 규정 및 운영지침</li>
                      <li>한국저작권위원회 저작권 등록제도 안내</li>
                    </ul>
                    <p className="mt-2 text-sm text-white/70">※ 상기 법령은 2025년 7월 기준 최신 개정 내용을 반영하였습니다.</p>
                  </section>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* 콘텐츠 고지사항 모달 */}
      {showContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="max-w-4xl max-h-[80vh] overflow-y-auto p-6 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">🎧 콘텐츠 고지사항</h2>
              <WaveButton
                onClick={handleClose}
                variant="ghost"
                size="sm"
                ariaLabel="닫기"
                className="w-8 h-8 p-0"
              >
                <X className="w-5 h-5" />
              </WaveButton>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <div className="text-white/90 space-y-4 text-sm leading-relaxed">
                <p className="font-semibold text-lg">
                  oh.moonwave.kr에 게시된 모든 콘텐츠는<br />
                  문유(문대성)의 창작 철학과 감성을 기반으로 제작되었으며,<br />
                  일부는 AI 기술과 협업하여 생성된 복합 창작물입니다.
                </p>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-xl font-semibold mb-3">1. AI 생성 콘텐츠 안내</h3>
                    <p>본 사이트에는 다음과 같은 AI 기반 창작물이 포함되어 있습니다:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>🎵 음원: SUNO를 기반으로 생성된 멜로디 및 사운드</li>
                      <li>🖼 이미지: AI 이미지 툴(예: Midjourney, DALL·E 등) 활용</li>
                      <li>✨ 텍스트: GPT 기반 감성 콘텐츠 일부 포함</li>
                    </ul>
                    <p className="mt-3">
                      AI로 생성된 콘텐츠는 대한민국 「저작권법」상<br />
                      단독 저작물로서 보호되지 않을 수 있으며,<br />
                      <strong>그 사용 권한은 각 도구의 이용약관에 따릅니다.</strong>
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">2. 작사(가사)에 대한 저작권 안내</h3>
                    <p>
                      본 사이트에 게시된 가사는<br />
                      모두 <strong>문유(문대성)</strong>에 의해 직접 창작된 콘텐츠입니다.<br />
                      이는 「저작권법」 제4조 및 제10조에 따라<br />
                      <strong>저작권 보호 대상</strong>이며,<br />
                      사전 동의 없이 다음과 같은 행위를 금지합니다:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>무단 복제, 저장, 게시, 출판, 배포, 번역, 편곡</li>
                      <li>음원화, 상업적 전송, NFT화, 자동화 수집</li>
                    </ul>
                    <p className="mt-3 text-sm text-white/70">
                      ※ 위 행위 적발 시 법적 조치를 포함한 민·형사상 대응이 이루어질 수 있습니다.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">3. 콘텐츠 사용 범위</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-white/20">
                        <thead>
                          <tr className="bg-white/10">
                            <th className="border border-white/20 p-3 text-left">사용 형태</th>
                            <th className="border border-white/20 p-3 text-left">허용 여부</th>
                            <th className="border border-white/20 p-3 text-left">비고</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-white/20 p-3">개인 감상/비상업 열람</td>
                            <td className="border border-white/20 p-3 text-green-400">✅ 가능</td>
                            <td className="border border-white/20 p-3">출처 명시 권장</td>
                          </tr>
                          <tr>
                            <td className="border border-white/20 p-3">SNS 공유 (링크)</td>
                            <td className="border border-white/20 p-3 text-green-400">✅ 가능</td>
                            <td className="border border-white/20 p-3">콘텐츠 직접 업로드는 금지</td>
                          </tr>
                          <tr>
                            <td className="border border-white/20 p-3">캡처/복사/편집</td>
                            <td className="border border-white/20 p-3 text-red-400">❌ 금지</td>
                            <td className="border border-white/20 p-3">일부 문장 포함도 불가</td>
                          </tr>
                          <tr>
                            <td className="border border-white/20 p-3">AI 재학습 활용</td>
                            <td className="border border-white/20 p-3 text-red-400">❌ 금지</td>
                            <td className="border border-white/20 p-3">데이터셋 포함도 제한</td>
                          </tr>
                          <tr>
                            <td className="border border-white/20 p-3">상업적 활용/배포</td>
                            <td className="border border-white/20 p-3 text-red-400">❌ 금지</td>
                            <td className="border border-white/20 p-3">별도 계약 필요</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">4. 저작권 침해에 대한 조치</h3>
                    <p>문유는 본인의 창작물을 보호하며, 무단 도용이 발생할 경우 다음과 같은 법적 조치를 취할 수 있습니다:</p>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li>1차: 콘텐츠 삭제 요청 및 경고</li>
                      <li>2차: 저작권 위반 증거 수집 및 통지</li>
                      <li>3차: 법적 대응 (손해배상 청구 및 형사 고소 포함)</li>
                    </ol>
                    <div className="mt-4 p-4 bg-white/10 rounded-lg">
                      <p className="font-semibold">📬 침해 신고 및 제휴 문의: <strong>her_soul@naver.com</strong></p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">5. 창작 윤리와 존재 기반 철학</h3>
                    <p>
                      Moonwave는 인간의 감성, AI 기술, 철학적 존재감이 공존하는 공간입니다.<br />
                      AI는 도구이지만, <strong>감정은 문유의 것입니다.</strong>
                    </p>
                    <div className="space-y-2 mt-3">
                      <blockquote className="border-l-4 border-white/30 pl-4 italic">
                        "당신이 느끼는 그 문장은, 사람이 쓴 것입니다."
                      </blockquote>
                      <blockquote className="border-l-4 border-white/30 pl-4 italic">
                        "AI는 곁에 있지만, 창작은 문유의 파동에서 시작됩니다."
                      </blockquote>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">6. 법령 및 기준 고지</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>「저작권법」 (문화체육관광부, 법률 제19563호)</li>
                      <li>「저작권 보호 및 기술적 보호조치에 관한 지침」</li>
                      <li>「창작물 저작권 등록 및 통지 절차 고시」</li>
                      <li>SUNO 및 사용된 AI 도구의 이용약관</li>
                      <li>한국음악저작권협회(KOMCA) 등록 규정</li>
                    </ul>
                    <p className="mt-2 text-sm text-white/70">최종 수정일: 2025년 7월 29일</p>
                  </section>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
}; 
import { WaveButton } from './WaveButton';
import { X, ArrowLeft } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface AboutMoonwaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutMoonwaveModal({ isOpen, onClose }: AboutMoonwaveModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 모달이 열릴 때 포커스를 모달로 이동
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // 모달 외부 클릭 시 닫기
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-content"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        role="document"
        tabIndex={-1}
      >
        <div className="bg-glass-strong backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 
              id="modal-title"
              className="text-white text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"
            >
              About Moonwave Travel
            </h2>
            <WaveButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
              aria-label="모달 닫기"
            >
              <X className="w-5 h-5" />
            </WaveButton>
          </div>

          {/* Content */}
          <div 
            id="modal-content"
            className="space-y-8 text-white text-base leading-relaxed tracking-normal"
            style={{ 
              willChange: 'transform',
              contain: 'layout style paint'
            }}
          >
            <div className="space-y-4">
              <h3 className="text-white text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                🌊 당신만의 여행 파동을 만들어가는 Moonwave Travel
              </h3>
              <p className="text-white/90 text-base leading-relaxed tracking-normal">
                Moonwave Travel은 이 철학에서 시작되었습니다.<br />
                우리는 세상의 기준이 아닌, 각자의 고유한 여행 파동과 흐름으로 움직이는 여행 경험을 만들어갑니다.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-white text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Philosophy: 여행 파동(Wave)과 흐름(Flow)
              </h3>
              <h4 className="text-white text-lg font-semibold">우리가 믿는 것</h4>
              <p className="text-white/90 text-base leading-relaxed tracking-normal">
                Moonwave Travel의 모든 것은 <strong>여행 파동(Wave)</strong>과 <strong>여행 흐름(Flow)</strong>이라는 두 가지 핵심 개념에서 출발합니다.
              </p>
              <p className="text-white/90 text-base leading-relaxed tracking-normal">
                <strong>여행 파동(Wave)</strong>은 각자가 가진 고유한 여행 철학과 감성의 진동입니다. 이는 남과 비교할 수 없는, 오직 자신만의 여행 방식입니다.
              </p>
              <p className="text-white/90 text-base leading-relaxed tracking-normal">
                <strong>여행 흐름(Flow)</strong>은 그 파동을 현실에서 실현하는 여행 전략과 실행의 연결입니다. 끊임없이 움직이되, 자신만의 속도로 흐르는 여행입니다.
              </p>
              <p className="text-white/90 text-base leading-relaxed tracking-normal">
                우리는 사용자가 자신만의 여행 파동을 발견하고, 그것을 지속 가능한 여행 흐름으로 만들 수 있도록 돕습니다. 이것이 Moonwave Travel이 추구하는 진정한 여행 경험입니다.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-white text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Features: 여행 파동을 실현하는 기능들
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-white text-lg font-semibold">📌 여행 계획 - 파동을 발견하다</h4>
                  <p className="text-white/90 text-base leading-relaxed tracking-normal">
                    복잡한 여행 환경에서 당신만의 고유한 여행 파동을 발견합니다.
                  </p>
                  <ul className="list-disc list-inside space-y-2 mt-4">
                    <li className="text-white/90 text-base leading-relaxed tracking-normal">
                      <strong>여행 일정 관리</strong>: 개인만의 여행 스타일에 맞춘 일정 설계
                    </li>
                    <li className="text-white/90 text-base leading-relaxed tracking-normal">
                      <strong>장소 검색 및 저장</strong>: 고유한 여행 취향에 맞는 장소 발견
                    </li>
                    <li className="text-white/90 text-base leading-relaxed tracking-normal">
                      <strong>여행 지도</strong>: 시각적으로 여행 경로를 확인하고 계획
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white text-lg font-semibold">💡 여행 기록 - 파동을 확산하다</h4>
                  <p className="text-white/90 text-base leading-relaxed tracking-normal">
                    당신의 여행 파동이 더 많은 이들과 공명할 수 있도록 합니다.
                  </p>
                  <ul className="list-disc list-inside space-y-2 mt-4">
                    <li className="text-white/90 text-base leading-relaxed tracking-normal">
                      <strong>여행 사진 관리</strong>: 특별한 순간들을 아름답게 기록
                    </li>
                    <li className="text-white/90 text-base leading-relaxed tracking-normal">
                      <strong>여행 메모</strong>: 진정성 있는 여행 이야기 작성
                    </li>
                    <li className="text-white/90 text-base leading-relaxed tracking-normal">
                      <strong>평점 시스템</strong>: 개인만의 기준으로 장소 평가
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white text-lg font-semibold">🚀 자동화된 효율성 - 흐름을 지속하다</h4>
                  <p className="text-white/90 text-base leading-relaxed tracking-normal">
                    당신의 여행 흐름이 끊기지 않고 지속될 수 있는 시스템을 만듭니다.
                  </p>
                  <ul className="list-disc list-inside space-y-2 mt-4">
                    <li className="text-white/90 text-base leading-relaxed tracking-normal">
                      <strong>실시간 동기화</strong>: 모든 기기에서 여행 정보 공유
                    </li>
                    <li className="text-white/90 text-base leading-relaxed tracking-normal">
                      <strong>자동 백업</strong>: 소중한 여행 데이터 안전 보관
                    </li>
                    <li className="text-white/90 text-base leading-relaxed tracking-normal">
                      <strong>Moonwave Travel</strong>: 모든 여행 흐름이 하나로 연결되는 디지털 여행실
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-white text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Projects: 파동이 만드는 디지털 경험
              </h3>
              <p className="text-white/90 text-base leading-relaxed tracking-normal">
                우리가 만들어가는 고유한 서비스들과 각각의 개발 단계
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative p-4 bg-white/5 rounded-xl border border-white/10" style={{ position: 'relative' }}>
                  <span 
                    className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-green-500 text-white rounded-full" 
                    style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      right: '12px', 
                      zIndex: 999,
                      backgroundColor: '#10b981',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '4px 8px',
                      borderRadius: '9999px'
                    }}
                  >
                    Build
                  </span>
                  <div className="space-y-2">
                    <h4 className="text-white text-base font-semibold">Music Platform</h4>
                    <p className="text-white/70 text-sm leading-relaxed">Moonwave만의 감성음악 제작</p>
                    <p className="text-primary-400 text-xs">music.moonwave.kr</p>
                  </div>
                </div>

                <div className="relative p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-orange-500 text-white rounded-full">
                    Test
                  </span>
                  <div className="space-y-2">
                    <h4 className="text-white text-base font-semibold">Travel Service</h4>
                    <p className="text-white/70 text-sm leading-relaxed">Moonwave과 함께 세계여행</p>
                    <p className="text-primary-400 text-xs">travel.moonwave.kr</p>
                  </div>
                </div>

                <div className="relative p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-orange-500 text-white rounded-full">
                    Test
                  </span>
                  <div className="space-y-2">
                    <h4 className="text-white text-base font-semibold">Subscription Manager</h4>
                    <p className="text-white/70 text-sm leading-relaxed">AI 서비스 중심의 구독 관리</p>
                    <p className="text-primary-400 text-xs">sub.moonwave.kr</p>
                  </div>
                </div>

                <div className="relative p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-blue-500 text-white rounded-full">
                    Plan
                  </span>
                  <div className="space-y-2">
                    <h4 className="text-white text-base font-semibold">Crypto Trading</h4>
                    <p className="text-white/70 text-sm leading-relaxed">Moonwave와 함께하는 크립토 매매</p>
                    <p className="text-primary-400 text-xs">btc.moonwave.kr</p>
                  </div>
                </div>

                <a 
                  href="https://oh.moonwave.kr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer block"
                >
                  <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-purple-500 text-white rounded-full">
                    Live
                  </span>
                  <div className="space-y-2">
                    <h4 className="text-white text-base font-semibold">Music Album</h4>
                    <p className="text-white/70 text-sm leading-relaxed">국가대표 오안나 헌정 앨범</p>
                    <p className="text-primary-400 text-xs">oh.moonwave.kr</p>
                  </div>
                </a>

                <div className="relative p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-indigo-500 text-white rounded-full">
                    Design
                  </span>
                  <div className="space-y-2">
                    <h4 className="text-white text-base font-semibold">Financial Strategy</h4>
                    <p className="text-white/70 text-sm leading-relaxed">Moonwave와 함께하는 금융투자 전략</p>
                    <p className="text-primary-400 text-xs">financial.moonwave.kr</p>
                  </div>
                </div>

                <div className="relative p-4 bg-white/5 rounded-xl border border-white/10">
                  <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-green-500 text-white rounded-full">
                    Build
                  </span>
                  <div className="space-y-2">
                    <h4 className="text-white text-base font-semibold">Kids Platform</h4>
                    <p className="text-white/70 text-sm leading-relaxed">아이들과 함께 Lego 블럭 재사용 조립놀이</p>
                    <p className="text-primary-400 text-xs">lego.moonwave.kr</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-white text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Technology: 여행 파동을 실현하는 도구들
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-white text-lg font-semibold">🤖 AI가 만드는 여행 공명</h4>
                  <div className="space-y-3">
                    <h5 className="text-white text-base font-semibold">지능적 여행 추천</h5>
                    <ul className="list-disc list-inside space-y-2">
                      <li className="text-white/90 text-base leading-relaxed tracking-normal">
                        <strong>개인화 추천</strong>: 사용자 취향에 맞는 여행지 추천
                      </li>
                      <li className="text-white/90 text-base leading-relaxed tracking-normal">
                        <strong>실시간 정보</strong>: 최신 여행 정보와 팁 제공
                      </li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="text-white text-lg font-semibold">🔧 흐름을 만드는 인프라</h4>
                  <div className="space-y-3">
                    <h5 className="text-white text-base font-semibold">데이터의 흐름</h5>
                    <ul className="list-disc list-inside space-y-2">
                      <li className="text-white/90 text-base leading-relaxed tracking-normal">
                        <strong>Firebase</strong>: 실시간으로 흐르는 여행 데이터
                      </li>
                      <li className="text-white/90 text-base leading-relaxed tracking-normal">
                        <strong>Vercel</strong>: 빠르고 안정적인 여행 앱 배포
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-white text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Values: 우리가 지키는 것
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-white text-lg">🌊</span>
                  <div>
                    <h4 className="text-white text-base font-semibold">자신만의 여행 파동</h4>
                    <p className="text-white/90 text-base leading-relaxed tracking-normal">
                      세상의 여행 기준이 아닌, 각자의 고유한 여행 방식을 존중합니다
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-white text-lg">🎯</span>
                  <div>
                    <h4 className="text-white text-base font-semibold">명료한 여행 전략</h4>
                    <p className="text-white/90 text-base leading-relaxed tracking-normal">
                      복잡한 여행 계획 속에서 본질을 찾아 단순하게 만듭니다
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-white text-lg">💡</span>
                  <div>
                    <h4 className="text-white text-base font-semibold">지속적인 여행 혁신</h4>
                    <p className="text-white/90 text-base leading-relaxed tracking-normal">
                      멈추지 않되, 자신의 속도로 여행을 진화합니다
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-white text-lg">🤝</span>
                  <div>
                    <h4 className="text-white text-base font-semibold">진정한 여행 파트너십</h4>
                    <p className="text-white/90 text-base leading-relaxed tracking-normal">
                      함께 여행 파동을 만들고 흐름을 이어갑니다
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-white text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Join the Travel Wave
              </h3>
              <h4 className="text-white text-lg font-semibold">당신만의 여행 파동을 찾고 계신가요?</h4>
              <p className="text-white/90 text-base leading-relaxed tracking-normal">
                Moonwave Travel은 당신이 세상의 여행 속도에 휩쓸리지 않고, 자신만의 여행 파동과 흐름을 만들 수 있도록 돕습니다.
              </p>
              <blockquote className="text-white text-lg italic leading-relaxed tracking-normal border-l-4 border-primary-400 pl-6">
                "여행의 속도는 순간의 환호를 가져올지 모르나<br />
                여행 파동과 흐름은 진정한 여행 경험을 가져온다."
              </blockquote>
              <p className="text-white/90 text-base leading-relaxed tracking-normal">
                우리와 함께 당신만의 여행 파동을 발견하고, 지속 가능한 여행 흐름을 만들어가세요.
              </p>
              <div className="space-y-3">
                <h4 className="text-white text-base font-semibold">Contact Moonwave Travel</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li className="text-white/90 text-base leading-relaxed tracking-normal">
                    Email: deasoung@gmail.com
                  </li>
                  <li className="text-white/90 text-base leading-relaxed tracking-normal">
                    Website: www.moonwave.kr
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-white text-base font-semibold">Moonwave Travel HQ</h4>
                <p className="text-white/90 text-base leading-relaxed tracking-normal">
                  전략적 디지털 여행실에서 당신의 여행 파동을 기다립니다.
                </p>
              </div>
              <div className="text-center space-y-3">
                <p className="text-white text-sm opacity-60 tracking-normal">
                  *"We don't follow the travel waves, we create our own."*
                </p>
                <p className="text-white text-sm opacity-60 tracking-normal">
                  © 2025 Moonwave Travel. All rights reserved.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center mt-8">
            <WaveButton
              variant="ghost"
              onClick={onClose}
              className="p-2"
              aria-label="모달 닫기"
            >
              <ArrowLeft className="w-5 h-5" />
              닫기
            </WaveButton>
          </div>
        </div>
      </div>
    </div>
  );
}
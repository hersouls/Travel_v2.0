import React from 'react';
import { ArrowLeft, User, Music, Award, Heart, Trophy, Target, Star, Calendar, Medal, ChevronRight } from 'lucide-react';
import { TrackCard } from './TrackCard';
import { WaveBackground } from './WaveBackground';
import { GlassCard } from './GlassCard';
import { WaveButton } from './WaveButton';
import { getPhaseColors } from '../utils/colors';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AboutPageProps {
  onBack: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  const basicInfo = [
    { label: '이름', value: '오안나 (OH Anna)' },
    { label: '생년월일', value: '2007년 4월 28일 (18세)' },
    { label: '국적', value: '대한민국' },
    { label: '소속', value: '신봉고등학교' },
    { label: '종목', value: '리듬체조' },
    { label: 'SNS', value: '@oh_anna0428' }
  ];

  const majorAchievements = [
    {
      year: '2022',
      title: '주니어 국가대표 선발전',
      achievement: '종합 2위 (99.70점)',
      details: ['곤봉 1위 (26.200점)', '리본 2위 (24.250점)', '볼 3위 (25.000점)', '후프 4위 (24.250점)'],
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-yellow-400/30 to-amber-400/30'
    },
    {
      year: '2022',
      title: '아시아 주니어 선수권',
      achievement: '국가대표 출전',
      details: ['몽골 울란바토르 개최', '15세 나이로 국제 대회 출전'],
      icon: <Medal className="w-6 h-6" />,
      color: 'from-blue-400/30 to-cyan-400/30'
    },
    {
      year: '2024',
      title: '시니어 국가대표',
      achievement: '정규 멤버 활동',
      details: ['FIG 월드컵 출전', '개인종합 44위 (107.700점)', '지속적인 국제 대회 경험 축적'],
      icon: <Star className="w-6 h-6" />,
      color: 'from-purple-400/30 to-violet-400/30'
    }
  ];

  const journeyPhases = [
    {
      phase: 'Beginning',
      period: '2014년 (초등학교 1학년)',
      title: '리듬체조와의 첫 만남',
      description: '특별한 재능을 보이지 않았지만, 꾸준한 노력으로 기초를 다지기 시작',
      quote: '"처음에는 두각을 나타내지 못했지만..."',
      color: getPhaseColors('beginning')
    },
    {
      phase: 'Growth',
      period: '2015-2021년 (성장기)',
      title: '비범한 열정과 노력',
      description: '매일의 연습과 끊임없는 도전을 통해 실력을 차근차근 쌓아가는 시기',
      quote: '"비범한 열정과 노력으로 꾸준한 성장"',
      color: getPhaseColors('growth')
    },
    {
      phase: 'Challenge',
      period: '2022년 (15세)',
      title: '국가대표라는 꿈의 실현',
      description: '주니어 국가대표 선발이라는 최대 성과를 달성하며 한계를 뛰어넘다',
      quote: '"더욱 자신감을 갖고 열심히 노력하겠다"',
      color: getPhaseColors('challenge')
    },
    {
      phase: 'Shine',
      period: '2023-현재 (시니어)',
      title: '체조 요정의 빛나는 현재',
      description: '시니어 무대에서 자신만의 색깔을 찾고 미래를 향해 나아가는 중',
      quote: '"손연재 이후 한국 리듬체조의 희망"',
      color: getPhaseColors('shine')
    }
  ];

  const specialties = [
    {
      icon: <Target className="w-6 h-6" />,
      title: '곤봉 전문가',
      description: '가장 강한 종목인 곤봉에서 국내외 대회 일관된 고득점',
      detail: '주니어 선발전 곤봉 1위 (26.200점)'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: '균형잡힌 4종목',
      description: '후프, 볼, 곤봉, 리본 모든 종목에서 고른 실력 보유',
      detail: '4개 종목 모두 상위권 성적 기록'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: '예술적 표현력',
      description: '음악과 완벽히 조화되는 우아하고 섬세한 연기 스타일',
      detail: '"체조 요정"이라는 애칭으로 불림'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: '국제 경험',
      description: '아시아 선수권부터 월드컵까지 다양한 국제 대회 출전',
      detail: '국내 99.70점 → 국제 107.70점으로 향상'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Wave Background */}
      <WaveBackground />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 p-4">
        <div className="max-w-6xl mx-auto">
          <GlassCard variant="strong" className="p-4">
            <div className="flex items-center justify-between">
              <WaveButton
                onClick={onBack}
                variant="ghost"
                size="sm"
                ariaLabel="뒤로 가기"
                className="p-2 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </WaveButton>
              
              <h1 className="text-lg font-semibold text-white break-keep-ko">
                오안나 이야기
              </h1>
              
              <div className="w-10" /> {/* Spacer */}
            </div>
          </GlassCard>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-32 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <GlassCard 
            variant="strong" 
            withWaveEffect={true}
            className="text-center bg-gradient-to-br from-purple-400/30 to-pink-400/30"
          >
            <div className="mb-8">
              <ImageWithFallback
                src="/image.png"
                alt="오안나 프로필"
                className="w-40 h-40 mx-auto rounded-full shadow-2xl mb-6 wave-pulse border-4 border-white/30"
              />
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 break-keep-ko">
              오안나 (OH Anna)
            </h2>
            <p className="text-2xl text-white/90 mb-6 break-keep-ko">
              대한민국 리듬체조 국가대표
            </p>
            <p className="text-xl text-white/80 mb-8 break-keep-ko italic">
              "평범함에서 피어난 특별함"
            </p>
            <p className="text-white/80 leading-relaxed max-w-3xl mx-auto text-lg break-keep-ko">
              타고난 재능이 아닌 <strong className="text-white">비범한 열정과 노력</strong>으로 
              국가대표의 꿈을 실현한 <strong className="text-white">"체조 요정"</strong>. 
              평범한 시작에서 특별한 미래를 그려가는 모든 이들에게 영감을 주는 이야기를 만들어가고 있습니다.
            </p>
          </GlassCard>

          {/* Basic Profile */}
          <section>
            <GlassCard variant="light" className="mb-6">
              <h3 className="text-2xl font-semibold text-white mb-2 break-keep-ko">
                프로필
              </h3>
              <p className="text-white/70 break-keep-ko">
                기본 정보와 현재 활동 상황
              </p>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {basicInfo.map((info, index) => (
                <GlassCard 
                  key={index}
                  variant="default"
                  className="bg-gradient-to-br from-white/5 to-white/10"
                >
                  <div className="text-center">
                    <h4 className="text-white/60 text-sm mb-1 break-keep-ko">
                      {info.label}
                    </h4>
                    <p className="text-white font-semibold break-keep-ko">
                      {info.value}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Major Achievements */}
          <section>
            <GlassCard variant="light" className="mb-6">
              <h3 className="text-2xl font-semibold text-white mb-2 break-keep-ko">
                주요 성과
              </h3>
              <p className="text-white/70 break-keep-ko">
                15세부터 현재까지 이룬 의미 있는 성취들
              </p>
            </GlassCard>

            <div className="space-y-6">
              {majorAchievements.map((achievement, index) => (
                <GlassCard 
                  key={index}
                  variant="default"
                  className={`bg-gradient-to-r ${achievement.color} relative overflow-hidden`}
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center text-white">
                        {achievement.icon}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1 text-white text-sm font-medium">
                          {achievement.year}년
                        </span>
                        <h4 className="font-bold text-white text-xl break-keep-ko">
                          {achievement.title}
                        </h4>
                      </div>
                      <p className="text-white/95 text-lg font-semibold mb-4 break-keep-ko">
                        {achievement.achievement}
                      </p>
                      <div className="space-y-2">
                        {achievement.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <ChevronRight className="w-4 h-4 text-white/60" />
                            <span className="text-white/80 text-sm break-keep-ko">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Growth Journey */}
          <section>
            <GlassCard variant="light" className="mb-6">
              <h3 className="text-2xl font-semibold text-white mb-2 break-keep-ko">
                성장의 여정
              </h3>
              <p className="text-white/70 break-keep-ko">
                10년간의 체조 인생, 평범함에서 특별함으로의 변화
              </p>
            </GlassCard>

            <div className="space-y-8">
              {journeyPhases.map((phase, index) => (
                <GlassCard 
                  key={index}
                  variant="default"
                  className={`${phase.color.gradient} bg-white/10 relative overflow-hidden border-l-4 ${phase.color.border}`}
                >
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div 
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/30 ${phase.color.bg}`}
                      >
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-3">
                        <h4 className="font-bold text-white text-xl break-keep-ko">
                          {phase.phase} Phase
                        </h4>
                        <span className="text-white/70 text-sm bg-white/10 rounded-full px-3 py-1 w-fit">
                          {phase.period}
                        </span>
                      </div>
                      
                      <h5 className="text-white/95 text-lg font-semibold mb-3 break-keep-ko">
                        {phase.title}
                      </h5>
                      
                      <p className="text-white/80 mb-4 leading-relaxed break-keep-ko">
                        {phase.description}
                      </p>
                      
                      <blockquote className="italic text-white/70 border-l-2 border-white/30 pl-4 break-keep-ko">
                        {phase.quote}
                      </blockquote>
                    </div>
                  </div>

                  {/* Progress connector */}
                  {index < journeyPhases.length - 1 && (
                    <div className="absolute left-7 top-20 w-0.5 h-12 bg-white/20" />
                  )}
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Specialties & Style */}
          <section>
            <GlassCard variant="light" className="mb-6">
              <h3 className="text-2xl font-semibold text-white mb-2 break-keep-ko">
                체조 스타일과 특징
              </h3>
              <p className="text-white/70 break-keep-ko">
                "체조 요정"만의 독특한 매력과 전문성
              </p>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specialties.map((specialty, index) => (
                <GlassCard 
                  key={index}
                  variant="default"
                  className="bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/30 backdrop-blur-md border border-white/30 rounded-xl p-3 text-white">
                      {specialty.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-2 text-lg break-keep-ko">
                        {specialty.title}
                      </h4>
                      <p className="text-white/80 mb-3 break-keep-ko">
                        {specialty.description}
                      </p>
                      <p className="text-white/60 text-sm bg-white/10 rounded-lg px-3 py-2 break-keep-ko">
                        {specialty.detail}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Philosophy */}
          <GlassCard 
            variant="strong"
            className="bg-gradient-to-br from-violet-400/30 to-purple-500/30"
          >
            <div className="text-center">
              <div className="mb-6">
                <Calendar className="w-12 h-12 mx-auto text-white/80 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-4 break-keep-ko">
                  인생 철학과 가치관
                </h3>
              </div>
              
              <blockquote className="text-white/95 text-xl italic leading-relaxed mb-6 break-keep-ko">
                "체조협회와 후원해주시는 분들의 관심과 지원에 감사드린다. <br />
                주니어대표 선발을 계기로 더욱 자신감을 갖고 <br />
                열심히 노력하는 모습을 보여드리겠다."
              </blockquote>
              
              <cite className="block text-white/70 text-sm mb-6 break-keep-ko">
                - 2022년 3월 국가대표 선발 후 소감
              </cite>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h4 className="text-white font-semibold mb-4 break-keep-ko">핵심 가치관</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <p className="text-white/90 mb-1"><strong>감사</strong></p>
                    <p className="text-white/70 break-keep-ko">지원해준 모든 이들에 대한 깊은 고마움</p>
                  </div>
                  <div className="text-left">
                    <p className="text-white/90 mb-1"><strong>겸손</strong></p>
                    <p className="text-white/70 break-keep-ko">성과보다 노력을 강조하는 태도</p>
                  </div>
                  <div className="text-left">
                    <p className="text-white/90 mb-1"><strong>성장 마인드셋</strong></p>
                    <p className="text-white/70 break-keep-ko">지속적인 발전과 개선 추구</p>
                  </div>
                  <div className="text-left">
                    <p className="text-white/90 mb-1"><strong>책임감</strong></p>
                    <p className="text-white/70 break-keep-ko">국가대표로서의 의무와 기대 인식</p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Legacy & Future */}
          <GlassCard 
            variant="strong"
            className="bg-gradient-to-br from-primary/30 to-secondary/30"
          >
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-6 break-keep-ko">
                한국 리듬체조의 미래
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div>
                  <h4 className="text-white font-semibold mb-3 break-keep-ko">역사적 의미</h4>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start space-x-2 break-keep-ko">
                      <ChevronRight className="w-4 h-4 mt-1 text-white/60" />
                      <span>손연재 이후 차세대 리더</span>
                    </li>
                    <li className="flex items-start space-x-2 break-keep-ko">
                      <ChevronRight className="w-4 h-4 mt-1 text-white/60" />
                      <span>체계적 육성 시스템의 수혜자</span>
                    </li>
                    <li className="flex items-start space-x-2 break-keep-ko">
                      <ChevronRight className="w-4 h-4 mt-1 text-white/60" />
                      <span>한국 최초 올림픽 메달의 꿈을 잇는 주인공</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-3 break-keep-ko">미래 목표</h4>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start space-x-2 break-keep-ko">
                      <ChevronRight className="w-4 h-4 mt-1 text-white/60" />
                      <span>2028 LA 올림픽 출전</span>
                    </li>
                    <li className="flex items-start space-x-2 break-keep-ko">
                      <ChevronRight className="w-4 h-4 mt-1 text-white/60" />
                      <span>국제 대회 메달 획득</span>
                    </li>
                    <li className="flex items-start space-x-2 break-keep-ko">
                      <ChevronRight className="w-4 h-4 mt-1 text-white/60" />
                      <span>후배들에게 영감을 주는 선배</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                <p className="text-white/90 text-lg italic break-keep-ko">
                  "평범한 시작에서 특별한 미래를 그려가는 모든 이들에게 영감을 주는 서사"
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Contact & Social */}
          <GlassCard variant="light">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4 break-keep-ko">
                응원과 소통
              </h3>
              <p className="text-white/80 mb-6 break-keep-ko">
                체조를 통해 더 많은 이야기를 나누고 싶습니다
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <WaveButton
                  onClick={() => window.open('https://instagram.com/oh_anna0428', '_blank')}
                  variant="secondary"
                  size="md"
                  ariaLabel="인스타그램 팔로우"
                >
                  @oh_anna0428 팔로우
                </WaveButton>
                <WaveButton
                  onClick={() => {/* FIG Profile link */}}
                  variant="secondary"
                  size="md"
                  ariaLabel="FIG 프로필 보기"
                >
                  FIG 공식 프로필
                </WaveButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};
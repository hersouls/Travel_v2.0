import { SyncLine } from '@/types';

// 샘플 가사 데이터 (13곡 중 첫 번째 곡)
export const sampleLyrics: SyncLine[] = [
  {
    id: 'line-1',
    time: 0.0,
    startTime: 0.0,
    endTime: 3.5,
    text: '평범한 하루를 보내던 나',
    translation: 'Spending an ordinary day',
    confidence: 0.9,
  },
  {
    id: 'line-2',
    time: 3.5,
    startTime: 3.5,
    endTime: 7.0,
    text: '특별한 순간을 만났어',
    translation: 'I met a special moment',
    confidence: 0.9,
  },
  {
    id: 'line-3',
    time: 7.0,
    startTime: 7.0,
    endTime: 10.5,
    text: '음악이 들려오는 그곳에서',
    translation: 'Where music is playing',
    confidence: 0.8,
  },
  {
    id: 'line-4',
    time: 10.5,
    startTime: 10.5,
    endTime: 14.0,
    text: '마음이 설레기 시작했어',
    translation: 'My heart started to flutter',
    confidence: 0.8,
  },
  {
    id: 'line-5',
    time: 14.0,
    startTime: 14.0,
    endTime: 17.5,
    text: '리듬에 맞춰 춤추는 듯',
    translation: 'As if dancing to the rhythm',
    confidence: 0.9,
  },
  {
    id: 'line-6',
    time: 17.5,
    startTime: 17.5,
    endTime: 21.0,
    text: '자유롭게 흔들리는 몸',
    translation: 'My body swaying freely',
    confidence: 0.9,
  },
  {
    id: 'line-7',
    time: 21.0,
    startTime: 21.0,
    endTime: 24.5,
    text: '그때 알았어 내 안의 열정',
    translation: 'That\'s when I knew my passion inside',
    confidence: 0.8,
  },
  {
    id: 'line-8',
    time: 24.5,
    startTime: 24.5,
    endTime: 28.0,
    text: '음악이 나를 깨워주었어',
    translation: 'Music awakened me',
    confidence: 0.8,
  },
  {
    id: 'line-9',
    time: 28.0,
    startTime: 28.0,
    endTime: 31.5,
    text: '더 이상 평범하지 않아',
    translation: 'No longer ordinary',
    confidence: 0.9,
  },
  {
    id: 'line-10',
    time: 31.5,
    startTime: 31.5,
    endTime: 35.0,
    text: '특별한 나로 변해가',
    translation: 'I\'m becoming a special me',
    confidence: 0.9,
  },
  {
    id: 'line-11',
    time: 35.0,
    startTime: 35.0,
    endTime: 38.5,
    text: '음악과 함께하는 시간',
    translation: 'Time spent with music',
    confidence: 0.8,
  },
  {
    id: 'line-12',
    time: 38.5,
    startTime: 38.5,
    endTime: 42.0,
    text: '그 순간이 영원하길',
    translation: 'May that moment last forever',
    confidence: 0.8,
  },
  {
    id: 'line-13',
    time: 42.0,
    startTime: 42.0,
    endTime: 45.5,
    text: '평범함에서 특별함으로',
    translation: 'From ordinary to special',
    confidence: 0.9,
  },
  {
    id: 'line-14',
    time: 45.5,
    startTime: 45.5,
    endTime: 49.0,
    text: '음악이 이끄는 여정',
    translation: 'A journey led by music',
    confidence: 0.9,
  },
  {
    id: 'line-15',
    time: 49.0,
    startTime: 49.0,
    endTime: 52.5,
    text: '함께 걸어가는 우리',
    translation: 'We walking together',
    confidence: 0.8,
  },
];

// LRC 형식 샘플 데이터
export const sampleLRC = `[00:00.00]평범한 하루를 보내던 나
[00:03.50]특별한 순간을 만났어
[00:07.00]음악이 들려오는 그곳에서
[00:10.50]마음이 설레기 시작했어
[00:14.00]리듬에 맞춰 춤추는 듯
[00:17.50]자유롭게 흔들리는 몸
[00:21.00]그때 알았어 내 안의 열정
[00:24.50]음악이 나를 깨워주었어
[00:28.00]더 이상 평범하지 않아
[00:31.50]특별한 나로 변해가
[00:35.00]음악과 함께하는 시간
[00:38.50]그 순간이 영원하길
[00:42.00]평범함에서 특별함으로
[00:45.50]음악이 이끄는 여정
[00:49.00]함께 걸어가는 우리`;

// JSON 형식 샘플 데이터
export const sampleJSON = {
  track: {
    title: '평범함에서 특별함으로',
    artist: '문유',
  },
  lyrics: sampleLyrics,
  exportDate: '2024-01-01T00:00:00.000Z',
  version: '1.0',
};

// 테스트용 트랙 데이터
export const sampleTrack = {
  id: 'track-1',
  title: '평범함에서 특별함으로',
  artist: '문유',
  album: 'Moonwave Collection',
  duration: 52.5,
  coverUrl: '/covers/track1.jpg',
  audioUrl: '/music/track1.mp3',
  description: '평범한 일상에서 특별한 순간을 만나는 이야기',
  lyrics: sampleLyrics,
  interpretation: '이 곡은 일상의 평범함 속에서 음악을 통해 특별한 순간을 발견하는 과정을 담고 있습니다. 리듬체조 선수로서의 경험과 음악에 대한 열정이 조화롭게 어우러진 작품입니다.',
  releaseDate: '2024-01-01',
};
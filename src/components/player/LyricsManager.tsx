import React, { useState, useCallback } from 'react';
import { SyncLine } from '@/types';
import { LyricsTimingAdjuster } from './LyricsTimingAdjuster';
import { 
  DocumentTextIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import {
  parseLyricsToSyncLines,
  parseLRCToSyncLines,
  convertSyncLinesToLRC,
  validateLyricsTiming,
  searchLyrics,
  getLyricsStats,
  exportLyricsToJSON,
  importLyricsFromJSON,
} from '@/utils/lyricsUtils';

interface LyricsManagerProps {
  syncLines: SyncLine[];
  currentTime: number;
  onTimeChange: (time: number) => void;
  onSyncLinesUpdate: (updatedLines: SyncLine[]) => void;
  trackInfo: { title: string; artist: string };
  className?: string;
}

export const LyricsManager: React.FC<LyricsManagerProps> = ({
  syncLines,
  currentTime,
  onTimeChange,
  onSyncLinesUpdate,
  trackInfo,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'timing' | 'edit' | 'import' | 'stats'>('timing');
  const [searchTerm, setSearchTerm] = useState('');
  const [rawLyricsText, setRawLyricsText] = useState('');
  const [importText, setImportText] = useState('');
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; issues: string[] } | null>(null);

  // 검색 결과
  const searchResults = searchTerm ? searchLyrics(syncLines, searchTerm) : [];

  // 통계 정보
  const stats = getLyricsStats(syncLines);

  // 검증 실행
  const runValidation = useCallback(() => {
    const result = validateLyricsTiming(syncLines);
    setValidationResult(result);
  }, [syncLines]);

  // 가사 텍스트에서 SyncLine 생성
  const generateFromText = useCallback(() => {
    if (!rawLyricsText.trim()) return;
    
    const newSyncLines = parseLyricsToSyncLines(rawLyricsText, 0, 3);
    onSyncLinesUpdate(newSyncLines);
    setRawLyricsText('');
  }, [rawLyricsText, onSyncLinesUpdate]);

  // LRC 형식에서 SyncLine 생성
  const generateFromLRC = useCallback(() => {
    if (!importText.trim()) return;
    
    const newSyncLines = parseLRCToSyncLines(importText);
    onSyncLinesUpdate(newSyncLines);
    setImportText('');
  }, [importText, onSyncLinesUpdate]);

  // JSON 내보내기
  const handleExport = useCallback(() => {
    const jsonData = exportLyricsToJSON(syncLines, trackInfo);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trackInfo.title}-lyrics.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [syncLines, trackInfo]);

  // JSON 가져오기
  const handleImport = useCallback(() => {
    if (!importText.trim()) return;
    
    const newSyncLines = importLyricsFromJSON(importText);
    if (newSyncLines.length > 0) {
      onSyncLinesUpdate(newSyncLines);
      setImportText('');
    }
  }, [importText, onSyncLinesUpdate]);

  // LRC 내보내기
  const handleExportLRC = useCallback(() => {
    const lrcData = convertSyncLinesToLRC(syncLines);
    const blob = new Blob([lrcData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trackInfo.title}.lrc`;
    a.click();
    URL.revokeObjectURL(url);
  }, [syncLines, trackInfo]);

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-lg ${className}`}>
      {/* 탭 네비게이션 */}
      <div className="flex border-b border-white/20">
        <button
          onClick={() => setActiveTab('timing')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'timing'
              ? 'text-moonwave-400 border-b-2 border-moonwave-400'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <ClockIcon className="w-4 h-4 inline mr-1" />
          타이밍 조정
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'edit'
              ? 'text-moonwave-400 border-b-2 border-moonwave-400'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <DocumentTextIcon className="w-4 h-4 inline mr-1" />
          가사 편집
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'import'
              ? 'text-moonwave-400 border-b-2 border-moonwave-400'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <ArrowUpTrayIcon className="w-4 h-4 inline mr-1" />
          가져오기/내보내기
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'stats'
              ? 'text-moonwave-400 border-b-2 border-moonwave-400'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <MagnifyingGlassIcon className="w-4 h-4 inline mr-1" />
          통계
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="p-4">
        {activeTab === 'timing' && (
          <LyricsTimingAdjuster
            syncLines={syncLines}
            currentTime={currentTime}
            onTimeChange={onTimeChange}
            onSyncLinesUpdate={onSyncLinesUpdate}
          />
        )}

        {activeTab === 'edit' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-white mb-2">가사 텍스트에서 생성</h4>
              <textarea
                value={rawLyricsText}
                onChange={(e) => setRawLyricsText(e.target.value)}
                placeholder="가사 텍스트를 입력하세요 (줄바꿈으로 구분)"
                className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded text-white resize-none"
              />
              <button
                onClick={generateFromText}
                disabled={!rawLyricsText.trim()}
                className="mt-2 px-4 py-2 bg-moonwave-400 hover:bg-moonwave-500 disabled:bg-gray-600 rounded transition-colors"
              >
                가사 생성
              </button>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-2">검색</h4>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="가사 검색..."
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
                <button
                  onClick={runValidation}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                >
                  검증
                </button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="mt-2 p-2 bg-white/5 rounded">
                  <p className="text-sm text-gray-300">검색 결과: {searchResults.length}개</p>
                  {searchResults.slice(0, 3).map(index => (
                    <p key={index} className="text-sm text-white mt-1">
                      {syncLines[index]?.text || ''}
                    </p>
                  ))}
                </div>
              )}

              {validationResult && (
                <div className="mt-2 p-2 rounded">
                  {validationResult.isValid ? (
                    <div className="flex items-center text-green-400">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      <span className="text-sm">가사 타이밍이 유효합니다.</span>
                    </div>
                  ) : (
                    <div className="text-red-400">
                      <div className="flex items-center mb-1">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                        <span className="text-sm">타이밍 문제가 발견되었습니다:</span>
                      </div>
                      <ul className="text-xs space-y-1">
                        {validationResult.issues.map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-white mb-2">LRC 형식 가져오기</h4>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="LRC 형식의 가사를 입력하세요..."
                className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded text-white resize-none"
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={generateFromLRC}
                  disabled={!importText.trim()}
                  className="px-4 py-2 bg-moonwave-400 hover:bg-moonwave-500 disabled:bg-gray-600 rounded transition-colors"
                >
                  LRC 가져오기
                </button>
                <button
                  onClick={handleImport}
                  disabled={!importText.trim()}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 rounded transition-colors"
                >
                  JSON 가져오기
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-2">내보내기</h4>
              <div className="flex space-x-2">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-moonwave-400 hover:bg-moonwave-500 rounded transition-colors"
                >
                  <ArrowDownTrayIcon className="w-4 h-4 inline mr-1" />
                  JSON 내보내기
                </button>
                <button
                  onClick={handleExportLRC}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                >
                  <ArrowDownTrayIcon className="w-4 h-4 inline mr-1" />
                  LRC 내보내기
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white">가사 통계</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded">
                <p className="text-sm text-gray-400">총 라인 수</p>
                <p className="text-lg font-medium text-white">{stats.totalLines}</p>
              </div>
              <div className="p-3 bg-white/5 rounded">
                <p className="text-sm text-gray-400">총 지속 시간</p>
                <p className="text-lg font-medium text-white">{stats.totalDuration.toFixed(1)}초</p>
              </div>
              <div className="p-3 bg-white/5 rounded">
                <p className="text-sm text-gray-400">평균 라인 지속 시간</p>
                <p className="text-lg font-medium text-white">{stats.averageLineDuration.toFixed(1)}초</p>
              </div>
              <div className="p-3 bg-white/5 rounded">
                <p className="text-sm text-gray-400">총 문자 수</p>
                <p className="text-lg font-medium text-white">{stats.totalCharacters}</p>
              </div>
              <div className="p-3 bg-white/5 rounded">
                <p className="text-sm text-gray-400">라인당 평균 문자 수</p>
                <p className="text-lg font-medium text-white">{stats.averageCharactersPerLine.toFixed(1)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
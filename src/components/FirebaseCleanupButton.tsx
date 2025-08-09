import React, { useState } from 'react';
import { WaveButton } from './WaveButton';
import { GlassCard } from './GlassCard';
import { cleanupAllFirebaseData, cleanupCurrentUserData } from '../utils/firebaseCleanup';
import { Trash2, AlertTriangle, CheckCircle, XCircle, Loader } from 'lucide-react';

type CleanupAllResult = {
  success: boolean;
  results?: { collection: string; deletedCount?: number; success?: boolean; error?: unknown }[];
  error?: unknown;
};

type CleanupUserResult = {
  success: boolean;
  deletedTrips?: number;
  deletedPlans?: number;
  error?: unknown;
};

export const FirebaseCleanupButton: React.FC = () => {
  const [cleaning, setCleaning] = useState(false);
  const [results, setResults] = useState<CleanupAllResult | CleanupUserResult | null>(null);
  const [confirmAll, setConfirmAll] = useState(false);
  const [confirmUser, setConfirmUser] = useState(false);

  const handleCleanupAll = async () => {
    if (!confirmAll) {
      alert('⚠️ 체크박스를 체크해주세요. 이 작업은 되돌릴 수 없습니다!');
      return;
    }

    const finalConfirm = window.confirm(
      '⚠️ 정말로 Firebase의 모든 데이터를 삭제하시겠습니까?\n\n' +
      '- 모든 사용자의 여행 데이터가 삭제됩니다\n' +
      '- 이 작업은 되돌릴 수 없습니다\n' +
      '- 삭제 후 복구가 불가능합니다\n\n' +
      '계속하시려면 "확인"을 클릭하세요.'
    );

    if (!finalConfirm) return;

    setCleaning(true);
    setResults(null);
    
    try {
      const result = await cleanupAllFirebaseData();
      setResults(result as CleanupAllResult);
    } catch (error) {
      setResults({ success: false, error } as CleanupAllResult);
    } finally {
      setCleaning(false);
      setConfirmAll(false);
    }
  };

  const handleCleanupCurrentUser = async () => {
    if (!confirmUser) {
      alert('⚠️ 체크박스를 체크해주세요. 이 작업은 되돌릴 수 없습니다!');
      return;
    }

    const finalConfirm = window.confirm(
      '⚠️ 정말로 현재 로그인된 사용자의 데이터를 삭제하시겠습니까?\n\n' +
      '- 현재 사용자의 모든 여행 데이터가 삭제됩니다\n' +
      '- 이 작업은 되돌릴 수 없습니다\n\n' +
      '계속하시려면 "확인"을 클릭하세요.'
    );

    if (!finalConfirm) return;

    setCleaning(true);
    setResults(null);
    
    try {
      const result = await cleanupCurrentUserData();
      setResults(result as CleanupUserResult);
    } catch (error) {
      setResults({ success: false, error } as CleanupUserResult);
    } finally {
      setCleaning(false);
      setConfirmUser(false);
    }
  };

  return (
    <GlassCard variant="strong" className="p-6 space-y-6 border-red-500/30">
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-6 h-6 text-red-400" />
        <h3 className="text-white font-bold text-lg">⚠️ 데이터 초기화</h3>
      </div>
      
      <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4">
        <p className="text-red-200 text-sm font-medium">
          ⚠️ 위험: 이 작업들은 되돌릴 수 없습니다!
        </p>
        <p className="text-red-300 text-xs mt-1">
          데이터 삭제 전에 반드시 백업을 확인하세요.
        </p>
      </div>

      {/* 현재 사용자 데이터만 삭제 */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold">현재 사용자 데이터 삭제</h4>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="confirmUser"
            checked={confirmUser}
            onChange={(e) => setConfirmUser(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="confirmUser" className="text-white/80 text-sm">
            현재 로그인된 사용자의 데이터를 삭제하는 것에 동의합니다
          </label>
        </div>
        
        <WaveButton
          onClick={handleCleanupCurrentUser}
          disabled={cleaning || !confirmUser}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          {cleaning ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              삭제 중...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              현재 사용자 데이터 삭제
            </>
          )}
        </WaveButton>
      </div>

      <div className="border-t border-white/10 pt-4">
        {/* 전체 데이터 삭제 */}
        <div className="space-y-3">
          <h4 className="text-red-300 font-semibold">⚠️ 전체 데이터 삭제</h4>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="confirmAll"
              checked={confirmAll}
              onChange={(e) => setConfirmAll(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="confirmAll" className="text-white/80 text-sm">
              모든 사용자의 데이터를 삭제하는 것에 동의합니다 (위험!)
            </label>
          </div>
          
          <WaveButton
            onClick={handleCleanupAll}
            disabled={cleaning || !confirmAll}
            variant="secondary"
            size="sm"
            className="w-full bg-red-600/80 hover:bg-red-600 border-red-500"
          >
            {cleaning ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                삭제 중...
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                전체 데이터 삭제 (위험!)
              </>
            )}
          </WaveButton>
        </div>
      </div>

      {results && (
        <div className={`p-4 rounded-lg border ${
          results.success 
            ? 'bg-green-500/20 border-green-400/30' 
            : 'bg-red-500/20 border-red-400/30'
        }`}>
          <div className="flex items-center space-x-2">
            {results.success ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className={`font-medium ${
              results.success ? 'text-green-300' : 'text-red-300'
            }`}>
              {results.success ? '삭제 완료!' : '삭제 실패'}
            </span>
          </div>
          
          {'results' in results && results.results && (
            <div className="mt-2 text-sm text-white/80">
              {results.results.map((result, index) => (
                <div key={index}>
                  {result.collection}: {result.deletedCount ?? 0}개 문서 삭제됨
                </div>
              ))}
            </div>
          )}
          
          {'deletedTrips' in results && results.deletedTrips !== undefined && (
            <div className="mt-2 text-sm text-white/80">
              여행: {results.deletedTrips}개, 계획: {('deletedPlans' in results && results.deletedPlans) ? results.deletedPlans : 0}개 삭제됨
            </div>
          )}
          
          {results.error && (
            <p className="text-xs text-red-300 mt-2">
              {typeof results.error === 'object' 
                ? (results.error as { message?: string }).message || JSON.stringify(results.error)
                : String(results.error)
              }
            </p>
          )}
        </div>
      )}
      
      <p className="text-xs text-white/60">
        이 도구는 개발 환경에서만 표시됩니다. 프로덕션에서는 사용할 수 없습니다.
      </p>
    </GlassCard>
  );
};
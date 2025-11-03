import React from 'react';
import { WeeklyHomeroomLog, DayOfWeek, HomeroomDayLog } from '../types';
import { DAYS_OF_WEEK } from '../constants';

interface HomeroomLogProps {
  homeroomLog: WeeklyHomeroomLog;
  setHomeroomLog: React.Dispatch<React.SetStateAction<WeeklyHomeroomLog>>;
}

const PrintableHomeroomLog: React.FC<{ homeroomLog: WeeklyHomeroomLog }> = ({ homeroomLog }) => {
    return (
        <div className="print-container hidden">
            <div className="text-center mb-4">
                <h2 className="text-lg font-bold">บันทึกกิจกรรมโฮมรูม (รายสัปดาห์)</h2>
                <p>ชั้นมัธยมศึกษาปีที่ 6 โรงเรียนบ้านห้วยลาด ปีการศึกษา 2568</p>
            </div>
            <div className="space-y-4 text-xs">
                {DAYS_OF_WEEK.map(({ key: day, label }) => (
                    <div key={day} className="border border-black p-2 break-inside-avoid">
                        <h3 className="font-bold mb-1">{label}</h3>
                        <div className="grid grid-cols-2 gap-x-2">
                           <div>
                                <h4 className="font-semibold underline">เรื่องที่แจ้ง/พูดคุย:</h4>
                                <p className="whitespace-pre-wrap">{homeroomLog[day]?.topics || '-'}</p>
                           </div>
                           <div>
                                <h4 className="font-semibold underline">ปัญหาที่พบ/เรื่องที่ต้องติดตาม:</h4>
                                <p className="whitespace-pre-wrap">{homeroomLog[day]?.issues || '-'}</p>
                           </div>
                        </div>
                    </div>
                ))}
            </div>
             <div className="mt-8 text-xs">
                <div className="text-center">
                    <p>ลงชื่อ.........................................ครูประจำชั้น</p>
                    <p>(.........................................)</p>
                </div>
            </div>
        </div>
    );
};

const HomeroomLog: React.FC<HomeroomLogProps> = ({ homeroomLog, setHomeroomLog }) => {

  const handleLogChange = (day: DayOfWeek, field: keyof HomeroomDayLog, value: string) => {
    setHomeroomLog(prevLog => ({
      ...prevLog,
      [day]: {
        ...(prevLog[day] || { topics: '', issues: '' }),
        [field]: value
      }
    }));
  };
  
  return (
    <>
      <PrintableHomeroomLog homeroomLog={homeroomLog} />
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start mb-6">
            <div className="text-center flex-grow">
              <h2 className="text-2xl font-bold text-gray-800">บันทึกกิจกรรมโฮมรูม (รายสัปดาห์)</h2>
              <p className="text-gray-500">บันทึกเรื่องที่พูดคุยและปัญหาที่พบในแต่ละวัน</p>
            </div>
            <button onClick={() => window.print()} className="no-print px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v3a2 2 0 002 2h6a2 2 0 002-2v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                <span>พิมพ์เอกสาร</span>
            </button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {DAYS_OF_WEEK.map(({ key: day, label }) => (
            <div key={day} className="bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">{label}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`topics-${day}`} className="block text-sm font-medium text-gray-700 mb-1">เรื่องที่แจ้ง/พูดคุย</label>
                  <textarea
                    id={`topics-${day}`}
                    rows={5}
                    value={homeroomLog[day]?.topics || ''}
                    onChange={e => handleLogChange(day, 'topics', e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor={`issues-${day}`} className="block text-sm font-medium text-gray-700 mb-1">ปัญหาที่พบ/เรื่องที่ต้องติดตาม</label>
                  <textarea
                    id={`issues-${day}`}
                    rows={5}
                    value={homeroomLog[day]?.issues || ''}
                    onChange={e => handleLogChange(day, 'issues', e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomeroomLog;
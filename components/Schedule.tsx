import React, { useState } from 'react';
import { TeachingLogEntry, DayOfWeek } from '../types';
import { DAYS_OF_WEEK } from '../constants';

interface TeachingLogProps {
  teachingLog: Record<DayOfWeek, TeachingLogEntry[]>;
  setTeachingLog: React.Dispatch<React.SetStateAction<Record<DayOfWeek, TeachingLogEntry[]>>>;
}

const PrintableTeachingLog: React.FC<{ teachingLog: Record<DayOfWeek, TeachingLogEntry[]> }> = ({ teachingLog }) => {
    return (
        <div className="print-container hidden">
            <div className="text-center mb-4">
                <h2 className="text-lg font-bold">บันทึกการสอน</h2>
                <p>ปีการศึกษา 2568</p>
                <div className="flex justify-center gap-4 text-sm">
                   <span>สัปดาห์ที่...........</span>
                   <span>ประจำเดือน...........................</span>
                   <span>พ.ศ................</span>
                </div>
            </div>
            <div className="space-y-4 text-xs">
                {DAYS_OF_WEEK.map(({ key: day, label }) => (
                    <div key={day}>
                        <h3 className="font-bold my-1">{label} ที่......... เดือน........................... พ.ศ.........</h3>
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="w-10">ชั่วโมงที่</th>
                                    <th>รายวิชา</th>
                                    <th>ครูผู้สอน</th>
                                    <th>เนื้อหา/กิจกรรมที่สอน</th>
                                    <th>ลงชื่อครูผู้สอน</th>
                                    <th>หมายเหตุ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(teachingLog[day] || []).map(entry => (
                                    <tr key={entry.period} className="text-center">
                                        <td>{entry.period}</td>
                                        <td className="text-left px-1">{entry.subject}</td>
                                        <td className="text-left px-1">{entry.teacher}</td>
                                        <td className="text-left px-1">{entry.content}</td>
                                        <td></td>
                                        <td className="text-left px-1">{entry.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            <div className="mt-8 text-xs" style={{ columns: 2 }}>
                <div className="text-center break-inside-avoid">
                    <p>ลงชื่อ.........................................</p>
                    <p>(นายนำพล เสคำพันธ์)</p>
                    <p>หัวหน้าฝ่ายวิชาการ</p>
                </div>
                 <div className="text-center break-inside-avoid">
                    <p>ลงชื่อ.........................................</p>
                    <p>(นางจารุนันท์ กังคำ)</p>
                    <p>ผู้อำนวยการโรงเรียนบ้านห้วยลาด</p>
                </div>
            </div>
        </div>
    );
};


const TeachingLog: React.FC<TeachingLogProps> = ({ teachingLog, setTeachingLog }) => {
  const [editingRow, setEditingRow] = useState<{ day: DayOfWeek; period: number } | null>(null);
  const [currentRowData, setCurrentRowData] = useState<TeachingLogEntry | null>(null);

  const handleEdit = (day: DayOfWeek, entry: TeachingLogEntry) => {
    setEditingRow({ day, period: entry.period });
    setCurrentRowData(entry);
  };

  const handleCancel = () => {
    setEditingRow(null);
    setCurrentRowData(null);
  };

  const handleSave = () => {
    if (!editingRow || !currentRowData) return;
    const { day, period } = editingRow;

    setTeachingLog(prevLog => {
      const newDayLog = prevLog[day].map(entry =>
        entry.period === period ? currentRowData : entry
      );
      return { ...prevLog, [day]: newDayLog };
    });

    handleCancel();
  };

  const handleInputChange = (field: keyof TeachingLogEntry, value: string) => {
    if (currentRowData) {
      setCurrentRowData({ ...currentRowData, [field]: value });
    }
  };
  
  const renderRow = (day: DayOfWeek, entry: TeachingLogEntry) => {
    const isEditing = editingRow?.day === day && editingRow?.period === entry.period;

    if (isEditing && currentRowData) {
      return (
        <tr key={entry.period} className="bg-blue-50">
          <td className="px-2 py-2 text-center font-medium">{entry.period}</td>
          <td className="px-2 py-2"><input type="text" value={currentRowData.subject} onChange={e => handleInputChange('subject', e.target.value)} className="w-full p-1 border rounded" /></td>
          <td className="px-2 py-2"><input type="text" value={currentRowData.teacher} onChange={e => handleInputChange('teacher', e.target.value)} className="w-full p-1 border rounded" /></td>
          <td className="px-2 py-2"><input type="text" value={currentRowData.content} onChange={e => handleInputChange('content', e.target.value)} className="w-full p-1 border rounded" /></td>
          <td className="px-2 py-2"><input type="text" value={currentRowData.notes} onChange={e => handleInputChange('notes', e.target.value)} className="w-full p-1 border rounded" /></td>
          <td className="px-2 py-2 whitespace-nowrap">
            <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded text-sm mr-2">บันทึก</button>
            <button onClick={handleCancel} className="px-3 py-1 bg-gray-200 rounded text-sm">ยกเลิก</button>
          </td>
        </tr>
      );
    }

    return (
      <tr key={entry.period}>
        <td className="px-2 py-3 text-center font-medium text-gray-600">{entry.period}</td>
        <td className="px-2 py-3">{entry.subject || '-'}</td>
        <td className="px-2 py-3">{entry.teacher || '-'}</td>
        <td className="px-2 py-3">{entry.content || '-'}</td>
        <td className="px-2 py-3">{entry.notes || '-'}</td>
        <td className="px-2 py-3">
          <button onClick={() => handleEdit(day, entry)} className="px-3 py-1 text-blue-600 hover:bg-blue-100 rounded text-sm">แก้ไข</button>
        </td>
      </tr>
    );
  };

  return (
    <>
      <PrintableTeachingLog teachingLog={teachingLog} />
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start mb-6">
            <div className="text-center flex-grow">
              <h2 className="text-2xl font-bold text-gray-800">บันทึกการเข้าสอน</h2>
              <p className="text-gray-500">บันทึกรายละเอียดการสอนในแต่ละคาบเรียน</p>
            </div>
            <button onClick={() => window.print()} className="no-print px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v3a2 2 0 002 2h6a2 2 0 002-2v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                <span>พิมพ์เอกสาร</span>
            </button>
        </div>

        <div className="space-y-8">
          {DAYS_OF_WEEK.map(({ key: day, label }) => (
            <div key={day} className="p-4 border rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">{label}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider w-12">คาบ</th>
                      <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">รายวิชา</th>
                      <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">ครูผู้สอน</th>
                      <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">เนื้อหา/กิจกรรม</th>
                      <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">หมายเหตุ</th>
                      <th className="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(teachingLog[day] || []).map(entry => renderRow(day, entry))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TeachingLog;
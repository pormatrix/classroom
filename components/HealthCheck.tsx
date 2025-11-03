
import React from 'react';
import { Student, HealthRecord, HealthCriteria } from '../types';
import { HEALTH_CRITERIA_LABELS } from '../constants';

interface HealthCheckProps {
  students: Student[];
  healthRecords: Record<number, HealthRecord>;
  setHealthRecords: React.Dispatch<React.SetStateAction<Record<number, HealthRecord>>>;
}

const PrintableHealthCheck: React.FC<{ students: Student[], healthRecords: Record<number, HealthRecord> }> = ({ students, healthRecords }) => {
    const defaultRecord: HealthRecord = { clothing: 0, nails: 0, hair: 0, skin: 0, teeth: 0 };
    return (
        <div className="print-container hidden">
            <div className="text-center mb-4">
                <h2 className="text-lg font-bold">บันทึกการตรวจสุขภาพประจำวัน</h2>
                <p>ชั้นมัธยมศึกษาปีที่ 6 โรงเรียนบ้านห้วยลาด ปีการศึกษา 2568</p>
            </div>
            <div className="text-xs mb-2">
                <p><strong>คำชี้แจง</strong></p>
                <p>1. ให้ผู้ดำเนินตรวจสุขภาพตามสภาพความเป็นจริง</p>
                <p>2. ผลการประเมินแบ่งออกเป็น 3 ระดับ คือ 0 = ต้องปรับปรุง, 1 = ดี, 2 = ดี</p>
                <p>   คะแนนรวม 10 คะแนน เกณฑ์การประเมิน 5 คะแนนขึ้นไปถือว่าผ่าน</p>
                <p>3. ให้ใส่ตัวเลขระดับคะแนน 0, 1, หรือ 2 ลงช่องรายการที่ตรวจ</p>
            </div>
            <table className="min-w-full text-xs">
                <thead>
                    <tr>
                        <th rowSpan={2}>เลขที่</th>
                        <th rowSpan={2}>ชื่อ - สกุล</th>
                        <th colSpan={5}>รายการตรวจ</th>
                        <th rowSpan={2}>รวม 10 คะแนน</th>
                        <th rowSpan={2}>ผ่าน</th>
                        <th rowSpan={2}>ไม่ผ่าน</th>
                    </tr>
                    <tr>
                        <th>เสื้อผ้า</th>
                        <th>เล็บ</th>
                        <th>ผม</th>
                        <th>ผิวหนัง</th>
                        <th>ฟัน</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => {
                        const record = healthRecords[student.id] || defaultRecord;
                        // FIX: Cast Object.values to number[] to ensure totalScore is a number.
                        const totalScore = (Object.values(record) as number[]).reduce((sum, score) => sum + score, 0);
                        const isPass = totalScore >= 5;
                        return (
                            <tr key={student.id} className="text-center">
                                <td>{index + 1}</td>
                                <td className="text-left px-1">{student.name}</td>
                                <td>{record.clothing}</td>
                                <td>{record.nails}</td>
                                <td>{record.hair}</td>
                                <td>{record.skin}</td>
                                <td>{record.teeth}</td>
                                <td>{totalScore}</td>
                                <td>{isPass ? '✔' : ''}</td>
                                <td>{!isPass ? '✔' : ''}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="mt-8 text-xs" style={{ columns: 2 }}>
                <div className="text-center break-inside-avoid">
                    <p>ลงชื่อ.........................................ผู้บันทึก</p>
                    <p>(นายมนตรี ตุ่มน้ำ)</p>
                    <p>ครูประจำชั้น</p>
                </div>
                 <div className="text-center break-inside-avoid">
                    <p>ลงชื่อ.........................................ผู้บันทึก</p>
                    <p>(นายยุรนันท์ พรรณขาม)</p>
                    <p>ครูประจำชั้น</p>
                </div>
            </div>
             <div className="mt-8 text-xs">
                <div className="text-center">
                    <p>ลงชื่อ.........................................ผู้ตรวจและรับรองข้อมูล</p>
                    <p>(นางจารุนันท์ กังคำ)</p>
                    <p>ผู้อำนวยการโรงเรียนบ้านห้วยลาด</p>
                </div>
            </div>
        </div>
    );
};


const HealthCheck: React.FC<HealthCheckProps> = ({ students, healthRecords, setHealthRecords }) => {
  const handleRecordChange = (studentId: number, criteria: HealthCriteria, value: string) => {
    const score = Math.max(0, Math.min(2, Number(value) || 0));
    setHealthRecords(prevRecords => ({
      ...prevRecords,
      [studentId]: {
        ...(prevRecords[studentId] || { clothing: 0, nails: 0, hair: 0, skin: 0, teeth: 0 }),
        [criteria]: score,
      },
    }));
  };
  
  const defaultRecord: HealthRecord = { clothing: 0, nails: 0, hair: 0, skin: 0, teeth: 0 };

  return (
    <>
      <PrintableHealthCheck students={students} healthRecords={healthRecords} />
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start mb-6">
            <div className="text-center flex-grow">
                <h2 className="text-2xl font-bold text-gray-800">บันทึกการตรวจสุขภาพประจำวัน</h2>
                <p className="text-gray-500">เกณฑ์การประเมิน: 0 = ต้องปรับปรุง, 1 = ดี, 2 = ดีมาก | 5 คะแนนขึ้นไปถือว่าผ่าน</p>
            </div>
            <button onClick={() => window.print()} className="no-print px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v3a2 2 0 002 2h6a2 2 0 002-2v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                <span>พิมพ์เอกสาร</span>
            </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border text-center">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  ชื่อ - สกุล
                </th>
                {HEALTH_CRITERIA_LABELS.map(({ key, label }) => (
                  <th key={key} scope="col" className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    {label}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-28">รวม (10)</th>
                <th scope="col" className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-20">ผ่าน</th>
                <th scope="col" className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-20">ไม่ผ่าน</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map(student => {
                const studentRecord = healthRecords[student.id] || defaultRecord;
                // FIX: Cast Object.values to number[] to ensure totalScore is a number.
                const totalScore = (Object.values(studentRecord) as number[]).reduce((sum, score) => sum + score, 0);
                const isPass = totalScore >= 5;

                return (
                  <tr key={student.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-left sticky left-0 bg-white">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    </td>
                    {HEALTH_CRITERIA_LABELS.map(({ key }) => (
                      <td key={key} className="px-4 py-2 whitespace-nowrap">
                         <input
                            type="number"
                            min="0"
                            max="2"
                            value={studentRecord[key] ?? 0}
                            onChange={(e) => handleRecordChange(student.id, key, e.target.value)}
                            className="w-16 p-1 text-center border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                      </td>
                    ))}
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`font-bold text-lg ${isPass ? 'text-green-600' : 'text-red-600'}`}>{totalScore}</span>
                    </td>
                     <td className="px-4 py-2 whitespace-nowrap text-green-500 text-2xl font-bold">
                      {isPass ? '✔' : ''}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-red-500 text-xl font-bold">
                      {!isPass ? '✘' : ''}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HealthCheck;
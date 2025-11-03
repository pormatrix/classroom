import React from 'react';
import { Student, GrowthRecord, GrowthStatus } from '../types';

interface GrowthTrackerProps {
  students: Student[];
  growthRecords: Record<number, GrowthRecord>;
  setGrowthRecords: React.Dispatch<React.SetStateAction<Record<number, GrowthRecord>>>;
}

const PrintableGrowthTracker: React.FC<{ students: Student[], growthRecords: Record<number, GrowthRecord> }> = ({ students, growthRecords }) => {
    const defaultRecord: GrowthRecord = { age: null, weight: null, weightStatus: 'ปกติ', height: null, heightStatus: 'ปกติ', notes: '' };
    return (
        <div className="print-container hidden">
            <div className="text-center mb-4">
                <h2 className="text-lg font-bold">บันทึกการชั่งน้ำหนัก - วัดส่วนสูง</h2>
                <p>ชั้นมัธยมศึกษาปีที่ 6 ปีการศึกษา 2568</p>
                <p>โรงเรียนบ้านห้วยลาด สำนักงานเขตพื้นที่การศึกษาประถมศึกษาเพชรบูรณ์ เขต 2</p>
                <p>ประจำเดือน....................................... พ.ศ. 25...............</p>
            </div>
            <table className="min-w-full text-xs">
                <thead>
                    <tr>
                        <th rowSpan={2}>ลำดับที่</th>
                        <th rowSpan={2}>ชื่อ - สกุล</th>
                        <th rowSpan={2}>อายุ</th>
                        <th colSpan={3}>น้ำหนัก</th>
                        <th colSpan={3}>ส่วนสูง</th>
                        <th rowSpan={2}>หมายเหตุ</th>
                    </tr>
                    <tr>
                        <th>กก.</th>
                        <th>ปกติ</th>
                        <th>ไม่ปกติ</th>
                        <th>ซม.</th>
                        <th>ปกติ</th>
                        <th>ไม่ปกติ</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => {
                        const record = growthRecords[student.id] || defaultRecord;
                        return (
                            <tr key={student.id} className="text-center">
                                <td>{index + 1}</td>
                                <td className="text-left px-1">{student.name}</td>
                                <td>{record.age}</td>
                                <td>{record.weight}</td>
                                <td>{record.weightStatus === 'ปกติ' ? '/' : ''}</td>
                                <td>{record.weightStatus === 'ไม่ปกติ' ? '/' : ''}</td>
                                <td>{record.height}</td>
                                <td>{record.heightStatus === 'ปกติ' ? '/' : ''}</td>
                                <td>{record.heightStatus === 'ไม่ปกติ' ? '/' : ''}</td>
                                <td className="text-left px-1">{record.notes}</td>
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
}

const GrowthTracker: React.FC<GrowthTrackerProps> = ({ students, growthRecords, setGrowthRecords }) => {

  const handleRecordChange = (studentId: number, field: keyof GrowthRecord, value: string | number | null) => {
    setGrowthRecords(prevRecords => ({
      ...prevRecords,
      [studentId]: {
        ...(prevRecords[studentId] || { age: null, weight: null, weightStatus: 'ปกติ', height: null, heightStatus: 'ปกติ', notes: '' }),
        [field]: value,
      },
    }));
  };

  const defaultRecord: GrowthRecord = { age: null, weight: null, weightStatus: 'ปกติ', height: null, heightStatus: 'ปกติ', notes: '' };

  return (
    <>
      <PrintableGrowthTracker students={students} growthRecords={growthRecords} />
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div className="text-center flex-grow">
            <h2 className="text-2xl font-bold text-gray-800">บันทึกน้ำหนัก - วัดส่วนสูง</h2>
            <p className="text-gray-500">กรอกข้อมูลการเจริญเติบโตของนักเรียน</p>
          </div>
          <button onClick={() => window.print()} className="no-print px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v3a2 2 0 002 2h6a2 2 0 002-2v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
            <span>พิมพ์เอกสาร</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th rowSpan={2} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ลำดับ</th>
                <th rowSpan={2} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ - สกุล</th>
                <th rowSpan={2} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">อายุ (ปี)</th>
                <th colSpan={3} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-l">น้ำหนัก</th>
                <th colSpan={3} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-l">ส่วนสูง</th>
                <th rowSpan={2} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">หมายเหตุ</th>
              </tr>
              <tr>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l">กก.</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ปกติ</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ไม่ปกติ</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l">ซม.</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ปกติ</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ไม่ปกติ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => {
                  const record = growthRecords[student.id] || defaultRecord;
                  return (
                      <tr key={student.id}>
                          <td className="px-3 py-2 text-center">{index + 1}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                          <td className="px-3 py-2">
                               <input
                                  type="number"
                                  value={record.age ?? ''}
                                  onChange={e => handleRecordChange(student.id, 'age', e.target.value === '' ? null : Number(e.target.value))}
                                  className="w-20 p-1 text-center border border-gray-300 rounded-md"
                              />
                          </td>
                          <td className="px-3 py-2 border-l">
                              <input
                                  type="number"
                                  value={record.weight ?? ''}
                                  onChange={e => handleRecordChange(student.id, 'weight', e.target.value === '' ? null : Number(e.target.value))}
                                  className="w-20 p-1 text-center border border-gray-300 rounded-md"
                              />
                          </td>
                          <td className="px-3 py-2 text-center">
                              <input type="radio" name={`weightStatus-${student.id}`} checked={record.weightStatus === 'ปกติ'} onChange={() => handleRecordChange(student.id, 'weightStatus', 'ปกติ')} />
                          </td>
                           <td className="px-3 py-2 text-center">
                              <input type="radio" name={`weightStatus-${student.id}`} checked={record.weightStatus === 'ไม่ปกติ'} onChange={() => handleRecordChange(student.id, 'weightStatus', 'ไม่ปกติ')} />
                          </td>
                          <td className="px-3 py-2 border-l">
                               <input
                                  type="number"
                                  value={record.height ?? ''}
                                  onChange={e => handleRecordChange(student.id, 'height', e.target.value === '' ? null : Number(e.target.value))}
                                  className="w-20 p-1 text-center border border-gray-300 rounded-md"
                              />
                          </td>
                          <td className="px-3 py-2 text-center">
                               <input type="radio" name={`heightStatus-${student.id}`} checked={record.heightStatus === 'ปกติ'} onChange={() => handleRecordChange(student.id, 'heightStatus', 'ปกติ')} />
                          </td>
                           <td className="px-3 py-2 text-center">
                               <input type="radio" name={`heightStatus-${student.id}`} checked={record.heightStatus === 'ไม่ปกติ'} onChange={() => handleRecordChange(student.id, 'heightStatus', 'ไม่ปกติ')} />
                          </td>
                          <td className="px-3 py-2">
                               <input
                                  type="text"
                                  value={record.notes ?? ''}
                                  onChange={e => handleRecordChange(student.id, 'notes', e.target.value)}
                                  className="w-full p-1 border border-gray-300 rounded-md"
                              />
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

export default GrowthTracker;
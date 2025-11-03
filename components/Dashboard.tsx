// Implemented the Dashboard component to provide an overview of class data.
import React from 'react';
import { Student, HealthRecord, GrowthRecord, TeachingLogEntry, DayOfWeek, WeeklyHomeroomLog } from '../types';
import { DAYS_OF_WEEK } from '../constants';


interface DashboardProps {
    students: Student[];
    healthRecords: Record<number, HealthRecord>;
    growthRecords: Record<number, GrowthRecord>;
    homeroomLog: WeeklyHomeroomLog;
    teachingLog: Record<DayOfWeek, TeachingLogEntry[]>;
}

const Dashboard: React.FC<DashboardProps> = ({ students, healthRecords, growthRecords, homeroomLog, teachingLog }) => {
    const totalStudents = students.length;

    const healthIssuesCount = Object.values(healthRecords).filter(record => {
        const totalScore = Object.values(record).reduce((sum, score) => sum + score, 0);
        return totalScore < 5;
    }).length;
    
    const growthIssues = Object.values(growthRecords).filter(
        (record: GrowthRecord) => record.heightStatus === 'ไม่ปกติ' || record.weightStatus === 'ไม่ปกติ'
    ).length;

    const findLatestLog = () => {
        const reversedDays: DayOfWeek[] = ['friday', 'thursday', 'wednesday', 'tuesday', 'monday'];
        for (const day of reversedDays) {
            const log = homeroomLog[day];
            if (log && (log.topics.trim() || log.issues.trim())) {
                const dayLabel = DAYS_OF_WEEK.find(d => d.key === day)?.label;
                return { ...log, day: dayLabel }; 
            }
        }
        return null;
    };
    const latestLog = findLatestLog();

    const dayMap: { [key: number]: DayOfWeek } = { 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday' };
    const todayKey = dayMap[new Date().getDay()];
    const todaysTeachingLog = todayKey 
        ? teachingLog[todayKey]?.filter(entry => entry.subject || entry.teacher || entry.content || entry.notes) 
        : [];


    const StatCard = ({ title, value, subtext }: { title: string; value: string | number; subtext: string; }) => (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-500">{title}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
            <p className="text-sm text-gray-400 mt-1">{subtext}</p>
        </div>
    );
    
    return (
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">ภาพรวมข้อมูล</h2>
                <p className="text-gray-500">สรุปข้อมูลสำคัญของชั้นเรียน</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="จำนวนนักเรียนทั้งหมด" value={totalStudents} subtext="คน" />
                <StatCard title="นักเรียนสุขภาพไม่ผ่านเกณฑ์" value={healthIssuesCount} subtext="คน" />
                <StatCard title="นักเรียนที่การเจริญเติบโตผิดปกติ" value={growthIssues} subtext="คน" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg border">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">บันทึกการสอนวันนี้</h3>
                    {todaysTeachingLog.length > 0 ? (
                        <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {todaysTeachingLog.map(log => (
                                <li key={log.period} className="p-3 bg-white rounded-md border text-sm">
                                    <p className="font-bold text-gray-800">คาบที่ {log.period}: {log.subject || '(ยังไม่ระบุวิชา)'}</p>
                                    <p className="text-gray-600">ครูผู้สอน: {log.teacher || '-'}</p>
                                    <p className="text-gray-600">เนื้อหา: {log.content || '-'}</p>
                                    {log.notes && <p className="text-gray-500 mt-1">หมายเหตุ: {log.notes}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                             <p className="text-center text-gray-500">
                                {todayKey ? 'ยังไม่มีบันทึกการสอนสำหรับวันนี้' : 'วันนี้เป็นวันหยุดสุดสัปดาห์'}
                            </p>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border">
                     <h3 className="text-xl font-semibold text-gray-700 mb-4">บันทึกโฮมรูมล่าสุด</h3>
                     {latestLog ? (
                        <div className="text-sm">
                            <p className="font-semibold text-gray-500 mb-2">
                                ล่าสุด ({latestLog.day})
                            </p>
                            <div>
                                <h4 className="font-semibold text-gray-800">เรื่องที่พูดคุย:</h4>
                                <p className="text-gray-600 whitespace-pre-wrap">{latestLog.topics || '-'}</p>
                            </div>
                            <div className="mt-2">
                                <h4 className="font-semibold text-gray-800">ปัญหาที่พบ:</h4>
                                <p className="text-gray-600 whitespace-pre-wrap">{latestLog.issues || '-'}</p>
                            </div>
                        </div>
                     ) : (
                         <div className="flex items-center justify-center h-full">
                            <p className="text-center text-gray-500">ยังไม่มีบันทึกโฮมรูมในสัปดาห์นี้</p>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
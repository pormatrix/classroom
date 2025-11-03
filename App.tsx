// Implemented the main App component to manage state and navigation.
import React, { useState, useEffect, useCallback } from 'react';
import { STUDENTS, DAYS_OF_WEEK } from './constants';
import { Student, HealthRecord, GrowthRecord, TeachingLogEntry, DayOfWeek, WeeklyHomeroomLog, AppData } from './types';
import HealthCheck from './components/HealthCheck';
import GrowthTracker from './components/GrowthTracker';
import TeachingLog from './components/Schedule';
import HomeroomLog from './components/HomeroomLog';
import Settings from './components/Settings';
import Dashboard from './components/Dashboard';
import { fetchData, saveData } from './api';

type Tab = 'dashboard' | 'health' | 'growth' | 'teachingLog' | 'log' | 'settings';

const initializeTeachingLog = (): Record<DayOfWeek, TeachingLogEntry[]> => {
    const log: Partial<Record<DayOfWeek, TeachingLogEntry[]>> = {};
    DAYS_OF_WEEK.forEach(({key: day}) => {
        log[day] = Array.from({ length: 8 }, (_, i) => ({
            period: i + 1,
            subject: '',
            teacher: '',
            content: '',
            notes: '',
        }));
    });
    return log as Record<DayOfWeek, TeachingLogEntry[]>;
};

const initializeHomeroomLog = (): WeeklyHomeroomLog => {
    const log: Partial<WeeklyHomeroomLog> = {};
    DAYS_OF_WEEK.forEach(({ key: day }) => {
        log[day] = { topics: '', issues: '' };
    });
    return log as WeeklyHomeroomLog;
};

const SyncStatus: React.FC<{ isDirty: boolean; isSaving: boolean; lastSaved: Date | null; onSave: () => void; error: string | null }> = ({ isDirty, isSaving, lastSaved, onSave, error }) => {
    if (!isDirty && !isSaving && !lastSaved) return null;

    let statusText = `บันทึกข้อมูลล่าสุด: ${lastSaved ? lastSaved.toLocaleTimeString() : 'ยังไม่ได้บันทึก'}`;
    let bgColor = 'bg-green-100';
    let textColor = 'text-green-800';

    if (error) {
        statusText = `เกิดข้อผิดพลาด: ${error}`;
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
    } else if (isSaving) {
        statusText = 'กำลังบันทึกข้อมูล...';
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
    } else if (isDirty) {
        statusText = 'มีข้อมูลที่ยังไม่ได้บันทึก';
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
    }

    return (
        <div className={`no-print fixed bottom-4 right-4 z-50 flex items-center gap-4 p-3 rounded-lg shadow-lg ${bgColor} ${textColor}`}>
            <span>{statusText}</span>
            {isDirty && !isSaving && (
                <button onClick={onSave} className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    บันทึกข้อมูล
                </button>
            )}
        </div>
    );
};


const App: React.FC = () => {
    const [scriptUrl] = useState<string>('https://script.google.com/macros/s/AKfycby9XuEATZFcq5sepd05yxveSMdgnyJfPLasH2ooLjAegaWg98gSPAiVlMpfkRwa3tJH/exec');
    
    // Data states
    const [students, setStudents] = useState<Student[]>(STUDENTS);
    const [healthRecords, setHealthRecords] = useState<Record<number, HealthRecord>>({});
    const [growthRecords, setGrowthRecords] = useState<Record<number, GrowthRecord>>({});
    const [teachingLog, setTeachingLog] = useState<Record<DayOfWeek, TeachingLogEntry[]>>(initializeTeachingLog());
    const [homeroomLog, setHomeroomLog] = useState<WeeklyHomeroomLog>(initializeHomeroomLog());

    // UI/Sync states
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const loadDataFromSheet = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchData(scriptUrl);
            setStudents(data.students.length > 0 ? data.students : STUDENTS);
            setHealthRecords(data.healthRecords || {});
            setGrowthRecords(data.growthRecords || {});
            setTeachingLog(data.teachingLog || initializeTeachingLog());
            setHomeroomLog(data.homeroomLog || initializeHomeroomLog());
            setLastSaved(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'ไม่สามารถโหลดข้อมูลได้');
        } finally {
            setIsLoading(false);
            setIsDirty(false);
        }
    }, [scriptUrl]);

    useEffect(() => {
        loadDataFromSheet();
    }, [loadDataFromSheet]);

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        const appData: AppData = { students, healthRecords, growthRecords, teachingLog, homeroomLog };
        try {
            await saveData(scriptUrl, appData);
            setIsDirty(false);
            setLastSaved(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'ไม่สามารถบันทึกข้อมูลได้');
        } finally {
            setIsSaving(false);
        }
    };
    
    // Wrapped setters to mark state as dirty
    const setStudentsDirty = (value: React.SetStateAction<Student[]>) => { setStudents(value); setIsDirty(true); };
    const setHealthRecordsDirty = (value: React.SetStateAction<Record<number, HealthRecord>>) => { setHealthRecords(value); setIsDirty(true); };
    const setGrowthRecordsDirty = (value: React.SetStateAction<Record<number, GrowthRecord>>) => { setGrowthRecords(value); setIsDirty(true); };
    const setTeachingLogDirty = (value: React.SetStateAction<Record<DayOfWeek, TeachingLogEntry[]>>) => { setTeachingLog(value); setIsDirty(true); };
    const setHomeroomLogDirty = (value: React.SetStateAction<WeeklyHomeroomLog>) => { setHomeroomLog(value); setIsDirty(true); };

    // When a student is deleted from settings, remove their records too.
    useEffect(() => {
        const studentIds = new Set(students.map(s => s.id));
        const cleanRecords = (prev: Record<number, any>) => {
            const next = { ...prev };
            let changed = false;
            Object.keys(next).forEach(id => {
                if (!studentIds.has(Number(id))) {
                    delete next[Number(id)];
                    changed = true;
                }
            });
            return changed ? next : prev;
        };

        setHealthRecords(prev => cleanRecords(prev));
        setGrowthRecords(prev => cleanRecords(prev));
    }, [students]);


    const renderContent = () => {
        if (isLoading) return <div className="text-center p-8">กำลังโหลดข้อมูล...</div>;

        switch (activeTab) {
            case 'dashboard':
                return <Dashboard students={students} healthRecords={healthRecords} growthRecords={growthRecords} homeroomLog={homeroomLog} teachingLog={teachingLog} />;
            case 'health':
                return <HealthCheck students={students} healthRecords={healthRecords} setHealthRecords={setHealthRecordsDirty} />;
            case 'growth':
                return <GrowthTracker students={students} growthRecords={growthRecords} setGrowthRecords={setGrowthRecordsDirty} />;
            case 'teachingLog':
                return <TeachingLog teachingLog={teachingLog} setTeachingLog={setTeachingLogDirty} />;
            case 'log':
                return <HomeroomLog homeroomLog={homeroomLog} setHomeroomLog={setHomeroomLogDirty} />;
            case 'settings':
                return <Settings students={students} setStudents={setStudentsDirty} />;
            default:
                return null;
        }
    };

    const TabButton = ({ tab, label }: { tab: Tab, label: string }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-lg transition-colors ${
                activeTab === tab
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:bg-gray-200'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <header className="bg-white shadow-md no-print">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">สมุดบันทึกครูประจำชั้น</h1>
                    <p className="text-center text-gray-500">เครื่องมือช่วยจัดการข้อมูลนักเรียน</p>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <nav className="mb-6 bg-white p-2 rounded-xl shadow-sm flex flex-wrap justify-center gap-2 no-print">
                    <TabButton tab="dashboard" label="ภาพรวม" />
                    <TabButton tab="health" label="ตรวจสุขภาพ" />
                    <TabButton tab="growth" label="บันทึกการเจริญเติบโต" />
                    <TabButton tab="teachingLog" label="บันทึกการสอน" />
                    <TabButton tab="log" label="บันทึกโฮมรูม" />
                    <TabButton tab="settings" label="ตั้งค่า" />
                </nav>
                <div className="content">
                    {renderContent()}
                </div>
            </main>
            <SyncStatus isDirty={isDirty} isSaving={isSaving} lastSaved={lastSaved} onSave={handleSave} error={error} />
        </div>
    );
};

export default App;
import React, { useState } from 'react';
import type { Student } from '../types';

interface SettingsProps {
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const Settings: React.FC<SettingsProps> = ({ students, setStudents }) => {
    const [newStudentName, setNewStudentName] = useState('');

    const handleNameChange = (id: number, newName: string) => {
        setStudents(currentStudents =>
            currentStudents.map(student =>
                student.id === id ? { ...student, name: newName } : student
            )
        );
    };

    const handleDeleteStudent = (id: number) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบนักเรียนคนนี้? การกระทำนี้จะลบข้อมูลสุขภาพและข้อมูลการเจริญเติบโตของนักเรียนคนนี้ด้วย')) {
            setStudents(currentStudents =>
                currentStudents.filter(student => student.id !== id)
            );
        }
    };

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (newStudentName.trim() === '') return;

        const newStudent: Student = {
            id: (students.length > 0 ? Math.max(...students.map(s => s.id)) : 0) + 1,
            name: newStudentName.trim(),
        };

        setStudents(currentStudents => [...currentStudents, newStudent]);
        setNewStudentName('');
    };
    
    return (
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">ตั้งค่า</h2>
                <p className="text-gray-500">จัดการข้อมูลนักเรียน</p>
            </div>

            <div className="max-w-2xl mx-auto">
                {/* Student Management */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">จัดการรายชื่อนักเรียน</h3>
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                         <h3 className="text-lg font-semibold text-gray-700 mb-3">เพิ่มนักเรียนใหม่</h3>
                         <form onSubmit={handleAddStudent} className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={newStudentName}
                                onChange={(e) => setNewStudentName(e.target.value)}
                                placeholder="ชื่อ - สกุล ของนักเรียนใหม่"
                                className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                aria-label="ชื่อนักเรียนใหม่"
                            />
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                เพิ่มนักเรียน
                            </button>
                        </form>
                    </div>
                   
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">รายชื่อนักเรียนปัจจุบัน ({students.length} คน)</h3>
                        <div className="space-y-3">
                            {students.map((student, index) => (
                                <div key={student.id} className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm">
                                    <span className="font-bold text-gray-500 w-8 text-center">{index + 1}.</span>
                                    <input
                                        type="text"
                                        value={student.name}
                                        onChange={(e) => handleNameChange(student.id, e.target.value)}
                                        className="flex-grow p-1.5 border border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        aria-label={`แก้ไขชื่อของ ${student.name}`}
                                    />
                                    <button
                                        onClick={() => handleDeleteStudent(student.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        aria-label={`ลบ ${student.name}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
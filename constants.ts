
import { Student } from './types';

export const STUDENTS: Student[] = [
  { id: 1, name: 'กมลชนก จันทร์เพ็ญ' },
  { id: 2, name: 'จิรภัทร แสงดาว' },
  { id: 3, name: 'ณัฐวุฒิ ศรีสุวรรณ' },
  { id: 4, name: 'ธนพร วงศ์ใหญ่' },
  { id: 5, name: 'ปภาวรินท์ ชัยมงคล' },
  { id: 6, name: 'พรทิพย์ สุขสบาย' },
  { id: 7, name: 'ภัทรพล มีโชค' },
  { id: 8, name: 'มนัสวี ดีเสมอ' },
  { id: 9, name: 'รุ่งอรุณ แจ่มใส' },
  { id: 10, name: 'วรัญญา ใจงาม' },
  { id: 11, name: 'ศิริพร บุญมา' },
  { id: 12, name: 'สุพรรษา โพธิ์ศรี' },
  { id: 13, name: 'อภิชาติ ทองคำ' },
  { id: 14, name: 'อรัญญา เพชรแท้' },
  { id: 15, name: 'กิตติศักดิ์ มั่นคง' },
  { id: 16, name: 'ขวัญฤทัย งามตา' },
  { id: 17, name: 'จันทิมา ศรีเมือง' },
  { id: 18, name: 'ชลธิชา ไชยโย' },
  { id: 19, name: 'ณิชกานต์ จินดา' },
  { id: 20, name: 'ดวงกมล พรหมคุณ' },
  { id: 21, name: 'ทิพย์สุดา มณีรัตน์' },
  { id: 22, name: 'นฤมล สิงห์โต' },
  { id: 23, name: 'บุญฤทธิ์ แก้วใส' },
  { id: 24, name: 'ประภาพร จิตดี' },
  { id: 25, name: 'ปิยธิดา นามวงศ์' },
  { id: 26, name: 'พงศกร อินทร์' },
];

export const HEALTH_CRITERIA_LABELS: { key: 'clothing' | 'nails' | 'hair' | 'skin' | 'teeth'; label: string }[] = [
  { key: 'clothing', label: 'เสื้อผ้า' },
  { key: 'nails', label: 'เล็บ' },
  { key: 'hair', label: 'ผม' },
  { key: 'skin', label: 'ผิวหนัง' },
  { key: 'teeth', label: 'ฟัน' },
];

export const DAYS_OF_WEEK: { key: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'; label: string }[] = [
    { key: 'monday', label: 'วันจันทร์' },
    { key: 'tuesday', label: 'วันอังคาร' },
    { key: 'wednesday', label: 'วันพุธ' },
    { key: 'thursday', label: 'วันพฤหัสบดี' },
    { key: 'friday', label: 'วันศุกร์' },
];

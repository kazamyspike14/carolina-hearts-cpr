import { useState, useMemo } from "react";

const CLASSES_DATA = [
  { id: 1, title: "CPR/AED & First Aid", type: "Blended Learning", date: "2025-05-15", time: "8:30 AM", location: "Soul Wellness, S. Main St., Mooresville NC", spots: 8, price: 85, certLength: 2 },
  { id: 2, title: "CPR/AED & First Aid", type: "Blended Learning", date: "2025-06-07", time: "9:00 AM", location: "Soul Wellness, S. Main St., Mooresville NC", spots: 8, price: 85, certLength: 2 },
];

const INITIAL_STUDENTS = [
  { id: 1, name: "Jennifer Harris", email: "jennifer@email.com", phone: "704-555-0192", classId: 1, classDate: "2025-05-15", certExpiry: "2027-05-15", contacted: false, notes: "", paid: true },
  { id: 2, name: "Marcus Webb", email: "marcus@email.com", phone: "980-555-0384", classId: 1, classDate: "2025-05-15", certExpiry: "2025-11-15", contacted: false, notes: "", paid: true },
  { id: 3, name: "Alicia Tran", email: "alicia@email.com", phone: "704-555-0571", classId: 2, classDate: "2025-06-07", certExpiry: "2025-08-07", contacted: true, notes: "Left voicemail 7/1", paid: true },
];

function addMonths(dateStr, months) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}
function daysUntil(dateStr) {
  return Math.round((new Date(dateStr) - new Date()) / 86400000);
}
function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m)-1]} ${parseInt(d)}, ${y}`;
}
function formatDay(dateStr) {
  return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date(dateStr).getDay()];
}

function Badge({ expiry }) {
  const days = daysUntil(expiry);
  const start = daysUntil(addMonths(expiry, -6));
  const end = daysUntil(addMonths(expiry, -1));
  if (days < 0) return <span style={{...S.badge, background:"#fee2e2", color:"#dc2626"}}>Expired</span>;
  if (start <= 0 && end >= 0) return <span style={{...S.badge, background:"#fef9c3", color:"#854d0e"}}>📬 Reach Out</span>;
  if (days <= 30) return <span style={{...S.badge, background:"#ffedd5", color:"#c2410c"}}>Expiring Soon</span>;
  return <span style={{...S.badge, background:"#dcfce7", color:"#16a34a"}}>Active</span>;
}

function RegistrationForm({ classes, students, onEnroll }) {
  const [step, setStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [checks, setChecks] = useState({ online: false, waiver: false });
  const [errors, setErrors] = useState({});

  const spotsLeft = (cls) => cls.spots - students.filter(s => s.classId === cls.id).length;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    onEnroll({ ...form, classId: selectedClass.id, classDate: selectedClass.date, certExpiry: add​​​​​​​​​​​​​​​​

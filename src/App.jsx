import { useState, useMemo } from "react";

const CLASSES_DATA = [
  { id: 1, title: "CPR/AED & First Aid", type: "Blended Learning", date: "2026-05-15", time: "9:00-11:15 AM", location: "500 S Main St, Suite 113, Classroom 1, Mooresville NC 28115", spots: 12, price: 90, certLength: 2 },
  { id: 2, title: "CPR/AED Only", type: "Blended Learning", date: "2026-05-15", time: "9:00-11:00 AM", location: "500 S Main St, Suite 113, Classroom 1, Mooresville NC 28115", spots: 12, price: 80, certLength: 2 },
  { id: 3, title: "BLS", type: "Blended Learning", date: "2026-05-15", time: "11:30 AM-2:00 PM", location: "500 S Main St, Suite 113, Classroom 1, Mooresville NC 28115", spots: 9, price: 78, certLength: 2 },
  { id: 4, title: "CPR/AED & First Aid", type: "Blended Learning", date: "2026-06-14", time: "9:00-11:15 AM", location: "500 S Main St, Suite 113, Classroom 1, Mooresville NC 28115", spots: 12, price: 90, certLength: 2 },
  { id: 5, title: "CPR/AED Only", type: "Blended Learning", date: "2026-06-14", time: "9:00-11:00 AM", location: "500 S Main St, Suite 113, Classroom 1, Mooresville NC 28115", spots: 12, price: 80, certLength: 2 },
  { id: 6, title: "BLS", type: "Blended Learning", date: "2026-06-14", time: "11:30 AM-2:00 PM", location: "500 S Main St, Suite 113, Classroom 1, Mooresville NC 28115", spots: 9, price: 78, certLength: 2 },
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
    onEnroll({ ...form, classId: selectedClass.id, classDate: selectedClass.date, certExpiry: addMonths(selectedClass.date, selectedClass.certLength * 12) });
    setStep(4);
  };

  const reset = () => { setStep(1); setSelectedClass(null); setForm({ name:"", email:"", phone:"" }); setChecks({ online:false, waiver:false }); setErrors({}); };

  return (
    <div style={S.regWrap}>
      <div style={S.regHeader}>
        <div style={{fontSize:40, color:"#e63946"}}>♥</div>
        <div>
          <div style={{fontFamily:"Georgia,serif", fontSize:22, fontWeight:700, color:"#fff"}}>Carolina Hearts CPR</div>
          <div style={{fontSize:12, color:"#94a3b8", marginTop:3}}>Class Registration · Mooresville, NC · No Charlotte drive required!</div>
        </div>
      </div>

      {step < 4 && (
        <div style={S.progress}>
          {["Select Date","Your Info","Confirm & Pay"].map((label, i) => (
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,flex:1}}>
              <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700, background:step>i+1?"#16a34a":step===i+1?"#e63946":"#e2e8f0", color:step>=i+1?"#fff":"#9ca3af"}}>
                {step > i+1 ? "✓" : i+1}
              </div>
              <div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5, color:step===i+1?"#1a1a2e":"#9ca3af"}}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {step === 1 && (
        <div style={S.regBody}>
          <h2 style={S.stepTitle}>Choose Your Class Date</h2>
          <div style={{display:"flex",gap:10,background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:10,padding:14,marginBottom:24,fontSize:13,lineHeight:1.6,color:"#78350f"}}>
            <span style={{fontSize:20,flexShrink:0}}>📋</span>
            <div><strong>Blended Learning Format</strong> — You must complete the online Red Cross portion <strong>before</strong> attending the in-person skills session. You'll receive the link by email after registering.</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:24}}>
            {classes.map(cls => {
              const left = spotsLeft(cls);
              const full = left === 0;
              const sel = selectedClass?.id === cls.id;
              return (
                <div key={cls.id} onClick={() => !full && setSelectedClass(cls)}
                  style={{border:`2px solid ${sel?"#e63946":"#e2e8f0"}`,borderRadius:12,padding:18,cursor:full?"not-allowed":"pointer",background:sel?"#fff5f5":full?"#f9fafb":"#fafafa",opacity:full?0.5:1,transition:"all 0.15s"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{formatDay(cls.date)}</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#1a1a2e",marginBottom:4}}>{formatDate(cls.date)}</div>
                  <div style={{fontSize:14,color:"#4b5563",marginBottom:6}}>{cls.time}</div>
                  <div style={{fontSize:12,color:"#6b7280",marginBottom:8}}>📍 Soul Wellness, Mooresville</div>
                  <div style={{fontSize:12,fontWeight:700,marginBottom:4,color:full?"#dc2626":left<=2?"#d97706":"#16a34a"}}>{full?"CLASS FULL":`${left} spot${left!==1?"s":""} remaining`}</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#1a1a2e"}}>${cls.price} per student</div>
                  {sel && <div style={{marginTop:10,fontSize:12,fontWeight:700,color:"#e63946"}}>✓ Selected</div>}
                </div>
              );
            })}
          </div>
          <button style={{...S.btnPrimary, opacity:selectedClass?1:0.4, width:"100%", padding:"13px"}} onClick={() => selectedClass && setStep(2)}>Continue →</button>
        </div>
      )}

      {step === 2 && (
        <div style={S.regBody}>
          <div style={{fontSize:13,color:"#6b7280",cursor:"pointer",marginBottom:16}} onClick={() => setStep(1)}>← Back</div>
          <h2 style={S.stepTitle}>Your Information</h2>
          <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#166534",marginBottom:20}}>
            📅 {formatDate(selectedClass.date)} at {selectedClass.time} · {selectedClass.title}
          </div>
          {[{key:"name",label:"Full Name",ph:"Jane Smith",type:"text"},{key:"email",label:"Email Address",ph:"jane@example.com",type:"email"},{key:"phone",label:"Phone Number",ph:"704-555-0000",type:"tel"}].map(f => (
            <div key={f.key} style={{marginBottom:4}}>
              <label style={{display:"block",fontSize:13,fontWeight:600,color:"#374151",marginBottom:6}}>{f.label} <span style={{color:"#e63946"}}>*</span></label>
              <input style={{...S.input,...(errors[f.key]?{borderColor:"#e63946"}:{})}} type={f.type} placeholder={f.ph} value={form[f.key]} onChange={e=>{setForm(p=>({...p,[f.key]:e.target.value}));setErrors(p=>({...p,[f.key]:null}));}} />
              {errors[f.key] && <div style={{fontSize:12,color:"#dc2626",marginBottom:8,marginTop:-4}}>{errors[f.key]}</div>}
            </div>
          ))}
          <button style={{...S.btnPrimary,width:"100%",padding:"13px",marginTop:8}} onClick={()=>{if(validate())setStep(3);}}>Continue →</button>
        </div>
      )}

      {step === 3 && (
        <div style={S.regBody}>
          <div style={{fontSize:13,color:"#6b7280",cursor:"pointer",marginBottom:16}} onClick={()=>setStep(2)}>← Back</div>
          <h2 style={S.stepTitle}>Confirm & Pay</h2>
          <div style={{border:"1px solid #e2e8f0",borderRadius:10,overflow:"hidden",marginBottom:20}}>
            {[["Class",selectedClass.title],["Date",`${formatDate(selectedClass.date)} · ${selectedClass.time}`],["Location","Soul Wellness, Mooresville NC"],["Student",form.name]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 16px",borderBottom:"1px solid #f1f5f9",fontSize:13,color:"#4b5563"}}><span>{k}</span><span>{v}</span></div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"12px 16px",fontSize:15,fontWeight:700,color:"#1a1a2e",background:"#f8fafc"}}><span>Total Due</span><span>${selectedClass.price}.00</span></div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:14,margin:"0 0 20px"}}>
            {[{key:"online",text:<span>I understand I must complete the <strong>online Red Cross training</strong> before attending the in-person class. I will receive the link via email after registering.</span>},{key:"waiver",text:<span>I agree to the <strong>liability waiver</strong> and understand that CPR/First Aid training does not guarantee successful outcomes in emergency situations.</span>}].map(item=>(
              <label key={item.key} style={{display:"flex",gap:12,alignItems:"flex-start",fontSize:13,lineHeight:1.6,color:"#374151",cursor:"pointer"}}>
                <input type="checkbox" checked={checks[item.key]} onChange={e=>setChecks(c=>({...c,[item.key]:e.target.checked}))} style={{marginTop:3,width:16,height:16,accentColor:"#e63946",flexShrink:0}} />
                <span>{item.text}</span>
              </label>
            ))}
          </div>

          <div style={{border:"2px solid #e2e8f0",borderRadius:12,overflow:"hidden",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"#f8fafc",borderBottom:"1px solid #e2e8f0"}}>
              <span style={{fontSize:16}}>🔒</span>
              <span style={{fontWeight:700,fontSize:14,color:"#1a1a2e",flex:1}}>Secure Payment</span>
              <span style={{fontSize:11,background:"#1a1a2e",color:"#fff",borderRadius:4,padding:"2px 8px",fontWeight:600}}>Authorize.net</span>
            </div>
            <div style={{padding:24,textAlign:"center"}}>
              <div style={{fontSize:36,marginBottom:10}}>💳</div>
              <div style={{fontWeight:600,fontSize:14,color:"#4b5563",marginBottom:6}}>Authorize.net payment form will appear here</div>
              <div style={{fontSize:12,color:"#9ca3af",marginBottom:18}}>Connect your Authorize.net API credentials to enable live credit card processing</div>
              <div style={{display:"flex",flexDirection:"column",gap:8,textAlign:"left"}}>
                {["Card Number","Expiration Date","CVV / Security Code","Cardholder Name","Billing Zip Code"].map(f=>(
                  <div key={f} style={{border:"1px dashed #d1d5db",borderRadius:6,padding:"10px 12px",fontSize:12,color:"#d1d5db",background:"#f9fafb"}}>{f}</div>
                ))}
              </div>
            </div>
          </div>

          <button style={{...S.btnPrimary,width:"100%",padding:"14px",fontSize:15,opacity:checks.online&&checks.waiver?1:0.4}} onClick={()=>{if(checks.online&&checks.waiver)handleSubmit();}}>
            Complete Registration — ${selectedClass.price}.00
          </button>
          <div style={{textAlign:"center",fontSize:12,color:"#9ca3af",marginTop:10}}>🔒 Your information is secure and will never be shared.</div>
        </div>
      )}

      {step === 4 && (
        <div style={{...S.regBody,textAlign:"center",padding:"48px 32px"}}>
          <div style={{fontSize:56,marginBottom:12}}>🎉</div>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:700,color:"#1a1a2e",marginBottom:12}}>You're Registered!</h2>
          <p style={{fontSize:15,color:"#4b5563",lineHeight:1.7,marginBottom:28}}>
            Thank you, <strong>{form.name}</strong>! You're confirmed for the <strong>{formatDate(selectedClass?.date)}</strong> class at Soul Wellness in Mooresville.
          </p>
          <div style={{background:"#f8fafc",borderRadius:12,padding:20,textAlign:"left",marginBottom:20}}>
            <div style={{fontWeight:700,fontSize:13,textTransform:"uppercase",letterSpacing:0.5,color:"#6b7280",marginBottom:14}}>What Happens Next</div>
            {[
              {icon:"📧",title:"Check your email",detail:`A confirmation will be sent to ${form.email}`},
              {icon:"💻",title:"Complete online training",detail:"Click the Red Cross link in your confirmation email to finish the online portion before class day"},
              {icon:"📍",title:"Arrive ready to practice skills",detail:`${formatDate(selectedClass?.date)} · ${selectedClass?.time} · Soul Wellness, Mooresville`},
              {icon:"🏅",title:"Earn your 2-year certification",detail:"American Red Cross CPR/AED & First Aid card — valid for 2 years"},
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:14}}>
                <div style={{fontSize:22,flexShrink:0}}>{item.icon}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{item.title}</div>
                  <div style={{fontSize:13,color:"#6b7280",lineHeight:1.5}}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <button style={{background:"#f1f5f9",color:"#1a1a2e",border:"none",borderRadius:8,padding:"10px 20px",fontFamily:"inherit",fontSize:14,fontWeight:600,cursor:"pointer"}} onClick={reset}>Register Another Student</button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("dashboard");
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [classes] = useState(CLASSES_DATA);
  const [enrollModal, setEnrollModal] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name:"", email:"", phone:"", notes:"" });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const spotsLeft = (cls) => cls.spots - students.filter(s => s.classId === cls.id).length;

  const handleEnroll = (data) => {
    setStudents(prev => [...prev, { id: Date.now(), ...data, contacted: false, notes: "", paid: false }]);
    showToast(`${data.name} registered successfully!`);
  };

  const handleAdminEnroll = (cls) => {
    if (!form.name || !form.email) return;
    setStudents(prev => [...prev, { id: Date.now(), name:form.name, email:form.email, phone:form.phone, classId:cls.id, classDate:cls.date, certExpiry:addMonths(cls.date, cls.certLength*12), contacted:false, notes:form.notes, paid:false }]);
    setForm({ name:"", email:"", phone:"", notes:"" });
    setEnrollModal(null);
    showToast(`${form.name} added to ${formatDate(cls.date)} class!`);
  };

  const toggleContacted = (id) => setStudents(prev => prev.map(s => s.id===id ? {...s,contacted:!s.contacted} : s));
  const updateNotes = (id, notes) => setStudents(prev => prev.map(s => s.id===id ? {...s,notes} : s));

  const outreachCount = students.filter(s => {
    const st = daysUntil(addMonths(s.certExpiry,-6)), en = daysUntil(addMonths(s.certExpiry,-1));
    return st<=0 && en>=0 && !s.contacted;
  }).length;

  const filteredStudents = useMemo(() => {
    let list = [...students];
    if (searchText) list = list.filter(s => s.name.toLowerCase().includes(searchText.toLowerCase()) || s.email.toLowerCase().includes(searchText.toLowerCase()));
    if (filterStatus==="outreach") list = list.filter(s => { const st=daysUntil(addMonths(s.certExpiry,-6)),en=daysUntil(addMonths(s.certExpiry,-1)); return st<=0&&en>=0; });
    if (filterStatus==="expired") list = list.filter(s => daysUntil(s.certExpiry)<0);
    if (filterStatus==="notContacted") list = list.filter(s => { const st=daysUntil(addMonths(s.certExpiry,-6)),en=daysUntil(addMonths(s.certExpiry,-1)); return st<=0&&en>=0&&!s.contacted; });
    return list;
  }, [students, filterStatus, searchText]);

  return (
    <div style={S.root}>
      <aside style={S.sidebar}>
        <div style={S.logo}>
          <div style={{fontSize:28,color:"#e63946"}}>♥</div>
          <div>
            <div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:14,letterSpacing:0.5}}>Carolina Hearts</div>
            <div style={{fontSize:10,color:"#94a3b8",letterSpacing:1,textTransform:"uppercase"}}>CPR Training</div>
          </div>
        </div>
        <nav style={{padding:"16px 12px",flex:1,display:"flex",flexDirection:"column",gap:4}}>
          {[{id:"dashboard",icon:"◈",label:"Dashboard"},{id:"register",icon:"✦",label:"Registration Form"},{id:"classes",icon:"◷",label:"Classes"},{id:"students",icon:"◎",label:"Students"},{id:"outreach",icon:"◉",label:"Outreach",badge:outreachCount}].map(item=>(
            <button key={item.id} onClick={()=>setView(item.id)} style={{...S.navItem,...(view===item.id?S.navItemActive:{})}}>
              <span style={{fontSize:16,width:20}}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge>0 && <span style={S.navBadge}>{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={{padding:"16px 20px",borderTop:"1px solid rgba(255,255,255,0.1)"}}>
          <div style={{fontSize:10,color:"#64748b"}}>American Red Cross Certified</div>
        </div>
      </aside>

      <main style={S.main}>
        {toast && <div style={S.toast}>{toast}</div>}

        {view==="register" && (
          <div style={{padding:24}}>
            <div style={{marginBottom:16,padding:"10px 16px",background:"#fef3c7",borderRadius:8,fontSize:13,color:"#92400e",border:"1px solid #fcd34d"}}>
              👁 <strong>Preview Mode:</strong> This is exactly how students see your registration form. Submissions automatically flow into your Students list and dashboard.
            </div>
            <RegistrationForm classes={classes} students={students} onEnroll={handleEnroll} />
          </div>
        )}

        {view==="dashboard" && (
          <div style={S.page}>
            <h1 style={S.pageTitle}>Dashboard</h1>
            <div style={S.statsGrid}>
              {[{label:"Total Students",value:students.length,icon:"◎",color:"#e63946"},{label:"Upcoming Classes",value:classes.length,icon:"◷",color:"#457b9d"},{label:"Need Outreach",value:outreachCount,icon:"◉",color:"#d97706"},{label:"Expired Certs",value:students.filter(s=>daysUntil(s.certExpiry)<0).length,icon:"⊗",color:"#6b7280"}].map(stat=>(
                <div key={stat.label} style={S.statCard}>
                  <div style={{fontSize:24,marginBottom:8,color:stat.color}}>{stat.icon}</div>
                  <div style={{fontSize:36,fontWeight:700,fontFamily:"Georgia,serif",color:"#1a1a2e"}}>{stat.value}</div>
                  <div style={{fontSize:12,color:"#6b7280",marginTop:4,textTransform:"uppercase",letterSpacing:0.5}}>{stat.label}</div>
                </div>
              ))}
            </div>
            <div style={S.twoCol}>
              <div style={S.card}>
                <h2 style={S.cardTitle}>Upcoming Classes</h2>
                {classes.map(cls=>(
                  <div key={cls.id} style={S.classRow}>
                    <div>
                      <div style={{fontWeight:600,fontSize:14}}>{formatDate(cls.date)} · {cls.time}</div>
                      <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{cls.title} · {cls.type}</div>
                      <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{cls.location}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:12,color:"#16a34a",fontWeight:600,marginBottom:6}}>{spotsLeft(cls)} spots left</div>
                      <button style={S.btnSmall} onClick={()=>setView("register")}>Share Form</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={S.card}>
                <h2 style={S.cardTitle}>🔔 Outreach Needed</h2>
                {students.filter(s=>{const st=daysUntil(addMonths(s.certExpiry,-6)),en=daysUntil(addMonths(s.certExpiry,-1));return st<=0&&en>=0&&!s.contacted;}).length===0
                  ? <div style={{fontSize:13,color:"#9ca3af",padding:"8px 0"}}>No pending outreach — you're all caught up!</div>
                  : students.filter(s=>{const st=daysUntil(addMonths(s.certExpiry,-6)),en=daysUntil(addMonths(s.certExpiry,-1));return st<=0&&en>=0&&!s.contacted;}).map(s=>(
                    <div key={s.id} style={S.outreachRow}>
                      <div>
                        <div style={{fontWeight:600,fontSize:14}}>{s.name}</div>
                        <div style={{fontSize:12,color:"#6b7280"}}>Expires {formatDate(s.certExpiry)} · {s.email}</div>
                      </div>
                      <button style={S.btnContacted} onClick={()=>toggleContacted(s.id)}>Mark Contacted</button>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {view==="classes" && (
          <div style={S.page}>
            <h1 style={S.pageTitle}>Classes</h1>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:20}}>
              {classes.map(cls=>{
                const left=spotsLeft(cls), enrolled=students.filter(s=>s.classId===cls.id);
                return (
                  <div key={cls.id} style={S.classCard}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                      <span style={{fontSize:11,background:"#e0e7ff",color:"#4338ca",borderRadius:20,padding:"2px 10px",fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{cls.type}</span>
                      <span style={{fontSize:12,borderRadius:20,padding:"2px 10px",fontWeight:600,background:left===0?"#fee2e2":"#dcfce7",color:left===0?"#dc2626":"#16a34a"}}>{left===0?"Full":`${left} of ${cls.spots} open`}</span>
                    </div>
                    <h2 style={{fontFamily:"Georgia,serif",fontSize:20,marginBottom:12}}>{cls.title}</h2>
                    {[`📅 ${formatDate(cls.date)} at ${cls.time}`,`📍 ${cls.location}`,`💰 $${cls.price} per student`,`🏅 ${cls.certLength}-year certification`].map(d=>(
                      <div key={d} style={{fontSize:13,color:"#4b5563",marginBottom:6}}>{d}</div>
                    ))}
                    <div style={{marginTop:16,borderTop:"1px solid #f1f5f9",paddingTop:12}}>
                      <div style={{fontSize:12,fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Enrolled ({enrolled.length})</div>
                      {enrolled.length===0 && <div style={{fontSize:13,color:"#9ca3af"}}>No students yet</div>}
                      {enrolled.map(s=>(
                        <div key={s.id} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"4px 0"}}>
                          <span>{s.name}</span><span style={{color:"#6b7280",fontSize:12}}>{s.email}</span>
                        </div>
                      ))}
                    </div>
                    {left>0 && (enrollModal?.id===cls.id ? (
                      <div style={{marginTop:16,borderTop:"1px solid #f1f5f9",paddingTop:16}}>
                        <div style={{fontWeight:600,fontSize:14,marginBottom:10}}>Add Student Manually</div>
                        {["name","email","phone"].map(f=>(
                          <input key={f} style={S.input} placeholder={f.charAt(0).toUpperCase()+f.slice(1)+(f!=="phone"?" *":"")} value={form[f]} onChange={e=>setForm(p=>({...p,[f]:e.target.value}))} />
                        ))}
                        <textarea style={{...S.input,height:50,resize:"none"}} placeholder="Notes (optional)" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} />
                        <div style={{display:"flex",gap:8,marginTop:4}}>
                          <button style={S.btnCancel} onClick={()=>setEnrollModal(null)}>Cancel</button>
                          <button style={S.btnPrimary} onClick={()=>handleAdminEnroll(cls)}>Add Student</button>
                        </div>
                      </div>
                    ) : (
                      <button style={{...S.btnPrimary,marginTop:16}} onClick={()=>setEnrollModal(cls)}>+ Add Manually</button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view==="students" && (
          <div style={S.page}>
            <h1 style={S.pageTitle}>All Students</h1>
            <div style={{display:"flex",gap:12,marginBottom:16}}>
              <input style={{flex:1,border:"1px solid #e2e8f0",borderRadius:8,padding:"8px 14px",fontSize:14,fontFamily:"inherit"}} placeholder="Search by name or email…" value={searchText} onChange={e=>setSearchText(e.target.value)} />
              <select style={{border:"1px solid #e2e8f0",borderRadius:8,padding:"8px 12px",fontSize:14,fontFamily:"inherit",background:"#fff"}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                <option value="all">All Students</option>
                <option value="outreach">In Outreach Window</option>
                <option value="notContacted">Not Yet Contacted</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div style={{background:"#fff",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <div style={{display:"grid",gridTemplateColumns:"1.5fr 2fr 1.2fr 1.2fr 1.3fr 1.5fr",padding:"10px 16px",background:"#f8fafc",fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:0.5}}>
                <span>Name</span><span>Contact</span><span>Class Date</span><span>Cert Expires</span><span>Status</span><span>Notes</span>
              </div>
              {filteredStudents.length===0 && <div style={{fontSize:13,color:"#9ca3af",padding:16}}>No students match your filter.</div>}
              {filteredStudents.map(s=>(
                <div key={s.id} style={{display:"grid",gridTemplateColumns:"1.5fr 2fr 1.2fr 1.2fr 1.3fr 1.5fr",padding:"12px 16px",borderTop:"1px solid #f1f5f9",fontSize:13,alignItems:"center"}}>
                  <span style={{fontWeight:600}}>{s.name}</span>
                  <span><div>{s.email}</div><div style={{color:"#6b7280",fontSize:12}}>{s.phone}</div></span>
                  <span>{formatDate(s.classDate)}</span>
                  <span>{formatDate(s.certExpiry)}</span>
                  <span><Badge expiry={s.certExpiry} /></span>
                  <span><input style={{border:"1px solid #e2e8f0",borderRadius:6,padding:"4px 8px",fontSize:12,fontFamily:"inherit",width:"100%"}} value={s.notes} placeholder="Add note…" onChange={e=>updateNotes(s.id,e.target.value)} /></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {view==="outreach" && (
          <div style={S.page}>
            <h1 style={S.pageTitle}>Outreach Center</h1>
            <p style={{color:"#4b5563",marginBottom:20,lineHeight:1.6}}>Students whose certification expires within 1–6 months. Reach out now to rebook them before they lapse!</p>
            {students.filter(s=>{const st=daysUntil(addMonths(s.certExpiry,-6)),en=daysUntil(addMonths(s.certExpiry,-1));return st<=0&&en>=0;}).length===0
              ? <div style={{...S.card,textAlign:"center",padding:40}}><div style={{fontSize:48}}>🎉</div><div style={{fontFamily:"Georgia,serif",fontSize:20,marginTop:12}}>All caught up!</div></div>
              : students.filter(s=>{const st=daysUntil(addMonths(s.certExpiry,-6)),en=daysUntil(addMonths(s.certExpiry,-1));return st<=0&&en>=0;}).map(s=>(
                <div key={s.id} style={{...S.outreachCard,opacity:s.contacted?0.6:1}}>
                  <div style={{flex:1,minWidth:200}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,marginBottom:8}}>{s.name}</div>
                    <div style={{fontSize:13,color:"#4b5563",marginBottom:4}}>✉️ {s.email}</div>
                    {s.phone&&<div style={{fontSize:13,color:"#4b5563",marginBottom:4}}>📞 {s.phone}</div>}
                    <div style={{fontSize:13,color:"#4b5563",marginBottom:4}}>🏅 Expires {formatDate(s.certExpiry)} ({daysUntil(s.certExpiry)} days)</div>
                  </div>
                  <div style={{flex:2,minWidth:280}}>
                    <div style={{background:"#f0fdf4",borderRadius:8,padding:"12px 14px",border:"1px solid #bbf7d0"}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#16a34a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>Suggested Message</div>
                      <div style={{fontSize:13,color:"#166534",lineHeight:1.5,fontStyle:"italic"}}>
                        "Hi {s.name.split(" ")[0]}! Your CPR/First Aid certification expires {formatDate(s.certExpiry)}. Stay certified locally — no Charlotte drive required! Our next class is {formatDate(classes[0].date)} at {classes[0].time} in Mooresville."
                      </div>
                    </div>
                    <button style={{...s.contacted?S.btnContacted:S.btnPrimary,marginTop:12}} onClick={()=>{toggleContacted(s.id);showToast(s.contacted?`${s.name} unmarked`:`${s.name} marked as contacted!`);}}>
                      {s.contacted?"✓ Contacted":"Mark Contacted"}
                    </button>
                    {s.notes&&<div style={{fontSize:12,color:"#6b7280",marginTop:8,fontStyle:"italic"}}>📝 {s.notes}</div>}
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </main>
    </div>
  );
}

const S = {
  root:{display:"flex",minHeight:"100vh",fontFamily:"'DM Sans','Segoe UI',sans-serif",background:"#f8f4f0",color:"#1a1a1a"},
  sidebar:{width:220,background:"#1a1a2e",color:"#fff",display:"flex",flexDirection:"column",padding:"24px 0",flexShrink:0},
  logo:{display:"flex",alignItems:"center",gap:12,padding:"0 20px 24px",borderBottom:"1px solid rgba(255,255,255,0.1)"},
  navItem:{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:14,fontFamily:"inherit",width:"100%",textAlign:"left"},
  navItemActive:{background:"rgba(230,57,70,0.15)",color:"#fff"},
  navBadge:{marginLeft:"auto",background:"#e63946",borderRadius:10,fontSize:11,padding:"2px 7px",color:"#fff",fontWeight:700},
  main:{flex:1,overflow:"auto",position:"relative"},
  toast:{position:"fixed",top:20,right:20,borderRadius:8,padding:"12px 20px",color:"#fff",fontWeight:600,fontSize:14,zIndex:999,background:"#22c55e",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"},
  page:{padding:32,maxWidth:1100,margin:"0 auto"},
  pageTitle:{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,marginBottom:24,color:"#1a1a2e"},
  statsGrid:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28},
  statCard:{background:"#fff",borderRadius:12,padding:"20px 16px",textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"},
  twoCol:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20},
  card:{background:"#fff",borderRadius:12,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"},
  cardTitle:{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,marginBottom:16,color:"#1a1a2e"},
  classRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #f1f5f9"},
  classCard:{background:"#fff",borderRadius:12,padding:24,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"},
  outreachRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #f1f5f9"},
  outreachCard:{background:"#fff",borderRadius:12,padding:20,marginBottom:12,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",display:"flex",gap:24,flexWrap:"wrap"},
  badge:{fontSize:11,borderRadius:20,padding:"2px 10px",fontWeight:600},
  btnPrimary:{background:"#e63946",color:"#fff",border:"none",borderRadius:8,padding:"9px 18px",fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer"},
  btnSmall:{background:"#e63946",color:"#fff",border:"none",borderRadius:6,padding:"6px 12px",fontFamily:"inherit",fontSize:12,fontWeight:600,cursor:"pointer"},
  btnCancel:{background:"#f1f5f9",color:"#475569",border:"none",borderRadius:8,padding:"9px 18px",fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer"},
  btnContacted:{background:"#dcfce7",color:"#16a34a",border:"none",borderRadius:8,padding:"9px 18px",fontFamily:"inherit",fontSize:13,fontWeight:600,cursor:"pointer"},
  input:{width:"100%",border:"1px solid #e2e8f0",borderRadius:8,padding:"10px 12px",fontSize:14,fontFamily:"inherit",marginBottom:10,boxSizing:"border-box",outline:"none"},
  regWrap:{maxWidth:580,margin:"0 auto",background:"#fff",borderRadius:16,boxShadow:"0 4px 24px rgba(0,0,0,0.08)",overflow:"hidden"},
  regHeader:{background:"#1a1a2e",padding:"24px",display:"flex",alignItems:"center",gap:16},
  progress:{display:"flex",justifyContent:"center",padding:"20px 24px",borderBottom:"1px solid #f1f5f9",background:"#fafafa"},
  regBody:{padding:"28px 32px"},
  stepTitle:{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,marginBottom:20,color:"#1a1a2e"},
};


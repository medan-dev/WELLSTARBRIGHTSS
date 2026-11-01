const streamNames = {
  "S.1": ["S.1A", "S.1B"],
  "S.2": ["S.2A", "S.2B"],
  "S.3": ["S.3 East", "S.3 West"],
  "S.4": ["S.4 East", "S.4 West"],
  "S.5": ["S.5 Sci", "S.5 Arts"],
  "S.6": ["S.6 Sci", "S.6 Arts"]
};

// Fixed deterministic list — names are hardcoded so emails never change between seed runs
const fixedStudentNames: [string, string][] = [
  ["Kato", "Joseph"], ["Nansubuga", "Mary"], ["Mukasa", "Peter"], ["Babirye", "Sarah"],
  ["Okello", "Denis"], ["Namagembe", "Grace"], ["Kintu", "Moses"], ["Nalubega", "Prossy"],
  ["Opolot", "Emmanuel"], ["Akello", "Joan"], ["Walusimbi", "David"], ["Nakato", "Betty"],
  ["Sserwadda", "Ivan"], ["Kemigisha", "Patrick"], ["Ssekandi", "Fiona"]
];

export const students = [] as any[];
let studentIdCounter = 1042;

for (const [grade, streams] of Object.entries(streamNames)) {
  for (const stream of streams) {
    for (let i = 0; i < 15; i++) {
      const [lName, fName] = fixedStudentNames[i];
      students.push({
        id: `S-${studentIdCounter++}`,
        name: `${lName} ${fName}`,
        grade: grade,
        class: stream,
        parent: `${fName.charAt(0)}. ${lName}`,
        status: i < 13 ? "Active" : "Inactive",
        fee: i < 10 ? "Paid" : (i < 13 ? "Pending" : "Overdue")
      });
    }
  }
}

export const teachers = [
  { id: "T-201", name: "Nshuti Medan", subject: "Director", classes: 0, email: "m.nshuti@wellstarbright.sc.ug" },
  { id: "T-202", name: "Sserwadda Ivan", subject: "Mathematics", classes: 5, email: "i.sserwadda@wellstarbright.sc.ug" },
  { id: "T-203", name: "Nagawa Christine", subject: "Biology", classes: 4, email: "c.nagawa@wellstarbright.sc.ug" },
  { id: "T-204", name: "Ouma Patrick", subject: "Physical Education", classes: 6, email: "p.ouma@wellstarbright.sc.ug" },
  { id: "T-205", name: "Kemigisha Fiona", subject: "English Literature", classes: 5, email: "f.kemigisha@wellstarbright.sc.ug" },
  { id: "T-206", name: "Ssekandi Isaac", subject: "Computer Studies", classes: 4, email: "i.ssekandi@wellstarbright.sc.ug" },
  { id: "T-207", name: "Namukasa Amina", subject: "Fine Art", classes: 3, email: "a.namukasa@wellstarbright.sc.ug" },
  { id: "T-208", name: "Opio Daniel", subject: "History & CRE", classes: 4, email: "d.opio@wellstarbright.sc.ug" },
];

export const classes = [
  { id: "C-1A", name: "S.1A — Form Group", teacher: "F. Kemigisha", students: 45, room: "Block A · 102" },
  { id: "C-2B", name: "S.2B — Mathematics", teacher: "I. Sserwadda", students: 48, room: "Block B · 204" },
  { id: "C-3E", name: "S.3 East — Biology", teacher: "C. Nagawa", students: 50, room: "Lab 3" },
  { id: "C-4W", name: "S.4 West — Computer Studies", teacher: "I. Ssekandi", students: 42, room: "Tech Hub" },
  { id: "C-5S", name: "S.5 Sci — PCM/BCM", teacher: "C. Nagawa", students: 35, room: "Block C · 301" },
  { id: "C-6A", name: "S.6 Arts — HEG/HLD", teacher: "A. Namukasa", students: 38, room: "Senior Wing · 12" },
];

export const classSubjects: Record<string, string[]> = {
  "S.1": ["Mathematics", "English", "Biology", "History", "Geography", "Physics"],
  "S.2": ["Mathematics", "English", "Biology", "History", "Geography", "Physics"],
  "S.3": ["Mathematics", "English", "Biology", "Chemistry", "Physics"],
  "S.4": ["Mathematics", "English", "Biology", "Chemistry", "Physics"],
  "S.5": ["Mathematics", "Physics", "Chemistry", "General Paper"],
  "S.6": ["Mathematics", "Physics", "Chemistry", "General Paper"]
};

const generateRecords = (seed: number, grade: string) => {
  const records: Record<string, Record<string, string>> = {};
  const subjects = classSubjects[grade] || ["General"];
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (d.getDay() === 0 || d.getDay() === 6) continue; // skip weekends
    const dateStr = d.toISOString().split('T')[0];
    
    const dailyRecords: Record<string, string> = {};
    for (const subj of subjects) {
      let stat = "P";
      // random logic to simulate truancy
      if ((seed + i + subj.length) % 35 === 0) stat = "A";
      else if ((seed + i + subj.length) % 45 === 0) stat = "L";
      dailyRecords[subj] = stat;
    }
    
    records[dateStr] = dailyRecords;
  }
  return records;
};

export const attendance = students.map((s, i) => ({
  ...s,
  records: generateRecords(i, s.grade)
}));

export const fees = students.map((s, i) => ({
  id: s.id,
  name: s.name,
  grade: s.grade,
  amount: 1500000 + (i % 4) * 300000,
  status: s.fee,
  date: `2025-0${(i % 9) + 1}-15`,
}));

export const applications = [
  { id: "APP-001", studentName: "Kiwewa Mark", grade: "S.1", previousSchool: "Kampala Parents School", status: "Approved", date: "2025-02-10" },
  { id: "APP-002", studentName: "Namata Sarah", grade: "S.5 Arts", previousSchool: "Gayaza High School", status: "Pending", date: "2025-02-14" },
  { id: "APP-003", studentName: "Lubega Collins", grade: "S.2", previousSchool: "Greenhill Academy", status: "Rejected", date: "2025-02-15" },
  { id: "APP-004", studentName: "Kembabazi Ritah", grade: "S.1", previousSchool: "None", status: "Approved", date: "2025-02-18" },
  { id: "APP-005", studentName: "Mugisha Derrick", grade: "S.3", previousSchool: "St. Mary's Kitende", status: "Pending", date: "2025-02-20" },
];

export const siteContent = {
  testimonials: [
    { name: "Amara Okafor", role: "Parent of S.2 student", quote: "Wellstar Bright has transformed how my daughter sees learning. She wakes up excited.", rating: 5 },
    { name: "James Patel", role: "Class of 2023", quote: "The teachers genuinely care. I left with confidence, friendships, and a place at MIT.", rating: 5 },
    { name: "Lin Chen", role: "Parent of S.1 & S.5 students", quote: "Beautiful campus, brilliant educators, and a community that feels like family.", rating: 5 },
  ],
  stats: [
    { value: 1240, label: "Students", suffix: "+" },
    { value: 15, label: "Average class size" },
    { value: 42, label: "Nationalities" },
    { value: 100, label: "University acceptance", suffix: "%" },
  ]
};

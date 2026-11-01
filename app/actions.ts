"use server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { unstable_cache, revalidateTag } from "next/cache";

// Actions updated with latest schema

// ==========================================
// FILE UPLOAD
// ==========================================
export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file uploaded");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const uploadDir = join(process.cwd(), "public", "uploads");
  
  try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}
  
  const path = join(uploadDir, filename);
  await writeFile(path, buffer);

  return `/uploads/${filename}`;
}

export async function uploadHomeworkAttachment(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file uploaded");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const originalName = file.name;
  const ext = originalName.includes(".") ? originalName.split(".").pop()?.toLowerCase() || "" : "";
  const safeBase = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filename = `${Date.now()}-${safeBase}`;
  
  const uploadDir = join(process.cwd(), "public", "uploads", "homework");
  try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}
  
  const path = join(uploadDir, filename);
  await writeFile(path, buffer);

  let formattedSize = "";
  if (file.size < 1024) {
    formattedSize = `${file.size} B`;
  } else if (file.size < 1024 * 1024) {
    formattedSize = `${(file.size / 1024).toFixed(1)} KB`;
  } else {
    formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return {
    url: `/uploads/homework/${filename}`,
    name: originalName,
    size: formattedSize,
    type: ext || file.type || "file",
  };
}

// ==========================================
// CACHED READ OPERATIONS (ROOT & ADMIN)
// ==========================================
const getStudentsCached = unstable_cache(
  async () => {
    const data = await prisma.student.findMany({ include: { class: true } });
    return JSON.parse(JSON.stringify(data));
  },
  ['all-students'],
  { tags: ['students'] }
);

const getClassesCached = unstable_cache(
  async () => {
    const data = await prisma.class.findMany({ include: { subjects: true } });
    return JSON.parse(JSON.stringify(data));
  },
  ['all-classes'],
  { tags: ['classes'] }
);

const getTeachersCached = unstable_cache(
  async () => {
    const data = await prisma.teacher.findMany({ include: { subjects: true, classes: true } });
    return JSON.parse(JSON.stringify(data));
  },
  ['all-teachers'],
  { tags: ['teachers'] }
);

const getSubjectsCached = unstable_cache(
  async () => {
    const data = await prisma.subject.findMany();
    return JSON.parse(JSON.stringify(data));
  },
  ['all-subjects'],
  { tags: ['subjects'] }
);

const getDashboardStatsCached = unstable_cache(
  async () => {
    const [studentCount, teacherCount, classCount] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.class.count()
    ]);
    return { studentCount, teacherCount, classCount };
  },
  ['dashboard-stats'],
  { tags: ['stats', 'students', 'teachers', 'classes'] }
);

const getSiteContentCached = unstable_cache(
  async () => {
    const stats = await prisma.siteStat.findMany();
    const testimonials = await prisma.testimonial.findMany();
    
    return JSON.parse(JSON.stringify({
      stats: stats.length > 0 ? stats : [
        { value: 1240, label: "Students", suffix: "+" },
        { value: 15, label: "Average class size", suffix: "" },
        { value: 42, label: "Nationalities", suffix: "" },
        { value: 100, label: "University acceptance", suffix: "%" },
      ],
      testimonials: testimonials.length > 0 ? testimonials : [
        { name: "Amara Okafor", role: "Parent of S.2 student", quote: "Wellstar Bright has transformed how my daughter sees learning. She wakes up excited.", rating: 5 },
      ]
    }));
  },
  ['site-content'],
  { tags: ['site-content'] }
);

const defaultSongs = [
  {
    id: "s1",
    title: "Wellstar Bright School Anthem",
    artist: "Wellstar Bright Choir",
    duration: "3:42",
    size: "4.2 MB",
    quality: "320 kbps",
    cover: "/gallery/choir-music.png",
    category: "Choir",
    format: "song",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    audioUrl2: null,
  },
  {
    id: "s2",
    title: "Praise & Worship — Morning Assembly",
    artist: "School Praise Team",
    duration: "4:15",
    size: "5.1 MB",
    quality: "320 kbps",
    cover: "/gallery/gallery-3.jpg",
    category: "Worship",
    format: "song",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "s3",
    title: "Inter-House Cultural Dance Beat",
    artist: "Arts & Culture Club",
    duration: "2:58",
    size: "3.5 MB",
    quality: "256 kbps",
    cover: "/gallery/gallery-4.jpg",
    category: "Instrumental",
    format: "song",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: "s4",
    title: "Graduation Ceremony Processional",
    artist: "Wellstar Bright Orchestra",
    duration: "5:20",
    size: "6.1 MB",
    quality: "320 kbps",
    cover: "/gallery/graduation-day.png",
    category: "Instrumental",
    format: "song",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: "s5",
    title: "MDD Festival Opener",
    artist: "Drama & Music Club",
    duration: "3:05",
    size: "3.7 MB",
    quality: "256 kbps",
    cover: "/gallery/choir-music.png",
    category: "Vocal",
    format: "song",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    id: "s6",
    title: "Sports Day March",
    artist: "Brass & Percussion Ensemble",
    duration: "2:30",
    size: "2.9 MB",
    quality: "192 kbps",
    cover: "/gallery/sports-field.png",
    category: "Instrumental",
    format: "song",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
  {
    id: "s7",
    title: "Prize Giving Fanfare",
    artist: "Wellstar Bright Choir",
    duration: "1:55",
    size: "2.3 MB",
    quality: "192 kbps",
    cover: "/gallery/graduation-day.png",
    category: "Choir",
    format: "song",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  },
  {
    id: "s8",
    title: "Chapel Sunday Hymn",
    artist: "SDA Fellowship Group",
    duration: "4:00",
    size: "4.8 MB",
    quality: "320 kbps",
    cover: "/gallery/gallery-3.jpg",
    category: "Worship",
    format: "song",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
];

const defaultVideos = [
  {
    id: "v1",
    title: "Wellstar Bright Campus Tour 2025",
    duration: "5:12",
    cover: "/gallery/hero-campus.jpg",
    category: "Campus",
    format: "video",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "v2",
    title: "Annual Science Exhibition Highlights",
    duration: "3:45",
    cover: "/gallery/stem-lab.png",
    category: "Events",
    format: "video",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "v3",
    title: "Inter-House Football Championship",
    duration: "7:20",
    cover: "/gallery/sports-field.png",
    category: "Sports",
    format: "video",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "v4",
    title: "MDD Festival — Choir & Dance Performance",
    duration: "8:55",
    cover: "/gallery/choir-music.png",
    category: "Music",
    format: "video",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "v5",
    title: "S.6 Valedictory & Prize Giving Ceremony",
    duration: "12:00",
    cover: "/gallery/graduation-day.png",
    category: "Events",
    format: "video",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "v6",
    title: "Computer Studies ICT Workshop",
    duration: "4:30",
    cover: "/gallery/computer-lab.png",
    category: "Campus",
    format: "video",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: "v7",
    title: "Library & Study Hall Spotlight",
    duration: "3:10",
    cover: "/gallery/library-study.png",
    category: "Campus",
    format: "video",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "v8",
    title: "Cultural Dance Heritage Show",
    duration: "6:00",
    cover: "/gallery/gallery-4.jpg",
    category: "Music",
    format: "video",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
];

const defaultEvents = [
  {
    id: "e1",
    title: "Annual Science Exhibition",
    date: "March 2025",
    cover: "/gallery/stem-lab.png",
    desc: "Students showcased innovative science projects, from chemistry to robotics, in our flagship annual science exhibition.",
  },
  {
    id: "e2",
    title: "Inter-House Sports Day",
    date: "May 2025",
    cover: "/gallery/sports-field.png",
    desc: "A day of athletic excellence as all four houses competed in football, track, relay, and field events.",
  },
  {
    id: "e3",
    title: "MDD Festival — Music, Dance & Drama",
    date: "June 2025",
    cover: "/gallery/choir-music.png",
    desc: "The annual MDD festival lit up the stage with original performances, choir competitions, and cultural dances.",
  },
  {
    id: "e4",
    title: "ICT & Computer Studies Workshop",
    date: "July 2025",
    cover: "/gallery/computer-lab.png",
    desc: "Senior students attended an immersive coding and digital literacy workshop hosted in the school's ICT hub.",
  },
  {
    id: "e5",
    title: "S.6 Valedictory & Prize Giving",
    date: "November 2025",
    cover: "/gallery/graduation-day.png",
    desc: "The annual prize giving and valedictory ceremony celebrated our graduating S.6 class and top academic performers.",
  },
  {
    id: "e6",
    title: "SDA Chapel Sunday Service",
    date: "Every Sunday",
    cover: "/gallery/gallery-3.jpg",
    desc: "Weekly SDA chapel service open to students, staff, and parents. Featuring praise team performances and Scripture study.",
  },
];

const getMediaContentCached = unstable_cache(
  async () => {
    const songs = await prisma.mediaItem.findMany({ where: { format: "song" } });
    const videos = await prisma.mediaItem.findMany({ where: { format: "video" } });
    const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
    return JSON.parse(JSON.stringify({
      songs: songs.length > 0 ? songs : defaultSongs,
      videos: videos.length > 0 ? videos : defaultVideos,
      events: events.length > 0 ? events : defaultEvents,
    }));
  },
  ['media-content'],
  { tags: ['media-content'] }
);


const defaultGalleryItems = [
  {
    src: "/gallery/stem-lab.png",
    alt: "Secondary students in science laboratory",
    caption: "Senior Science Students conducting Chemistry Titration in Modern Science Lab",
    category: "STEM & Sciences"
  },
  {
    src: "/gallery/computer-lab.png",
    alt: "Students coding in ICT computer lab",
    caption: "Computer Studies & Coding Workshop in State-of-the-Art ICT Tech Hub",
    category: "STEM & Sciences"
  },
  {
    src: "/gallery/sports-field.png",
    alt: "Football match on school sports pitch",
    caption: "Inter-House Football Championship & Track Athletics Competition",
    category: "Sports"
  },
  {
    src: "/gallery/choir-music.png",
    alt: "School choir performing on stage",
    caption: "Annual Music, Dance & Drama (MDD) Festival and Choir Concert Performance",
    category: "Arts & Culture"
  },
  {
    src: "/gallery/library-study.png",
    alt: "Students studying in school library",
    caption: "Collaborative Study & Research Sessions at the School Main Library",
    category: "Campus Life"
  },
  {
    src: "/gallery/graduation-day.png",
    alt: "Graduating students in academic gowns",
    caption: "Senior 6 Valedictory & UNEB National Examination Excellence Celebration",
    category: "Events"
  },
  {
    src: "/gallery/about-students.jpg",
    alt: "Peer mentorship and group study",
    caption: "Student Peer Mentorship and Interactive Group Discussion in Classrooms",
    category: "Campus Life"
  },
  {
    src: "/gallery/gallery-1.jpg",
    alt: "Biology specimen microscopy",
    caption: "Hands-on Biology Specimen Examination and Microscopy Lab Sessions",
    category: "STEM & Sciences"
  },
  {
    src: "/gallery/gallery-2.jpg",
    alt: "Campus activity and group interaction",
    caption: "Annual Science Exhibition & Student Project Demonstrations",
    category: "Events"
  },
  {
    src: "/gallery/gallery-3.jpg",
    alt: "Student fellowship and worship",
    caption: "SDA Christian Fellowship, Youth Ministry & Chapel Praise Service",
    category: "Campus Life"
  },
  {
    src: "/gallery/gallery-4.jpg",
    alt: "Traditional dance performance",
    caption: "Ugandan Cultural Dance and Heritage Showcase by School Performing Troupe",
    category: "Arts & Culture"
  },
  {
    src: "/gallery/hero-campus.jpg",
    alt: "Wellstar Bright campus grounds",
    caption: "Panoramic View of the Main Academic Complex, Gardens & Campus Walkways",
    category: "Campus Life"
  },
];

const getGalleryItemsCached = unstable_cache(
  async () => {
    let items = await prisma.galleryItem.findMany({ orderBy: { createdAt: 'desc' } });
    if (items.length === 0) {
      try {
        await prisma.galleryItem.createMany({ data: defaultGalleryItems });
        items = await prisma.galleryItem.findMany({ orderBy: { createdAt: 'desc' } });
      } catch (err) {
        console.error("Auto-seeding gallery error:", err);
        return defaultGalleryItems.map((item, idx) => ({ id: `default-${idx}`, ...item }));
      }
    }
    return JSON.parse(JSON.stringify(items));
  },
  ['gallery-content'],
  { tags: ['gallery-content'] }
);

const getApplicationsCached = unstable_cache(
  async () => {
    const data = await prisma.application.findMany({ orderBy: { createdAt: 'desc' } });
    return JSON.parse(JSON.stringify(data));
  },
  ['applications'],
  { tags: ['applications'] }
);

// ==========================================
// EXPORTED ROOT & SITE ACTIONS
// ==========================================
export async function getSiteContent() { return await getSiteContentCached(); }
export async function getMediaContent() { return await getMediaContentCached(); }
export async function getGalleryItems() { return await getGalleryItemsCached(); }
export async function getApplications() { return await getApplicationsCached(); }

export async function submitApplication(app: any) {
  const newApp = await prisma.application.create({
    data: {
      studentName: app.studentName,
      grade: app.grade,
      previousSchool: app.previousSchool,
      status: "Pending",
      points: app.points || null,
      date: new Date().toISOString().split("T")[0]
    }
  });
  revalidateTag('applications');
  return JSON.parse(JSON.stringify(newApp));
}

export async function updateApplicationStatus(id: string, status: string) {
  const res = await prisma.application.update({ where: { id }, data: { status } });
  revalidateTag('applications');
  return JSON.parse(JSON.stringify(res));
}

export async function updateSiteContent(siteContent: any) {
  await prisma.$transaction([
    prisma.siteStat.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.siteStat.createMany({
      data: siteContent.stats.map((s: any) => ({ label: s.label, value: s.value, suffix: s.suffix }))
    }),
    prisma.testimonial.createMany({
      data: siteContent.testimonials.map((t: any) => ({ name: t.name, role: t.role, quote: t.quote, rating: t.rating }))
    })
  ]);
  revalidateTag('site-content');
}

export async function addMediaItem(data: any) {
  const item = await prisma.mediaItem.create({ data });
  revalidateTag('media-content');
  return JSON.parse(JSON.stringify(item));
}

export async function deleteMediaItem(id: string) {
  const item = await prisma.mediaItem.delete({ where: { id } });
  revalidateTag('media-content');
  return JSON.parse(JSON.stringify(item));
}

export async function addEvent(data: any) {
  const event = await prisma.event.create({ data });
  revalidateTag('media-content');
  return JSON.parse(JSON.stringify(event));
}

export async function deleteEvent(id: string) {
  const event = await prisma.event.delete({ where: { id } });
  revalidateTag('media-content');
  return JSON.parse(JSON.stringify(event));
}

export async function addGalleryItem(data: any) {
  const item = await prisma.galleryItem.create({ data });
  revalidateTag('gallery-content');
  return JSON.parse(JSON.stringify(item));
}

export async function deleteGalleryItem(id: string) {
  const item = await prisma.galleryItem.delete({ where: { id } });
  revalidateTag('gallery-content');
  return JSON.parse(JSON.stringify(item));
}

// ==========================================
// EXPORTED SERVER ACTIONS (Students & Classes)
// ==========================================
export async function getStudents() { return await getStudentsCached(); }
export async function getSubjects() { return await getSubjectsCached(); }
export async function getDashboardStats() { return await getDashboardStatsCached(); }
export async function getTeachers() { return await getTeachersCached(); }
export async function getClasses() { return await getClassesCached(); }

export async function addSubject(name: string) {
  const data = await prisma.subject.create({ data: { name } });
  revalidateTag('subjects');
  return JSON.parse(JSON.stringify(data));
}

export async function assignSubjectToTeacher(teacherId: string, subjectId: string) {
  const data = await prisma.teacher.update({
    where: { id: teacherId },
    data: { subjects: { connect: { id: subjectId } } }
  });
  revalidateTag('teachers');
  return JSON.parse(JSON.stringify(data));
}

// Attendance
export async function getAttendance(classId: string, subjectId: string, date: string) {
  const fetchCached = unstable_cache(
    async () => {
      const data = await prisma.attendanceRecord.findMany({
        where: { student: { classId }, subjectId, date }
      });
      return JSON.parse(JSON.stringify(data));
    },
    [`attendance-${classId}-${subjectId}-${date}`],
    { tags: ['attendance'] }
  );
  return await fetchCached();
}

export async function recordAttendance(studentId: string, subjectId: string, date: string, status: string) {
  const data = await prisma.attendanceRecord.upsert({
    where: { date_studentId_subjectId: { date, studentId, subjectId } },
    update: { status },
    create: { date, studentId, subjectId, status }
  });
  revalidateTag('attendance');
  return JSON.parse(JSON.stringify(data));
}

export async function getStudentsByClass(classId: string) {
  const fetchCached = unstable_cache(
    async () => {
      const data = await prisma.student.findMany({ where: { classId }, orderBy: { name: "asc" } });
      return JSON.parse(JSON.stringify(data));
    },
    [`students-class-${classId}`],
    { tags: ['students'] }
  );
  return await fetchCached();
}

export async function getAttendanceForRange(classId: string, subjectId: string, startDate: string, endDate: string) {
  const fetchCached = unstable_cache(
    async () => {
      const data = await prisma.attendanceRecord.findMany({
        where: { 
          student: { classId }, 
          subjectId,
          date: { gte: startDate, lte: endDate }
        }
      });
      return JSON.parse(JSON.stringify(data));
    },
    [`attendance-range-${classId}-${subjectId}-${startDate}-${endDate}`],
    { tags: ['attendance'] }
  );
  return await fetchCached();
}

// ==========================================
// EXAMS & MARKS
// ==========================================
export async function getExams() {
  const fetchCached = unstable_cache(
    async () => {
      const data = await prisma.exam.findMany({ orderBy: { createdAt: 'desc' } });
      return JSON.parse(JSON.stringify(data));
    },
    ['all-exams'],
    { tags: ['exams'] }
  );
  return await fetchCached();
}

export async function createExam(title: string, date: string) {
  const data = await prisma.exam.create({ data: { title, date } });
  revalidateTag('exams');
  return JSON.parse(JSON.stringify(data));
}

export async function recordMark(studentId: string, subjectId: string, examId: string, teacherId: string, score: number) {
  const data = await prisma.mark.upsert({
    where: { studentId_subjectId_examId: { studentId, subjectId, examId } },
    update: { score, teacherId },
    create: { studentId, subjectId, examId, teacherId, score }
  });
  revalidateTag('marks');
  revalidateTag('stats');
  return JSON.parse(JSON.stringify(data));
}

export async function getMarks(examId: string, classId: string, subjectId: string) {
  const fetchCached = unstable_cache(
    async () => {
      const data = await prisma.mark.findMany({
        where: { examId, subjectId, student: { classId } }
      });
      return JSON.parse(JSON.stringify(data));
    },
    [`marks-${examId}-${classId}-${subjectId}`],
    { tags: ['marks'] }
  );
  return await fetchCached();
}

// ==========================================
// AUTHENTICATION & PORTAL MANAGEMENT
// ==========================================
export async function loginTeacher(email: string) {
  const cleanEmail = email.trim();
  const data = await prisma.teacher.findFirst({
    where: {
      email: {
        equals: cleanEmail,
        mode: 'insensitive'
      }
    },
    include: { subjects: true }
  });
  if(!data) throw new Error('Teacher not found');
  return JSON.parse(JSON.stringify(data));
}

export async function addStudent(name: string, email: string, passwordHash: string, classId: string) {
  const data = await prisma.student.create({ data: { name, email, password: passwordHash, classId } });
  revalidateTag('students');
  revalidateTag('stats');
  return JSON.parse(JSON.stringify(data));
}

export async function loginStudent(email: string) {
  const cleanEmail = email.trim();
  const data = await prisma.student.findFirst({
    where: {
      email: {
        equals: cleanEmail,
        mode: 'insensitive'
      }
    }
  });
  if(!data) throw new Error('Student not found');
  return JSON.parse(JSON.stringify(data));
}

export async function updateTeacher(id: string, name: string, email: string, passwordHash?: string, subjectId?: string, classIds: string[] = []) {
  const dataToUpdate: any = { name, email };
  if(passwordHash) dataToUpdate.password = passwordHash;
  if(subjectId) dataToUpdate.subjects = { set: [{ id: subjectId }] };
  dataToUpdate.classes = { set: classIds.map(cid => ({ id: cid })) };

  const data = await prisma.teacher.update({ where: { id }, data: dataToUpdate });
  revalidateTag('teachers');
  return JSON.parse(JSON.stringify(data));
}

export async function deleteTeacher(id: string) {
  const data = await prisma.teacher.delete({ where: { id } });
  revalidateTag('teachers');
  return JSON.parse(JSON.stringify(data));
}

export async function updateStudent(id: string, name: string, email: string, passwordHash?: string, classId?: string) {
  const dataToUpdate: any = { name, email };
  if(passwordHash) dataToUpdate.password = passwordHash;
  if(classId) dataToUpdate.classId = classId;

  const data = await prisma.student.update({ where: { id }, data: dataToUpdate });
  revalidateTag('students');
  return JSON.parse(JSON.stringify(data));
}

export async function deleteStudent(id: string) {
  const data = await prisma.student.delete({ where: { id } });
  revalidateTag('students');
  return JSON.parse(JSON.stringify(data));
}

export async function addTeacher(name: string, email: string, passwordHash: string, subjectId?: string, classIds: string[] = []) {
  const existing = await prisma.teacher.findUnique({ where: { email } });
  if(existing) throw new Error('Email is already in use');
  
  const dataToCreate: any = { name, email, password: passwordHash };
  if(subjectId) dataToCreate.subjects = { connect: { id: subjectId } };
  if(classIds.length > 0) dataToCreate.classes = { connect: classIds.map(cid => ({ id: cid })) };

  const t = await prisma.teacher.create({ data: dataToCreate });
  revalidateTag('teachers');
  return JSON.parse(JSON.stringify(t));
}

export async function getTeacherClasses(teacherId: string) {
  const fetchCached = unstable_cache(
    async () => {
      const data = await prisma.class.findMany({
        where: { teachers: { some: { id: teacherId } } },
        include: { subjects: true }
      });
      return JSON.parse(JSON.stringify(data));
    },
    [`teacher-classes-${teacherId}`],
    { tags: ['classes', 'teachers'] }
  );
  return await fetchCached();
}

// ==========================================
// STUDENT DASHBOARD NEW READ OPERATIONS
// ==========================================
export async function getStudentMarks(studentId: string) {
  const fetchCached = unstable_cache(
    async () => {
      const data = await prisma.mark.findMany({
        where: { studentId },
        include: {
          subject: true,
          exam: true,
          teacher: true,
        },
        orderBy: { createdAt: 'desc' }
      });
      return JSON.parse(JSON.stringify(data));
    },
    [`student-marks-${studentId}`],
    { tags: ['marks'] }
  );
  return await fetchCached();
}

export async function getStudentHomework(classId?: string | null) {
  const fetchCached = unstable_cache(
    async () => {
      const whereClause = (classId && classId !== "ALL") ? { classId } : {};
      const data = await prisma.homework.findMany({
        where: whereClause,
        include: {
          class: true,
          subject: true,
          teacher: true,
        },
        orderBy: { createdAt: 'desc' }
      });
      return JSON.parse(JSON.stringify(data));
    },
    [`student-homework-${classId || 'all'}`],
    { tags: ['homeworks'] }
  );
  return await fetchCached();
}

export async function getStudentTimetable(classId: string) {
  const fetchCached = unstable_cache(
    async () => {
      const data = await prisma.timetable.findMany({
        where: { classId },
        include: {
          subject: true,
          teacher: true,
        },
        orderBy: [{ day: 'asc' }, { time: 'asc' }]
      });
      return JSON.parse(JSON.stringify(data));
    },
    [`student-timetable-${classId}`],
    { tags: ['timetable'] }
  );
  return await fetchCached();
}

export async function getAllNotices() {
  const fetchCached = unstable_cache(
    async () => {
      const data = await prisma.notice.findMany({
        orderBy: [{ pinned: 'desc' }, { date: 'desc' }, { createdAt: 'desc' }]
      });
      return JSON.parse(JSON.stringify(data));
    },
    ['all-notices'],
    { tags: ['notices'] }
  );
  return await fetchCached();
}

export async function getStudentNotices(classId?: string) {
  const fetchCached = unstable_cache(
    async () => {
      const orConditions: any[] = [
        { target: "ALL" },
        { target: "STUDENTS" },
        { target: "PUBLIC" }
      ];
      if (classId) {
        orConditions.push({ target: classId });
      }
      const data = await prisma.notice.findMany({
        where: { OR: orConditions },
        orderBy: [{ pinned: 'desc' }, { date: 'desc' }, { createdAt: 'desc' }]
      });
      return JSON.parse(JSON.stringify(data));
    },
    [`student-notices-${classId || 'all'}`],
    { tags: ['notices'] }
  );
  return await fetchCached();
}

export async function getTeacherNotices() {
  const fetchCached = unstable_cache(
    async () => {
      const data = await prisma.notice.findMany({
        where: {
          OR: [
            { target: "ALL" },
            { target: "TEACHERS" },
            { target: "PUBLIC" }
          ]
        },
        orderBy: [{ pinned: 'desc' }, { date: 'desc' }, { createdAt: 'desc' }]
      });
      return JSON.parse(JSON.stringify(data));
    },
    ['teacher-notices'],
    { tags: ['notices'] }
  );
  return await fetchCached();
}

export async function getPublicNotices() {
  const fetchCached = unstable_cache(
    async () => {
      const data = await prisma.notice.findMany({
        where: {
          OR: [
            { target: "PUBLIC" },
            { target: "ALL" },
            { type: "EVENT" }
          ]
        },
        orderBy: [{ pinned: 'desc' }, { date: 'desc' }, { createdAt: 'desc' }]
      });
      return JSON.parse(JSON.stringify(data));
    },
    ['public-notices'],
    { tags: ['notices', 'media-content'] }
  );
  return await fetchCached();
}

export async function getPortalNotifications(role: 'ADMIN' | 'TEACHER' | 'STUDENT', classId?: string) {
  try {
    const notifications: Array<{
      id: string;
      title: string;
      message: string;
      time: string;
      type: 'notice' | 'alert' | 'event' | 'academic' | 'finance';
      priority?: 'normal' | 'urgent' | 'high';
      url?: string;
    }> = [];

    // 1. Fetch relevant notices
    let noticeWhere: any = { target: "ALL" };
    if (role === 'ADMIN') {
      noticeWhere = {}; // Admin sees all notices
    } else if (role === 'TEACHER') {
      noticeWhere = { OR: [{ target: "ALL" }, { target: "TEACHERS" }, { target: "PUBLIC" }] };
    } else if (role === 'STUDENT') {
      const orList: any[] = [{ target: "ALL" }, { target: "STUDENTS" }, { target: "PUBLIC" }];
      if (classId) orList.push({ target: classId });
      noticeWhere = { OR: orList };
    }

    const notices = await prisma.notice.findMany({
      where: noticeWhere,
      take: 8,
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }]
    });

    for (const n of notices) {
      notifications.push({
        id: `notice-${n.id}`,
        title: n.title,
        message: n.content ? (n.content.slice(0, 110) + (n.content.length > 110 ? '...' : '')) : 'School notice update',
        time: n.date || 'Recent',
        type: n.type === 'EVENT' ? 'event' : 'notice',
        priority: n.pinned ? 'urgent' : 'normal',
        url: role === 'ADMIN' ? '/admin/dashboard/notices' : role === 'TEACHER' ? '/teacher/dashboard' : '/student/dashboard',
      });
    }

    // 2. Fetch role-specific actionable alerts
    if (role === 'ADMIN') {
      const pendingApps = await prisma.application.count({ where: { status: 'Pending' } });
      if (pendingApps > 0) {
        notifications.unshift({
          id: 'alert-pending-apps',
          title: `${pendingApps} Pending Student Applications`,
          message: 'Admissions applications require administrative review and verification.',
          time: 'Action Required',
          type: 'alert',
          priority: 'urgent',
          url: '/admin/dashboard/applications',
        });
      }

      const receiptCount = await prisma.paymentReceipt.count();
      if (receiptCount > 0) {
        notifications.push({
          id: 'alert-finance-status',
          title: 'Finance & POS Reconciled',
          message: `${receiptCount} receipts synchronized with General Ledger.`,
          time: 'Financial Audit',
          type: 'finance',
          priority: 'normal',
          url: '/admin/dashboard/finance',
        });
      }
    } else if (role === 'STUDENT') {
      const homeworks = await prisma.homework.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      });
      for (const hw of homeworks) {
        notifications.unshift({
          id: `hw-${hw.id}`,
          title: `Homework: ${hw.title}`,
          message: `Due date: ${hw.dueDate || 'Check portal'}. Class assignment pending.`,
          time: hw.dueDate || 'Recent',
          type: 'academic',
          priority: 'high',
          url: '/student/dashboard/homework',
        });
      }
    } else if (role === 'TEACHER') {
      const hwCount = await prisma.homework.count();
      notifications.unshift({
        id: 'teacher-hw-overview',
        title: 'Active Homework Tasks',
        message: `${hwCount} class assignments currently active across classrooms.`,
        time: 'Classroom',
        type: 'academic',
        priority: 'normal',
        url: '/teacher/dashboard/homework',
      });
    }

    return JSON.parse(JSON.stringify(notifications));
  } catch (error) {
    console.error('Error fetching portal notifications:', error);
    return [];
  }
}

export async function getStudentDashboardStats(studentId: string, classId: string) {
  const fetchCached = unstable_cache(
    async () => {
      const todayStr = new Date().toISOString().split("T")[0];
      const todayDayOfWeek = new Date().toLocaleDateString("en-US", { weekday: "long" });

      const [marksCount, homeworkCount, timetableCount, noticesCount] = await Promise.all([
        prisma.mark.count({ where: { studentId } }),
        prisma.homework.count({ 
          where: { 
            classId,
            dueDate: { gte: todayStr }
          } 
        }),
        prisma.timetable.count({ 
          where: { 
            classId,
            day: todayDayOfWeek
          } 
        }),
        prisma.notice.count({
          where: {
            OR: [
              { target: "ALL" },
              { target: "STUDENTS" },
              { target: classId }
            ]
          }
        })
      ]);
      return { marksCount, homeworkCount, timetableCount, noticesCount };
    },
    [`student-stats-${studentId}-${classId}`],
    { tags: ['marks', 'homeworks', 'timetable', 'notices'] }
  );
  return await fetchCached();
}

// ==========================================
// TEACHER DASHBOARD NEW READ OPERATIONS
// ==========================================
export async function getTeacherDashboardStats(teacherId: string) {
  const fetchCached = unstable_cache(
    async () => {
      const classes = await prisma.class.findMany({
        where: { teachers: { some: { id: teacherId } } },
        select: { id: true, students: { select: { id: true } } }
      });
      
      const classIds = classes.map(c => c.id);
      const classCount = classes.length;
      
      const studentIds = Array.from(new Set(classes.flatMap(c => c.students.map(s => s.id))));
      const studentCount = studentIds.length;
      
      const todayStr = new Date().toISOString().split("T")[0];
      const attendanceToday = await prisma.attendanceRecord.findMany({
        where: {
          date: todayStr,
          student: { classId: { in: classIds } }
        }
      });
      
      const presents = attendanceToday.filter(r => r.status === "P").length;
      const totalAttendance = attendanceToday.length;
      const attendanceRate = totalAttendance > 0 ? Math.round((presents / totalAttendance) * 100) : null;
      
      const marksCount = await prisma.mark.count({
        where: { teacherId }
      });

      return {
        classCount,
        studentCount,
        attendanceRate: attendanceRate !== null ? `${attendanceRate}%` : "0%",
        marksCount
      };
    },
    [`teacher-stats-${teacherId}`],
    { tags: ['classes', 'teachers', 'students', 'attendance', 'marks'] }
  );
  return await fetchCached();
}

// ==========================================
// NEW MUTATIONS (HOMEWORK & NOTICES)
// ==========================================
export async function addHomework(data: { 
  title: string; 
  desc: string; 
  dueDate: string; 
  classId: string; 
  subjectId: string; 
  teacherId?: string | null;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  attachmentSize?: string | null;
  attachmentType?: string | null;
}) {
  try {
    if (!data.title?.trim()) {
      throw new Error("Assignment title is required");
    }
    if (!data.dueDate?.trim()) {
      throw new Error("Due date is required");
    }

    // Verify and resolve valid teacherId
    let validTeacherId: string | null = data.teacherId || null;
    if (validTeacherId) {
      const existingTeacher = await prisma.teacher.findUnique({ where: { id: validTeacherId } });
      if (!existingTeacher) validTeacherId = null;
    }
    if (!validTeacherId) {
      const fallbackTeacher = await prisma.teacher.findFirst();
      if (!fallbackTeacher) {
        throw new Error("No registered teachers found in database");
      }
      validTeacherId = fallbackTeacher.id;
    }

    // Verify and resolve valid classId
    let validClassId: string | null = data.classId || null;
    if (validClassId) {
      const existingClass = await prisma.class.findUnique({ where: { id: validClassId } });
      if (!existingClass) validClassId = null;
    }
    if (!validClassId) {
      const fallbackClass = await prisma.class.findFirst();
      if (!fallbackClass) {
        throw new Error("No classes found in database");
      }
      validClassId = fallbackClass.id;
    }

    // Verify and resolve valid subjectId
    let validSubjectId: string | null = data.subjectId || null;
    if (validSubjectId) {
      const existingSubject = await prisma.subject.findUnique({ where: { id: validSubjectId } });
      if (!existingSubject) validSubjectId = null;
    }
    if (!validSubjectId) {
      const fallbackSubject = await prisma.subject.findFirst();
      if (!fallbackSubject) {
        throw new Error("No subjects found in database");
      }
      validSubjectId = fallbackSubject.id;
    }

    const res = await prisma.homework.create({ 
      data: {
        title: data.title.trim(),
        desc: data.desc?.trim() || "",
        dueDate: data.dueDate,
        classId: validClassId,
        subjectId: validSubjectId,
        teacherId: validTeacherId,
        attachmentUrl: data.attachmentUrl || null,
        attachmentName: data.attachmentName || null,
        attachmentSize: data.attachmentSize || null,
        attachmentType: data.attachmentType || null,
      }
    });

    try {
      revalidateTag('homeworks');
      revalidateTag('stats');
    } catch (e) {
      // Invariant safe catch for revalidateTag
    }
    return JSON.parse(JSON.stringify(res));
  } catch (err: any) {
    console.error("addHomework server error:", err);
    throw new Error(err.message || "Failed to create homework assignment");
  }
}

export async function deleteHomework(id: string) {
  try {
    const res = await prisma.homework.delete({ where: { id } });
    try {
      revalidateTag('homeworks');
      revalidateTag('stats');
    } catch (e) {}
    return JSON.parse(JSON.stringify(res));
  } catch (err: any) {
    console.error("deleteHomework error:", err);
    throw new Error(err.message || "Failed to delete homework");
  }
}

export async function addNotice(data: { 
  title: string; 
  content: string; 
  target?: string; 
  date: string;
  type?: string;
  category?: string;
  mediaUrl?: string;
  mediaType?: string;
  eventDate?: string;
  location?: string;
  metadata?: string;
  pinned?: boolean;
}) {
  const res = await prisma.notice.create({ 
    data: {
      title: data.title,
      content: data.content,
      target: data.target || "ALL",
      date: data.date,
      type: data.type || "ANNOUNCEMENT",
      category: data.category || "General",
      mediaUrl: data.mediaUrl || null,
      mediaType: data.mediaType || null,
      eventDate: data.eventDate || null,
      location: data.location || null,
      metadata: data.metadata || null,
      pinned: data.pinned ?? false,
    } 
  });
  revalidateTag('notices');
  revalidateTag('stats');
  revalidateTag('media-content');
  return JSON.parse(JSON.stringify(res));
}

export async function updateNotice(id: string, data: Partial<{
  title: string; 
  content: string; 
  target: string; 
  date: string;
  type: string;
  category: string;
  mediaUrl: string;
  mediaType: string;
  eventDate: string;
  location: string;
  metadata: string;
  pinned: boolean;
}>) {
  const res = await prisma.notice.update({
    where: { id },
    data
  });
  revalidateTag('notices');
  revalidateTag('stats');
  revalidateTag('media-content');
  return JSON.parse(JSON.stringify(res));
}

export async function toggleNoticePin(id: string, pinned: boolean) {
  const res = await prisma.notice.update({
    where: { id },
    data: { pinned }
  });
  revalidateTag('notices');
  return JSON.parse(JSON.stringify(res));
}

export async function deleteNotice(id: string) {
  const res = await prisma.notice.delete({ where: { id } });
  revalidateTag('notices');
  revalidateTag('stats');
  revalidateTag('media-content');
  return JSON.parse(JSON.stringify(res));
}

// ==========================================
// EXPORTED MEAL CARDS & CAFETERIA ACTIONS
// ==========================================
import * as mealActions from "./admin/meal-actions";

export async function getAllMealCards() {
  return await mealActions.getAllMealCards();
}

export async function getMealCardByStudent(studentId: string) {
  return await mealActions.getMealCardByStudent(studentId);
}

export async function getMealCardByNumber(cardNumber: string) {
  return await mealActions.getMealCardByNumber(cardNumber);
}

export async function getRecentMealLogs(limit?: number) {
  return await mealActions.getRecentMealLogs(limit);
}

export async function getDailyMealStats(targetDate?: string) {
  return await mealActions.getDailyMealStats(targetDate);
}

export async function serveMealCheckIn(params: any) {
  return await mealActions.serveMealCheckIn(params);
}

export async function issueOrUpdateMealCard(data: any) {
  return await mealActions.issueOrUpdateMealCard(data);
}

export async function batchGenerateMealCards() {
  return await mealActions.batchGenerateMealCards();
}

export async function toggleMealCardStatus(cardId: string, status: any) {
  return await mealActions.toggleMealCardStatus(cardId, status);
}



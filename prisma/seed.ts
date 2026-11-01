import 'dotenv/config'
import prisma from '../src/lib/prisma'
import { students, teachers, classes, classSubjects } from '../src/components/admin/data'

async function main() {
  console.log("Cleaning up existing database records...")
  await prisma.attendanceRecord.deleteMany()
  await prisma.mark.deleteMany()
  await prisma.homework.deleteMany()
  await prisma.timetable.deleteMany()
  await prisma.notice.deleteMany()
  await prisma.student.deleteMany()
  await prisma.class.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.siteStat.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.application.deleteMany()

  console.log("Seeding database...")

  // 1. Seed Subjects
  const allSubjects = Array.from(new Set(Object.values(classSubjects).flat()))
  const createdSubjects = []
  for (const subjectName of allSubjects) {
    const subject = await prisma.subject.create({
      data: { name: subjectName },
    })
    createdSubjects.push(subject)
  }
  console.log(`Seeded ${createdSubjects.length} subjects.`)

  // 2. Seed Classes
  const createdClasses = []
  for (const c of classes) {
    const grade = c.name.split(" ")[0].replace(/[A-Z]/, "") // extracts S.1 from "S.1A — Form Group"
    const cls = await prisma.class.create({
      data: { 
        name: c.name,
        grade: grade,
      },
    })
    
    // Assign subjects to this class
    const subjectsForClass = classSubjects[grade] || ["General"]
    for (const subjName of subjectsForClass) {
      const subjectRecord = createdSubjects.find(s => s.name === subjName)
      if (subjectRecord) {
        await prisma.class.update({
          where: { id: cls.id },
          data: {
            subjects: { connect: { id: subjectRecord.id } }
          }
        })
      }
    }
    
    createdClasses.push(cls)
  }
  console.log(`Seeded ${createdClasses.length} classes.`)

  // 3. Seed Teachers
  const createdTeachers = []
  for (const t of teachers) {
    // Determine subject to assign based on mock data
    const subjRec = createdSubjects.find(s => s.name.includes(t.subject) || t.subject.includes(s.name))
    const teacherData: any = { 
      name: t.name, 
      email: t.email,
      password: "password123"
    }
    if (subjRec) {
      teacherData.subjects = { connect: [{ id: subjRec.id }] }
    }
    
    // Find classes that have this subject and connect the teacher to them
    const classesForSubject = createdClasses.filter(c => {
      const grade = c.name.split(" ")[0].replace(/[A-Z]/, "")
      const subjectsInGrade = classSubjects[grade] || []
      return subjRec && subjectsInGrade.includes(subjRec.name)
    })
    
    if (classesForSubject.length > 0) {
      teacherData.classes = { connect: classesForSubject.map(c => ({ id: c.id })) }
    }

    const teacher = await prisma.teacher.create({
      data: teacherData,
    })
    createdTeachers.push(teacher)
  }
  console.log(`Seeded ${createdTeachers.length} teachers.`)

  // 4. Seed Students
  const createdStudents = []
  for (const s of students.slice(0, 50)) {
    let classRecord = createdClasses.find(c => c.name.startsWith(s.class))
    
    if (!classRecord) {
       classRecord = await prisma.class.create({
         data: { name: s.class, grade: s.grade }
       })
       createdClasses.push(classRecord)
    }

    const studentEmail = `${s.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}.${s.id.toLowerCase()}@student.wellstarbright.sc.ug`

    const student = await prisma.student.create({
      data: {
        name: s.name,
        email: studentEmail,
        password: "student123",
        classId: classRecord.id,
      }
    })
    createdStudents.push(student)
  }
  console.log(`Seeded ${createdStudents.length} students.`)

  // 5. Seed Timetable
  console.log("Seeding timetable slots...")
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const timeSlots = ["08:00 AM - 09:30 AM", "10:00 AM - 11:30 AM", "11:30 AM - 01:00 PM"]
  
  for (const cls of createdClasses) {
    const grade = cls.name.split(" ")[0].replace(/[A-Z]/, "")
    const subjectsInGrade = classSubjects[grade] || []
    
    let slotIdx = 0
    for (const day of days) {
      for (const time of timeSlots) {
        const subjName = subjectsInGrade[slotIdx % subjectsInGrade.length]
        if (!subjName) continue
        
        const subjectRecord = createdSubjects.find(s => s.name === subjName)
        if (subjectRecord) {
          // Find a teacher assigned to this subject, or fallback
          const matchedTeacher = createdTeachers.find(t => t.name !== "Nshuti Medan")
          
          await prisma.timetable.create({
            data: {
              day,
              time,
              classId: cls.id,
              subjectId: subjectRecord.id,
              teacherId: matchedTeacher ? matchedTeacher.id : createdTeachers[0].id
            }
          })
        }
        slotIdx++
      }
    }
  }

  // 6. Seed Homework
  console.log("Seeding homework...")
  const homeworkTemplates = [
    { title: "Algebra Worksheet 1", desc: "Complete problems 1 to 15 on page 42 of the textbook. Show all workings." },
    { title: "Photosynthesis Lab Report", desc: "Write a detailed lab report on the plant light experiment conducted on Tuesday." },
    { title: "Essay: Theme of Justice", desc: "Write a 500-word essay discussing the theme of justice in your current literature text." },
    { title: "HTML/CSS Personal Profile", desc: "Design a responsive personal profile page using HTML and styling with simple CSS." },
    { title: "History: Causes of World War I", desc: "Summarize the key triggers and alliances that led to the outbreak of WWI." }
  ]

  for (const cls of createdClasses) {
    const grade = cls.name.split(" ")[0].replace(/[A-Z]/, "")
    const subjectsInGrade = classSubjects[grade] || []
    
    for (let hIdx = 0; hIdx < 3; hIdx++) {
      const subjName = subjectsInGrade[hIdx % subjectsInGrade.length]
      if (!subjName) continue
      
      const subjectRecord = createdSubjects.find(s => s.name === subjName)
      const template = homeworkTemplates[hIdx % homeworkTemplates.length]
      const matchedTeacher = createdTeachers.find(t => t.name !== "Nshuti Medan")
      
      if (subjectRecord && matchedTeacher) {
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 7 - hIdx)
        
        await prisma.homework.create({
          data: {
            title: `${subjName}: ${template.title}`,
            desc: template.desc,
            dueDate: dueDate.toISOString().split('T')[0],
            classId: cls.id,
            subjectId: subjectRecord.id,
            teacherId: matchedTeacher.id
          }
        })
      }
    }
  }

  // 7. Seed Multi-Format Notices
  console.log("Seeding multi-format notices & board posts...")
  
  const sampleHonorStudents = [
    {
      id: "1",
      name: "Kato Joseph",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      class: "S.2B",
      score: "98% (Aggregate 8)",
      badge: "🏆 Top in Mathematics & Physics",
      status: "top",
      remarks: "Achieved highest distinction in STEM subjects."
    },
    {
      id: "2",
      name: "Babirye Sarah",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      class: "S.4 West",
      score: "95% (Aggregate 9)",
      badge: "🌟 Distinction in English Literature",
      status: "top",
      remarks: "Outstanding creative writing and comprehension."
    },
    {
      id: "3",
      name: "Mukasa Peter",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      class: "S.1A",
      score: "92% (Aggregate 11)",
      badge: "🚀 Best Junior Science Innovator",
      status: "top",
      remarks: "Awarded top robotics demonstration."
    }
  ]

  const noticesData = [
    { 
      title: "Term 1 Academic Excellence Honor Roll & Recognition", 
      content: "The administration is pleased to recognize the students who outperformed their peers in the recent Term 1 examinations. Congratulations to all awardees for their hard work and discipline!", 
      target: "ALL",
      type: "PERFORMANCE",
      category: "Academic",
      metadata: JSON.stringify({ students: sampleHonorStudents }),
      pinned: true,
      mediaUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
      mediaType: "image"
    },
    { 
      title: "Annual Inter-House Sports Gala & Athletic Finals 2026", 
      content: "Join us at the Main Campus Sports Complex for our biggest athletic showdown of the term! Track and field events, soccer finals, and trophy presentations. Parents and community members are warmly invited.", 
      target: "PUBLIC",
      type: "EVENT",
      category: "Sports",
      eventDate: "2026-09-26 09:00 AM",
      location: "Main Campus Stadium & Sports Complex",
      mediaUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
      mediaType: "image",
      pinned: true
    },
    { 
      title: "Wellstar Bright Cultural Festival & Music Spotlight", 
      content: "Watch highlights from our annual cultural festival featuring choir presentations, traditional dances, and drama pieces performed at the National Theatre.", 
      target: "ALL",
      type: "MEDIA",
      category: "Celebration",
      mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      mediaType: "video"
    },
    { 
      title: "Important: Mid-Term Examination Schedule & Requirements", 
      content: "All students are reminded to ensure all lab manuals and subject assignments are submitted before Friday. Ensure all fees are cleared at the bursar's office.", 
      target: "STUDENTS",
      type: "ANNOUNCEMENT",
      category: "Urgent"
    },
    { 
      title: "Staff & Departmental Curriculum Harmonization Meeting", 
      content: "There will be a staff meeting on Thursday at 3:00 PM in the Conference Hall to review lesson plans and upcoming national assessment preparations.", 
      target: "TEACHERS",
      type: "ANNOUNCEMENT",
      category: "Administrative"
    }
  ]
  
  for (const n of noticesData) {
    await prisma.notice.create({
      data: {
        title: n.title,
        content: n.content,
        target: n.target,
        date: new Date().toISOString().split('T')[0],
        type: n.type,
        category: n.category,
        mediaUrl: (n as any).mediaUrl || null,
        mediaType: (n as any).mediaType || null,
        eventDate: (n as any).eventDate || null,
        location: (n as any).location || null,
        metadata: (n as any).metadata || null,
        pinned: (n as any).pinned || false
      }
    })
  }

  // 8. Seed Exams & Marks
  console.log("Seeding exams and marks...")
  const midterm1 = await prisma.exam.create({
    data: {
      title: "Mid-Term 1 2026",
      date: "2026-03-10"
    }
  })
  
  const endterm1 = await prisma.exam.create({
    data: {
      title: "End of Term 1 2026",
      date: "2026-04-20"
    }
  })

  for (const student of createdStudents.slice(0, 15)) {
    const classRecord = createdClasses.find(c => c.id === student.classId)
    if (!classRecord) continue
    const grade = classRecord.name.split(" ")[0].replace(/[A-Z]/, "")
    const subjectsInGrade = classSubjects[grade] || []
    
    for (const subjName of subjectsInGrade.slice(0, 3)) {
      const subjectRecord = createdSubjects.find(s => s.name === subjName)
      const matchedTeacher = createdTeachers.find(t => t.name !== "Nshuti Medan")
      
      if (subjectRecord && matchedTeacher) {
        const score1 = 55 + Math.floor(Math.random() * 40)
        const score2 = 60 + Math.floor(Math.random() * 38)
        
        await prisma.mark.create({
          data: {
            score: score1,
            studentId: student.id,
            subjectId: subjectRecord.id,
            examId: midterm1.id,
            teacherId: matchedTeacher.id
          }
        })
        
        await prisma.mark.create({
          data: {
            score: score2,
            studentId: student.id,
            subjectId: subjectRecord.id,
            examId: endterm1.id,
            teacherId: matchedTeacher.id
          }
        })
      }
    }
  }

  // 9. Seed Web Site content
  console.log("Seeding website stats & testimonials...")
  const siteStats = [
    { label: "Students", value: 1240, suffix: "+" },
    { label: "Average class size", value: 15, suffix: "" },
    { label: "Nationalities", value: 42, suffix: "" },
    { label: "University acceptance", value: 100, suffix: "%" },
  ]
  const testimonials = [
    { name: "Amara Okafor", role: "Parent of S.2 student", quote: "Wellstar Bright has transformed how my daughter sees learning. She wakes up excited.", rating: 5 },
    { name: "James Patel", role: "Class of 2023", quote: "The teachers genuinely care. I left with confidence, friendships, and a place at MIT.", rating: 5 },
    { name: "Lin Chen", role: "Parent of S.1 & S.5 students", quote: "Beautiful campus, brilliant educators, and a community that feels like family.", rating: 5 },
  ]

  await prisma.siteStat.createMany({ data: siteStats })
  await prisma.testimonial.createMany({ data: testimonials })

  // 10. Seed Applications
  console.log("Seeding admissions applications...")
  const applicationsData = [
    { studentName: "Kiwewa Mark", grade: "S.1", previousSchool: "Kampala Parents School", status: "Approved", date: "2026-02-10" },
    { studentName: "Namata Sarah", grade: "S.5 Arts", previousSchool: "Gayaza High School", status: "Pending", date: "2026-02-14" },
    { studentName: "Lubega Collins", grade: "S.2", previousSchool: "Greenhill Academy", status: "Rejected", date: "2026-02-15" },
    { studentName: "Kembabazi Ritah", grade: "S.1", previousSchool: "None", status: "Approved", date: "2026-02-18" },
    { studentName: "Mugisha Derrick", grade: "S.3", previousSchool: "St. Mary's Kitende", status: "Pending", date: "2026-02-20" },
  ]
  
  // 11. Seed Gallery Items
  console.log("Seeding gallery items...")
  await prisma.galleryItem.deleteMany()
  const gallerySeedData = [
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
  ]
  await prisma.galleryItem.createMany({ data: gallerySeedData })

  console.log("Database seeded successfully.")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to generate default password: firstname in lowercase + 123
function generateDefaultPassword(fullName) {
  const firstName = fullName.trim().split(/\s+/)[0].toLowerCase();
  return `${firstName}123`;
}

// ================= 1. REGISTERED STUDENTS (10 Default Students) =================
let students = [
  {
    id: "st_1",
    name: "Rajdeep Dey",
    rollNo: "CS-2026-001",
    email: "rajdeep.dey@university.edu",
    semester: "4th Semester",
    branch: "Computer Science & Engineering",
    consistencyRating: 97,
    avatar: "👨‍💻",
    password: generateDefaultPassword("Rajdeep Dey") // rajdeep123
  },
  {
    id: "st_2",
    name: "Rahul Sharma",
    rollNo: "CS-2026-002",
    email: "rahul.sharma@university.edu",
    semester: "4th Semester",
    branch: "Computer Science & Engineering",
    consistencyRating: 94,
    avatar: "👨‍🎓",
    password: generateDefaultPassword("Rahul Sharma") // rahul123
  },
  {
    id: "st_3",
    name: "Priya Patel",
    rollNo: "CS-2026-003",
    email: "priya.patel@university.edu",
    semester: "4th Semester",
    branch: "Computer Science & Engineering",
    consistencyRating: 98,
    avatar: "👩‍🎓",
    password: generateDefaultPassword("Priya Patel") // priya123
  },
  {
    id: "st_4",
    name: "Aarav Mehta",
    rollNo: "CS-2026-004",
    email: "aarav.mehta@university.edu",
    semester: "4th Semester",
    branch: "Computer Science & Engineering",
    consistencyRating: 91,
    avatar: "👨‍💻",
    password: generateDefaultPassword("Aarav Mehta") // aarav123
  },
  {
    id: "st_5",
    name: "Sneha Reddy",
    rollNo: "CS-2026-005",
    email: "sneha.reddy@university.edu",
    semester: "4th Semester",
    branch: "Information Technology",
    consistencyRating: 89,
    avatar: "👩‍💻",
    password: generateDefaultPassword("Sneha Reddy") // sneha123
  },
  {
    id: "st_6",
    name: "Vikram Singh",
    rollNo: "CS-2026-006",
    email: "vikram.singh@university.edu",
    semester: "4th Semester",
    branch: "Computer Science & Engineering",
    consistencyRating: 83,
    avatar: "👨‍🎓",
    password: generateDefaultPassword("Vikram Singh") // vikram123
  },
  {
    id: "st_7",
    name: "Ananya Iyer",
    rollNo: "CS-2026-007",
    email: "ananya.iyer@university.edu",
    semester: "4th Semester",
    branch: "Data Science & AI",
    consistencyRating: 96,
    avatar: "👩‍🎓",
    password: generateDefaultPassword("Ananya Iyer") // ananya123
  },
  {
    id: "st_8",
    name: "Rohan Gupta",
    rollNo: "CS-2026-008",
    email: "rohan.gupta@university.edu",
    semester: "4th Semester",
    branch: "Information Technology",
    consistencyRating: 87,
    avatar: "👨‍🎓",
    password: generateDefaultPassword("Rohan Gupta") // rohan123
  },
  {
    id: "st_9",
    name: "Meera Nair",
    rollNo: "CS-2026-009",
    email: "meera.nair@university.edu",
    semester: "4th Semester",
    branch: "Computer Science & Engineering",
    consistencyRating: 92,
    avatar: "👩‍🎓",
    password: generateDefaultPassword("Meera Nair") // meera123
  },
  {
    id: "st_10",
    name: "Aditya Verma",
    rollNo: "CS-2026-010",
    email: "aditya.verma@university.edu",
    semester: "4th Semester",
    branch: "Data Science & AI",
    consistencyRating: 85,
    avatar: "👨‍💻",
    password: generateDefaultPassword("Aditya Verma") // aditya123
  }
];

// ================= 2. EXAM CATALOG =================
const examCatalog = [
  {
    id: "exam_arch",
    code: "CS301",
    title: "Computer Architecture & Organization",
    type: "official",
    status: "active",
    durationMins: 15,
    totalMarks: 100,
    passingMarks: 50,
    questionsCount: 5,
    description: "Evaluates CPU organization, memory hierarchy, instruction pipelining, and bus transfers.",
    dateLabel: "Active Now • Closes Today 11:59 PM",
    questions: [
      {
        id: "q1",
        question: "What is the primary role of the Program Counter (PC) register in a CPU?",
        options: [
          { key: "A", text: "Holds the memory address of the next instruction to be fetched and executed" },
          { key: "B", text: "Stores the immediate result of the Arithmetic Logic Unit (ALU)" },
          { key: "C", text: "Counts the total clock cycles elapsed since system boot" },
          { key: "D", text: "Manages network bandwidth between server and client" }
        ],
        correctAnswer: "A",
        points: 20,
        explanation: "The Program Counter (PC) stores the address of the next instruction to be fetched from memory."
      },
      {
        id: "q2",
        question: "Which of the following memory types exhibits the lowest access latency in the computer memory hierarchy?",
        options: [
          { key: "A", text: "Main Memory (RAM)" },
          { key: "B", text: "CPU Registers" },
          { key: "C", text: "Solid State Drive (SSD)" },
          { key: "D", text: "Level 3 (L3) Cache" }
        ],
        correctAnswer: "B",
        points: 20,
        explanation: "CPU registers are built directly into the processor core and operate within a single clock cycle."
      },
      {
        id: "q3",
        question: "In CPU instruction pipelining, what is a 'Data Hazard'?",
        options: [
          { key: "A", text: "When physical RAM temperature exceeds safe limits" },
          { key: "B", text: "When an instruction depends on the result of a previous instruction still in the pipeline" },
          { key: "C", text: "When an incorrect opcode is decoded" },
          { key: "D", text: "A physical disconnection of the system bus" }
        ],
        correctAnswer: "B",
        points: 20,
        explanation: "Data hazards occur when instructions that exhibit data dependencies overlap in different pipeline stages."
      },
      {
        id: "q4",
        question: "Which bus is responsible for specifying the physical memory address for read or write operations?",
        options: [
          { key: "A", text: "Data Bus" },
          { key: "B", text: "Address Bus" },
          { key: "C", text: "Control Bus" },
          { key: "D", text: "Power Bus" }
        ],
        correctAnswer: "B",
        points: 20,
        explanation: "The Address Bus carries the physical memory locations from the CPU to the memory controller."
      },
      {
        id: "q5",
        question: "What principle allows Cache Memory to effectively speed up instruction and data retrieval?",
        options: [
          { key: "A", text: "Principle of Locality (Temporal and Spatial)" },
          { key: "B", text: "Quantum Entanglement" },
          { key: "C", text: "Bubble Sort Algorithm" },
          { key: "D", text: "Polymorphism" }
        ],
        correctAnswer: "A",
        points: 20,
        explanation: "Caches rely on temporal locality (recently accessed data is accessed again) and spatial locality (nearby data is accessed)."
      }
    ]
  },
  {
    id: "exam_dsa",
    code: "CS202",
    title: "Data Structures & Algorithms Mock Test",
    type: "mock",
    status: "active",
    durationMins: 15,
    totalMarks: 100,
    passingMarks: 50,
    questionsCount: 5,
    description: "Practice mock test covering Trees, Graphs, Sorting algorithms, and asymptotic complexity.",
    dateLabel: "Practice Mock • Unlimited Attempts",
    questions: [
      {
        id: "q1",
        question: "What is the worst-case time complexity of the standard QuickSort algorithm?",
        options: [
          { key: "A", text: "O(n log n)" },
          { key: "B", text: "O(n²)" },
          { key: "C", text: "O(n)" },
          { key: "D", text: "O(1)" }
        ],
        correctAnswer: "B",
        points: 20,
        explanation: "QuickSort degrades to O(n²) when the pivot selection consistently produces unbalanced partitions."
      },
      {
        id: "q2",
        question: "Which data structure is typically utilized to implement Breadth-First Search (BFS) in a graph?",
        options: [
          { key: "A", text: "Stack" },
          { key: "B", text: "Queue" },
          { key: "C", text: "Binary Search Tree" },
          { key: "D", text: "Priority Queue" }
        ],
        correctAnswer: "B",
        points: 20,
        explanation: "BFS explores nodes layer by layer using a FIFO Queue."
      },
      {
        id: "q3",
        question: "In a Max-Heap data structure with N elements, where is the maximum element located?",
        options: [
          { key: "A", text: "At the root node (index 0)" },
          { key: "B", text: "At the leftmost leaf node" },
          { key: "C", text: "At the rightmost leaf node" },
          { key: "D", text: "At index N-1" }
        ],
        correctAnswer: "A",
        points: 20,
        explanation: "In a max-heap, the root node always holds the maximum key by definition."
      },
      {
        id: "q4",
        question: "What is the average case time complexity for searching an element in a Hash Table with good distribution?",
        options: [
          { key: "A", text: "O(1)" },
          { key: "B", text: "O(log n)" },
          { key: "C", text: "O(n)" },
          { key: "D", text: "O(n log n)" }
        ],
        correctAnswer: "A",
        points: 20,
        explanation: "A Hash Table provides constant O(1) average lookup time via hashing."
      },
      {
        id: "q5",
        question: "Which self-balancing binary search tree maintains a balance factor strictly between -1 and +1?",
        options: [
          { key: "A", text: "AVL Tree" },
          { key: "B", text: "B-Tree" },
          { key: "C", text: "Splay Tree" },
          { key: "D", text: "Trie" }
        ],
        correctAnswer: "A",
        points: 20,
        explanation: "AVL trees guarantee that the heights of the two child subtrees of any node differ by at most one."
      }
    ]
  },
  {
    id: "exam_os",
    code: "CS304",
    title: "Operating Systems & Concurrency",
    type: "official",
    status: "upcoming",
    durationMins: 20,
    totalMarks: 100,
    passingMarks: 50,
    questionsCount: 5,
    description: "Upcoming comprehensive exam on Process Synchronization, Semaphores, Deadlocks, and Paging.",
    dateLabel: "Scheduled for Tomorrow • 10:00 AM IST",
    questions: []
  },
  {
    id: "exam_dbms",
    code: "CS305",
    title: "Database Management Systems (SQL & ACID)",
    type: "official",
    status: "upcoming",
    durationMins: 25,
    totalMarks: 100,
    passingMarks: 50,
    questionsCount: 5,
    description: "Upcoming assessment on relational algebra, normalization forms (1NF-BCNF), and transaction recovery.",
    dateLabel: "Scheduled for Nov 2, 2026 • 02:00 PM IST",
    questions: []
  }
];

// ================= 3. SUBMISSIONS & DEFAULT EXAM RESULTS =================
let submissionsDb = [];
let submissionCounter = 3001;

function scoreExam(exam, answers) {
  let score = 0;
  const breakdown = [];

  exam.questions.forEach(q => {
    const studentAns = answers ? answers[q.id] : null;
    const isCorrect = studentAns === q.correctAnswer;
    if (isCorrect) score += q.points;

    breakdown.push({
      questionId: q.id,
      question: q.question,
      studentAnswer: studentAns || "Unanswered",
      correctAnswer: q.correctAnswer,
      isCorrect,
      pointsEarned: isCorrect ? q.points : 0,
      totalPoints: q.points,
      explanation: q.explanation
    });
  });

  const totalPoints = exam.questions.reduce((sum, q) => sum + q.points, 0);
  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
  const passed = percentage >= exam.passingMarks;

  return { score, totalPoints, percentage, passed, breakdown };
}

// Seed default exam results across all 10 students
function seedDefaultResults() {
  const archExam = examCatalog.find(e => e.id === "exam_arch");
  const dsaExam = examCatalog.find(e => e.id === "exam_dsa");

  const records = [
    // Rajdeep Dey (Rank 1 - Outstanding)
    { studentId: "st_1", exam: archExam, answers: { q1: "A", q2: "B", q3: "B", q4: "B", q5: "A" }, timeStr: "Yesterday 03:30 PM", timeTaken: "8m 15s" },
    { studentId: "st_1", exam: dsaExam, answers: { q1: "B", q2: "B", q3: "A", q4: "A", q5: "A" }, timeStr: "2 days ago 10:15 AM", timeTaken: "7m 45s" },

    // Priya Patel (Rank 2)
    { studentId: "st_3", exam: archExam, answers: { q1: "A", q2: "B", q3: "B", q4: "B", q5: "A" }, timeStr: "Yesterday 04:10 PM", timeTaken: "9m 05s" },
    { studentId: "st_3", exam: dsaExam, answers: { q1: "B", q2: "B", q3: "A", q4: "A", q5: "A" }, timeStr: "2 days ago 11:30 AM", timeTaken: "8m 20s" },

    // Ananya Iyer (Rank 3)
    { studentId: "st_7", exam: archExam, answers: { q1: "A", q2: "B", q3: "B", q4: "B", q5: "A" }, timeStr: "Yesterday 04:50 PM", timeTaken: "9m 40s" },
    { studentId: "st_7", exam: dsaExam, answers: { q1: "B", q2: "B", q3: "A", q4: "A", q5: "B" }, timeStr: "2 days ago 01:15 PM", timeTaken: "9m 10s" },

    // Rahul Sharma (Rank 4)
    { studentId: "st_2", exam: archExam, answers: { q1: "A", q2: "B", q3: "B", q4: "B", q5: "C" }, timeStr: "Yesterday 05:20 PM", timeTaken: "11m 10s" },
    { studentId: "st_2", exam: dsaExam, answers: { q1: "B", q2: "B", q3: "A", q4: "A", q5: "A" }, timeStr: "2 days ago 02:40 PM", timeTaken: "10m 15s" },

    // Aarav Mehta (Rank 5)
    { studentId: "st_4", exam: archExam, answers: { q1: "A", q2: "B", q3: "B", q4: "C", q5: "A" }, timeStr: "Yesterday 06:00 PM", timeTaken: "10m 50s" },
    { studentId: "st_4", exam: dsaExam, answers: { q1: "B", q2: "B", q3: "A", q4: "A", q5: "B" }, timeStr: "2 days ago 03:20 PM", timeTaken: "11m 00s" },

    // Meera Nair (Rank 6)
    { studentId: "st_9", exam: archExam, answers: { q1: "A", q2: "B", q3: "B", q4: "B", q5: "B" }, timeStr: "Yesterday 06:30 PM", timeTaken: "12m 15s" },
    { studentId: "st_9", exam: dsaExam, answers: { q1: "B", q2: "B", q3: "A", q4: "A", q5: "C" }, timeStr: "2 days ago 04:10 PM", timeTaken: "10m 30s" },

    // Sneha Reddy (Rank 7)
    { studentId: "st_5", exam: archExam, answers: { q1: "A", q2: "A", q3: "B", q4: "B", q5: "A" }, timeStr: "Yesterday 07:15 PM", timeTaken: "11m 40s" },
    { studentId: "st_5", exam: dsaExam, answers: { q1: "B", q2: "A", q3: "A", q4: "A", q5: "B" }, timeStr: "2 days ago 04:50 PM", timeTaken: "12m 10s" },

    // Rohan Gupta (Rank 8)
    { studentId: "st_8", exam: archExam, answers: { q1: "A", q2: "B", q3: "C", q4: "B", q5: "A" }, timeStr: "Yesterday 07:50 PM", timeTaken: "13m 20s" },
    { studentId: "st_8", exam: dsaExam, answers: { q1: "B", q2: "B", q3: "A", q4: "C", q5: "B" }, timeStr: "2 days ago 05:30 PM", timeTaken: "12m 45s" },

    // Aditya Verma (Rank 9)
    { studentId: "st_10", exam: archExam, answers: { q1: "A", q2: "B", q3: "A", q4: "B", q5: "C" }, timeStr: "Yesterday 08:20 PM", timeTaken: "14m 10s" },
    { studentId: "st_10", exam: dsaExam, answers: { q1: "B", q2: "A", q3: "A", q4: "B", q5: "A" }, timeStr: "2 days ago 06:15 PM", timeTaken: "13m 05s" },

    // Vikram Singh (Rank 10)
    { studentId: "st_6", exam: archExam, answers: { q1: "B", q2: "B", q3: "A", q4: "B", q5: "C" }, timeStr: "Yesterday 08:50 PM", timeTaken: "14m 50s" },
    { studentId: "st_6", exam: dsaExam, answers: { q1: "B", q2: "B", q3: "C", q4: "A", q5: "D" }, timeStr: "2 days ago 07:00 PM", timeTaken: "14m 20s" }
  ];

  records.forEach(item => {
    const st = students.find(s => s.id === item.studentId);
    if (!st || !item.exam) return;
    const scored = scoreExam(item.exam, item.answers);
    submissionsDb.push({
      id: `SUB-${submissionCounter++}`,
      studentId: st.id,
      studentName: st.name,
      rollNo: st.rollNo,
      examId: item.exam.id,
      examCode: item.exam.code,
      examTitle: item.exam.title,
      examType: item.exam.type,
      score: scored.score,
      totalPoints: scored.totalPoints,
      percentage: scored.percentage,
      passed: scored.passed,
      submittedAt: item.timeStr,
      timeTaken: item.timeTaken,
      breakdown: scored.breakdown
    });
  });
}

seedDefaultResults();

// Compute dynamic rankings
function computeRankings() {
  const studentMap = {};

  students.forEach(st => {
    studentMap[st.id] = {
      studentId: st.id,
      name: st.name,
      rollNo: st.rollNo,
      avatar: st.avatar,
      branch: st.branch,
      consistency: st.consistencyRating,
      examsAttempted: 0,
      totalScore: 0,
      totalPossible: 0,
      passedCount: 0
    };
  });

  submissionsDb.forEach(sub => {
    if (studentMap[sub.studentId]) {
      studentMap[sub.studentId].examsAttempted += 1;
      studentMap[sub.studentId].totalScore += sub.score;
      studentMap[sub.studentId].totalPossible += sub.totalPoints;
      if (sub.passed) studentMap[sub.studentId].passedCount += 1;
    }
  });

  const rankedList = Object.values(studentMap).map(s => {
    const avgPercentage = s.totalPossible > 0 ? Math.round((s.totalScore / s.totalPossible) * 100) : 0;
    return { ...s, averagePercentage: avgPercentage };
  });

  rankedList.sort((a, b) => b.averagePercentage - a.averagePercentage || b.consistency - a.consistency);

  return rankedList.map((st, index) => ({
    ...st,
    rank: index + 1
  }));
}

// Sanitize student object (remove password before sending to client)
function sanitizeStudent(s) {
  const { password, ...safe } = s;
  return safe;
}

// ================= 4. AUTHENTICATION API ROUTES =================

// Public list of default accounts with expected passwords for easy login/reference
app.get('/api/auth/demo-accounts', (req, res) => {
  const list = students.map(s => ({
    id: s.id,
    name: s.name,
    rollNo: s.rollNo,
    email: s.email,
    branch: s.branch,
    avatar: s.avatar,
    defaultPassword: generateDefaultPassword(s.name)
  }));
  res.json({ accounts: list });
});

// Student Login (Case-insensitive name, roll, or email + password)
app.post('/api/auth/login', (req, res) => {
  const { loginName, password } = req.body;

  if (!loginName || !password) {
    return res.status(400).json({ error: "Please provide both Student Name / Roll No and Password." });
  }

  const query = loginName.trim().toLowerCase();
  const inputPwd = password.trim();

  // Find student by case-insensitive name, rollNo, or email
  const found = students.find(s => 
    s.name.toLowerCase() === query ||
    s.name.toLowerCase().startsWith(query) ||
    s.rollNo.toLowerCase() === query ||
    s.email.toLowerCase() === query
  );

  if (!found) {
    return res.status(401).json({ error: `No student found matching "${loginName}". Check your name or sign up.` });
  }

  if (found.password !== inputPwd) {
    const expectedHint = generateDefaultPassword(found.name);
    return res.status(401).json({ 
      error: `Incorrect password for ${found.name}. (Default format is name123, e.g. "${expectedHint}")` 
    });
  }

  res.json({
    message: "Login successful!",
    student: sanitizeStudent(found)
  });
});

// Student Sign Up
app.post('/api/auth/signup', (req, res) => {
  const { name, rollNo, email, branch, password } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: "Full Name is required." });
  }

  const cleanName = name.trim();
  const cleanRoll = rollNo ? rollNo.trim().toUpperCase() : `CS-2026-${Math.floor(100 + Math.random() * 900)}`;

  // Check if roll number already exists
  const exists = students.find(s => s.rollNo.toLowerCase() === cleanRoll.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: `A student with Roll Number ${cleanRoll} already exists.` });
  }

  // Use provided password or generate default name123
  const finalPassword = (password && password.trim() !== '') 
    ? password.trim() 
    : generateDefaultPassword(cleanName);

  const newId = `st_${students.length + 1}`;
  const newStudent = {
    id: newId,
    name: cleanName,
    rollNo: cleanRoll,
    email: email && email.trim() ? email.trim() : `${cleanName.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
    semester: "4th Semester",
    branch: branch && branch.trim() ? branch.trim() : "Computer Science & Engineering",
    consistencyRating: 90,
    avatar: "👨‍🎓",
    password: finalPassword
  };

  students.push(newStudent);

  res.json({
    message: `Account created successfully! Your password is set to: "${finalPassword}"`,
    student: sanitizeStudent(newStudent)
  });
});

// Change Password Option for Student
app.post('/api/auth/change-password', (req, res) => {
  const { studentId, currentPassword, newPassword } = req.body;

  if (!studentId || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "Student ID, current password, and new password are required." });
  }

  const student = students.find(s => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student not found." });
  }

  if (student.password !== currentPassword.trim()) {
    return res.status(401).json({ error: "Current password does not match our records." });
  }

  if (newPassword.trim().length < 4) {
    return res.status(400).json({ error: "New password must be at least 4 characters long." });
  }

  student.password = newPassword.trim();

  res.json({
    message: "Password changed successfully! Please use your new password next time you log in."
  });
});

// ================= 5. STUDENT DASHBOARD & EXAMS =================
app.get('/api/student/dashboard/:studentId', (req, res) => {
  const { studentId } = req.params;
  const student = students.find(s => s.id === studentId) || students[0];

  const rankings = computeRankings();
  const studentRankObj = rankings.find(r => r.studentId === student.id) || { rank: "-", averagePercentage: 0 };

  const studentSubmissions = submissionsDb.filter(s => s.studentId === student.id);
  const totalExams = studentSubmissions.length;
  const passedExams = studentSubmissions.filter(s => s.passed).length;
  const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0;

  res.json({
    student: sanitizeStudent(student),
    stats: {
      rank: studentRankObj.rank,
      totalStudents: students.length,
      consistencyRating: student.consistencyRating,
      averageScore: studentRankObj.averagePercentage,
      examsCompleted: totalExams,
      passRate
    },
    topScorers: rankings.slice(0, 5),
    recentResults: studentSubmissions.slice(0, 4),
    availableExamsCount: examCatalog.filter(e => e.status === "active").length,
    upcomingExamsCount: examCatalog.filter(e => e.status === "upcoming").length
  });
});

app.get('/api/exams', (req, res) => {
  const sanitized = examCatalog.map(e => ({
    id: e.id,
    code: e.code,
    title: e.title,
    type: e.type,
    status: e.status,
    durationMins: e.durationMins,
    totalMarks: e.totalMarks,
    passingMarks: e.passingMarks,
    questionsCount: e.questions.length || e.questionsCount,
    description: e.description,
    dateLabel: e.dateLabel
  }));
  res.json({ exams: sanitized });
});

app.get('/api/exams/:examId', (req, res) => {
  const exam = examCatalog.find(e => e.id === req.params.examId);
  if (!exam) return res.status(404).json({ error: "Exam not found" });

  if (exam.status !== "active") {
    return res.status(400).json({ error: "This examination is not currently open for attempts." });
  }

  const sanitizedQuestions = exam.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    points: q.points
  }));

  res.json({
    exam: {
      id: exam.id,
      code: exam.code,
      title: exam.title,
      type: exam.type,
      durationMins: exam.durationMins,
      totalMarks: exam.totalMarks,
      passingMarks: exam.passingMarks,
      description: exam.description
    },
    questions: sanitizedQuestions
  });
});

app.post('/api/exams/:examId/submit', (req, res) => {
  const { examId } = req.params;
  const { studentId, answers, timeTaken } = req.body;

  const exam = examCatalog.find(e => e.id === examId);
  if (!exam) return res.status(404).json({ error: "Exam not found" });

  const student = students.find(s => s.id === studentId) || students[0];
  const evalResult = scoreExam(exam, answers || {});

  const newSubmission = {
    id: `SUB-${submissionCounter++}`,
    studentId: student.id,
    studentName: student.name,
    rollNo: student.rollNo,
    examId: exam.id,
    examCode: exam.code,
    examTitle: exam.title,
    examType: exam.type,
    score: evalResult.score,
    totalPoints: evalResult.totalPoints,
    percentage: evalResult.percentage,
    passed: evalResult.passed,
    submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " Today",
    timeTaken: timeTaken || "10m 15s",
    breakdown: evalResult.breakdown
  };

  submissionsDb.unshift(newSubmission);

  res.json({
    message: "Exam processed successfully!",
    result: newSubmission
  });
});

app.get('/api/student/results/:studentId', (req, res) => {
  const { studentId } = req.params;
  const list = submissionsDb.filter(s => s.studentId === studentId);
  res.json({ results: list });
});

app.get('/api/results/:submissionId', (req, res) => {
  const sub = submissionsDb.find(s => s.id === req.params.submissionId);
  if (!sub) return res.status(404).json({ error: "Submission not found" });
  res.json({ submission: sub });
});

app.get('/api/leaderboard', (req, res) => {
  const rankings = computeRankings();
  res.json({ leaderboard: rankings });
});

app.get('/api/admin/overview', (req, res) => {
  const total = submissionsDb.length;
  const passedCount = submissionsDb.filter(s => s.passed).length;
  const avg = total > 0 ? (submissionsDb.reduce((acc, s) => acc + s.score, 0) / total).toFixed(1) : 0;
  const passRate = total > 0 ? Math.round((passedCount / total) * 100) : 0;

  res.json({
    stats: {
      totalSubmissions: total,
      registeredStudents: students.length,
      averageScore: avg,
      passRate,
      activeExams: examCatalog.filter(e => e.status === "active").length
    },
    submissions: submissionsDb
  });
});

app.post('/api/admin/batch-simulate', (req, res) => {
  const archExam = examCatalog.find(e => e.id === "exam_arch");
  const options = ['A', 'B', 'C', 'D'];
  const newOnes = [];

  students.forEach((st) => {
    const randomAns = {};
    archExam.questions.forEach(q => {
      randomAns[q.id] = Math.random() > 0.25 ? q.correctAnswer : options[Math.floor(Math.random() * options.length)];
    });

    const evaluated = scoreExam(archExam, randomAns);
    const sub = {
      id: `SUB-${submissionCounter++}`,
      studentId: st.id,
      studentName: st.name,
      rollNo: st.rollNo,
      examId: archExam.id,
      examCode: archExam.code,
      examTitle: archExam.title,
      examType: archExam.type,
      score: evaluated.score,
      totalPoints: evaluated.totalPoints,
      percentage: evaluated.percentage,
      passed: evaluated.passed,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " (Batch)",
      timeTaken: `${8 + Math.floor(Math.random() * 5)}m ${Math.floor(Math.random() * 50)}s`,
      breakdown: evaluated.breakdown
    };

    submissionsDb.unshift(sub);
    newOnes.push(sub);
  });

  res.json({
    message: `Batch processed ${newOnes.length} submissions across student pool!`,
    totalSubmissions: submissionsDb.length
  });
});

app.listen(PORT, () => {
  console.log(`ExamFlow Platform running at http://localhost:${PORT}`);
});

/**
 * EXAMFLOW - CLIENT APPLICATION LOGIC
 * With Student Authentication, Password Management, and Full Features
 */

// Global State
let currentStudent = null;
let allExams = [];
let currentFilter = 'all';
let activeExamSession = null;
let examTimerInterval = null;
let examTimeSeconds = 0;
let activeUserAnswers = {};
let demoAccountsCache = [];

// On DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  checkAuthSession();
  loadDemoAccounts();
});

// ================= AUTHENTICATION GATE =================

// Check if user is already logged in
function checkAuthSession() {
  const saved = localStorage.getItem('examflow_user');
  if (saved) {
    try {
      currentStudent = JSON.parse(saved);
      showMainPortal();
      return;
    } catch (e) {
      localStorage.removeItem('examflow_user');
    }
  }

  showAuthScreen();
}

function showAuthScreen() {
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('main-header').style.display = 'none';
  document.getElementById('main-content-area').style.display = 'none';
  document.getElementById('main-footer').style.display = 'none';
}

function showMainPortal() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('main-header').style.display = 'block';
  document.getElementById('main-content-area').style.display = 'block';
  document.getElementById('main-footer').style.display = 'block';

  updateHeaderProfile();
  loadDashboard();
}

function updateHeaderProfile() {
  if (!currentStudent) return;
  document.getElementById('current-user-avatar').innerText = currentStudent.avatar || "👨‍🎓";
  document.getElementById('current-user-name').innerText = currentStudent.name;
  document.getElementById('current-user-roll').innerText = currentStudent.rollNo;

  document.getElementById('dropdown-user-name').innerText = currentStudent.name;
  document.getElementById('dropdown-user-email').innerText = currentStudent.email || `${currentStudent.rollNo}@university.edu`;
}

// Toggle between Login and Signup tabs
function toggleAuthMode(mode) {
  const loginBtn = document.getElementById('auth-tab-btn-login');
  const signupBtn = document.getElementById('auth-tab-btn-signup');
  const loginForm = document.getElementById('form-login');
  const signupForm = document.getElementById('form-signup');
  const alertBox = document.getElementById('auth-alert');

  alertBox.style.display = 'none';

  if (mode === 'login') {
    loginBtn.classList.add('active');
    signupBtn.classList.remove('active');
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
  } else {
    signupBtn.classList.add('active');
    loginBtn.classList.remove('active');
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
  }
}

// Show alert message in Auth screen
function showAuthAlert(message, isSuccess = false) {
  const alertBox = document.getElementById('auth-alert');
  alertBox.style.display = 'block';
  alertBox.className = `auth-alert-box ${isSuccess ? 'alert-success' : 'alert-danger'}`;
  alertBox.innerText = message;
}

// Handle Login Submission
async function handleLoginSubmit(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const submitBtn = document.getElementById('btn-login-submit');

  const loginName = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!loginName || !password) {
    showAuthAlert("Please enter both your Name/Roll and Password.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>Verifying credentials...</span>`;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginName, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showAuthAlert(data.error || "Login failed.");
      return;
    }

    // Success! Store student session
    currentStudent = data.student;
    localStorage.setItem('examflow_user', JSON.stringify(currentStudent));
    showMainPortal();

  } catch (err) {
    showAuthAlert("Network error: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>Log In to ExamFlow</span> <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  }
}

// Handle Sign Up Submission
async function handleSignupSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const rollNo = document.getElementById('signup-roll').value.trim();
  const branch = document.getElementById('signup-branch').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  const submitBtn = document.getElementById('btn-signup-submit');

  if (!name) {
    showAuthAlert("Full Name is required.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>Creating account...</span>`;

  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, rollNo, branch, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showAuthAlert(data.error || "Sign up failed.");
      return;
    }

    alert(data.message);
    currentStudent = data.student;
    localStorage.setItem('examflow_user', JSON.stringify(currentStudent));
    showMainPortal();

  } catch (err) {
    showAuthAlert("Error: " + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>Create Student Account</span> <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  }
}

// Load the 10 Demo Accounts into Accordion
async function loadDemoAccounts() {
  try {
    const res = await fetch('/api/auth/demo-accounts');
    const data = await res.json();
    demoAccountsCache = data.accounts;

    const container = document.getElementById('demo-accounts-list');
    container.innerHTML = '';

    demoAccountsCache.forEach(acc => {
      const chip = document.createElement('div');
      chip.className = 'demo-account-chip';
      chip.innerHTML = `
        <div>
          <span class="demo-chip-name">${acc.name}</span>
          <span style="font-size:0.7rem; color:var(--text-dim);"> (${acc.rollNo})</span>
          <div class="demo-chip-pwd">Password: <strong>${acc.defaultPassword}</strong></div>
        </div>
        <button type="button" class="btn-autofill" onclick="autofillLogin('${acc.name}', '${acc.defaultPassword}')">
          Auto-Fill
        </button>
      `;
      container.appendChild(chip);
    });

  } catch (err) {
    console.warn("Could not load demo accounts:", err);
  }
}

function toggleDemoAccounts() {
  const list = document.getElementById('demo-accounts-list');
  const arrow = document.getElementById('demo-arrow');
  if (list.style.display === 'none') {
    list.style.display = 'block';
    arrow.innerText = '▲';
  } else {
    list.style.display = 'none';
    arrow.innerText = '▼';
  }
}

function autofillLogin(name, pwd) {
  toggleAuthMode('login');
  document.getElementById('login-username').value = name;
  document.getElementById('login-password').value = pwd;
  document.getElementById('login-password').focus();
}

// Profile Dropdown Toggle
function toggleProfileDropdown() {
  const menu = document.getElementById('profile-dropdown');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Close dropdown on clicking outside
document.addEventListener('click', (e) => {
  const container = document.querySelector('.profile-menu-container');
  if (container && !container.contains(e.target)) {
    const menu = document.getElementById('profile-dropdown');
    if (menu) menu.style.display = 'none';
  }
});

// Logout Student
function logoutStudent() {
  localStorage.removeItem('examflow_user');
  currentStudent = null;
  const menu = document.getElementById('profile-dropdown');
  if (menu) menu.style.display = 'none';

  if (activeExamSession) cancelExamAttempt();
  showAuthScreen();
}

// ================= CHANGE PASSWORD MODAL =================
function openChangePasswordModal() {
  const menu = document.getElementById('profile-dropdown');
  if (menu) menu.style.display = 'none';

  document.getElementById('change-password-form').reset();
  document.getElementById('pwd-modal-alert').style.display = 'none';
  document.getElementById('change-password-modal').classList.add('open');
}

function closeChangePasswordModal() {
  document.getElementById('change-password-modal').classList.remove('open');
}

function closeChangePasswordModalOnOutside(e) {
  if (e.target.id === 'change-password-modal') closeChangePasswordModal();
}

async function handleChangePasswordSubmit(e) {
  e.preventDefault();
  const currentPassword = document.getElementById('pwd-current').value.trim();
  const newPassword = document.getElementById('pwd-new').value.trim();
  const confirmPassword = document.getElementById('pwd-confirm').value.trim();
  const alertBox = document.getElementById('pwd-modal-alert');
  const btn = document.getElementById('btn-save-new-pwd');

  if (newPassword !== confirmPassword) {
    alertBox.style.display = 'block';
    alertBox.className = 'auth-alert-box alert-danger';
    alertBox.innerText = "New password and Confirm password do not match.";
    return;
  }

  btn.disabled = true;
  btn.innerText = "Updating...";

  try {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: currentStudent.id,
        currentPassword,
        newPassword
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alertBox.style.display = 'block';
      alertBox.className = 'auth-alert-box alert-danger';
      alertBox.innerText = data.error || "Password change failed.";
      return;
    }

    alertBox.style.display = 'block';
    alertBox.className = 'auth-alert-box alert-success';
    alertBox.innerText = data.message;

    setTimeout(() => {
      closeChangePasswordModal();
    }, 1800);

  } catch (err) {
    alertBox.style.display = 'block';
    alertBox.className = 'auth-alert-box alert-danger';
    alertBox.innerText = "Network error: " + err.message;
  } finally {
    btn.disabled = false;
    btn.innerText = "Update Password";
  }
}

// ================= VIEW NAVIGATION =================
function switchView(viewName) {
  if (activeExamSession && viewName !== 'exam-room') {
    if (!confirm("Are you sure you want to leave the exam room? Unsaved answers will be lost.")) {
      return;
    }
    cancelExamAttempt();
  }

  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`tab-nav-${viewName}`);
  if (activeBtn) activeBtn.classList.add('active');

  document.querySelectorAll('.content-view').forEach(v => v.classList.remove('active'));
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) targetView.classList.add('active');

  if (viewName === 'dashboard') loadDashboard();
  if (viewName === 'exams') loadExams();
  if (viewName === 'results') loadPastResults();
  if (viewName === 'leaderboard') loadLeaderboard();
  if (viewName === 'faculty') loadFacultyOverview();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= VIEW 1: DASHBOARD =================
async function loadDashboard() {
  if (!currentStudent) return;
  try {
    const res = await fetch(`/api/student/dashboard/${currentStudent.id}`);
    const data = await res.json();

    // Greeting & Banner
    document.getElementById('dash-greeting-name').innerText = currentStudent.name.split(' ')[0];
    document.getElementById('dash-consistency-label').innerText = `${data.stats.consistencyRating}%`;
    document.getElementById('dash-rank-label').innerText = `#${data.stats.rank}`;
    document.getElementById('dash-consistency-circle').innerText = `${data.stats.consistencyRating}%`;

    // 4 Key Stats
    document.getElementById('stat-class-rank').innerHTML = `#${data.stats.rank} <span class="stat-card-sub">/ ${data.stats.totalStudents} Students</span>`;
    document.getElementById('stat-avg-score').innerText = `${data.stats.averageScore}%`;
    document.getElementById('stat-completed-count').innerText = `${data.stats.examsCompleted} Tests`;
    document.getElementById('stat-consistency').innerText = `${data.stats.consistencyRating}%`;

    // Top Scorers Mini Widget
    const topScorersEl = document.getElementById('dash-top-scorers');
    topScorersEl.innerHTML = '';
    data.topScorers.forEach((s, idx) => {
      const rankBadge = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `#${idx + 1}`));
      const row = document.createElement('div');
      row.className = 'leaderboard-mini-item';
      row.innerHTML = `
        <div class="leader-info">
          <span class="leader-rank-badge">${rankBadge}</span>
          <span>${s.avatar || '👨‍🎓'}</span>
          <div>
            <div class="leader-name">${s.name} ${s.studentId === currentStudent.id ? '<span class="badge badge-primary" style="font-size:0.65rem">YOU</span>' : ''}</div>
            <div style="font-size: 0.72rem; color: var(--text-dim);">${s.rollNo}</div>
          </div>
        </div>
        <div class="leader-score">${s.averagePercentage}% Avg</div>
      `;
      topScorersEl.appendChild(row);
    });

    // Recent Results Mini Widget
    const recentResultsEl = document.getElementById('dash-recent-results');
    recentResultsEl.innerHTML = '';
    if (!data.recentResults || data.recentResults.length === 0) {
      recentResultsEl.innerHTML = `<div class="text-center py-4 text-muted">No past submissions yet. Take an exam to see results!</div>`;
    } else {
      data.recentResults.forEach(r => {
        const row = document.createElement('div');
        row.className = 'quick-exam-item';
        row.innerHTML = `
          <div>
            <div class="quick-exam-title">${r.examTitle}</div>
            <div class="quick-exam-meta">
              <span class="badge ${r.passed ? 'badge-success' : 'badge-danger'}">${r.passed ? 'PASSED' : 'FAILED'}</span>
              <span>Score: <strong>${r.score}/${r.totalPoints}</strong> (${r.percentage}%)</span>
              <span>• ${r.submittedAt}</span>
            </div>
          </div>
          <button class="btn btn-sm btn-secondary" onclick="openReviewModal('${r.id}')">Review</button>
        `;
        recentResultsEl.appendChild(row);
      });
    }

    loadQuickAvailableExams();

  } catch (err) {
    console.warn("Failed to load dashboard:", err);
  }
}

async function loadQuickAvailableExams() {
  try {
    const res = await fetch('/api/exams');
    const data = await res.json();
    allExams = data.exams;

    const quickExamsEl = document.getElementById('dash-quick-exams');
    quickExamsEl.innerHTML = '';

    const activeList = allExams.filter(e => e.status === 'active');
    activeList.forEach(exam => {
      const card = document.createElement('div');
      card.className = 'quick-exam-item';
      const typeBadge = exam.type === 'mock' ? 'badge-mock' : 'badge-primary';
      const typeLabel = exam.type === 'mock' ? 'Practice Mock' : 'Official Exam';

      card.innerHTML = `
        <div>
          <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.25rem;">
            <span class="badge ${typeBadge}">${typeLabel}</span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">${exam.code}</span>
          </div>
          <div class="quick-exam-title">${exam.title}</div>
          <div class="quick-exam-meta">
            <span>⏱️ ${exam.durationMins} Mins</span>
            <span>• 🎯 ${exam.totalMarks} Marks</span>
            <span>• ❓ ${exam.questionsCount} Questions</span>
          </div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="startExam('${exam.id}')">Start Test →</button>
      `;
      quickExamsEl.appendChild(card);
    });

  } catch (err) {
    console.warn("Failed to load quick exams:", err);
  }
}

// ================= VIEW 2: EXAMS & MOCK TESTS =================
async function loadExams() {
  try {
    const res = await fetch('/api/exams');
    const data = await res.json();
    allExams = data.exams;
    renderExamsGrid();
  } catch (err) {
    console.warn("Failed to fetch exams:", err);
  }
}

function filterExams(category) {
  currentFilter = category;
  document.querySelectorAll('#exam-filter-pills .filter-pill').forEach(pill => {
    pill.classList.remove('active');
  });
  event.target.classList.add('active');
  renderExamsGrid();
}

function renderExamsGrid() {
  const container = document.getElementById('exams-grid-container');
  container.innerHTML = '';

  let filtered = allExams;
  if (currentFilter === 'active') {
    filtered = allExams.filter(e => e.status === 'active' && e.type === 'official');
  } else if (currentFilter === 'mock') {
    filtered = allExams.filter(e => e.type === 'mock');
  } else if (currentFilter === 'upcoming') {
    filtered = allExams.filter(e => e.status === 'upcoming');
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-center py-4 text-muted" style="grid-column: 1 / -1">No examinations found in this category.</div>`;
    return;
  }

  filtered.forEach(exam => {
    const card = document.createElement('div');
    card.className = 'exam-card';

    let badgeClass = 'badge-primary';
    let badgeText = 'Official Exam';
    if (exam.type === 'mock') {
      badgeClass = 'badge-mock';
      badgeText = 'Practice Mock';
    } else if (exam.status === 'upcoming') {
      badgeClass = 'badge-upcoming';
      badgeText = 'Upcoming Exam';
    }

    const actionButton = exam.status === 'active'
      ? `<button class="btn btn-primary" onclick="startExam('${exam.id}')">${exam.type === 'mock' ? 'Take Mock Test' : 'Start Official Exam'} →</button>`
      : `<button class="btn btn-secondary btn-sm" disabled style="opacity: 0.6;">Opens on Schedule</button>`;

    card.innerHTML = `
      <div>
        <div class="exam-card-header">
          <span class="badge ${badgeClass}">${badgeText}</span>
          <span style="font-family: var(--font-mono); font-size: 0.82rem; color: #818cf8; font-weight: 700;">${exam.code}</span>
        </div>
        <h3 class="exam-card-title">${exam.title}</h3>
        <p class="exam-card-desc">${exam.description}</p>
        
        <div class="exam-specs-row">
          <span class="spec-chip">⏱️ ${exam.durationMins} Mins Duration</span>
          <span class="spec-chip">🎯 ${exam.totalMarks} Total Marks</span>
          <span class="spec-chip">❓ ${exam.questionsCount} Questions</span>
          <span class="spec-chip">✅ Pass Mark: ${exam.passingMarks}%</span>
        </div>
      </div>

      <div class="exam-card-footer">
        <span class="exam-date-label">${exam.dateLabel}</span>
        ${actionButton}
      </div>
    `;

    container.appendChild(card);
  });
}

// ================= VIEW 6: ACTIVE EXAM ROOM =================
async function startExam(examId) {
  try {
    const res = await fetch(`/api/exams/${examId}`);
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Unable to start exam.");
      return;
    }

    activeExamSession = {
      exam: data.exam,
      questions: data.questions
    };
    activeUserAnswers = {};
    examTimeSeconds = data.exam.durationMins * 60;

    document.getElementById('room-exam-code').innerText = data.exam.code;
    document.getElementById('room-exam-title').innerText = data.exam.title;
    document.getElementById('room-student-info').innerText = `Candidate: ${currentStudent.name} (${currentStudent.rollNo})`;

    document.getElementById('room-result-box').style.display = 'none';
    document.getElementById('room-questions-container').style.display = 'block';
    document.getElementById('room-question-nav-strip').style.display = 'flex';
    document.querySelector('.exam-submit-bar').style.display = 'flex';

    renderExamRoomQuestions();
    renderQuestionNavStrip();
    startExamTimer();

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.content-view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-exam-room').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err) {
    alert("Error launching exam: " + err.message);
  }
}

function renderExamRoomQuestions() {
  const container = document.getElementById('room-questions-container');
  container.innerHTML = '';

  activeExamSession.questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'room-question-card';
    card.id = `q-card-${q.id}`;

    let optionsHtml = '';
    q.options.forEach(opt => {
      const isSelected = activeUserAnswers[q.id] === opt.key;
      optionsHtml += `
        <div class="room-option ${isSelected ? 'selected' : ''}" onclick="selectRoomOption('${q.id}', '${opt.key}')">
          <div class="room-option-circle">${opt.key}</div>
          <div style="font-size: 0.94rem; color: #e2e8f0;">${opt.text}</div>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="room-q-header">
        <span class="room-q-num">QUESTION ${idx + 1} OF ${activeExamSession.questions.length}</span>
        <span class="badge badge-light">${q.points} Points</span>
      </div>
      <div class="room-q-text">${q.question}</div>
      <div class="room-options-stack">
        ${optionsHtml}
      </div>
    `;

    container.appendChild(card);
  });

  updateRoomAnsweredCount();
}

function renderQuestionNavStrip() {
  const strip = document.getElementById('room-question-nav-strip');
  strip.innerHTML = '';

  activeExamSession.questions.forEach((q, idx) => {
    const bubble = document.createElement('div');
    const isAnswered = !!activeUserAnswers[q.id];
    bubble.className = `nav-bubble ${isAnswered ? 'answered' : ''}`;
    bubble.id = `bubble-${q.id}`;
    bubble.innerText = idx + 1;
    bubble.title = `Jump to Question ${idx + 1}`;
    bubble.onclick = () => {
      const targetCard = document.getElementById(`q-card-${q.id}`);
      if (targetCard) targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    strip.appendChild(bubble);
  });
}

function selectRoomOption(questionId, optionKey) {
  activeUserAnswers[questionId] = optionKey;

  const card = document.getElementById(`q-card-${questionId}`);
  if (card) {
    card.querySelectorAll('.room-option').forEach(opt => {
      const circle = opt.querySelector('.room-option-circle');
      if (circle && circle.innerText.trim() === optionKey) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });
  }

  const bubble = document.getElementById(`bubble-${questionId}`);
  if (bubble) bubble.classList.add('answered');

  updateRoomAnsweredCount();
}

function updateRoomAnsweredCount() {
  const answered = Object.keys(activeUserAnswers).length;
  const total = activeExamSession ? activeExamSession.questions.length : 0;
  document.getElementById('room-answered-count').innerText = `${answered} of ${total} Questions Answered`;
}

function startExamTimer() {
  if (examTimerInterval) clearInterval(examTimerInterval);

  updateTimerDisplay();
  examTimerInterval = setInterval(() => {
    examTimeSeconds--;
    updateTimerDisplay();

    if (examTimeSeconds <= 0) {
      clearInterval(examTimerInterval);
      alert("Time has expired! Submitting your exam automatically.");
      submitActiveExam();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const mins = Math.floor(examTimeSeconds / 60);
  const secs = examTimeSeconds % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  document.getElementById('room-timer-digits').innerText = formatted;
}

function cancelExamAttempt() {
  if (examTimerInterval) clearInterval(examTimerInterval);
  activeExamSession = null;
  switchView('exams');
}

async function submitActiveExam() {
  const answered = Object.keys(activeUserAnswers).length;
  const total = activeExamSession.questions.length;

  if (examTimeSeconds > 0 && answered < total) {
    const confirmSubmit = confirm(`You have only answered ${answered} of ${total} questions. Do you still wish to submit?`);
    if (!confirmSubmit) return;
  }

  if (examTimerInterval) clearInterval(examTimerInterval);

  const btn = document.getElementById('btn-submit-active-exam');
  btn.disabled = true;
  btn.innerText = "Evaluating & Processing...";

  const totalDurationSeconds = activeExamSession.exam.durationMins * 60;
  const elapsed = totalDurationSeconds - examTimeSeconds;
  const elapsedMins = Math.floor(elapsed / 60);
  const elapsedSecs = elapsed % 60;
  const timeTakenStr = `${elapsedMins}m ${elapsedSecs}s`;

  try {
    const res = await fetch(`/api/exams/${activeExamSession.exam.id}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: currentStudent.id,
        answers: activeUserAnswers,
        timeTaken: timeTakenStr
      })
    });

    const data = await res.json();
    renderExamRoomResult(data.result);

  } catch (err) {
    alert("Submission error: " + err.message);
  } finally {
    btn.disabled = false;
    btn.innerText = "Submit & Process Exam";
  }
}

function renderExamRoomResult(result) {
  document.getElementById('room-questions-container').style.display = 'none';
  document.getElementById('room-question-nav-strip').style.display = 'none';
  document.querySelector('.exam-submit-bar').style.display = 'none';

  const resultBox = document.getElementById('room-result-box');
  resultBox.style.display = 'block';

  const badge = document.getElementById('room-res-badge');
  badge.className = `result-badge-pill ${result.passed ? '' : 'failed'}`;
  badge.innerText = result.passed ? 'PASSED 🎉' : 'NEEDS IMPROVEMENT';

  document.getElementById('room-res-score').innerText = `${result.score} / ${result.totalPoints}`;
  document.getElementById('room-res-percentage').innerText = `${result.percentage}%`;
  
  const statusEl = document.getElementById('room-res-status');
  statusEl.innerText = result.passed ? 'PASSED' : 'FAILED';
  statusEl.className = `score-tile-val ${result.passed ? 'text-emerald' : 'text-danger'}`;

  const breakdownList = document.getElementById('room-res-breakdown-list');
  breakdownList.innerHTML = '';

  result.breakdown.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = `review-card-item ${item.isCorrect ? 'correct' : 'incorrect'}`;
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.35rem;">
        <strong style="color:#fff;">Question ${idx + 1}</strong>
        <span class="badge ${item.isCorrect ? 'badge-success' : 'badge-danger'}">
          ${item.isCorrect ? `+${item.pointsEarned} pts` : `0 / ${item.totalPoints} pts`}
        </span>
      </div>
      <div style="font-size:0.92rem; color:#cbd5e1; margin-bottom: 0.5rem;">${item.question}</div>
      <div style="font-size:0.85rem;">
        Your Answer: <strong class="${item.isCorrect ? 'text-emerald' : 'text-danger'}">${item.studentAnswer}</strong>
        ${!item.isCorrect ? ` • Correct Answer: <strong class="text-primary">${item.correctAnswer}</strong>` : ''}
      </div>
      <div class="review-explanation">
        <strong>💡 Solution Explanation:</strong> ${item.explanation}
      </div>
    `;
    breakdownList.appendChild(card);
  });

  resultBox.scrollIntoView({ behavior: 'smooth' });
}

// ================= VIEW 3: PAST RESULTS =================
async function loadPastResults() {
  if (!currentStudent) return;
  try {
    const res = await fetch(`/api/student/results/${currentStudent.id}`);
    const data = await res.json();

    const tbody = document.getElementById('student-results-tbody');
    tbody.innerHTML = '';

    if (!data.results || data.results.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">No past examination results found for ${currentStudent.name}.</td></tr>`;
      return;
    }

    data.results.forEach(sub => {
      const tr = document.createElement('tr');
      const typeBadge = sub.examType === 'mock' ? 'badge-mock' : 'badge-primary';
      const typeLabel = sub.examType === 'mock' ? 'Mock Test' : 'Official';

      tr.innerHTML = `
        <td><code style="font-family: var(--font-mono); color: #818cf8;">${sub.id}</code></td>
        <td><strong>${sub.examTitle}</strong> <span style="font-size: 0.75rem; color: var(--text-dim);">(${sub.examCode})</span></td>
        <td><span class="badge ${typeBadge}">${typeLabel}</span></td>
        <td>${sub.submittedAt}</td>
        <td>${sub.timeTaken || '-'}</td>
        <td><strong>${sub.score}</strong> / ${sub.totalPoints}</td>
        <td>${sub.percentage}%</td>
        <td>
          <span class="badge ${sub.passed ? 'badge-success' : 'badge-danger'}">
            ${sub.passed ? 'PASSED' : 'FAILED'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="openReviewModal('${sub.id}')">📄 View Sheet</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.warn("Failed to load results:", err);
  }
}

// ================= VIEW 4: LEADERBOARD =================
async function loadLeaderboard() {
  try {
    const res = await fetch('/api/leaderboard');
    const data = await res.json();

    const tbody = document.getElementById('leaderboard-tbody');
    tbody.innerHTML = '';

    data.leaderboard.forEach((st, idx) => {
      const tr = document.createElement('tr');
      const rankBadge = idx === 0 ? '🥇 #1 (Gold)' : (idx === 1 ? '🥈 #2 (Silver)' : (idx === 2 ? '🥉 #3 (Bronze)' : `#${st.rank}`));
      const isCurrent = currentStudent && st.studentId === currentStudent.id;

      let tierBadge = '<span class="badge badge-success">Top Tier</span>';
      if (idx > 2 && idx < 6) tierBadge = '<span class="badge badge-primary">Proficient</span>';
      if (idx >= 6) tierBadge = '<span class="badge badge-light">Developing</span>';

      tr.innerHTML = `
        <td><strong style="color: ${idx < 3 ? 'var(--amber)' : '#fff'}">${rankBadge}</strong></td>
        <td>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span>${st.avatar || '👨‍🎓'}</span>
            <strong>${st.name}</strong>
            ${isCurrent ? '<span class="badge badge-primary" style="font-size:0.65rem;">YOU</span>' : ''}
          </div>
        </td>
        <td><code>${st.rollNo}</code></td>
        <td>${st.branch || 'CSE'}</td>
        <td>${st.examsAttempted} Tests</td>
        <td><strong class="text-emerald" style="font-family: var(--font-mono); font-size: 0.95rem;">${st.averagePercentage}%</strong></td>
        <td><strong class="text-amber" style="font-family: var(--font-mono);">${st.consistency}%</strong></td>
        <td>${tierBadge}</td>
      `;

      if (isCurrent) {
        tr.style.backgroundColor = 'rgba(99, 102, 241, 0.08)';
      }

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.warn("Failed to load leaderboard:", err);
  }
}

// ================= VIEW 5: FACULTY VIEW =================
async function loadFacultyOverview() {
  try {
    const res = await fetch('/api/admin/overview');
    const data = await res.json();

    document.getElementById('fac-total-subs').innerText = data.stats.totalSubmissions;
    document.getElementById('fac-total-students').innerText = data.stats.registeredStudents;
    document.getElementById('fac-avg-score').innerText = `${data.stats.averageScore} / 100`;
    document.getElementById('fac-pass-rate').innerText = `${data.stats.passRate}%`;
    document.getElementById('fac-ledger-badge').innerText = `${data.stats.totalSubmissions} Total Processed`;

    const tbody = document.getElementById('faculty-submissions-tbody');
    tbody.innerHTML = '';

    data.submissions.forEach(sub => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><code>${sub.id}</code></td>
        <td><strong>${sub.studentName}</strong></td>
        <td>${sub.rollNo}</td>
        <td>${sub.examTitle}</td>
        <td><strong>${sub.score}</strong> / ${sub.totalPoints}</td>
        <td>${sub.percentage}%</td>
        <td>
          <span class="badge ${sub.passed ? 'badge-success' : 'badge-danger'}">
            ${sub.passed ? 'PASSED' : 'FAILED'}
          </span>
        </td>
        <td style="color: var(--text-dim); font-size: 0.8rem;">${sub.submittedAt}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (err) {
    console.warn("Failed to load faculty view:", err);
  }
}

async function simulateBatchInFaculty() {
  try {
    const res = await fetch('/api/admin/batch-simulate', { method: 'POST' });
    const data = await res.json();
    alert(data.message);
    loadFacultyOverview();
  } catch (err) {
    alert("Batch simulation error: " + err.message);
  }
}

// ================= ANSWER SHEET REVIEW MODAL =================
async function openReviewModal(submissionId) {
  try {
    const res = await fetch(`/api/results/${submissionId}`);
    const data = await res.json();
    const sub = data.submission;

    document.getElementById('review-modal-title').innerText = `${sub.examTitle} — Answer Sheet`;
    document.getElementById('review-modal-meta').innerText = `Submission: ${sub.id} • Candidate: ${sub.studentName} (${sub.rollNo}) • ${sub.submittedAt}`;
    document.getElementById('review-modal-score').innerText = `Score: ${sub.score} / ${sub.totalPoints} (${sub.percentage}%)`;
    
    const statusBadge = document.getElementById('review-modal-status');
    statusBadge.className = `badge ${sub.passed ? 'badge-success' : 'badge-danger'}`;
    statusBadge.innerText = sub.passed ? 'PASSED' : 'FAILED';

    document.getElementById('review-modal-time').innerText = `Time Taken: ${sub.timeTaken || '10m'}`;

    const listContainer = document.getElementById('review-modal-questions-list');
    listContainer.innerHTML = '';

    if (sub.breakdown) {
      sub.breakdown.forEach((item, idx) => {
        const card = document.createElement('div');
        card.className = `review-card-item ${item.isCorrect ? 'correct' : 'incorrect'}`;
        card.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.35rem;">
            <strong style="color:#fff;">Question ${idx + 1}</strong>
            <span class="badge ${item.isCorrect ? 'badge-success' : 'badge-danger'}">
              ${item.isCorrect ? `+${item.pointsEarned} pts` : `0 / ${item.totalPoints} pts`}
            </span>
          </div>
          <div style="font-size:0.92rem; color:#cbd5e1; margin-bottom: 0.5rem;">${item.question}</div>
          <div style="font-size:0.85rem;">
            Your Answer: <strong class="${item.isCorrect ? 'text-emerald' : 'text-danger'}">${item.studentAnswer}</strong>
            ${!item.isCorrect ? ` • Correct Answer: <strong class="text-primary">${item.correctAnswer}</strong>` : ''}
          </div>
          <div class="review-explanation">
            <strong>💡 Explanation:</strong> ${item.explanation}
          </div>
        `;
        listContainer.appendChild(card);
      });
    }

    document.getElementById('review-modal').classList.add('open');

  } catch (err) {
    alert("Error loading answer sheet: " + err.message);
  }
}

function closeReviewModal() {
  document.getElementById('review-modal').classList.remove('open');
}

function closeReviewModalOnOutside(e) {
  if (e.target.id === 'review-modal') closeReviewModal();
}

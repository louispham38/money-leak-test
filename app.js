const LEAKS = [
  { icon: "📱", title: 'Subscription "Zombie"', desc: "Netflix, Spotify, gym, app... bạn trả tiền hàng tháng nhưng <strong>không dùng</strong>. Trung bình mỗi người mất 800K–2tr/tháng vào subscriptions không nhớ.", pct: 91, key: "subscription" },
  { icon: "🛒", title: "Mua Sắm Cảm Xúc", desc: 'Shopee flash sale, TikTok Shop, "mua cho vui"... Mỗi lần nhỏ, cộng lại <strong>3–7 triệu/tháng</strong> mà không hay biết.', pct: 84, key: "shopping" },
  { icon: "💳", title: "Lãi Vay & Thẻ Tín Dụng", desc: "Trả mức tối thiểu, lãi kép nuốt chửng tiết kiệm. <strong>Lãi thẻ tín dụng có thể lên 36%/năm</strong> — bạn có biết mình đang trả bao nhiêu không?", pct: 67, key: "debt" },
  { icon: "🍜", title: "Chi Tiêu Hàng Ngày Không Kiểm Soát", desc: 'Trà sữa, grab, cà phê, ăn ngoài... Không có ngân sách = tiền "chảy" không biết đi đâu. <strong>Mỗi ngày 100K = 3tr/tháng</strong>.', pct: 78, key: "daily" },
  { icon: "📉", title: 'Đầu Tư "Mù Quáng"', desc: 'Crypto, hụi họ, chứng khoán không hiểu gì... Thua lỗ mà không nhận ra đó là "rò rỉ" — vì nghĩ sẽ "lấy lại sau".', pct: 55, key: "investment" },
  { icon: "👥", title: 'Chi Phí Xã Giao & "Thể Diện"', desc: 'Đám cưới, nhậu, quà tặng, du lịch chung... Áp lực xã hội khiến bạn chi nhiều hơn mức mình có. <strong>Lỗ hổng "vô hình" nhất.</strong>', pct: 72, key: "social" },
];

const TESTIMONIALS = [
  { featured: true, quote: '"Mình tưởng mình không tiêu hoang, nhưng bài test chỉ ra mình đang trả 1.8tr/tháng cho 7 subscription không dùng tới. Huỷ hết, tháng sau tiết kiệm được thêm 2tr luôn."', name: "Linh Nguyễn", role: "Marketing Executive, Hà Nội", initial: "L" },
  { quote: '"Shock nhất là phát hiện ra mình đang trả lãi thẻ tín dụng 2.8tr/tháng trong khi không biết. Bài test cho mình plan trả nợ cụ thể theo thứ tự ưu tiên. 3 tháng sau đã thoát lãi."', name: "Tuấn Minh", role: "Freelancer, TP.HCM", initial: "T" },
  { quote: '"Bài test rất ngắn mà insight lại sâu. Mình biết mình mua sắm cảm xúc nhưng không biết mình mua nhiều đến vậy. Giờ áp dụng rule 24h trước khi mua, tiết kiệm thêm 4tr/tháng."', name: "Hương Trần", role: "Giáo viên, Đà Nẵng", initial: "H" },
];

const FAQ = [
  { q: "Bài test này có mất phí không?", a: "<strong>Hoàn toàn miễn phí 100%.</strong> Không cần thẻ tín dụng, không cần tài khoản. Bạn chỉ cần làm bài test và nhận kết quả ngay lập tức — không có bước nào yêu cầu thanh toán.", open: true },
  { q: "Bài test mất bao lâu?", a: "<strong>Khoảng 3–5 phút.</strong> Chỉ có 13 câu hỏi ngắn, lựa chọn nhanh. Bạn không cần chuẩn bị hay tra cứu gì — chỉ cần trả lời theo cảm nhận thực tế của mình." },
  { q: "Kết quả có chính xác không?", a: "Kết quả chính xác đến mức bạn trả lời thành thật. Bài test được thiết kế dựa trên <strong>các mẫu chi tiêu phổ biến</strong> của người Việt và tâm lý học hành vi tài chính. Trả lời càng thật → insight càng có giá trị." },
  { q: "Tôi có cần nhập thông tin cá nhân không?", a: "Không cần nhập tên hay số điện thoại để làm bài test. Nếu bạn muốn nhận kết quả chi tiết qua email, bạn có thể nhập — nhưng <strong>hoàn toàn tự nguyện</strong>. Chúng tôi không spam." },
  { q: "Sau khi làm xong tôi sẽ nhận được gì?", a: "Bạn sẽ nhận ngay: <strong>(1)</strong> Điểm \"rò rỉ tài chính\" trên thang 0–100, <strong>(2)</strong> Top 2–3 lỗ hổng lớn nhất theo thứ tự ưu tiên, <strong>(3)</strong> Plan hành động 3 bước cụ thể để bắt đầu khóa rò rỉ từ tuần này." },
];

const QUESTIONS = [
  {
    text: "Mỗi cuối tháng, bạn có biết tiền đã tiêu vào đâu không?",
    options: [
      { label: "Hoàn toàn không biết", scores: { daily: 9 } },
      { label: "Hiếm khi biết", scores: { daily: 2 } },
      { label: "Biết một chút", scores: { daily: 4 } },
      { label: "Hầu như biết", scores: { daily: 6 } },
      { label: "Biết rất rõ từng thứ", scores: {} },
    ],
  },
  {
    text: "Bạn có bao nhiêu dịch vụ online/offline (app, gym, streaming...) đang trả nhưng ít dùng?",
    options: [
      { label: "Không có", scores: {} },
      { label: "1–2 cái", scores: { subscription: 3 } },
      { label: "3–5 cái", scores: { subscription: 5 } },
      { label: "Hơn 5 cái", scores: { subscription: 8 } },
    ],
  },
  {
    text: "Bạn phản ứng như thế nào với các chương trình Flash sale / Khuyến mãi trên internet?",
    options: [
      { label: "Bỏ qua", scores: {} },
      { label: "Xem nhưng ít mua", scores: { shopping: 2 } },
      { label: "Mua nếu thích", scores: { shopping: 5 } },
      { label: "Mua ngay, không suy nghĩ nhiều", scores: { shopping: 8 } },
    ],
  },
  {
    text: "Bạn có sử dụng thẻ tín dụng không?",
    options: [
      { label: "Không dùng thẻ TD", scores: {} },
      { label: "Trả full mỗi tháng", scores: {} },
      { label: "Trả một phần", scores: { debt: 5 } },
      { label: "Chỉ trả tối thiểu", scores: { debt: 9 } },
    ],
  },
  {
    text: "Chi phí tiêu vặt của bạn: trà sữa, cà phê, ăn ngoài... mỗi tháng bao nhiêu?",
    options: [
      { label: "Dưới 500K", scores: {} },
      { label: "500K – 1.5tr", scores: { daily: 3 } },
      { label: "1.5tr – 3tr", scores: { daily: 5 } },
      { label: "Trên 3tr", scores: { daily: 8 } },
    ],
  },
  {
    text: "Bạn có đang đầu tư tài chính như BĐS, Crypto, chứng khoán... không?",
    options: [
      { label: "Không", scores: {} },
      { label: "Có, nhưng số tiền nhỏ", scores: { investment: 3 } },
      { label: "Có, đáng kể", scores: { investment: 6 } },
      { label: "Có, và đã thua lỗ", scores: { investment: 9 } },
    ],
  },
  {
    text: "Bạn có đang hiểu rõ những khoản đầu tư của bạn không?",
    options: [
      { label: "Không", scores: { investment: 9 } },
      { label: "Chỉ nghe theo bạn bè, không tìm hiểu nhiều", scores: { investment: 6 } },
      { label: "Có đầu tư học tập tìm hiểu", scores: { investment: 3 } },
      { label: "Có nhiều kinh nghiệm và kiến thức", scores: {} },
    ],
  },
  {
    text: "Áp lực chi tiêu vì đám cưới, nhậu, quà tặng, du lịch nhóm...",
    options: [
      { label: "Không ảnh hưởng", scores: {} },
      { label: "Đôi khi", scores: { social: 3 } },
      { label: "Thường xuyên", scores: { social: 6 } },
      { label: "Rất áp lực, chi quá khả năng", scores: { social: 9 } },
    ],
  },
  {
    text: "Bạn có ngân sách chi tiêu hàng tháng không?",
    options: [
      { label: "Có, và tuân thủ tốt", scores: {} },
      { label: "Có, nhưng hay vượt", scores: { daily: 2, shopping: 2 } },
      { label: "Có nhưng không theo dõi", scores: { daily: 4 } },
      { label: "Không có", scores: { daily: 5, shopping: 3 } },
    ],
  },
  {
    text: "Khi buồn/stress, bạn có mua sắm để \"xả\" không?",
    options: [
      { label: "Không bao giờ", scores: {} },
      { label: "Hiếm khi", scores: { shopping: 2 } },
      { label: "Thỉnh thoảng", scores: { shopping: 5 } },
      { label: "Thường xuyên", scores: { shopping: 8 } },
    ],
  },
  {
    text: "Bạn biết chính xác tổng lãi vay / thẻ TD đang trả mỗi tháng không?",
    options: [
      { label: "Biết rõ", scores: {} },
      { label: "Biết ước lượng", scores: { debt: 2 } },
      { label: "Không chắc", scores: { debt: 5 } },
      { label: "Không biết", scores: { debt: 8 } },
    ],
  },
  {
    text: "So với thu nhập, mức tiết kiệm của bạn...",
    options: [
      { label: "Ổn định, có kế hoạch", scores: {} },
      { label: "Tiết kiệm được nhưng ít", scores: { daily: 2 } },
      { label: "Gần như không tiết kiệm", scores: { daily: 4, shopping: 2 } },
      { label: "Thường thâm hụt cuối tháng", scores: { daily: 5, debt: 3, shopping: 2 } },
    ],
  },
  {
    text: "Nếu mất 5 triệu không rõ lý do, bạn sẽ...",
    options: [
      { label: "Biết ngay đi đâu", scores: {} },
      { label: "Tìm ra trong vài ngày", scores: { daily: 2 } },
      { label: "Khó xác định", scores: { daily: 5, subscription: 2 } },
      { label: "Chẳng biết luôn", scores: { daily: 6, subscription: 3, shopping: 2 } },
    ],
  },
];

const LEAK_LABELS = {
  subscription: "Subscription không dùng",
  shopping: "Mua sắm cảm xúc",
  debt: "Lãi vay & thẻ tín dụng",
  daily: "Chi tiêu hàng ngày",
  investment: 'Đầu tư "mù quáng"',
  social: "Chi phí xã giao",
};

const PLANS = {
  subscription: ["Liệt kê tất cả subscription đang trả — huỷ ngay những cái không dùng trong 30 ngày qua.", "Đặt nhắc lịch review subscription mỗi quý.", "Chuyển sang gói free hoặc chia sẻ family plan nếu cần."],
  shopping: ["Áp dụng rule 24h: mọi mua online trên 200K phải chờ 24h.", "Xoá app Shopee/TikTok Shop khỏi màn hình chính điện thoại.", "Đặt ngân sách \"mua vui\" cố định 500K/tháng — hết là dừng."],
  debt: ["Liệt kê tất cả khoản nợ + lãi suất — ưu tiên trả khoản lãi cao nhất trước.", "Ngừng trả tối thiểu — trả nhiều hơn mức tối thiểu ít nhất 20%.", "Cân nhắc chuyển nợ sang khoản lãi thấp hơn nếu có."],
  daily: ["Track chi tiêu hàng ngày 7 ngày — chỉ ghi, chưa cần cắt.", "Đặt giới hạn grab/ăn ngoài: tối đa 3 lần/tuần.", "Nấu ăn batch cuối tuần — tiết kiệm 30–50% chi phí ăn uống."],
  investment: ["Dừng đầu tư vào thứ không hiểu — học trước, bỏ tiền sau.", "Chỉ đầu tư số tiền chấp nhận mất 100%.", "Tập trung quỹ khẩn cấp 3–6 tháng trước khi đầu tư rủi ro."],
  social: ["Đặt ngân sách \"xã giao\" cố định mỗi tháng.", "Học nói \"không\" lịch sự với lời mời vượt khả năng.", "Đề xuất gặp mặt ít tốn kém hơn thay vì từ chối hoàn toàn."],
};

let currentQuestion = 0;
const leakScores = { subscription: 0, shopping: 0, debt: 0, daily: 0, investment: 0, social: 0 };

function renderStatic() {
  document.getElementById("leak-grid").innerHTML = LEAKS.map(
    (l) => `
    <article class="leak-card-item">
      <span class="leak-icon">${l.icon}</span>
      <h3>${l.title}</h3>
      <p>${l.desc}</p>
      <div class="popularity">
        <span>Mức độ phổ biến</span>
        <div class="bar"><div class="bar-fill" style="width: ${l.pct}%"></div></div>
        <span class="pct">${l.pct}%</span>
      </div>
    </article>`
  ).join("");

  document.getElementById("testimonial-grid").innerHTML = TESTIMONIALS.map(
    (t) => `
    <article class="testimonial${t.featured ? " featured" : ""}">
      <div class="stars">★★★★★</div>
      <blockquote>${t.quote}</blockquote>
      <div class="author">
        <span class="avatar">${t.initial}</span>
        <div><strong>${t.name}</strong><span>${t.role}</span></div>
      </div>
      ${t.featured ? '<span class="badge-featured">Nổi bật nhất</span>' : ""}
    </article>`
  ).join("");

  document.getElementById("faq-list").innerHTML = FAQ.map(
    (f) => `
    <details class="faq-item"${f.open ? " open" : ""}>
      <summary>${f.q}</summary>
      <p>${f.a}</p>
    </details>`
  ).join("");
}

function getLevel(score) {
  if (score <= 25) return { label: "Thấp", color: "var(--accent)" };
  if (score <= 50) return { label: "Trung bình", color: "var(--accent)" };
  if (score <= 75) return { label: "Cao", color: "var(--warning)" };
  return { label: "Rất cao", color: "var(--danger)" };
}

function openModal() {
  const modal = document.getElementById("test-modal");
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  resetQuiz();
}

function closeModal() {
  const modal = document.getElementById("test-modal");
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function resetQuiz() {
  currentQuestion = 0;
  Object.keys(leakScores).forEach((k) => { leakScores[k] = 0; });
  document.getElementById("quiz-view").hidden = false;
  document.getElementById("results-view").hidden = true;
  renderQuestion();
}

function renderQuestion() {
  const q = QUESTIONS[currentQuestion];
  const total = QUESTIONS.length;
  const pct = ((currentQuestion + 1) / total) * 100;

  const bar = document.getElementById("progress-bar");
  bar.style.setProperty("--progress", `${pct}%`);
  document.getElementById("progress-text").textContent = `Câu ${currentQuestion + 1} / ${total}`;
  document.getElementById("quiz-question").textContent = q.text;

  const optionsEl = document.getElementById("quiz-options");
  optionsEl.innerHTML = q.options
    .map(
      (opt, i) =>
        `<button type="button" class="quiz-option" data-index="${i}">${opt.label}</button>`
    )
    .join("");

  optionsEl.querySelectorAll(".quiz-option").forEach((btn) => {
    btn.addEventListener("click", () => selectAnswer(parseInt(btn.dataset.index, 10)));
  });
}

function selectAnswer(index) {
  const scores = QUESTIONS[currentQuestion].options[index].scores;
  Object.entries(scores).forEach(([key, val]) => {
    leakScores[key] = (leakScores[key] || 0) + val;
  });

  currentQuestion++;
  if (currentQuestion < QUESTIONS.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  const maxPossible = 114;
  const totalRaw = Object.values(leakScores).reduce((a, b) => a + b, 0);
  const score = Math.min(100, Math.round((totalRaw / maxPossible) * 100));
  const level = getLevel(score);

  const sorted = Object.entries(leakScores)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (sorted.length === 0) {
    sorted.push(["daily", 1]);
  }

  document.getElementById("quiz-view").hidden = true;
  document.getElementById("results-view").hidden = false;

  document.getElementById("result-score").textContent = score;
  const levelEl = document.getElementById("result-level");
  levelEl.textContent = `Mức rò rỉ: ${level.label}`;
  levelEl.style.color = level.color;

  document.getElementById("result-meter-fill").style.width = `${score}%`;

  document.getElementById("result-leaks").innerHTML = sorted
    .map(([key], i) => `<li><strong>#${i + 1}</strong> ${LEAK_LABELS[key]}</li>`)
    .join("");

  const topKey = sorted[0][0];
  const plan = PLANS[topKey] || PLANS.daily;
  document.getElementById("result-plan").innerHTML = plan
    .map((step) => `<li>${step}</li>`)
    .join("");

  document.getElementById("score-status").textContent = level.label;
  document.getElementById("preview-score").textContent = score;
  document.getElementById("preview-meter").style.width = `${score}%`;
  document.getElementById("score-status").style.color = level.color;
}

function initNav() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderStatic();
  initNav();

  document.querySelectorAll(".open-test").forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  document.getElementById("close-test").addEventListener("click", closeModal);
  document.getElementById("retake-test").addEventListener("click", resetQuiz);

  document.getElementById("test-modal").addEventListener("click", (e) => {
    if (e.target.id === "test-modal") closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
});

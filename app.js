const LEAKS = [
  { icon: "💰", title: "Chi phí cố định & dòng tiền", desc: "Thu-Chi âm, thẻ tín dụng trả tối thiểu, chi phí tăng dần... Những \"lỗ hổng nền\" khiến bạn không bao giờ thoát vòng xoáy thiếu tiền.", pct: 85, key: "cost" },
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
  { q: "Bài test mất bao lâu?", a: "<strong>Khoảng 5–7 phút.</strong> Chỉ có 20 câu hỏi ngắn, lựa chọn nhanh. Bạn không cần chuẩn bị hay tra cứu gì — chỉ cần trả lời theo cảm nhận thực tế của mình." },
  { q: "Kết quả có chính xác không?", a: "Kết quả chính xác đến mức bạn trả lời thành thật. Bài test được thiết kế dựa trên <strong>các mẫu chi tiêu phổ biến</strong> của người Việt và tâm lý học hành vi tài chính. Trả lời càng thật → insight càng có giá trị." },
  { q: "Tôi có cần đăng ký tài khoản không?", a: "Bạn có thể làm bài test miễn phí ngay. <strong>Đăng ký tài khoản</strong> (email, họ tên, SĐT) để lưu kết quả, xem plan hành động đầy đủ và truy cập khu vực cá nhân." },
  { q: "Sau khi đăng ký tôi sẽ nhận được gì?", a: "Kết quả bài test, plan hành động theo mức rò rỉ, mục tiêu tài chính, giới thiệu app Thu-Chi, nhóm Zalo — và sớm có workshop, coaching 1-1." },
];

let lastReadiness = null;

const LEAK_LABELS = {
  cost: "Chi phí cố định & dòng tiền",
  subscription: "Subscription không dùng",
  shopping: "Mua sắm cảm xúc",
  debt: "Lãi vay & thẻ tín dụng",
  daily: "Chi tiêu hàng ngày",
  investment: 'Đầu tư "mù quáng"',
  social: "Chi phí xã giao",
};

const PLAN_TITLES = {
  low: "Bí quyết duy trì phong độ",
  medium: "Plan cải thiện trong tháng tới",
  high: "Plan hành động khẩn cấp",
  veryHigh: "Plan cứu nguy tài chính — cần làm NGAY",
};

const PLAN_INTROS = {
  low: "Bạn đang quản lý tài chính khá tốt. Vài gợi ý dưới đây giúp bạn giữ vững và tối ưu thêm:",
  medium: "Bạn có vài lỗ hổng đang rò tiền. Làm theo 3 bước dưới đây trong tháng tới để cải thiện:",
  high: "Tình hình đáng lo — tiền đang rò ra với tốc độ cao. 3 bước dưới đây cần thực hiện trong tuần này:",
  veryHigh: "BÁO ĐỘNG ĐỎ — tài chính của bạn đang ở mức nguy hiểm. Thực hiện 3 bước dưới đây NGAY HÔM NAY:",
};

const PLANS = {
  low: {
    daily: [
      "Tiếp tục track chi tiêu 1 lần/tuần — không cần app phức tạp, sổ tay/Excel là đủ.",
      "Thử thách 1 tháng \"không cà phê mua ngoài\" để kiểm tra mức độ kỷ luật của mình.",
      "Tự thưởng nhỏ (≤200K) khi đạt mục tiêu tiết kiệm tuần — tạo động lực dài hạn.",
    ],
    subscription: [
      "Review tất cả subscription mỗi quý — huỷ cái không dùng tới.",
      "Bật thông báo trước khi auto-renew để không bị trừ tiền bất ngờ.",
      "Cân nhắc share family plan với người thân để tiết kiệm 30–50%.",
    ],
    shopping: [
      "Giữ thói quen \"suy nghĩ trước khi mua\" — bạn đang làm tốt.",
      "Mỗi tháng review lại danh sách đã mua — đánh giá cái nào thực sự dùng.",
      "Đặt ngân sách \"mua vui\" cố định để giữ kỷ luật lâu dài.",
    ],
    debt: [
      "Tiếp tục trả full thẻ tín dụng đúng hạn — KHÔNG bao giờ để qua tháng.",
      "Đặt auto-pay full balance để không bao giờ bị lỡ.",
      "Theo dõi credit score 6 tháng/lần — duy trì điểm tốt.",
    ],
    investment: [
      "Tiếp tục học và đầu tư có kế hoạch — bạn đang đi đúng hướng.",
      "Diversify danh mục: không bỏ trứng vào 1 giỏ.",
      "Review danh mục mỗi quý — rebalance nếu cần.",
    ],
    social: [
      "Tiếp tục giữ ranh giới chi tiêu cá nhân — đừng để áp lực xã hội phá vỡ.",
      "Lập ngân sách \"xã giao\" mỗi tháng để biết mình có gì để chi.",
      "Tạo nhóm bạn cùng triết lý tài chính — củng cố thói quen tốt.",
    ],
    cost: [
      "Kiểm tra số dư Thu-Chi mỗi tháng — duy trì dương ít nhất 10% thu nhập.",
      "Review chi phí cố định 1 lần/quý — cắt khoản không cần thiết.",
      "Trả full thẻ tín dụng đúng hạn — tránh lãi phạt.",
    ],
  },
  medium: {
    daily: [
      "Track chi tiêu hàng ngày 30 ngày — phân loại 3 nhóm: thiết yếu / linh hoạt / lãng phí.",
      "Cắt 20% nhóm \"lãng phí\" — thường là trà sữa, ăn ngoài cuối tuần.",
      "Setup auto-save 10% lương ngay khi vừa nhận — \"trả cho mình trước\".",
    ],
    subscription: [
      "Liệt kê tất cả subscription đang trả — huỷ ngay cái không dùng trong 30 ngày qua.",
      "Đặt nhắc lịch review subscription mỗi quý.",
      "Chuyển sang gói free / family plan / downgrade gói rẻ hơn nếu được.",
    ],
    shopping: [
      "Áp dụng rule 24h: mọi mua online > 200K phải chờ 24h mới quyết định.",
      "Tạo \"wishlist\" — viết ra muốn mua, đợi 1 tuần, nếu vẫn muốn thì mua.",
      "Đặt ngân sách \"mua vui\" cố định 500K/tháng — hết là dừng.",
    ],
    debt: [
      "Liệt kê tất cả khoản nợ — biết chính xác lãi suất và số dư từng cái.",
      "Ưu tiên trả khoản lãi cao nhất trước (avalanche method).",
      "Trả nhiều hơn mức tối thiểu ít nhất 20% mỗi tháng.",
    ],
    investment: [
      "Đọc 1 sách cơ bản về đầu tư trong 30 ngày (\"Cha giàu cha nghèo\", \"Intelligent Investor\"...).",
      "Chỉ đầu tư số tiền dư sau khi đã có quỹ khẩn cấp 3 tháng chi phí.",
      "Bắt đầu từ index fund / ETF — đơn giản và rủi ro thấp.",
    ],
    social: [
      "Đặt ngân sách \"xã giao\" cố định (10–15% thu nhập) — không vượt quá.",
      "Học nói \"không\" lịch sự với lời mời vượt khả năng.",
      "Đề xuất hoạt động ít tốn kém: cà phê thay nhậu, BBQ nhà thay nhà hàng.",
    ],
    cost: [
      "Lập bảng Thu-Chi 3 tháng gần nhất — xác định tháng nào âm và vì sao.",
      "Giảm 10% chi phí cố định: hội viên, gói data, bảo hiểm trùng lặp.",
      "Chuyển từ trả tối thiểu thẻ TD sang trả ít nhất 50% dư nợ mỗi tháng.",
    ],
  },
  high: {
    daily: [
      "Track CHI TIẾT 7 ngày liền — biết chính xác mỗi 100K đi đâu mỗi ngày.",
      "Đặt giới hạn cứng: grab/ăn ngoài tối đa 3 lần/tuần, trà sữa tối đa 2 ly/tuần.",
      "Nấu ăn batch cuối tuần — tiết kiệm 30–50% chi phí ăn uống.",
    ],
    subscription: [
      "Audit toàn bộ: mở bank statement 3 tháng gần nhất, tìm MỌI giao dịch định kỳ.",
      "Huỷ hết những gì không dùng > 2 lần/tuần — không tiếc.",
      "Chuyển sang gói free hoặc downgrade — đa số dịch vụ có gói rẻ hơn 50–70%.",
    ],
    shopping: [
      "Xoá app Shopee / TikTok Shop khỏi màn hình chính (hoặc xoá hẳn 30 ngày).",
      "Unfollow tài khoản KOL / livestream khiến bạn muốn mua liên tục.",
      "Rule 72h cho mọi món > 500K — nếu sau 72h vẫn muốn thì mới mua.",
    ],
    debt: [
      "STOP dùng thẻ tín dụng ngay — chuyển sang chỉ dùng tiền mặt / debit trong 30 ngày.",
      "Lập kế hoạch trả hết nợ trong 6–12 tháng — chia ra mỗi tháng phải trả X đồng.",
      "Cân nhắc chuyển nợ sang khoản lãi thấp hơn (vay ngân hàng, mượn người thân).",
    ],
    investment: [
      "NGỪNG đầu tư vào thứ không hiểu — không \"theo trend\" của bạn bè.",
      "Rút bớt khỏi tài sản rủi ro cao — để lại tối đa 20% tài sản cho đầu cơ.",
      "Học 3 tháng trước khi bỏ thêm tiền — Coursera, Udemy, sách miễn phí thư viện.",
    ],
    social: [
      "Giảm tần suất tụ tập tốn kém — từ chối 30% lời mời, ưu tiên gặp ít người thân thiết.",
      "Unfollow / tắt thông báo tài khoản gây cảm giác \"phải so kè\".",
      "Lập danh sách quà cố định cho cả năm — không mua quà bột phát.",
    ],
    cost: [
      "Khóa chi phí cố định: huỷ mọi subscription không thiết yếu trong 7 ngày.",
      "Ngừng cho vay không lãi suất rõ ràng — thu hồi nợ cũ trước khi chi thêm.",
      "Đặt mục tiêu Thu-Chi dương trong 60 ngày — cắt 20% chi tiêu biến động.",
    ],
  },
  veryHigh: {
    daily: [
      "Cài app track chi tiêu (Money Lover, Misa, Sổ Thu Chi MISA...) — track TỪNG GIAO DỊCH trong 30 ngày tới.",
      "Cắt cứng: KHÔNG ăn ngoài 21/30 ngày, KHÔNG grab nếu < 3km — đi bộ/xe đạp.",
      "Lập ngân sách zero-based: mỗi đồng thu vào phải có \"việc\" được giao trước khi tiêu.",
    ],
    subscription: [
      "HUỶ HẾT subscription trừ 1–2 cái thực sự cần (internet, điện thoại).",
      "Đợi 30 ngày — chỉ đăng ký lại nếu thực sự nhớ và cần dùng.",
      "KHÔNG đăng ký free trial nếu không lưu nhắc nhở huỷ ngay sau đó.",
    ],
    shopping: [
      "THỬ THÁCH 30 NGÀY KHÔNG MUA — chỉ chi cho thiết yếu (ăn, đi lại, hoá đơn).",
      "Xoá thẻ tín dụng / ví điện tử khỏi mọi app shopping — nhập thủ công nếu cần mua.",
      "Tìm hobby thay thế: thể thao, đọc sách, gặp bạn — để \"xả\" mà không tiêu tiền.",
    ],
    debt: [
      "KHẨN CẤP: ngừng vay mới, ngừng dùng thẻ tín dụng NGAY LẬP TỨC.",
      "Liên hệ ngân hàng xin restructure — kéo dài kỳ hạn hoặc đàm phán giảm lãi.",
      "Áp dụng \"snowball\": dồn toàn bộ thu nhập dư vào khoản nợ NHỎ NHẤT trước để tạo momentum.",
    ],
    investment: [
      "CẮT LỖ ngay những khoản đã mất — đừng \"gồng\" hi vọng lấy lại.",
      "Đưa toàn bộ vốn còn lại vào tài sản an toàn (gửi tiết kiệm) ít nhất 6 tháng.",
      "KHÔNG đầu tư lại cho đến khi đọc xong 3 sách về đầu tư và có quỹ khẩn cấp 6 tháng.",
    ],
    social: [
      "KHẨN CẤP: tạm dừng mọi chi xã giao không bắt buộc 3 tháng — chỉ chi cho người thân trực hệ.",
      "Nói thẳng với bạn bè thân: \"mình đang quản lại tài chính, giai đoạn này hạn chế tụ tập\".",
      "Tìm cộng đồng cùng mục tiêu tài chính — bao quanh bằng người tiết kiệm thay vì người chi tiêu nhiều.",
    ],
    cost: [
      "ĐÓNG BĂNG chi phí mới 30 ngày — chỉ chi ăn, đi lại, hoá đơn bắt buộc.",
      "Thu hồi toàn bộ tiền cho vay — không cho mượn thêm cho đến khi dương 3 tháng liên tiếp.",
      "Liên hệ NH đàm phán lãi / gói nợ — tránh trả tối thiểu vô thời hạn.",
    ],
  },
};

let currentQuestion = 0;
const leakScores = { cost: 0, subscription: 0, shopping: 0, debt: 0, daily: 0, investment: 0, social: 0, status: 0 };

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
  if (score <= 25) return { key: "low", label: "Thấp", color: "var(--accent)" };
  if (score <= 50) return { key: "medium", label: "Trung bình", color: "var(--accent)" };
  if (score <= 75) return { key: "high", label: "Cao", color: "var(--warm)" };
  return { key: "veryHigh", label: "Rất cao", color: "var(--danger)" };
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
  lastReadiness = null;
  Object.keys(leakScores).forEach((k) => { leakScores[k] = 0; });
  document.getElementById("quiz-view").hidden = false;
  document.getElementById("results-view").hidden = true;
  document.getElementById("auth-gate")?.setAttribute("hidden", "");
  document.getElementById("results-full")?.removeAttribute("hidden");
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
  const q = QUESTIONS[currentQuestion];
  const opt = q.options[index];
  Object.entries(opt.scores || {}).forEach(([key, val]) => {
    leakScores[key] = (leakScores[key] || 0) + val;
  });
  if (q.meta === "status" && opt.readiness) lastReadiness = opt.readiness;

  currentQuestion++;
  if (currentQuestion < QUESTIONS.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

function buildResultPayload() {
  const maxPossible = typeof SCORE_MAX_RAW !== "undefined" ? SCORE_MAX_RAW : 164;
  const scorable = Object.entries(leakScores).filter(([k]) => k !== "status");
  const totalRaw = scorable.reduce((a, [, v]) => a + v, 0);
  const score = Math.min(100, Math.round((totalRaw / maxPossible) * 100));
  const level = getLevel(score);

  let sorted = scorable
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  if (sorted.length === 0) sorted.push(["daily", 1]);

  const topKey = sorted[0][0];
  const planSet = PLANS[level.key] || PLANS.medium;
  const planSteps = planSet[topKey] || planSet.daily;

  return {
    score,
    level_key: level.key,
    level_label: level.label,
    level_color: level.color,
    top_leaks: sorted.map(([key]) => ({ key, label: LEAK_LABELS[key] })),
    plan_title: PLAN_TITLES[level.key],
    plan_intro: PLAN_INTROS[level.key],
    plan_steps: planSteps,
    leak_scores: { ...leakScores },
    readiness: lastReadiness,
  };
}

function renderResultUI(payload) {
  document.getElementById("result-score").textContent = payload.score;
  const levelEl = document.getElementById("result-level");
  levelEl.textContent = `Mức rò rỉ: ${payload.level_label}`;
  levelEl.style.color = payload.level_color;
  document.getElementById("result-meter-fill").style.width = `${payload.score}%`;
  document.getElementById("result-leaks").innerHTML = payload.top_leaks
    .map((l, i) => `<li><strong>#${i + 1}</strong> ${l.label}</li>`)
    .join("");
  document.querySelector(".result-plan").setAttribute("data-level", payload.level_key);
  document.getElementById("plan-title").textContent = payload.plan_title;
  document.getElementById("plan-intro").textContent = payload.plan_intro;
  document.getElementById("result-plan").innerHTML = payload.plan_steps
    .map((step) => `<li>${step}</li>`)
    .join("");
  document.getElementById("score-status").textContent = payload.level_label;
  document.getElementById("preview-score").textContent = payload.score;
  document.getElementById("preview-meter").style.width = `${payload.score}%`;
  document.getElementById("score-status").style.color = payload.level_color;
}

function showResults() {
  const payload = buildResultPayload();
  sessionStorage.setItem("mlt_pending_result", JSON.stringify(payload));

  document.getElementById("quiz-view").hidden = true;
  document.getElementById("results-view").hidden = false;

  renderResultUI(payload);

  const authGate = document.getElementById("auth-gate");
  const resultsFull = document.getElementById("results-full");

  if (typeof Auth !== "undefined" && Auth.isLoggedIn()) {
    authGate?.setAttribute("hidden", "");
    resultsFull?.removeAttribute("hidden");
    Auth.saveTestResult({
      score: payload.score,
      level_key: payload.level_key,
      level_label: payload.level_label,
      top_leaks: payload.top_leaks,
      plan_title: payload.plan_title,
      plan_intro: payload.plan_intro,
      plan_steps: payload.plan_steps,
      leak_scores: payload.leak_scores,
      readiness: payload.readiness,
    });
  } else {
    authGate?.removeAttribute("hidden");
    resultsFull?.setAttribute("hidden", "");
  }
}

function initAuthUI() {
  const authModal = document.getElementById("auth-modal");
  const authForm = document.getElementById("auth-form");
  const authTabs = document.querySelectorAll(".auth-tab");
  const panelRegister = document.getElementById("auth-panel-register");
  const panelForgot = document.getElementById("auth-panel-forgot");
  let authMode = "register";

  function showPanel(name) {
    const isForgot = name === "forgot";
    panelRegister.hidden = isForgot;
    panelForgot.hidden = !isForgot;
    authTabs.forEach((t) => {
      t.style.display = isForgot ? "none" : "";
    });
  }

  function openAuth(mode) {
    authMode = mode || "register";
    showPanel("register");
    authTabs.forEach((t) => t.classList.toggle("active", t.dataset.mode === authMode));
    document.getElementById("auth-submit").textContent =
      authMode === "register" ? "Đăng ký & xem kết quả" : "Đăng nhập";
    document.getElementById("auth-error").textContent = "";
    document.getElementById("forgot-success").textContent = "";
    document.getElementById("forgot-error").textContent = "";
    toggleAuthFields();
    authModal?.classList.add("active");
    authModal?.setAttribute("aria-hidden", "false");
  }

  function closeAuth() {
    authModal?.classList.remove("active");
    authModal?.setAttribute("aria-hidden", "true");
    showPanel("register");
  }

  document.querySelectorAll(".open-auth").forEach((btn) => {
    btn.addEventListener("click", () => openAuth(btn.dataset.mode || "register"));
  });
  document.getElementById("auth-close")?.addEventListener("click", closeAuth);
  authModal?.addEventListener("click", (e) => {
    if (e.target.id === "auth-modal") closeAuth();
  });

  if (new URLSearchParams(window.location.search).get("login") === "1") {
    openAuth("login");
  }

  function toggleAuthFields() {
    const isRegister = authMode === "register";
    document.getElementById("auth-name").closest("label").style.display = isRegister ? "" : "none";
    document.getElementById("auth-phone").closest("label").style.display = isRegister ? "" : "none";
    document.getElementById("auth-name").required = isRegister;
    document.getElementById("auth-phone").required = isRegister;
    document.getElementById("auth-forgot-wrap").hidden = isRegister;
    document.getElementById("auth-password").autocomplete = isRegister ? "new-password" : "current-password";
  }

  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      authMode = tab.dataset.mode;
      showPanel("register");
      authTabs.forEach((t) => t.classList.toggle("active", t === tab));
      document.getElementById("auth-submit").textContent =
        authMode === "register" ? "Đăng ký & xem kết quả" : "Đăng nhập";
      toggleAuthFields();
    });
  });
  toggleAuthFields();

  document.getElementById("btn-forgot-open")?.addEventListener("click", () => {
    const email = document.getElementById("auth-email").value;
    if (email) document.getElementById("forgot-email").value = email;
    showPanel("forgot");
  });

  document.querySelectorAll(".auth-back-login").forEach((btn) => {
    btn.addEventListener("click", () => {
      showPanel("register");
      authMode = "login";
      authTabs.forEach((t) => t.classList.toggle("active", t.dataset.mode === "login"));
      toggleAuthFields();
    });
  });

  document.getElementById("forgot-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errEl = document.getElementById("forgot-error");
    const okEl = document.getElementById("forgot-success");
    const btn = document.getElementById("forgot-submit");
    errEl.textContent = "";
    okEl.textContent = "";
    btn.disabled = true;
    btn.textContent = "Đang gửi...";
    try {
      const res = await Auth.forgotPassword({
        email: document.getElementById("forgot-email").value,
      });
      okEl.textContent = res.message || "Đã gửi email. Kiểm tra hộp thư (và spam).";
    } catch (err) {
      errEl.textContent = err.message || "Không gửi được email";
    } finally {
      btn.disabled = false;
      btn.textContent = "Gửi link đặt lại mật khẩu";
    }
  });

  authForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errEl = document.getElementById("auth-error");
    const submitBtn = document.getElementById("auth-submit");
    errEl.textContent = "";
    const body = {
      email: document.getElementById("auth-email").value,
      full_name: document.getElementById("auth-name").value,
      phone: document.getElementById("auth-phone").value,
      password: document.getElementById("auth-password").value,
    };
    submitBtn.disabled = true;
    submitBtn.textContent = "Đang xử lý...";
    try {
      if (authMode === "register") await Auth.register(body);
      else await Auth.login({ email: body.email, password: body.password });

      const pending = sessionStorage.getItem("mlt_pending_result");
      if (pending) {
        const p = JSON.parse(pending);
        await Auth.saveTestResult({
          score: p.score,
          level_key: p.level_key,
          level_label: p.level_label,
          top_leaks: p.top_leaks,
          plan_title: p.plan_title,
          plan_intro: p.plan_intro,
          plan_steps: p.plan_steps,
          leak_scores: p.leak_scores,
          readiness: p.readiness,
        });
      }
      closeAuth();
      window.location.href = "dashboard.html";
    } catch (err) {
      const msg = err.message || "Có lỗi xảy ra";
      if (authMode === "login" && msg.includes("không đúng")) {
        errEl.innerHTML =
          `${msg}<br><small>Nếu bạn đăng ký trước khi hệ thống sửa lỗi, hãy dùng <strong>Quên mật khẩu</strong> hoặc đăng ký lại bằng email khác.</small>`;
      } else {
        errEl.textContent =
          msg.includes("fetch") || msg.includes("Failed") || msg.includes("Load failed")
            ? "Không kết nối được máy chủ. Đợi 30–60 giây rồi thử lại."
            : msg;
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent =
        authMode === "register" ? "Đăng ký & xem kết quả" : "Đăng nhập";
    }
  });

  const user = typeof Auth !== "undefined" ? Auth.getUser() : null;
  const navAccount = document.getElementById("nav-account");
  const headerLogin = document.getElementById("header-login");
  if (user) {
    if (navAccount) {
      navAccount.innerHTML = `<a href="dashboard.html">Xin chào, ${user.full_name.split(" ")[0]}</a>`;
    }
    headerLogin?.setAttribute("hidden", "");
    const cta = document.querySelector(".header-cta");
    if (cta) {
      cta.setAttribute("href", "dashboard.html");
      cta.textContent = "Khu vực của tôi";
    }
  } else if (navAccount) {
    navAccount.innerHTML = `<button type="button" class="nav-link-btn open-auth" data-mode="login">Đăng nhập</button>`;
    navAccount.querySelector(".open-auth")?.addEventListener("click", () => openAuth("login"));
  }
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
  initAuthUI();

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

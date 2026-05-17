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
  { q: "Bài test mất bao lâu?", a: "<strong>Khoảng 3–5 phút.</strong> Chỉ có 15 câu hỏi ngắn, lựa chọn nhanh. Bạn không cần chuẩn bị hay tra cứu gì — chỉ cần trả lời theo cảm nhận thực tế của mình." },
  { q: "Kết quả có chính xác không?", a: "Kết quả chính xác đến mức bạn trả lời thành thật. Bài test được thiết kế dựa trên <strong>các mẫu chi tiêu phổ biến</strong> của người Việt và tâm lý học hành vi tài chính. Trả lời càng thật → insight càng có giá trị." },
  { q: "Tôi có cần nhập thông tin cá nhân không?", a: "Không cần nhập tên hay số điện thoại để làm bài test. Nếu bạn muốn nhận kết quả chi tiết qua email, bạn có thể nhập — nhưng <strong>hoàn toàn tự nguyện</strong>. Chúng tôi không spam." },
  { q: "Sau khi làm xong tôi sẽ nhận được gì?", a: "Bạn sẽ nhận ngay: <strong>(1)</strong> Điểm \"rò rỉ tài chính\" trên thang 0–100, <strong>(2)</strong> Top 2–3 lỗ hổng lớn nhất theo thứ tự ưu tiên, <strong>(3)</strong> Plan hành động 3 bước cụ thể để bắt đầu khóa rò rỉ từ tuần này." },
];

const QUESTIONS = [
  {
    text: "Mỗi cuối tháng, bạn có biết tiền đã tiêu vào đâu không?",
    options: [
      { label: "Hoàn toàn không biết", scores: { daily: 9 } },
      { label: "Hiếm khi biết", scores: { daily: 6 } },
      { label: "Biết một chút", scores: { daily: 4 } },
      { label: "Hầu như biết", scores: { daily: 2 } },
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
    text: "Khi đăng ký free trial (Netflix, Spotify, app...), bạn có nhớ huỷ trước khi bắt đầu tính phí không?",
    options: [
      { label: "Luôn nhớ huỷ đúng lúc", scores: {} },
      { label: "Đa số nhớ huỷ", scores: { subscription: 2 } },
      { label: "Thỉnh thoảng quên", scores: { subscription: 5 } },
      { label: "Hầu như luôn quên — và bị trừ tiền tự động", scores: { subscription: 8 } },
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
    text: "Khi bạn bè khoe du lịch / hàng hiệu / quán sang trên mạng xã hội, bạn có cảm thấy áp lực phải chi tương tự không?",
    options: [
      { label: "Không bao giờ", scores: {} },
      { label: "Đôi khi", scores: { social: 3 } },
      { label: "Khá thường xuyên", scores: { social: 6 } },
      { label: "Rất thường, và đã từng chi vượt khả năng", scores: { social: 9 } },
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
  },
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
  const maxPossible = 131;
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
  const planSet = PLANS[level.key] || PLANS.medium;
  const plan = planSet[topKey] || planSet.daily;
  document.querySelector(".result-plan").setAttribute("data-level", level.key);
  document.getElementById("plan-title").textContent = PLAN_TITLES[level.key];
  document.getElementById("plan-intro").textContent = PLAN_INTROS[level.key];
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

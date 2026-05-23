/** 16 câu chấm điểm rò rỉ (câu 1–16) */
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
    text: "Bạn có biết được số dư (Thu - Chi) trong tháng gần nhất của bạn là như thế nào?",
    options: [
      { label: "Âm", scores: { cost: 8 } },
      { label: "Bằng 0", scores: { cost: 4 } },
      { label: "Dương (nhưng chưa thoả mãn)", scores: { cost: 2 } },
      { label: "Dương (thoả mãn)", scores: {} },
    ],
  },
  {
    text: "Bạn có bao nhiêu khoản nợ đang cho người khác mượn (thân, bạn bè, ...) vay mượn?",
    options: [
      { label: "0", scores: { cost: 0 } },
      { label: "1 - 3 khoản", scores: { cost: 3 } },
      { label: "Trên 3 khoản", scores: { cost: 6 } },
      { label: "Nhiều không nhớ nổi", scores: { cost: 9 } },
    ],
  },
  {
    text: "Bạn có bao nhiêu dịch vụ online/offline (app, gym, streaming...) đang trả nhưng ít dùng?",
    options: [
      { label: "Không có", scores: {} },
      { label: "1-2 cái", scores: { subscription: 3 } },
      { label: "3-5 cái", scores: { subscription: 5 } },
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
    text: "Bạn phản ứng như thế nào với các chương trình Flash sale / Giảm giá / Khuyến mãi?",
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
      { label: "Trả một phần / Trả góp mỗi tháng", scores: { cost: 5 } },
      { label: "Chỉ trả tối thiểu", scores: { cost: 9 } },
    ],
  },
  {
    text: "Chi phí tiêu vặt của bạn: trà sữa, cà phê, ăn vặt... mỗi tháng bao nhiêu?",
    options: [
      { label: "Dưới 500K", scores: {} },
      { label: "500K - 1.5tr", scores: { daily: 3 } },
      { label: "1.5tr - 3tr", scores: { daily: 5 } },
      { label: "Trên 3tr", scores: { daily: 8 } },
    ],
  },
  {
    text: "Bạn có đang đầu tư tài chính như BĐS, Crypto, chứng khoán... không?",
    options: [
      { label: "Không", scores: {} },
      { label: "Có, nhưng số vốn nhỏ", scores: { investment: 3 } },
      { label: "Có, đáng kể", scores: { investment: 5 } },
      { label: "Có, và đã thua lỗ", scores: { investment: 9 } },
    ],
  },
  {
    text: "Bạn có đang hiểu rõ những khoản đầu tư của bạn không?",
    options: [
      { label: "Không", scores: { investment: 8 } },
      { label: "Chỉ nghe theo bạn bè, không tìm hiểu nhiều", scores: { investment: 5 } },
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
    text: "Khi bạn bè đi du lịch / hàng hiệu / nhà hàng sang trên mạng xã hội, bạn có cảm thấy áp lực phải chi tương tự?",
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
      { label: "Không có", scores: { daily: 5, shopping: 4 } },
    ],
  },
  {
    text: 'Khi buồn/stress, bạn có mua sắm để "xả" không?',
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
      { label: "Gần như không tiết kiệm", scores: { daily: 4, shopping: 3 } },
      { label: "Thường thâm hụt cuối tháng", scores: { daily: 5, debt: 3, shopping: 2 } },
    ],
  },
];

/** 3 câu chốt sau khi xem điểm rò rỉ — không tính vào % chính, dùng phân loại hành động */
const FOLLOWUP_QUESTIONS = [
  {
    text: "Bạn đang cảm thấy như thế nào về tình hình tài chính hiện tại của mình?",
    meta: "emotion",
    options: [
      { label: "Rất tự tin", scores: { cost: 9 } },
      { label: "Thoả mãn", scores: { cost: 6 } },
      { label: "Mông lung", scores: { cost: 2 } },
      { label: "Lo lắng", scores: { cost: 0 } },
    ],
  },
  {
    text: "Chi phí cuộc sống của bạn trong 3 tháng gần đây đang đi theo chiều hướng nào?",
    meta: "trend",
    options: [
      { label: "Tăng dần", scores: { cost: 8 } },
      { label: "Ổn định không tăng", scores: { cost: 4 } },
      { label: "Giảm", scores: { cost: 0 } },
    ],
  },
  {
    text: "Thời điểm này bạn có nghiêm túc với 1 kế hoạch tài chính mới cho bản thân mình không?",
    meta: "commitment",
    options: [
      { label: "Có, tôi muốn ngay", scores: {}, readiness: "eager", commitment: "serious" },
      { label: "Tôi cần cân nhắc trong tương lai", scores: {}, readiness: "considering", commitment: "light" },
      { label: "Không, tôi thấy mình ổn rồi", scores: {}, readiness: "comfortable", commitment: "light" },
    ],
  },
];

const SCORE_MAX_RAW = 127;

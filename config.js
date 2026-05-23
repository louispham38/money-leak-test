/** Cấu hình frontend — API tự chọn local vs production */
(function () {
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  const PROD_API = "https://money-leak-test-api.fly.dev";

  const PROD_THU_CHI = "https://thu-chi-web.onrender.com";

  window.MLT_CONFIG = {
    API_BASE: window.MLT_API_BASE || (isLocal ? "http://127.0.0.1:8000" : PROD_API),
    THU_CHI_URL: window.MLT_THU_CHI_URL || (isLocal ? "http://127.0.0.1:5173" : PROD_THU_CHI),
    ZALO_GROUP: "https://zalo.me/g/gkbvgqaoxnggs2p8euih",
  };
})();

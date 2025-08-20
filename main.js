import "./assets/scss/all.scss";
import "bootstrap/dist/js/bootstrap.min.js";

document.addEventListener("DOMContentLoaded", function () {
  // --- 通用的卡片滑鼠互動函式 ---
  function setupSlideHoverEffect(slides, activeIndex) {
    if (slides.length > 0) {
      slides[activeIndex].classList.add("active-slide");
    }

    slides.forEach((slide, index) => {
      slide.addEventListener("mouseenter", () => {
        slides.forEach((s) => s.classList.remove("hover-slide"));
        if (index !== activeIndex) {
          slides[activeIndex].classList.remove("active-slide");
        }
        slide.classList.add("hover-slide");
      });

      slide.addEventListener("mouseleave", () => {
        slide.classList.remove("hover-slide");
        slides[activeIndex].classList.add("active-slide");
      });
    });
  }

  // --- 1. 第一個輪播（推薦行程）的設定 ---
  const swiperRecommend = new Swiper(".recommend-card-group .swiper", {
    direction: "horizontal",
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 16,
    breakpoints: {
      992: {
        slidesPerView: 4,
      },
    },
    pagination: {
      el: ".recommend-card-group .swiper-pagination",
      clickable: true,
      type: "bullets",
    },
  });

  const recommendSlides = document.querySelectorAll(
    ".recommend-card-group .swiper-slide"
  );
  let recommendActiveIndex = 0;
  setupSlideHoverEffect(recommendSlides, recommendActiveIndex);

  // --- 2. 第二個輪播（靈感地圖）的設定 ---
  const swiperMap = new Swiper(".tab-content .swiper", {
    direction: "horizontal",
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 16,
    breakpoints: {
      992: {
        spaceBetween: 24,
      },
    },
    pagination: {
      el: ".tab-content .map-pagination",
      clickable: true,
    },
  });

  const mapSlides = document.querySelectorAll("#pills-all .swiper-slide");
  let mapActiveIndex = 0;
  setupSlideHoverEffect(mapSlides, mapActiveIndex);

  // --- 3. 第三個輪播（靈感地圖）的設定 ---
  const swiperTravel = new Swiper(".travel-card-group .swiper", {
    direction: "horizontal",
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 24,
    navigation: {
      nextEl: ".travel-custom-next",
      prevEl: ".travel-custom-prev",
    },
  });

  const travelSlides = document.querySelectorAll(
    ".travel-card-group .swiper-slide"
  );
  let travelActiveIndex = 0;
  setupSlideHoverEffect(travelSlides, travelActiveIndex);

  // const slides = document.querySelectorAll(".travel-card-group .swiper-slide");

  // slides.forEach((slide, index) => {
  //   slide.addEventListener("mouseenter", () => {
  //     slide.style.zIndex = 10;

  //     // 左右 slide 向兩邊推開
  //     if (slides[index - 1])
  //       slides[index - 1].style.transform = "translateX(-20px)";
  //     if (slides[index + 1])
  //       slides[index + 1].style.transform = "translateX(20px)";
  //   });

  //   slide.addEventListener("mouseleave", () => {
  //     slide.style.zIndex = "";
  //     slides.forEach((s) => (s.style.transform = "")); // 還原位置
  //   });
  // });

  // --- 4. 第四個輪播（地點圖片輪播）的設定 ---
  // 這部分是修正的重點
  let swiperLocation = null;

  function initSwiperLocation() {
    if (window.innerWidth < 768 && swiperLocation === null) {
      // 當螢幕寬度小於 768px 且 Swiper 尚未初始化時，才啟用
      swiperLocation = new Swiper(".location-swiper", {
        spaceBetween: 10,
        pagination: {
          el: ".location-swiper .swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            grid: {
              rows: 1,
            },
          },
        },
      });
    } else if (window.innerWidth >= 768 && swiperLocation !== null) {
      // 當螢幕寬度大於或等於 768px 且 Swiper 已初始化時，則停用
      swiperLocation.destroy(true, true);
      swiperLocation = null;
    }
  }

  // 在 DOM 載入後和視窗大小改變時都呼叫這個函式
  document.addEventListener("DOMContentLoaded", initSwiperLocation);
  window.addEventListener("resize", initSwiperLocation);

  document.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 0) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
});
// 密碼眼睛切換
document.querySelectorAll(".password-input").forEach((input) => {
  const eye = input.parentElement.querySelector(".password-eye");
  input.addEventListener("input", () => {
    eye.classList.toggle("d-none", !input.value);
  });
  eye.addEventListener("click", () => {
    const type = input.type === "password" ? "text" : "password";
    input.type = type;
    eye.querySelector("i").classList.toggle("bi-eye");
    eye.querySelector("i").classList.toggle("bi-eye-slash");
  });
});

// 登入/註冊表單通用
document.querySelectorAll(".login-form form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.querySelector("input[type='email']").value;
    const password = form.querySelector("input[type='password']").value;
    if (!email || !password) return;

    document.querySelector(".navbar-not-login").classList.add("d-none");
    document.querySelector(".navbar-login").classList.remove("d-none");

    const modalEl = form.closest(".modal");
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
  });
});

// 登出
document.querySelector(".btn-logout").addEventListener("click", () => {
  const offcanvasEl = document.getElementById("offcanvasLogin");
  bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl).hide();

  document.querySelector(".navbar-login").classList.add("d-none");
  document.querySelector(".navbar-not-login").classList.remove("d-none");
});

// 在 DOM 內容完全載入後才執行
document.addEventListener("DOMContentLoaded", () => {
  // 取得當前頁面的 URL 路徑，並轉為小寫以便判斷
  const path = window.location.pathname.toLowerCase();

  // 取得登入和未登入狀態的導覽列元素
  const loginNavbar = document.querySelector(".navbar-login");
  const notLoginNavbar = document.querySelector(".navbar-not-login");

  // 如果這兩個元素不存在，就直接結束
  if (!loginNavbar || !notLoginNavbar) {
    return;
  }

  // 判斷是否為使用者頁面
  if (path.includes("user.html")) {
    // 如果是，顯示登入狀態的導覽列，並隱藏未登入的
    loginNavbar.classList.remove("d-none");
    notLoginNavbar.classList.add("d-none");
  } else {
    // 如果不是，顯示未登入狀態的導覽列，並隱藏登入的
    notLoginNavbar.classList.remove("d-none");
    loginNavbar.classList.add("d-none");
  }
});

//數字
// 在 DOM 內容完全載入後才執行程式碼，避免找不到元素
document.addEventListener("DOMContentLoaded", () => {
  // 1. 選取所有需要的 HTML 元素
  const minusBtn = document.getElementById("button-minus");
  const plusBtn = document.getElementById("button-plus");
  const quantityInput = document.getElementById("quantity-input");

  // 2. 為「減號」按鈕添加點擊事件監聽器
  minusBtn.addEventListener("click", () => {
    // 獲取當前輸入框的值，並轉換為數字
    let currentValue = parseInt(quantityInput.value);

    // 檢查數字是否大於 1，才執行減法
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  // 3. 為「加號」按鈕添加點擊事件監聽器
  plusBtn.addEventListener("click", () => {
    // 獲取當前輸入框的值，並轉換為數字
    let currentValue = parseInt(quantityInput.value);

    // 直接執行加法，不設上限
    quantityInput.value = currentValue + 1;
  });
});

//手風琴設定
// 在 DOM 內容完全載入後執行
document.addEventListener("DOMContentLoaded", () => {
  const collapseEl = document.getElementById("collapseOne");
  const toggleBtn = collapseEl.previousElementSibling.querySelector(
    '[data-bs-toggle="collapse"]'
  );
  const lgBreakpoint = 992; // 設定電腦版斷點 (Bootstrap lg)

  /**
   * 根據手風琴的狀態更新按鈕樣式和文字
   * @param {HTMLElement} btn - 按鈕元素
   * @param {boolean} isOpen - 手風琴是否打開
   */
  function updateButtonState(btn, isOpen) {
    if (!btn) return;
    if (isOpen) {
      btn.textContent = "取消選擇";
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline-primary");
    } else {
      btn.textContent = "選擇方案";
      btn.classList.remove("btn-outline-primary");
      btn.classList.add("btn-primary");
    }
  }

  // 處理初始狀態：在電腦版預設打開第一個手風琴
  const isDesktop = window.innerWidth >= lgBreakpoint;
  if (isDesktop) {
    // 使用 Bootstrap 的方法來顯示手風琴
    const firstCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });
    firstCollapse.show();
  }

  // 監聽手風琴的開啟事件
  collapseEl.addEventListener("show.bs.collapse", () => {
    updateButtonState(toggleBtn, true);
  });

  // 監聽手風琴的關閉事件
  collapseEl.addEventListener("hide.bs.collapse", () => {
    updateButtonState(toggleBtn, false);
  });

  // 監聽視窗大小改變
  let timeout = null;
  window.addEventListener("resize", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const isDesktop = window.innerWidth >= lgBreakpoint;
      const isOpen = collapseEl.classList.contains("show");

      if (isDesktop && !isOpen) {
        const firstCollapse = new bootstrap.Collapse(collapseEl, {
          toggle: false,
        });
        firstCollapse.show();
      } else if (!isDesktop && isOpen) {
        const firstCollapse = new bootstrap.Collapse(collapseEl, {
          toggle: false,
        });
        firstCollapse.hide();
      }
    }, 250); // 防抖動
  });
});

//日歷
// 語系資料
const zh = {
  days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
  daysShort: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
  daysMin: ["日", "一", "二", "三", "四", "五", "六"],
  months: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ],
  monthsShort: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  today: "今天",
  clear: "清除",
  format: "yyyy/mm/dd",
  timeFormat: "hh:mm aa",
  firstDay: 0,
};

// 設定停用日期
const disabledDate = [
  "2025-05-01",
  "2025-05-02",
  "2025-05-03",
  "2025-05-04",
  "2025-05-05",
  "2025-05-06",
  "2025-05-07",
  "2025-05-09",
  "2025-05-10",
  "2025-05-11",
  "2025-05-14",
  "2025-05-16",
  "2025-05-17",
  "2025-05-18",
  "2025-05-19",
  "2025-05-22",
  "2025-05-23",
  "2025-05-24",
  "2025-05-25",
  "2025-05-26",
  "2025-05-27",
  "2025-05-28",
  "2025-05-29",
  "2025-05-30",
  "2025-05-31",
];

// 加入月曆
const dp = new AirDatepicker("#airDatepicker", {
  inline: true,
  locale: zh,
  selectedDates: ["2025-05-21"],

  navTitles: {
    days: `
        <div class="custom-nav-title">
          <span class="nav-year">2025 年</span>
          <span class="nav-month">5 月</span>
        </div>
      `,
  },
  showOtherMonths: false,
});
dp.disableDate(disabledDate);

//navbar監控
document.addEventListener("DOMContentLoaded", () => {
  // 取得我們要控制的導航欄
  const secondaryNavbar = document.getElementById("secondaryNavbar");
  // 取得您原來的 header 區塊
  const mainHeader = document.getElementById("mainHeader");
  // 新增：取得你想要觸發的目標區塊，這裡的 ID 是 'plan'
  const planSection = document.getElementById("plan");

  // 如果任何一個元素不存在，就停止執行並報錯
  if (!secondaryNavbar || !mainHeader || !planSection) {
    console.error("找不到導航欄、主頁頭或目標區塊，請確認 ID 是否正確。");
    return;
  }

  // 監聽整個視窗的滾動事件
  window.addEventListener("scroll", () => {
    // 取得目標區塊 (#plan) 在視窗中的位置資訊
    const planSectionRect = planSection.getBoundingClientRect();

    // 判斷條件：
    // 當 #plan 區塊的頂部 (planSectionRect.top)
    // 滾動到視窗頂部之上（即小於或等於 0）時，就代表我們已經滑過它了。
    // 如果想要在它快到頂部時就觸發，可以把 0 改成一個正數，例如：50 或 100
    if (planSectionRect.top <= 0) {
      // 滾動超過 #plan
      secondaryNavbar.classList.remove("d-none"); // 顯示新的導航欄
      mainHeader.classList.add("d-none"); // 隱藏原來的 header
    } else {
      // 滾動未達 #plan
      secondaryNavbar.classList.add("d-none"); // 隱藏新的導航欄
      mainHeader.classList.remove("d-none"); // 顯示原來的 header
    }
  });
});

//展開更多效果
document.addEventListener("DOMContentLoaded", function () {
  const expandBtn = document.getElementById("expand-more-btn");
  const contentWrapper = document.querySelector(".content-wrapper");

  if (expandBtn && contentWrapper) {
    expandBtn.addEventListener("click", function () {
      // 切換 .content-wrapper 的 expanded 類別
      contentWrapper.classList.toggle("expanded");

      // 根據當前狀態切換按鈕文字
      if (contentWrapper.classList.contains("expanded")) {
        expandBtn.textContent = "收起內容";
      } else {
        expandBtn.textContent = "展開更多";
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const expandBtn = document.getElementById("expand-more-btn");
  const contentWrapper = document.querySelector(".content-wrapper");

  if (expandBtn && contentWrapper) {
    expandBtn.addEventListener("click", function () {
      // 1. 為內容容器添加 'expanded' 類別，讓它展開並移除漸層遮罩
      contentWrapper.classList.add("expanded");

      // 2. 隱藏按鈕本身
      this.style.display = "none";
    });
  }
});
//展開更多效果

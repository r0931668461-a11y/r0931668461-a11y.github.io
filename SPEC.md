# 專案需求文件 (PRD)：王小明個人學習履歷網站

## 1. 專案概覽

- **專案名稱**：王小明個人學習履歷 Portfolio
- **目標對象**：使用於自己的個人學習履歷
- **核心價值**：透過高質感、互動式的網頁設計，呈現九年級學生王小明在程式設計與多媒體剪輯領域的學習深度與自學能力。

---

## 2. 設計視覺規範 (Visual Identity)

- **整體風格**：Apple 官網極簡主義、Obsidian Noir 深色質感。
- **色彩配置**：
  - 背景：`#131313` (深邃黑)
  - 容器：`#1b1b1b` (磨砂黑)
  - 強調色：`#ffffff` (純白文字)、`#393939` (輔助線條)
- **字體**：Inter / SF Pro 風格無襯線字體，強調可讀性與現代感。
- **動態效果**：
  - 0.5 秒極簡載入動畫 (Fade-in / Scale-down)。
  - 全域視差滾動 (Parallax Scrolling)。
  - 背景動態 WebGL Shader 流體光影。

---

## 3. 功能需求與頁面架構

### 3.1 導航系統 (Navigation)

- **頂部導航欄**：具備半透明磨砂玻璃效果 (Backdrop Blur)。
- **跳轉連結**：經歷 (Experience)、技能 (Skills)、專題 (Projects)、聯絡方式 (Contact)。
- **主要動作**：Resume (下載/查看完整履歷)。

### 3.2 頁面區塊

- **英雄區 (Hero Section)**：
  - 大標題：王小明。
  - 副標題：持續探索、永不停止。
  - 角色形象圖：高質感個人照。
- **學術表現與技能 (Learning Outcomes)**：
  - 採用卡片式佈局，展示：數學 (Logic)、自然 (Science)、英文 (English)、資訊 (Coding)。
- **精選作品 (Featured Project)**：
  - 重點展示「天氣查詢 App」。
  - 包含技術棧標籤 (HTML/CSS, JS, API) 與專案說明。
- **課外活動與足跡 (Experience)**：
  - 垂直時間軸設計，記錄科學實驗社、偏鄉志工、校園馬拉松。
- **榮譽紀錄 (Awards)**：
  - 徽章式網格設計，展示全市數學競賽、模範生、Python 認證。
- **未來展望與聯絡 (Footer CTA)**：
  - 呼籲行動區塊，引導訪客聯繫。

---

## 4. 技術規格 (Technical Specs)

- **前端框架**：HTML5, CSS3 (Tailwind CSS 佈局)。
- **動畫技術**：
  - **JavaScript**：控制視差滾動與 DOM 進入動畫 (Intersection Observer)。
  - **WebGL**：背景著色器渲染。
- **響應式設計**：優先優化 Desktop 體驗，兼顧流暢度與載入速度。

---

## 5. 未來擴展性

- **部落格功能**：記錄技術學習筆記。
- **動態作品集清單**：串接 GitHub API 自動同步專案更新。
- **多語系支持**：增加英文版本以接軌國際交流。

---

## 6. 座右銘
>
> "It does not matter how slowly you go so long as you do not stop."

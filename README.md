# Apple風格平板借還及問題報告登記表

這是一個採用Apple設計風格的平板借還及問題報告登記表，具有優雅的用戶界面和完整的功能。

## ✨ 特色功能

### 🎨 Apple風格設計
- 採用Apple官網的設計語言和視覺風格
- 使用SF Pro字體系列和Apple的顏色方案
- 毛玻璃效果、漸變背景和精緻陰影
- 優雅的動畫效果和微互動
- 完全響應式設計，支援桌面和移動設備

### 🌐 多語言支援
- 繁體中文和英文雙語界面
- 一鍵語言切換功能
- 完整的本地化支援

### 📱 完整功能
- 平板借用/歸還/問題報告登記
- 表單驗證和錯誤處理
- 美觀的成功/失敗頁面
- 實時時鐘顯示

### 🔧 優化的後端
- 完全重寫的Google Apps Script代碼
- 強化的數據驗證和安全性
- 詳細的錯誤處理和日誌記錄
- 模組化的代碼結構

## 📁 文件結構

```
apple-tablet-form-no-auth/
├── index.html              # 主表單頁面（中文版）
├── index-en.html           # 主表單頁面（英文版）
├── success.html            # 成功頁面（中文版）
├── success-en.html         # 成功頁面（英文版）
├── error.html              # 錯誤頁面（中文版）
├── error-en.html           # 錯誤頁面（英文版）
├── optimized-gas.js        # 優化後的Google Apps Script代碼
├── gas-optimization-report.md  # GAS優化報告
├── gas-analysis.md         # GAS代碼分析
└── README.md               # 項目說明文件
```

## 🚀 部署指南

### 1. 上傳到GitHub
1. 將所有文件上傳到您的GitHub倉庫
2. 確保文件結構正確
3. 啟用GitHub Pages（如果需要）

### 2. 設置Google Apps Script
1. 前往 [Google Apps Script](https://script.google.com/)
2. 創建新項目
3. 將 `optimized-gas.js` 中的代碼複製到編輯器
4. 修改 `CONFIG.SPREADSHEET_ID` 為您的Google Sheets ID
5. 部署為網頁應用程式
6. 複製部署URL並更新HTML文件中的 `apiUrl`

### 3. 配置Google Sheets
1. 創建新的Google Sheets
2. 複製Sheets ID到GAS代碼中
3. 運行 `initializeSheet()` 函數初始化表格標題

## ⚙️ 配置說明

### Google Apps Script配置
```javascript
const CONFIG = {
  SPREADSHEET_ID: "您的Google Sheets ID",
  SHEET_NAME: "工作表1",
  TIMEZONE: "GMT+8",
  MAX_TEXT_LENGTH: 1000,
  REQUIRED_FIELDS: ['name', 'grade', 'type', 'qty']
};
```

### HTML中的API URL
在 `index.html` 和 `index-en.html` 中更新：
```javascript
const apiUrl = "您的Google Apps Script部署URL";
```

## 🔧 功能說明

### 表單驗證
- 姓名縮寫：必須是2個或以上英文字母
- 班級：必須選擇有效的班級
- 數量：必須是正整數
- 登記類型：必須選擇借用、歸還或其他

### 錯誤處理
- 客戶端驗證：即時檢查輸入格式
- 服務器端驗證：後端二次驗證
- 友好的錯誤提示：清晰的錯誤信息

### 響應式設計
- 桌面端：完整的多欄佈局
- 平板端：適應性佈局調整
- 手機端：單欄垂直佈局

## 🎯 使用說明

1. **選擇登記類型**：借用、歸還或其他
2. **填寫個人信息**：姓名縮寫和班級
3. **輸入數量**：借用或歸還的平板數量
4. **添加備註**：如有特殊情況請說明
5. **提交表單**：點擊提交按鈕完成登記

## 🔒 安全特性

- 輸入清理和驗證
- 防止SQL注入和XSS攻擊
- 錯誤信息過濾
- 數據長度限制

## 📊 數據記錄

系統會自動記錄以下信息：
- 提交日期和時間
- 用戶輸入的所有表單數據
- 提交狀態（成功/失敗）
- 錯誤信息（如有）

## 🛠️ 技術棧

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **後端**：Google Apps Script
- **數據存儲**：Google Sheets
- **設計風格**：Apple Design Language
- **響應式框架**：CSS Grid & Flexbox

## 📞 支援

如有問題或需要協助，請參考：
- `gas-optimization-report.md` - 詳細的優化說明
- `gas-analysis.md` - 代碼分析報告

## 📝 更新日誌

### v2.0.0 (2025/07/01)
- ✅ 移除Google登入驗證功能
- ✅ 重新設計為Apple風格界面
- ✅ 完全重寫Google Apps Script代碼
- ✅ 加強數據驗證和安全性
- ✅ 優化用戶體驗和響應式設計
- ✅ 添加詳細的錯誤處理和日誌記錄

---

**享受您的Apple風格平板管理系統！** 🍎✨


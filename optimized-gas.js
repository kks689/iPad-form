/**
 * 優化後的平板借還及問題報告登記表 Google Apps Script
 * 
 * 功能：
 * - 接收表單提交數據
 * - 驗證必填字段
 * - 記錄到Google Sheets
 * - 提供詳細的錯誤處理和日誌
 */

// 配置常數
const CONFIG = {
  SPREADSHEET_ID: "1XU3rXhUdg8b0rWWrFxrWZl6xr_5GC8s-ZFK2JlUXxpo",
  SHEET_NAME: "工作表1",
  TIMEZONE: "GMT+8",
  MAX_TEXT_LENGTH: 1000,
  REQUIRED_FIELDS: ['name', 'grade', 'type', 'qty']
};

// 響應常數
const RESPONSES = {
  SUCCESS: "OK",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  SERVER_ERROR: "SERVER_ERROR"
};

/**
 * 主要的POST請求處理函數
 */
function doPost(e) {
  const startTime = new Date();
  
  try {
    // 驗證請求
    const validationResult = validateRequest(e);
    if (!validationResult.isValid) {
      logError("驗證失敗", validationResult.errors, e.parameter);
      return createResponse(RESPONSES.VALIDATION_ERROR);
    }
    
    // 處理數據
    const processedData = processFormData(e.parameter);
    
    // 寫入數據到表格
    const writeResult = writeToSheet(processedData);
    
    if (writeResult.success) {
      logSuccess("數據成功寫入", processedData, startTime);
      return createResponse(RESPONSES.SUCCESS);
    } else {
      throw new Error(writeResult.error);
    }
    
  } catch (error) {
    logError("系統錯誤", error.message, e.parameter, startTime);
    return createResponse(RESPONSES.SERVER_ERROR);
  }
}

/**
 * 驗證請求數據
 */
function validateRequest(e) {
  const errors = [];
  const params = e.parameter || {};
  
  // 檢查必填字段
  CONFIG.REQUIRED_FIELDS.forEach(field => {
    if (!params[field] || params[field].trim() === '') {
      errors.push(`Required field ${field} cannot be empty`);
    }
  });
  
  // 驗證姓名縮寫格式
  if (params.name) {
    const namePattern = /^[A-Za-z]{2,}$/;
    if (!namePattern.test(params.name.trim())) {
      errors.push('Name abbreviation must be 2 or more English letters');
    }
  }
  
  // 驗證數量
  if (params.qty) {
    const qty = parseInt(params.qty);
    if (isNaN(qty) || qty < 1 || qty > 100) {
      errors.push('Quantity must be a number between 1 and 100');
    }
  }
  
  // 驗證文本長度（僅適用於 remark）
  if (params.remark && params.remark.length > CONFIG.MAX_TEXT_LENGTH) {
    errors.push(`Remark field length cannot exceed ${CONFIG.MAX_TEXT_LENGTH} characters`);
  }
  
  // 驗證登記類型
  const validTypes = ['借用', '歸還', 'borrow', 'return']; // 移除 "其他" 和 "other"
  if (params.type && !validTypes.includes(params.type)) {
    errors.push('Invalid registration type');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * 處理表單數據
 */
function processFormData(params) {
  const now = new Date();
  
  // 清理和格式化數據
  const cleanData = {
    date: formatDate(now, "yyyy/MM/dd"),
    time: formatDate(now, "HH:mm:ss"),
    name: sanitizeText(params.name || ""),
    grade: sanitizeText(params.grade || ""),
    type: sanitizeText(params.type || ""),
    qty: parseInt(params.qty) || "",
    remark: sanitizeText(params.remark || ""),
    status: "Success",
    timestamp: now.getTime(),
    userAgent: params.userAgent || "",
    ip: getClientIP()
  };
  
  return cleanData;
}

/**
 * 寫入數據到Google Sheets
 */
function writeToSheet(data) {
  try {
    const sheet = getSheet();
    
    // 準備行數據
    const row = [
      data.date,
      data.time,
      data.name,
      data.grade,
      data.type,
      data.qty,
      data.remark,
      data.status
    ];
    
    // 寫入數據
    sheet.appendRow(row);
    
    return { success: true };
    
  } catch (error) {
    return { 
      success: false, 
      error: `Write failed: ${error.message}` 
    };
  }
}

/**
 * 記錄錯誤到表格
 */
function logError(errorType, errorMessage, params = {}, startTime = null) {
  try {
    const sheet = getSheet();
    const now = new Date();
    
    const errorRow = [
      formatDate(now, "yyyy/MM/dd"),
      formatDate(now, "HH:mm:ss"),
      sanitizeText(params.name || ""),
      sanitizeText(params.grade || ""),
      sanitizeText(params.type || ""),
      params.qty || "",
      sanitizeText(params.remark || ""),
      `Failed: ${errorType} - ${errorMessage}`
    ];
    
    sheet.appendRow(errorRow);
    
    // 記錄到日誌（如果有配置）
    console.log(`Error log: ${errorType} - ${errorMessage}`, params);
    
  } catch (logError) {
    console.error('Unable to log error to sheet:', logError.message);
  }
}

/**
 * 記錄成功操作
 */
function logSuccess(message, data, startTime) {
  const processingTime = new Date().getTime() - startTime.getTime();
  console.log(`Success: ${message}, Processing time: ${processingTime}ms`, data);
}

/**
 * 獲取表格對象
 */
function getSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`Sheet not found: ${CONFIG.SHEET_NAME}`);
    }
    
    return sheet;
    
  } catch (error) {
    throw new Error(`Unable to access spreadsheet: ${error.message}`);
  }
}

/**
 * 格式化日期
 */
function formatDate(date, format) {
  return Utilities.formatDate(date, CONFIG.TIMEZONE, format);
}

/**
 * 清理文本輸入
 */
function sanitizeText(text) {
  if (typeof text !== 'string') {
    return String(text || '');
  }
  
  return text
    .trim()
    .replace(/[\r\n\t]/g, ' ')  // 替換換行符和制表符
    .replace(/\s+/g, ' ')       // 合併多個空格
    .substring(0, CONFIG.MAX_TEXT_LENGTH); // 限制長度
}

/**
 * 獲取客戶端IP（簡化版）
 */
function getClientIP() {
  try {
    // Google Apps Script 中獲取IP的方法有限
    return "Unknown";
  } catch (error) {
    return "Unknown";
  }
}

/**
 * 創建響應
 */
function createResponse(status) {
  return ContentService
    .createTextOutput(status)
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * 測試函數（用於開發調試）
 */
function testDoPost() {
  const testEvent = {
    parameter: {
      name: "test",
      grade: "1A",
      type: "borrow",
      qty: "1",
      remark: "Test submission"
    }
  };
  
  const result = doPost(testEvent);
  console.log('Test result:', result.getContent());
}

/**
 * 初始化函數（設置表格標題等）
 */
function initializeSheet() {
  try {
    const sheet = getSheet();
    
    // 檢查是否已有標題行
    const firstRow = sheet.getRange(1, 1, 1, 8).getValues()[0];
    const hasHeaders = firstRow.some(cell => cell !== '');
    
    if (!hasHeaders) {
      const headers = [
        'Date', 'Time', 'Name Abbreviation', 'Class', 'Registration Type', 
        'Quantity', 'Remarks', 'Status'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      
      console.log('Sheet headers initialized');
    }
    
  } catch (error) {
    console.error('Failed to initialize sheet:', error.message);
  }
}
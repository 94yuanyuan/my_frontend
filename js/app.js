import { utils } from './utils.js';

  export const app = {
    message: utils.message,
    isTestMode: utils.isTestMode,
    getApiUrl: utils.getApiUrl,
    showError: utils.showError,
	
  	username: '',
	password: '',
	currentPage: 'login',
	isLoading: false, // <== 新增鎖定變數

	async login() {
	  if (this.isLoading) return; // <== 防止重複點擊
	  this.isLoading = true;	  // 鎖定按鈕
	  this.message = '';		  // 清空錯誤訊息

	  try {
		const res = await fetch(utils.getApiUrl('/login'), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
			username: this.username.trim(),
			password: this.password
		  })
		});

		// 捕捉 API 拋出的錯誤
		if (!res.ok) {
		  this.message = `伺服器錯誤 (${res.status})，請稍後再試`;
		  return;
		}

		const result = await res.json();
		this.message = result.message;
		if (result.success) {
		  this.password = '';
		  this.currentPage = 'dashboard';
		}

	  } catch (err) {
		utils.showError(err);
	  } finally {
		this.isLoading = false; // 無論成功與否都解鎖
	  }
	},
	
	logout() {
	  this.username = '';
	  this.password = '';
	  this.currentPage = 'login';
	  this.message = '';
	},
	
    gotoPage(pageName) {
      this.currentPage = pageName
    }
  };
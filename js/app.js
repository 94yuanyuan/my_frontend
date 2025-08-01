import { utils } from './utils.js';

  export const app = {
  	loginAccount: '',
	loginPassword: '',
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
			loginAccount: this.loginAccount.trim(),
			loginPassword: this.loginPassword
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
		  this.loginPassword = '';
		  this.currentPage = 'dashboard';
		}

	  } catch (err) {
		utils.showError(err);
	  } finally {
		this.isLoading = false; // 無論成功與否都解鎖
	  }
	},
	
	logout() {
	  this.loginAccount = '';
	  this.loginPassword = '';
	  this.currentPage = 'login';
	  this.message = '';
	}
  };
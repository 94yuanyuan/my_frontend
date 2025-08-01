// === 工具函式 === 
  export const utils = {
	message: '',
	isTestMode: new URLSearchParams(location.search).get('testMode') === '1',
	//?testMode=1 測試模式

	getApiUrl(path) {
	  return this.isTestMode
		? 'https://my-backend-9pkr.onrender.com/404'
		: `https://my-backend-9pkr.onrender.com${path}`;
	},

	showError(err, fallback = '無法連線到伺服器，請檢查網路或稍後再試') {
	  console.error('錯誤:', err);
	  this.message = fallback;
	}
  };
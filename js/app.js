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

	//<功能-登入&登出
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
	//>
	
	//<功能-頁籤
    gotoPage(pageName) {
      this.currentPage = pageName
    },
	//>
	
	//<功能-庫存查詢
	productPage: 1,
	products: [],
	searchKeyword: '',
	searchAt: 0,
	pageSize: 5,
	totalPages: 1,

	stockList: [],
	selectedVendor: '',
	vendors: [],  // 廠商清單
	
	async fetchProductPage(page = 1) {
	  this.productPage = page;

	  if (this.isLoading) return; // <== 防止重複點擊
	  this.isLoading = true;	  // 鎖定按鈕
	  
	  try {
	  	const res = await fetch(utils.getApiUrl('/api/products/page'), {
	  	method: 'POST',
	  	  headers: { 'Content-Type': 'application/json' },
	  	  body: JSON.stringify({
	  	  	keyword: this.searchKeyword,
	  	  	dtAt: this.searchAt,
	  	  	page,
	  	  	pageSize: this.pageSize
	  	  })
	  	});

		if (!res.ok) {
	  	  return;
		}

	  	const result = await res.json();
	  	this.stockList = result.products;
	  	this.totalPages = result.totalPages;

	  } catch (err) {
	  	utils.showError(err);
	  } finally {
		this.isLoading = false; // 無論成功與否都解鎖
	  }
	},

	showModal: false,
	selectedProduct: {},

	showDetail(product) {
	  this.selectedProduct = product;
	  this.showModal = true;
	},

	closeModal() {
	  this.showModal = false;
	  this.selectedProduct = {};
	}
	//>
  };
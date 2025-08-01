import { utils } from './utils.js';

  export const inventoryModule = {
    message: utils.message,
    isTestMode: utils.isTestMode,
    getApiUrl: utils.getApiUrl,
    showError: utils.showError,
	
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

	  if (!this.vendors.length) await this.fetchVendors(); // 廠商下拉
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
	},
	
	async fetchVendors() {
	  try {
		const res = await fetch(utils.getApiUrl('/api/vendors'))
		
		if (!res.ok) {
	  	  return;
		}
		
		const result = await res.json()
		this.vendors = result.vendors
		
	  } catch (err) {
		utils.showError(err)
	  }
	}
  };
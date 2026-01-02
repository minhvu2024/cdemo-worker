export function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BC DATA</title>
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 512 512%22><path fill=%22%234A8BFF%22 d=%22M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z%22/></svg>">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="/app2.js?v=6" defer></script>
<style>
html{overflow-y:scroll}
*{transition:all .2s ease;font-family:'Inter',sans-serif}
body{background:#F8F9FA;min-height:100vh;color:#1A1A1A;padding-top:70px}
.glass{background:#FFFFFF;border:1px solid #E5E7EB;box-shadow:0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.06)}
.glass:hover{border-color:#4A8BFF;box-shadow:0 4px 6px -1px rgba(74,139,255,0.1),0 2px 4px -1px rgba(74,139,255,0.06)}
.gradient-text{color:#4A8BFF}
.hover-lift{transition:transform .2s,box-shadow .2s}
.hover-lift:hover{transform:translateY(-2px);box-shadow:0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)}
.skeleton{background:linear-gradient(90deg,#F3F4F6 25%,#E5E7EB 50%,#F3F4F6 75%);background-size:200% 100%;animation:loading 1.5s infinite}
@keyframes loading{to{background-position:-200% 0}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.7}}
.pulse{animation:pulse 2s infinite}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.fade-in{animation:fadeIn .4s ease-out}
.input-glow:focus{box-shadow:0 0 0 3px rgba(74,139,255,0.15)}
.btn-primary{background:#4A8BFF;color:#FFFFFF;position:relative;overflow:hidden;transition:background .2s}
.btn-primary:hover{background:#3A7BEE}
.badge{display:inline-flex;align-items:center;gap:.25rem;padding:.375rem .75rem;border-radius:9999px;font-size:.75rem;font-weight:600;text-transform:uppercase}
.badge-credit{background:rgba(74,139,255,0.1);color:#4A8BFF;border:1px solid rgba(74,139,255,0.2)}
.badge-debit{background:rgba(16,185,129,0.1);color:#10B981;border:1px solid rgba(16,185,129,0.2)}
.badge-prepaid{background:rgba(245,158,11,0.1);color:#F59E0B;border:1px solid rgba(245,158,11,0.2)}
.badge-default{background:rgba(107,114,128,0.1);color:#6B7280;border:1px solid rgba(107,114,128,0.2)}
tbody tr{transition:all .2s}
tbody tr:hover{background:rgba(74,139,255,0.02)}
.scrollbar::-webkit-scrollbar{width:8px;height:8px}
.scrollbar::-webkit-scrollbar-track{background:transparent}
.scrollbar::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:4px}
.scrollbar::-webkit-scrollbar-thumb:hover{background:#9CA3AF}
.loading{border:3px solid rgba(229,231,235,0.5);border-top-color:#4A8BFF;border-radius:50%;width:24px;height:24px;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.sticky-nav{position:fixed;top:0;left:0;right:0;z-index:1000;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border-bottom:1px solid #E5E7EB}
.nav-tabs{display:flex;align-items:center;gap:.5rem;padding:.75rem 1rem;overflow-x:auto}
.nav-tabs::-webkit-scrollbar{display:none}
.tab-btn{padding:.5rem .75rem;border-radius:.5rem;font-weight:600;font-size:.95rem;cursor:pointer;background:transparent;color:#6B6B6B;white-space:nowrap;display:flex;align-items:center;gap:.5rem;transition:all .2s}
.tab-btn:hover{color:#4A8BFF;background:rgba(74,139,255,0.05)}
.tab-btn.active{background:#4A8BFF;color:#fff;box-shadow:0 4px 12px rgba(74,139,255,0.25)}
.tab-btn .icon{font-size:1.1rem}
.gen-btn{padding:.5rem .75rem;background:rgba(74,139,255,0.05);border:1px solid rgba(74,139,255,0.2);border-radius:.5rem;font-weight:600;color:#4A8BFF;margin-left:auto}
.gen-btn:hover{background:rgba(74,139,255,0.1);border-color:#4A8BFF}
.tab-content{display:none}
.tab-content.active{display:block}
input,textarea,select{background:#FFFFFF;border:1px solid #E5E7EB;border-radius:.75rem;padding:.75rem 1rem;color:#1A1A1A;width:100%}
input:focus,textarea:focus,select:focus{outline:none;border-color:#4A8BFF;box-shadow:0 0 0 3px rgba(74,139,255,0.1)}
textarea{white-space:nowrap;overflow-x:auto;font-family:monospace}
textarea.keep-scroll-start{scroll-behavior:auto}
table{width:100%;border-collapse:collapse}
th{background:#F9FAFB;padding:1rem;text-left;font-weight:600;color:#6B6B6B;border-bottom:1px solid #E5E7EB}
td{padding:1rem;border-bottom:1px solid #E5E7EB;color:#2D2D2D}
.progress-bar{width:100%;height:6px;background:#E5E7EB;border-radius:3px;overflow:hidden;margin:8px 0}
.progress-fill{height:100%;background:#4A8BFF;transition:width .3s}
@media (max-width:768px){
body{padding-top:60px}
.nav-tabs{padding:.5rem}
.tab-btn{padding:.5rem 1rem;font-size:.875rem}
.tab-btn .text{display:none}
.tab-btn .icon{font-size:1.25rem}
.gen-btn{padding:.5rem 1rem;font-size:.875rem}
}
</style>
</head>
<body>

<div id="loginSection" class="fixed inset-0 z-[2000] bg-[#F8F9FA] flex items-center justify-center fade-in">
<div class="glass p-8 rounded-2xl w-full max-w-md shadow-2xl">
<div class="text-center mb-6">
<div class="w-16 h-16 bg-[#4A8BFF] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold"><i class="fas fa-shield-alt"></i></div>
<h2 class="text-2xl font-bold text-gray-900">Admin Access</h2>
<p class="text-sm text-gray-600">Please login to continue</p>
</div>
<form id="loginForm" class="space-y-4">
<div>
<label class="block text-sm font-semibold text-gray-700 mb-1">Username</label>
<input type="text" id="username" class="w-full glass rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4A8BFF] input-glow" placeholder="Enter username">
</div>
<div>
<label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
<input type="password" id="password" class="w-full glass rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#4A8BFF] input-glow" placeholder="Enter password">
</div>
<button type="submit" class="w-full btn-primary py-2 rounded-lg font-bold hover-lift">Login</button>
<div id="loginError" class="text-red-500 text-sm text-center hidden"></div>
</form>
</div>
</div>

<nav class="sticky-nav hidden" id="mainNav">
<div class="nav-tabs container mx-auto">
<button class="tab-btn active hover-shadow" data-tab="dashboard">
<span class="icon">📊</span><span class="text">Dashboard</span>
</button>
<button class="tab-btn hover-shadow" data-tab="binchecker">
<span class="icon">🔍</span><span class="text">Bin Checker</span>
</button>
<button class="tab-btn hover-shadow" data-tab="cardchecker">
<span class="icon">💳</span><span class="text">Card Checker</span>
</button>
<button class="tab-btn hover-shadow" data-tab="tools">
<span class="icon">🔧</span><span class="text">Tools</span>
</button>
<a href="https://gencard.minhvu-vng.workers.dev" target="_blank" class="gen-btn">
<span class="icon">🔗</span><span class="text">Gen Data</span>
</a>
<button id="logoutBtn" class="ml-2 px-4 py-2 text-sm font-semibold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
<i class="fas fa-sign-out-alt mr-1"></i>Logout
</button>
</div>
</nav>

<div class="container mx-auto px-4 py-3 fade-in hidden" id="mainContent">

<!-- Dashboard Tab -->
<div id="dashboard" class="tab-content active">
<div class="glass rounded-2xl p-4">
<div class="flex justify-between items-center mb-4">
<h2 class="text-2xl font-bold">Dashboard</h2>
<button id="updateDataBtn" class="btn glass px-3 py-2 rounded-lg hover-lift text-[#4A8BFF] font-bold"><i class="fas fa-database mr-2"></i>Update Data</button>
</div>
<div id="dashContent">
<div class="text-center py-8"><div class="loading inline-block"></div></div>
</div>
</div>
</div>

<!-- Bin Checker Tab -->
<div id="binchecker" class="tab-content">
<div class="glass rounded-2xl p-4 mb-4 hover-lift">
<div class="flex items-center mb-4">
<div class="p-2 bg-[#4A8BFF] rounded-lg mr-3">
<i class="fas fa-filter text-white"></i>
</div>
<h2 class="text-xl font-bold">Search Filters</h2>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
<div class="md:col-span-2 lg:col-span-4">
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2 flex justify-between">
<span><i class="fas fa-hashtag mr-1 text-[#4A8BFF]"></i>BIN Numbers</span>
<span id="binCounter" class="px-3 py-1 bg-[#4A8BFF] rounded-full text-white text-xs">374788</span>
</label>
<textarea id="binInput" rows="4" class="w-full glass rounded-xl px-4 py-3 text-gray-900 font-mono focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 resize-none input-glow scrollbar" placeholder="Enter BIN numbers (comma or newline separated)"></textarea>
</div>
<div class="relative">
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-credit-card mr-1 text-[#4A8BFF]"></i>Brand
</label>
<input id="brandFilter" list="brands-list" class="w-full glass rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 input-glow" placeholder="Select..."/>
<datalist id="brands-list"></datalist>
</div>
<div class="relative">
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-tag mr-1 text-[#4A8BFF]"></i>Type
</label>
<input id="typeFilter" list="types-list" class="w-full glass rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 input-glow" placeholder="Select..."/>
<datalist id="types-list"></datalist>
</div>
<div class="relative">
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-layer-group mr-1 text-[#4A8BFF]"></i>Category
</label>
<input id="categoryFilter" list="categories-list" class="w-full glass rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 input-glow" placeholder="Select..."/>
<datalist id="categories-list"></datalist>
</div>
<div class="relative">
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-globe mr-1 text-[#4A8BFF]"></i>Country
</label>
<input id="countryFilter" list="countries-list" class="w-full glass rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 input-glow" placeholder="Select..."/>
<datalist id="countries-list"></datalist>
</div>
<div class="md:col-span-2">
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-building mr-1 text-[#4A8BFF]"></i>Issuer
</label>
<input id="issuerFilter" list="issuers-list" class="w-full glass rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 input-glow" placeholder="Search..."/>
<datalist id="issuers-list"></datalist>
</div>
<div>
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-list-ol mr-1 text-[#4A8BFF]"></i>Limit
</label>
<input type="number" id="limitInput" value="10" min="1" max="1000" class="w-full glass rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 input-glow">
</div>
</div>
<div class="flex flex-wrap gap-3">
<button id="searchBtn" class="px-3 py-2 btn-primary rounded-lg font-semibold hover-lift">
<i class="fas fa-search mr-2"></i>Bin Checker
</button>
<button id="clearBtn" class="px-3 py-2 glass rounded-lg font-semibold hover-lift">
<i class="fas fa-times mr-2"></i>Clear
</button>
</div>
</div>

<div class="glass rounded-2xl p-4">
<div class="flex items-center justify-between mb-4 flex-wrap gap-3">
<div class="flex items-center gap-3">
<div class="p-2 bg-[#4A8BFF] rounded-lg">
<i class="fas fa-table text-white"></i>
</div>
<h2 class="text-xl font-bold">Results</h2>
<button id="copyBinsBtn" class="px-4 py-2 btn-primary rounded-xl font-bold hover-lift text-sm ml-2">
<i class="fas fa-copy mr-1"></i>Copy BINs List
</button>
</div>
<div class="flex items-center gap-3 flex-wrap">
<div class="text-sm text-gray-600 glass px-4 py-2 rounded-lg">
<i class="fas fa-list mr-2"></i>
<span id="showingCount" class="font-semibold text-[#4A8BFF]">0-0</span> of 
<span id="totalCount" class="font-semibold text-[#4A8BFF]">0</span>
</div>
<div class="flex items-center gap-2">
<button id="prevBtn" class="glass px-3 py-2 rounded-lg hover-lift" disabled>
<i class="fas fa-chevron-left"></i>
</button>
<div id="pageNumbers" class="flex items-center gap-1"></div>
<button id="nextBtn" class="glass px-3 py-2 rounded-lg hover-lift" disabled>
<i class="fas fa-chevron-right"></i>
</button>
<input id="pageJumpInput" type="number" min="1" class="w-20 glass rounded-lg px-3 py-2 text-gray-900 text-sm input-glow" placeholder="Page"/>
<button id="pageJumpBtn" class="glass px-3 py-2 rounded-lg hover-lift">Go</button>
</div>
</div>
</div>
<div class="overflow-x-auto scrollbar">
<table class="w-full">
<thead>
<tr class="border-b border-gray-300">
<th class="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors" onclick="window.binLookup.sortResults('search','bin')"><i class="fas fa-hashtag mr-2 text-[#4A8BFF]"></i>BIN</th>
<th class="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors" onclick="window.binLookup.sortResults('search','brand')"><i class="fas fa-credit-card mr-2 text-[#4A8BFF]"></i>Brand</th>
<th class="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors" onclick="window.binLookup.sortResults('search','type')"><i class="fas fa-tag mr-2 text-[#4A8BFF]"></i>Type</th>
<th class="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors" onclick="window.binLookup.sortResults('search','category')"><i class="fas fa-layer-group mr-2 text-[#4A8BFF]"></i>Category</th>
<th class="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors" onclick="window.binLookup.sortResults('search','issuer')"><i class="fas fa-building mr-2 text-[#4A8BFF]"></i>Issuer</th>
<th class="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors" onclick="window.binLookup.sortResults('search','country')"><i class="fas fa-flag mr-2 text-[#4A8BFF]"></i>Country</th>
</tr>
</thead>
<tbody id="resultsBody"></tbody>
</table>
</div>
<div id="noResults" class="hidden text-center py-12">
<i class="fas fa-search text-6xl text-gray-600 mb-4"></i>
<p class="text-xl text-gray-600">No results found</p>
</div>
</div>
</div>

<!-- Card Checker Tab (Card Exporter từ V3) -->
<div id="cardchecker" class="tab-content">
<div class="glass rounded-2xl p-4 mb-4 hover-lift">
<div class="flex items-center mb-4">
<div class="p-2 bg-[#4A8BFF] rounded-lg mr-3">
<i class="fas fa-filter text-white"></i>
</div>
<h2 class="text-xl font-bold">Card Exporter</h2>
</div>
<p class="text-gray-600 mb-4">Export cards from database by BIN filters</p>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
<div>
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-credit-card mr-1 text-indigo-400"></i>Brand
</label>
<select id="cardBrandFilter" class="w-full glass rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 input-glow">
<option value="">All Brands</option>
</select>
</div>
<div>
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-tag mr-1 text-blue-400"></i>Type
</label>
<select id="cardTypeFilter" class="w-full glass rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 input-glow">
<option value="">All Types</option>
</select>
</div>
<div>
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-layer-group mr-1 text-purple-400"></i>Category
</label>
<select id="cardCategoryFilter" class="w-full glass rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 input-glow">
<option value="">All Categories</option>
</select>
</div>
<div>
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-globe mr-1 text-green-400"></i>Country
</label>
<select id="cardCountryFilter" class="w-full glass rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 input-glow">
<option value="">All Countries</option>
</select>
</div>
<div class="md:col-span-2">
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-building mr-1 text-yellow-400"></i>Issuer
</label>
<input id="cardIssuerFilter" type="text" class="w-full glass rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 input-glow" placeholder="Search issuer (partial match)..."/>
</div>
</div>

<div class="mb-4">
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-list mr-1 text-[#4A8BFF]"></i>BIN List
</label>
<textarea id="cardBinsInput" rows="4" class="w-full glass rounded-xl px-4 py-3 text-gray-900 font-mono text-sm scrollbar" placeholder="Paste BINs, one per line or comma-separated..."></textarea>
<p class="text-xs text-gray-600 mt-1">Ưu tiên lọc theo danh sách BIN nếu có</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
<div>
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-sort-numeric-up mr-1 text-[#4A8BFF]"></i>Min Cards per BIN
</label>
<input type="number" id="minCardsInput" value="10" min="1" max="10000" class="w-full glass rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 input-glow">
<p class="text-xs text-gray-600 mt-1">Only BINs with ≥ this many cards</p>
</div>
<div>
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-list-ol mr-1 text-[#4A8BFF]"></i>Cards per BIN
</label>
<input type="number" id="cardsPerBinInput" value="50" min="1" max="100" class="w-full glass rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 input-glow">
<p class="text-xs text-gray-600 mt-1">Max: 100 cards/BIN</p>
</div>
<div>
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-hashtag mr-1 text-[#4A8BFF]"></i>Max BINs
</label>
<input type="number" id="maxBinsInput" value="10000" min="1" max="100000" class="w-full glass rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 input-glow">
<p class="text-xs text-gray-600 mt-1">Max: 100,000 BINs (no limit recommended)</p>
</div>
<div>
<label class="block text-xs font-semibold uppercase text-gray-700 mb-2">
<i class="fas fa-check-circle mr-1 text-[#4A8BFF]"></i>Status Filter
</label>
<div class="space-y-2 mt-3">
<label class="flex items-center gap-2 cursor-pointer">
<input type="checkbox" id="statusUnknown" checked class="w-4 h-4 rounded">
<span class="text-sm">Unknown</span>
</label>
<label class="flex items-center gap-2 cursor-pointer">
<input type="checkbox" id="statusLive" checked class="w-4 h-4 rounded">
<span class="text-sm">Live (1)</span>
</label>
<label class="flex items-center gap-2 cursor-pointer">
<input type="checkbox" id="statusCT" checked class="w-4 h-4 rounded">
<span class="text-sm">CT (2)</span>
</label>
<label class="flex items-center gap-2 cursor-pointer">
<input type="checkbox" id="statusDie" class="w-4 h-4 rounded">
<span class="text-sm">Die (0)</span>
</label>
</div>
</div>
</div>

<div class="flex flex-wrap gap-3">
<button id="searchBinsBtn" class="px-3 py-2 btn-primary rounded-lg font-bold hover-lift">
<i class="fas fa-search mr-2"></i>Search BINs
</button>
<button id="clearCardFiltersBtn" class="px-3 py-2 glass rounded-lg font-bold hover-lift">
<i class="fas fa-times mr-2"></i>Clear
</button>
</div>
</div>

<div id="cardResultsSection" class="glass rounded-2xl p-4 mb-4 hidden">
<div class="flex items-center justify-between mb-4">
<div>
<h3 class="text-xl font-bold mb-2">Results Preview</h3>
<p class="text-gray-600">
Found: <span id="foundBinsCount" class="text-[#4A8BFF] font-bold">0</span> BINs | 
Total Cards: <span id="totalCardsCount" class="text-[#4A8BFF] font-bold">0</span>
</p>
</div>
<button id="exportAllBtn" class="px-3 py-2 btn-primary rounded-lg font-bold hover-lift">
<i class="fas fa-download mr-2"></i>Export All
</button>
</div>

<div class="overflow-x-auto scrollbar max-h-96">
<table class="w-full">
<thead>
<tr class="border-b border-gray-300">
<th class="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors" onclick="window.binLookup.sortResults('export','bin')">BIN</th>
<th class="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors" onclick="window.binLookup.sortResults('export','brand')">Brand</th>
<th class="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors" onclick="window.binLookup.sortResults('export','type')">Type</th>
<th class="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors" onclick="window.binLookup.sortResults('export','category')">Category</th>
<th class="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors" onclick="window.binLookup.sortResults('export','country')">Country</th>
<th class="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors" onclick="window.binLookup.sortResults('export','cardCount')">Cards</th>
<th class="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 transition-colors" onclick="window.binLookup.sortResults('export','liveRate')">Live Rate</th>
</tr>
</thead>
<tbody id="cardResultsBody"></tbody>
</table>
</div>
</div>

<div id="exportOptionsSection" class="glass rounded-2xl p-4 mb-4 hidden">
<h3 class="text-xl font-bold mb-4">Export Options</h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
<div>
<label class="block text-sm font-semibold text-gray-700 mb-2">Format</label>
<div class="flex gap-4">
<label class="flex items-center gap-2 cursor-pointer">
<input type="radio" name="exportFormat" value="pan" class="w-4 h-4">
<span class="text-sm">Pan</span>
</label>
<label class="flex items-center gap-2 cursor-pointer">
<input type="radio" name="exportFormat" value="text" checked class="w-4 h-4">
<span class="text-sm">Text (pan|mm|yy|cvv)</span>
</label>
<label class="flex items-center gap-2 cursor-pointer">
<input type="radio" name="exportFormat" value="full" class="w-4 h-4">
<span class="text-sm">Full Info</span>
</label>
</div>
</div>
</div>
</div>

<div id="exportProgressSection" class="glass rounded-2xl p-4 mb-4 hidden">
<div class="flex items-center justify-between mb-4">
<h3 class="text-xl font-bold">Exporting...</h3>
<button id="cancelExportBtn" class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-xl font-semibold hover-lift">
<i class="fas fa-times mr-2"></i>Cancel
</button>
</div>
<div class="progress-bar mb-4">
<div id="exportProgressFill" class="progress-fill" style="width:0%"></div>
</div>
<p class="text-gray-600 text-sm">
<span id="exportProgressText">Preparing...</span> | 
Exported: <span id="exportedCardsCount" class="text-indigo-400 font-bold">0</span> cards | 
Time: <span id="exportTime" class="text-indigo-400 font-bold">0</span>s | 
Speed: <span id="exportSpeed" class="text-indigo-400 font-bold">0</span> cards/s
</p>
</div>

<div id="exportResultSection" class="glass rounded-2xl p-4 hidden">
<div class="flex items-center justify-between mb-4">
<h3 class="text-xl font-bold">Export Result</h3>
<div class="flex gap-2">
<button id="copyExportBtn" class="px-3 py-2 glass rounded-lg font-semibold hover-lift">
<i class="fas fa-copy mr-2"></i>Copy All
</button>
<button id="downloadExportBtn" class="px-3 py-2 glass rounded-lg font-semibold hover-lift">
<i class="fas fa-download mr-2"></i>Download
</button>
</div>
</div>
<textarea id="exportOutput" rows="20" class="w-full glass rounded-2xl px-4 py-3 text-gray-900 font-mono text-sm scrollbar resize-none" readonly></textarea>
</div>
</div>

<!-- Tools Tab (layout giống V2, logic dùng API V3) -->
<div id="tools" class="tab-content">
<div class="glass rounded-2xl p-4 mb-4 hover-lift">
<h2 class="text-2xl font-bold mb-3 flex items-center gap-3">
<i class="fas fa-tools text-indigo-400"></i>
Card Tools
</h2>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-3">

<!-- Tool 1: Normalize -->
<div class="glass rounded-xl p-3 hover-lift">
<h3 class="text-lg font-bold mb-2 flex items-center gap-2">
<div class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold">1</div>
Normalize Cards
</h3>

<label class="flex items-center gap-2 text-sm mb-2 cursor-pointer">
<input type="checkbox" id="filterExpiredCheck" class="w-4 h-4 rounded" checked>
<span>Filter expired cards</span>
</label>

<textarea id="normalizeInput" rows="6" class="w-full glass rounded-lg px-3 py-2 text-sm font-mono scrollbar resize-none mb-2 keep-scroll-start" placeholder="Paste cards here (any format)..."></textarea>
<div class="flex items-center justify-between mb-2">
<div class="text-xs text-gray-600">Cards: <b class="text-gray-900" id="normalizeCount">0</b></div>
<button id="normalizeBtn" class="px-3 py-2 btn-primary rounded-lg font-bold hover-lift text-sm">
<i class="fas fa-magic mr-1"></i>Normalize
</button>
</div>

<div id="normalizeResult" class="hidden">
<div class="flex items-center justify-between mb-2">
<span class="text-xs text-gray-600">Valid: <b class="text-gray-900" id="normValid">0</b></span>
<button id="copyNorm" class="px-3 py-1 glass rounded-lg text-xs hover-lift">
<i class="fas fa-copy mr-1"></i>Copy
</button>
</div>
<textarea id="normalizeOutput" rows="6" readonly class="w-full glass rounded-lg px-2 py-2 text-xs font-mono text-gray-900 scrollbar resize-none mb-2"></textarea>
</div>

<div id="normErrorSection" class="hidden">
<div class="text-xs text-gray-600 mb-1">Errors: <b class="text-red-400" id="normError">0</b></div>
<textarea id="normalizeErrors" rows="6" readonly class="w-full glass rounded-lg px-2 py-2 text-xs font-mono text-gray-900 scrollbar resize-none"></textarea>
</div>
</div>

<!-- Tool 2: Check Duplicates -->
<div class="glass rounded-xl p-3 hover-lift">
<h3 class="text-lg font-bold mb-2 flex items-center gap-2">
<div class="w-8 h-8 rounded-full bg-[#4A8BFF] flex items-center justify-center text-sm font-bold text-white">2</div>
Check Duplicates
</h3>

<p class="text-xs text-gray-600 mb-2">Check PAN against database</p>

<textarea id="dupInput" rows="6" class="w-full glass rounded-lg px-3 py-2 text-sm font-mono scrollbar resize-none mb-2 keep-scroll-start" placeholder="Paste cards here..."></textarea>
<div class="flex items-center justify-between mb-2">
<div class="text-xs text-gray-600">Cards: <b class="text-gray-900" id="dupCount">0</b></div>
<div class="flex gap-2">
<input type="file" id="dupFileInput" accept=".txt" class="hidden">
<button id="dupFileBtn" class="px-3 py-2 glass rounded-lg font-bold hover-lift text-sm">
<i class="fas fa-file-upload mr-1"></i>file.txt
</button>
<button id="dupBtn" class="px-3 py-2 btn-primary rounded-lg font-bold hover-lift text-sm">
<i class="fas fa-search mr-1"></i>Check
</button>
</div>
</div>

<div id="dupProgress" class="hidden mb-2">
<div class="progress-bar">
<div id="dupProgressFill" class="progress-fill" style="width:0%"></div>
</div>
<div class="text-xs text-center text-gray-600" id="dupProgressText">Processing...</div>
</div>

<div id="dupResult" class="hidden">
<div class="flex items-center justify-between mb-2">
<span class="text-xs text-gray-600">Unique: <b class="text-green-400" id="dupUnique">0</b></span>
<button id="copyDup" class="px-3 py-1 glass rounded-lg text-xs hover-lift">
<i class="fas fa-copy mr-1"></i>Copy
</button>
</div>
<textarea id="dupOutput" rows="6" readonly class="w-full glass rounded-lg px-2 py-2 text-xs font-mono text-gray-900 scrollbar resize-none mb-2"></textarea>
</div>

<div id="dupDupSection" class="hidden">
<div class="text-xs text-gray-600 mb-1">Duplicates: <b class="text-yellow-400" id="dupDup">0</b></div>
<textarea id="dupDupOutput" rows="6" readonly class="w-full glass rounded-lg px-2 py-2 text-xs font-mono text-gray-900 scrollbar resize-none"></textarea>
</div>
</div>

<!-- Tool 3: Import -->
<div class="glass rounded-xl p-3 hover-lift">
<h3 class="text-lg font-bold mb-2 flex items-center gap-2">
<div class="w-8 h-8 rounded-full bg-[#4A8BFF] flex items-center justify-center text-sm font-bold text-white">3</div>
Import to Database
</h3>

<p class="text-xs text-gray-600 mb-2">Import cards to database</p>

<textarea id="importInput" rows="6" class="w-full glass rounded-lg px-3 py-2 text-sm font-mono scrollbar resize-none mb-2 keep-scroll-start" placeholder="Paste cards here (pan|mm|yy|cvv)..."></textarea>
<div class="flex items-center justify-between mb-2">
<div class="text-xs text-gray-600">Cards: <b class="text-gray-900" id="importCount">0</b></div>
<div class="flex gap-2">
<input type="file" id="importFileInput" accept=".txt" class="hidden">
<button id="importFileBtn" class="px-3 py-2 glass rounded-lg font-bold hover-lift text-sm">
<i class="fas fa-file-upload mr-1"></i>file.txt
</button>
<button id="importBtn" class="px-3 py-2 btn-primary rounded-lg font-bold hover-lift text-sm">
<i class="fas fa-upload mr-1"></i>Import
</button>
</div>
</div>

<div id="importProgress" class="hidden mb-2">
<div class="progress-bar">
<div id="importProgressFill" class="progress-fill" style="width:0%"></div>
</div>
<div class="text-xs text-center text-gray-600" id="importProgressText">Processing...</div>
</div>

<div id="importStats" class="hidden mb-2 text-xs text-gray-600">
<span>Imported: <b class="text-green-400" id="impSuccess">0</b></span> | 
<span>Errors: <b class="text-red-400" id="impError">0</b></span>
</div>

<div id="impErrorSection" class="hidden">
<label class="text-xs text-red-400 mb-1 block font-semibold">
<i class="fas fa-exclamation-triangle mr-1"></i>Errors (Tab-separated):
</label>
<textarea id="importErrors" rows="6" readonly class="w-full glass rounded-lg px-2 py-2 text-xs font-mono text-gray-900 scrollbar resize-none"></textarea>
</div>
</div>

</div>
</div>
</div>


<!-- inline logic moved to app.js
/* Inline script copied from cdemo_v8; add boot diagnostics */
(function(){
  window.addEventListener('error', (e) => {
    try {
      const t=document.createElement('div');
      t.className='fixed top-20 right-4 glass p-4 rounded-xl shadow-2xl z-50 fade-in';
      t.innerHTML='<div class="flex items-center gap-3"><i class="fas fa-exclamation-circle text-red-600 text-xl"></i><div><div class="font-semibold text-red-600">Script Error</div><div class="text-sm text-gray-700">'+(e.message||'Unknown')+'</div></div></div>';
      document.body.appendChild(t);
      setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.remove(),300)},5000);
    } catch {}
  });
})();
class BINLookup{constructor(){this.currentResults=[];this.currentPage=0;this.filters={};this.cardExporter={bins:[],cancelExport:false};this.init();}
async init(){await this.loadFilters();this.setupEventListeners();this.loadDashboard();}
setupEventListeners(){document.querySelectorAll('.tab-btn').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));btn.classList.add('active');const tab=btn.dataset.tab;document.getElementById(tab).classList.add('active');if(tab==='dashboard')this.loadDashboard();});});
document.getElementById('searchBtn').addEventListener('click',()=>this.search());document.getElementById('clearBtn').addEventListener('click',()=>this.clearFilters());document.getElementById('copyBinsBtn').addEventListener('click',()=>this.copyBinsList());document.getElementById('prevBtn').addEventListener('click',()=>this.previousPage());document.getElementById('nextBtn').addEventListener('click',()=>this.nextPage());document.getElementById('pageJumpBtn').addEventListener('click',()=>this.jumpToPage());document.getElementById('refreshDash').addEventListener('click',()=>this.loadDashboard(true));
document.getElementById('normalizeBtn').addEventListener('click',()=>this.normalize());document.getElementById('copyNorm').addEventListener('click',()=>this.copy('normalizeOutput'));document.getElementById('dupBtn').addEventListener('click',()=>this.checkDup());document.getElementById('dupFileBtn').addEventListener('click',()=>document.getElementById('dupFileInput').click());document.getElementById('dupFileInput').addEventListener('change',(e)=>this.handleDupFileUpload(e));document.getElementById('copyDup').addEventListener('click',()=>this.copy('dupOutput'));document.getElementById('importBtn').addEventListener('click',()=>this.import());document.getElementById('importFileBtn').addEventListener('click',()=>document.getElementById('importFileInput').click());document.getElementById('importFileInput').addEventListener('change',(e)=>this.handleFileUpload(e));
document.getElementById('searchBinsBtn').addEventListener('click',()=>this.searchBinsForExport());document.getElementById('clearCardFiltersBtn').addEventListener('click',()=>this.clearCardFilters());document.getElementById('exportAllBtn').addEventListener('click',()=>this.startExport());document.getElementById('cancelExportBtn').addEventListener('click',()=>this.cancelExport());document.getElementById('copyExportBtn').addEventListener('click',()=>this.copy('exportOutput'));document.getElementById('downloadExportBtn').addEventListener('click',()=>this.downloadExport());
['Enter'].forEach(key=>{document.getElementById('binInput').addEventListener('keypress',e=>{if(e.key===key)this.search()});document.getElementById('pageJumpInput').addEventListener('keypress',e=>{if(e.key===key)this.jumpToPage()});});
['normalizeInput','dupInput','importInput'].forEach(id=>{const el=document.getElementById(id);if(el){el.addEventListener('paste',(e)=>{setTimeout(()=>{el.scrollLeft=0},50);});const valueProp=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value');if(valueProp){const originalSet=valueProp.set;Object.defineProperty(el,'value',{set:function(val){originalSet.call(this,val);setTimeout(()=>{this.scrollLeft=0},50);},get:valueProp.get,configurable:true});}}});}
async loadFilters(){try{const r=await fetch('/api/filters');const d=await r.json();if(d.success){const lists={brands:d.data.brands,types:d.data.types,categories:d.data.categories,countries:d.data.countries,issuers:d.data.issuers};['brands','types','categories','countries','issuers'].forEach(key=>{const datalist=document.getElementById(key+'-list');if(datalist)(lists[key]||[]).forEach(v=>{const opt=document.createElement('option');opt.value=v;datalist.appendChild(opt);});});const brandSelect=document.getElementById('cardBrandFilter');const typeSelect=document.getElementById('cardTypeFilter');const categorySelect=document.getElementById('cardCategoryFilter');const countrySelect=document.getElementById('cardCountryFilter');(lists.brands||[]).forEach(v=>{const opt=document.createElement('option');opt.value=v;opt.textContent=v;brandSelect.appendChild(opt);});(lists.types||[]).forEach(v=>{const opt=document.createElement('option');opt.value=v;opt.textContent=v;typeSelect.appendChild(opt);});(lists.categories||[]).forEach(v=>{const opt=document.createElement('option');opt.value=v;opt.textContent=v;categorySelect.appendChild(opt);});(lists.countries||[]).forEach(v=>{const opt=document.createElement('option');opt.value=v;opt.textContent=v;countrySelect.appendChild(opt);});}}catch(e){console.error('Load filters error:',e)}}
  getSearchParams(){const params={};const bin=document.getElementById('binInput').value.trim();if(bin)params.bin=bin.split(/[\\n,]/).filter(b=>b.trim()).join(',');['brand','type','category','country','issuer'].forEach(k=>{const v=document.getElementById(k+'Filter').value.trim();if(v)params[k]=v;});params.limit=parseInt(document.getElementById('limitInput').value)||50;params.offset=this.currentPage*params.limit;return params;}
async search(){const btn=document.getElementById('searchBtn');const html=btn.innerHTML;btn.disabled=true;btn.innerHTML='<div class="loading inline-block mr-2"></div>Searching...';this.showLoading();try{const params=this.getSearchParams();const qs=new URLSearchParams(params).toString();const r=await fetch('/api/bin?'+qs);const d=await r.json();if(d.success){this.currentResults=d.data;this.displayResults();this.updatePagination(d.pagination);setTimeout(()=>document.getElementById('resultsBody').scrollIntoView({behavior:'smooth',block:'nearest'}),100);}}catch(e){this.showError('Search failed')}finally{btn.disabled=false;btn.innerHTML=html}}
showLoading(){const tbody=document.getElementById('resultsBody');document.getElementById('noResults').classList.add('hidden');tbody.innerHTML=Array(5).fill(0).map(()=>'<tr>'+Array(6).fill(0).map(()=>'<td class="px-6 py-4"><div class="skeleton h-4 rounded w-full"></div></td>').join('')+'</tr>').join('');}
displayResults(){const tbody=document.getElementById('resultsBody');const noResults=document.getElementById('noResults');if(this.currentResults.length===0){tbody.innerHTML='';noResults.classList.remove('hidden');return;}noResults.classList.add('hidden');tbody.innerHTML=this.currentResults.map((r,i)=>'<tr class="group hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 border-b border-gray-300" style="animation:fadeIn .3s ease '+(i*.05)+'s both"><td class="px-6 py-4"><span class="font-mono text-indigo-600 font-bold group-hover:text-indigo-700">'+r.bin+'</span></td><td class="px-6 py-4"><div class="flex items-center gap-2"><i class="fas fa-credit-card text-gray-600 group-hover:text-blue-600"></i><span class="font-medium text-gray-900 group-hover:text-indigo-700">'+r.brand+'</span></div></td><td class="px-6 py-4"><span class="badge '+this.getTypeBadgeClass(r.type)+'"><i class="fas fa-tag"></i>'+r.type+'</span></td><td class="px-6 py-4 text-gray-700 group-hover:text-gray-900">'+(r.category||'-')+'</td><td class="px-6 py-4 text-gray-700 group-hover:text-gray-900">'+(r.issuer||'-')+'</td><td class="px-6 py-4"><span class="px-3 py-1.5 glass rounded-lg text-xs font-mono font-semibold text-gray-700"><i class="fas fa-flag mr-1"></i>'+r.country+'</span></td></tr>').join('');}
getTypeBadgeClass(type){switch(type?.toUpperCase()){case 'CREDIT':return 'badge-credit';case 'DEBIT':return 'badge-debit';case 'PREPAID':return 'badge-prepaid';default:return 'badge-default';}}
updatePagination(p){const start=p.offset+1;const end=Math.min(p.offset+p.limit,p.total);document.getElementById('showingCount').textContent=start+'-'+end;document.getElementById('totalCount').textContent=p.total;const totalPages=Math.max(1,Math.ceil(p.total/p.limit));const currentPage=Math.floor(p.offset/p.limit)+1;const container=document.getElementById('pageNumbers');container.innerHTML='';const addBtn=i=>{const btn=document.createElement('button');btn.textContent=String(i);btn.className=(i===currentPage?'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg':'glass text-gray-700')+' px-4 py-2 rounded-lg text-sm font-semibold hover-lift';btn.onclick=()=>{this.currentPage=i-1;this.search()};container.appendChild(btn);};const addEllipsis=()=>{const span=document.createElement('span');span.textContent='...';span.className='px-2 text-gray-600';container.appendChild(span);};const addRange=(s,e)=>{for(let i=s;i<=e;i++)addBtn(i)};if(totalPages<=10){addRange(1,totalPages);}else{addRange(1,Math.min(5,totalPages));if(currentPage>7)addEllipsis();const midStart=Math.max(currentPage-2,6);const midEnd=Math.min(currentPage+2,totalPages-5);if(midStart<=midEnd)addRange(midStart,midEnd);if(currentPage<totalPages-6)addEllipsis();addRange(Math.max(totalPages-4,6),totalPages);}const prevBtn=document.getElementById('prevBtn');const nextBtn=document.getElementById('nextBtn');prevBtn.disabled=currentPage===1;nextBtn.disabled=currentPage===totalPages;prevBtn.classList.toggle('opacity-50',prevBtn.disabled);prevBtn.classList.toggle('cursor-not-allowed',prevBtn.disabled);nextBtn.classList.toggle('opacity-50',nextBtn.disabled);nextBtn.classList.toggle('cursor-not-allowed',nextBtn.disabled);}
previousPage(){if(this.currentPage>0){this.currentPage--;this.search()}}nextPage(){this.currentPage++;this.search()}jumpToPage(){const val=parseInt(document.getElementById('pageJumpInput').value);if(!isNaN(val)&&val>=1){this.currentPage=val-1;this.search();document.getElementById('pageJumpInput').value='';}}
clearFilters(){document.getElementById('binInput').value='';document.getElementById('binCounter').textContent='374788';['brandFilter','typeFilter','categoryFilter','countryFilter','issuerFilter'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});document.getElementById('limitInput').value='10';this.currentPage=0;this.search();}
async loadDashboard(force=false){const content=document.getElementById('dashContent');if(!force&&content.innerHTML.includes('grid'))return;content.innerHTML='<div class="text-center py-8"><div class="loading inline-block"></div></div>';try{const r=await fetch('/api/dashboard');const d=await r.json();if(d.success){const s=d.data;const topBrands=s.brands&&s.brands.length>0?s.brands.slice(0,10):[];const topCountries=s.countries&&s.countries.length>0?s.countries.slice(0,10):[];const topTypes=s.types&&s.types.length>0?s.types.slice(0,10):[];const topCategories=s.categories&&s.categories.length>0?s.categories.slice(0,10):[];const topBins=s.topBins&&s.topBins.length>0?s.topBins.slice(0,10):[];content.innerHTML='<div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4"><div class="glass p-4 rounded-xl text-center hover-lift"><i class="fas fa-database text-3xl text-indigo-600 mb-2"></i><div class="text-3xl font-bold text-gray-900">'+s.totalRecords.toLocaleString()+'</div><div class="text-sm text-gray-600">Total BINs</div></div><div class="glass p-4 rounded-xl text-center hover-lift"><i class="fas fa-credit-card text-3xl text-blue-600 mb-2"></i><div class="text-3xl font-bold text-gray-900">'+s.totalCards.toLocaleString()+'</div><div class="text-sm text-gray-600">Total Cards</div></div><div class="glass p-4 rounded-xl text-center hover-lift"><i class="fas fa-check-circle text-3xl text-green-600 mb-2"></i><div class="text-3xl font-bold text-gray-900">'+s.liveCards.toLocaleString()+'</div><div class="text-sm text-gray-600">Live Cards</div></div><div class="glass p-4 rounded-xl text-center hover-lift"><i class="fas fa-times-circle text-3xl text-red-600 mb-2"></i><div class="text-3xl font-bold text-gray-900">'+s.dieCards.toLocaleString()+'</div><div class="text-sm text-gray-600">Expired</div></div></div>';}}catch(e){content.innerHTML='<div class="text-center text-red-400">Failed to load dashboard</div>';}}
copyBinsList(){try{if(!this.currentResults||this.currentResults.length===0){this.showError('No BINs to copy');return;}const binsList=this.currentResults.map(r=>r.bin).join('\n');navigator.clipboard.writeText(binsList).then(()=>{this.showSuccess('Copied '+this.currentResults.length+' BINs to clipboard');}).catch(()=>{const textarea=document.createElement('textarea');textarea.value=binsList;document.body.appendChild(textarea);textarea.select();document.execCommand('copy');document.body.removeChild(textarea);this.showSuccess('Copied '+this.currentResults.length+' BINs to clipboard');});}catch(e){this.showError('Copy failed')}}
async searchBinsForExport(){const btn=document.getElementById('searchBinsBtn');const html=btn.innerHTML;btn.disabled=true;btn.innerHTML='<div class="loading inline-block mr-2"></div>Searching...';try{const status=[];if(document.getElementById('statusUnknown').checked)status.push('unknown');if(document.getElementById('statusLive').checked)status.push('1');if(document.getElementById('statusCT').checked)status.push('2');if(document.getElementById('statusDie').checked)status.push('0');if(status.length===0){this.showError('Please select at least one status');return;}const params={brand:document.getElementById('cardBrandFilter').value||null,type:document.getElementById('cardTypeFilter').value||null,category:document.getElementById('cardCategoryFilter').value||null,country:document.getElementById('cardCountryFilter').value||null,issuer:document.getElementById('cardIssuerFilter').value.trim()||null,minCards:parseInt(document.getElementById('minCardsInput').value)||10,maxBins:parseInt(document.getElementById('maxBinsInput').value)||10000,status};const r=await fetch('/api/search-bins',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(params)});const d=await r.json();if(d.success){this.cardExporter.bins=d.bins;this.displayBinResults(d.bins);document.getElementById('cardResultsSection').classList.remove('hidden');document.getElementById('exportOptionsSection').classList.remove('hidden');this.showSuccess('Found '+d.bins.length+' BINs');}else{this.showError(d.error||'Search failed');}}catch(e){this.showError('Search failed: '+e.message);}finally{btn.disabled=false;btn.innerHTML=html;}}
displayBinResults(bins){const totalCards=bins.reduce((sum,b)=>sum+b.cardCount,0);document.getElementById('foundBinsCount').textContent=bins.length;document.getElementById('totalCardsCount').textContent=totalCards.toLocaleString();const tbody=document.getElementById('cardResultsBody');tbody.innerHTML=bins.map((b,i)=>'<tr class="group hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 border-b border-gray-300" style="animation:fadeIn .3s ease '+(i*.02)+'s both"><td class="px-6 py-4"><span class="font-mono text-indigo-600 font-bold">'+b.bin+'</span></td><td class="px-6 py-4 text-gray-900">'+b.brand+'</td><td class="px-6 py-4"><span class="badge '+this.getTypeBadgeClass(b.type)+'">'+b.type+'</span></td><td class="px-6 py-4 text-gray-900">'+(b.category||'-')+'</td><td class="px-6 py-4"><span class="font-mono text-gray-900">'+b.country+'</span></td><td class="px-6 py-4"><span class="font-bold text-gray-900">'+b.cardCount.toLocaleString()+'</span></td><td class="px-6 py-4"><div class="flex items-center gap-2"><div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-green-500 to-emerald-500" style="width:'+(b.liveRate*100).toFixed(0)+'%"></div></div><span class="text-sm font-semibold text-gray-900">'+(b.liveRate*100).toFixed(0)+'%</span></div></td></tr>').join('');}
async startExport(){if(this.cardExporter.bins.length===0){this.showError('No BINs to export');return;}const cardsPerBin=Math.min(parseInt(document.querySelector('#cardsPerBinInput').value)||50,100);const includeInfo=document.querySelector('input[name="exportFormat"]:checked').value==='withinfo';const status=[];if(document.getElementById('statusUnknown').checked)status.push('unknown');if(document.getElementById('statusLive').checked)status.push('1');if(document.getElementById('statusCT').checked)status.push('2');if(document.getElementById('statusDie').checked)status.push('0');this.cardExporter.cancelExport=false;document.getElementById('exportProgressSection').classList.remove('hidden');document.getElementById('exportResultSection').classList.add('hidden');document.getElementById('exportProgressFill').style.width='0%';document.getElementById('exportedCardsCount').textContent='0';document.getElementById('exportTime').textContent='0';document.getElementById('exportSpeed').textContent='0';const startTime=Date.now();const allCards=[];const BATCH_SIZE=10;try{for(let i=0;i<this.cardExporter.bins.length;i+=BATCH_SIZE){if(this.cardExporter.cancelExport){this.showError('Export cancelled');return;}const batch=this.cardExporter.bins.slice(i,Math.min(i+BATCH_SIZE,this.cardExporter.bins.length));const batchBins=batch.map(b=>b.bin);const r=await fetch('/api/export-cards',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bins:batchBins,cardsPerBin,status,includeInfo})});const d=await r.json();if(d.success){allCards.push(...d.cards);const progress=((i+batch.length)/this.cardExporter.bins.length*100).toFixed(0);const elapsed=Math.floor((Date.now()-startTime)/1000);const totalCardsExported=allCards.filter(c=>!c.startsWith('#')&&c.trim()).length;const speed=elapsed>0?Math.floor(totalCardsExported/elapsed):0;document.getElementById('exportProgressFill').style.width=progress+'%';document.getElementById('exportProgressText').textContent='Processing '+(i+batch.length)+'/'+this.cardExporter.bins.length+' BINs';document.getElementById('exportedCardsCount').textContent=totalCardsExported;document.getElementById('exportTime').textContent=elapsed;document.getElementById('exportSpeed').textContent=speed;}else{this.showError('Batch export failed: '+d.error);}if(i+BATCH_SIZE<this.cardExporter.bins.length){await new Promise(resolve=>setTimeout(resolve,100));}}document.getElementById('exportOutput').value=allCards.join('\n');document.getElementById('exportResultSection').classList.remove('hidden');document.getElementById('exportProgressSection').classList.add('hidden');const totalCards=allCards.filter(c=>!c.startsWith('#')&&c.trim()).length;this.showSuccess('Exported '+totalCards.toLocaleString()+' cards from '+this.cardExporter.bins.length+' BINs');}catch(e){this.showError('Export failed: '+e.message);document.getElementById('exportProgressSection').classList.add('hidden');}}
cancelExport(){this.cardExporter.cancelExport=true;document.getElementById('exportProgressSection').classList.add('hidden');}
downloadExport(){const content=document.getElementById('exportOutput').value;if(!content){this.showError('Nothing to download');return;}const blob=new Blob([content],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='cards_export_'+Date.now()+'.txt';a.click();URL.revokeObjectURL(url);this.showSuccess('Download started');}
clearCardFilters(){document.getElementById('cardBrandFilter').value='';document.getElementById('cardTypeFilter').value='';document.getElementById('cardCategoryFilter').value='';document.getElementById('cardCountryFilter').value='';document.getElementById('cardIssuerFilter').value='';document.getElementById('minCardsInput').value='10';document.getElementById('cardsPerBinInput').value='50';document.getElementById('maxBinsInput').value='10000';document.getElementById('statusUnknown').checked=true;document.getElementById('statusLive').checked=true;document.getElementById('statusCT').checked=true;document.getElementById('statusDie').checked=false;document.getElementById('cardResultsSection').classList.add('hidden');document.getElementById('exportOptionsSection').classList.add('hidden');document.getElementById('exportResultSection').classList.add('hidden');this.cardExporter.bins=[];}
async normalize(){const input=document.getElementById('normalizeInput').value.trim();if(!input)return this.showError('Please enter cards');const lines=input.split('\n').filter(l=>l.trim());if(lines.length>100000)return this.showError('Maximum 100,000 cards allowed');const btn=document.getElementById('normalizeBtn');const html=btn.innerHTML;btn.disabled=true;btn.innerHTML='<div class="loading inline-block mr-2"></div>Processing...';try{const filterExpired=document.getElementById('filterExpiredCheck').checked;const r=await fetch('/api/normalize',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cards:lines,filterExpired})});const d=await r.json();if(d.success){document.getElementById('normValid').textContent=d.data.validCount;document.getElementById('normError').textContent=d.data.errorCount;document.getElementById('normalizeOutput').value=d.data.valid.join('\n');document.getElementById('normalizeResult').classList.remove('hidden');if(d.data.errorCount>0){document.getElementById('normalizeErrors').value=d.data.errors.join('\n');document.getElementById('normErrorSection').classList.remove('hidden');}else{document.getElementById('normErrorSection').classList.add('hidden');}this.showSuccess('Normalized '+d.data.validCount+' cards');}}catch(e){this.showError('Normalize failed');}finally{btn.disabled=false;btn.innerHTML=html;}}
handleDupFileUpload(e){const file=e.target.files[0];if(!file)return;if(!file.name.endsWith('.txt')){this.showError('Please select a .txt file');return;}const reader=new FileReader();reader.onload=(event)=>{const content=event.target.result;document.getElementById('dupInput').value=content;const lines=content.split('\n').filter(l=>l.trim());document.getElementById('dupCount').textContent=lines.length;this.showSuccess('Loaded '+lines.length+' cards from file');};reader.readAsText(file);e.target.value='';}
async checkDup(){const input=document.getElementById('dupInput').value.trim();if(!input)return this.showError('Please enter cards');const lines=input.split('\n').filter(l=>l.trim());const btn=document.getElementById('dupBtn');const html=btn.innerHTML;btn.disabled=true;btn.innerHTML='<div class="loading inline-block mr-2"></div>Checking...';const BATCH_SIZE=1000;let allUnique=[];let allDuplicates=[];document.getElementById('dupProgress').classList.remove('hidden');try{for(let i=0;i<lines.length;i+=BATCH_SIZE){const batch=lines.slice(i,Math.min(i+BATCH_SIZE,lines.length));const progress=Math.round(((i+batch.length)/lines.length)*100);document.getElementById('dupProgressFill').style.width=progress+'%';document.getElementById('dupProgressText').textContent='Processing '+(i+batch.length)+' / '+lines.length+'...';const r=await fetch('/api/check-duplicates',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cards:batch})});if(!r.ok){const errorText=await r.text();console.error('API Error:',errorText);throw new Error('HTTP '+r.status+': '+errorText.substring(0,100));}const d=await r.json();if(d.success){allUnique.push(...d.data.unique);allDuplicates.push(...d.data.duplicates);}else{throw new Error(d.error||'Unknown error');}if(i+BATCH_SIZE<lines.length){await new Promise(resolve=>setTimeout(resolve,100));}}document.getElementById('dupProgressFill').style.width='100%';document.getElementById('dupProgressText').textContent='Complete!';setTimeout(()=>{document.getElementById('dupProgress').classList.add('hidden');},1000);document.getElementById('dupTotal').textContent=lines.length;document.getElementById('dupUnique').textContent=allUnique.length;document.getElementById('dupDup').textContent=allDuplicates.length;document.getElementById('dupOutput').value=allUnique.join('\n');document.getElementById('dupResult').classList.remove('hidden');if(allDuplicates.length>0){document.getElementById('dupDupOutput').value=allDuplicates.join('\n');document.getElementById('dupDupSection').classList.remove('hidden');}else{document.getElementById('dupDupSection').classList.add('hidden');}this.showSuccess('Found '+allUnique.length+' unique cards');}catch(e){console.error('Check duplicates error:',e);document.getElementById('dupProgress').classList.add('hidden');this.showError('Check failed: '+e.message);}finally{btn.disabled=false;btn.innerHTML=html;}}
handleFileUpload(e){const file=e.target.files[0];if(!file)return;if(!file.name.endsWith('.txt')){this.showError('Please select a .txt file');return;}const reader=new FileReader();reader.onload=(event)=>{const content=event.target.result;document.getElementById('importInput').value=content;const lines=content.split('\n').filter(l=>l.trim());document.getElementById('importCount').textContent=lines.length;this.showSuccess('Loaded '+lines.length+' cards from file');};reader.readAsText(file);e.target.value='';}
async import(){const input=document.getElementById('importInput').value.trim();if(!input)return this.showError('Please enter cards');const lines=input.split('\n').filter(l=>l.trim());if(lines.length>100000)return this.showError('Maximum 100,000 cards allowed');if(!confirm('Import '+lines.length.toLocaleString()+' cards to database?\n\nThis action cannot be undone.'))return;const btn=document.getElementById('importBtn');const html=btn.innerHTML;btn.disabled=true;btn.innerHTML='<div class="loading inline-block mr-2"></div>Importing...';const BATCH_SIZE=1000;let totalImported=0;let totalErrors=0;const allErrors=[];document.getElementById('importProgress').classList.remove('hidden');try{for(let i=0;i<lines.length;i+=BATCH_SIZE){const batch=lines.slice(i,Math.min(i+BATCH_SIZE,lines.length));const progress=Math.round(((i+batch.length)/lines.length)*100);document.getElementById('importProgressFill').style.width=progress+'%';document.getElementById('importProgressText').textContent='Importing '+(i+batch.length)+' / '+lines.length+' cards...';const r=await fetch('/api/import',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cards:batch})});if(!r.ok){const errorText=await r.text();console.error('API Error:',errorText);throw new Error('HTTP '+r.status+': '+errorText.substring(0,100));}const d=await r.json();if(d.success){totalImported+=d.data.imported||0;totalErrors+=d.data.errorCount||0;if(d.data.errors&&d.data.errors.length>0){allErrors.push(...d.data.errors);}}else{throw new Error(d.error||'Unknown error');}if(i+BATCH_SIZE<lines.length){await new Promise(resolve=>setTimeout(resolve,50));}}document.getElementById('importProgressFill').style.width='100%';document.getElementById('importProgressText').textContent='Complete!';setTimeout(()=>{document.getElementById('importProgress').classList.add('hidden');},1000);document.getElementById('impSuccess').textContent=totalImported;document.getElementById('impError').textContent=totalErrors;document.getElementById('importStats').classList.remove('hidden');if(totalErrors>0){document.getElementById('importErrors').value=allErrors.join('\n');document.getElementById('impErrorSection').classList.remove('hidden');}else{document.getElementById('impErrorSection').classList.add('hidden');}this.showSuccess('Successfully imported '+totalImported.toLocaleString()+' cards');this.loadDashboard(true);}catch(e){console.error('Import error:',e);document.getElementById('importProgress').classList.add('hidden');this.showError('Import failed: '+e.message);}finally{btn.disabled=false;btn.innerHTML=html;}}
copy(id){const el=document.getElementById(id);if(!el.value)return this.showError('Nothing to copy');el.select();document.execCommand('copy');this.showSuccess('Copied to clipboard');}
showError(msg){const t=document.createElement('div');t.className='fixed top-20 right-4 glass p-4 rounded-xl shadow-2xl z-50 fade-in';t.innerHTML='<div class="flex items-center gap-3"><i class="fas fa-exclamation-circle text-red-600 text-xl"></i><div><div class="font-semibold text-red-600">Error</div><div class="text-sm text-gray-700">'+msg+'</div></div></div>';document.body.appendChild(t);setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.remove(),300)},4000);}
showSuccess(msg){const t=document.createElement('div');t.className='fixed top-20 right-4 glass p-4 rounded-xl shadow-2xl z-50 fade-in';t.innerHTML='<div class="flex items-center gap-3"><i class="fas fa-check-circle text-green-600 text-xl"></i><div><div class="font-semibold text-green-600">Success</div><div class="text-sm text-gray-700">'+msg+'</div></div></div>';document.body.appendChild(t);setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.remove(),300)},3000);}
}
(()=>{
  const boot = ()=>{
    try {
      const binLookup=new BINLookup();
      function updateCardCount(textareaId,countId){const textarea=document.getElementById(textareaId);const countEl=document.getElementById(countId);if(!textarea||!countEl)return;textarea.addEventListener('input',function(){const lines=this.value.trim().split('\n').filter(l=>l.trim());countEl.textContent=lines.length.toLocaleString();});}
      const f = updateCardCount;
      f('normalizeInput','normalizeCount');
      f('dupInput','dupCount');
      f('importInput','importCount');
      document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();const el=document.getElementById('binInput');if(el)el.focus();}});
    } catch (e) {
      const t=document.createElement('div');
      t.className='fixed top-20 right-4 glass p-4 rounded-xl shadow-2xl z-50 fade-in';
      t.innerHTML='<div class="flex items-center gap-3"><i class="fas fa-exclamation-circle text-red-600 text-xl"></i><div><div class="font-semibold text-red-600">Init Error</div><div class="text-sm text-gray-700">'+(e.message||'Unknown')+'</div></div></div>';
      document.body.appendChild(t);
      setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.remove(),300)},5000);
    }
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
-->
<!-- external app logic already loaded in head with defer -->
</body>
</html>`;
}

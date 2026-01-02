import { Router } from "./router.js";
import { getHTML } from "./html.js";
import { getApp2Js } from "./app2.js";
import { DatabaseService } from "./modules/database.js";
import { getAppJs } from "./appjs.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }
    const router = new Router(env.DB, env.CACHE, env);
    ctx.waitUntil(router.db.ensureIndexes());
    try {
      if (path === "/api/login" && request.method === "POST") return router.login(request);
      if (path.startsWith("/api/")) {
        // Protect all API routes except login (already handled)
        if (path !== "/api/login") {
          const authorized = await router.verifyAuth(request);
          if (!authorized) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }
      }      if (path === "/" || path === "/index.html") {
        try {
          const db = new DatabaseService(env.DB);
          const s = await db.getDashboardStats();
          let html = getHTML();
          const grid = `<div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4"><div class="glass p-4 rounded-xl text-center"><i class="fas fa-database text-3xl text-indigo-600 mb-2"></i><div class="text-3xl font-bold text-gray-900">${(s.totalRecords||0).toLocaleString()}</div><div class="text-sm text-gray-600">Total BINs</div></div><div class="glass p-4 rounded-xl text-center"><i class="fas fa-credit-card text-3xl text-blue-600 mb-2"></i><div class="text-3xl font-bold text-gray-900">${(s.totalCards||0).toLocaleString()}</div><div class="text-sm text-gray-600">Total Cards</div></div><div class="glass p-4 rounded-xl text-center"><i class="fas fa-check-circle text-3xl text-green-600 mb-2"></i><div class="text-3xl font-bold text-gray-900">${(s.liveCards||0).toLocaleString()}</div><div class="text-sm text-gray-600">Live Cards</div></div><div class="glass p-4 rounded-xl text-center"><i class="fas fa-times-circle text-3xl text-red-600 mb-2"></i><div class="text-3xl font-bold text-gray-900">${(s.dieCards||0).toLocaleString()}</div><div class="text-sm text-gray-600">Expired</div></div></div>`;
          html = html.replace('<div id="dashContent">\n<div class="text-center py-8"><div class="loading inline-block"></div></div>\n</div>', `<div id="dashContent">${grid}</div>`);
          return new Response(html, { headers: { 
            "Content-Type": "text/html", 
            "Cache-Control": "no-store, no-cache, must-revalidate", 
            "Link": "</app2.js?v=7>; rel=preload; as=script, <https://cdn.tailwindcss.com>; rel=preconnect, <https://cdnjs.cloudflare.com>; rel=preconnect, <https://fonts.googleapis.com>; rel=preconnect" 
          } });
        } catch {
          return new Response(getHTML(), { headers: { 
            "Content-Type": "text/html", 
            "Link": "</app2.js?v=7>; rel=preload; as=script, <https://cdn.tailwindcss.com>; rel=preconnect, <https://cdnjs.cloudflare.com>; rel=preconnect, <https://fonts.googleapis.com>; rel=preconnect" 
          } });
        }
      }
      if (path === "/app.js") return new Response(getAppJs(), { headers: { "Content-Type": "application/javascript" } });
      if (path === "/app2.js") return new Response(getApp2Js(), { headers: { "Content-Type": "application/javascript", "Cache-Control": "no-store, no-cache, must-revalidate" } });
      if (path === "/api/bin") return router.search(request);
      if (path === "/api/bin/export") return router.export(request);
      if (path === "/api/stats") return router.stats();
      if (path === "/api/dashboard") return router.dashboard();
      if (path === "/api/filters") return router.filters();
      if (path === "/api/card-stats" && request.method === "GET") return router.cardStats();
      if (path === "/api/search-bins" && request.method === "POST") return router.searchBins(request);
      if (path === "/api/export-cards" && request.method === "POST") return router.exportCards(request);
      if (path === "/api/normalize" && request.method === "POST") return router.normalizeCards?.(request) || new Response(JSON.stringify({ success: false, error: "Not found" }), { status: 404 });
      if (path === "/api/check-duplicates" && request.method === "POST") return router.checkDuplicates?.(request) || new Response(JSON.stringify({ success: false, error: "Not found" }), { status: 404 });
      if (path === "/api/import" && request.method === "POST") return router.importCards?.(request) || new Response(JSON.stringify({ success: false, error: "Not found" }), { status: 404 });
      if (path === "/api/rebuild-stats" && request.method === "POST") return router.rebuildStats(request, env);
      const match = path.match(/^\/api\/bin\/([^\/]+)$/);
      if (match) return router.getBIN(match[1]);
      return new Response(JSON.stringify({ success: false, error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("[Worker] Error:", error);
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};

/* =====================================================================
   service-worker.js — minimal cache-first offline support.

   Caches every file the app needs on first load, then serves everything
   from that cache afterwards so the app keeps working with no internet
   (the only online-only feature is the optional Google Sheet upload,
   which fails silently on its own if there's no connection — see app.js).

   If you add/rename files in images/ (e.g. when editing tasks-config.js
   to use a new picture), bump CACHE_NAME below (e.g. "v2") so the
   service worker knows to re-cache everything on the next load.
   ===================================================================== */

const CACHE_NAME = "ghar-kaam-cache-v2";
const FILES_TO_CACHE = [
  "./",
  "index.html",
  "manifest.json",
  "css/style.css",
  "js/tasks-config.js",
  "js/app.js",
  "icons/icon.svg",

  // task images
  "images/kitchen_slab.svg",
  "images/utensils_put_back.svg",
  "images/window_sill.svg",
  "images/fold_clothes.svg",
  "images/make_bed.svg",
  "images/dustbin.svg",
  "images/broom_corners.svg",
  "images/dust_sofa.svg",
  "images/washroom_taps.svg",
  "images/balcony_bookshelf.svg",
  "images/toothbrush_rack.svg",
  "images/soap_rack.svg",
  "images/toilet_seat.svg",
  "images/windows_clean.svg",
  "images/mirrors_clean.svg",
  "images/doors_clean.svg",
  "images/wash_clothes_bin.svg",
  "images/dry_washed_clothes.svg",
  "images/cupboards_clean.svg",
  "images/bags_clean.svg",
  "images/fridge_clean.svg",
  "images/dry_wm_clothes.svg",
  "images/utensils_deep_clean.svg",
  "images/dust_all_surfaces.svg",
  "images/deep_clean_room.svg",
  "images/room_shelf.svg",
  "images/tiffin_rubber_seal.svg",

  // ui icons
  "images/checkmark.svg",
  "images/cross.svg",
  "images/start.svg"
];

// Install: pre-cache all known app files.
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old cache versions.
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) { return key !== CACHE_NAME; })
          .map(function (key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first, falling back to network, and caching new
// same-origin responses as we go (so nothing has to be listed twice).
self.addEventListener("fetch", function (event) {
  // Only handle GET requests for our own origin — let everything else
  // (like the Google Sheet POST) go straight to the network untouched.
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then(function (networkResponse) {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            event.request.url.indexOf(self.location.origin) === 0
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(function () {
          // Offline and not cached — nothing sensible to return.
          return new Response("", { status: 504, statusText: "Offline" });
        });
    })
  );
});

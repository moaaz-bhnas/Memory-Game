/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "images/akasaka.png",
    "revision": "5c0559bfb5025bb82ad31cc14faaeb60"
  },
  {
    "url": "images/armin.png",
    "revision": "bf756e9877715194026926e2df0e95f6"
  },
  {
    "url": "images/gon.png",
    "revision": "247cd866cd0870ce7a3f6c55e42ffa1d"
  },
  {
    "url": "images/hisoka.png",
    "revision": "bf1caca1ab33ab61f31804ccbbebe80e"
  },
  {
    "url": "images/Illumi.png",
    "revision": "8e54a51f9635ba8d6333544ca8cafbb3"
  },
  {
    "url": "images/killua.png",
    "revision": "e983b7cb71b290043102932e23506bf6"
  },
  {
    "url": "images/kite.png",
    "revision": "e55876619e00b6bb1c312e63cb993544"
  },
  {
    "url": "images/kurapica.png",
    "revision": "231d2c3ca007838f60c29797a01dd252"
  },
  {
    "url": "images/tanaka.png",
    "revision": "12c9957548d19c5719e515f0a9854c04"
  },
  {
    "url": "index.html",
    "revision": "a841e5008ae8718114d15cf111959445"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

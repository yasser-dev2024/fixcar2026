"use strict";

const menuButton = document.querySelector("#menuButton");
const primaryNav = document.querySelector("#primaryNav");
const shareButton = document.querySelector("#shareButton");
const copyHashButton = document.querySelector("#copyHash");
const hashValue = document.querySelector("#apkHash");
const toast = document.querySelector("#toast");
const previewDialog = document.querySelector("#previewDialog");
const previewImage = document.querySelector("#previewImage");
const previewCaption = document.querySelector("#previewCaption");
const previewClose = document.querySelector("#previewClose");
const year = document.querySelector("#year");
let toastTimer;

function setMenu(open) {
  if (!menuButton || !primaryNav) return;
  primaryNav.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
}

function showToast(title, message) {
  if (!toast) return;
  const titleNode = toast.querySelector("strong");
  const messageNode = toast.querySelector("small");
  if (titleNode) titleNode.textContent = title;
  if (messageNode) messageNode.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3200);
}

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  if (!copied) throw new Error("copy failed");
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  setMenu(!isOpen);
});

primaryNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

document.addEventListener("click", (event) => {
  if (!primaryNav?.classList.contains("is-open")) return;
  if (primaryNav.contains(event.target) || menuButton?.contains(event.target)) return;
  setMenu(false);
});

shareButton?.addEventListener("click", async () => {
  const shareData = {
    title: "تطبيق مساعدي",
    text: "تطبيق مساعدي لإدارة مراكز صيانة السيارات",
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await copyText(window.location.href);
    showToast("تم نسخ الرابط", "يمكنك الآن مشاركة رابط صفحة التحميل.");
  } catch (error) {
    if (error?.name !== "AbortError") {
      showToast("تعذرت المشاركة", "انسخ الرابط من شريط العنوان وشاركه مباشرة.");
    }
  }
});

copyHashButton?.addEventListener("click", async () => {
  try {
    await copyText(hashValue?.textContent?.trim() || "");
    showToast("تم نسخ البصمة", "يمكن استخدامها للتحقق من سلامة ملف APK.");
  } catch {
    showToast("تعذر النسخ", "حدد البصمة وانسخها يدويًا.");
  }
});

document.querySelectorAll("[data-download]").forEach((link) => {
  link.addEventListener("click", () => {
    showToast("بدأ تنزيل مساعدي", "إذا ظهر تحذير Android فاختر السماح من هذا المصدر.");
  });
});

document.querySelectorAll(".screen-card").forEach((card) => {
  card.addEventListener("click", () => {
    const image = card.querySelector("img");
    const caption = card.querySelector("strong");
    if (!image || !previewDialog || !previewImage) return;

    previewImage.src = image.src;
    previewImage.alt = image.alt;
    if (previewCaption) previewCaption.textContent = caption?.textContent || image.alt;

    if (typeof previewDialog.showModal === "function") {
      previewDialog.showModal();
    }
  });
});

previewClose?.addEventListener("click", () => previewDialog?.close());

previewDialog?.addEventListener("click", (event) => {
  if (event.target === previewDialog) previewDialog.close();
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -60px", threshold: 0.08 },
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (year) year.textContent = String(new Date().getFullYear());

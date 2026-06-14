const root = document.documentElement;
const cursorLight = document.querySelector(".cursor-light");
const homeLink = document.querySelector(".brand");
const projectViewer = document.getElementById("project-viewer");
const projectFrame = document.getElementById("project-frame");
const projectCards = document.querySelectorAll("[data-project-id]");
const headerLinks = document.querySelectorAll(".site-header nav a");
const heroContactLink = document.querySelector(".contact-bar");
const projectUrls = [
  "projects/herborist.html?embed=20260614d",
  "projects/sisters-who-make-waves.html?embed=20260614d",
  "projects/cherie-life-chinese-restaurant.html?embed=20260614d",
  "projects/dforward-gala.html?embed=20260614d",
  "projects/meet-your-self.html?embed=20260614d",
  "projects/neorality.html?embed=20260614d",
  "projects/de-gree.html?embed=20260614d",
  "projects/bravod.html?embed=20260614d",
];
let activeProjectId = 0;

const scrollHomeTo = (section) => {
  const target = section === "top" ? document.documentElement : document.getElementById(section);
  window.requestAnimationFrame(() => {
    if (section === "top") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
};

const showHome = (section = "top", updateHistory = true) => {
  activeProjectId = 0;
  projectViewer.hidden = true;
  document.body.classList.remove("project-open");
  if (updateHistory) {
    const hash = section === "top" ? "" : `#${section}`;
    window.history.pushState({ view: "home", section }, "", `${window.location.pathname}${window.location.search}${hash}`);
  }
  scrollHomeTo(section);
};

const showProject = (projectId, updateHistory = true) => {
  const id = Number(projectId);
  const source = projectUrls[id - 1];
  if (!source || !projectViewer || !projectFrame) return;

  activeProjectId = id;
  document.body.classList.add("project-open");
  projectViewer.hidden = false;
  const absoluteSource = new URL(source, window.location.href).href;
  try {
    projectFrame.contentWindow.location.replace(absoluteSource);
  } catch {
    projectFrame.src = absoluteSource;
  }
  if (updateHistory) {
    window.history.pushState({ view: "project", projectId: id }, "", `#project-${id}`);
  }
};

homeLink?.addEventListener("click", (event) => {
  event.preventDefault();
  showHome("top");
});

projectCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();
    showProject(card.dataset.projectId);
  });
});

headerLinks.forEach((link) => {
  const section = link.getAttribute("href")?.replace("#", "");
  link.addEventListener("click", (event) => {
    if (!activeProjectId) return;
    event.preventDefault();
    if (section === "contact") {
      heroContactLink?.click();
      return;
    }
    showHome(section || "top");
  });
});

window.addEventListener("message", (event) => {
  const message = event.data;
  if (!message || message.source !== "audrey-project") return;
  if (message.type === "home") showHome(message.section || "work");
  if (message.type === "project") showProject(message.projectId);
});

window.addEventListener("popstate", () => {
  const match = window.location.hash.match(/^#project-([1-8])$/);
  if (match) {
    showProject(Number(match[1]), false);
  } else {
    showHome(window.location.hash.replace("#", "") || "top", false);
  }
});

const initialProject = window.location.hash.match(/^#project-([1-8])$/);
if (initialProject) {
  window.history.replaceState({ view: "project", projectId: Number(initialProject[1]) }, "", window.location.href);
  showProject(Number(initialProject[1]), false);
} else {
  window.history.replaceState(
    { view: "home", section: window.location.hash.replace("#", "") || "top" },
    "",
    window.location.href
  );
}

const cursorState = {
  currentX: window.innerWidth / 2,
  currentY: window.innerHeight * 0.42,
  targetX: window.innerWidth / 2,
  targetY: window.innerHeight * 0.42,
  hasMoved: false,
};

const moveCursorLight = () => {
  if (!cursorLight) return;
  const cursorX = `${cursorState.currentX}px`;
  const cursorY = `${cursorState.currentY}px`;
  root.style.setProperty("--cursor-x", cursorX);
  root.style.setProperty("--cursor-y", cursorY);
  cursorLight.style.transform = `translate3d(${cursorX}, ${cursorY}, 0) translate(-50%, -50%)`;
};

const getBoundedProjectCursorTarget = (event) => {
  const targetElement = event.target instanceof Element ? event.target : null;
  const hoveredProject = targetElement?.closest(
    ".featured-work-layout .project-card, .featured-work-layout .herborist-feature"
  );
  const media = hoveredProject?.querySelector(".project-media, .herborist-feature__media");
  if (!media) return null;

  const rect = media.getBoundingClientRect();
  const inset = Math.min(26, rect.width / 2, rect.height / 2);
  return {
    x: Math.min(Math.max(event.clientX, rect.left + inset), rect.right - inset),
    y: Math.min(Math.max(event.clientY, rect.top + inset), rect.bottom - inset),
  };
};

const updateMouseInteraction = (event) => {
  const x = `${event.clientX}px`;
  const y = `${event.clientY}px`;
  const depthX = ((event.clientX / window.innerWidth) - 0.5).toFixed(3);
  const depthY = ((event.clientY / window.innerHeight) - 0.5).toFixed(3);
  const boundedProjectTarget = getBoundedProjectCursorTarget(event);
  cursorState.targetX = boundedProjectTarget?.x ?? event.clientX;
  cursorState.targetY = boundedProjectTarget?.y ?? event.clientY;
  if (!cursorState.hasMoved) {
    cursorState.currentX = cursorState.targetX;
    cursorState.currentY = cursorState.targetY;
    cursorState.hasMoved = true;
    moveCursorLight();
  }
  cursorLight?.classList.add("is-active");
  cursorLight?.classList.toggle("is-project-bounded", Boolean(boundedProjectTarget));
  root.style.setProperty("--mouse-x", x);
  root.style.setProperty("--mouse-y", y);
  root.style.setProperty("--hero-x", depthX);
  root.style.setProperty("--hero-y", depthY);
};

root.style.setProperty("--mouse-x", "50vw");
root.style.setProperty("--mouse-y", "42vh");
root.style.setProperty("--cursor-x", "50vw");
root.style.setProperty("--cursor-y", "42vh");
root.style.setProperty("--hero-x", "0");
root.style.setProperty("--hero-y", "0");
moveCursorLight();

const mouseInteractionOptions = { passive: true, capture: true };

window.addEventListener("pointermove", updateMouseInteraction, mouseInteractionOptions);
window.addEventListener("mousemove", updateMouseInteraction, mouseInteractionOptions);
document.addEventListener("pointermove", updateMouseInteraction, mouseInteractionOptions);
document.addEventListener("mousemove", updateMouseInteraction, mouseInteractionOptions);
document.addEventListener("pointerdown", updateMouseInteraction, mouseInteractionOptions);

const animateCursorLight = () => {
  cursorState.currentX += (cursorState.targetX - cursorState.currentX) * 0.18;
  cursorState.currentY += (cursorState.targetY - cursorState.currentY) * 0.18;
  moveCursorLight();
  requestAnimationFrame(animateCursorLight);
};

animateCursorLight();

const revealItems = document.querySelectorAll(".section, .project-card, .contact");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => {
  item.classList.add("reveal");
  observer.observe(item);
});

document.querySelectorAll(".about-portrait video").forEach((video) => {
  const frame = video.closest(".about-portrait");
  let resetTimer;

  video.load();

  const playPortrait = () => {
    window.clearTimeout(resetTimer);
    video.play().catch(() => {});
  };

  const pausePortrait = () => {
    video.pause();
    resetTimer = window.setTimeout(() => {
      video.currentTime = 0;
    }, 80);
  };

  frame.addEventListener("pointerenter", playPortrait);
  frame.addEventListener("mouseenter", playPortrait);
  frame.addEventListener("focusin", playPortrait);
  frame.addEventListener("touchstart", playPortrait, { passive: true });
  frame.addEventListener("pointerleave", pausePortrait);
  frame.addEventListener("mouseleave", pausePortrait);
  frame.addEventListener("focusout", pausePortrait);
});

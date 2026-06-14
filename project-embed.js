(() => {
  if (window.self === window.top) return;

  const params = new URL(document.currentScript.src).searchParams;
  const projectId = Number(params.get("project"));
  const projectNames = [
    "Herborist & Yanxi Palace",
    "Sisters Who Make Waves · Season1",
    "Chinese Restaurant S5 & Cherie Life",
    "D.Forward 4th Anniversary Gala",
    "Meet Your Self",
    "Neorality",
    "DE-GREE",
    "Bravod",
  ];

  document.documentElement.classList.add("embedded-project");

  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: "Audrey Optima";
      src: url("../assets/fonts/Optima-Regular.ttf") format("truetype");
      font-display: swap;
      font-style: normal;
      font-weight: 400;
    }
    .site-header { display: none !important; }
    body { padding-top: 0 !important; }
    main { padding-top: 104px; }
    .hero { padding-top: 54px !important; }
    .back-link,
    .pager .lbl {
      color: #f5f1e8 !important;
      font-family: "Audrey Optima", Optima, Candara, "Segoe UI", sans-serif !important;
      font-size: 16px !important;
      font-weight: 700 !important;
      letter-spacing: 0 !important;
      opacity: 0.74;
      text-transform: uppercase;
    }
    .pager .lbl {
      margin-bottom: 6px;
    }
    .pager a:last-child:only-child,
    .pager .wrap > a:last-child {
      margin-left: auto;
    }
    @media (max-width: 760px) {
      main { padding-top: 82px; }
      .hero { padding-top: 38px !important; }
    }
  `;
  document.head.appendChild(style);

  const send = (type, payload = {}) => {
    window.parent.postMessage({ source: "audrey-project", type, ...payload }, "*");
  };

  document.querySelectorAll(".back-link").forEach((link) => {
    link.href = "#work";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      send("home", { section: "work" });
    });
  });

  const pagerLinks = document.querySelectorAll(".pager a");
  const previous = pagerLinks[0];
  const next = pagerLinks[1];

  const configurePagerLink = (link, targetId, label) => {
    if (!link) return;
    if (targetId < 1 || targetId > projectNames.length) {
      link.hidden = true;
      return;
    }
    link.hidden = false;
    link.href = `#project-${targetId}`;
    const name = link.querySelector(".ph");
    if (name) name.textContent = projectNames[targetId - 1];
    link.setAttribute("aria-label", `${label}: ${projectNames[targetId - 1]}`);
    link.addEventListener("click", (event) => {
      event.preventDefault();
      send("project", { projectId: targetId });
    });
  };

  const previousProjectId = projectId === 1 ? projectNames.length : projectId - 1;
  const nextProjectId = projectId === projectNames.length ? 1 : projectId + 1;
  configurePagerLink(previous, previousProjectId, "Previous project");
  configurePagerLink(next, nextProjectId, "Next project");

  send("ready", { projectId });
})();

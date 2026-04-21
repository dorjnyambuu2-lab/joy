(function () {
  var cfg = window.__FIREBASE_CONFIG__;
  var dbStatus = document.getElementById("db-status");
  var form = document.getElementById("contact-form");
  var formStatus = document.getElementById("form-status");
  var submitBtn = document.getElementById("submit-btn");
  var themeToggle = document.getElementById("theme-toggle");
  var themeIcon = document.getElementById("theme-icon");
  var skillsList = document.getElementById("skills-list");
  var mainNavLinks = document.getElementById("main-nav-links");
  var newsItems = document.getElementById("news-items");
  var defaultSkills = [
    {
      name: "Visual Studio Code",
      type: "Code Editor",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
    },
    {
      name: "React JS",
      type: "Framework",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
    },
    {
      name: "Next JS",
      type: "Framework",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
    },
    {
      name: "Tailwind CSS",
      type: "Framework",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
    },
    {
      name: "Bootstrap",
      type: "Framework",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg"
    },
    {
      name: "Javascript",
      type: "Language",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
    },
    {
      name: "Node JS",
      type: "Javascript Runtime",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
    },
    {
      name: "Github",
      type: "Repository",
      icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    },
    {
      name: "Kotlin",
      type: "Language",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg"
    },
    {
      name: "HTML",
      type: "Language",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
    },
    {
      name: "CSS",
      type: "Language",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
    },
    {
      name: "PHP",
      type: "Language",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg"
    },
    {
      name: "MySql",
      type: "Framework",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
    },
    {
      name: "Flutter",
      type: "Framework",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg"
    },
    {
      name: "Oracle",
      type: "Database",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg"
    },
    {
      name: "Firebase",
      type: "Platform",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg"
    }
  ];

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function applyTheme(theme) {
    var t = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
    if (document.body) document.body.setAttribute("data-theme", t);
    document.documentElement.classList.toggle("theme-light", t === "light");
    document.documentElement.classList.toggle("theme-dark", t !== "light");
    if (themeToggle) {
      var lightActive = t === "light";
      themeToggle.setAttribute("aria-pressed", String(lightActive));
      themeToggle.setAttribute(
        "aria-label",
        lightActive ? "Dark mode руу шилжих" : "Light mode руу шилжих"
      );
      if (themeIcon) themeIcon.textContent = lightActive ? "☀️" : "🌙";
    }
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem("site-theme");
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem("site-theme", theme);
    } catch (e) {
      /* ignore storage errors */
    }
  }

  var savedTheme = getStoredTheme();
  if (!savedTheme) {
    savedTheme =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
  }
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme") || "dark";
      var next = current === "light" ? "dark" : "light";
      applyTheme(next);
      setStoredTheme(next);
    });
  }

  function isConfigPlaceholder() {
    if (!cfg || typeof cfg !== "object") return true;
    var v = JSON.stringify(cfg);
    return (
      v.indexOf("ТАНЫ_") !== -1 ||
      !cfg.apiKey ||
      cfg.apiKey === "ТАНЫ_API_KEY" ||
      !cfg.projectId ||
      cfg.projectId === "ТАНЫ_ТӨСӨЛ_ID"
    );
  }

  function setDbStatus(kind, text) {
    if (!dbStatus) return;
    dbStatus.className = "db-status " + kind;
    dbStatus.textContent = text;
  }

  function normalizeSkills(skills) {
    if (!Array.isArray(skills)) return [];
    return skills
      .map(function (item) {
        if (typeof item === "string") {
          return { name: item, type: "Skill", icon: "" };
        }
        if (!item || typeof item !== "object") return null;
        return {
          name: String(item.name || item.title || "").trim(),
          type: String(item.type || item.category || "Skill").trim(),
          icon: String(item.icon || item.image || "").trim()
        };
      })
      .filter(function (item) {
        return item && item.name;
      });
  }

  function renderSkills(skills) {
    if (!skillsList) return;
    var normalized = normalizeSkills(skills);
    var finalSkills = normalized.length ? normalized : defaultSkills;
    skillsList.innerHTML = "";

    finalSkills.forEach(function (skill) {
      var card = document.createElement("article");
      var skillSlug = String(skill.name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      card.className = "skill-card" + (skillSlug ? " is-" + skillSlug : "");

      var iconWrap = document.createElement("span");
      iconWrap.className = "skill-icon-wrap";

      var icon = document.createElement("img");
      icon.className = "skill-icon";
      icon.alt = skill.name + " icon";
      icon.loading = "lazy";
      icon.referrerPolicy = "no-referrer";
      if (skill.icon) {
        icon.src = skill.icon;
      } else {
        icon.style.display = "none";
        iconWrap.style.display = "none";
      }
      icon.onerror = function () {
        this.style.display = "none";
        iconWrap.style.display = "none";
      };

      var meta = document.createElement("div");
      var name = document.createElement("p");
      name.className = "skill-name";
      name.textContent = skill.name;
      var type = document.createElement("p");
      type.className = "skill-type";
      type.textContent = skill.type;

      iconWrap.appendChild(icon);
      meta.appendChild(name);
      meta.appendChild(type);
      card.appendChild(iconWrap);
      card.appendChild(meta);
      skillsList.appendChild(card);
    });
  }

  function normalizeNavItems(items) {
    if (!Array.isArray(items)) return [];
    return items
      .map(function (item) {
        if (!item || typeof item !== "object") return null;
        var label = String(item.label || "").trim();
        var link = String(item.link || "").trim();
        if (!label || !link) return null;
        return { label: label, link: link };
      })
      .filter(Boolean);
  }

  function renderNav(items) {
    if (!mainNavLinks) return;
    var list = normalizeNavItems(items);
    if (!list.length) return;
    mainNavLinks.innerHTML = "";
    list.forEach(function (item) {
      var a = document.createElement("a");
      a.href = item.link;
      a.textContent = item.label;
      mainNavLinks.appendChild(a);
    });
  }

  function normalizeContentItems(items) {
    if (!Array.isArray(items)) return [];
    return items
      .map(function (item) {
        if (!item || typeof item !== "object") return null;
        var title = String(item.title || "").trim();
        var type = String(item.type || "news").trim();
        var content = String(item.content || "").trim();
        var image = String(item.image || "").trim();
        var link = String(item.link || "").trim();
        var createdAt = Number(item.createdAt || 0);
        if (!title || !content) return null;
        return {
          title: title,
          type: type,
          content: content,
          image: image,
          link: link,
          createdAt: createdAt
        };
      })
      .filter(Boolean)
      .sort(function (a, b) {
        return b.createdAt - a.createdAt;
      });
  }

  function renderContentItems(items) {
    if (!newsItems) return;
    var list = normalizeContentItems(items);
    newsItems.innerHTML = "";
    if (!list.length) {
      var p = document.createElement("p");
      p.textContent = "Одоогоор мэдээ, төсөл алга.";
      newsItems.appendChild(p);
      return;
    }
    list.forEach(function (item) {
      var article = document.createElement("article");
      article.className = "news-item";
      var badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = item.type;
      var title = document.createElement("h3");
      title.className = "news-item-title";
      title.textContent = item.title;
      var content = document.createElement("p");
      content.className = "news-item-content";
      content.textContent = item.content;
      if (item.image) {
        var img = document.createElement("img");
        img.className = "news-item-image";
        img.src = item.image;
        img.alt = item.title + " зураг";
        img.loading = "lazy";
        img.onerror = function () {
          this.style.display = "none";
        };
        article.appendChild(img);
      }
      if (item.link) {
        var link = document.createElement("a");
        link.className = "news-item-link";
        link.href = item.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Төслийн холбоос";
        article.appendChild(link);
      }
      article.appendChild(badge);
      article.appendChild(title);
      article.appendChild(content);
      newsItems.appendChild(article);
    });
  }

  renderSkills(defaultSkills);

  if (isConfigPlaceholder()) {
    setDbStatus(
      "error",
      "Firebase тохиргоо хийгээгүй байна. js/firebase-config.js дотор өөрийн төслийн түлхүүрүүдийг оруулна уу."
    );
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        formStatus.textContent =
          "Эхлээд Firebase config-ийг бөглөж, Firestore-ийг идэвхжүүлнэ үү.";
        formStatus.className = "form-status err";
      });
    }
    return;
  }

  var app;
  try {
    app = firebase.initializeApp(cfg);
  } catch (e) {
    setDbStatus("error", "Firebase эхлүүлэхэд алдаа: " + (e.message || String(e)));
    return;
  }

  var db = firebase.firestore(app);

  db.collection("site")
    .doc("profile")
    .get()
    .then(function (snap) {
      if (!snap.exists) {
        setDbStatus(
          "connected",
          "Firestore холбогдлоо. (profile баримт байхгүй — үндсэн текст ашиглана.)"
        );
        return;
      }
      var d = snap.data() || {};
      if (d.displayName) {
        var el = document.getElementById("hero-name");
        if (el) el.textContent = d.displayName;
      }
      if (d.role) {
        var badge = document.getElementById("hero-badge");
        if (badge) badge.textContent = d.role;
      }
      if (d.aboutHtml) {
        var about = document.getElementById("about-body");
        if (about) about.innerHTML = d.aboutHtml;
      } else if (d.about) {
        var aboutText = document.getElementById("about-body");
        if (aboutText) {
          aboutText.innerHTML = "";
          var p = document.createElement("p");
          p.textContent = d.about;
          aboutText.appendChild(p);
        }
      }
      setDbStatus("connected", "Firestore-оос профайл ачаалагдлаа.");
    })
    .catch(function (err) {
      setDbStatus(
        "error",
        "Өгөгдөл уншихад алдаа: " +
          (err.code || "") +
          " " +
          (err.message || String(err)) +
          " — Firestore дүрмээ шалгана уу."
      );
    });

  db.collection("site")
    .doc("skills")
    .get()
    .then(function (snap) {
      if (!snap.exists) return;
      var d = snap.data() || {};
      if (Array.isArray(d.items) && d.items.length) {
        var mapped = d.items.map(function (item) {
          return {
            name: item.label || "",
            type: item.link || "Skill",
            icon: item.icon || ""
          };
        });
        renderSkills(mapped);
      }
    })
    .catch(function () {
      /* ignore */
    });

  db.collection("site")
    .doc("navigation")
    .get()
    .then(function (snap) {
      if (!snap.exists) return;
      var d = snap.data() || {};
      renderNav(d.items);
    })
    .catch(function () {
      /* ignore */
    });

  db.collection("site")
    .doc("content")
    .get()
    .then(function (snap) {
      if (!snap.exists) return;
      var d = snap.data() || {};
      renderContentItems(d.items);
    })
    .catch(function () {
      /* ignore */
    });

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      formStatus.textContent = "";
      formStatus.className = "form-status";

      var name = document.getElementById("name").value.trim();
      var email = document.getElementById("email").value.trim();
      var message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = "Бүх талбарыг бөглөнө үү.";
        formStatus.className = "form-status err";
        return;
      }

      submitBtn.disabled = true;
      db.collection("messages")
        .add({
          name: name,
          email: email,
          message: message,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function () {
          formStatus.textContent = "Амжилттай илгээгдлээ. Баярлалаа!";
          formStatus.className = "form-status ok";
          form.reset();
        })
        .catch(function (err) {
          formStatus.textContent =
            "Илгээхэд алдаа: " + (err.message || String(err));
          formStatus.className = "form-status err";
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();

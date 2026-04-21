/**
 * Firestore дүрэм (Firebase Console → Firestore → Rules) жишээ:
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /messages/{id} {
 *       allow create: if request.resource.data.keys().hasAll(['name','email','message']);
 *       allow read, delete: if request.auth != null;
 *     }
 *     match /site/{document=**} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *   }
 * }
 *
 * Authentication → Sign-in method: Email/Password идэвхжүүлж, админ хэрэглэгчээ үүсгэнэ.
 * Бүртгэлийг хаах: зөвхөн таны и-мэйл үлдэхийн тулд Firebase Auth тохиргоог ашиглана уу.
 */
(function () {
  var cfg = window.__FIREBASE_CONFIG__;
  var loginSection = document.getElementById("login-section");
  var loginForm = document.getElementById("login-form");
  var loginStatus = document.getElementById("login-status");
  var loginBtn = document.getElementById("login-btn");
  var dashboard = document.getElementById("dashboard");
  var logoutBtn = document.getElementById("logout-btn");
  var adminUserInfo = document.getElementById("admin-user-info");
  var messagesList = document.getElementById("messages-list");
  var messagesStatus = document.getElementById("messages-status");
  var tabMessages = document.getElementById("tab-messages");
  var tabProfile = document.getElementById("tab-profile");
  var tabMenu = document.getElementById("tab-menu");
  var tabNews = document.getElementById("tab-news");
  var panelMessages = document.getElementById("panel-messages");
  var panelProfile = document.getElementById("panel-profile");
  var panelMenu = document.getElementById("panel-menu");
  var panelNews = document.getElementById("panel-news");
  var profileForm = document.getElementById("profile-form");
  var profileStatus = document.getElementById("profile-status");
  var profileSaveBtn = document.getElementById("profile-save-btn");
  var menuForm = document.getElementById("menu-form");
  var menuList = document.getElementById("menu-list");
  var menuStatus = document.getElementById("menu-status");
  var menuSaveBtn = document.getElementById("menu-save-btn");
  var menuCancelBtn = document.getElementById("menu-cancel-btn");
  var newsForm = document.getElementById("news-form");
  var newsList = document.getElementById("news-list");
  var newsStatus = document.getElementById("news-status");
  var newsSaveBtn = document.getElementById("news-save-btn");
  var newsCancelBtn = document.getElementById("news-cancel-btn");
  var configWarning = document.getElementById("config-warning");
  var localDevHint = document.getElementById("local-dev-hint");
  var themeToggle = document.getElementById("theme-toggle");
  var themeIcon = document.getElementById("theme-icon");
  var defaultSkillItems = [
    { label: "Visual Studio Code", link: "Code Editor", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
    { label: "React JS", link: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { label: "Next JS", link: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    { label: "Tailwind CSS", link: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
    { label: "Bootstrap", link: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
    { label: "Javascript", link: "Language", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { label: "Node JS", link: "Javascript Runtime", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { label: "Github", link: "Repository", icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" },
    { label: "Kotlin", link: "Language", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
    { label: "HTML", link: "Language", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { label: "CSS", link: "Language", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { label: "PHP", link: "Language", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
    { label: "MySql", link: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { label: "Flutter", link: "Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" },
    { label: "Oracle", link: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg" },
    { label: "Firebase", link: "Platform", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" }
  ];

  function isConfigPlaceholder() {
    if (!cfg || typeof cfg !== "object") return true;
    var v = JSON.stringify(cfg);
    return (
      v.indexOf("ТАНЫ_") !== -1 ||
      !cfg.apiKey ||
      cfg.apiKey === "ТАНЫ_API_KEY" ||
      cfg.apiKey === "AIzaSy..." ||
      !cfg.projectId ||
      cfg.projectId === "ТАНЫ_ТӨСӨЛ_ID"
    );
  }

  function mapAuthError(err) {
    var code = err && err.code ? String(err.code) : "";
    var useLocalServer =
      typeof window !== "undefined" && window.location.protocol === "file:";
    var fileHint = useLocalServer
      ? " Зөвлөмж: хуудсыг шууд файл болгон биш http://localhost дээр нээнэ (VS Code Live Server эсвэл төслийн хавтас дээр npx --yes serve)."
      : "";

    switch (code) {
      case "auth/invalid-credential":
      case "auth/invalid-login-credentials":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return (
          "И-мэйл эсвэл нууц үг тохирохгүй байна, эсвэл энэ и-мэйлтэй хэрэглэгч Firebase Authentication-д үүсээгүй байна. " +
          "Firebase Console → Authentication → Users → Add user-аар админ хэрэглэгчээ үүсгээд зөв нууц үгээр оролдоно уу." +
          fileHint
        );
      case "auth/invalid-email":
        return "И-мэйл хаягийн формат буруу байна.";
      case "auth/user-disabled":
        return "Энэ бүртгэлийг идэвхгүй болгосон байна.";
      case "auth/too-many-requests":
        return "Хэт олон оролдлого. Түр хүлээгээд дахин оролдоно уу.";
      case "auth/unauthorized-domain":
        return (
          "Энэ хаягаас нэвтрэхийг Firebase зөвшөөрөөгүй байна. Authentication → Settings → Authorized domains-д домэйноо нэмнэ үү." +
          fileHint
        );
      default:
        return (err && err.message) || String(err);
    }
  }

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
    } catch (e) {}
  }

  var savedTheme = getStoredTheme();
  if (!savedTheme) {
    savedTheme =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
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

  if (isConfigPlaceholder()) {
    if (configWarning) {
      configWarning.hidden = false;
      configWarning.textContent =
        "Firebase config (js/firebase-config.js) бүрэн бөглөгдөөгүй байна. Эхлээд түлхүүрээ оруулна уу.";
    }
    return;
  }

  var app;
  try {
    app = firebase.initializeApp(cfg);
  } catch (e) {
    if (configWarning) {
      configWarning.hidden = false;
      configWarning.textContent = "Firebase: " + (e.message || String(e));
    }
    return;
  }

  var auth = firebase.auth(app);
  var db = firebase.firestore(app);

  if (localDevHint && typeof window !== "undefined" && window.location.protocol === "file:") {
    localDevHint.hidden = false;
    localDevHint.textContent =
      "Анхаар: Та хуудсыг file:/// … дээр нээж байна. Firebase нэвтрэлтийг тогтвортой ажиллуулахын тулд төслийн хавтас дээр терминалаас \"npx --yes serve\" ажиллуулаад гарсан http://localhost хаягаар нээнэ үү.";
  }

  function showLogin() {
    if (loginSection) loginSection.hidden = false;
    if (dashboard) dashboard.hidden = true;
  }

  function showDashboard(user) {
    if (loginSection) loginSection.hidden = true;
    if (dashboard) dashboard.hidden = false;
    if (adminUserInfo) adminUserInfo.textContent = user && user.email ? user.email : "";
    loadMessages();
    loadProfileForm();
    loadMenus();
    loadNews();
  }

  function tsToDate(ts) {
    if (!ts) return null;
    if (typeof ts.toDate === "function") return ts.toDate();
    if (ts.seconds) return new Date(ts.seconds * 1000);
    return null;
  }

  function formatWhen(ts) {
    var d = tsToDate(ts);
    if (!d || isNaN(d.getTime())) return "—";
    return d.toLocaleString("mn-MN");
  }

  function loadMessages() {
    if (!messagesList) return;
    messagesList.innerHTML = "";
    if (messagesStatus) messagesStatus.textContent = "Ачааллаж байна…";

    db.collection("messages")
      .get()
      .then(function (snap) {
        var rows = [];
        snap.forEach(function (doc) {
          rows.push({ id: doc.id, data: doc.data() || {} });
        });
        rows.sort(function (a, b) {
          var ta = tsToDate(a.data.createdAt);
          var tb = tsToDate(b.data.createdAt);
          var ma = ta ? ta.getTime() : 0;
          var mb = tb ? tb.getTime() : 0;
          return mb - ma;
        });

        if (messagesStatus) {
          messagesStatus.textContent =
            rows.length === 0 ? "Мессеж алга." : rows.length + " мессеж.";
        }

        rows.forEach(function (row) {
          var d = row.data;
          var wrap = document.createElement("article");
          wrap.className = "admin-msg";

          var head = document.createElement("div");
          head.className = "admin-msg-head";

          var who = document.createElement("strong");
          who.textContent = (d.name || "(нэргүй)") + " · " + (d.email || "");

          var when = document.createElement("span");
          when.className = "admin-msg-when";
          when.textContent = formatWhen(d.createdAt);

          var del = document.createElement("button");
          del.type = "button";
          del.className = "btn btn-small btn-danger";
          del.textContent = "Устгах";
          del.setAttribute("data-id", row.id);

          head.appendChild(who);
          head.appendChild(when);
          head.appendChild(del);

          var body = document.createElement("p");
          body.className = "admin-msg-body";
          body.textContent = d.message || "";

          wrap.appendChild(head);
          wrap.appendChild(body);
          messagesList.appendChild(wrap);

          del.addEventListener("click", function () {
            if (!confirm("Энэ мессежийг устгах уу?")) return;
            del.disabled = true;
            db.collection("messages")
              .doc(row.id)
              .delete()
              .then(function () {
                wrap.remove();
                if (messagesStatus) {
                  var left = messagesList.querySelectorAll(".admin-msg").length;
                  messagesStatus.textContent = left === 0 ? "Мессеж алга." : left + " мессеж.";
                }
              })
              .catch(function (err) {
                del.disabled = false;
                alert("Устгахад алдаа: " + (err.message || String(err)));
              });
          });
        });
      })
      .catch(function (err) {
        if (messagesStatus) {
          messagesStatus.textContent =
            "Уншихад алдаа: " + (err.code || "") + " " + (err.message || String(err));
        }
      });
  }

  function loadProfileForm() {
    db.collection("site")
      .doc("profile")
      .get()
      .then(function (snap) {
        var d = snap.exists ? snap.data() || {} : {};
        var el;

        el = document.getElementById("pf-displayName");
        if (el) el.value = d.displayName || "";

        el = document.getElementById("pf-role");
        if (el) el.value = d.role || "";

        el = document.getElementById("pf-about");
        if (el) {
          if (d.about) el.value = d.about;
          else if (d.aboutHtml)
            el.value = d.aboutHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          else el.value = "";
        }
      })
      .catch(function () {
        /* ignore */
      });
  }

  function resetMenuForm() {
    if (!menuForm) return;
    menuForm.reset();
    document.getElementById("menu-id").value = "";
    document.getElementById("menu-icon-current").value = "";
  }

  function resetNewsForm() {
    if (!newsForm) return;
    newsForm.reset();
    document.getElementById("news-id").value = "";
    document.getElementById("news-image-current").value = "";
    document.getElementById("news-type").value = "project";
    document.getElementById("news-link").value = "";
  }

  function readImageFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      if (!file) {
        resolve("");
        return;
      }
      if (!file.type || file.type.indexOf("image/") !== 0) {
        reject(new Error("Зөвхөн зураг файл сонгоно уу."));
        return;
      }
      if (file.size > 700 * 1024) {
        reject(new Error("Зургийн хэмжээ 700KB-аас бага байх хэрэгтэй."));
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        resolve(String(reader.result || ""));
      };
      reader.onerror = function () {
        reject(new Error("Зураг уншихад алдаа гарлаа."));
      };
      reader.readAsDataURL(file);
    });
  }

  function loadMenus() {
    if (!menuList) return;
    menuList.innerHTML = "";
    db.collection("site")
      .doc("skills")
      .get()
      .then(function (snap) {
        var items = [];
        if (snap.exists) {
          var data = snap.data() || {};
          items = Array.isArray(data.items) ? data.items : [];
        }
        if (!items.length) {
          return db
            .collection("site")
            .doc("skills")
            .set({ items: defaultSkillItems }, { merge: true })
            .then(function () {
              loadMenus();
              if (menuStatus) {
                menuStatus.className = "form-status ok";
              }
            });
        }
        items.forEach(function (item, index) {
          var row = document.createElement("article");
          row.className = "admin-msg";

          var head = document.createElement("div");
          head.className = "admin-msg-head";

          var title = document.createElement("strong");
          title.textContent = (item.label || "Нэргүй") + " · " + (item.link || "Төрөлгүй");
          if (item.icon) {
            var iconImg = document.createElement("img");
            iconImg.src = item.icon;
            iconImg.alt = "icon";
            iconImg.className = "admin-item-icon";
            head.appendChild(iconImg);
          }

          var right = document.createElement("div");
          right.className = "admin-row-actions";

          var editBtn = document.createElement("button");
          editBtn.type = "button";
          editBtn.className = "btn btn-small btn-ghost";
          editBtn.textContent = "Засах";

          var delBtn = document.createElement("button");
          delBtn.type = "button";
          delBtn.className = "btn btn-small btn-danger";
          delBtn.textContent = "Устгах";

          right.appendChild(editBtn);
          right.appendChild(delBtn);
          head.appendChild(title);
          head.appendChild(right);
          row.appendChild(head);
          menuList.appendChild(row);

          editBtn.addEventListener("click", function () {
            document.getElementById("menu-id").value = String(index);
            document.getElementById("menu-label").value = item.label || "";
            document.getElementById("menu-link").value = item.link || "";
            document.getElementById("menu-icon-current").value = item.icon || "";
            document.getElementById("menu-icon").value = "";
          });

          delBtn.addEventListener("click", function () {
            if (!confirm("Энэ цэсийг устгах уу?")) return;
            var next = items.slice();
            next.splice(index, 1);
            db.collection("site")
              .doc("skills")
              .set({ items: next }, { merge: true })
              .then(function () {
                resetMenuForm();
                loadMenus();
              })
              .catch(function (err) {
                alert("Ур чадвар устгахад алдаа: " + (err.message || String(err)));
              });
          });
        });
      })
      .catch(function (err) {
        if (menuStatus) {
          menuStatus.textContent = "Ур чадвар ачаалахад алдаа: " + (err.message || String(err));
          menuStatus.className = "form-status err";
        }
      });
  }

  function loadNews() {
    if (!newsList) return;
    newsList.innerHTML = "";
    db.collection("site")
      .doc("content")
      .get()
      .then(function (snap) {
        var items = [];
        if (snap.exists) {
          var data = snap.data() || {};
          items = Array.isArray(data.items) ? data.items : [];
        }
        items.sort(function (a, b) {
          return Number(b.createdAt || 0) - Number(a.createdAt || 0);
        });
        if (!items.length) {
          var empty = document.createElement("p");
          empty.className = "admin-muted";
          empty.textContent = "Одоогоор төсөл бүртгэгдээгүй байна.";
          newsList.appendChild(empty);
          return;
        }

        items.forEach(function (item, index) {
          var row = document.createElement("article");
          row.className = "admin-msg";

          var head = document.createElement("div");
          head.className = "admin-msg-head";

          var title = document.createElement("strong");
          title.textContent = (item.title || "Гарчиггүй") + " · " + (item.type || "project");

          var right = document.createElement("div");
          right.className = "admin-row-actions";

          var editBtn = document.createElement("button");
          editBtn.type = "button";
          editBtn.className = "btn btn-small btn-ghost";
          editBtn.textContent = "Засах";

          var delBtn = document.createElement("button");
          delBtn.type = "button";
          delBtn.className = "btn btn-small btn-danger";
          delBtn.textContent = "Устгах";

          right.appendChild(editBtn);
          right.appendChild(delBtn);
          head.appendChild(title);
          head.appendChild(right);

          var body = document.createElement("p");
          body.className = "admin-msg-body";
          body.textContent = item.content || "";

          row.appendChild(head);
          row.appendChild(body);
          if (item.image) {
            var preview = document.createElement("img");
            preview.className = "admin-news-image-preview";
            preview.src = item.image;
            preview.alt = (item.title || "Төсөл") + " зураг";
            preview.loading = "lazy";
            preview.onerror = function () {
              this.style.display = "none";
            };
            row.appendChild(preview);
          }
          if (item.link) {
            var linkEl = document.createElement("a");
            linkEl.className = "admin-news-link";
            linkEl.href = item.link;
            linkEl.target = "_blank";
            linkEl.rel = "noopener noreferrer";
            linkEl.textContent = "Төслийн холбоос";
            row.appendChild(linkEl);
          }
          newsList.appendChild(row);

          editBtn.addEventListener("click", function () {
            document.getElementById("news-id").value = String(index);
            document.getElementById("news-title").value = item.title || "";
            document.getElementById("news-type").value = item.type || "project";
            document.getElementById("news-content").value = item.content || "";
            document.getElementById("news-image-current").value = item.image || "";
            document.getElementById("news-image").value = "";
            document.getElementById("news-link").value = item.link || "";
          });

          delBtn.addEventListener("click", function () {
            if (!confirm("Энэ мэдээллийг устгах уу?")) return;
            var next = items.slice();
            next.splice(index, 1);
            db.collection("site")
              .doc("content")
              .set({ items: next }, { merge: true })
              .then(function () {
                resetNewsForm();
                loadNews();
              })
              .catch(function (err) {
                alert("Төсөл устгахад алдаа: " + (err.message || String(err)));
              });
          });
        });
      })
      .catch(function (err) {
        if (newsStatus) {
          newsStatus.textContent = "Төсөл ачаалахад алдаа: " + (err.message || String(err));
          newsStatus.className = "form-status err";
        }
      });
  }

  function setTab(which) {
    var isMsg = which === "messages";
    var isProfile = which === "profile";
    var isMenu = which === "menu";
    var isNews = which === "news";
    if (panelMessages) panelMessages.hidden = !isMsg;
    if (panelProfile) panelProfile.hidden = !isProfile;
    if (panelMenu) panelMenu.hidden = !isMenu;
    if (panelNews) panelNews.hidden = !isNews;
    if (tabMessages) tabMessages.setAttribute("aria-pressed", String(isMsg));
    if (tabProfile) tabProfile.setAttribute("aria-pressed", String(isProfile));
    if (tabMenu) tabMenu.setAttribute("aria-pressed", String(isMenu));
    if (tabNews) tabNews.setAttribute("aria-pressed", String(isNews));
  }

  if (tabMessages && tabProfile && tabMenu && tabNews) {
    tabMessages.addEventListener("click", function () {
      setTab("messages");
    });
    tabProfile.addEventListener("click", function () {
      setTab("profile");
    });
    tabMenu.addEventListener("click", function () {
      setTab("menu");
    });
    tabNews.addEventListener("click", function () {
      setTab("news");
    });
  }

  auth.onAuthStateChanged(function (user) {
    if (user) showDashboard(user);
    else showLogin();
  });

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (loginStatus) {
        loginStatus.textContent = "";
        loginStatus.className = "form-status";
      }

      var email = document.getElementById("admin-email").value.trim();
      var password = document.getElementById("admin-password").value;

      if (!email || !password) {
        if (loginStatus) {
          loginStatus.textContent = "И-мэйл болон нууц үг оруулна уу.";
          loginStatus.className = "form-status err";
        }
        return;
      }

      if (loginBtn) loginBtn.disabled = true;
      auth
        .signInWithEmailAndPassword(email, password)
        .catch(function (err) {
          if (loginStatus) {
            loginStatus.textContent = "Нэвтрэхэд алдаа: " + mapAuthError(err);
            loginStatus.className = "form-status err";
          }
        })
        .finally(function () {
          if (loginBtn) loginBtn.disabled = false;
        });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      auth.signOut();
    });
  }

  if (profileForm) {
    profileForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (profileStatus) {
        profileStatus.textContent = "";
        profileStatus.className = "form-status";
      }

      var payload = {
        displayName: document.getElementById("pf-displayName").value.trim(),
        role: document.getElementById("pf-role").value.trim(),
        about: document.getElementById("pf-about").value.trim()
      };

      if (profileSaveBtn) profileSaveBtn.disabled = true;
      db.collection("site")
        .doc("profile")
        .set(payload, { merge: true })
        .then(function () {
          if (profileStatus) {
            profileStatus.textContent = "Хадгалагдлаа.";
            profileStatus.className = "form-status ok";
          }
        })
        .catch(function (err) {
          if (profileStatus) {
            profileStatus.textContent =
              "Алдаа: " + (err.message || String(err));
            profileStatus.className = "form-status err";
          }
        })
        .finally(function () {
          if (profileSaveBtn) profileSaveBtn.disabled = false;
        });
    });
  }

  if (menuCancelBtn) {
    menuCancelBtn.addEventListener("click", function () {
      resetMenuForm();
      if (menuStatus) menuStatus.textContent = "";
    });
  }

  if (menuForm) {
    menuForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (menuStatus) {
        menuStatus.textContent = "";
        menuStatus.className = "form-status";
      }
      var label = document.getElementById("menu-label").value.trim();
      var link = document.getElementById("menu-link").value.trim();
      var iconCurrent = document.getElementById("menu-icon-current").value.trim();
      var iconFile = document.getElementById("menu-icon").files[0];
      var idxRaw = document.getElementById("menu-id").value.trim();
      if (!label || !link) {
        if (menuStatus) {
          menuStatus.textContent = "Ур чадварын нэр болон төрлөө бөглөнө үү.";
          menuStatus.className = "form-status err";
        }
        return;
      }
      if (menuSaveBtn) menuSaveBtn.disabled = true;
      readImageFileAsDataUrl(iconFile)
        .then(function (iconDataUrl) {
          var icon = iconDataUrl || iconCurrent;
          return db
            .collection("site")
        .doc("skills")
        .get()
        .then(function (snap) {
          var items = [];
          if (snap.exists) {
            var data = snap.data() || {};
            items = Array.isArray(data.items) ? data.items : [];
          }
          var item = { label: label, link: link, icon: icon };
          if (idxRaw !== "") items[Number(idxRaw)] = item;
          else items.push(item);
          return db.collection("site").doc("skills").set({ items: items }, { merge: true });
        });
        })
        .then(function () {
          resetMenuForm();
          loadMenus();
          if (menuStatus) {
            menuStatus.textContent = "Ур чадвар хадгалагдлаа.";
            menuStatus.className = "form-status ok";
          }
        })
        .catch(function (err) {
          if (menuStatus) {
            menuStatus.textContent = "Алдаа: " + (err.message || String(err));
            menuStatus.className = "form-status err";
          }
        })
        .finally(function () {
          if (menuSaveBtn) menuSaveBtn.disabled = false;
        });
    });
  }

  if (newsCancelBtn) {
    newsCancelBtn.addEventListener("click", function () {
      resetNewsForm();
      if (newsStatus) newsStatus.textContent = "";
    });
  }

  if (newsForm) {
    newsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (newsStatus) {
        newsStatus.textContent = "";
        newsStatus.className = "form-status";
      }
      var title = document.getElementById("news-title").value.trim();
      var type = document.getElementById("news-type").value.trim() || "project";
      var content = document.getElementById("news-content").value.trim();
      var imageCurrent = document.getElementById("news-image-current").value.trim();
      var imageFile = document.getElementById("news-image").files[0];
      var link = document.getElementById("news-link").value.trim();
      var idxRaw = document.getElementById("news-id").value.trim();
      if (!title || !content) {
        if (newsStatus) {
          newsStatus.textContent = "Гарчиг болон агуулгаа бөглөнө үү.";
          newsStatus.className = "form-status err";
        }
        return;
      }
      if (newsSaveBtn) newsSaveBtn.disabled = true;
      readImageFileAsDataUrl(imageFile)
        .then(function (imageDataUrl) {
          var image = imageDataUrl || imageCurrent;
          return db
            .collection("site")
        .doc("content")
        .get()
        .then(function (snap) {
          var items = [];
          if (snap.exists) {
            var data = snap.data() || {};
            items = Array.isArray(data.items) ? data.items : [];
          }
          var baseCreatedAt = Date.now();
          if (idxRaw !== "" && items[Number(idxRaw)] && items[Number(idxRaw)].createdAt) {
            baseCreatedAt = Number(items[Number(idxRaw)].createdAt);
          }
          var item = {
            title: title,
            type: type,
            content: content,
            image: image,
            link: link,
            createdAt: baseCreatedAt,
            updatedAt: Date.now()
          };
          if (idxRaw !== "") items[Number(idxRaw)] = item;
          else items.push(item);
          return db.collection("site").doc("content").set({ items: items }, { merge: true });
        });
        })
        .then(function () {
          resetNewsForm();
          loadNews();
          if (newsStatus) {
            newsStatus.textContent = "Төсөл хадгалагдлаа.";
            newsStatus.className = "form-status ok";
          }
        })
        .catch(function (err) {
          if (newsStatus) {
            newsStatus.textContent = "Алдаа: " + (err.message || String(err));
            newsStatus.className = "form-status err";
          }
        })
        .finally(function () {
          if (newsSaveBtn) newsSaveBtn.disabled = false;
        });
    });
  }
})();

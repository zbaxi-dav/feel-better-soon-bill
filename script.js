var BACK4APP_APP_ID     = "qXEff9vPu2LGhHeJwnqsV148GCTI34LmOS20tdf4";
var BACK4APP_JS_KEY     = "gHYXSRALl23k27drXnTskhbVdk1sMCttMOkSeNqN";
var BACK4APP_SERVER_URL = "https://parseapi.back4app.com";

function initParse() {
  Parse.initialize(BACK4APP_APP_ID, BACK4APP_JS_KEY);
  Parse.serverURL = BACK4APP_SERVER_URL;
}

function fetchMessages() {
  var list = document.querySelector("#notes-list");
  if (!list) return;

  var WellNote = Parse.Object.extend("WellNote");
  var query = new Parse.Query(WellNote);
  query.descending("createdAt").find().then(function(results) {
    list.innerHTML = "";
    results.forEach(function(obj) {
      var div = document.createElement("div");
      div.className = "note-item";
      div.innerHTML = `
        <div class="note-name">${obj.get("author") || "Anonymous"}</div>
        <div class="note-msg">${obj.get("message") || ""}</div>
      `;
      list.appendChild(div);
    });
  });
}

window.addEventListener('DOMContentLoaded', function() {
  var card = document.querySelector("#card");
  var openBtn = document.querySelector("#open-btn");
  var closeBtn = document.querySelector("#close-btn");
  var notesSection = document.querySelector("#notes-section");
  var modal = document.querySelector("#modal-overlay");

  openBtn.addEventListener("click", function() {
    card.classList.add("active");
    notesSection.style.display = "block";
    setTimeout(function() {
        notesSection.classList.add("visible");
    }, 10);
    openBtn.style.display = "none";
    closeBtn.style.display = "inline-block";
    fetchMessages();
  });

  closeBtn.addEventListener("click", function() {
    card.classList.remove("active");
    notesSection.classList.remove("visible");
    setTimeout(function() {
        notesSection.style.display = "none";
    }, 500); 
    closeBtn.style.display = "none";
    openBtn.style.display = "inline-block";
  });

  document.querySelector("#student-link").onclick = function() { modal.classList.add("visible"); };
  document.querySelector("#modal-close").onclick = function() { modal.classList.remove("visible"); };

  document.querySelector("#send-btn").onclick = function() {
    var author = document.querySelector("#author-input").value.trim();
    var msg = document.querySelector("#message-input").value.trim();
    if (!author || !msg) return alert("Please fill both fields!");

    var WellNote = Parse.Object.extend("WellNote");
    var note = new WellNote();
    note.save({ author: author, message: msg }).then(function() {
      document.querySelector("#author-input").value = "";
      document.querySelector("#message-input").value = "";
      modal.classList.remove("visible");
      fetchMessages();
    });
  };
});

(function() {
  var s = document.createElement("script");
  s.src = "https://npmcdn.com/parse/dist/parse.min.js";
  s.onload = initParse;
  document.head.appendChild(s);
})();

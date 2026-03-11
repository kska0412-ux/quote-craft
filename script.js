document.addEventListener("DOMContentLoaded", () => {
  const steps = {
    step1: document.getElementById("step1"),
    step2: document.getElementById("step2"),
    step3: document.getElementById("step3"),
    step4: document.getElementById("step4"),
  };

  const sidebar = document.getElementById("rulesSidebar");
  const originalPost = document.getElementById("originalPost");
  const authorName = document.getElementById("authorName");
  const analyzeBtn = document.getElementById("analyzeBtn");

  const selectedPatterns = new Set();

  // Pattern tips for craft area
  const patternTips = {
    1: {
      name: "固有名詞フック型",
      tip: "冒頭に視認性の高い固有名詞（人名・ブランド・作品名）を置いてください。その固有名詞と記事の本質を、あなただけの視点で接続します。",
      placeholder:
        "例：\nサカナクションのライブに行くたび思う。\n情報過多の時代に「引き算」ができる人間が勝つ。\nこの記事がまさにそれを証明してる。",
    },
    2: {
      name: "違和感フック型",
      tip: "1行目に常識と矛盾する一文を。2行目で「〇〇な人は必読」とターゲットを絞ります。みんなが思ってるけど言えないことを代弁してください。",
      placeholder:
        "例：\n生徒に一番優しい先生が、一番最初にAIに仕事を奪われる。\n「寄り添い」を武器にしてる人ほど読んだ方がいい。",
    },
    3: {
      name: "ターゲット再定義型",
      tip: "元記事の対象を「〇〇な△△は必読」と再定義。条件を付けて「自分のことかも」と思わせ、元記事がリーチしていない層を引き込みます。",
      placeholder:
        "例：\n「まだ自分で全部やってる」と胸を張ってる\n個人事業主は全員読んだ方がいい。\n勤勉さが足かせになる構造がここに書いてある。",
    },
    4: {
      name: "本質圧縮型",
      tip: "長文記事の本質を、日常会話で使う一言に圧縮してください。記事の「サムネイル」になって、読者に「気になる」と思わせる入口を作ります。",
      placeholder:
        "例：\n魚の釣り方を教えるな。\n釣れる川に連れていけ。\nこの記事はその設計図。",
    },
    5: {
      name: "映像化型",
      tip: "元記事の抽象概念を、具体的な場面・人物に置き換えます。固有名詞を軸にしつつ、通説への否定を入れてギャップを作ってください。",
      placeholder:
        "例：\n「頑張れ」と声をかける上司より、\n黙ってNotionのテンプレを渡す先輩の方が\n100倍、人を動かしてる。",
    },
    6: {
      name: "情景描写型",
      tip: "「感動した」「共感した」ではなく、動詞で情景を描きます。読者の脳内に映像が再生される一文を。自分の体験を情景として重ねてください。",
      placeholder:
        "例：\n深夜2時、生徒のDMに返信しながら\n「丁寧にやってる自分」に酔ってた。\nダン・コーは同じ時間、寝てた。売上は10倍。",
    },
    7: {
      name: "比喩型",
      tip: "「〇〇さんのポストは△△」という形で、日常的なものに喩えます。敬意と親しみを両立させ、読者も参加したくなる大喜利フォーマットに。",
      placeholder:
        "例：\nこの記事はビジネス版の取扱説明書。\n「努力してるのに動かない」人の\n電池の向きが逆だと教えてくれる。",
    },
    8: {
      name: "著者代弁型",
      tip: "著者の思想パターンを読み取り、著者が立場上言えないことを代弁します。違和感あるフックで始め、本質をやや尖らせて書いてください。",
      placeholder:
        "例：\nこの人が本当に言いたいのは\n「お前らの努力は方向が間違ってる」だと思う。\nでも優しいから仕組みの話に翻訳してくれてる。",
    },
  };

  // Step 1: Enable analyze button when text is entered
  originalPost.addEventListener("input", () => {
    analyzeBtn.disabled = originalPost.value.trim().length === 0;
  });

  // Step navigation
  function showStep(stepId) {
    Object.values(steps).forEach((s) => s.classList.add("hidden"));
    steps[stepId].classList.remove("hidden");

    // Show sidebar from step 3 onwards
    if (stepId === "step3" || stepId === "step4") {
      sidebar.classList.remove("hidden");
    } else {
      sidebar.classList.add("hidden");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  analyzeBtn.addEventListener("click", () => showStep("step2"));
  document
    .getElementById("backToStep1")
    .addEventListener("click", () => showStep("step1"));
  document
    .getElementById("toPatterns")
    .addEventListener("click", () => showStep("step3"));
  document
    .getElementById("backToStep2")
    .addEventListener("click", () => showStep("step2"));
  document
    .getElementById("backToStep3")
    .addEventListener("click", () => showStep("step3"));

  // Pattern selection
  document.querySelectorAll(".pattern-card").forEach((card) => {
    card.addEventListener("click", () => {
      const patternId = card.dataset.pattern;
      if (selectedPatterns.has(patternId)) {
        selectedPatterns.delete(patternId);
        card.classList.remove("selected");
      } else {
        selectedPatterns.add(patternId);
        card.classList.add("selected");
      }
      document.getElementById("toCraft").disabled = selectedPatterns.size === 0;
    });
  });

  // Go to craft
  document.getElementById("toCraft").addEventListener("click", () => {
    buildCraftArea();
    showStep("step4");
  });

  function buildCraftArea() {
    const craftArea = document.getElementById("craftArea");
    craftArea.innerHTML = "";

    // Show original post summary
    const summary = document.createElement("div");
    summary.className = "craft-block";
    summary.style.borderColor = "var(--border-active)";
    const postPreview =
      originalPost.value.length > 100
        ? originalPost.value.substring(0, 100) + "..."
        : originalPost.value;
    const author = authorName.value ? ` (${authorName.value})` : "";
    summary.innerHTML = `
      <h3>引用元</h3>
      <p style="font-size:13px;color:var(--text-muted);margin-top:4px;">${escapeHtml(postPreview)}${escapeHtml(author)}</p>
    `;
    craftArea.appendChild(summary);

    // Build craft block for each selected pattern
    const sorted = [...selectedPatterns].sort();
    sorted.forEach((id) => {
      const info = patternTips[id];
      const block = document.createElement("div");
      block.className = "craft-block";
      block.innerHTML = `
        <h3>${info.name}</h3>
        <p class="craft-tip">${info.tip}</p>
        <textarea class="craft-textarea" data-pattern="${id}" placeholder="${info.placeholder}"></textarea>
        <div class="char-count" data-count="${id}">0 / 140</div>
        <button class="copy-btn" data-copy="${id}">コピー</button>
      `;
      craftArea.appendChild(block);
    });

    // Char count
    craftArea.querySelectorAll(".craft-textarea").forEach((ta) => {
      ta.addEventListener("input", () => {
        const id = ta.dataset.pattern;
        const count = ta.value.length;
        const counter = craftArea.querySelector(`[data-count="${id}"]`);
        counter.textContent = `${count} / 140`;
        counter.className = "char-count";
        if (count > 140) counter.classList.add("over");
        else if (count > 120) counter.classList.add("warning");
      });
    });

    // Copy buttons
    craftArea.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.copy;
        const ta = craftArea.querySelector(`[data-pattern="${id}"]`);
        if (ta.value.trim()) {
          navigator.clipboard.writeText(ta.value).then(() => {
            btn.textContent = "コピーしました";
            btn.classList.add("copied");
            setTimeout(() => {
              btn.textContent = "コピー";
              btn.classList.remove("copied");
            }, 2000);
          });
        }
      });
    });
  }

  // Reset
  document.getElementById("resetAll").addEventListener("click", () => {
    originalPost.value = "";
    authorName.value = "";
    analyzeBtn.disabled = true;
    document
      .querySelectorAll(".analysis-card input")
      .forEach((i) => (i.value = ""));
    selectedPatterns.clear();
    document
      .querySelectorAll(".pattern-card")
      .forEach((c) => c.classList.remove("selected"));
    document.getElementById("toCraft").disabled = true;
    showStep("step1");
  });

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
});

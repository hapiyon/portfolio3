/* ===== ナビゲーション ===== */

const header = document.querySelector('.header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');

// スクロールでヘッダーに影をつける
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
  updateActiveLink();
});

// ハンバーガーメニュー開閉
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
});

// メニュー項目クリックで閉じる
navAnchors.forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

// アクティブリンクの更新
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 80;

  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < bottom);
    }
  });
}


/* ===== スクロールアニメーション ===== */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // 同じ親要素内の要素に少しずつ遅延をつける
        const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
        siblings.forEach((el, idx) => {
          if (el === entry.target) {
            el.style.transitionDelay = `${idx * 80}ms`;
          }
        });
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


/* ===== よくある質問（アコーディオン） ===== */

document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling; // 直後の .faq-answer を取得
    const isOpen = button.getAttribute('aria-expanded') === 'true';

    // クリックされたものを開閉する
    button.setAttribute('aria-expanded', !isOpen);
    answer.hidden = isOpen;
  });
});


/* ===== お問い合わせフォーム ===== */

const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formResult = document.getElementById('form-result');

function setError(fieldId, msg) {
  const input = document.getElementById(fieldId);
  const errEl = document.getElementById(`${fieldId}-error`);
  input.classList.toggle('error', !!msg);
  errEl.textContent = msg;
}

function validateForm() {
  let valid = true;

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name) {
    setError('name', 'お名前を入力してください');
    valid = false;
  } else {
    setError('name', '');
  }

  if (!email) {
    setError('email', 'メールアドレスを入力してください');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('email', '正しいメールアドレスを入力してください');
    valid = false;
  } else {
    setError('email', '');
  }

  if (!message) {
    setError('message', 'メッセージを入力してください');
    valid = false;
  } else if (message.length < 10) {
    setError('message', '10文字以上入力してください');
    valid = false;
  } else {
    setError('message', '');
  }

  return valid;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formResult.className = 'form-result';
  formResult.style.display = 'none';

  if (!validateForm()) return;

  // Formspree の form ID が設定されていない場合はデモメッセージ
  const action = form.getAttribute('action');
  if (action.includes('YOUR_FORM_ID')) {
    formResult.textContent = '✅ 送信完了しました！（デモ: Formspreeの設定後に実際に送信されます）';
    formResult.className = 'form-result success';
    form.reset();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = '送信中...';

  try {
    const res = await fetch(action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      formResult.textContent = '✅ お問い合わせを受け付けました。近日中にご連絡いたします。';
      formResult.className = 'form-result success';
      form.reset();
    } else {
      throw new Error('送信失敗');
    }
  } catch {
    formResult.textContent = '❌ 送信に失敗しました。時間をおいて再度お試しください。';
    formResult.className = 'form-result error';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '送信する';
  }
});

// リアルタイムバリデーション（フォーカスが外れたとき）
['name', 'email', 'message'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('blur', validateForm);
  el.addEventListener('input', () => {
    if (el.classList.contains('error')) validateForm();
  });
});

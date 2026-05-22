 
  // --- お問い合わせフォームの送信制御 ---
    document.getElementById('contactForm')?.addEventListener('submit', async function(e) {
        // 通常の画面が白くなるページ遷移（デフォルトの挙動）を防止
        e.preventDefault();

        const form = this;
        const submitBtn = form.querySelector('.form-submit-btn');
        const originalBtnHtml = submitBtn.innerHTML;

        // 送信ボタンの二重送信防止設定
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.style.opacity = '0.6';
        submitBtn.style.pointerEvents = 'none';

        const formData = new FormData(form);

        try {
            // バックエンドへ非同期送信
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // クロスドメイン制限を回避して確実に到達させる
            });

            // 送信完了演出
            const cardSection = document.getElementById('contact');
            if (cardSection) {
                cardSection.style.opacity = '0';
                setTimeout(() => {
                    cardSection.innerHTML = `
                        <h2 style="color: var(--primary);">Thank You!</h2>
                        <p style="font-size: 1.1rem; margin-top: 1.5rem;">メッセージは正常に送信されました。<br>リアルタイムにコックピット（PWA）へ通知されました。</p>
                        <div style="text-align: center; margin-top: 2rem;">
                            <div style="display:inline-block; width: 12px; height: 12px; background: var(--accent); border-radius:50%; box-shadow: 0 0 12px var(--accent);"></div>
                        </div>
                    `;
                    cardSection.style.opacity = '1';
                }, 400);
            }

        } catch (error) {
            console.error('Submission Error:', error);
            alert('送信中にエラーが発生しました。時間を置いて再度お試しください。');
            
            // エラー時は送信ボタンを再度有効にする
            submitBtn.innerHTML = originalBtnHtml;
            submitBtn.style.opacity = '1';
            submitBtn.style.pointerEvents = 'auto';
        }
    });

    // --- スクロールインジケーターの制御 ---
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progress = document.getElementById("scroll-progress");
        if (progress) progress.style.width = scrolled + "%";
    });

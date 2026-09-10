(() => {
  const root = document.documentElement;
  const defaults = { color: 'standard', contrast: 'standard', spacing: 'false', links: 'false', motion: 'device', largeText: 'false', theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' };
  const saved = JSON.parse(localStorage.getItem('sbfc-accessibility') || '{}');
  const prefs = { ...defaults, ...saved };

  function apply() {
    root.dataset.color = prefs.color;
    root.dataset.contrast = prefs.contrast;
    root.dataset.spacing = String(prefs.spacing);
    root.dataset.links = String(prefs.links);
    root.dataset.motion = prefs.motion;
    root.dataset.largeText = String(prefs.largeText);
    root.dataset.theme = prefs.theme;
    root.dataset.appearance = prefs.theme;
    root.style.fontSize = prefs.largeText === 'true' ? '118%' : '100%';
    localStorage.setItem('sbfc-accessibility', JSON.stringify(prefs));
  }

  apply();
  document.querySelector('.theme-toggle')?.addEventListener('click', () => { prefs.theme = prefs.theme === 'dark' ? 'light' : 'dark'; apply(); location.reload(); });
  const menu = document.querySelector('.club-menu-toggle');
  const nav = document.querySelector('#club-navigation');
  menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') === 'true'; menu.setAttribute('aria-expanded', String(!open)); nav?.classList.toggle('open', !open); });

  const progress = document.querySelector('.reading-progress');
  const top = document.querySelector('.back-to-top');
  addEventListener('scroll', () => { const max = document.documentElement.scrollHeight - innerHeight; const value = max > 0 ? Math.round(scrollY / max * 100) : 0; progress?.style.setProperty('--read', value); progress?.setAttribute('aria-valuenow', value); top?.classList.toggle('visible', scrollY > 500); });
  top?.addEventListener('click', () => scrollTo({ top: 0, behavior: prefs.motion === 'reduce' ? 'auto' : 'smooth' }));

  const trigger = document.querySelector('.access-trigger');
  trigger?.addEventListener('click', () => {
    const wrap = document.createElement('div');
    wrap.className = 'access-backdrop';
    wrap.innerHTML = `<section class="access-panel" role="dialog" aria-modal="true" aria-labelledby="access-title"><button class="access-close" aria-label="Fechar">×</button><div class="access-heading"><span>DO SEU JEITO</span><h2 id="access-title">Acessibilidade</h2><p>Ajuste sua leitura. As preferências valem para todas as páginas e ficam salvas neste navegador.</p></div><label>Cores da interface<select data-pref="color"><option value="standard">Padrão · preto e amarelo</option><option value="protanopia">Protanopia · azul e amarelo</option><option value="deuteranopia">Deuteranopia · azul e dourado</option><option value="tritanopia">Tritanopia · violeta e branco</option></select></label><label>Contraste<select data-pref="contrast"><option value="standard">Padrão</option><option value="high">Alto contraste</option><option value="soft">Contraste suave</option></select></label><p class="access-note">A paleta muda os destaques; o contraste ajusta fundos e textos. Fotografias e escudo mantêm suas cores.</p><button class="access-toggle" data-toggle="largeText">Tamanho do texto <b>${prefs.largeText === 'true' ? '118%' : '100%'}</b></button><button class="access-toggle" data-toggle="spacing">Ampliar espaçamento <small>Mais espaço entre linhas e letras</small></button><button class="access-toggle" data-toggle="links">Sublinhar links</button><button class="access-toggle" data-toggle="motion">Reduzir movimento <small>Sem animações ou transições decorativas</small></button><p class="access-note">A preferência de reduzir movimentos do seu dispositivo é sempre respeitada.</p><button class="access-reset">Restaurar padrão</button></section>`;
    document.body.append(wrap);
    wrap.querySelectorAll('select').forEach(select => { select.value = prefs[select.dataset.pref]; select.addEventListener('change', () => { prefs[select.dataset.pref] = select.value; apply(); }); });
    wrap.querySelectorAll('[data-toggle]').forEach(button => button.addEventListener('click', () => { const key = button.dataset.toggle; prefs[key] = key === 'motion' ? (prefs[key] === 'reduce' ? 'device' : 'reduce') : String(prefs[key] !== 'true'); apply(); button.classList.toggle('active'); }));
    const close = () => { wrap.remove(); trigger.focus(); };
    wrap.querySelector('.access-close').addEventListener('click', close);
    wrap.addEventListener('click', event => { if (event.target === wrap) close(); });
    wrap.querySelector('.access-reset').addEventListener('click', () => { Object.assign(prefs, defaults); apply(); close(); location.reload(); });
    wrap.querySelector('.access-close').focus();
  });
})();


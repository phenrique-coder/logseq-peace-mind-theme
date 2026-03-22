// palettes.js é carregado via dynamic import (suportado no Electron/Chromium do Logseq)
// Edite palettes.js para adicionar ou modificar paletas sem tocar neste arquivo.

/** Flag para evitar loop: select_palette aplica direto e sinaliza para o listener ignorar */
let _isApplying = false;

/** Handler de click fora do menu, guardado para ser removido depois */
let _outsideClickHandler = null;

/**
 * Injeta/atualiza as variáveis CSS no documento pai do Logseq.
 *
 * Estratégia:
 *  1. style.setProperty() no <html> — prioridade máxima (inline > qualquer regra)
 *  2. <style id="peace-mind-dynamic-style"> no <head> — sobrescreve vars nativas do Logseq
 *
 * @param {object} palettes  — objeto importado de palettes.js
 * @param {string} paletteId — chave da paleta escolhida
 */
function applyPalette(palettes, paletteId) {
	const p = palettes[paletteId] || palettes.sage;

	// ── 1. Variáveis custom no inline style do <html> ──────────────────────────
	const docRoot = parent.document.documentElement;
	docRoot.style.setProperty("--peace-accent-light", p.light);
	docRoot.style.setProperty("--peace-accent-dark", p.dark);
	docRoot.style.setProperty("--peace-accent-color", p.accentColor ?? p.light);
	docRoot.style.setProperty("--peace-bg-tint-light", p.bgLight);
	docRoot.style.setProperty("--peace-bg-tint-dark", p.bgDark);
	docRoot.style.setProperty("--peace-sidebar-light", p.sidebarLight ?? p.bgLight);
	docRoot.style.setProperty("--peace-sidebar-dark", p.sidebarDark ?? p.bgDark);
	docRoot.style.setProperty("--peace-header-light", p.headerLight ?? p.sidebarLight ?? p.bgLight);
	docRoot.style.setProperty("--peace-header-dark", p.headerDark ?? p.sidebarDark ?? p.bgDark);

	// ── 2. <style> no <head> do documento pai ─────────────────────────────────
	const STYLE_ID = "peacemind-dynamic-style";
	let styleEl = parent.document.getElementById(STYLE_ID);
	if (!styleEl) {
		styleEl = parent.document.createElement("style");
		styleEl.id = STYLE_ID;
		parent.document.head.appendChild(styleEl);
	}

	styleEl.textContent = [
		// ── Hide button if not PeaceMind theme (active check via JS) ────────────
		`.peace-mind-toolbar-btn { display: flex !important; }`,

		// ── Modo escuro ──────────────────────────────────────────────────────────
		'.dark-theme, html[data-theme="dark"] {',
		`  --ls-active-primary-color:     ${p.dark}   !important;`,
		`  --ls-active-secondary-color:   ${p.dark}   !important;`,
		`  --ls-link-text-color:          ${p.dark}   !important;`,
		`  --ls-block-bullet-color:       ${p.dark}   !important;`,
		`  --ls-page-title-color:         ${p.dark}   !important;`,
		`  --ls-tag-text-color:           ${p.dark}   !important;`,
		`  --ls-primary-background-color: ${p.bgDark} !important;`,
		`  --ls-left-sidebar-bg-color:    ${p.sidebarDark ?? p.bgDark} !important;`,
		`  --ls-right-sidebar-bg-color:   ${p.sidebarDark ?? p.bgDark} !important;`,
		`  .cp__right-sidebar-inner { background-color: ${p.sidebarDark ?? p.bgDark} !important; }`,
		`  #head { background-color: ${p.headerDark ?? p.sidebarDark ?? p.bgDark} !important; border-bottom: 1px solid var(--ls-border-color); }`,
		'  /* Botão Criar - Hover Blindado */',
		`  #create-button { background-color: ${p.accentColor ?? p.dark} !important; color: var(--peace-standard-text) !important; border: 1px solid rgba(255,255,255,0.1) !important; }`,
		`  footer.create #create-button:hover, #create-button:hover { background-color: ${p.accentColor ?? p.dark} !important; background: ${p.accentColor ?? p.dark} !important; filter: brightness(1.1) !important; opacity: 1 !important; background-image: none !important; }`,
		`  #create-button:active { filter: brightness(0.9) !important; }`,
		"}",

		// ── Modo claro ───────────────────────────────────────────────────────────
		'.white-theme, html[data-theme="light"] {',
		`  --ls-active-primary-color:     ${p.light}   !important;`,
		`  --ls-active-secondary-color:   ${p.light}   !important;`,
		`  --ls-link-text-color:          ${p.light}   !important;`,
		`  --ls-block-bullet-color:       ${p.light}   !important;`,
		`  --ls-page-title-color:         ${p.light}   !important;`,
		`  --ls-tag-text-color:           ${p.light}   !important;`,
		`  --ls-primary-background-color: ${p.bgLight} !important;`,
		`  --ls-left-sidebar-bg-color:    ${p.sidebarLight ?? p.bgLight} !important;`,
		`  --ls-right-sidebar-bg-color:   ${p.sidebarLight ?? p.bgLight} !important;`,
		`  .cp__right-sidebar-inner { background-color: ${p.sidebarLight ?? p.bgLight} !important; }`,
		`  #head { background-color: ${p.headerLight ?? p.sidebarLight ?? p.bgLight} !important; border-bottom: 1px solid var(--ls-border-color); }`,
		'  /* Botão Criar - Hover Blindado */',
		`  #create-button { background-color: ${p.accentColor ?? p.light} !important; color: var(--peace-standard-text) !important; border: 1px solid rgba(0,0,0,0.05) !important; }`,
		`  footer.create #create-button:hover, #create-button:hover { background-color: ${p.accentColor ?? p.light} !important; background: ${p.accentColor ?? p.light} !important; filter: brightness(1.1) !important; opacity: 1 !important; background-image: none !important; }`,
		`  #create-button:active { filter: brightness(0.9) !important; }`,
		"}",

		// ── Área de edição / Diário — modo escuro ────────────────────────────────
		".dark-theme #main-content-container,",
		".dark-theme .cp__sidebar-main-content,",
		".dark-theme .journal,",
		".dark-theme .journal-item,",
		".dark-theme .page-inner,",
		".dark-theme .blocks-container,",
		".dark-theme .editor-wrapper,",
		".dark-theme .ls-block,",
		'html[data-theme="dark"] #main-content-container,',
		'html[data-theme="dark"] .cp__sidebar-main-content,',
		'html[data-theme="dark"] .journal,',
		'html[data-theme="dark"] .journal-item,',
		'html[data-theme="dark"] .page-inner,',
		'html[data-theme="dark"] .blocks-container,',
		'html[data-theme="dark"] .editor-wrapper,',
		'html[data-theme="dark"] .ls-block {',
		`  background-color: ${p.bgDark} !important;`,
		"}",

		// ── Área de edição / Diário — modo claro ─────────────────────────────────
		".white-theme #main-content-container,",
		".white-theme .cp__sidebar-main-content,",
		".white-theme .journal,",
		".white-theme .journal-item,",
		".white-theme .page-inner,",
		".white-theme .blocks-container,",
		".white-theme .editor-wrapper,",
		".white-theme .ls-block,",
		'html[data-theme="light"] #main-content-container,',
		'html[data-theme="light"] .cp__sidebar-main-content,',
		'html[data-theme="light"] .journal,',
		'html[data-theme="light"] .journal-item,',
		'html[data-theme="light"] .page-inner,',
		'html[data-theme="light"] .blocks-container,',
		'html[data-theme="light"] .editor-wrapper,',
		'html[data-theme="light"] .ls-block {',
		`  background-color: ${p.bgLight} !important;`,
		"}",

		// ── Botões de navegação ativos da sidebar esquerda ───────────────────────
		".dark-theme .left-sidebar-inner .item.active,",
		'html[data-theme="dark"] .left-sidebar-inner .item.active {',
		`  color: ${p.dark} !important;`,
		"}",
		".white-theme .left-sidebar-inner .item.active,",
		'html[data-theme="light"] .left-sidebar-inner .item.active {',
		`  color: ${p.light} !important;`,
		"}",
	].join("\n");
}

/** Limpa as injeções no DOM do Logseq */
function clearPeaceMindStyles() {
	const STYLE_ID = "peacemind-dynamic-style";
	let styleEl = parent.document.getElementById(STYLE_ID);
	if (styleEl) {
		// Mantém o style, mas apenas com a regra de esconder o botão
		styleEl.textContent = ".peace-mind-toolbar-btn { display: none !important; }";
	} else {
		styleEl = parent.document.createElement("style");
		styleEl.id = STYLE_ID;
		styleEl.textContent = ".peace-mind-toolbar-btn { display: none !important; }";
		parent.document.head.appendChild(styleEl);
	}

	const docRoot = parent.document.documentElement;
	const props = [
		"--peace-accent-light",
		"--peace-accent-dark",
		"--peace-accent-color",
		"--peace-bg-tint-light",
		"--peace-bg-tint-dark",
		"--peace-sidebar-light",
		"--peace-sidebar-dark",
		"--peace-header-light",
		"--peace-header-dark",
	];
	props.forEach((prop) => docRoot.style.removeProperty(prop));
}

/** Verifica se o tema ativo é o PeaceMind e aplica/remove estilos */
async function syncPeaceMindState(themeName, palettes) {
	// Se o Logseq carregar o tema, ele passa o nome "PeaceMind" (nome que demos no package.json)
	const isPeaceMind = themeName === "PeaceMind";

	if (isPeaceMind) {
		applyPalette(palettes, logseq.settings.palette);
	} else {
		clearPeaceMindStyles();
	}
}

/**
 * Abre o menu de seleção de paletas renderizando uma div diretamente no
 * parent.document.body — sem logseq.provideUI / showMainUI / hideMainUI.
 * Isso evita o iframe flutuante persistente que travava o Logseq.
 */
function openMenu(palettes, defaultPalette) {
	// Fecha qualquer instância anterior antes de abrir nova
	closeMenu();

	const button = parent.document.querySelector(".ti-palette")?.closest("a");
	if (!button) return;

	const rect = button.getBoundingClientRect();
	const menuWidth = 200;
	const top = rect.bottom + 6;
	const left = rect.left - (menuWidth - rect.width);
	const current = logseq.settings.palette || defaultPalette;

	// ── Cria o container do menu ──────────────────────────────────────────────
	const menu = parent.document.createElement("div");
	menu.id = "peace-mind-menu";
	Object.assign(menu.style, {
		position: "fixed",
		top: `${top}px`,
		left: `${left}px`,
		width: `${menuWidth}px`,
		background: "var(--ls-primary-background-color, #fff)",
		border: "1px solid var(--ls-border-color, #ddd)",
		borderRadius: "12px",
		boxShadow: "0 10px 35px rgba(0,0,0,0.2)",
		padding: "12px",
		fontFamily: "var(--ls-font-family, sans-serif)",
		zIndex: "99999",
	});

	// Título
	const title = parent.document.createElement("div");
	Object.assign(title.style, {
		fontSize: "11px",
		fontWeight: "700",
		color: "var(--ls-secondary-text-color)",
		marginBottom: "12px",
		padding: "0 4px",
		textTransform: "uppercase",
		letterSpacing: "0.8px",
	});
	title.textContent = "Peace Mind Palettes";
	menu.appendChild(title);

	// Lista de paletas
	const list = parent.document.createElement("div");
	Object.assign(list.style, {
		display: "flex",
		flexDirection: "column",
		gap: "4px",
	});

	for (const id of Object.keys(palettes)) {
		const isActive = current === id;
		const p = palettes[id];

		const item = parent.document.createElement("div");
		Object.assign(item.style, {
			display: "flex",
			alignItems: "center",
			padding: "10px",
			cursor: "pointer",
			borderRadius: "8px",
			transition: "all 0.2s ease",
			background: isActive
				? "var(--ls-tertiary-background-color, #f0f0f0)"
				: "transparent",
		});

		// Swatch de cor
		const swatch = parent.document.createElement("div");
		Object.assign(swatch.style, {
			width: "16px",
			height: "16px",
			borderRadius: "5px",
			background: p.light,
			marginRight: "12px",
			border: "1px solid rgba(0,0,0,0.08)",
			flexShrink: "0",
		});

		// Nome
		const label = parent.document.createElement("span");
		Object.assign(label.style, {
			flex: "1",
			fontSize: "14px",
			color: "var(--ls-primary-text-color)",
			fontWeight: isActive ? "600" : "400",
		});
		label.textContent = p.name;

		item.appendChild(swatch);
		item.appendChild(label);

		// Check mark para paleta ativa
		if (isActive) {
			const check = parent.document.createElement("i");
			check.className = "ti ti-check";
			Object.assign(check.style, {
				color: "var(--ls-active-primary-color)",
				fontSize: "16px",
			});
			item.appendChild(check);
		}

		// Hover
		item.addEventListener("mouseenter", () => {
			if (!isActive)
				item.style.background =
					"var(--ls-quaternary-background-color, #f9f9f9)";
			item.style.transform = "translateX(2px)";
		});
		item.addEventListener("mouseleave", () => {
			if (!isActive) item.style.background = "transparent";
			item.style.transform = "translateX(0)";
		});

		// Seleção de paleta
		item.addEventListener("click", () => {
			closeMenu();
			applyPalette(palettes, id);
			_isApplying = true;
			logseq.updateSettings({ palette: id });
			setTimeout(() => {
				_isApplying = false;
			}, 300);
		});

		list.appendChild(item);
	}

	menu.appendChild(list);
	parent.document.body.appendChild(menu);

	// Fecha ao clicar fora (num setTimeout para não capturar o click que abriu)
	setTimeout(() => {
		_outsideClickHandler = (e) => {
			if (!menu.contains(e.target)) closeMenu();
		};
		parent.document.addEventListener("click", _outsideClickHandler);
	}, 0);
}

/** Remove o menu do DOM e limpa o handler de click externo */
function closeMenu() {
	const existing = parent.document.getElementById("peace-mind-menu");
	if (existing) existing.remove();

	if (_outsideClickHandler) {
		parent.document.removeEventListener("click", _outsideClickHandler);
		_outsideClickHandler = null;
	}
}

// ─── main ────────────────────────────────────────────────────────────────────
async function main() {
	// Carrega as paletas do arquivo separado
	const { palettes, defaultPalette } = await import("./palettes.js");

	logseq.useSettingsSchema([
		{
			key: "palette",
			type: "enum",
			title: "Color Palette",
			description: "Choose your peaceful accent color.",
			default: defaultPalette,
			enumChoices: Object.keys(palettes),
		},
	]);

	// Cleanup total ao descarregar plugin
	logseq.beforeunload(async () => {
		const styleEl = parent.document.getElementById("peacemind-dynamic-style");
		if (styleEl) styleEl.remove();

		const docRoot = parent.document.documentElement;
		const props = [
			"--peace-accent-light",
			"--peace-accent-dark",
			"--peace-accent-color",
			"--peace-bg-tint-light",
			"--peace-bg-tint-dark",
			"--peace-sidebar-light",
			"--peace-sidebar-dark",
			"--peace-header-light",
			"--peace-header-dark",
		];
		props.forEach((prop) => docRoot.style.removeProperty(prop));
	});

	// Aplicação inicial baseada no tema atual do Logseq
	const { preferredTheme } = await logseq.App.getUserConfigs();
	syncPeaceMindState(preferredTheme, palettes);

	// Listener de troca de tema
	logseq.App.onThemeChanged(({ name }) => {
		syncPeaceMindState(name, palettes);
	});

	// Modelo de eventos
	logseq.provideModel({
		toggle_menu: () => {
			const existing = parent.document.getElementById("peace-mind-menu");
			if (existing) {
				closeMenu();
			} else {
				openMenu(palettes, defaultPalette);
			}
		},
	});

	// Botão na toolbar (com classe para controle de visibilidade)
	logseq.App.registerUIItem("toolbar", {
		key: "peace-mind-palette-button",
		template:
			'<a class="button peace-mind-toolbar-btn" data-on-click="toggle_menu" title="Peace Mind Colors">' +
			'<i class="ti ti-palette" style="font-size:20px;"></i>' +
			"</a>",
	});

	// Re-aplica quando settings mudam (se o tema PeaceMind estiver ativo)
	logseq.onSettingsChanged(async (newSettings) => {
		if (_isApplying) return;
		const { preferredTheme } = await logseq.App.getUserConfigs();
		if (preferredTheme === "PeaceMind") {
			applyPalette(palettes, newSettings.palette);
		}
	});
}

logseq.ready(main).catch(console.error);

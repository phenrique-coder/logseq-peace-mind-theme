// Peace Mind Theme — Plugin Logic
// Entry point: index.html (loads @logseq/libs via CDN + this file)
// Strategy: Set CSS custom properties via inline style on <html> (highest priority).
// The peace-mind.css consumes these variables to style the entire UI.

/** Flag para evitar loop: select_palette aplica direto e sinaliza para o listener ignorar */
let _isApplying = false;

/** Handler de click fora do menu */
let _outsideClickHandler = null;

/** Lista de variáveis CSS para cleanup */
const CSS_VARS = [
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

/**
 * Aplica a paleta definindo as variáveis CSS diretamente no style inline do <html>.
 * Inline styles têm prioridade máxima na cascata CSS, então sempre sobrescrevem
 * os valores padrão definidos no peace-mind.css.
 *
 * @param {object} palettes  — objeto importado de palettes.js
 * @param {string} paletteId — chave da paleta escolhida
 */
function applyPalette(palettes, paletteId) {
	const p = palettes[paletteId] || palettes.sage;
	const root = parent.document.documentElement;

	root.style.setProperty("--peace-accent-light", p.light);
	root.style.setProperty("--peace-accent-dark", p.dark);
	root.style.setProperty("--peace-accent-color", p.accentColor ?? p.light);
	root.style.setProperty("--peace-bg-tint-light", p.bgLight);
	root.style.setProperty("--peace-bg-tint-dark", p.bgDark);
	root.style.setProperty("--peace-sidebar-light", p.sidebarLight ?? p.bgLight);
	root.style.setProperty("--peace-sidebar-dark", p.sidebarDark ?? p.bgDark);
	root.style.setProperty("--peace-header-light", p.headerLight ?? p.sidebarLight ?? p.bgLight);
	root.style.setProperty("--peace-header-dark", p.headerDark ?? p.sidebarDark ?? p.bgDark);
}

/**
 * Remove todas as variáveis inline e elementos injetados.
 * Chamado quando o plugin é descarregado (tema trocado/desativado).
 */
function cleanup() {
	// Remove variáveis inline do <html>
	try {
		const root = parent.document.documentElement;
		CSS_VARS.forEach((prop) => {
			root.style.removeProperty(prop);
		});
	} catch (_) {
		/* parent pode não estar acessível */
	}

	// Fecha o menu se estiver aberto
	closeMenu();
}

/**
 * Abre o menu de seleção de paletas.
 */
function openMenu(palettes, defaultPalette) {
	closeMenu();

	const button = parent.document.querySelector(".ti-palette")?.closest("a");
	if (!button) return;

	const rect = button.getBoundingClientRect();
	const menuWidth = 200;
	const top = rect.bottom + 6;
	const left = rect.left - (menuWidth - rect.width);
	const current = logseq.settings?.palette || defaultPalette;

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

	// Lista
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

		if (isActive) {
			const check = parent.document.createElement("i");
			check.className = "ti ti-check";
			Object.assign(check.style, {
				color: "var(--ls-active-primary-color)",
				fontSize: "16px",
			});
			item.appendChild(check);
		}

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

	setTimeout(() => {
		_outsideClickHandler = (e) => {
			if (!menu.contains(e.target)) closeMenu();
		};
		parent.document.addEventListener("click", _outsideClickHandler);
	}, 0);
}

/** Remove o menu do DOM */
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

	// Cleanup ao descarregar plugin
	logseq.beforeunload(async () => {
		cleanup();
	});

	/**
	 * Verifica se o tema ativo é o PeaceMind.
	 * O Logseq seta a URL do CSS do tema ativo; checamos se contém "peace-mind".
	 */
	function isPeaceMindTheme(url) {
		if (!url) return false;
		return url.toLowerCase().includes("peace-mind");
	}

	/**
	 * Esconde ou mostra o botão da toolbar no parent document.
	 */
	function setToolbarButtonVisible(visible) {
		try {
			const btn = parent.document.querySelector(".peace-mind-toolbar-btn");
			if (btn) {
				btn.style.display = visible ? "" : "none";
			}
		} catch (_) {
			/* parent pode não existir */
		}
	}

	// Aplica a paleta salva (só se PeaceMind estiver ativo)
	const currentPalette = logseq.settings?.palette || defaultPalette;
	applyPalette(palettes, currentPalette);

	// Modelo para o botão da toolbar
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

	// Botão na toolbar
	logseq.App.registerUIItem("toolbar", {
		key: "peace-mind-palette-button",
		template:
			'<a class="button peace-mind-toolbar-btn" data-on-click="toggle_menu" title="Peace Mind Colors">' +
			'<i class="ti ti-palette" style="font-size:20px;"></i>' +
			"</a>",
	});

	// Re-aplica quando settings mudam
	logseq.onSettingsChanged((newSettings) => {
		if (_isApplying) return;
		applyPalette(palettes, newSettings.palette);
	});

	// Re-aplica quando o modo dark/light muda
	logseq.App.onThemeModeChanged(() => {
		applyPalette(palettes, logseq.settings?.palette || defaultPalette);
	});

	// ── Detecta troca de tema ────────────────────────────────────────────────
	// Quando o usuário troca para outro tema, esconde o botão e limpa variáveis.
	// Quando volta para PeaceMind, re-aplica a paleta e mostra o botão.
	logseq.App.onThemeChanged(({ url }) => {
		if (isPeaceMindTheme(url)) {
			// Voltou para PeaceMind — re-aplica tudo
			applyPalette(palettes, logseq.settings?.palette || defaultPalette);
			setToolbarButtonVisible(true);
		} else {
			// Outro tema — limpa e esconde
			cleanup();
			setToolbarButtonVisible(false);
		}
	});
}

logseq.ready(main).catch(console.error);

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import PlaySculpture from "../components/PlaySculpture";
import { copy } from "../content";
import type { Locale } from "../content";

export const Route = createFileRoute("/")({ component: Home });
const enquiryEmail = "fahrezyfikry@gmail.com";
const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => (
	<span aria-hidden="true">{diagonal ? "↗" : "↗"}</span>
);

function ConceptArt({ index }: { index: number }) {
	if (index === 0)
		return (
			<div className="concept-art art-sculpture" aria-hidden="true">
				<div className="sculpture-orbit orbit-one" />
				<div className="sculpture-orbit orbit-two" />
				<div className="sculpture-orbit orbit-three" />
				<span className="art-caption">FORM / 001</span>
				<span className="art-star">✳</span>
			</div>
		);
	if (index === 1)
		return (
			<div className="concept-art art-digital" aria-hidden="true">
				<div className="browser-card">
					<div className="browser-top">
						<span>● ● ●</span>
						<span>human / interface</span>
						<span>↗</span>
					</div>
					<div className="browser-body">
						<span className="tiny-label">LESS FRICTION. MORE FLOW.</span>
						<strong>
							Space to
							<br />
							<i>do more.</i>
						</strong>
						<div className="ui-pill">
							Make room for what matters <span>↗</span>
						</div>
						<div className="ui-chart">
							{[35, 55, 42, 70, 58, 85, 100].map((n, i) => (
								<span key={i} style={{ height: `${n}%` }} />
							))}
						</div>
					</div>
				</div>
				<span className="art-caption">HUMAN / 002</span>
			</div>
		);
	return (
		<div className="concept-art art-film" aria-hidden="true">
			<svg viewBox="0 0 600 650" preserveAspectRatio="xMidYMid slice">
				<defs>
					<linearGradient id="sky" x2="0" y2="1">
						<stop stopColor="#d7d6bf" />
						<stop offset="1" stopColor="#a9b2a4" />
					</linearGradient>
					<linearGradient id="mountain" x2="1" y2="1">
						<stop stopColor="#686e54" />
						<stop offset="1" stopColor="#262f25" />
					</linearGradient>
					<filter id="grain">
						<feTurbulence
							type="fractalNoise"
							baseFrequency=".7"
							numOctaves="3"
							stitchTiles="stitch"
						/>
						<feColorMatrix type="saturate" values="0" />
						<feComponentTransfer>
							<feFuncA type="linear" slope=".12" />
						</feComponentTransfer>
						<feBlend in="SourceGraphic" mode="multiply" />
					</filter>
				</defs>
				<g filter="url(#grain)">
					<path fill="url(#sky)" d="M0 0h600v650H0z" />
					<circle cx="420" cy="180" r="65" fill="#f3e5af" />
					<path fill="#8d967e" d="M-40 440Q90 210 230 320T650 230V650H0Z" />
					<path
						fill="url(#mountain)"
						d="M-40 530Q120 260 290 430T650 360V650H0Z"
					/>
					<path fill="#243c30" d="M-20 650Q160 420 340 540T650 480V680H0Z" />
					<path
						fill="none"
						stroke="#d1c29b"
						strokeWidth="12"
						d="M300 680Q450 580 335 535T210 472"
					/>
				</g>
			</svg>
			<span className="film-title">
				A quieter
				<br />
				<i>kind of wonder.</i>
			</span>
			<div className="frame-corners" />
			<span className="art-caption">STILL / 003</span>
			<span className="film-dot">● REC</span>
		</div>
	);
}

function Home() {
	const [locale, setLocale] = useState<Locale>("en");
	const [menu, setMenu] = useState(false);
	const [paused, setPaused] = useState(false);
	const [modal, setModal] = useState<"brief" | number | null>(null);
	const [status, setStatus] = useState("");
	const dialog = useRef<HTMLDialogElement>(null);
	const t = copy[locale];
	useEffect(() => {
		const fromURL = new URLSearchParams(window.location.search).get("lang");
		let saved: string | null = null;
		try {
			saved = localStorage.getItem("rwd-language");
		} catch {
			/* Storage is optional. */
		}
		if (fromURL === "id" || (fromURL !== "en" && saved === "id"))
			setLocale("id");
	}, []);
	useEffect(() => {
		document.documentElement.lang = locale;
		document.title =
			locale === "en"
				? "RWD Studio — Code, craft & curiosity"
				: "RWD Studio — Teknologi, karya & rasa ingin tahu";
	}, [locale]);
	useEffect(() => {
		if (modal !== null) {
			dialog.current?.showModal();
			document.body.style.overflow = "hidden";
		} else {
			dialog.current?.close();
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [modal]);
	function changeLocale(next: Locale) {
		setLocale(next);
		setStatus("");
		try {
			localStorage.setItem("rwd-language", next);
		} catch {
			/* Storage is optional. */
		}
		const url = new URL(window.location.href);
		url.searchParams.set("lang", next);
		window.history.replaceState(null, "", url);
	}
	function startProject() {
		setMenu(false);
		setStatus("");
		setModal("brief");
	}
	function submitBrief(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const body = [
			locale === "en" ? "Hello RWD Studio!" : "Halo RWD Studio!",
			"",
			`${t.name}: ${data.get("name")}`,
			`${t.email}: ${data.get("email")}`,
			`${t.company}: ${data.get("company") || "—"}`,
			`${t.interest}: ${data.getAll("service").join(", ") || t.all}`,
			`${t.budget}: ${data.get("budget") || "—"}`,
			`${t.timeline}: ${data.get("timeline") || "—"}`,
			"",
			`${t.brief}:`,
			String(data.get("brief")),
		].join("\n");
		window.location.href = `mailto:${enquiryEmail}?subject=${encodeURIComponent(`${locale === "en" ? "New project" : "Proyek baru"} — ${data.get("name")}`)}&body=${encodeURIComponent(body)}`;
		setStatus(t.emailReady);
	}
	const project = typeof modal === "number" ? t.projects[modal] : null;
	return (
		<>
			<a className="skip-link" href="#main">
				{t.skip}
			</a>
			<header className="site-header" id="top">
				<a className="wordmark" href="#top" aria-label="RWD Studio">
					<span>
						rwd<span className="wordmark-dot">®</span>
					</span>
					<small>studio</small>
				</a>
				<nav
					className="desktop-nav"
					aria-label={locale === "en" ? "Main navigation" : "Navigasi utama"}
				>
					{t.nav.map((label, i) => (
						<a key={label} href={["#explorations", "#services", "#studio"][i]}>
							{label}
							<span className="nav-number">0{i + 1}</span>
						</a>
					))}
				</nav>
				<div className="header-actions">
					<div className="locale-switch" aria-label="Language / Bahasa">
						<button
							type="button"
							aria-pressed={locale === "en"}
							onClick={() => changeLocale("en")}
						>
							EN
						</button>
						<span>/</span>
						<button
							type="button"
							aria-pressed={locale === "id"}
							onClick={() => changeLocale("id")}
						>
							ID
						</button>
					</div>
					<button className="header-cta" type="button" onClick={startProject}>
						{t.start} <Arrow />
					</button>
					<button
						className="menu-toggle"
						type="button"
						aria-expanded={menu}
						aria-controls="mobile-menu"
						onClick={() => setMenu(!menu)}
					>
						{menu ? t.close : t.menu} <span>{menu ? "−" : "+"}</span>
					</button>
				</div>
			</header>
			{menu && (
				<nav className="mobile-menu" id="mobile-menu">
					{t.nav.map((label, i) => (
						<a
							key={label}
							href={["#explorations", "#services", "#studio"][i]}
							onClick={() => setMenu(false)}
						>
							{label}
							<Arrow />
						</a>
					))}
					<button type="button" onClick={startProject}>
						{t.start}
						<Arrow />
					</button>
				</nav>
			)}
			<main id="main">
				<section className="hero" aria-labelledby="hero-heading">
					<div className="hero-topline">
						<span className="eyebrow">
							<span className="status-dot" />
							{t.eyebrow}
						</span>
						<span className="hero-edition">CREATIVE STUDIO / VOL. 01</span>
					</div>
					<div className="hero-main">
						<h1 id="hero-heading">
							{t.hero[0]}
							<br />
							{t.hero[1]}
							<br />
							<em>{t.play}</em>
							<span className="headline-star" aria-hidden="true">
								✳
							</span>
						</h1>
						<div className="hero-visual">
							<div className="object-axis axis-x" />
							<div className="object-axis axis-y" />
							<span className="object-coordinate coordinate-top">
								RWD — OBJECT 001
							</span>
							<PlaySculpture paused={paused} />
							<div className="object-controls">
								<span>{t.interact}</span>
								<button
									type="button"
									onClick={() => setPaused(!paused)}
									aria-label={paused ? t.resume : t.motion}
									title={paused ? t.resume : t.motion}
								>
									{paused ? "▶" : "Ⅱ"}
								</button>
							</div>
							<span className="object-caption">{t.object}</span>
						</div>
					</div>
					<div className="hero-bottom">
						<a className="explore-link" href="#explorations">
							<span className="circle-arrow">↓</span>
							{t.explore}
						</a>
						<p>{t.intro}</p>
						<span className="hero-index">(01—04)</span>
					</div>
				</section>
				<div className="discipline-strip">
					{t.disciplines.map((item) => (
						<span key={item}>
							{item}
							<span aria-hidden="true">✳</span>
						</span>
					))}
				</div>
				<section className="work-section section-wrap" id="explorations">
					<div className="section-heading">
						<div>
							<span className="eyebrow">{t.workLabel}</span>
							<h2>{t.workTitle}</h2>
						</div>
						<p>{t.workIntro}</p>
					</div>
					<div className="work-grid">
						{t.projects.map((item, i) => (
							<button
								className={`work-card work-card-${i}`}
								key={item.title}
								type="button"
								onClick={() => setModal(i)}
								aria-label={`${t.view}: ${item.title}`}
							>
								<div className="work-image">
									<ConceptArt index={i} />
									<span className="concept-tag">{t.concept}</span>
									<span className="work-open">
										<Arrow />
									</span>
								</div>
								<div className="work-meta">
									<h3>{item.title}</h3>
									<span>0{i + 1}</span>
								</div>
								<p>{item.type}</p>
							</button>
						))}
					</div>
				</section>
				<section className="services-section section-wrap" id="services">
					<div className="services-intro">
						<span className="eyebrow">{t.servicesLabel}</span>
						<h2>{t.servicesTitle}</h2>
						<p>{t.servicesIntro}</p>
						<span className="big-asterisk" aria-hidden="true">
							✳
						</span>
					</div>
					<div className="services-list">
						{t.services.map((service, i) => (
							<details
								key={service.title}
								name="services"
								open={i === 0 ? true : undefined}
							>
								<summary>
									<span className="service-number">0{i + 1}</span>
									<h3>{service.title}</h3>
									<span className="details-sign" aria-hidden="true" />
								</summary>
								<div className="service-content">
									<p>{service.detail}</p>
									<div className="tags">
										{service.tags.map((tag) => (
											<span key={tag}>{tag}</span>
										))}
									</div>
								</div>
							</details>
						))}
					</div>
				</section>
				<section className="studio-section section-wrap" id="studio">
					<div className="studio-intro">
						<span className="eyebrow">{t.aboutLabel}</span>
						<h2>{t.aboutTitle}</h2>
						<span className="studio-symbol" aria-hidden="true">
							↗
						</span>
					</div>
					<div className="studio-copy">
						<p>{t.aboutBody}</p>
						<p className="studio-mantra">{t.aboutEnd}</p>
						<div className="process-grid">
							{t.process.map((step, i) => (
								<div key={step.title}>
									<span>0{i + 1} /</span>
									<h3>{step.title}</h3>
									<p>{step.text}</p>
								</div>
							))}
						</div>
					</div>
				</section>
				<section className="contact-section section-wrap">
					<div className="contact-top">
						<span className="eyebrow">
							<span className="status-dot" />
							{t.contactLabel}
						</span>
						<span className="contact-asterisk" aria-hidden="true">
							✳
						</span>
					</div>
					<button
						className="contact-title"
						type="button"
						onClick={startProject}
					>
						<span>{t.contactTitle}</span>
						<span className="contact-arrow" aria-hidden="true">
							↗
						</span>
					</button>
					<div className="contact-bottom">
						<p>{t.contactText}</p>
						<button
							className="pill-button"
							type="button"
							onClick={startProject}
						>
							{t.start}
							<Arrow />
						</button>
					</div>
				</section>
			</main>
			<footer className="site-footer">
				<a className="footer-logo" href="#top">
					rwd studio®
				</a>
				<p>{t.footer}</p>
				<span>© {new Date().getFullYear()} RWD Studio</span>
				<a href="#top">{t.top} ↑</a>
			</footer>
			<dialog
				ref={dialog}
				className={`studio-dialog ${project ? "project-dialog" : ""}`}
				onCancel={() => setModal(null)}
				onClick={(e) => {
					if (e.target === e.currentTarget) setModal(null);
				}}
				aria-labelledby="dialog-title"
			>
				<button
					type="button"
					className="dialog-close"
					onClick={() => setModal(null)}
					aria-label={t.close}
				>
					×
				</button>
				{modal === "brief" && (
					<div className="brief-content">
						<span className="eyebrow">
							RWD STUDIO / {t.start.toUpperCase()}
						</span>
						<h2 id="dialog-title">{t.formTitle}</h2>
						<p>{t.formIntro}</p>
						<form onSubmit={submitBrief}>
							<div className="form-row">
								<label>
									{t.name} *
									<input
										name="name"
										required
										autoComplete="name"
										maxLength={100}
									/>
								</label>
								<label>
									{t.email} *
									<input
										name="email"
										type="email"
										required
										autoComplete="email"
										maxLength={200}
									/>
								</label>
							</div>
							<label>
								{t.company}
								<input
									name="company"
									autoComplete="organization"
									maxLength={200}
								/>
							</label>
							<fieldset>
								<legend>{t.interest}</legend>
								<div className="service-options">
									{t.disciplines.map((service) => (
										<label key={service}>
											<input type="checkbox" name="service" value={service} />
											<span>{service}</span>
										</label>
									))}
								</div>
							</fieldset>
							<div className="form-row">
								<label>
									{t.budget}
									<input
										name="budget"
										placeholder={t.budgetPlaceholder}
										maxLength={100}
									/>
								</label>
								<label>
									{t.timeline}
									<input
										name="timeline"
										placeholder={t.timelinePlaceholder}
										maxLength={100}
									/>
								</label>
							</div>
							<label>
								{t.brief} *
								<textarea
									name="brief"
									required
									rows={4}
									placeholder={t.placeholder}
									maxLength={3000}
								/>
							</label>
							<button className="pill-button" type="submit">
								{t.send}
								<Arrow />
							</button>
							<p className="form-note">{t.note}</p>
							<a className="direct-email" href={`mailto:${enquiryEmail}`}>
								{enquiryEmail}
							</a>
							<p role="status" className="form-status">
								{status}
							</p>
						</form>
					</div>
				)}
				{project && (
					<div className="project-content">
						<ConceptArt index={modal as number} />
						<div className="project-description">
							<span className="eyebrow">{t.concept}</span>
							<h2 id="dialog-title">{project.title}</h2>
							<p>{project.desc}</p>
							<div className="tags">
								{project.deliverables.map((item) => (
									<span key={item}>{item}</span>
								))}
							</div>
							<p className="form-note">{t.conceptNote}</p>
							<button
								className="pill-button"
								type="button"
								onClick={startProject}
							>
								{t.start}
								<Arrow />
							</button>
						</div>
					</div>
				)}
			</dialog>
		</>
	);
}

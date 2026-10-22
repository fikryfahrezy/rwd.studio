import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import StudioScene from "../components/StudioScene";
import { useStudioMotion } from "../hooks/useStudioMotion";
import { copy } from "../content";
import { experience } from "../experience";
import type { Locale } from "../content";
export const Route = createFileRoute("/")({ component: Home });
const enquiryEmail = "fahrezyfikry@gmail.com";
const Arrow = () => <span aria-hidden="true">↗</span>;
function Home() {
	const [locale, setLocale] = useState<Locale>("en");
	const [chapter, setChapter] = useState(0);
	const [motion, setMotion] = useState(true);
	const [modal, setModal] = useState<"brief" | number | null>(null);
	const [status, setStatus] = useState("");
	const dialog = useRef<HTMLDialogElement>(null);
	const t = copy[locale],
		e = experience[locale];
	const smoothScroll = useStudioMotion(modal !== null, motion, setChapter);
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
	const project = typeof modal === "number" ? t.services[modal] : null;
	function jumpTo(index: number) {
		const journey = document.getElementById("journey");
		if (!journey) return;
		const y =
			journey.offsetTop +
			((journey.offsetHeight - window.innerHeight) * index) / 5;
		if (smoothScroll.current)
			smoothScroll.current.scrollTo(y, { duration: 1.5, force: true });
		else window.scrollTo({ top: y, behavior: "smooth" });
	}
	function pickObject(index: number) {
		const target = [2, 3, 4, 4][index];
		if (chapter === target) setModal(index);
		else jumpTo(target);
	}
	return (
		<div className={`playground chapter-${chapter}`} lang={locale}>
			<a
				className="skip-link"
				href="#project"
				onClick={(event) => {
					event.preventDefault();
					startProject();
				}}
			>
				{e.skip}
			</a>
			<header className="studio-header">
				<button
					className="wordmark"
					type="button"
					onClick={() => jumpTo(0)}
					aria-label="RWD Studio — Home"
				>
					rwd<span>®</span>
					<small>STUDIO</small>
				</button>
				<span className="header-statement">{e.studio}</span>
				<div className="header-actions">
					<div className="locale-switch" aria-label="Language / Bahasa">
						{(["en", "id"] as Locale[]).map((lang) => (
							<button
								key={lang}
								type="button"
								aria-pressed={locale === lang}
								onClick={() => changeLocale(lang)}
							>
								{lang.toUpperCase()}
							</button>
						))}
					</div>
					<button
						className="header-project"
						type="button"
						onClick={startProject}
					>
						{t.start}
						<Arrow />
					</button>
				</div>
			</header>
			<main id="journey" className="journey" aria-label={e.instructions}>
				<div id="world" className="world">
					<div className="world-grid" aria-hidden="true" />
					<span className="edge-label edge-left" aria-hidden="true">
						RWD STUDIO — IDEAS IN PLAY
					</span>
					<span className="edge-label edge-right" aria-hidden="true">
						SCROLL / EXPLORE / MAKE SOMETHING
					</span>
					<StudioScene
						locale={locale}
						suspended={modal !== null}
						motion={motion}
						onSelect={pickObject}
					/>
					<section
						className="chapter-copy welcome-copy"
						data-chapter-copy="0"
						aria-hidden={chapter !== 0}
					>
						<div className="welcome-heading">
							<span className="eyebrow">{e.heroNote}</span>
							<h1>
								<span>{e.hero[0]}</span>
								<span>{e.hero[1]}</span>
							</h1>
						</div>
						<button
							className="scroll-sticker"
							type="button"
							onClick={() => jumpTo(1)}
							tabIndex={chapter === 0 ? 0 : -1}
						>
							<span>{e.sticker}</span>
							<span aria-hidden="true">↓</span>
						</button>
						<p className="welcome-description readable-copy">
							{e.heroDescription}
						</p>
						<span className="little-note">
							{e.touch}
							<svg viewBox="0 0 90 55" aria-hidden="true">
								<path
									d="M3 4Q70 0 65 40M52 30l13 13 12-15"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								/>
							</svg>
						</span>
					</section>
					<section
						className="chapter-copy thinking-copy"
						data-chapter-copy="1"
						aria-hidden={chapter !== 1}
						style={{ opacity: 0, visibility: "hidden" }}
					>
						<span className="chapter-index">01 / {e.nav[1].toUpperCase()}</span>
						<h2>
							{e.ideaTitle[0]}
							<br />
							<em>{e.ideaTitle[1]}</em>
						</h2>
						<div className="thinking-note readable-copy">
							<span className="asterisk">✳</span>
							<p>{e.ideaBody}</p>
						</div>
						<span className="thinking-foot readable-copy">{e.ideaNote}</span>
					</section>
					<section
						className="chapter-copy digital-copy"
						data-chapter-copy="2"
						aria-hidden={chapter !== 2}
						style={{ opacity: 0, visibility: "hidden" }}
					>
						<span className="chapter-index">{e.digitalNote}</span>
						<h2>
							{e.digitalTitle[0]}
							<br />
							<em>{e.digitalTitle[1]}</em>
						</h2>
						<div className="discipline-description readable-copy">
							<p>{e.digitalBody}</p>
							<button
								type="button"
								onClick={() => setModal(0)}
								tabIndex={chapter === 2 ? 0 : -1}
							>
								{e.more}
								<Arrow />
							</button>
						</div>
						<span className="code-mark" aria-hidden="true">
							{"</>"}
						</span>
						<div className="capability-strip">
							{t.services[0].tags.map((tag) => (
								<span key={tag}>
									{tag} <i>✳</i>
								</span>
							))}
						</div>
					</section>
					<section
						className="chapter-copy film-copy"
						data-chapter-copy="3"
						aria-hidden={chapter !== 3}
						style={{ opacity: 0, visibility: "hidden" }}
					>
						<div className="film-sprockets" aria-hidden="true" />
						<span className="chapter-index">{e.filmNote}</span>
						<h2>
							{e.filmTitle[0]}
							<br />
							<em>{e.filmTitle[1]}</em>
						</h2>
						<div className="discipline-description readable-copy">
							<p>{e.filmBody}</p>
							<button
								type="button"
								onClick={() => setModal(1)}
								tabIndex={chapter === 3 ? 0 : -1}
							>
								{e.more}
								<Arrow />
							</button>
						</div>
						<span className="record-mark">
							<i />
							REC <span>00:00:03</span>
						</span>
						<div className="frame-guide" aria-hidden="true" />
					</section>
					<section
						className="chapter-copy motion-copy"
						data-chapter-copy="4"
						aria-hidden={chapter !== 4}
						style={{ opacity: 0, visibility: "hidden" }}
					>
						<span className="chapter-index">{e.motionNote}</span>
						<h2>
							{e.motionTitle.map((line, i) => (
								<span key={line}>{i === 1 ? <em>{line}</em> : line}</span>
							))}
						</h2>
						<div className="discipline-description readable-copy">
							<p>{e.motionBody}</p>
							<div className="discipline-links">
								<button
									type="button"
									onClick={() => setModal(2)}
									tabIndex={chapter === 4 ? 0 : -1}
								>
									{t.disciplines[2]}
									<Arrow />
								</button>
								<button
									type="button"
									onClick={() => setModal(3)}
									tabIndex={chapter === 4 ? 0 : -1}
								>
									{e.drawing}
									<Arrow />
								</button>
							</div>
						</div>
						<span className="motion-doodle" aria-hidden="true">
							↝
						</span>
					</section>
					<section
						className="chapter-copy end-copy"
						data-chapter-copy="5"
						aria-hidden={chapter !== 5}
						style={{ opacity: 0, visibility: "hidden" }}
						id="project"
					>
						<span className="end-note">{e.endNote}</span>
						<h2>
							{e.endTitle[0]}
							<br />
							<em>{e.endTitle[1]}</em>
						</h2>
						<button
							className="project-sticker"
							type="button"
							onClick={startProject}
							tabIndex={chapter === 5 ? 0 : -1}
						>
							{t.start}
							<Arrow />
						</button>
						<p className="readable-copy">{e.endBody}</p>
						<a
							className="end-email readable-copy"
							href={`mailto:${enquiryEmail}`}
							tabIndex={chapter === 5 ? 0 : -1}
						>
							{enquiryEmail} ↗
						</a>
					</section>
					<nav
						className="journey-nav"
						aria-label={
							locale === "en" ? "Explore the studio" : "Jelajahi studio"
						}
					>
						<span className="journey-line" />
						{e.nav.map((label, i) => (
							<button
								key={label}
								type="button"
								onClick={() => jumpTo(i)}
								aria-current={chapter === i ? "step" : undefined}
							>
								<span className="nav-dot">
									{chapter === i ? (
										<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
											<path
												d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5"
												stroke="currentColor"
												strokeWidth="1.6"
											/>
										</svg>
									) : (
										String(i + 1).padStart(2, "0")
									)}
								</span>
								<span>{label}</span>
							</button>
						))}
					</nav>
					<div className="world-bottom">
						<span>© {new Date().getFullYear()} RWD STUDIO</span>
						<button
							type="button"
							onClick={() => setMotion(!motion)}
							aria-pressed={motion}
						>
							{e.motion}: {motion ? e.on : e.off}
						</button>
						<span className="scroll-invitation">{e.hint} ↓</span>
					</div>
				</div>
			</main>
			<dialog
				ref={dialog}
				data-lenis-prevent
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
						<div className="service-dialog-art" aria-hidden="true">
							{["↗", "◉", "✳", "✎"][modal as number]}
						</div>
						<div className="project-description">
							<span className="eyebrow">{t.servicesLabel}</span>
							<h2 id="dialog-title">{project.title}</h2>
							<p>{project.detail}</p>
							<div className="tags">
								{project.tags.map((item) => (
									<span key={item}>{item}</span>
								))}
							</div>

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
			</dialog>{" "}
		</div>
	);
}

import "./style.css";
import Flipbook from "./flipbook";
import { bookContent } from "./data/book-content";
import { PageRenderer } from "./services/page-renderer";
import { audioService } from "./services/audio-service";

declare global {
	interface Window {
		flipbook: Flipbook;
	}
}

interface ChapterSpread {
	page: number;
	tag: string;
	title: string;
}

const chapters: ChapterSpread[] = [
	{ page: 0, tag: "Cover", title: "The Memories We Keep" },
	{ page: 1, tag: "Spread 1", title: "Dedication & More Than a Teacher" },
	{ page: 2, tag: "Spread 2", title: "Where It All Happened & Lessons We Carry" },
	{ page: 3, tag: "Spread 3", title: "Moments We Remember & Words That Stayed" },
	{ page: 4, tag: "Spread 4", title: "What You Left With Us & Class Album" },
	{ page: 5, tag: "Spread 5", title: "From All of Us & Final Thank You" },
	{ page: 6, tag: "Spread 6", title: "Commemorative Valediction" },
	{ page: 7, tag: "Back", title: "Outside Back Cover" },
];

document.addEventListener("DOMContentLoaded", async () => {
	const containerEl = document.getElementById("flipbook-container");
	if (!containerEl) {
		console.error("No flipbook container found");
		return;
	}

	const pageWidth = 764;
	const pageHeight = 1080;

	// Render all 14 pages dynamically on high-DPI canvas
	const renderer = new PageRenderer(1528, 2160);
	const renderedPages = await renderer.renderAllPages(bookContent);

	// Zoom coordinates for interactive memory inspection
	const pageActiveAreas: PageActiveArea[] = [
		// Cover portrait
		{
			faceIndex: 0,
			top: 480 / 2160,
			left: 524 / 1528,
			width: 480 / 1528,
			height: 580 / 2160,
			title: `View Portrait of ${bookContent.teacher.name}`,
			zoom: {
				top: 480 / 2160,
				left: 524 / 1528,
				width: 480 / 1528,
				height: 580 / 2160,
			},
		},
		// Page 2: More Than a Teacher portrait
		{
			faceIndex: 2,
			top: 350 / 2160,
			left: 788 / 1528,
			width: 600 / 1528,
			height: 750 / 2160,
			title: "View Faculty Portrait & Reflections",
			zoom: {
				top: 350 / 2160,
				left: 788 / 1528,
				width: 600 / 1528,
				height: 750 / 2160,
			},
		},
		// Page 3: Lecture hall photo
		{
			faceIndex: 3,
			top: 460 / 2160,
			left: 140 / 1528,
			width: 1248 / 1528,
			height: 620 / 2160,
			title: "View Lecture Hall Memory",
			zoom: {
				top: 460 / 2160,
				left: 140 / 1528,
				width: 1248 / 1528,
				height: 620 / 2160,
			},
		},
		// Page 3: Seminar discussions
		{
			faceIndex: 3,
			top: 1180 / 2160,
			left: 140 / 1528,
			width: 1248 / 1528,
			height: 620 / 2160,
			title: "View Seminar Discussion",
			zoom: {
				top: 1180 / 2160,
				left: 140 / 1528,
				width: 1248 / 1528,
				height: 620 / 2160,
			},
		},
		// Page 5: Campus conversations photo
		{
			faceIndex: 5,
			top: 360 / 2160,
			left: 140 / 1528,
			width: 1248 / 1528,
			height: 740 / 2160,
			title: "View Campus Moments",
			zoom: {
				top: 360 / 2160,
				left: 140 / 1528,
				width: 1248 / 1528,
				height: 740 / 2160,
			},
		},
		// Page 5: Shared laughter
		{
			faceIndex: 5,
			top: 1170 / 2160,
			left: 140 / 1528,
			width: 594 / 1528,
			height: 680 / 2160,
			title: "View Shared Laughter",
			zoom: {
				top: 1170 / 2160,
				left: 140 / 1528,
				width: 594 / 1528,
				height: 680 / 2160,
			},
		},
		// Page 5: Breakthrough moments
		{
			faceIndex: 5,
			top: 1170 / 2160,
			left: 794 / 1528,
			width: 594 / 1528,
			height: 680 / 2160,
			title: "View Breakthrough Moment",
			zoom: {
				top: 1170 / 2160,
				left: 794 / 1528,
				width: 594 / 1528,
				height: 680 / 2160,
			},
		},
		// Page 7: Mentorship photo
		{
			faceIndex: 7,
			top: 380 / 2160,
			left: 868 / 1528,
			width: 520 / 1528,
			height: 680 / 2160,
			title: "View Mentorship Memory",
			zoom: {
				top: 380 / 2160,
				left: 868 / 1528,
				width: 520 / 1528,
				height: 680 / 2160,
			},
		},
		// Page 8: Class photo album
		{
			faceIndex: 8,
			top: 360 / 2160,
			left: 140 / 1528,
			width: 1248 / 1528,
			height: 820 / 2160,
			title: "View Class Graduation Album",
			zoom: {
				top: 360 / 2160,
				left: 140 / 1528,
				width: 1248 / 1528,
				height: 820 / 2160,
			},
		},
		// Page 10: Final Thank You portrait
		{
			faceIndex: 10,
			top: 410 / 2160,
			left: 494 / 1528,
			width: 540 / 1528,
			height: 680 / 2160,
			title: "View Tribute Portrait",
			zoom: {
				top: 410 / 2160,
				left: 494 / 1528,
				width: 540 / 1528,
				height: 680 / 2160,
			},
		},
	];

	// Initialize Flipbook engine
	window.flipbook = new Flipbook({
		containerEl,
		textureUrls: {
			pages: renderedPages,
			spineInner: "/images/textures/spine.jpg",
			spineOuter: "/images/textures/spine.jpg",
			coverEdgeTB: "/images/textures/cover-edge-tb.jpg",
			coverEdgeLR: "/images/textures/cover-edge-lr.jpg",
			spineEdgeTB: "/images/textures/spine-edge-tb.jpg",
			spineEdgeLR: "/images/textures/cover-edge-tb.jpg",
			desk: "/images/textures/desk.jpg",
		},
		pageEdgeColor: 0xd6c29b,
		pageWidth,
		pageHeight,
		coverThickness: 5,
		pageRootThickness: 4,
		pageThickness: 1.5,
		coverMarginX: 8,
		coverMarginY: 10,
		pageActiveAreas,
	});

	// Setup Navigation Dock & UI
	setupUserInterface(window.flipbook);
});

function setupUserInterface(flipbook: Flipbook): void {
	const navDock = document.getElementById("book-nav-dock");
	const btnPrev = document.getElementById("btn-prev");
	const btnNext = document.getElementById("btn-next");
	const btnToc = document.getElementById("btn-toc");
	const btnAudio = document.getElementById("btn-audio");
	const btnFullscreen = document.getElementById("btn-fullscreen");
	const spreadTag = document.getElementById("spread-tag");
	const spreadTitle = document.getElementById("spread-title");
	const spreadIndicator = document.getElementById("spread-indicator");
	const tocDrawer = document.getElementById("toc-drawer");
	const tocList = document.getElementById("toc-list");
	const tocCloseBtn = document.getElementById("toc-close-btn");
	const hintToast = document.getElementById("hint-toast");
	const iconSoundOn = document.getElementById("icon-sound-on");
	const iconSoundOff = document.getElementById("icon-sound-off");

	// Update sound icons according to state
	function updateSoundIcons(isMuted: boolean): void {
		if (iconSoundOn && iconSoundOff) {
			iconSoundOn.classList.toggle("hidden", isMuted);
			iconSoundOff.classList.toggle("hidden", !isMuted);
		}
	}
	updateSoundIcons(audioService.getMuted());

	// Populate Table of Contents
	if (tocList) {
		tocList.innerHTML = "";
		chapters.forEach(ch => {
			const li = document.createElement("li");
			li.className = `toc-item ${ch.page === 0 ? "active" : ""}`;
			li.dataset.page = String(ch.page);
			li.innerHTML = `
				<span class="toc-item-title">${ch.title}</span>
				<span class="toc-item-page">${ch.tag}</span>
			`;
			li.addEventListener("click", () => {
				flipbook.turnTo(ch.page);
				closeToc();
			});
			tocList.appendChild(li);
		});
	}

	function updateSpreadUI(pageIndex: number): void {
		const currentChapter =
			chapters.find(ch => ch.page === pageIndex) ||
			chapters[Math.min(pageIndex, chapters.length - 1)];

		if (spreadTag && spreadTitle) {
			spreadTag.textContent = currentChapter.tag;
			spreadTitle.textContent = currentChapter.title;
		}

		if (tocList) {
			tocList.querySelectorAll(".toc-item").forEach(item => {
				const p = Number((item as HTMLElement).dataset.page);
				item.classList.toggle("active", p === pageIndex);
			});
		}
	}

	// Flipbook page change listener
	flipbook.addPageChangeListener(pageIndex => {
		updateSpreadUI(pageIndex);
		audioService.playPageTurnSound();
	});

	// Button actions
	btnPrev?.addEventListener("click", e => {
		e.stopPropagation();
		flipbook.prevPage();
	});

	btnNext?.addEventListener("click", e => {
		e.stopPropagation();
		flipbook.nextPage();
	});

	btnAudio?.addEventListener("click", e => {
		e.stopPropagation();
		const isMuted = audioService.toggleMute();
		updateSoundIcons(isMuted);
	});

	btnFullscreen?.addEventListener("click", e => {
		e.stopPropagation();
		toggleFullscreen();
	});

	function toggleToc(): void {
		tocDrawer?.classList.toggle("hidden");
	}

	function closeToc(): void {
		tocDrawer?.classList.add("hidden");
	}

	btnToc?.addEventListener("click", e => {
		e.stopPropagation();
		toggleToc();
	});

	spreadIndicator?.addEventListener("click", e => {
		e.stopPropagation();
		toggleToc();
	});

	tocCloseBtn?.addEventListener("click", e => {
		e.stopPropagation();
		closeToc();
	});

	document.addEventListener("click", e => {
		if (
			tocDrawer &&
			!tocDrawer.classList.contains("hidden") &&
			!tocDrawer.contains(e.target as Node) &&
			!btnToc?.contains(e.target as Node)
		) {
			closeToc();
		}
	});

	// Keyboard shortcuts
	document.addEventListener("keydown", e => {
		if (e.key === "ArrowLeft" || e.code === "ArrowLeft" || e.key === "a") {
			flipbook.prevPage();
		} else if (
			e.key === "ArrowRight" ||
			e.code === "ArrowRight" ||
			e.key === "d" ||
			e.key === " "
		) {
			flipbook.nextPage();
		} else if (e.key === "Home") {
			flipbook.turnTo(0);
		} else if (e.key === "End") {
			flipbook.turnTo(flipbook.getTotalPages());
		} else if (e.key === "m" || e.key === "M") {
			const isMuted = audioService.toggleMute();
			updateSoundIcons(isMuted);
		} else if (e.key === "Escape") {
			closeToc();
		}
	});

	// Show UI once intro completes
	setTimeout(() => {
		navDock?.classList.add("visible");
		hintToast?.classList.add("visible");

		setTimeout(() => {
			hintToast?.classList.remove("visible");
		}, 7000);
	}, 4000);
}

function toggleFullscreen(): void {
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen?.().catch(err => {
			console.error("Fullscreen error", err);
		});
	} else {
		document.exitFullscreen?.().catch(err => {
			console.error("Exit fullscreen error", err);
		});
	}
}

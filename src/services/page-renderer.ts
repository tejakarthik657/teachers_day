import { BookContent } from "../data/book-content";

export class PageRenderer {
	private width: number;
	private height: number;
	private imageCache: Map<string, HTMLImageElement> = new Map();

	constructor(width = 1528, height = 2160) {
		this.width = width;
		this.height = height;
	}

	public async preloadImages(content: BookContent): Promise<void> {
		const urls = [
			content.cover.imagePath,
			content.page2.imagePath,
			content.page3.imagePath1,
			content.page3.imagePath2,
			...content.page5.moments.map(m => m.imagePath),
			content.page7.imagePath1,
			content.page7.imagePath2,
			content.page8.imagePath,
			content.page10.imagePath,
			"/img/csea-logo.png",
			"/img/developer-logo.png",
		];

		const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
		await Promise.all(
			uniqueUrls.map(url => this.loadImage(url).catch(() => null)),
		);
	}

	private loadImage(url: string): Promise<HTMLImageElement> {
		if (this.imageCache.has(url)) {
			return Promise.resolve(this.imageCache.get(url)!);
		}

		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = "anonymous";
			img.onload = () => {
				this.imageCache.set(url, img);
				resolve(img);
			};
			img.onerror = () => {
				reject(new Error(`Failed to load image: ${url}`));
			};
			img.src = url;
		});
	}

	public async renderAllPages(
		content: BookContent,
		onProgress?: (percent: number) => void,
	): Promise<string[]> {
		await this.preloadImages(content);
		await document.fonts?.ready;

		const isMobile =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent,
			) || window.innerWidth <= 768;

		// 1024x1448 on mobile (uses 1/4th VRAM, zero lag, silky smooth WebGL load)
		// 1600x2262 on desktop
		const targetWidth = isMobile ? 1024 : 1600;
		const targetHeight = Math.round(targetWidth * (this.height / this.width));
		const scaleX = targetWidth / this.width;
		const scaleY = targetHeight / this.height;

		const pages: string[] = [];
		for (let i = 0; i < 14; i++) {
			const canvas = document.createElement("canvas");
			canvas.width = targetWidth;
			canvas.height = targetHeight;
			const ctx = canvas.getContext("2d")!;
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = "high";

			ctx.save();
			ctx.scale(scaleX, scaleY);
			await this.renderPage(ctx, i, content);
			ctx.restore();

			pages.push(canvas.toDataURL("image/jpeg", 0.92));
			onProgress?.(Math.round(((i + 1) / 14) * 100));

			// Yield to browser UI thread to prevent main thread freezing
			await new Promise(resolve => setTimeout(resolve, 10));
		}

		return pages;
	}

	private async renderPage(
		ctx: CanvasRenderingContext2D,
		pageIndex: number,
		content: BookContent,
	): Promise<void> {
		switch (pageIndex) {
			case 0:
				await this.drawFrontCover(ctx, content);
				break;
			case 1:
				await this.drawDedication(ctx, content);
				break;
			case 2:
				await this.drawPage2(ctx, content);
				break;
			case 3:
				await this.drawPage3(ctx, content);
				break;
			case 4:
				await this.drawPage4(ctx, content);
				break;
			case 5:
				await this.drawPage5(ctx, content);
				break;
			case 6:
				await this.drawPage6(ctx, content);
				break;
			case 7:
				await this.drawPage7(ctx, content);
				break;
			case 8:
				await this.drawPage8(ctx, content);
				break;
			case 9:
				await this.drawPage9(ctx, content);
				break;
			case 10:
				await this.drawPage10(ctx, content);
				break;
			case 11:
				await this.drawInsideBackCover(ctx, content);
				break;
			case 12:
				await this.drawEndpaper(ctx, content);
				break;
			case 13:
				await this.drawBackCover(ctx, content);
				break;
			default:
				this.drawPaperBase(ctx);
		}
	}

	// ==================== DRAWING HELPERS ====================

	private drawPaperBase(ctx: CanvasRenderingContext2D): void {
		// Archival ivory parchment with rich warm paper gradient
		const grad = ctx.createRadialGradient(
			this.width * 0.5,
			this.height * 0.5,
			this.width * 0.1,
			this.width * 0.5,
			this.height * 0.5,
			this.height * 0.85,
		);
		grad.addColorStop(0, "#fcfaf5");
		grad.addColorStop(0.65, "#f7f0e4");
		grad.addColorStop(1, "#ebdcc4");

		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, this.width, this.height);

		// Fine paper fiber grain simulation
		ctx.save();
		ctx.fillStyle = "rgba(100, 70, 30, 0.02)";
		for (let i = 0; i < 5000; i++) {
			const x = Math.random() * this.width;
			const y = Math.random() * this.height;
			ctx.fillRect(x, y, 1.8, 1.8);
		}
		ctx.restore();
	}

	private drawCoverBase(ctx: CanvasRenderingContext2D): void {
		// Deep royal navy / charcoal leather cloth background
		const grad = ctx.createLinearGradient(0, 0, this.width, this.height);
		grad.addColorStop(0, "#0e1526");
		grad.addColorStop(0.5, "#152038");
		grad.addColorStop(1, "#0a0e1a");

		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, this.width, this.height);

		// Fine cloth texture
		ctx.save();
		ctx.fillStyle = "rgba(255, 230, 160, 0.025)";
		for (let i = 0; i < 6500; i++) {
			const x = Math.random() * this.width;
			const y = Math.random() * this.height;
			ctx.fillRect(x, y, 1.5, 1.5);
		}
		ctx.restore();
	}

	private drawPageBorders(
		ctx: CanvasRenderingContext2D,
		gold = true,
		inset = 80,
	): void {
		ctx.save();
		const strokeColor = gold ? "#c5a059" : "#3d2b1b";
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = 3;
		ctx.strokeRect(inset, inset, this.width - inset * 2, this.height - inset * 2);

		ctx.strokeStyle = gold ? "rgba(197, 160, 89, 0.4)" : "rgba(61, 43, 27, 0.35)";
		ctx.lineWidth = 1.2;
		ctx.strokeRect(inset + 14, inset + 14, this.width - (inset + 14) * 2, this.height - (inset + 14) * 2);

		// Corner filigree accents
		const corners = [
			[inset + 14, inset + 14],
			[this.width - inset - 14, inset + 14],
			[inset + 14, this.height - inset - 14],
			[this.width - inset - 14, this.height - inset - 14],
		];

		ctx.fillStyle = strokeColor;
		corners.forEach(([x, y]) => {
			ctx.beginPath();
			ctx.arc(x, y, 4.5, 0, Math.PI * 2);
			ctx.fill();
		});
		ctx.restore();
	}

	private drawHeaderAndFolio(
		ctx: CanvasRenderingContext2D,
		pageNumber: string,
		runningHead = "TEACHER'S DAY COMMEMORATION",
		isLeftPage = false,
	): void {
		ctx.save();
		ctx.fillStyle = "#1e1106";
		ctx.font = "900 24px 'Cinzel', serif";
		ctx.letterSpacing = "5px";

		// Running header at top
		ctx.textAlign = "center";
		ctx.fillText(runningHead, this.width / 2, 130);

		ctx.strokeStyle = "rgba(77, 51, 13, 0.6)";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(this.width * 0.22, 145);
		ctx.lineTo(this.width * 0.78, 145);
		ctx.stroke();

		// Folio at bottom
		ctx.font = "italic 700 28px 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#140c04";
		if (isLeftPage) {
			ctx.textAlign = "left";
			ctx.fillText(`—  ${pageNumber}  —`, 120, this.height - 120);
		} else {
			ctx.textAlign = "right";
			ctx.fillText(`—  ${pageNumber}  —`, this.width - 120, this.height - 120);
		}
		ctx.restore();
	}

	private drawImageFrame(
		ctx: CanvasRenderingContext2D,
		imgUrl: string,
		x: number,
		y: number,
		w: number,
		h: number,
		caption = "",
		placeholderLabel = "[PHOTO]",
	): void {
		ctx.save();
		// Outer shadow
		ctx.shadowColor = "rgba(30, 20, 10, 0.22)";
		ctx.shadowBlur = 24;
		ctx.shadowOffsetY = 12;

		// Frame matting
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(x, y, w, h);
		ctx.shadowColor = "transparent";

		const padding = 16;
		const captionHeight = caption ? 52 : 0;
		const innerX = x + padding;
		const innerY = y + padding;
		const innerW = w - padding * 2;
		const innerH = h - padding * 2 - captionHeight;

		// Gold inner border
		ctx.strokeStyle = "rgba(197, 160, 89, 0.6)";
		ctx.lineWidth = 1.5;
		ctx.strokeRect(innerX - 2, innerY - 2, innerW + 4, innerH + 4);

		const img = this.imageCache.get(imgUrl);
		if (img && img.complete && img.naturalWidth > 0) {
			// Draw image with object-fit: cover
			ctx.save();
			ctx.beginPath();
			ctx.rect(innerX, innerY, innerW, innerH);
			ctx.clip();

			const imgAspect = img.naturalWidth / img.naturalHeight;
			const frameAspect = innerW / innerH;
			let drawW = innerW;
			let drawH = innerH;
			let offX = innerX;
			let offY = innerY;

			if (imgAspect > frameAspect) {
				drawW = innerH * imgAspect;
				offX = innerX - (drawW - innerW) / 2;
			} else {
				drawH = innerW / imgAspect;
				offY = innerY - (drawH - innerH) / 2;
			}

			ctx.drawImage(img, offX, offY, drawW, drawH);
			ctx.restore();
		} else {
			// Elegant academic photo placeholder
			ctx.fillStyle = "#ede2cf";
			ctx.fillRect(innerX, innerY, innerW, innerH);

			ctx.fillStyle = "#8a7356";
			ctx.font = "600 24px 'Cinzel', serif";
			ctx.textAlign = "center";
			ctx.fillText("✦ " + placeholderLabel + " ✦", innerX + innerW / 2, innerY + innerH / 2 - 10);
			ctx.font = "italic 20px 'Cormorant Garamond', serif";
			ctx.fillText("Replace in public/images/", innerX + innerW / 2, innerY + innerH / 2 + 25);
		}

		if (caption) {
			ctx.fillStyle = "#1e160e";
			ctx.font = "italic 700 21px 'Cormorant Garamond', Georgia, serif";
			ctx.textAlign = "center";
			this.wrapText(
				ctx,
				caption,
				x + w / 2,
				y + h - captionHeight + 16,
				w - padding * 3,
				26,
				2,
			);
		}
		ctx.restore();
	}

	private wrapText(
		ctx: CanvasRenderingContext2D,
		text: string,
		x: number,
		y: number,
		maxWidth: number,
		lineHeight: number,
		maxLines = 100,
	): number {
		ctx.save();
		// Subtle ink letterpress depth effect for maximum legibility and real book printing look
		if (!ctx.shadowColor || ctx.shadowColor === "rgba(0, 0, 0, 0)" || ctx.shadowColor === "transparent") {
			ctx.shadowColor = "rgba(18, 12, 7, 0.15)";
			ctx.shadowBlur = 1;
			ctx.shadowOffsetX = 0.5;
			ctx.shadowOffsetY = 0.5;
		}

		const paragraphs = text.split("\n");
		let currentY = y;

		for (const para of paragraphs) {
			if (!para.trim()) {
				currentY += lineHeight * 0.6;
				continue;
			}

			const words = para.split(" ");
			let line = "";
			let lineCount = 0;

			for (let n = 0; n < words.length; n++) {
				const testLine = line + words[n] + " ";
				const metrics = ctx.measureText(testLine);
				if (metrics.width > maxWidth && n > 0) {
					ctx.fillText(line.trim(), x, currentY);
					line = words[n] + " ";
					currentY += lineHeight;
					lineCount++;
					if (lineCount >= maxLines) break;
				} else {
					line = testLine;
				}
			}
			ctx.fillText(line.trim(), x, currentY);
			currentY += lineHeight;
		}

		ctx.restore();
		return currentY;
	}

	// ==================== SPECIFIC PAGES ====================

	// Page 0: FRONT COVER
	private async drawFrontCover(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawCoverBase(ctx);
		this.drawPageBorders(ctx, true, 90);

		ctx.save();
		ctx.textAlign = "center";

		// Gold foil header in Harry Potter Style
		ctx.fillStyle = "#dfb76c";
		ctx.font = "900 64px 'Cinzel Decorative', 'MedievalSharp', 'Cinzel', serif";
		ctx.letterSpacing = "8px";
		ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
		ctx.shadowBlur = 12;
		ctx.fillText(content.cover.title, this.width / 2, 270);

		ctx.font = "700 32px 'Cinzel Decorative', 'Cinzel', serif";
		ctx.letterSpacing = "6px";
		ctx.fillStyle = "#c5a059";
		ctx.fillText(content.cover.subtitle, this.width / 2, 350);

		// Filigree ornament divider
		ctx.strokeStyle = "rgba(223, 183, 108, 0.6)";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(this.width / 2 - 240, 400);
		ctx.lineTo(this.width / 2 + 240, 400);
		ctx.stroke();

		ctx.font = "700 22px 'Cinzel Decorative', serif";
		ctx.fillStyle = "#dfb76c";
		ctx.letterSpacing = "4px";
		ctx.fillText("✦  COMMEMORATIVE EDITION  ✦", this.width / 2, 445);

		ctx.font = "italic 700 34px 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#f5eee1";
		ctx.fillText(`“${content.cover.tagline}”`, this.width / 2, 530);

		// CSEA Emblem Logo (Clean placement with zero text overlap)
		const emblemSize = 480;
		const emblemY = 620;
		const emblemX = this.width / 2 - emblemSize / 2;

		const emblemImg = this.imageCache.get("/img/csea-logo.png");
		if (emblemImg && emblemImg.complete) {
			ctx.drawImage(emblemImg, emblemX, emblemY, emblemSize, emblemSize);
		} else {
			ctx.strokeStyle = "#dfb76c";
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.arc(this.width / 2, emblemY + emblemSize / 2, emblemSize / 2 - 10, 0, Math.PI * 2);
			ctx.stroke();
			ctx.font = "700 26px 'Cinzel Decorative', serif";
			ctx.fillStyle = "#dfb76c";
			ctx.fillText("★ CSEA ★", this.width / 2, emblemY + emblemSize / 2);
		}

		// Bottom Tribute Text Block (Positioned with generous clearance below emblem)
		ctx.font = "700 46px 'Cinzel Decorative', 'MedievalSharp', 'Cinzel', serif";
		ctx.fillStyle = "#f7df94";
		ctx.letterSpacing = "6px";
		ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
		ctx.shadowBlur = 8;
		ctx.fillText(content.cover.greeting, this.width / 2, 1460);

		ctx.font = "700 50px 'Cinzel Decorative', 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#ffffff";
		ctx.letterSpacing = "2px";
		ctx.fillText(content.teacher.name, this.width / 2, 1550);

		ctx.font = "700 28px 'Cinzel', serif";
		ctx.fillStyle = "#dfb76c";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.teacher.department, this.width / 2, 1630);

		ctx.font = "600 24px 'Cinzel', serif";
		ctx.fillStyle = "#c5a059";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.teacher.institution, this.width / 2, 1690);

		ctx.restore();
	}

	// Page 1: INSIDE FRONT COVER (DEDICATION & CSEA CORE OBJECTIVES)
	private async drawDedication(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, false, 110);
		this.drawHeaderAndFolio(ctx, "I", "CSEA CHARTER & CORE OBJECTIVES", true);

		ctx.save();
		ctx.textAlign = "center";

		// Central CSEA Emblem Graphic at Top
		const emblemImg = this.imageCache.get("/img/csea-logo.png");
		if (emblemImg && emblemImg.complete) {
			ctx.globalAlpha = 0.95;
			ctx.drawImage(emblemImg, this.width / 2 - 130, 200, 260, 260);
			ctx.globalAlpha = 1.0;
		}

		ctx.font = "700 24px 'Cinzel Decorative', 'Cinzel', serif";
		ctx.fillStyle = "#6b4f2c";
		ctx.letterSpacing = "5px";
		ctx.fillText(content.dedication.exLibris, this.width / 2, 500);

		ctx.font = "900 52px 'Cinzel Decorative', 'MedievalSharp', Georgia, serif";
		ctx.fillStyle = "#180d05";
		ctx.fillText(content.dedication.heading, this.width / 2, 570);

		ctx.strokeStyle = "#c5a059";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(this.width / 2 - 180, 605);
		ctx.lineTo(this.width / 2 + 180, 605);
		ctx.stroke();

		// Vision Intro Body
		ctx.font = "italic 700 30px/1.6 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#120a04";
		ctx.textAlign = "center";
		this.wrapText(
			ctx,
			content.dedication.body,
			this.width / 2,
			650,
			920,
			48,
		);

		// Core Objectives Cards
		let objY = 760;
		content.dedication.objectives?.forEach(obj => {
			// Card background
			ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
			ctx.fillRect(140, objY, this.width - 280, 180);
			ctx.strokeStyle = "rgba(197, 160, 89, 0.6)";
			ctx.lineWidth = 1.5;
			ctx.strokeRect(140, objY, this.width - 280, 180);

			// Number badge circle
			ctx.fillStyle = "#c5a059";
			ctx.beginPath();
			ctx.arc(220, objY + 90, 42, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillStyle = "#ffffff";
			ctx.font = "900 28px 'Cinzel Decorative', serif";
			ctx.textAlign = "center";
			ctx.fillText(obj.number, 220, objY + 99);

			// Title & Description
			ctx.textAlign = "left";
			ctx.fillStyle = "#140d06";
			ctx.font = "900 32px 'Cinzel Decorative', 'Cormorant Garamond', Georgia, serif";
			ctx.fillText(obj.title, 290, objY + 65);

			ctx.font = "700 26px/1.5 'Cormorant Garamond', Georgia, serif";
			ctx.fillStyle = "#1a120a";
			this.wrapText(ctx, obj.description, 290, objY + 110, this.width - 470, 36);

			objY += 210;
		});

		// Presented To / By Footer
		ctx.textAlign = "center";
		ctx.font = "900 34px 'Cinzel Decorative', 'Cinzel', serif";
		ctx.fillStyle = "#140d06";
		ctx.fillText(content.dedication.presentedTo, this.width / 2, 1490);

		ctx.font = "italic 700 30px 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#4a351e";
		ctx.fillText(content.dedication.presentedBy, this.width / 2, 1550);

		ctx.restore();
	}

	// Page 2: TRIBUTE TO OUR VISIONARY HOD
	private async drawPage2(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, false, 80);
		this.drawHeaderAndFolio(ctx, "02", "HEAD OF DEPARTMENT TRIBUTE", false);

		ctx.save();
		// Heading
		ctx.textAlign = "left";
		ctx.fillStyle = "#180d05";
		ctx.font = "900 54px 'Cinzel Decorative', 'MedievalSharp', Georgia, serif";
		ctx.fillText(content.page2.heading, 140, 240);

		ctx.font = "700 24px 'Cinzel Decorative', serif";
		ctx.fillStyle = "#7a5a29";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page2.subheading.toUpperCase(), 140, 290);

		// HOD Portrait Photo on the Right Side
		const imgW = 620;
		const imgH = 760;
		const imgX = this.width - 140 - imgW;
		const imgY = 350;
		this.drawImageFrame(
			ctx,
			content.page2.imagePath,
			imgX,
			imgY,
			imgW,
			imgH,
			content.page2.caption,
			"[HOD PORTRAIT]",
		);

		// Lead Quote Box on the left of HOD photo
		const quoteBoxX = 140;
		const quoteBoxY = 350;
		const quoteBoxW = this.width - imgW - 340;

		ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
		ctx.fillRect(quoteBoxX, quoteBoxY, quoteBoxW, 400);
		ctx.strokeStyle = "#c5a059";
		ctx.lineWidth = 2;
		ctx.strokeRect(quoteBoxX, quoteBoxY, quoteBoxW, 400);

		ctx.fillStyle = "rgba(197, 160, 89, 0.35)";
		ctx.font = "700 160px 'Cormorant Garamond', serif";
		ctx.fillText("“", quoteBoxX + 20, quoteBoxY + 130);

		ctx.textAlign = "left";
		ctx.fillStyle = "#120a04";
		ctx.font = "italic 700 34px/1.6 'Cormorant Garamond', Georgia, serif";
		this.wrapText(
			ctx,
			content.page2.leadQuote,
			quoteBoxX + 36,
			quoteBoxY + 80,
			quoteBoxW - 72,
			50,
		);

		// Narrative Tribute Body below photo and quote box
		ctx.font = "700 34px/1.8 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#110903";
		this.wrapText(
			ctx,
			content.page2.content,
			140,
			1180,
			this.width - 280,
			56,
		);

		ctx.restore();
	}

	// Page 3: WHERE IT ALL HAPPENED (Classroom)
	private async drawPage3(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, false, 80);
		this.drawHeaderAndFolio(ctx, "03", "THE CLASSROOM & MEMORIES", true);

		ctx.save();
		ctx.textAlign = "left";
		ctx.fillStyle = "#180d05";
		ctx.font = "italic 900 60px 'Cormorant Garamond', Georgia, serif";
		ctx.fillText(content.page3.heading, 140, 240);

		ctx.font = "700 24px 'Cinzel', serif";
		ctx.fillStyle = "#7a5a29";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page3.subheading.toUpperCase(), 140, 290);

		ctx.font = "italic 700 30px/1.6 'Cormorant Garamond', serif";
		ctx.fillStyle = "#120a04";
		this.wrapText(ctx, content.page3.intro, 140, 360, this.width - 280, 46);

		// Two editorial classroom photographs
		const photoW = this.width - 280;
		const photoH = 620;

		this.drawImageFrame(
			ctx,
			content.page3.imagePath1,
			140,
			460,
			photoW,
			photoH,
			content.page3.caption1,
			"[CLASSROOM LECTURE]",
		);

		this.drawImageFrame(
			ctx,
			content.page3.imagePath2,
			140,
			1180,
			photoW,
			photoH,
			content.page3.caption2,
			"[SEMINAR & DISCUSSIONS]",
		);

		ctx.restore();
	}

	// Page 4: LESSONS BEYOND THE BOOK
	private async drawPage4(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, false, 80);
		this.drawHeaderAndFolio(ctx, "04", "PRINCIPLES & WISDOM", false);

		ctx.save();
		ctx.textAlign = "left";
		ctx.fillStyle = "#180d05";
		ctx.font = "italic 900 60px 'Cormorant Garamond', Georgia, serif";
		ctx.fillText(content.page4.heading, 140, 240);

		ctx.font = "700 24px 'Cinzel', serif";
		ctx.fillStyle = "#7a5a29";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page4.subheading.toUpperCase(), 140, 290);

		let startY = 380;
		content.page4.principles.forEach(p => {
			// Card background
			ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
			ctx.fillRect(140, startY, this.width - 280, 190);
			ctx.strokeStyle = "rgba(197, 160, 89, 0.5)";
			ctx.lineWidth = 1.2;
			ctx.strokeRect(140, startY, this.width - 280, 190);

			// Number circle
			ctx.fillStyle = "#c5a059";
			ctx.beginPath();
			ctx.arc(220, startY + 95, 45, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillStyle = "#ffffff";
			ctx.font = "900 28px 'Cinzel', serif";
			ctx.textAlign = "center";
			ctx.fillText(p.number, 220, startY + 104);

			// Title and description
			ctx.textAlign = "left";
			ctx.fillStyle = "#140d06";
			ctx.font = "900 34px 'Cormorant Garamond', Georgia, serif";
			ctx.fillText(p.title, 295, startY + 70);

			ctx.font = "700 28px/1.5 'Cormorant Garamond', Georgia, serif";
			ctx.fillStyle = "#1a120a";
			this.wrapText(ctx, p.description, 295, startY + 115, this.width - 480, 38);

			startY += 230;
		});

		// Accent Quote at bottom
		ctx.textAlign = "center";
		ctx.font = "italic 900 36px 'Cormorant Garamond', serif";
		ctx.fillStyle = "#6b4f2c";
		ctx.fillText(content.page4.accentQuote, this.width / 2, startY + 120);

		ctx.restore();
	}

	// Page 5: MOMENTS WE REMEMBER (Photo spread)
	private async drawPage5(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, false, 80);
		this.drawHeaderAndFolio(ctx, "05", "MEMORIES WE CHERISH", true);

		ctx.save();
		ctx.textAlign = "left";
		ctx.fillStyle = "#180d05";
		ctx.font = "italic 900 60px 'Cormorant Garamond', Georgia, serif";
		ctx.fillText(content.page5.heading, 140, 240);

		ctx.font = "700 24px 'Cinzel', serif";
		ctx.fillStyle = "#7a5a29";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page5.subheading.toUpperCase(), 140, 290);

		// Editorial grid: 1 large photo top, 2 side-by-side bottom
		const mainW = this.width - 280;
		const mainH = 660;
		const m0 = content.page5.moments[0];
		this.drawImageFrame(
			ctx,
			m0.imagePath,
			140,
			340,
			mainW,
			mainH,
			`${m0.caption} — ${m0.detail}`,
			"[CAMPUS CONVERSATIONS]",
		);

		const subW = (this.width - 340) / 2;
		const subH = 640;
		const m1 = content.page5.moments[1];
		const m2 = content.page5.moments[2];

		this.drawImageFrame(
			ctx,
			m1.imagePath,
			140,
			1040,
			subW,
			subH,
			`${m1.caption} — ${m1.detail}`,
			"[SHARED LAUGHTER]",
		);

		this.drawImageFrame(
			ctx,
			m2.imagePath,
			140 + subW + 60,
			1040,
			subW,
			subH,
			`${m2.caption} — ${m2.detail}`,
			"[MOMENTS OF CLARITY]",
		);

		ctx.restore();
	}

	// Page 6: WORDS THAT STAYED WITH US (Quotations)
	private async drawPage6(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, false, 80);
		this.drawHeaderAndFolio(ctx, "06", "WORDS THAT STAYED WITH US", false);

		ctx.save();
		ctx.textAlign = "left";
		ctx.fillStyle = "#180d05";
		ctx.font = "italic 900 60px 'Cormorant Garamond', Georgia, serif";
		ctx.fillText(content.page6.heading, 140, 240);

		ctx.font = "700 24px 'Cinzel', serif";
		ctx.fillStyle = "#7a5a29";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page6.subheading.toUpperCase(), 140, 290);

		let quoteY = 400;
		content.page6.quotes.forEach(q => {
			// Card
			ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
			ctx.fillRect(140, quoteY, this.width - 280, 360);
			ctx.strokeStyle = "#c5a059";
			ctx.lineWidth = 1.5;
			ctx.strokeRect(140, quoteY, this.width - 280, 360);

			// Big Gold Quotation Mark
			ctx.fillStyle = "rgba(197, 160, 89, 0.35)";
			ctx.font = "700 180px 'Cormorant Garamond', serif";
			ctx.fillText("“", 180, quoteY + 150);

			// Quote text
			ctx.fillStyle = "#120a04";
			ctx.font = "italic 700 38px/1.6 'Cormorant Garamond', Georgia, serif";
			this.wrapText(ctx, q.quote, 220, quoteY + 90, this.width - 440, 54);

			// Context & attribution
			ctx.font = "700 24px 'Cinzel', serif";
			ctx.fillStyle = "#6b4f2c";
			ctx.textAlign = "right";
			ctx.fillText(`${q.context}  ${content.page6.attribution}`, this.width - 200, quoteY + 310);

			ctx.textAlign = "left";
			quoteY += 440;
		});

		ctx.restore();
	}

	// Page 7: WHAT YOU LEFT WITH US (The Impact / Legacy)
	private async drawPage7(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, false, 80);
		this.drawHeaderAndFolio(ctx, "07", "THE ENDURING IMPACT", true);

		ctx.save();
		ctx.textAlign = "left";
		ctx.fillStyle = "#180d05";
		ctx.font = "italic 900 60px 'Cormorant Garamond', Georgia, serif";
		ctx.fillText(content.page7.heading, 140, 240);

		ctx.font = "900 24px 'Cinzel', serif";
		ctx.fillStyle = "#36210b";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page7.subheading.toUpperCase(), 140, 290);

		// 1. Left Column: Original 5 Pillars
		let pillarY = 370;
		content.page7.pillars.forEach(p => {
			ctx.fillStyle = "#0f0803";
			ctx.font = "900 36px 'Cormorant Garamond', Georgia, serif";
			ctx.fillText(`✦  ${p.trait}`, 140, pillarY);

			ctx.font = "700 26px/1.4 'Cormorant Garamond', Georgia, serif";
			ctx.fillStyle = "#140d06";
			this.wrapText(ctx, p.meaning, 180, pillarY + 40, 620, 34);

			pillarY += 175;
		});

		// 2. Right Column Top: Original Photo 5 (Vertical Portrait)
		const photo5X = 848;
		const photo5Y = 360;
		const photo5W = this.width - 140 - photo5X; // 540
		const photo5H = 560;

		this.drawImageFrame(
			ctx,
			content.page7.imagePath1,
			photo5X,
			photo5Y,
			photo5W,
			photo5H,
			content.page7.caption1,
			"[MENTORSHIP & GUIDANCE]",
		);

		// 3. Right Column Middle: Original Callout Quote Box
		const quoteBoxY = photo5Y + photo5H + 30; // 950
		const quoteBoxH = 260;

		ctx.fillStyle = "rgba(245, 238, 226, 0.95)";
		ctx.fillRect(photo5X, quoteBoxY, photo5W, quoteBoxH);
		ctx.strokeStyle = "#4d330d";
		ctx.lineWidth = 2;
		ctx.strokeRect(photo5X, quoteBoxY, photo5W, quoteBoxH);

		ctx.textAlign = "center";
		ctx.fillStyle = "#0f0803";
		ctx.font = "italic 700 28px/1.5 'Cormorant Garamond', Georgia, serif";
		this.wrapText(
			ctx,
			content.page7.sideNote,
			photo5X + photo5W / 2,
			quoteBoxY + 80,
			photo5W - 60,
			40,
		);

		// 4. Lower Section: Photo 7 (Horizontal Landscape Image spanning full content width)
		ctx.textAlign = "left";
		const horizPhotoX = 140;
		const horizPhotoY = 1260;
		const horizPhotoW = this.width - 280; // 1248px wide
		const horizPhotoH = 620; // wide landscape format

		this.drawImageFrame(
			ctx,
			content.page7.imagePath2,
			horizPhotoX,
			horizPhotoY,
			horizPhotoW,
			horizPhotoH,
			content.page7.caption2,
			"[FACULTY & CSEA FAMILY]",
		);

		ctx.restore();
	}

	// Page 8: THE PEOPLE AND THE MEMORIES (Photo Album)
	private async drawPage8(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, false, 80);
		this.drawHeaderAndFolio(ctx, "08", "CLASS PHOTO ALBUM", false);

		ctx.save();
		ctx.textAlign = "left";
		ctx.fillStyle = "#180d05";
		ctx.font = "italic 900 60px 'Cormorant Garamond', Georgia, serif";
		ctx.fillText(content.page8.heading, 140, 240);

		ctx.font = "700 24px 'Cinzel', serif";
		ctx.fillStyle = "#7a5a29";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page8.subheading.toUpperCase(), 140, 290);

		// Large class photo with vintage photo album mounts
		const photoW = this.width - 280;
		const photoH = 820;
		const photoX = 140;
		const photoY = 360;

		this.drawImageFrame(
			ctx,
			content.page8.imagePath,
			photoX,
			photoY,
			photoW,
			photoH,
			content.page8.caption,
			"[GRADUATION & CLASS PHOTO]",
		);

		// Album Notes Box below photo
		const notesY = 1260;
		ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
		ctx.fillRect(photoX, notesY, photoW, 460);
		ctx.strokeStyle = "rgba(197, 160, 89, 0.5)";
		ctx.lineWidth = 1.2;
		ctx.strokeRect(photoX, notesY, photoW, 460);

		ctx.fillStyle = "#6b4f2c";
		ctx.font = "700 26px 'Cinzel', serif";
		ctx.letterSpacing = "3px";
		ctx.fillText("MOMENTS WE WILL ALWAYS HOLD DEAR", photoX + 40, notesY + 60);

		let itemY = notesY + 130;
		content.page8.albumNotes.forEach(note => {
			ctx.fillStyle = "#c5a059";
			ctx.font = "30px serif";
			ctx.fillText("✦", photoX + 40, itemY);

			ctx.fillStyle = "#120a04";
			ctx.font = "italic 700 32px 'Cormorant Garamond', Georgia, serif";
			ctx.fillText(note, photoX + 90, itemY);

			itemY += 90;
		});

		ctx.restore();
	}

	// Page 9: FROM ALL OF US (Collective Student Letter)
	private async drawPage9(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, false, 80);
		this.drawHeaderAndFolio(ctx, "09", "A MESSAGE FROM THE STUDENTS", true);

		ctx.save();
		ctx.textAlign = "left";
		ctx.fillStyle = "#180d05";
		ctx.font = "italic 900 60px 'Cormorant Garamond', Georgia, serif";
		ctx.fillText(content.page9.heading, 140, 240);

		ctx.font = "700 24px 'Cinzel', serif";
		ctx.fillStyle = "#7a5a29";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page9.subheading.toUpperCase(), 140, 290);

		// Letter Paper Parchment Inset
		const insetX = 140;
		const insetY = 360;
		const insetW = this.width - 280;
		const insetH = 1380;

		ctx.fillStyle = "#ffffff";
		ctx.shadowColor = "rgba(30, 20, 10, 0.1)";
		ctx.shadowBlur = 24;
		ctx.shadowOffsetY = 10;
		ctx.fillRect(insetX, insetY, insetW, insetH);
		ctx.shadowColor = "transparent";

		ctx.strokeStyle = "#c5a059";
		ctx.lineWidth = 1.5;
		ctx.strokeRect(insetX, insetY, insetW, insetH);

		// Gold inner accent border
		ctx.strokeStyle = "rgba(197, 160, 89, 0.35)";
		ctx.lineWidth = 1;
		ctx.strokeRect(insetX + 12, insetY + 12, insetW - 24, insetH - 24);

		// Letter Text
		ctx.fillStyle = "#120a04";
		ctx.font = "700 36px/1.9 'Cormorant Garamond', Georgia, serif";

		let textY = insetY + 130;
		for (const para of content.page9.letterParagraphs) {
			textY = this.wrapText(ctx, para, insetX + 80, textY, insetW - 160, 60);
			textY += 45;
		}

		// Signature Block (Wrapped within parchment bounds)
		textY += 30;
		ctx.font = "italic 700 32px 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#4a351e";
		this.wrapText(ctx, content.page9.signatureLabel, insetX + 80, textY, insetW - 160, 44);

		textY += 60;
		ctx.font = "900 34px 'Cinzel Decorative', 'Cinzel', serif";
		ctx.fillStyle = "#140d06";
		ctx.letterSpacing = "2px";
		this.wrapText(ctx, content.page9.signatories, insetX + 80, textY, insetW - 160, 48);

		// Footnote / Calligraphy Motto
		ctx.textAlign = "center";
		ctx.font = "italic 700 34px 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#6b4f2c";
		ctx.fillText(content.page9.footnote, this.width / 2, insetY + insetH - 70);

		ctx.restore();
	}

	// Page 10: FINAL THANK YOU
	private async drawPage10(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, true, 80);
		this.drawHeaderAndFolio(ctx, "10", "HONORING OUR MENTOR", false);

		ctx.save();
		ctx.textAlign = "center";

		// Large celebratory heading
		ctx.font = "900 64px 'Cinzel Decorative', 'Cinzel', serif";
		ctx.fillStyle = "#66420b";
		ctx.letterSpacing = "6px";
		ctx.fillText(content.page10.heading, this.width / 2, 260);

		ctx.font = "700 28px 'Cinzel Decorative', 'Cinzel', serif";
		ctx.fillStyle = "#c5a059";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page10.greeting, this.width / 2, 330);

		// Framed photo
		const frameW = 540;
		const frameH = 640;
		const frameX = this.width / 2 - frameW / 2;
		const frameY = 390;
		this.drawImageFrame(
			ctx,
			content.page10.imagePath,
			frameX,
			frameY,
			frameW,
			frameH,
			`Honoring Our Beloved Faculty`,
			"[TRIBUTE PORTRAIT]",
		);

		// Stanza of Gratitude
		let stanzaY = 1120;
		ctx.font = "italic 700 36px/1.8 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#120a04";

		content.page10.stanza.forEach(line => {
			ctx.fillText(line, this.width / 2, stanzaY);
			stanzaY += 60;
		});

		// Closing (Centered perfectly at this.width / 2 with zero left shift)
		stanzaY += 50;
		ctx.font = "900 36px 'Cinzel Decorative', 'Cinzel', serif";
		ctx.fillStyle = "#140d06";
		ctx.letterSpacing = "3px";
		this.wrapText(
			ctx,
			content.page10.closing,
			this.width / 2,
			stanzaY,
			this.width - 280,
			52,
		);

		ctx.restore();
	}

	// Page 11: INSIDE BACK COVER
	private async drawInsideBackCover(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, true, 110);
		this.drawHeaderAndFolio(ctx, "VALEDICTION", "ARCHIVAL RECORD", true);

		ctx.save();
		ctx.textAlign = "center";

		const emblemImg = this.imageCache.get("/img/csea-logo.png");
		if (emblemImg && emblemImg.complete) {
			ctx.drawImage(emblemImg, this.width / 2 - 190, 320, 380, 380);
		}

		ctx.font = "900 46px 'Cinzel Decorative', 'Cinzel', serif";
		ctx.fillStyle = "#66420b";
		ctx.letterSpacing = "6px";
		ctx.fillText(content.insideBackCover.sealTitle, this.width / 2, 780);

		ctx.font = "italic 700 32px/1.6 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#4a351e";
		this.wrapText(
			ctx,
			content.insideBackCover.sealBody,
			this.width / 2,
			860,
			this.width - 360,
			50,
		);

		ctx.font = "italic 700 38px/1.7 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#120a04";
		this.wrapText(
			ctx,
			content.insideBackCover.quote,
			this.width / 2,
			1080,
			this.width - 320,
			58,
		);

		ctx.font = "900 28px 'Cinzel Decorative', 'Cinzel', serif";
		ctx.fillStyle = "#66420b";
		ctx.letterSpacing = "3px";
		this.wrapText(
			ctx,
			`— ${content.insideBackCover.attribution.toUpperCase()} —`,
			this.width / 2,
			1360,
			this.width - 320,
			42,
		);

		ctx.restore();
	}

	// Page 12: PRESENTATION & DEVELOPER CREDITS
	private async drawEndpaper(
		ctx: CanvasRenderingContext2D,
		_content: BookContent,
	): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, false, 80);
		this.drawHeaderAndFolio(ctx, "CREDITS", "OFFICIAL IMPRINT", false);

		ctx.save();
		ctx.textAlign = "center";

		// Section 1: Presentation Header
		ctx.font = "900 28px 'Cinzel Decorative', 'Cinzel', serif";
		ctx.fillStyle = "#0a0401";
		ctx.letterSpacing = "6px";
		ctx.fillText("PRESENTED WITH GRATITUDE BY", this.width / 2, 260);

		ctx.font = "900 56px 'Cinzel Decorative', 'Cinzel', serif";
		ctx.fillStyle = "#000000";
		ctx.letterSpacing = "5px";
		ctx.fillText("C S E A", this.width / 2, 340);

		ctx.font = "900 28px 'Cinzel', serif";
		ctx.fillStyle = "#0a0401";
		ctx.letterSpacing = "3px";
		ctx.fillText("Computer Science & Engineering Association", this.width / 2, 395);

		// CSEA Emblem Frame
		const emblemImg = this.imageCache.get("/img/csea-logo.png");
		const cseaSize = 340;
		if (emblemImg && emblemImg.complete) {
			ctx.drawImage(emblemImg, this.width / 2 - cseaSize / 2, 440, cseaSize, cseaSize);
		}

		// Filigree ornament divider line
		ctx.strokeStyle = "#4d330d";
		ctx.lineWidth = 2.5;
		ctx.beginPath();
		ctx.moveTo(this.width / 2 - 240, 835);
		ctx.lineTo(this.width / 2 + 240, 835);
		ctx.stroke();

		ctx.font = "900 26px 'Cinzel Decorative', serif";
		ctx.fillStyle = "#0a0401";
		ctx.letterSpacing = "4px";
		ctx.fillText("✦  DESIGN & ENGINEERING  ✦", this.width / 2, 880);

		// Section 2: Developer Attribution (DEVFRAMES)
		const devBoxX = 160;
		const devBoxY = 925;
		const devBoxW = this.width - 320;
		const devBoxH = 560;

		// Soft warm dark-tinted parchment card background (completely prevents specular glare/washed-out whiteout under 3D lighting)
		ctx.fillStyle = "rgba(240, 233, 220, 0.98)";
		ctx.shadowColor = "rgba(15, 10, 5, 0.2)";
		ctx.shadowBlur = 24;
		ctx.shadowOffsetY = 10;
		ctx.fillRect(devBoxX, devBoxY, devBoxW, devBoxH);
		ctx.shadowColor = "transparent";

		ctx.strokeStyle = "#4d330d";
		ctx.lineWidth = 3;
		ctx.strokeRect(devBoxX, devBoxY, devBoxW, devBoxH);

		// Double inner border for card
		ctx.strokeStyle = "rgba(77, 51, 13, 0.4)";
		ctx.lineWidth = 1.5;
		ctx.strokeRect(devBoxX + 10, devBoxY + 10, devBoxW - 20, devBoxH - 20);

		ctx.font = "900 26px 'Cinzel', serif";
		ctx.fillStyle = "#0a0401";
		ctx.letterSpacing = "5px";
		ctx.fillText("DESIGNED & DEVELOPED BY", this.width / 2, devBoxY + 70);

		ctx.font = "900 56px 'Cinzel Decorative', 'MedievalSharp', serif";
		ctx.fillStyle = "#000000";
		ctx.letterSpacing = "6px";
		ctx.fillText("DEVFRAMES", this.width / 2, devBoxY + 145);

		// Developer Logo Image inside Devframes card
		const devLogo = this.imageCache.get("/img/developer-logo.png");
		if (devLogo && devLogo.complete) {
			const devLogoW = 300;
			const devLogoH = (devLogo.naturalHeight / devLogo.naturalWidth) * devLogoW || 110;
			ctx.drawImage(devLogo, this.width / 2 - devLogoW / 2, devBoxY + 185, devLogoW, devLogoH);
		}

		ctx.font = "italic 700 32px/1.6 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#000000";
		this.wrapText(
			ctx,
			"Crafted with technical mastery, artistic precision, and deep respect for our educators.",
			this.width / 2,
			devBoxY + 385,
			devBoxW - 80,
			46,
		);

		// Section 3: Bottom Edition Footer
		ctx.font = "900 26px 'Cinzel Decorative', 'Cinzel', serif";
		ctx.fillStyle = "#0a0401";
		ctx.letterSpacing = "4px";
		ctx.fillText("COMMEMORATIVE DIGITAL MONOGRAPH • 2026", this.width / 2, 1600);

		ctx.restore();
	}

	// Page 13: OUTSIDE BACK COVER
	private async drawBackCover(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawCoverBase(ctx);
		this.drawPageBorders(ctx, true, 90);

		ctx.save();
		ctx.textAlign = "center";

		ctx.font = "700 24px 'Cinzel Decorative', 'Cinzel', serif";
		ctx.fillStyle = "#c5a059";
		ctx.letterSpacing = "6px";
		ctx.fillText("PRESENTED BY CSEA", this.width / 2, 280);

		const emblemImg = this.imageCache.get("/img/csea-logo.png");
		if (emblemImg && emblemImg.complete) {
			ctx.drawImage(emblemImg, this.width / 2 - 190, 340, 380, 380);
		}

		ctx.font = "900 54px 'Cinzel Decorative', 'Cinzel', serif";
		ctx.fillStyle = "#dfb76c";
		ctx.letterSpacing = "8px";
		ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
		ctx.shadowBlur = 10;
		ctx.fillText(content.backCover.title, this.width / 2, 800);

		ctx.font = "700 28px 'Cinzel Decorative', 'Cinzel', serif";
		ctx.fillStyle = "#c5a059";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.backCover.subtitle, this.width / 2, 870);

		ctx.font = "italic 700 32px 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#f5eee1";
		ctx.fillText(content.backCover.institution, this.width / 2, 1000);

		// Developer company logo placement on back cover
		const devBoxW = 480;
		const devBoxH = 340;
		const devBoxX = this.width / 2 - devBoxW / 2;
		const devBoxY = 1180;

		ctx.fillStyle = "rgba(212, 175, 55, 0.1)";
		ctx.fillRect(devBoxX, devBoxY, devBoxW, devBoxH);
		ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
		ctx.lineWidth = 1.5;
		ctx.strokeRect(devBoxX, devBoxY, devBoxW, devBoxH);

		ctx.font = "900 22px 'Cinzel', serif";
		ctx.fillStyle = "#c5a059";
		ctx.letterSpacing = "5px";
		ctx.fillText("DEVELOPED BY", this.width / 2, devBoxY + 55);

		ctx.font = "900 38px 'Cinzel Decorative', serif";
		ctx.fillStyle = "#ffffff";
		ctx.letterSpacing = "5px";
		ctx.fillText("DEVFRAMES", this.width / 2, devBoxY + 115);

		const devLogo = this.imageCache.get("/img/developer-logo.png");
		if (devLogo && devLogo.complete) {
			const devW = 240;
			const devH = (devLogo.naturalHeight / devLogo.naturalWidth) * devW || 90;
			ctx.drawImage(devLogo, this.width / 2 - devW / 2, devBoxY + 155, devW, devH);
		}

		ctx.font = "700 24px 'Cinzel', serif";
		ctx.fillStyle = "#dfb76c";
		ctx.letterSpacing = "6px";
		ctx.fillText(content.backCover.year, this.width / 2, 1680);

		ctx.restore();
	}
}

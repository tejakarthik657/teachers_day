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
			content.page7.imagePath,
			content.page8.imagePath,
			content.page10.imagePath,
			"/public/img/logo.svg",
			"/img/logo.svg",
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

	public async renderAllPages(content: BookContent): Promise<string[]> {
		await this.preloadImages(content);
		await document.fonts?.ready;

		const pages: string[] = [];
		for (let i = 0; i < 14; i++) {
			const canvas = document.createElement("canvas");
			canvas.width = this.width;
			canvas.height = this.height;
			const ctx = canvas.getContext("2d")!;

			await this.renderPage(ctx, i, content);
			pages.push(canvas.toDataURL("image/jpeg", 0.92));
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
				await this.drawEndpaper(ctx);
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
		// Warm archival ivory / cream paper with delicate parchment gradient
		const grad = ctx.createRadialGradient(
			this.width * 0.5,
			this.height * 0.5,
			this.width * 0.1,
			this.width * 0.5,
			this.height * 0.5,
			this.height * 0.8,
		);
		grad.addColorStop(0, "#faf6ed");
		grad.addColorStop(0.7, "#f5eee1");
		grad.addColorStop(1, "#ebdcc4");

		ctx.fillStyle = grad;
		ctx.fillRect(0, 0, this.width, this.height);

		// Subtle paper grain noise simulation
		ctx.save();
		ctx.fillStyle = "rgba(120, 90, 40, 0.015)";
		for (let i = 0; i < 4000; i++) {
			const x = Math.random() * this.width;
			const y = Math.random() * this.height;
			ctx.fillRect(x, y, 2, 2);
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
		ctx.fillStyle = "rgba(255, 230, 160, 0.02)";
		for (let i = 0; i < 6000; i++) {
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
		const strokeColor = gold ? "#c5a059" : "#4a3c2c";
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = 3;
		ctx.strokeRect(inset, inset, this.width - inset * 2, this.height - inset * 2);

		ctx.strokeStyle = gold ? "rgba(197, 160, 89, 0.4)" : "rgba(74, 60, 44, 0.3)";
		ctx.lineWidth = 1;
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
			ctx.arc(x, y, 4, 0, Math.PI * 2);
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
		ctx.fillStyle = "#8a7356";
		ctx.font = "600 22px 'Cinzel', serif";
		ctx.letterSpacing = "4px";

		// Running header at top
		ctx.textAlign = "center";
		ctx.fillText(runningHead, this.width / 2, 130);

		ctx.strokeStyle = "rgba(197, 160, 89, 0.4)";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(this.width * 0.25, 145);
		ctx.lineTo(this.width * 0.75, 145);
		ctx.stroke();

		// Folio at bottom
		ctx.font = "italic 26px 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#6b583e";
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
		const innerX = x + padding;
		const innerY = y + padding;
		const innerW = w - padding * 2;
		const innerH = h - (caption ? padding * 2 + 36 : padding * 2);

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
			ctx.fillStyle = "#4a3c2c";
			ctx.font = "italic 21px 'Cormorant Garamond', Georgia, serif";
			ctx.textAlign = "center";
			ctx.fillText(caption, x + w / 2, y + h - 14);
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

		// Gold foil header
		ctx.save();
		ctx.textAlign = "center";
		ctx.fillStyle = "#dfb76c";
		ctx.font = "700 56px 'Cinzel', serif";
		ctx.letterSpacing = "8px";
		ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
		ctx.shadowBlur = 10;
		ctx.fillText(content.cover.title, this.width / 2, 280);

		ctx.font = "600 28px 'Cinzel', serif";
		ctx.letterSpacing = "6px";
		ctx.fillStyle = "#c5a059";
		ctx.fillText(content.cover.subtitle, this.width / 2, 350);

		ctx.font = "italic 28px 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#f5eee1";
		ctx.fillText(`“${content.cover.tagline}”`, this.width / 2, 420);

		// Teacher Portrait in Ornate Oval Frame
		const frameX = this.width / 2 - 240;
		const frameY = 480;
		const frameW = 480;
		const frameH = 580;
		this.drawImageFrame(
			ctx,
			content.cover.imagePath,
			frameX,
			frameY,
			frameW,
			frameH,
			"",
			"[TEACHER PORTRAIT]",
		);

		// Golden Emblem / Logo located exactly at the intro camera focus area
		// (top: 582.5/1080 -> 1165px, left: 279/764 -> 558px, width: 408px, height: 408px)
		const emblemImg = this.imageCache.get("/public/img/logo.svg") || this.imageCache.get("/img/logo.svg");
		const emblemY = 1170;
		const emblemSize = 380;
		const emblemX = this.width / 2 - emblemSize / 2;

		if (emblemImg && emblemImg.complete) {
			ctx.drawImage(emblemImg, emblemX, emblemY, emblemSize, emblemSize);
		} else {
			ctx.strokeStyle = "#dfb76c";
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.arc(this.width / 2, emblemY + emblemSize / 2, emblemSize / 2 - 10, 0, Math.PI * 2);
			ctx.stroke();
			ctx.font = "700 24px 'Cinzel', serif";
			ctx.fillStyle = "#dfb76c";
			ctx.fillText("★ TEACHER'S DAY ★", this.width / 2, emblemY + emblemSize / 2);
		}

		// Bottom Tribute Text
		ctx.font = "700 42px 'Cinzel', serif";
		ctx.fillStyle = "#f7df94";
		ctx.letterSpacing = "6px";
		ctx.fillText(content.cover.greeting, this.width / 2, 1720);

		ctx.font = "700 48px 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#ffffff";
		ctx.letterSpacing = "2px";
		ctx.fillText(content.teacher.name, this.width / 2, 1800);

		ctx.font = "500 24px 'Cinzel', serif";
		ctx.fillStyle = "#c5a059";
		ctx.letterSpacing = "4px";
		ctx.fillText(`${content.teacher.department} • ${content.teacher.batch}`, this.width / 2, 1860);

		ctx.restore();
	}

	// Page 1: INSIDE FRONT COVER (DEDICATION)
	private async drawDedication(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, false, 110);
		this.drawHeaderAndFolio(ctx, "I", "EX LIBRIS • COMMEMORATIVE EDITION", true);

		ctx.save();
		ctx.textAlign = "center";

		// Central Emblem Graphic
		const emblemImg = this.imageCache.get("/public/img/logo.svg") || this.imageCache.get("/img/logo.svg");
		if (emblemImg && emblemImg.complete) {
			ctx.globalAlpha = 0.85;
			ctx.drawImage(emblemImg, this.width / 2 - 160, 240, 320, 320);
			ctx.globalAlpha = 1.0;
		}

		ctx.font = "700 28px 'Cinzel', serif";
		ctx.fillStyle = "#8a7356";
		ctx.letterSpacing = "6px";
		ctx.fillText(content.dedication.exLibris, this.width / 2, 620);

		ctx.font = "italic 64px 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#2c2117";
		ctx.fillText(content.dedication.heading, this.width / 2, 730);

		ctx.strokeStyle = "#c5a059";
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		ctx.moveTo(this.width / 2 - 140, 770);
		ctx.lineTo(this.width / 2 + 140, 770);
		ctx.stroke();

		// Dedication Body
		ctx.font = "italic 32px/1.7 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#3d2e1f";
		this.wrapText(
			ctx,
			content.dedication.body,
			this.width / 2 - 460,
			850,
			920,
			56,
		);

		// Presented To / By
		ctx.font = "700 36px 'Cinzel', serif";
		ctx.fillStyle = "#1e160e";
		ctx.fillText(content.dedication.presentedTo, this.width / 2, 1340);

		ctx.font = "500 26px 'Cinzel', serif";
		ctx.fillStyle = "#8a7356";
		ctx.fillText(content.teacher.designation, this.width / 2, 1400);
		ctx.fillText(content.teacher.department, this.width / 2, 1445);
		ctx.fillText(content.teacher.institution, this.width / 2, 1490);

		ctx.font = "italic 28px 'Cormorant Garamond', serif";
		ctx.fillStyle = "#5c4630";
		ctx.fillText(content.dedication.presentedBy, this.width / 2, 1680);

		ctx.restore();
	}

	// Page 2: MORE THAN A TEACHER
	private async drawPage2(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, false, 80);
		this.drawHeaderAndFolio(ctx, "02", "THE PERSON BEHIND THE TEACHER", false);

		ctx.save();
		// Heading
		ctx.textAlign = "left";
		ctx.fillStyle = "#2c2117";
		ctx.font = "italic 700 58px 'Cormorant Garamond', Georgia, serif";
		ctx.fillText(content.page2.heading, 140, 240);

		ctx.font = "600 22px 'Cinzel', serif";
		ctx.fillStyle = "#8a7356";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page2.subheading.toUpperCase(), 140, 290);

		// Teacher Portrait Photo
		const imgW = 600;
		const imgH = 750;
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
			"[FACULTY PORTRAIT]",
		);

		// Lead Quote Box on the left
		const quoteBoxX = 140;
		const quoteBoxY = 350;
		const quoteBoxW = this.width - imgW - 340;

		ctx.fillStyle = "rgba(197, 160, 89, 0.12)";
		ctx.fillRect(quoteBoxX, quoteBoxY, quoteBoxW, 360);
		ctx.strokeStyle = "#c5a059";
		ctx.lineWidth = 2;
		ctx.strokeRect(quoteBoxX, quoteBoxY, quoteBoxW, 360);

		ctx.fillStyle = "#2c2117";
		ctx.font = "italic 32px/1.6 'Cormorant Garamond', Georgia, serif";
		this.wrapText(
			ctx,
			content.page2.leadQuote,
			quoteBoxX + 36,
			quoteBoxY + 70,
			quoteBoxW - 72,
			48,
		);

		// Narrative Body below quote
		ctx.font = "30px/1.8 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#33261a";
		this.wrapText(
			ctx,
			content.page2.content,
			140,
			1180,
			this.width - 280,
			54,
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
		ctx.fillStyle = "#2c2117";
		ctx.font = "italic 700 58px 'Cormorant Garamond', Georgia, serif";
		ctx.fillText(content.page3.heading, 140, 240);

		ctx.font = "600 22px 'Cinzel', serif";
		ctx.fillStyle = "#8a7356";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page3.subheading.toUpperCase(), 140, 290);

		ctx.font = "italic 28px/1.6 'Cormorant Garamond', serif";
		ctx.fillStyle = "#5c4630";
		this.wrapText(ctx, content.page3.intro, 140, 360, this.width - 280, 44);

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
		ctx.fillStyle = "#2c2117";
		ctx.font = "italic 700 58px 'Cormorant Garamond', Georgia, serif";
		ctx.fillText(content.page4.heading, 140, 240);

		ctx.font = "600 22px 'Cinzel', serif";
		ctx.fillStyle = "#8a7356";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page4.subheading.toUpperCase(), 140, 290);

		let startY = 380;
		content.page4.principles.forEach(p => {
			// Card background
			ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
			ctx.fillRect(140, startY, this.width - 280, 190);
			ctx.strokeStyle = "rgba(197, 160, 89, 0.4)";
			ctx.lineWidth = 1;
			ctx.strokeRect(140, startY, this.width - 280, 190);

			// Number circle
			ctx.fillStyle = "#c5a059";
			ctx.beginPath();
			ctx.arc(220, startY + 95, 45, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillStyle = "#ffffff";
			ctx.font = "700 28px 'Cinzel', serif";
			ctx.textAlign = "center";
			ctx.fillText(p.number, 220, startY + 104);

			// Title and description
			ctx.textAlign = "left";
			ctx.fillStyle = "#1e160e";
			ctx.font = "700 32px 'Cormorant Garamond', Georgia, serif";
			ctx.fillText(p.title, 295, startY + 70);

			ctx.font = "26px/1.5 'Cormorant Garamond', Georgia, serif";
			ctx.fillStyle = "#4a3c2c";
			this.wrapText(ctx, p.description, 295, startY + 115, this.width - 480, 36);

			startY += 230;
		});

		// Accent Quote at bottom
		ctx.textAlign = "center";
		ctx.font = "italic 34px 'Cormorant Garamond', serif";
		ctx.fillStyle = "#7a5c36";
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
		ctx.fillStyle = "#2c2117";
		ctx.font = "italic 700 58px 'Cormorant Garamond', Georgia, serif";
		ctx.fillText(content.page5.heading, 140, 240);

		ctx.font = "600 22px 'Cinzel', serif";
		ctx.fillStyle = "#8a7356";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page5.subheading.toUpperCase(), 140, 290);

		// Editorial grid: 1 large photo top, 2 side-by-side bottom
		const mainW = this.width - 280;
		const mainH = 740;
		const m0 = content.page5.moments[0];
		this.drawImageFrame(
			ctx,
			m0.imagePath,
			140,
			360,
			mainW,
			mainH,
			`${m0.caption} — ${m0.detail}`,
			"[CAMPUS CONVERSATIONS]",
		);

		const subW = (this.width - 340) / 2;
		const subH = 680;
		const m1 = content.page5.moments[1];
		const m2 = content.page5.moments[2];

		this.drawImageFrame(
			ctx,
			m1.imagePath,
			140,
			1170,
			subW,
			subH,
			`${m1.caption} ${m1.detail}`,
			"[SHARED LAUGHTER]",
		);

		this.drawImageFrame(
			ctx,
			m2.imagePath,
			140 + subW + 60,
			1170,
			subW,
			subH,
			`${m2.caption} ${m2.detail}`,
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
		ctx.fillStyle = "#2c2117";
		ctx.font = "italic 700 58px 'Cormorant Garamond', Georgia, serif";
		ctx.fillText(content.page6.heading, 140, 240);

		ctx.font = "600 22px 'Cinzel', serif";
		ctx.fillStyle = "#8a7356";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page6.subheading.toUpperCase(), 140, 290);

		let quoteY = 400;
		content.page6.quotes.forEach(q => {
			// Card
			ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
			ctx.fillRect(140, quoteY, this.width - 280, 360);
			ctx.strokeStyle = "#c5a059";
			ctx.lineWidth = 1.5;
			ctx.strokeRect(140, quoteY, this.width - 280, 360);

			// Big Gold Quotation Mark
			ctx.fillStyle = "rgba(197, 160, 89, 0.25)";
			ctx.font = "700 180px 'Cormorant Garamond', serif";
			ctx.fillText("“", 180, quoteY + 150);

			// Quote text
			ctx.fillStyle = "#24180f";
			ctx.font = "italic 36px/1.6 'Cormorant Garamond', Georgia, serif";
			this.wrapText(ctx, q.quote, 220, quoteY + 90, this.width - 440, 52);

			// Context & attribution
			ctx.font = "600 22px 'Cinzel', serif";
			ctx.fillStyle = "#8a7356";
			ctx.textAlign = "right";
			ctx.fillText(`${q.context}  ${content.page6.attribution}`, this.width - 200, quoteY + 310);

			ctx.textAlign = "left";
			quoteY += 440;
		});

		ctx.restore();
	}

	// Page 7: WHAT YOU LEFT WITH US (The Impact)
	private async drawPage7(
		ctx: CanvasRenderingContext2D,
		content: BookContent,
	): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, false, 80);
		this.drawHeaderAndFolio(ctx, "07", "THE ENDURING IMPACT", true);

		ctx.save();
		ctx.textAlign = "left";
		ctx.fillStyle = "#2c2117";
		ctx.font = "italic 700 58px 'Cormorant Garamond', Georgia, serif";
		ctx.fillText(content.page7.heading, 140, 240);

		ctx.font = "600 22px 'Cinzel', serif";
		ctx.fillStyle = "#8a7356";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page7.subheading.toUpperCase(), 140, 290);

		// Left Column: 5 Pillars
		let pillarY = 380;
		content.page7.pillars.forEach(p => {
			ctx.fillStyle = "#1e160e";
			ctx.font = "700 36px 'Cormorant Garamond', Georgia, serif";
			ctx.fillText(`✦  ${p.trait}`, 140, pillarY);

			ctx.font = "26px/1.5 'Cormorant Garamond', Georgia, serif";
			ctx.fillStyle = "#4a3c2c";
			this.wrapText(ctx, p.meaning, 180, pillarY + 44, 580, 36);

			pillarY += 160;
		});

		// Right Column: Photograph and Tribute
		const photoX = this.width - 660;
		const photoY = 380;
		const photoW = 520;
		const photoH = 680;
		this.drawImageFrame(
			ctx,
			content.page7.imagePath,
			photoX,
			photoY,
			photoW,
			photoH,
			"Mentorship that endures through time",
			"[STUDENT GUIDANCE]",
		);

		// Callout box below photo
		ctx.fillStyle = "rgba(197, 160, 89, 0.12)";
		ctx.fillRect(photoX, photoY + photoH + 40, photoW, 280);
		ctx.strokeStyle = "#c5a059";
		ctx.lineWidth = 1.5;
		ctx.strokeRect(photoX, photoY + photoH + 40, photoW, 280);

		ctx.textAlign = "center";
		ctx.fillStyle = "#33261a";
		ctx.font = "italic 30px/1.6 'Cormorant Garamond', Georgia, serif";
		this.wrapText(
			ctx,
			content.page7.sideNote,
			photoX + photoW / 2 - 200,
			photoY + photoH + 130,
			400,
			46,
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
		ctx.fillStyle = "#2c2117";
		ctx.font = "italic 700 58px 'Cormorant Garamond', Georgia, serif";
		ctx.fillText(content.page8.heading, 140, 240);

		ctx.font = "600 22px 'Cinzel', serif";
		ctx.fillStyle = "#8a7356";
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
		ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
		ctx.fillRect(photoX, notesY, photoW, 460);
		ctx.strokeStyle = "rgba(197, 160, 89, 0.5)";
		ctx.lineWidth = 1;
		ctx.strokeRect(photoX, notesY, photoW, 460);

		ctx.fillStyle = "#8a7356";
		ctx.font = "600 24px 'Cinzel', serif";
		ctx.letterSpacing = "3px";
		ctx.fillText("MOMENTS WE WILL ALWAYS HOLD DEAR", photoX + 40, notesY + 60);

		let itemY = notesY + 130;
		content.page8.albumNotes.forEach(note => {
			ctx.fillStyle = "#c5a059";
			ctx.font = "28px serif";
			ctx.fillText("✦", photoX + 40, itemY);

			ctx.fillStyle = "#2e2114";
			ctx.font = "italic 30px 'Cormorant Garamond', Georgia, serif";
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
		ctx.fillStyle = "#2c2117";
		ctx.font = "italic 700 58px 'Cormorant Garamond', Georgia, serif";
		ctx.fillText(content.page9.heading, 140, 240);

		ctx.font = "600 22px 'Cinzel', serif";
		ctx.fillStyle = "#8a7356";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page9.subheading.toUpperCase(), 140, 290);

		// Letter Paper Parchment Inset
		const insetX = 140;
		const insetY = 360;
		const insetW = this.width - 280;
		const insetH = 1380;

		ctx.fillStyle = "#ffffff";
		ctx.shadowColor = "rgba(0, 0, 0, 0.08)";
		ctx.shadowBlur = 20;
		ctx.shadowOffsetY = 8;
		ctx.fillRect(insetX, insetY, insetW, insetH);
		ctx.shadowColor = "transparent";

		ctx.strokeStyle = "#c5a059";
		ctx.lineWidth = 1.5;
		ctx.strokeRect(insetX, insetY, insetW, insetH);

		// Letter Text
		ctx.fillStyle = "#1e160e";
		ctx.font = "34px/1.9 'Cormorant Garamond', Georgia, serif";

		let textY = insetY + 110;
		for (const para of content.page9.letterParagraphs) {
			textY = this.wrapText(ctx, para, insetX + 80, textY, insetW - 160, 58);
			textY += 40;
		}

		// Signature Block
		ctx.font = "italic 32px 'Cormorant Garamond', serif";
		ctx.fillStyle = "#5c4630";
		ctx.fillText(content.page9.signatureLabel, insetX + 80, textY + 60);

		ctx.font = "700 36px 'Cinzel', serif";
		ctx.fillStyle = "#1e160e";
		ctx.fillText(content.page9.signatories, insetX + 80, textY + 130);

		// Footnote / Calligraphy Motto
		ctx.textAlign = "center";
		ctx.font = "italic 32px 'Cormorant Garamond', serif";
		ctx.fillStyle = "#8a7356";
		ctx.fillText(content.page9.footnote, this.width / 2, insetY + insetH - 60);

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
		ctx.font = "700 68px 'Cinzel', serif";
		ctx.fillStyle = "#7a5212";
		ctx.letterSpacing = "6px";
		ctx.fillText(content.page10.heading, this.width / 2, 270);

		ctx.font = "600 30px 'Cinzel', serif";
		ctx.fillStyle = "#c5a059";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.page10.greeting, this.width / 2, 340);

		// Framed photo
		const frameW = 540;
		const frameH = 680;
		const frameX = this.width / 2 - frameW / 2;
		const frameY = 410;
		this.drawImageFrame(
			ctx,
			content.page10.imagePath,
			frameX,
			frameY,
			frameW,
			frameH,
			`Honoring ${content.teacher.name}`,
			"[TRIBUTE PORTRAIT]",
		);

		// Stanza of Gratitude
		let stanzaY = 1210;
		ctx.font = "italic 36px/1.8 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#2c2117";

		content.page10.stanza.forEach(line => {
			ctx.fillText(line, this.width / 2, stanzaY);
			stanzaY += 64;
		});

		// Closing
		ctx.font = "700 36px 'Cinzel', serif";
		ctx.fillStyle = "#1e160e";
		ctx.letterSpacing = "2px";
		this.wrapText(
			ctx,
			content.page10.closing,
			this.width / 2 - 400,
			stanzaY + 50,
			800,
			50,
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

		const emblemImg = this.imageCache.get("/public/img/logo.svg") || this.imageCache.get("/img/logo.svg");
		if (emblemImg && emblemImg.complete) {
			ctx.drawImage(emblemImg, this.width / 2 - 200, 360, 400, 400);
		}

		ctx.font = "700 38px 'Cinzel', serif";
		ctx.fillStyle = "#7a5212";
		ctx.letterSpacing = "6px";
		ctx.fillText(content.insideBackCover.sealTitle, this.width / 2, 860);

		ctx.font = "italic 32px/1.6 'Cormorant Garamond', serif";
		ctx.fillStyle = "#4a3c2c";
		this.wrapText(
			ctx,
			content.insideBackCover.sealBody,
			this.width / 2 - 400,
			950,
			800,
			52,
		);

		ctx.font = "italic 38px/1.7 'Cormorant Garamond', Georgia, serif";
		ctx.fillStyle = "#1e160e";
		this.wrapText(
			ctx,
			content.insideBackCover.quote,
			this.width / 2 - 450,
			1200,
			900,
			60,
		);

		ctx.font = "600 24px 'Cinzel', serif";
		ctx.fillStyle = "#8a7356";
		ctx.fillText(`— ${content.insideBackCover.attribution.toUpperCase()}`, this.width / 2, 1440);

		ctx.restore();
	}

	// Page 12: ENDPAPER
	private async drawEndpaper(ctx: CanvasRenderingContext2D): Promise<void> {
		this.drawPaperBase(ctx);
		this.drawPageBorders(ctx, false, 110);

		ctx.save();
		ctx.strokeStyle = "rgba(197, 160, 89, 0.2)";
		ctx.lineWidth = 1;

		// Subtle geometric watermark lattice
		const step = 80;
		for (let x = 120; x < this.width - 120; x += step) {
			for (let y = 120; y < this.height - 120; y += step) {
				ctx.strokeRect(x, y, step * 0.7, step * 0.7);
			}
		}

		ctx.textAlign = "center";
		ctx.font = "600 22px 'Cinzel', serif";
		ctx.fillStyle = "rgba(138, 115, 86, 0.4)";
		ctx.letterSpacing = "6px";
		ctx.fillText("COMMEMORATIVE MONOGRAPH", this.width / 2, this.height / 2);
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

		const emblemImg = this.imageCache.get("/public/img/logo.svg") || this.imageCache.get("/img/logo.svg");
		if (emblemImg && emblemImg.complete) {
			ctx.drawImage(emblemImg, this.width / 2 - 180, 500, 360, 360);
		}

		ctx.font = "700 52px 'Cinzel', serif";
		ctx.fillStyle = "#dfb76c";
		ctx.letterSpacing = "8px";
		ctx.fillText(content.backCover.title, this.width / 2, 1020);

		ctx.font = "600 26px 'Cinzel', serif";
		ctx.fillStyle = "#c5a059";
		ctx.letterSpacing = "4px";
		ctx.fillText(content.backCover.subtitle, this.width / 2, 1100);

		ctx.font = "italic 32px 'Cormorant Garamond', serif";
		ctx.fillStyle = "#f5eee1";
		ctx.fillText(content.backCover.institution, this.width / 2, 1280);

		ctx.font = "600 24px 'Cinzel', serif";
		ctx.fillStyle = "#a8792c";
		ctx.letterSpacing = "6px";
		ctx.fillText(content.backCover.year, this.width / 2, 1750);

		ctx.restore();
	}
}

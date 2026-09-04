export default class IntroOverlay {
	public dom: {
		container: HTMLDivElement;
		logo: HTMLImageElement;
		logoShine: HTMLImageElement;
		progress: HTMLDivElement;
		progressInner: HTMLDivElement;
		loadingCaption: HTMLDivElement;
		developerAttribution: HTMLDivElement;
	};

	constructor(container: HTMLDivElement) {
		this.dom = {
			container,
			logo: container.querySelector(".logo")!,
			logoShine: container.querySelector(".logo-shine")!,
			progress: container.querySelector(".progress")!,
			progressInner: container.querySelector(".progress-inner")!,
			loadingCaption: container.querySelector(".loading-caption")!,
			developerAttribution: container.querySelector(".developer-attribution")!,
		};
	}

	public onProgress(newProgress: number) {
		this.dom.progressInner.style.width = newProgress * 100 + "%";
	}
}

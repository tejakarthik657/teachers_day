export class AudioService {
	private audioCtx: AudioContext | null = null;
	private isMuted: boolean = true;
	private bgAudio: HTMLAudioElement | null = null;

	constructor() {
		const savedMute = localStorage.getItem("td_book_muted");
		this.isMuted = savedMute !== null ? savedMute === "true" : true;

		// Load custom Ilahi Instrumental background music
		this.initBgAudio();

		// User gesture handler to unlock audio playback on modern browsers
		const unlockAudio = () => {
			this.initContext();
			if (!this.isMuted && this.bgAudio && this.bgAudio.paused) {
				this.playBGM();
			}
		};

		window.addEventListener("click", unlockAudio, { passive: true });
		window.addEventListener("touchstart", unlockAudio, { passive: true });
		window.addEventListener("keydown", unlockAudio, { passive: true });
	}

	private initBgAudio(): void {
		try {
			// Encoded URI path to handle space in file name cleanly across all web servers
			const primarySrc = encodeURI("/audio/Ilahi Instrumental.mp3");
			this.bgAudio = new Audio(primarySrc);
			this.bgAudio.loop = true; // Loop music continuously forever
			this.bgAudio.volume = 0.65;
			this.bgAudio.preload = "auto";

			// Robust fallback handling
			this.bgAudio.onerror = () => {
				if (this.bgAudio) {
					console.warn("Retrying with fallback audio path...");
					this.bgAudio.src = "/ilahi-instrumental.mp3";
					this.bgAudio.load();
					if (!this.isMuted) {
						this.playBGM();
					}
				}
			};
		} catch (err) {
			console.error("Failed to initialize background audio element", err);
		}
	}

	private initContext(): void {
		if (!this.audioCtx) {
			const AudioContextClass =
				window.AudioContext ||
				(window as unknown as { webkitAudioContext: typeof AudioContext })
					.webkitAudioContext;
			if (AudioContextClass) {
				this.audioCtx = new AudioContextClass();
			}
		}
		if (this.audioCtx && this.audioCtx.state === "suspended") {
			this.audioCtx.resume().catch(() => {});
		}
	}

	public getMuted(): boolean {
		return this.isMuted;
	}

	public setMuted(muted: boolean): void {
		this.isMuted = muted;
		localStorage.setItem("td_book_muted", String(muted));
		if (muted) {
			this.pauseBGM();
		} else {
			this.initContext();
			this.playBGM();
		}
	}

	public toggleMute(): boolean {
		this.setMuted(!this.isMuted);
		return this.isMuted;
	}

	public playBGM(): void {
		if (this.isMuted || !this.bgAudio) return;
		const playPromise = this.bgAudio.play();
		if (playPromise !== undefined) {
			playPromise.catch(err => {
				console.log("Audio playback waiting for user interaction:", err);
			});
		}
	}

	public pauseBGM(): void {
		if (this.bgAudio) {
			this.bgAudio.pause();
		}
	}

	/**
	 * Plays a realistic soft paper turn rustle using filtered noise
	 */
	public playPageTurnSound(): void {
		if (this.isMuted) return;
		this.initContext();
		if (!this.audioCtx) return;

		const ctx = this.audioCtx;
		const duration = 0.35;
		const bufferSize = ctx.sampleRate * duration;
		const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
		const output = noiseBuffer.getChannelData(0);

		// Pink-ish noise for paper texture
		let b0 = 0,
			b1 = 0,
			b2 = 0;
		for (let i = 0; i < bufferSize; i++) {
			const white = Math.random() * 2 - 1;
			b0 = 0.99886 * b0 + white * 0.0555179;
			b1 = 0.99332 * b1 + white * 0.0750759;
			b2 = 0.969 * b2 + white * 0.153852;
			output[i] = (b0 + b1 + b2) * 0.25;
		}

		const whiteNoise = ctx.createBufferSource();
		whiteNoise.buffer = noiseBuffer;

		// Bandpass filter to simulate crisp paper friction
		const filter = ctx.createBiquadFilter();
		filter.type = "bandpass";
		filter.frequency.setValueAtTime(600, ctx.currentTime);
		filter.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.15);
		filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + duration);
		filter.Q.setValueAtTime(1.5, ctx.currentTime);

		// Volume envelope
		const gainNode = ctx.createGain();
		gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
		gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.08);
		gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

		whiteNoise.connect(filter);
		filter.connect(gainNode);
		gainNode.connect(ctx.destination);

		whiteNoise.start();
		whiteNoise.stop(ctx.currentTime + duration);
	}
}

export const audioService = new AudioService();

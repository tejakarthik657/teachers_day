export class AudioService {
	private audioCtx: AudioContext | null = null;
	private isMuted: boolean = true;
	private isAmbientPlaying: boolean = false;
	private ambientOscillators: OscillatorNode[] = [];
	private ambientGain: GainNode | null = null;

	constructor() {
		const savedMute = localStorage.getItem("td_book_muted");
		this.isMuted = savedMute !== null ? savedMute === "true" : true;
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
			this.audioCtx.resume();
		}
	}

	public getMuted(): boolean {
		return this.isMuted;
	}

	public setMuted(muted: boolean): void {
		this.isMuted = muted;
		localStorage.setItem("td_book_muted", String(muted));
		if (muted) {
			this.stopAmbient();
		} else {
			this.initContext();
			this.startAmbient();
		}
	}

	public toggleMute(): boolean {
		this.setMuted(!this.isMuted);
		return this.isMuted;
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

	/**
	 * Soft meditative harmonic ambient chords (warm ivory / piano-like calmness)
	 */
	private startAmbient(): void {
		if (this.isAmbientPlaying || this.isMuted) return;
		this.initContext();
		if (!this.audioCtx) return;

		const ctx = this.audioCtx;
		this.ambientGain = ctx.createGain();
		this.ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
		this.ambientGain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 3);
		this.ambientGain.connect(ctx.destination);

		// Calming harmonic chord: D major / add9 (D3, A3, F#4, E4)
		const freqs = [146.83, 220.0, 369.99, 329.63];
		this.ambientOscillators = freqs.map(freq => {
			const osc = ctx.createOscillator();
			osc.type = "sine";
			osc.frequency.setValueAtTime(freq, ctx.currentTime);

			// Subtle slow modulation
			const lfo = ctx.createOscillator();
			lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
			const lfoGain = ctx.createGain();
			lfoGain.gain.setValueAtTime(1.2, ctx.currentTime);
			lfo.connect(lfoGain);
			lfoGain.connect(osc.frequency);
			lfo.start();

			osc.connect(this.ambientGain!);
			osc.start();
			return osc;
		});

		this.isAmbientPlaying = true;
	}

	private stopAmbient(): void {
		if (!this.isAmbientPlaying || !this.audioCtx) return;
		if (this.ambientGain) {
			this.ambientGain.gain.linearRampToValueAtTime(
				0.001,
				this.audioCtx.currentTime + 1,
			);
			setTimeout(() => {
				this.ambientOscillators.forEach(osc => osc.stop());
				this.ambientOscillators = [];
				this.isAmbientPlaying = false;
			}, 1000);
		} else {
			this.ambientOscillators.forEach(osc => osc.stop());
			this.ambientOscillators = [];
			this.isAmbientPlaying = false;
		}
	}
}

export const audioService = new AudioService();

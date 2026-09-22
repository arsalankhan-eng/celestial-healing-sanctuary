// Web Audio API Ambient Healing Sound Synthesizer (432Hz Crystal Singing Bowl Drone)
class AmbientHealingPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.oscillators = [];
    this.gainNodes = [];
    this.masterGain = null;
    this.timer = null;
    this.currentTrackTitle = "";
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playDrone(title = "432Hz Pure Healing Harmonic") {
    this.initContext();
    this.stopDrone();

    this.isPlaying = true;
    this.currentTrackTitle = title;

    // Frequencies centered around 432Hz & Solfeggio 528Hz harmonics
    const freqs = [
      { f: 216, type: "sine", gain: 0.25 },   // Sub octave
      { f: 432, type: "sine", gain: 0.35 },   // Fundamental 432Hz
      { f: 436.5, type: "sine", gain: 0.15 }, // Subtle 4.5Hz Theta binaural beat
      { f: 648, type: "triangle", gain: 0.08 },// 3rd harmonic
      { f: 864, type: "sine", gain: 0.05 }    // 2nd octave shimmer
    ];

    const now = this.ctx.currentTime;

    freqs.forEach(item => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = item.type;
      osc.frequency.setValueAtTime(item.f, now);

      // Gentle LFO subtle breath-like modulation
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.12, now); // 1 breath every 8 seconds
      lfoGain.gain.setValueAtTime(item.f * 0.015, now);
      lfo.connect(osc.frequency);
      lfo.start();

      // Soft envelope fade-in
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(item.gain, now + 2.5);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();

      this.oscillators.push(osc, lfo);
      this.gainNodes.push(gain);
    });

    this.updateUI(true);
  }

  stopDrone() {
    if (!this.isPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    this.gainNodes.forEach(g => {
      try {
        g.gain.cancelScheduledValues(now);
        g.gain.setValueAtTime(g.gain.value, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      } catch (e) {}
    });

    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.oscillators = [];
      this.gainNodes = [];
      this.isPlaying = false;
      this.updateUI(false);
    }, 1250);
  }

  toggle(title) {
    if (this.isPlaying && this.currentTrackTitle === title) {
      this.stopDrone();
    } else {
      this.playDrone(title);
    }
  }

  updateUI(playing) {
    const bars = document.querySelectorAll(".audio-waveform-bar");
    const floatingPlayer = document.getElementById("floating-audio-bar");
    const playButtons = document.querySelectorAll(".audio-preview-btn");

    if (floatingPlayer) {
      if (playing) {
        floatingPlayer.classList.add("active");
        const titleEl = document.getElementById("floating-audio-title");
        if (titleEl) titleEl.textContent = this.currentTrackTitle;
      } else {
        floatingPlayer.classList.remove("active");
      }
    }

    bars.forEach(bar => {
      if (playing) {
        bar.classList.add("animating");
      } else {
        bar.classList.remove("animating");
      }
    });

    playButtons.forEach(btn => {
      const btnTrack = btn.dataset.track;
      if (playing && btnTrack === this.currentTrackTitle) {
        btn.innerHTML = `<span class="icon">⏸</span> Pause Sample`;
        btn.classList.add("playing");
      } else {
        btn.innerHTML = `<span class="icon">▶</span> Preview 432Hz Audio`;
        btn.classList.remove("playing");
      }
    });
  }
}

export const audioPlayer = new AmbientHealingPlayer();

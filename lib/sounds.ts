// Sound library using Web Audio API - Tactile UI sounds

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

export const sounds = {
  // Mechanical button press
  click: () => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;

      // Impact transient
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.008, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 50);
      }
      noise.buffer = buf;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 4000 + Math.random() * 1000;
      filter.Q.value = 3;

      const gain = ctx.createGain();
      gain.gain.value = 0.5 + Math.random() * 0.15;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(t);
    } catch {
      // Audio not supported
    }
  },

  // Bubble/dropdown appear
  pop: () => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;

      // Short thump
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 0.04);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    } catch {
      // Audio not supported
    }
  },

  // Switch flip
  toggle: () => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;

      // Click + resonance
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.012, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 80);
      }
      noise.buffer = buf;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 2500;
      filter.Q.value = 4;

      const gain = ctx.createGain();
      gain.gain.value = 0.4;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(t);

      // Add body
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.03);
      oscGain.gain.setValueAtTime(0.15, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.04);
    } catch {
      // Audio not supported
    }
  },

  // Notch/detent
  tick: () => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;

      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.004, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 20);
      }
      noise.buffer = buf;

      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 3000;

      const gain = ctx.createGain();
      gain.gain.value = 0.3;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(t);
    } catch {
      // Audio not supported
    }
  },

  // Slide/swipe
  whoosh: () => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;

      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const env = Math.sin((i / data.length) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env;
      }
      noise.buffer = buf;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(4000, t);
      filter.frequency.exponentialRampToValueAtTime(1500, t + 0.08);
      filter.Q.value = 1;

      const gain = ctx.createGain();
      gain.gain.value = 0.15;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(t);
    } catch {
      // Audio not supported
    }
  },

  // Positive feedback
  success: () => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;

      // Double tap
      [0, 0.06].forEach((delay) => {
        const noise = ctx.createBufferSource();
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.01, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 60);
        }
        noise.buffer = buf;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = delay === 0 ? 3000 : 4500;
        filter.Q.value = 3;

        const gain = ctx.createGain();
        gain.gain.value = 0.35;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(t + delay);
      });
    } catch {
      // Audio not supported
    }
  },

  // Confirm action
  confirm: () => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;

      // Solid click with body
      const noise = ctx.createBufferSource();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.015, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 100);
      }
      noise.buffer = buf;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 2000;
      filter.Q.value = 2;

      const gain = ctx.createGain();
      gain.gain.value = 0.4;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(t);

      // Low thump
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.05);
      oscGain.gain.setValueAtTime(0.25, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    } catch {
      // Audio not supported
    }
  },

  // Error/reject
  error: () => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;

      // Two thuds
      [0, 0.08].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(120, t + delay);
        osc.frequency.exponentialRampToValueAtTime(50, t + delay + 0.06);

        gain.gain.setValueAtTime(0.4, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + delay);
        osc.stop(t + delay + 0.08);
      });
    } catch {
      // Audio not supported
    }
  },

  // Alert tap
  warning: () => {
    try {
      const ctx = getAudioContext();
      const t = ctx.currentTime;

      // Triple tap
      [0, 0.07, 0.14].forEach((delay) => {
        const noise = ctx.createBufferSource();
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.006, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 30);
        }
        noise.buffer = buf;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 2500;
        filter.Q.value = 4;

        const gain = ctx.createGain();
        gain.gain.value = 0.35;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(t + delay);
      });
    } catch {
      // Audio not supported
    }
  },
};

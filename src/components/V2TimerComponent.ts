/**
 * @copyright (c) 2024 Version 2 Software, LLC. All rights reserved.
 */
import { LitElement, html, css } from 'lit-element';
import { customElement, property } from 'lit/decorators.js';

@customElement('v2-timer-component')
export class V2TimerComponent extends LitElement {
    @property({ type: Boolean, reflect: true }) small = false;
    @property({ type: Boolean, reflect: true }) xsmall = false;
    @property({ type: Number, reflect: true }) duration = 30;
    @property({ type: Number }) timeRemaining = 0;
    @property({ type: Boolean }) running = false;
    @property({ type: Boolean }) paused = false;

    private intervalId: number | null = null;
    private startTime: number | null = null;
    private pauseStart = 0;
    private totalPausedDuration = 0;

    constructor() {
        super();
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.pauseTimer = this.pauseTimer.bind(this);
        this.resumeTimer = this.resumeTimer.bind(this);

        document.addEventListener('v2-timer-start', this.startTimer);
        document.addEventListener('v2-timer-stop', this.stopTimer);
        document.addEventListener('v2-timer-pause', this.pauseTimer);
        document.addEventListener('v2-timer-resume', this.resumeTimer);

        this.timeRemaining = this.duration * 60;
    }

    connectedCallback() {
        super.connectedCallback();
        this.timeRemaining = this.duration * 60;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('v2-timer-start', this.startTimer);
        document.removeEventListener('v2-timer-stop', this.stopTimer);
        document.removeEventListener('v2-timer-pause', this.pauseTimer);
        document.removeEventListener('v2-timer-resume', this.resumeTimer);
    }

    static styles = css`
        :host {
            --color: black;
            --background-color: white;
            --button-color: black;
            --button-background-color: white;
            --width: 300px;
            --height: 180px;
            --border: 2px solid #000;
        }
        .timer {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: var(--width);
            height: var(--height);
            border: var(--border);
            border-radius: 10px;
            font-family: 'Consolas', monospace;
            background: var(--background-color);
            color: var(--color);
        }
        .display {
            font-size: 5em;
            margin-bottom: 20px;
        }
        .buttons {
            display: flex;
            gap: 10px;
        }
        .button {
            font-size: 1.5em;
            padding: 10px 20px;
            border: 1px solid #000;
            border-radius: 5px;
            cursor: pointer;
            background: var(--button-background-color);
            color: var(--button-color);
        }
        :host([small]) .timer {
            padding-top: 20px;
            height: 50px;
            width: 160px;
        }
        :host([small]) .display {
            font-size: 3em;
        }
        :host([small]) .button {
            display: none;
        }
        :host([xsmall]) .display {
            font-size: 1.5em;
            padding: 0;
            margin: 0;
        }
        :host([xsmall]) .button {
            display: none;
        }
        :host([xsmall]) .timer {
            padding: 0;
            margin: 0;
            height: 30px;
            width: 80px;
            --border: 1px solid gray;
        }
    `;

    render() {
        const minutes = String(Math.floor(this.timeRemaining / 60)).padStart(2, '0');
        const seconds = String(this.timeRemaining % 60).padStart(2, '0');

        return html`
      <div class="timer">
        <div class="display">${minutes}:${seconds}</div>
        <div class="buttons">
          <button class="button" @click=${this.toggleStartStop}>
            ${this.running ? 'Stop' : 'Start'}
          </button>
          <button class="button" @click=${this.togglePauseResume} ?disabled=${!this.running}>
            ${this.paused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>
    `;
    }

    toggleStartStop() {
        this.running ? this.stopTimer() : this.startTimer();
    }

    togglePauseResume() {
        this.paused ? this.resumeTimer() : this.pauseTimer();
    }

    startTimer() {
        this.timeRemaining = this.duration * 60;
        this.pauseStart = 0;
        this.totalPausedDuration = 0;
        if (this.running) return;
        this.running = true;
        this.paused = false;
        this.startTime = Date.now();
        this.dispatchEvent(new CustomEvent('timer-started', {
            bubbles: true,
            composed: true
        }));
        this.intervalId = window.setInterval(() => this.updateTime(), 1000);
    }

    stopTimer() {
        if (!this.running) return;
        clearInterval(this.intervalId as number);
        this.intervalId = null;
        this.running = false;
        this.paused = false;
        this.pauseStart = 0;
        this.totalPausedDuration = 0;
        this.timeRemaining = this.duration * 60; // Reset to 30 minutes
        this.dispatchEvent(new CustomEvent('v2-timer-stopped', {
            bubbles: true,
            composed: true
        }));
    }

    pauseTimer() {
        if (!this.running || this.paused) return;
        clearInterval(this.intervalId as number);
        this.paused = true;
        this.pauseStart = Date.now();
        this.dispatchEvent(new CustomEvent('v2-timer-paused', {
            bubbles: true,
            composed: true
        }));
    }

    resumeTimer() {
        if (!this.running || !this.paused) return;
        this.paused = false;
        const pausedDuration = Date.now() - this.pauseStart;
        this.totalPausedDuration += pausedDuration;
        this.dispatchEvent(new CustomEvent('v2-timer-resumed', {
            bubbles: true,
            composed: true
        }));
        this.intervalId = window.setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        if (!this.running || this.paused) return;
        const now = Date.now();
        const elapsed = Math.floor((now - (this.startTime as number) - this.totalPausedDuration) / 1000);
        this.timeRemaining = this.duration * 60 - elapsed;
        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            this.stopTimer();
            this.dispatchEvent(new CustomEvent('v2-timer-completed', {
                bubbles: true,
                composed: true
            }));
        }
    }
}

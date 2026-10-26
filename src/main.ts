import { bootstrapApplication } from '@angular/platform-browser';
import { Component, computed, signal } from '@angular/core';

type Category = 'All jokes' | 'Dad jokes' | 'Tech' | 'Puns' | 'Animals';
interface Joke { id: number; category: Exclude<Category, 'All jokes'>; setup: string; punchline: string; }

const JOKES: Joke[] = [
  { id: 1, category: 'Dad jokes', setup: 'I only know 25 letters of the alphabet.', punchline: "I don't know y." },
  { id: 2, category: 'Tech', setup: 'Why do programmers prefer dark mode?', punchline: 'Because light attracts bugs.' },
  { id: 3, category: 'Puns', setup: 'I used to be addicted to the hokey pokey.', punchline: 'But then I turned myself around.' },
  { id: 4, category: 'Animals', setup: 'What do you call a bear with no teeth?', punchline: 'A gummy bear.' },
  { id: 5, category: 'Dad jokes', setup: 'I used to hate facial hair...', punchline: 'But then it grew on me.' },
  { id: 6, category: 'Tech', setup: 'Why was the computer cold?', punchline: 'It left its Windows open.' },
  { id: 7, category: 'Puns', setup: 'I wondered why the baseball was getting bigger.', punchline: 'Then it hit me.' },
  { id: 8, category: 'Animals', setup: 'Why do fish live in salt water?', punchline: 'Because pepper makes them sneeze.' },
  { id: 9, category: 'Dad jokes', setup: 'What do you call cheese that isn’t yours?', punchline: 'Nacho cheese.' },
  { id: 10, category: 'Tech', setup: 'Why did the developer go broke?', punchline: 'Because they used up all their cache.' },
  { id: 11, category: 'Puns', setup: 'I’m reading a book about anti-gravity.', punchline: 'It’s impossible to put down.' },
  { id: 12, category: 'Animals', setup: 'What do you call an alligator in a vest?', punchline: 'An investigator.' },
  { id: 13, category: 'Dad jokes', setup: 'What did one wall say to the other wall?', punchline: 'I’ll meet you at the corner.' },
  { id: 14, category: 'Tech', setup: 'Why did the function break up with the variable?', punchline: 'It needed more space.' },
  { id: 15, category: 'Puns', setup: 'I tried to catch some fog yesterday.', punchline: 'Mist.' },
  { id: 16, category: 'Animals', setup: 'What do you call a sleeping bull?', punchline: 'A bulldozer.' },
  { id: 17, category: 'Dad jokes', setup: 'What kind of shoes do ninjas wear?', punchline: 'Sneakers.' },
  { id: 18, category: 'Tech', setup: 'There are 10 kinds of people in the world.', punchline: 'Those who understand binary and those who don’t.' },
  { id: 19, category: 'Puns', setup: 'I used to be a baker, but I couldn’t make enough dough.', punchline: 'So I decided to raise the steaks.' },
  { id: 20, category: 'Animals', setup: 'Why don’t oysters share their pearls?', punchline: 'Because they’re shellfish.' },
  { id: 21, category: 'Dad jokes', setup: 'What do you call a factory that makes okay products?', punchline: 'A satisfactory.' },
  { id: 22, category: 'Tech', setup: 'Why did the Wi-Fi go to therapy?', punchline: 'It had trouble connecting.' },
  { id: 23, category: 'Puns', setup: 'What’s the best thing about Switzerland?', punchline: 'I don’t know, but the flag is a big plus.' },
  { id: 24, category: 'Animals', setup: 'What do you call a dog magician?', punchline: 'A labracadabrador.' },
];

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="page-shell">
      <header class="topbar">
        <a class="brand" href="#home" aria-label="Laugh Lab home">
          <span class="brand-mark">☺</span><span>laugh<span class="brand-light">lab</span></span>
        </a>
        <div class="top-note"><span class="live-dot"></span> YOUR DAILY DOSE OF DELIGHT</div>
        <button class="favorites-link" (click)="showFavorites.set(!showFavorites())" [class.active]="showFavorites()" aria-label="Toggle favorites">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>
          <span>Saved</span><span class="saved-count">{{ favorites().size }}</span>
        </button>
      </header>

      <main id="home">
        <section class="hero">
          <div class="hero-copy">
            <span class="eyebrow"><span class="sparkle">✳</span> A LITTLE JOY, ON DEMAND</span>
            <h1>Need a laugh?<br><span>We’ve got you.</span></h1>
            <p>Good jokes. No bad days. Pick a mood and let the giggles find you.</p>
            <div class="hero-proof"><div class="avatar-stack"><span>😎</span><span>🤓</span><span>😄</span></div><span>Smiles delivered <b>one joke at a time.</b></span></div>
          </div>
          <div class="hero-art" aria-hidden="true">
            <div class="sunburst"></div><span class="art-star star-one">✳</span><span class="art-star star-two">✦</span><span class="art-star star-three">✳</span>
            <div class="smiley">☺</div><div class="speech-bubble">HA!<br><small>that’s a good one</small></div>
            <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
          </div>
        </section>

        <section class="joke-section" aria-label="Joke generator">
          <div class="section-heading"><div><span class="eyebrow mini">THE JOKE MACHINE</span><h2>{{ showFavorites() ? 'Your saved laughs' : 'Pick your flavor' }}<span class="heading-spark"> ✨</span></h2></div><span class="joke-count">{{ visibleJokes().length }} jokes to explore <span>↗</span></span></div>
          <div class="filters" role="tablist" aria-label="Joke category">
            @for (category of categories; track category) {
              <button class="filter" [class.selected]="activeCategory() === category" (click)="selectCategory(category)" role="tab" [attr.aria-selected]="activeCategory() === category">
                <span class="filter-icon">{{ categoryIcons[category] }}</span>{{ category }}
              </button>
            }
          </div>

          @if (currentJoke(); as joke) {
            <article class="joke-card" aria-live="polite">
              <div class="card-top"><span class="category-tag"><span>{{ categoryIcons[joke.category] }}</span> {{ joke.category }}</span><span class="card-index">A GOOD ONE <span>✦</span></span></div>
              <div class="joke-content"><span class="quote-mark">“</span><p class="setup">{{ joke.setup }}</p><p class="punchline" [class.revealed]="revealed()">{{ revealed() ? joke.punchline : '…' }}</p><button class="reveal-button" (click)="reveal()" [disabled]="revealed()">{{ revealed() ? 'And there it is!' : 'Reveal punchline' }} <span>{{ revealed() ? '✓' : '↓' }}</span></button></div>
              <div class="card-footer"><span class="made-with"><span>✳</span> Handpicked for your happiness</span><div class="card-actions"><button class="icon-button" (click)="toggleFavorite(joke.id)" [class.is-favorite]="favorites().has(joke.id)" [attr.aria-label]="favorites().has(joke.id) ? 'Remove from saved jokes' : 'Save joke'" title="Save joke"><svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg></button><button class="icon-button copy-button" (click)="copyJoke(joke)" [class.copied]="copied()" [attr.aria-label]="copied() ? 'Copied' : 'Copy joke'" title="Copy joke">{{ copied() ? '✓' : '↗' }}</button></div></div>
            </article>
            <button class="next-button" (click)="nextJoke()"><span>Surprise me</span><span class="dice">⤨</span></button>
            <p class="keyboard-hint">Made you smile? Pass it along. <span>♧</span></p>
          } @else {
            <div class="empty-state"><span class="empty-emoji">💌</span><h3>No saved jokes yet</h3><p>Tap the heart on a joke to keep it close.</p><button class="small-button" (click)="showFavorites.set(false)">Find a joke <span>→</span></button></div>
          }
        </section>
      </main>
      <footer><span>© 2025 LAUGH LAB</span><span>STAY A LITTLE SILLY <b>✳</b></span></footer>
      @if (toast()) { <div class="toast" role="status">{{ toast() }}</div> }
    </div>
  `,
})
export class AppComponent {
  readonly categories: Category[] = ['All jokes', 'Dad jokes', 'Tech', 'Puns', 'Animals'];
  readonly categoryIcons: Record<Category, string> = { 'All jokes': '✦', 'Dad jokes': '☻', Tech: '⌘', Puns: '♧', Animals: '♧' };
  readonly activeCategory = signal<Category>('All jokes');
  readonly showFavorites = signal(false);
  readonly favorites = signal<Set<number>>(new Set());
  readonly currentId = signal(1);
  readonly revealed = signal(false);
  readonly copied = signal(false);
  readonly toast = signal('');
  private lastToastTimer?: ReturnType<typeof setTimeout>;
  readonly visibleJokes = computed(() => JOKES.filter((joke) => (!this.showFavorites() || this.favorites().has(joke.id)) && (this.activeCategory() === 'All jokes' || joke.category === this.activeCategory())));
  readonly currentJoke = computed(() => this.visibleJokes().find((joke) => joke.id === this.currentId()) ?? this.visibleJokes()[0] ?? null);

  selectCategory(category: Category): void { this.activeCategory.set(category); this.showFavorites.set(false); this.pickFrom(this.filtered(category, false)); }
  reveal(): void { this.revealed.set(true); }
  nextJoke(): void {
    const options = this.visibleJokes();
    if (!options.length) return;
    const other = options.filter((joke) => joke.id !== this.currentJoke()?.id);
    const pool = other.length ? other : options;
    this.currentId.set(pool[Math.floor(Math.random() * pool.length)].id);
    this.revealed.set(false); this.copied.set(false);
  }
  toggleFavorite(id: number): void {
    const next = new Set(this.favorites());
    if (next.has(id)) next.delete(id); else next.add(id);
    this.favorites.set(next);
  }
  async copyJoke(joke: Joke): Promise<void> {
    try { await navigator.clipboard.writeText(`${joke.setup} ${joke.punchline}`); this.copied.set(true); this.notify('Joke copied. Go make someone smile!'); setTimeout(() => this.copied.set(false), 1800); }
    catch { this.notify('Copy isn’t available in this browser.'); }
  }
  private pickFrom(pool: Joke[]): void { const pick = pool[0]; if (pick) this.currentId.set(pick.id); this.revealed.set(false); this.copied.set(false); }
  private filtered(category: Category, favoritesOnly: boolean): Joke[] { return JOKES.filter((joke) => (!favoritesOnly || this.favorites().has(joke.id)) && (category === 'All jokes' || joke.category === category)); }
  private notify(message: string): void { this.toast.set(message); clearTimeout(this.lastToastTimer); this.lastToastTimer = setTimeout(() => this.toast.set(''), 2200); }
}

bootstrapApplication(AppComponent).catch((error: unknown) => console.error(error));

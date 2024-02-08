export default class GameSounds {

  static audio = new Audio();

  private static playSound(src: string) {
    try {
      this.audio.pause();
      this.audio.src = src;
      this.audio.play().catch(() => {});
    } catch(err) {
      // ignore
    }
  }

  static playMove(): void {
    this.playSound('/simple-chess/sounds/piece_move.wav')
  }

  static playSpecial(): void {
    this.playSound('/simple-chess/sounds/piece_special.wav')
  }

  static playEvolve(): void {
    this.playSound('/simple-chess/sounds/piece_evolve.wav')
  }

  static playRestart(): void {
    this.playSound('/simple-chess/sounds/board_restart.wav')
  }

  static playSong(): void {
    this.playSound('/simple-chess/sounds/song_win.wav')
  }

}
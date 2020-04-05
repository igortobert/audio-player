import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit, AfterViewInit {
  @ViewChild('audio', { static: true }) audio: ElementRef;
  @ViewChild('progressBar', { static: true }) progressBar: ElementRef;
  @ViewChild('progressLine', { static: true }) progressLine: ElementRef;

  track: Track;
  trackIndex = 0;
  isPlaying = false;
  currentTime: string;
  duration: string;

  private songs = ['hey', 'summer', 'ukulele'];

  constructor() { }

  ngOnInit(): void {
    this._loadTrack();
  }

  ngAfterViewInit() {
    this.audio.nativeElement.addEventListener('timeupdate', this.updateProgress);
    this.audio.nativeElement.addEventListener('loadedmetadata', this.initTrack);
    this.progressLine.nativeElement.addEventListener('click', this.setProgress);
  }

  nextTrack() {
    if (this.trackIndex !== this.songs.length - 1) {
      this.trackIndex++;
      this.progressBar.nativeElement.style.width = `0%`;
      this.isPlaying = false;
      this._loadTrack();
    }
  }

  prevTrack() {
    if (this.trackIndex !== 0) {
      this.trackIndex--;
      this.progressBar.nativeElement.style.width = `0%`;
      this.isPlaying = false;
      this._loadTrack();
    }
  }

  playPauseClick() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.audio.nativeElement.play();
    } else {
      this.audio.nativeElement.pause();
    }
  }

  play() {
    this.isPlaying = true;
    this.audio.nativeElement.play();
  }

  pause() {
    this.isPlaying = false;
    this.audio.nativeElement.pause();
  }


  updateProgress = (e) => {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    this.progressBar.nativeElement.style.width = `${progressPercent}%`;
    this.currentTime = this._getTime(currentTime);
  }

  setProgress = (e) => {
    const width = this.progressLine.nativeElement.offsetWidth;
    const clickX = e.offsetX;
    const duration = this.audio.nativeElement.duration;
    const currentTime = (clickX / width) * duration;
    this.audio.nativeElement.currentTime = currentTime;
  }

  private _loadTrack() {
    this.track = {
      title: this.songs[this.trackIndex],
      file: `/assets/music/${this.songs[this.trackIndex]}.mp3`,
      label: `/assets/images/${this.songs[this.trackIndex]}.jpg`
    };
  }

  private _getTime(secondsSrc: number): string {
    const seconds = Math.floor(secondsSrc);
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5);
  }

  private initTrack = () => {
    const dur = this.audio.nativeElement.duration || 0;
    const curr = this.audio.nativeElement.currentTime || 0;
    this.duration = this._getTime(dur);
    this.currentTime = this._getTime(curr);
  }

}




interface Track {
  title: string;
  file: string;
  label: string;
}

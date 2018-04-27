import { Component, Method, State, Element, Prop } from '@stencil/core';
import moment from 'moment';
import { ModalController } from '@ionic/core';


@Component({
  tag: 'audio-player',
  styleUrl: 'audio-player.scss'
})

export class AudioPlayer { 
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: ModalController;
  @State() status: string = "stopped";
  audioTag: any;
  timerTag: any;
  progressBarValue: any;
  volumeBarValue: any;
  @Element() el: any;
  date = moment();// new Date();
  
  listAlbum;
  @Method()
  log(string){ 
    console.log('Log: '+ string);
  }

  @Method()
  play(url){
    if (this.status && this.status !== 'stopped') {
      this.audioTag.pause();
      this.audioTag.remove();
    }

    this.audioTag = document.createElement('audio');
    let sourceTag = document.createElement('source');
    sourceTag.setAttribute('src',url);
    sourceTag.setAttribute('type','audio/mpeg');
    this.audioTag.appendChild(sourceTag);
    this.audioTag.onended = () => {this.stop()};
    this.audioTag.addEventListener('loadedmetadata', () => {
      this._play();
      this.el.forceUpdate();
    });

    this.timerTag = this.el.querySelector('#timer');
    this.progressBarValue = this.el.querySelector('.progress-bar-value');

    this.audioTag.ontimeupdate = () => { 
      console.log("teste");
      this.timerTag.innerHTML = moment().hour(0).minutes(0).seconds(Math.floor(this.audioTag.currentTime)).format('HH:mm:ss') + ' - ';
      this.progressBarValue.style.width = (Math.floor(this.audioTag.currentTime) * 100 ) / Math.floor(this.audioTag.duration) + '%';
    };   
  }
  @Method()
  pause(){
    this.audioTag.pause();
    this.status = 'paused';
  }

  @Method()
  stop(){
    this.audioTag.pause();
    this.audioTag.currentTime=0;
    this.status = 'stopped';
    this.timerTag = this.el.querySelector('#timer');
    this.timerTag.innerHTML = '';
  }
  
  private _play(){
    this.audioTag.play();  
    this.status = 'playing';
  }

  private _setSongCurrentTime(ev){
    let percCurTime = (ev.offsetX * 100) / ev.srcElement.clientWidth;
    this.progressBarValue.style.width = percCurTime + '%';
    this.audioTag.currentTime = (Math.floor(this.audioTag.duration) * percCurTime) / 100;
  }

  private _changeVolume(ev){
    let percVolume = 100 - ((ev.offsetY  * 100 ) / ev.srcElement.clientHeight);
    this.volumeBarValue = this.el.querySelector('.volume-controls-value');   
    //this.volumeBarValue.style.height = percVolume +'%';
    this.volumeBarValue.style['margin-top'] = ev.offsetY + 'px';
    this.audioTag.volume = percVolume/100; 
    console.log(percVolume);
  }

  async openAddAlbumModal(){
    const modal = await this.modalCtrl.create({
      component: 'page-add-album'
    });
    await modal.present();
  }

  render() {
    console.log('Render ' + this.status);
    return (
      <div class="audio-player-container">    
      {/* {this.date.format('HH:mm')}      */}
        <div class="audio-player-controls">
          <div class="audio-player-button">
            {this.status === 'playing'?
              <span>
                <ion-icon name="pause" onClick={()=> {this.pause()}}></ion-icon>                                 
              </span>:
              this.status === 'paused'?
              <span>
                <ion-icon name="play" onClick={()=> {this._play()}}></ion-icon>                                  
              </span>:null  
            }  
            {this.status !== 'stopped'?
              <span> 
                <ion-icon name="square" onClick={()=> {this.stop()}}></ion-icon>                 
                <div class='volume'>
                  <ion-icon name="volume-mute" onClick={() => {this.el.querySelector('.volume').classList.toggle('volume-open')}}></ion-icon> 
                  <div class='volume-controls'> 
                    <div class='volume-controls-cont-value' onClick={(ev)=> {this._changeVolume(ev)}}>
                      <div class='volume-controls-value'> 
                      </div>   
                    </div>  
                  </div> 
                </div>        
              </span>:null  
            }   
          </div> 
          <div class="timer-container">
            <span id="timer">
            </span>
            {this.status !== 'stopped'?
              <span>
                {moment().hour(0).minutes(0).seconds(Math.floor(this.audioTag.duration)).format('HH:mm:ss')}
              </span>:null
            }
          </div>
        
          <div class="progress-bar" onClick={(ev)=> {this._setSongCurrentTime(ev)}}>
             <div class="progress-bar-value">
             </div>  
          </div>

        </div>                 

        <div class="audio-player-add">
          <ion-icon name="add" onClick={()=> {this.openAddAlbumModal()}}></ion-icon>             
        </div>  
      </div>
    );
  }
}
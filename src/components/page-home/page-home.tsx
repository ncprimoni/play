import { Component, Element, State, Method } from '@stencil/core';

declare var firebase:any;

@Component({
  tag: 'page-home',
  styleUrl: 'page-home.scss'
})
export class MycomponentPageHome {
  @Element() el: any; 
  audioPlayerEl: any; 

  @State() listAlbum: Array<any> = [];
  
  componentDidLoad(){
    this.audioPlayerEl = this.el.querySelector('audio-player');
    console.log(this.audioPlayerEl);
    this.audioPlayerEl.log('Mensagem de Log !!!');
  }

  componentWillLoad(){
    this.getListAlbum();
  }   

  @Method()
  getListAlbum(){
    // const body = `strJson={"script1":{"parameters":{"p1":{"name":"p_lista","direction":"OUT","type":"CURSOR"}},"function":"sibd0006.rec_lst_discos"}}&user=SC439490&token=kRl9GGezO0VQeDIbvyiMWOeTfoqKO4W0H1Iyrs62tdZKw0wBeFVAFaOH78Lc/jXrOlrYLhYLSqyZvw7fOie6Z0iLb3Jod9Xhq33xQ8WwjTzBYoYxQv3JzSGHuYYqap8PpBr3LgyHgWeqKKyjzh2qpA==`
    // const myRequest = new Request('http://mcsbuilder:7010/MCS-be-H/execute/tunel/', {method: 'POST', body: body});

    // fetch(myRequest)
    //   .then(response => {
    //     if (response.status === 200) {
    //       return response.json();
    //     } else {
    //       throw new Error('Something went wrong on api server!');
    //     }
    //   })
    //   .then(response => {
    //     console.log(response);
    //     this.listAlbum = response["script1"];
    //     // ...
    //   }).catch(error => {
    //     console.error(error);   
    //   });  
    
    let listAlbumTemp: Array<any> = [];
    firebase.firestore().collection("albums").get().then(albumSnapshot => {
      albumSnapshot.forEach(albumDoc => {
        listAlbumTemp.push(albumDoc.data());
      });
      this.listAlbum = listAlbumTemp;
      console.log(this.listAlbum); 
    });
  }

  callAudioPlayer(url, ev){
    let elements = document.getElementsByClassName('album-selecionado');
    if(elements.length > 0){
      elements[0].classList.remove('album-selecionado'); 
    }
    // ( as any).classList.remove('album-selecionado');
    (ev.srcElement.closest('ion-col') as any).classList.toggle('album-selecionado');
    this.audioPlayerEl.play(url);
  }

  render() {
    let albumsEl = this.listAlbum.map(album => {
      return (
        <ion-col col-6 col-sm-4 col-md-3 col-lg-2 onClick={(ev)=> {this.callAudioPlayer(album.urlMusic, ev)}}> 
          <img class="img-capa-album" src={album.urlImage}>
          </img>  
          <div class="hover-container">
            <div>
               {album.nameMusic}
            </div>
          </div>
        </ion-col> )
    });

    return (
      <div>        
        <audio-player></audio-player>
        <div  class="album-container">
          <ion-grid class="grid-album">
            <ion-row>
              {albumsEl}
            </ion-row>  
          </ion-grid>  
        </div>
      </div>
    );
  }
}
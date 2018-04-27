import { Component, Element } from '@stencil/core';

@Component({
  tag: 'page-add-album',
  styleUrl: 'page-add-album.scss'
})
export class PageAddAlbum {
  @Element() el: any; 
  albumObj: any = {}; ///vai conter todos os atributos do album
  dismiss(){
    (this.el.closest('ion-modal') as HTMLIonModalElement).dismiss();
  }

  setValueAlbum(value,fieldName){
    this.albumObj[fieldName] = value;
    console.log("Value = " + value + " FieldName = " + fieldName);
  }  

  saveAlbum(){
    const body = `strJson={"script1":{"parameters":{"p1":{"name":"p_url_image","direction":"IN","type":"VARCHAR","value":"`+this.albumObj.imageUrl+`"},"p2":{"name":"p_url_music","direction":"IN","type":"VARCHAR","value":"`+this.albumObj.musicUrl+`"},"p3":{"name":"p_name_music","direction":"IN","type":"VARCHAR","value":"`+this.albumObj.musicName+`"},"p4":{"name":"p_name_author","direction":"IN","type":"VARCHAR","value":"`+this.albumObj.musicAuthor+`"}},"function":"sibd0006.inserir_audio_data"}}&user=SC439490&token=kRl9GGezO0VQeDIbvyiMWOeTfoqKO4W0H1Iyrs62tdZKw0wBeFVAFaOH78Lc/jXrOlrYLhYLSqyZvw7fOie6Z0iLb3Jod9Xhq33xQ8WwjTzBYoYxQv3JzSGHuYYqap8PpBr3LgyHgWeqKKyjzh2qpA==`;
    const myRequest = new Request('http://mcsbuilder:7010/MCS-be-H/execute/tunel/', {method: 'POST', body: body});

    fetch(myRequest)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Something went wrong on api server!');
        }
      })
      .then(response => {
        console.log(response);
        (document.querySelector('my-component') as any).getListAlbum();       
        this.dismiss();
      }).catch(error => {
        console.error(error);
      });     
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-title>
            Adicionar Album
          </ion-title>
          <ion-buttons slot="end">
            <ion-button onClick={()=> {this.dismiss()}}>
              X 
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <ion-list>
          <ion-item>
            <ion-label>
              Nome da música:
            </ion-label>
            <ion-input name="musicName" onIonBlur={(ev)=> {this.setValueAlbum((ev.srcElement as any).value, 'musicName')}}></ion-input>
          </ion-item>   
          <ion-item>
            <ion-label>
              Autor da música:
            </ion-label>
            <ion-input name="musicAuthor" onIonBlur={(ev)=> {this.setValueAlbum((ev.srcElement as any).value, 'musicAuthor')}}></ion-input>
          </ion-item>   
          <ion-item>
            <ion-label>
              Url da música:
            </ion-label>
            <ion-input name="musicUrl" onIonBlur={(ev)=> {this.setValueAlbum((ev.srcElement as any).value, 'musicUrl')}}></ion-input>
          </ion-item>   
          <ion-item>
            <ion-label>
              Url da capa:
            </ion-label>
            <ion-input name="imageUrl" onIonBlur={(ev)=> {this.setValueAlbum((ev.srcElement as any).value, 'imageUrl')}}></ion-input>
          </ion-item> 
        </ion-list> 
        <div>
          <ion-button expand="full" onClick={() => {this.saveAlbum()}}>Confirmar</ion-button>        
        </div>      
      </ion-content>  
    ];
  }  
}
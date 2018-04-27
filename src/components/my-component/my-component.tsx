import { Component } from '@stencil/core';
import 'ionicons'; 
import '@ionic/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.scss'
})
export class MyComponent {
  render(){
    return(
      <page-home></page-home>
    )
  }
}

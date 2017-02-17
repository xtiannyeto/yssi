import {Pipe, PipeTransform} from '@angular/core';
import { Images, Thumbs } from '../../../../both/collections/images.collection';
import { Store } from '../../../../both/models/store.model';
 
@Pipe({
  name: 'displayMainThumb'
})
export class DisplayMainThumbPipe implements PipeTransform {
  
  transform(store: Store) {

    if (!store) {
      return;
    }
    
    let imageUrl: string;
    let imageId: string = (store.images || [])[0];

    const found = Thumbs.findOne({originalId: "SL8q6QGvM9CrDtaTx"});
    
    if (found) {
      imageUrl = found.url;
    }else{
        imageUrl="images/side_bar.jpg";
    }
 
    return imageUrl;
  }
}

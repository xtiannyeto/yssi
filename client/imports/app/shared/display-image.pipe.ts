import {Pipe, PipeTransform} from '@angular/core';
import { Images } from '../../../../both/collections/images.collection';
import { Store } from '../../../../both/models/store.model';

@Pipe({
  name: 'displayImage'
})
export class DisplayImagePipe implements PipeTransform {
  transform(imageId: string) {
    if (!imageId) {
      return;
    }
    let imageUrl: string;
    
    const found = Images.findOne(imageId);
    if (found) {
      imageUrl = found.url;
    }else{
        imageUrl="images/side_bar.jpg";
    }
 
    return imageUrl;
  }
}
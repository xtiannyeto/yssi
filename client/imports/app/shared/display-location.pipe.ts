import {Pipe, PipeTransform} from '@angular/core';
import { Images } from '../../../../both/collections/images.collection';
import { Store } from '../../../../both/models/store.model';

@Pipe({
  name: 'displayLocation'
})
export class DisplayLocationPipe implements PipeTransform {
  transform(location: string) {
    if (!location) {
      return;
    }
    let firtsLocation: string[];
    
    firtsLocation = location.split(",");
    if(!firtsLocation){
        return;
    }
    return firtsLocation[0];
  }
}
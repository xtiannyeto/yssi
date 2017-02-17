import { CollectionObject } from './collection-object.model';

export interface Store extends CollectionObject {
  name: string;
  description: string;
  location: YssiLocation;
  createDate: Date;
  updateDate?: Date;
  activities?: string[];
  images?: string[];
  owner?: string;
}


export interface YssiLocation {
  name: string;
  address: string;
  coords: {
    type: 'Point',
    coordinates: [number, number]
  }

}
import { CollectionObject } from './collection-object.model';

export interface Store extends CollectionObject {
  name: string;
  description: string;
  location: Location;
  owner?: string;
}


interface Location {
  name: string;
  lat?: number;
  lng?: number;
}
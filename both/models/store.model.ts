import { CollectionObject } from './collection-object.model';

export interface Store extends CollectionObject {
  name: string;
  description: string;
  location: Location;
  images?: string[];
  owner?: string;
}


interface Location {
  name: string;
  lat?: number;
  lng?: number;
}
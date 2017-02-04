import { CollectionObject } from './collection-object.model';

export interface Store extends CollectionObject {
  name: string;
  description: string;
  location: YssiLocation;
  activities?: string[];
  comments?:string[];
  images?: string[];
  owner?: string;
}


export interface YssiLocation {
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}
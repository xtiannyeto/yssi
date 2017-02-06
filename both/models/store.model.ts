import { CollectionObject } from './collection-object.model';
import { Comment } from './comment.model';

export interface Store extends CollectionObject {
  name: string;
  description: string;
  location: YssiLocation;
  activities?: string[];
  comments?:Comment[];
  images?: string[];
  owner?: string;
}


export interface YssiLocation {
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}
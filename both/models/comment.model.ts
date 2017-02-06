import { CollectionObject } from './collection-object.model';

export interface Comment {
  user: string;
  main: string;
  note?: number;
}
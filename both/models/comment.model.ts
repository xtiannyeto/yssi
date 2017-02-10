import { CollectionObject } from './collection-object.model';

export interface Comment {
  store: string;
  user: string;
  main: string;
  note?: number;
  createdDate: Date;
}
import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';
//import { UploadFS } from 'meteor/jalik:ufs';

import { Thumb, Image } from "../models/image.model";
 
export const Images = new MongoObservable.Collection<Image>('images');
export const Thumbs = new MongoObservable.Collection<Thumb>('thumbs');



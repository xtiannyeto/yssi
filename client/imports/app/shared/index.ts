import { DisplayNamePipe } from './display-name.pipe';
import {DisplayMainImagePipe} from "./display-main-image.pipe";
import {DisplayImagePipe} from "./display-image.pipe";
import {DisplayUserPipe} from "./display-user.pipe";
 
export const SHARED_DECLARATIONS: any[] = [
  DisplayNamePipe,
  DisplayMainImagePipe,
  DisplayImagePipe,
  DisplayUserPipe
];
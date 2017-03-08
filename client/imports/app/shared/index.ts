import { DisplayMainImagePipe } from "./display-main-image.pipe";
import { DisplayImagePipe } from "./display-image.pipe";
import { DisplayUserPipe, DisplayUserPicturePipe, DisplayEmailPipe, DisplayNamePipe } from "./display-user.pipe";
import { DisplayLocationPipe } from "./display-location.pipe";
import { DisplayMainThumbPipe } from "./display-main-thumb.pipe";


export const SHARED_DECLARATIONS: any[] = [
  DisplayNamePipe,
  DisplayMainImagePipe,
  DisplayImagePipe,
  DisplayUserPipe,
  DisplayLocationPipe,
  DisplayMainThumbPipe,
  DisplayUserPicturePipe,
  DisplayEmailPipe
];
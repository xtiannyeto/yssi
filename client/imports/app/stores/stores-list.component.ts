import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';
import { PaginationService } from 'ng2-pagination';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { InjectUser } from "angular2-meteor-accounts-ui";

import { Meteor } from 'meteor/meteor';

import 'rxjs/add/operator/combineLatest';

import { Stores } from '../../../../both/collections/stores.collection';
import { Store } from '../../../../both/models/store.model';

import template from './stores-list.component.html';
import style from './stores-list.component.scss';
 
interface Pagination {
  limit: number;
  skip: number;
}
 
interface Options extends Pagination {
  [key: string]: any
}
 

@Component({
  selector: 'app',
  template,
  styles : [ style ]
})

@InjectUser('user')
export class StoresListComponent  implements OnInit, OnDestroy {
  stores: Observable<Store[]>;
  storesSub: Subscription;
  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  nameOrder: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  storesSize: number = 0;
  autorunSub: Subscription;
  location: Subject<string> = new Subject<string>();
  user: Meteor.User;
  isFullMapView: boolean;
  actionButton:string = "add";

 
  constructor(private paginationService: PaginationService) {
    
  }
  ngOnInit() {

    this.optionsSub = Observable.combineLatest(
      this.pageSize,
      this.curPage,
      this.nameOrder,
      this.location
    ).subscribe(([pageSize, curPage, nameOrder, location]) => {
      const options: Options = {
        limit: pageSize as number,
        skip: ((curPage as number) - 1) * (pageSize as number),
        sort: { name: nameOrder as number }
      };
      
      this.paginationService.setCurrentPage(this.paginationService.defaultId(), curPage as number);
      
      if(this.storesSub){
        this.storesSub.unsubscribe();
      }
      this.storesSub = MeteorObservable.subscribe('stores', options, location).subscribe(() =>{
        this.stores = Stores.find({}, {
          sort: {
              name: this.nameOrder
            }
        }).zone();
      });
    });
   
    this.paginationService.register({
      id: this.paginationService.defaultId(),
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.storesSize,
    });

    this.pageSize.next(10);
    this.curPage.next(1);
    this.nameOrder.next(1);
    this.location.next('');

    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
      this.storesSize = Counts.get('numberOfStores');
      this.paginationService.setTotalItems(this.paginationService.defaultId(), this.storesSize);
    });

  }

  ngOnDestroy() {
    this.storesSub.unsubscribe();
    this.optionsSub.unsubscribe();
    this.autorunSub.unsubscribe();
  }
  removeStore(store: Store): void {
     console.log(store._id);
    Stores.remove(store._id);
  }
  isOwner(store : Store){
    return this.user && this.user._id === store.owner;
  }
  search(value: string): void {
    this.curPage.next(1);
     this.location.next(value);
  }
  onPageChanged(page: number): void {
    this.curPage.next(page);
  }
  changeSortOrder(nameOrder: string): void {
     this.nameOrder.next(parseInt(nameOrder));
   }
}
import { Component,EventEmitter, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';
import { PaginationService } from 'ng2-pagination';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { InjectUser } from "angular2-meteor-accounts-ui";
import { InfiniteScroll } from 'angular2-infinite-scroll';

import { Meteor } from 'meteor/meteor';
import { AppComponentService } from '../app.component.service';
import { MaterializeModule, MaterializeAction} from 'angular2-materialize';

import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/concat';

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
  selector: 'store-list',
  template,
  styles : [ style ]
})

@InjectUser('user')
export class StoresListComponent  implements OnInit, OnDestroy {
  stores: Observable<Store[]>;
  storesForMap: Observable<Store[]>;
  storesSub: Subscription;
  pageSize: BehaviorSubject<number> = new BehaviorSubject<number>(10);
  curPage: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  globalActions = new EventEmitter<string|MaterializeAction>();
  nameOrder: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  storesSize: number = 0;
  autorunSub: Subscription;
  location: Subject<string> = new Subject<string>();
  user: Meteor.User;
  isFullMapView: boolean;
  actionButton:string = "add";
  lat:number;
  lng:number;
  searchValue:string;
  toastIsLoggedInMessage:string = "You have to be connected to see more";

 
  constructor(private router: Router, private paginationService: PaginationService, private componentService:AppComponentService) {
    
  }

  ngOnInit() {
  
    this.componentService.getData().subscribe(data => {
        this.searchValue = data;
        this.search(data);
      });

    this.optionsSub = Observable.combineLatest(
      this.pageSize,
      this.curPage,
      this.nameOrder,
      this.location
    ).subscribe(([pageSize, curPage, nameOrder, location]) => {
      const options: Options = {
        limit: (pageSize as number)* (curPage as number),
        skip: ((curPage as number) - (curPage as number)) * (pageSize as number),
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

    this.lat = 10;
    this.lng = 20;
  }

  ngOnChanges(changes) {
  }
  ngOnDestroy() {
    this.storesSub.unsubscribe();
    this.optionsSub.unsubscribe();
    this.autorunSub.unsubscribe();
  }
  removeStore(store: Store): void {
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

    onScrollUp(){
      console.log("Up");
      //this.curPage.next(this.curPage.getValue()-1);
    }
    onScrollDown(){

      var limitOfStore = this.storesSize+10;
      var nextCurPage = this.curPage.getValue()+1;

      if((this.pageSize.getValue() * this.curPage.getValue()) <= limitOfStore){
        this.curPage.next(nextCurPage);
      }
      
    }
    isLoggedIn(){
    if (!Meteor.userId()) {
      return false;
    }
    return true;
    }

  toastIsLoggedIn(url:string, parameter:string){
    if(!this.isLoggedIn()){
      this.globalActions.emit('toast');
    }
    this.router.navigate([url, parameter]);
  }
}
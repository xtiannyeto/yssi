import { Component, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { StoreMapComponentService } from '../shared/services/store-map.component.service';
import { StoreDialogComponentService } from '../shared/services/store-dialog.component.service';

import { MaterializeModule, MaterializeAction } from 'angular2-materialize';

import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/concat';
import * as _ from "lodash";

import { Stores } from '../../../../both/collections/stores.collection';
import { Store, YssiLocation } from '../../../../both/models/store.model';

import template from './stores-list.component.html';
import style from './stores-list.component.scss';


interface Pagination {
  limit: number;
  skip: number;
}

interface OptionsDb extends Pagination {
  [key: string]: any
}

interface Options {
  lng: number,
  lat: number,
  step: number,
  distance: number,
  search: string
}

@Component({
  selector: 'store-list',
  template,
  styles: [style]
})

@InjectUser('user')
export class StoresListComponent implements OnInit, OnDestroy {
  stores$: Store[] = [];
  stores: Store[] = [];
  storesForMap: Observable<Store[]>;
  storesSub: Subscription;
  pageSize: BehaviorSubject<number> = new BehaviorSubject<number>(10);
  curPage: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  filter: BehaviorSubject<string> = new BehaviorSubject<string>("");
  ascOrDesc: BehaviorSubject<string> = new BehaviorSubject<string>("");
  skip: Subject<number> = new Subject<number>();
  limit: Subject<number> = new Subject<number>();
  step: BehaviorSubject<number> = new BehaviorSubject<number>(100000);
  distance: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  globalActions = new EventEmitter<string | MaterializeAction>();
  nameOrder: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  options: Options;
  storesSize: number = 0;
  autorunSub: Subscription;
  searchValue: BehaviorSubject<string> = new BehaviorSubject<string>("");
  user: Meteor.User;
  isFullMapView: boolean;
  actionButton: string = "add";
  lat: number;
  lng: number;
  toastIsLoggedInMessage: string = "Connect you to see more";
  imagesSubs: Subscription;
  dateFilter: string = "DATE";
  locationFilter: string = "LOCATION";
  nameFilter: string = "NAME";
  currentLocation: any;
  paramsSub: Subscription;
  filterForm: FormGroup;

  constructor(
    private router: Router,
    private paginationService: PaginationService,
    private componentService: AppComponentService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private mapService: StoreMapComponentService,
    private dialogService: StoreDialogComponentService) {

  }

  ngOnInit() {

    this.componentService.setUrl("stores");
    this.filterForm = this.formBuilder.group({
      orderBy: ["", Validators.required]
    });

    this.paramsSub = this.route.params.subscribe((params: Params) => {
      this.getLngLatFromRoute(params);

      let s: string = this.componentService.decodeThisString(params['search']);
      if (this.componentService.getData().getValue() == null && !(s === undefined)) {
        this.componentService.updateData(s);
      }

      this.imagesSubs = MeteorObservable.subscribe('images').subscribe();

      if (this.optionsSub) {
        this.optionsSub.unsubscribe();
      }

      this.optionsSub = Observable.combineLatest(
        this.step,
        this.distance,
        this.searchValue,
        this.skip,
        this.limit
      ).subscribe(([step, distance, searchValue, skip, limit]) => {

        const optionsdb: OptionsDb = {
          limit: limit,
          skip: skip
        };

        const options: Options = {
          lng: this.lng,
          lat: this.lat,
          step: step,
          distance: distance,
          search: searchValue
        };

        if (this.storesSub) {
          this.stores = [];
          this.storesSub.unsubscribe();
        }

        if (this.paramsSub) {
          this.stores = [];
          this.storesSub.unsubscribe();
        }

        this.storesSub = MeteorObservable.subscribe('stores', options, optionsdb).subscribe(() => {
          Stores.find({}).subscribe((data) => {
            this.stores = _.uniqBy(_.concat(this.stores, data), "_id");
          });

          this.changeSort("DATE");
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
      this.paginationService.setCurrentPage(this.paginationService.defaultId(), this.curPage.getValue() as number);

      this.limit.next(this.pageSize.getValue());
      this.skip.next((this.curPage.getValue() - 1) * this.pageSize.getValue());

      if (this.autorunSub) {
        this.autorunSub.unsubscribe();
      }

      this.autorunSub = MeteorObservable.autorun().subscribe(() => {
        this.storesSize = Counts.get('numberOfStores');
        this.paginationService.setTotalItems(this.paginationService.defaultId(), this.storesSize);
      });

    });

    this.componentService.getData().subscribe(data => {
      this.search(data);
    });

    this.mapService.getZoom().subscribe(data => {
      this.changeZoom(data);
    });
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    //console.log(changes);
  }

  isOwner(store: Store) {
    return this.user && this.user._id === store.owner;
  }

  search(value: string): void {
    this.stores = [];
    this.curPage.next(1);
    this.skip.next((this.curPage.getValue() - 1) * this.pageSize.getValue());
    this.searchValue.next(value);
  }

  changeZoom(zoom: number) {
    console.log(zoom);
    if (zoom > 0) {
      this.distance.next(this.distance.getValue() - this.step.getValue());
    } else if (zoom < 0) {
      this.distance.next(this.distance.getValue() + this.step.getValue());
    }
  }

  onPageChanged(page: number): void {
    this.curPage.next(page);
  }

  changeSort(filter: string): void {
    console.log(filter);
    this.filter.next(filter);
    this.ascOrDesc.next("asc");
    this.stores = _.orderBy(this.stores, this.getFilter(this.filter.getValue()), this.ascOrDesc.getValue());
  }

  changeOrder(order: string) {
    this.ascOrDesc.next(order);
    this.stores = _.orderBy(this.stores, this.getFilter(this.filter.getValue()), this.ascOrDesc.getValue());
  }

  onScrollUp() {

  }

  onScrollDown() {
    console.log("down");
    var nbMaxPage = Math.floor(this.storesSize / this.pageSize.getValue()) + 1;
    var nextCurPage = this.curPage.getValue() + 1;
    var pageSize = this.pageSize.getValue();

    //console.log(this.storesSize);
    //console.log(nextCurPage);
    if (nextCurPage <= nbMaxPage) {
      this.curPage.next(nextCurPage);
      this.skip.next((this.curPage.getValue() - 1) * this.pageSize.getValue());
    }
  }

  isLoggedIn() {
    if (!Meteor.userId()) {
      return false;
    }
    return true;
  }

  toastIsLoggedIn(url: string, parameter: string) {
    if (!this.isLoggedIn()) {
      this.dialogService.toast(this.dialogService.MSG_VIEW_STORE, 4000, "rounded");
    }
    this.router.navigate([url, parameter]);
  }

  isImages(store: Store) {
    return store.images && store.images.length > 0;
  }

  arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j])
          a.splice(j--, 1);
      }
    }
    return a;
  }

  showFilterOrder(filter: string) {
    return this.filter.getValue() == filter;
  }

  getFilter(filter: string) {
    switch (filter) {
      case "DATE":
        return "createDate";
      case "LOCATION":
        return "location.name";
      case "NAME":
        return "name";
    }
  }

  hideAscOrDesc(ascOrDesc: string) {

    if (ascOrDesc == this.ascOrDesc.getValue()) {
      return false;
    }
    return true;
  }

  getLngLatFromRoute(params: Params) {

    this.lng = this.componentService.decodeThis(params['lng']);
    this.lat = this.componentService.decodeThis(params['lat']);

    if (this.lng === undefined || this.lat === undefined) {

      this.currentLocationIsUndefinedIRouteBackOrISetIt();

    } else {
      this.componentService.updateLocation(this.lng, this.lat);
    }
  }

  currentLocationIsUndefinedIRouteBackOrISetIt() {

    this.currentLocation = this.componentService.getLocation().getValue();
    if (this.currentLocation == null || this.currentLocation === undefined) {
      this.router.navigate(['/']);
    }

    this.lng = this.currentLocation.lng;
    this.lat = this.currentLocation.lat;
  }


  ngOnDestroy() {
    if (this.storesSub) {
      this.storesSub.unsubscribe();
    }

    if (this.optionsSub) {
      this.optionsSub.unsubscribe();
    }
    if (this.autorunSub) {
      this.autorunSub.unsubscribe();
    }
    if (this.imagesSubs) {
      this.imagesSubs.unsubscribe();
    }
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }

  }
}
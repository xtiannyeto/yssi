import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { RatingModule } from "ngx-rating";

import { User } from '../../../../both/models/user.model';
import { InjectUser } from "angular2-meteor-accounts-ui";

import { Comments } from '../../../../both/collections/comments.collection';
import { Comment } from '../../../../both/models/comment.model';

import * as _ from "lodash";

import template from './store-comments.component.html';
import style from './store-comments.component.scss';

@Component({
    selector: 'store-comments',
    template,
    styles: [style]
})
@InjectUser('user')
export class StoreCommentsComponent implements OnInit, OnDestroy {

    @Input() storeId: string;
    comments: Comment[] = [];
    commentSub: Subscription;
    addCommentForm: FormGroup;
    owner: User;
    ownerSub: Subscription;

    constructor(
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {

        if (this.commentSub) {
            this.commentSub.unsubscribe();
        }
        if (this.ownerSub) {
            this.ownerSub.unsubscribe();
        }

        this.addCommentForm = this.formBuilder.group({
            main: ['', Validators.required],
            note: ['', Validators.required],
        });

        this.commentSub = MeteorObservable.subscribe('comments', this.storeId).subscribe(() => {
            Comments.find({ store: this.storeId }).subscribe((data) => {
                this.comments = _.orderBy(data, "createdDate", "desc");
            });
        });
    }

    postComment() {

        if (this.addCommentForm.value.main === undefined
            || this.addCommentForm.value.main == null
            || this.addCommentForm.value.main.length == 0) {
            return;
        }

        Comments.insert({
            store: this.storeId,
            main: this.addCommentForm.value.main,
            note: this.addCommentForm.value.note,
            user: Meteor.userId(),
            createdDate: new Date(),
        });

        this.addCommentForm.reset();
    }

    getNote(note: number) {
        let grade: string[] = [];
        for (var i = 0; i < note; i++) {
            grade.push("grade");
        }
        return grade;
    }

    ngOnDestroy() {
        if (!(this.commentSub === undefined)) {
            this.commentSub.unsubscribe();
        }
        if (!(this.ownerSub === undefined)) {
            this.ownerSub.unsubscribe();
        }
    }
}
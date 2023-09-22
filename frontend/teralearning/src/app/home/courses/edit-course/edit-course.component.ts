import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Inject, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { PageComponent } from '../page/page.component';
import { ChapterComponent } from '../chapter/chapter.component';
import { Course } from 'src/model/course.model';
import { CourseDataService } from 'src/app/service/course-data.service';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/service/course.service';
import { Chapter } from 'src/model/chapter.model';
import { Page } from 'src/model/page.model';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit {

  @ViewChild('chapterlist',{read:ViewContainerRef}) parent!:ViewContainerRef;
  private componentRef!:ComponentRef<any>
constructor(private matDialog:MatDialog,private courseService:CourseService,private componentFactoryResolver: ComponentFactoryResolver,private courseDataService:CourseDataService,private route:Router) { }

  @Output() addPageEvent = new EventEmitter();
  updateData!:any;
  chapterList:Chapter[]=[];
  chapterCount:number = 0;
  emptyChapter!:Chapter;
  ngOnInit(): void {
    
    this.courseDataService.data.subscribe(data=>{
      this.updateData = data;

      if(this.updateData?.courseName == null){
        this.route.navigate(["home/courses"])
      }else{
        this.emptyChapter = {
          chapterName:"Chapter "+this.chapterList.length+1,
          pages:[],
          id:0,
          courseId:this.updateData.id
        }
        this.getChapter(this.updateData.id)
      }
      
    })
  }
  
  getChapter(id:number){
    this.courseService.getChapterByCourseId(id).subscribe(data=>{
      console.log(data)
      if(data.length > 0){
        this.chapterList = data;
        this.chapterList.forEach(item=>{
          this.loadChapter(item)
          console.log(item)
        })
      }
    })
  }
  
  loadChapter(chapter:Chapter){
    
    let childComponent = this.componentFactoryResolver.resolveComponentFactory(ChapterComponent);
   
    this.componentRef = this.parent.createComponent(childComponent);
    this.componentRef.instance.data = [chapter];
    this.chapterCount++;
  }

  addChapter(){
    console.log(this.emptyChapter)
  
    let childComponent = this.componentFactoryResolver.resolveComponentFactory(ChapterComponent);
   
    this.componentRef = this.parent.createComponent(childComponent);
    this.componentRef.instance.data =[this.emptyChapter];
    this.chapterCount++;
    this.chapterList.push(this.emptyChapter)
  }

  uploadFile(){
    return HttpStatusCode.Accepted;
  }
  addPage(){

  }
}
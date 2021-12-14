import { Component, ViewChild, ViewContainerRef, OnInit, AfterViewInit, ComponentFactoryResolver, Renderer2 } from '@angular/core';
import { McqComponent } from './mcq/mcq.component';
import { QptitleComponent } from './qptitle/qptitle.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('feedbackModal', { static: true, read: ViewContainerRef })
  feedbackModal: ViewContainerRef | undefined;
  title = 'open-editor';
  question1 = 'which one is your fav component?';
  question2 = 'test fav component?';

  sizePage = {
    width: 21, // cm
    height: 29.7 // cm
  };
  paddingPage = {
    top: 2, // cm
    right: 2, // cm
    bottom: 2, // cm
    left: 2 // cm
  };
  pages = [
    {
      htmlContent: null,
      full: false
    },
  ];
  currentPage = 0;
  currentChar = null;
  runAfterViewChecked = false;
  currentYPos = 0;
  appliedPageBreak = false;
  pageScaleDisplay: any;
  pageScale = 1;
  isFitPage = false;
  myfocusNode:any;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2
  ){
  }
  ngAfterViewInit(): void{
    // console.log('after view init');
  }

  ngOnInit(): void{
    window.addEventListener('resize', this.onResize.bind(this));
  }
  onResize(): void{
    if (this.isFitPage){
      this.fitPageWidth();
    }
  }
  updateSlider(e): void{
    this.isFitPage = false;
    this.pageScale = e.target.value;
    this.doZoom();
  }

  fitPageWidth(): void{
    this.isFitPage = true;
    const elm = document.getElementById('pageroot');
    this.pageScale = 1 / Math.min(elm.clientWidth / window.innerWidth, elm.clientHeight / window.innerHeight);
    this.doZoom();
  }

  doZoom(): void{
    const pgRoot = document.getElementById('pageroot');
    // this.pageScaleDisplay = this.pageScale.toFixed(4);
    pgRoot.style.transform = 'scale(' + this.pageScale + ')';
  }

  pageSize(size: any): void{
    if (size === 'a4'){
      this.sizePage.width = 21;
      this.sizePage.height = 29.7;
    }
    if (size === 'a5'){
      this.sizePage.width = 14.8;
      this.sizePage.height = 21;
    }
  }
  doPrint(): void{
    const divsToPrint = document.getElementsByClassName('page');
    let printContents = '';
    // tslint:disable-next-line:prefer-for-of
    for (let n = 0; n < divsToPrint.length; n++){
       printContents += divsToPrint[n].innerHTML;
    }
    const mywindow: any = window.open('', 'PRINT');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('<style type=\'text/css\'>.content{font-family:sans-serif;margin: 0px auto;}mcq-view{position: relative;margin: 0px;transition: all 0.5s ease;}#qtext{margin:5px;}.mcqBtn{user-select: none;cursor: pointer;}.cbox{cursor: pointer;}.mcq-option{position: relative;margin: 5px;}.mcqLayout1{display: inline-block;}.mcqLayout2{display: block;}.toggleBtn{position: absolute;right: 0;border: 0;background: orange;} .noprint{ display:none;}</style>');
    // mywindow.document.write( '<link rel=\'stylesheet\' href=\'./assets/print.css\' type=\'text/css\' />' );
    mywindow.document.write('</head><body>' + printContents + '</body></html>');
    mywindow.document.close();
    mywindow.focus();
    mywindow.print();
    mywindow.close();
  }

  clickPage(i: any): void {
    console.log('clickPage');
    this.currentPage = i;
    const element = document.getElementById('content-' + i);
    element.setAttribute('contenteditable', 'true');
  }
  removePage(i: any): void{
    const ele  =  document.getElementById('page-' + i);
    ele.remove();
    this.pages.splice(i);
  }
  insertPagebreak(): void{
    const ele  =  document.getElementById('content-' + this.currentPage);
    let str = '';
    str += '<div contenteditable="false" style="page-break-after: always;"> -------</div><br>';
    //str += '<div style="page-break-before: always;">-------</div>';
    ele.innerHTML += str;
    this.appliedPageBreak = true;
    //this.pages[this.currentPage].full = true;
      //if (!this.pages[this.currentPage + 1]) 
      {
        this.pages.push({
          htmlContent: null,
          full: false
        });
      }
      this.currentPage = this.currentPage + 1;
      //this.runAfterViewChecked = true;
  }

  insertTemplate(): void{
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(McqComponent);
    const componentRef = this.feedbackModal.createComponent(componentFactory);
    const pageElement  =  document.getElementById('content-' + this.currentPage);
    
    const id = 'baby_' + this.getRandomID();
    const mystr = '<div id=' + id + ' class="baby"></div>';
    pageElement.innerHTML += mystr;
    const newQuestionEle = document.getElementById(id);
    this.renderer.appendChild(newQuestionEle, componentRef.location.nativeElement);
    //this.renderer.appendChild(pageElement, componentRef.location.nativeElement);    
    newQuestionEle.setAttribute('style', 'position:absolute; top:' + this.currentYPos + 'px');
    const str = '</br>';
   
    
  }

  contentOnClick(e: any): void{
      let selection = window.getSelection();
      if(selection.focusNode.style !== undefined){
        selection.focusNode.style.border = '1px solid transparent';
      // this.myfocusNode = selection.focusNode;
      const evaluatedTop = selection.focusNode.offsetTop;
      this.currentYPos = evaluatedTop;

      }else{
       let  dd = selection.getRangeAt(0).startContainer.parentElement;
       const evaluatedTop = dd.offsetTop;
       this.currentYPos = evaluatedTop;
      }
      console.log("Y POS-->>>", this.currentYPos);
  }
  inputContent(e, char, i): void {
    // console.log('this.pages', this.pages);
    const element = document.getElementById('content-' + i);
    this.contentOnClick(e);
    if (e.keyCode === 13) {
      // e.preventDefault();
    }
    // console.log("txt--", e.target.innerHTML);
    const heightContent = element.offsetHeight * 2.54 / 96; // Convert pixels to cm
    this.pages[i].htmlContent = element.innerHTML;
    if (Number(heightContent.toFixed(1)) > this.sizePage.height) {
      this.currentChar = char;
      console.log(char, i);
      this.pages[i].full = true;
      if (!this.pages[i + 1]) {
        this.pages.push({
          htmlContent: null,
          full: false
        });
      }
      this.currentPage = i + 1;
      this.runAfterViewChecked = true;
    }
  }

  ngAfterViewChecked(): void {
    if (this.runAfterViewChecked) {
      if (this.currentChar) {
        let str = this.pages[this.currentPage - 1].htmlContent;
        const indexLastCloseDiv = str.lastIndexOf('</div>');
        console.log('--in--1');
        const indexLastBr = str.lastIndexOf('<br>');
        let lastChar = str[indexLastCloseDiv - 1];
        if (indexLastBr !== -1 && (indexLastBr + 4) === indexLastCloseDiv){
          lastChar = ' ';
        }
        if (indexLastCloseDiv !== -1){
          str = str.slice(0, indexLastCloseDiv - 1) + str.slice(indexLastCloseDiv);
        }
        else {
          str = str.slice(0, str.length - 1);
        }
        this.pages[this.currentPage - 1].htmlContent = str;

        if (this.pages[this.currentPage].htmlContent){
          this.pages[this.currentPage].htmlContent = lastChar + this.pages[this.currentPage].htmlContent;
        }
        else{
          this.pages[this.currentPage].htmlContent = lastChar;
        }
      }

      let element = null;
      for (let i = 0; i < this.pages.length; i++) {
        element = document.getElementById('content-' + i);
        element.innerHTML = this.pages[i].htmlContent;
      }
      this.runAfterViewChecked = false;
    }
  }

  // utils
  getRandomID() {
    return ( Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  }
}
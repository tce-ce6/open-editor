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
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2
  ){
  }
  ngAfterViewInit(): void{
    // console.log('after view init');
  }

  ngOnInit(): void{
    // console.log('init');
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
    mywindow.document.write("<style type='text/css'>.content{font-family:sans-serif;margin: 0px auto;}mcq-view{position: relative;margin: 0px;transition: all 0.5s ease;}#qtext{margin:5px;}.mcqBtn{user-select: none;cursor: pointer;}.cbox{cursor: pointer;}.mcq-option{position: relative;margin: 5px;}.mcqLayout1{display: inline-block;}.mcqLayout2{display: block;}.toggleBtn{position: absolute;right: 0;border: 0;background: orange;} .noprint{ display:none;}</style>");
    //mywindow.document.write('<link rel="stylesheet" href="./assets/print.css" type="text/css" />');
    //mywindow.document.write( "<link rel=\"stylesheet\" href=\"./assets/print.css\" type=\"text/css\"/>" );
    mywindow.document.write('</head><body >');
    mywindow.document.write(printContents);
    mywindow.document.write('</body></html>');
    mywindow.document.close();
    mywindow.focus();
    mywindow.print();
    mywindow.close();
  }

  clickPage(i: any): void {
    this.currentPage = i;
  }
  removePage(i: any): void{
    const ele  =  document.getElementById('page-' + i);
    ele.remove();
    this.pages.splice(i);
  }
  insertPagebreak(): void{
    console.log('this.currentPage', this.currentPage);
    const ele  =  document.getElementById('content-' + this.currentPage);
    ele.innerHTML += ('<div class="pageBreak" style="color:lightgray; page-break-after: always;">----------page break-----------</div> ');
  }

  insertTemplate(): void{
    // const componentFactory2 = this.componentFactoryResolver.resolveComponentFactory(QptitleComponent);
    // const componentRef2 = this.feedbackModal.createComponent(componentFactory2);
    // const ele2  =  document.getElementById('content-' + this.currentPage);
    // this.renderer.appendChild(ele2, componentRef2.location.nativeElement);

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(McqComponent);
    const componentRef = this.feedbackModal.createComponent(componentFactory);
    const ele  =  document.getElementById('content-' + this.currentPage);
    this.renderer.appendChild(ele, componentRef.location.nativeElement);
  }

  inputContent(e, char, i): void {
    // console.log("e--", e.charCode);
    const element = document.getElementById('content-' + i);
    if (e.keyCode === 13) {
      // e.preventDefault();
      // const text = element.innerHTML.replace('<div><br></div>', '');
      // element.innerHTML = text;
    }

    const heightContent = element.offsetHeight * 2.54 / 96; // Convert pixels to cm
    this.pages[i].htmlContent = element.innerHTML;
    console.log('--in--', element.innerHTML);
    if (Number(heightContent.toFixed(1)) > this.sizePage.height) {
      console.log('--in--1');
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
        console.log("--in--1");
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
}
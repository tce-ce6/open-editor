import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mcq',
  templateUrl: './mcq.component.html',
  styleUrls: ['./mcq.component.scss']
})
export class McqComponent implements OnInit {
  @Input() item = 'place holder for question text?';
  public isToggle = true;
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(): void{
    alert("submit")
  }
  layout(): void{
    if (!this.isToggle){
      this.isToggle = true;
    }else{
      this.isToggle = false;
    }
  }

}

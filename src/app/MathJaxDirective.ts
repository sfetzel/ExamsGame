/* 
 * This directive is used to insert MathJax code into Angular. It is
 * necessary, because once inserted, MathJax has to process the new
 * code. The directive watches changes and tells MathJax to reprocess the content
 * source: http://ruinshe.moe/2016/05/31/support-mathjax-in-angular2/
 */
 

import {Directive, ElementRef, OnChanges, Input} from "@angular/core";
// new style of importing

declare var MathJax: {
  Hub: {
    Queue: (param: Object[]) => void;
  }
}

@Directive({selector: '[mathJax]'})
export class MathJaxDirective implements OnChanges
{
    @Input("mathJax")
    private value: string = "";

    constructor(private element: ElementRef) {}

    ngOnChanges()
    {
        this.element.nativeElement.innerHTML = this.value;
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.element.nativeElement]);
    }
}

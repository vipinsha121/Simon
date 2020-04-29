declare var $;

import { ElementRef } from '@angular/core';

export function scrollTop(el: ElementRef) {
    setTimeout(() => {
        let $dlg = $(el.nativeElement);
        let $wrapper = $dlg.find(".ui-dialog");
        let $content = $dlg.find(".ui-dialog-content");

        $wrapper.scrollTop(0);
        $content.scrollTop(0);
    }, 0);
}
export function setHeight(el: ElementRef)
{
    
    setTimeout(() => {
        let $formEl = $(el.nativeElement);
        let $form = $formEl.find('.dialogForm');
          $form.attr('height','500px');
    }, 0);
}

export function removeScrolling()
{
    window.document.body.classList.add('modal-open');

}

export function addScrolling()
{
    window.document.body.classList.remove('modal-open');
}
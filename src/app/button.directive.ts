import {
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Directive({
  selector: `button`,
})
export class ButtonDirective implements OnChanges {
  private spinner!: ComponentRef<MatProgressSpinner> | null;

  @Input() loading = false;
  @Input() disabled = false;
  @Input() color: ThemePalette;

  constructor(
    private matButton: MatButton,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['loading']) {
      return;
    }

    if (changes['loading'].currentValue) {
      this.matButton._elementRef.nativeElement.classList.add('button-loading');
      this.matButton.disabled = true;
      this.createSpinner();
    } else if (!changes['loading'].firstChange) {
      this.matButton._elementRef.nativeElement.classList.remove(
        'button-loading'
      );
      this.matButton.disabled = this.disabled;
      this.destroySpinner();
    }
  }

  private createSpinner(): void {
    if (!this.spinner) {
      this.spinner = this.viewContainerRef.createComponent(MatProgressSpinner);
      this.spinner.instance.color = this.color;
      this.spinner.instance.diameter = 20;
      this.spinner.instance.mode = 'indeterminate';
      this.renderer.appendChild(
        this.matButton._elementRef.nativeElement,
        this.spinner.instance._elementRef.nativeElement
      );
    }
  }

  private destroySpinner(): void {
    if (this.spinner) {
      this.spinner.destroy();
      this.spinner = null;
    }
  }
}

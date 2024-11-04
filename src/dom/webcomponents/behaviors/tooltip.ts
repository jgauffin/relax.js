import { Behavior } from '../Behavior';

export class TooltipBehavior implements Behavior {
  private static tooltipElement: HTMLElement;
  private tooltipText: string;

  constructor(tooltipText: string) {
    this.tooltipText = tooltipText;

    // Create the shared tooltip element if it doesn’t exist
    if (!TooltipBehavior.tooltipElement) {
      TooltipBehavior.tooltipElement = document.createElement('div');
      TooltipBehavior.tooltipElement.className = 'tooltip';
      TooltipBehavior.tooltipElement.style.position = 'absolute';
      TooltipBehavior.tooltipElement.style.background = 'black';
      TooltipBehavior.tooltipElement.style.color = 'white';
      TooltipBehavior.tooltipElement.style.padding = '5px';
      TooltipBehavior.tooltipElement.style.borderRadius = '4px';
      TooltipBehavior.tooltipElement.style.display = 'none';
      TooltipBehavior.tooltipElement.style.pointerEvents = 'none';
      document.body.appendChild(TooltipBehavior.tooltipElement);
    }
  }
  updated(element: HTMLElement): void {
    console.log(element);
  }

  attach(element: HTMLElement): void {
    element.addEventListener('mouseenter', this.showTooltip);
    element.addEventListener('mousemove', this.moveTooltip);
    element.addEventListener('mouseleave', this.hideTooltip);
  }

  detach(element: HTMLElement): void {
    element.removeEventListener('mouseenter', this.showTooltip);
    element.removeEventListener('mousemove', this.moveTooltip);
    element.removeEventListener('mouseleave', this.hideTooltip);
  }

  private showTooltip = (): void => {
    TooltipBehavior.tooltipElement.textContent = this.tooltipText;
    TooltipBehavior.tooltipElement.style.display = 'block';
  };

  private moveTooltip = (event: MouseEvent): void => {
    TooltipBehavior.tooltipElement.style.left = `${event.pageX + 10}px`;
    TooltipBehavior.tooltipElement.style.top = `${event.pageY + 10}px`;
  };

  private hideTooltip = (): void => {
    TooltipBehavior.tooltipElement.style.display = 'none';
  };
}

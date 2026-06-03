import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `
    <div class="frame">
      <router-outlet />
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      height: 100dvh;
      padding: 0.5rem;
      box-sizing: border-box;
      background: #f0f9ff;
    }

    .frame {
      width: 100%;
      max-width: 480px;
      height: 100%;
      max-height: 900px;
    }
  `]
})
export class App {}

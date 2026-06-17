import { Component } from '@angular/core';
import { ChatInterfaceComponent } from './chat-interface/chat-interface.component';
import { GovernanceDetailsComponent } from './governance-details/governance-details.component';
import { ChatHistoryWebsocketService } from './services/chat-history-websocket.service';

@Component({
  selector: 'app-root',
  imports: [ChatInterfaceComponent, GovernanceDetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private readonly chatHistoryWebsocketService: ChatHistoryWebsocketService,
  ) {
    void this.chatHistoryWebsocketService;
  }

  title = 'MainApp';
}

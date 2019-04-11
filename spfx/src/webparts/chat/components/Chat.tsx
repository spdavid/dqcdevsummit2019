import * as React from 'react';
import styles from './Chat.module.scss';
import { IChatProps } from './IChatProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as signalR from '@aspnet/signalr';
import { HttpClient } from '@microsoft/sp-http';

export interface IChatState {
  username: string;
  newMessage: string;
  messages: Array<any>;
  ready: boolean;
}




export default class Chat extends React.Component<IChatProps, IChatState> {

  public connection: signalR.HubConnection;
  private apiBaseUrl = 'http://localhost:7071';
  private counter = 0;
  private currentText = "";
  private currentMessages = [];

  constructor(props: IChatProps) {
    super(props);

    this.state = {
      username: '',
      newMessage: '',
      messages: [],
      ready: false
    };


  }

  public componentDidMount() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiBaseUrl}/api`)
      .configureLogging(signalR.LogLevel.Trace)
      .build();


    this.connection.on('newMessage', this.newMessage);


    this.connection.start()
      .then(() => this.setState({ ready: true }))
      .catch(console.error);

    console.log(this.connection);
  }

  public newMessage = (message) => {
    console.log(message);
    message.id = this.counter++; // vue transitions need an id
    this.currentMessages.unshift(message);
    this.setState({messages : this.currentMessages});
  }

  public  sendMessage = async () => {

    let body = JSON.stringify({
      sender: "david",
      text: this.currentText
    });

    let response = await this.props.ctx.httpClient.post(`${this.apiBaseUrl}/api/messages`, HttpClient.configurations.v1, { body: body, headers : {"Content-Type": "application/json", "Accept" : "application/json;odata=verbose"} });

  }

  private textChanged = (e) => {
    this.currentText = e.target.value;
  }

  public render(): React.ReactElement<IChatProps> {
    return (
      <div id="app" className="container">
        <h3>Serverless chat</h3>
        <div className="row">
          <div className="signalr-demo col-sm">
            <hr />
            <form onSubmit={e => { e.preventDefault(); this.sendMessage(); }} >
              <input onChange={this.textChanged} type="text" id="message-box" className="form-control" placeholder="Type message here..." />
            </form>
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <div>Loading...</div>
          </div>
        </div>
        <div >
          {this.state.messages.map(message => {
            return (<div key={message.id} className="row">
              <div className="col-sm">
                <hr />
                <div>
                  <div style={{ display: "inline-block", paddingLeft: "12px" }}>
                    <div>
                      <span className="text-info small"><strong>{ message.sender }</strong></span>
                    </div>
                    <div>
                      {message.text}
                    </div>
                  </div>
                </div>
              </div>
            </div>);
          })}
        </div>
      </div>
    );
  }
}

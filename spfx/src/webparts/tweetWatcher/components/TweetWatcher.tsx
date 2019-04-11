import * as React from 'react';
import styles from './TweetWatcher.module.scss';
import { ITweetWatcherProps } from './ITweetWatcherProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as signalR from '@aspnet/signalr';

export interface ITweetWatcherState {
  tweets: Array<any>;
}

export default class TweetWatcher extends React.Component<ITweetWatcherProps, ITweetWatcherState> {
  public connection: signalR.HubConnection;
  private apiBaseUrl = 'http://localhost:7071';
  private tweets = [
    ];


  constructor(props: ITweetWatcherProps) {
    super(props);

    this.state = {
      tweets: this.tweets
    };

  }

  public componentDidMount() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiBaseUrl}/api`)
      .configureLogging(signalR.LogLevel.Trace)
      .build();

    this.connection.on('tweet', this.catchTweet);

    this.connection.start()
      .then(() => console.log("Connected"))
      .catch(console.error);
  }

  public catchTweet = (info) => {
    console.log(info);
    this.tweets.unshift(info);
    this.setState({ tweets: this.tweets });

  }

  public render(): React.ReactElement<ITweetWatcherProps> {
    return (
      <div id={styles.twitterApp}>
      <div className={styles.hashTag}>
            #DQCDevSummit
           </div>
           <div className={styles.followme}>
             follow me <span className={styles.twitterBlue}>@SharePointDavid</span>
           </div>
          <div className={styles.tweetCount}>Tweet Count: {this.state.tweets.length} </div>
        {this.state.tweets.map(tweet => {
          return <div className={styles.tweetContainer}>
            <div className={styles.tweetUser}>
              <img height="12px" src="https://davidclarkcause.com/wp-content/uploads/2015/05/twitter.jpg.png"></img>@{tweet.UserName}</div>
            <div>
                {tweet.Text}
            </div>
          </div>;
        })}
      </div>
    );
  }
}

import * as React from 'react';
import styles from './AgiCorpIntranemInterim.module.scss';
import { IAgiCorpIntranemInterimProps } from './IAgiCorpIntranemInterimProps';
import {IAgiCorpIntranemInterimState} from './IAgiCorpIntranemInterimState';

import { escape } from '@microsoft/sp-lodash-subset';

export default class AgiCorpIntranemInterim extends React.Component<IAgiCorpIntranemInterimProps, IAgiCorpIntranemInterimState> {
public async componentDidMount(): Promise<void> {
  this.fetchData();
}

private async fetchData(){

}

  public render(): React.ReactElement<IAgiCorpIntranemInterimProps> {
    
    return (
     <div></div>
    );
  }
}

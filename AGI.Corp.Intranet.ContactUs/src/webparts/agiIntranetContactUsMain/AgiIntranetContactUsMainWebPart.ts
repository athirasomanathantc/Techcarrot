import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AgiIntranetContactUsMainWebPartStrings';
import AgiIntranetContactUsMain from './components/AgiIntranetContactUsMain';
import { IAgiIntranetContactUsMainProps } from './components/IAgiIntranetContactUsMainProps';
import { MSGraphClient } from '@microsoft/sp-http';

export interface IAgiIntranetContactUsMainWebPartProps {
  description: string;
}

export default class AgiIntranetContactUsMainWebPart extends BaseClientSideWebPart<IAgiIntranetContactUsMainWebPartProps> {

  private graphClient: MSGraphClient;

  // public onInit(): Promise<void> {
  //   return new Promise<void>((resolve: () => void, reject: (error: any) => void): void => {
  //     this.context.msGraphClientFactory
  //      // .getClient()
  //       .then((client: MSGraphClient): void => {
  //         this.graphClient = client;
  //         resolve();
  //       }, err => reject(err));
  //   });
  // }

  public render(): void {
    const element: React.ReactElement<IAgiIntranetContactUsMainProps> = React.createElement(
      AgiIntranetContactUsMain,
      {
        description: this.properties.description,
        graphClient: this.graphClient,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

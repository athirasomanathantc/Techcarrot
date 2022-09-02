import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as strings from 'AgiIntranetSnapAndShareWebPartStrings';
import AgiIntranetSnapAndShare from './components/AgiIntranetSnapAndShare';
import { IAgiIntranetSnapAndShareProps } from './components/IAgiIntranetSnapAndShareProps';

export interface IAgiIntranetSnapAndShareWebPartProps {
  description: string;
}

export default class AgiIntranetSnapAndShareWebPart extends BaseClientSideWebPart<IAgiIntranetSnapAndShareWebPartProps> {

  protected onInit(): Promise<void> {
    const randomNumber = Math.floor(Math.random()*90000) + 10000;
    SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/css/snapandshare.css?${randomNumber}`);
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IAgiIntranetSnapAndShareProps> = React.createElement(
      AgiIntranetSnapAndShare,
      {
        description: this.properties.description,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
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

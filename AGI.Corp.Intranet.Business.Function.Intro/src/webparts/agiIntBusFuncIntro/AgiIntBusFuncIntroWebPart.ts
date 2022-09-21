import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AgiIntBusFuncIntroWebPartStrings';
import AgiIntBusFuncIntro from './components/AgiIntBusFuncIntro';
import { IAgiIntBusFuncIntroProps } from './components/IAgiIntBusFuncIntroProps';
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface IAgiIntBusFuncIntroWebPartProps {
  description: string;
}

export default class AgiIntBusFuncIntroWebPart extends BaseClientSideWebPart<IAgiIntBusFuncIntroWebPartProps> {

  protected onInit(): Promise<void> {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/css/business.css?${randomNumber}`);
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IAgiIntBusFuncIntroProps> = React.createElement(
      AgiIntBusFuncIntro,
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

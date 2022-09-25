import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AgiIntBusFuncServiceWebPartStrings';
import AgiIntBusFuncService from './components/AgiIntBusFuncService';
import { IAgiIntBusFuncServiceProps } from './components/IAgiIntBusFuncServiceProps';

export interface IAgiIntBusFuncServiceWebPartProps {
  description: string;
}

export default class AgiIntBusFuncServiceWebPart extends BaseClientSideWebPart<IAgiIntBusFuncServiceWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAgiIntBusFuncServiceProps> = React.createElement(
      AgiIntBusFuncService,
      {
        description: this.properties.description
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

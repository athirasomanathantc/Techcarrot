import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AgiIntranetHomeMainWebPartStrings';
import AgiIntranetHomeMain from './components/AgiIntranetHomeMain';
import { IAgiIntranetHomeMainProps } from './components/IAgiIntranetHomeMainProps';

export interface IAgiIntranetHomeMainWebPartProps {
  description: string;
}

export default class AgiIntranetHomeMainWebPart extends BaseClientSideWebPart<IAgiIntranetHomeMainWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAgiIntranetHomeMainProps> = React.createElement(
      AgiIntranetHomeMain,
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

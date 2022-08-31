import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'AgiIntranetHomeMainWebPartStrings';
import AgiIntranetHomeMain from './components/AgiIntranetHomeMain';
import { IAgiIntranetHomeMainProps } from './components/IAgiIntranetHomeMainProps';
import { PropertyFieldNumber } from '@pnp/spfx-property-controls/lib/PropertyFieldNumber';

export interface IAgiIntranetHomeMainWebPartProps {
  description: string;
  topLatestNews: number;
  topAnnouncements: number;
}

export default class AgiIntranetHomeMainWebPart extends BaseClientSideWebPart<IAgiIntranetHomeMainWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAgiIntranetHomeMainProps> = React.createElement(
      AgiIntranetHomeMain,
      {
        description: this.properties.description,
        topLatestNews: this.properties.topLatestNews,
        topAnnouncements: this.properties.topAnnouncements,
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
                }),
                PropertyFieldNumber("topLatestNews", {
                  key: "topLatestNews",
                  label: "topLatestNews",
                  description: "No of latest news carousel items",
                  value: this.properties.topLatestNews,
                  maxValue: 50,
                  minValue: 1,
                  disabled: false
                }),
                PropertyFieldNumber("topAnnouncements", {
                  key: "topAnnouncements",
                  label: "topAnnouncements",
                  description: "No of announcement carousel items",
                  value: this.properties.topAnnouncements,
                  maxValue: 50,
                  minValue: 1,
                  disabled: false
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}

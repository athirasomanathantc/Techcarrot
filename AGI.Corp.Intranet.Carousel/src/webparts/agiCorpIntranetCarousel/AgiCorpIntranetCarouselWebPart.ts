import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as strings from 'AgiCorpIntranetCarouselWebPartStrings';
import AgiCorpIntranetCarousel from './components/AgiCorpIntranetCarousel';
import { IAgiCorpIntranetCarouselProps } from './components/IAgiCorpIntranetCarouselProps';

export interface IAgiCorpIntranetCarouselWebPartProps {
  description: string;
  listName: string;
}

export default class AgiCorpIntranetCarouselWebPart extends BaseClientSideWebPart<IAgiCorpIntranetCarouselWebPartProps> {

  protected onInit(): Promise<void> {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/css/business.css?${randomNumber}`);
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IAgiCorpIntranetCarouselProps> = React.createElement(
      AgiCorpIntranetCarousel,
      {
        description: this.properties.description,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        context: this.context,
        spHttpClient: this.context.spHttpClient,
        listName: this.properties.listName
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
                }),
                PropertyPaneTextField('listName', {
                  label: strings.ListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

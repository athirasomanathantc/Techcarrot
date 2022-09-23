import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'AgiIntBusFuncTestimonialsWebPartStrings';
import AgiIntBusFuncTestimonials from './components/AgiIntBusFuncTestimonials';
import { IAgiIntBusFuncTestimonialsProps } from './components/IAgiIntBusFuncTestimonialsProps';
import { SPComponentLoader } from '@microsoft/sp-loader';
export interface IAgiIntBusFuncTestimonialsWebPartProps {
  description: string;
  listName: string;
}

export default class AgiIntBusFuncTestimonialsWebPart extends BaseClientSideWebPart<IAgiIntBusFuncTestimonialsWebPartProps> {

  protected onInit(): Promise<void> {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/css/business.css?${randomNumber}`);
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IAgiIntBusFuncTestimonialsProps> = React.createElement(
      AgiIntBusFuncTestimonials,
      {
        description: this.properties.description,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        context: this.context,
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

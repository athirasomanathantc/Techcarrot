import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as strings from 'AgiIntranetNewsDetailsWebPartStrings';
import AgiIntranetNewsDetails from './components/AgiIntranetNewsDetails';
import { IAgiIntranetNewsDetailsProps } from './components/IAgiIntranetNewsDetailsProps';

export interface IAgiIntranetNewsDetailsWebPartProps {
  description: string;
}

export default class AgiIntranetNewsDetailsWebPart extends BaseClientSideWebPart<IAgiIntranetNewsDetailsWebPartProps> {

  protected onInit(): Promise<void> {

    const randomNumber = Math.floor(Math.random()*90000) + 10000;
    SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/css/news.css?${randomNumber}`);

    SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
    SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/bootstrap/bootstrap.min.css`);
    SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/bootstrap/bootstrap-icons.min.css`);
    SPComponentLoader.loadScript(`${this.context.pageContext.web.absoluteUrl}/Assets/bootstrap/bootstrap.bundle.min.js`);

    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IAgiIntranetNewsDetailsProps> = React.createElement(
      AgiIntranetNewsDetails,
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

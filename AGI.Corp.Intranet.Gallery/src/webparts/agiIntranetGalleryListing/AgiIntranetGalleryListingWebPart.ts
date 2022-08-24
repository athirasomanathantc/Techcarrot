import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AgiIntranetGalleryListingWebPartStrings';
import AgiIntranetGalleryListing from './components/AgiIntranetGalleryListing';
import { IAgiIntranetGalleryListingProps } from './components/IAgiIntranetGalleryListingProps';

import { IAgiIntranetGalleryListingState } from './components/IAgiIntranetGalleryListingState';
import { PROP_DEFAULT_ORDERBY } from './common/constants';

export interface IAgiIntranetGalleryListingWebPartProps {
  description: string;
  libraryName: string;
  libraryPath: string;
  orderBy: string;
}

export default class AgiIntranetGalleryListingWebPart extends BaseClientSideWebPart<IAgiIntranetGalleryListingWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAgiIntranetGalleryListingProps> = React.createElement(
      AgiIntranetGalleryListing,
      {
        description: this.properties.description,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        context: this.context,
        libraryName: this.properties.libraryName,
        libraryPath: this.properties.libraryPath,
        orderBy: this.properties.orderBy
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
                PropertyPaneTextField('libraryName', {
                  label: strings.LibraryNameFieldLabel
                }),
                PropertyPaneTextField('libraryPath', {
                  label: strings.LibraryPathFieldLabel
                }),
                PropertyPaneTextField('orderBy', {
                  label: strings.OrderByFieldLabel,
                  value: PROP_DEFAULT_ORDERBY
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'AgiIntranetAboutMainWebPartStrings';
import AgiIntranetAboutMain from './components/AgiIntranetAboutMain';
import { IAgiIntranetAboutMainProps } from './components/IAgiIntranetAboutMainProps';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as jquery from "jquery";
require("jqueryui");
require("AGIAbout");

export interface IAgiIntranetAboutMainWebPartProps {
  description: string;
}

export default class AgiIntranetAboutMainWebPart extends BaseClientSideWebPart<IAgiIntranetAboutMainWebPartProps> {
  
  public constructor() {
    super();
    SPComponentLoader.loadCss("// code.jquery.com/ui/1.12.0/themes/smoothness/jquery-ui.css");
  }
  public render(): void {
    const element: React.ReactElement<IAgiIntranetAboutMainProps> = React.createElement(
      AgiIntranetAboutMain,
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

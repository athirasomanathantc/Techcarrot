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
  protected onInit(): Promise<void> {
    const randomNumber = Math.floor(Math.random()*90000) + 10000;

    
     SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
   
       SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/bootstrap/bootstrap.min.css`);
   
       SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/bootstrap/bootstrap-icons.min.css`);
   
       SPComponentLoader.loadScript(`${this.context.pageContext.web.absoluteUrl}/Assets/bootstrap/bootstrap.bundle.min.js`);
       SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/css/style.css?${randomNumber}`);
       SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/css/aboutAGI.css?${randomNumber}`);
   
   
   
       return Promise.resolve();
  }
  
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

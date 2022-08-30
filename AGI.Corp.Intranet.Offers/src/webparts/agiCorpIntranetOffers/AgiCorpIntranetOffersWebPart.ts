import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'AgiCorpIntranetOffersWebPartStrings';
import AgiCorpIntranetOffers from './components/AgiCorpIntranetOffers';
import { IAgiCorpIntranetOffersProps } from './components/IAgiCorpIntranetOffersProps';
import { SPComponentLoader } from '@microsoft/sp-loader';
export interface IAgiCorpIntranetOffersWebPartProps {
  description: string;
}

export default class AgiCorpIntranetOffersWebPart extends BaseClientSideWebPart<IAgiCorpIntranetOffersWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  protected onInit(): Promise<void> {
    const randomNumber = Math.floor(Math.random()*90000) + 10000;

    SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/css/rewards.css?${randomNumber}`);
     SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
   
       SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/bootstrap/bootstrap.min.css`);
   
       SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/bootstrap/bootstrap-icons.min.css`);
   
       SPComponentLoader.loadScript(`${this.context.pageContext.web.absoluteUrl}/Assets/bootstrap/bootstrap.bundle.min.js`);
   
   
   
       return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IAgiCorpIntranetOffersProps> = React.createElement(
      AgiCorpIntranetOffers,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        siteURL: this.context.pageContext.web.absoluteUrl,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

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

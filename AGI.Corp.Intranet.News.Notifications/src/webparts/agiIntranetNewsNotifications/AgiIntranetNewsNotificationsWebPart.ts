import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'AgiIntranetNewsNotificationsWebPartStrings';
import AgiIntranetNewsNotifications from './components/AgiIntranetNewsNotifications';
import { IAgiIntranetNewsNotificationsProps } from './components/IAgiIntranetNewsNotificationsProps';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';
import { ISPLists } from '@pnp/spfx-property-controls';
import { SPHttpClient } from '@microsoft/sp-http';
import PnPTelemetry from "@pnp/telemetry-js";

export interface IAgiIntranetNewsNotificationsWebPartProps {
  lists: string[];
}

export default class AgiIntranetNewsNotificationsWebPart extends BaseClientSideWebPart<IAgiIntranetNewsNotificationsWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  private _lists: any;

  public render(): void {
    const element: React.ReactElement<IAgiIntranetNewsNotificationsProps> = React.createElement(
      AgiIntranetNewsNotifications,
      {
        lists: this.properties.lists,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/css/notifications.css?${randomNumber}`);
    // return Promise.resolve();

    const telemetry = PnPTelemetry.getInstance();
    telemetry.optOut();

    this._getLists()
      .then((response: any) => {
        this._lists = response.value.map((list: any) => {
          return {
            key: list.Title,
            text: list.Title
          };
        });
      });
    return Promise.resolve();
    // return super.onInit();
  }
  private _getLists(): Promise<ISPLists> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + "/_api/web/lists", SPHttpClient.configurations.v1)
      .then((response: any) => {
        return response.json();
      });
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

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

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
                PropertyFieldMultiSelect('lists', {
                  key: 'lists',
                  label: "Lists",
                  options: this._lists,
                  selectedKeys: this.properties.lists
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

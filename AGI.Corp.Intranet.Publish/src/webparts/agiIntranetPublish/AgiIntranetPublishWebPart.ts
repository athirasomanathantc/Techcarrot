import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, DisplayMode } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'AgiIntranetPublishWebPartStrings';
import AgiIntranetPublish from './components/AgiIntranetPublish';
import { IAgiIntranetPublishProps } from './components/IAgiIntranetPublishProps';
import { PropertyFieldPeoplePicker, IPropertyFieldGroupOrPerson, PrincipalType } from '@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";


export interface IAgiIntranetPublishWebPartProps {
  description: string;
  groups: IPropertyFieldGroupOrPerson[];
}

export default class AgiIntranetPublishWebPart extends BaseClientSideWebPart<IAgiIntranetPublishWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    if (
      this.displayMode === DisplayMode.Edit &&
      this.properties.groups.length === 0
    ) {
      const placeHolderElement = React.createElement(Placeholder, {
        iconName: "Edit",
        iconText: "Configure your web part",
        description: "Please configure the web part.",
        buttonLabel: "Configure",
        onConfigure: this._onConfigure,
      });
      ReactDom.render(placeHolderElement, this.domElement);
    } else {
      const element: React.ReactElement<IAgiIntranetPublishProps> = React.createElement(
        AgiIntranetPublish,
        {
          pageContext: this.context.pageContext,
          groupIds: this.properties.groups,
          description: this.properties.description,
        }
      );
      ReactDom.render(element, this.domElement);
    }
  }

  protected _onConfigure = () => {
    // Context of the web part
    this.context.propertyPane.open();
  }

  protected onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();

    return super.onInit();
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyFieldPeoplePicker('groups', {
                  label: 'Target Audience',
                  initialData: this.properties.groups,
                  allowDuplicate: false,
                  principalType: [PrincipalType.SharePoint],
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  context: this.context,
                  properties: this.properties,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'peopleFieldId'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

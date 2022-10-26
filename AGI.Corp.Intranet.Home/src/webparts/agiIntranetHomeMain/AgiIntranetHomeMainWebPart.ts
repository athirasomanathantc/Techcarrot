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
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface IAgiIntranetHomeMainWebPartProps {
  description: string;
  topLatestNews: number;
  topAnnouncements: number;
  topSnaps: number;
  topNavigations: number;
  topMyApps: number;
  topRewards: number;
  topEvents: number;
  topSurveyQuestions: number;
}

export default class AgiIntranetHomeMainWebPart extends BaseClientSideWebPart<IAgiIntranetHomeMainWebPartProps> {

  protected onInit(): Promise<void> {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/css/snapandshare.css?${randomNumber}`);
    SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/css/style.css?${randomNumber}`);
    SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/css/home.css?${randomNumber}`);
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IAgiIntranetHomeMainProps> = React.createElement(
      AgiIntranetHomeMain,
      {
        ...this.properties,
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
                PropertyFieldNumber("topSnaps", {
                  key: "topSnaps",
                  label: "topSnaps",
                  description: "No of snap items",
                  value: this.properties.topSnaps,
                  maxValue: 50,
                  minValue: 1,
                  disabled: false
                }),
                PropertyFieldNumber("topNavigations", {
                  key: "topNavigations",
                  label: "topNavigations",
                  description: "No of navigation items",
                  value: this.properties.topNavigations,
                  maxValue: 50,
                  minValue: 1,
                  disabled: false
                }),
                PropertyFieldNumber("topMyApps", {
                  key: "topMyApps",
                  label: "topMyApps",
                  description: "No of myapps items",
                  value: this.properties.topMyApps,
                  maxValue: 50,
                  minValue: 1,
                  disabled: false
                }),
                PropertyFieldNumber("topRewards", {
                  key: "topRewards",
                  label: "topRewards",
                  description: "No of rewards items",
                  value: this.properties.topRewards,
                  maxValue: 50,
                  minValue: 1,
                  disabled: false
                }),
                PropertyFieldNumber("topEvents", {
                  key: "topEvents",
                  label: "topEvents",
                  description: "No of event items",
                  value: this.properties.topEvents,
                  maxValue: 50,
                  minValue: 1,
                  disabled: false
                }),
                PropertyFieldNumber("topSurveyQuestions", {
                  key: "topSurveyQuestions",
                  label: "topSurveyQuestions",
                  description: "No of survey questions",
                  value: this.properties.topSurveyQuestions,
                  maxValue: 50,
                  minValue: 1,
                  disabled: false
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

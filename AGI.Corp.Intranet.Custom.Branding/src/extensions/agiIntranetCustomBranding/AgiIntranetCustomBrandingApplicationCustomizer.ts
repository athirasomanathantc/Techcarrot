import * as React from 'react';
import * as ReactDOM from "react-dom";
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';
import * as strings from 'AgiIntranetCustomBrandingApplicationCustomizerStrings';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { IIntranetHeaderProps } from './components/IntranetHeader/IntranetHeaderProps';
import { IIntranetFooterProps } from './components/IntranetFooter/IntranetFooterProps';
import IntranetFooter from './components/IntranetFooter/IntranetFooter';
import IntranetHeader from './components/IntranetHeader/IntranetHeader';

require("AGIIntranet");

const LOG_SOURCE: string = 'AgiIntranetBrandingApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IAgiIntranetBrandingApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
  showManagers: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class AgiIntranetBrandingApplicationCustomizer
  extends BaseApplicationCustomizer<IAgiIntranetBrandingApplicationCustomizerProperties> {
  private _bottomPlaceholder: PlaceholderContent | undefined;
  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    SPComponentLoader.loadCss(`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css`);
    SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/bootstrap/bootstrap.min.css`);
    SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/bootstrap/bootstrap-icons.min.css`);
    SPComponentLoader.loadScript(`${this.context.pageContext.web.absoluteUrl}/Assets/bootstrap/bootstrap.bundle.min.js`);
    SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/css/style.css?${randomNumber}`);

    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    let message: string = this.properties.testMessage;
    if (!message) {
      message = '(No properties were provided.)';
    }

    //Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`);

    // Render header
    const flagTop = ((location.href.indexOf(`${this.context.pageContext.web.absoluteUrl}/SitePages`) != -1 &&
      location.href.indexOf(`${this.context.pageContext.web.absoluteUrl}/SitePages/Forms`) == -1 &&
      location.href.indexOf(`${this.context.pageContext.web.absoluteUrl}/Lists`) == -1)
      ||
      (
        location.href == `${this.context.pageContext.web.absoluteUrl}` ||
        location.href == `${this.context.pageContext.web.absoluteUrl}/`
      )
    )

    if (flagTop) {
      // SPComponentLoader.loadCss(`${this.context.pageContext.web.absoluteUrl}/Assets/css/style.css`);
      this._renderTopPlaceHolder();
    }

    // Render footer
    const flagBottom =
      (
        (
          location.href.indexOf(`${this.context.pageContext.web.absoluteUrl}/SitePages`) != -1 &&
          location.href.indexOf(`${this.context.pageContext.web.absoluteUrl}/SitePages/Forms`) == -1 &&
          location.href.indexOf(`${this.context.pageContext.web.absoluteUrl}/Lists`) == -1
        )
        ||
        (
          location.href == `${this.context.pageContext.web.absoluteUrl}` ||
          location.href == `${this.context.pageContext.web.absoluteUrl}/`
        )
      );

    console.log('konowmore', `${this.context.pageContext.web.absoluteUrl}/SitePages/KnowMore.aspx`);
    console.log('knowmore', location.href.indexOf(`${this.context.pageContext.web.absoluteUrl}/SitePages/Home.aspx`));
    console.log('flagbootm', flagBottom);

    if (flagBottom) {
      this._renderBottomPlaceHolder();
    }

    return Promise.resolve();
  }

  private async _renderTopPlaceHolder(): Promise<void> {

    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }

      const element: React.ReactElement<IIntranetHeaderProps> = React.createElement(
        IntranetHeader,
        {
          siteUrl: this.context.pageContext.web.absoluteUrl,
          context: this.context,
          spHttpClient: this.context.spHttpClient,
          showManagers: 'all'
        }
      );

      ReactDOM.render(element, this._topPlaceholder.domElement);

      const checkElement = async selector => {
        while (document.querySelector(selector) === null) {
          await new Promise(resolve => requestAnimationFrame(resolve))
        }
        return document.querySelector(selector);
      };

      checkElement('#agiCustomLogo').then((element: HTMLElement) => {
        console.log('check logo');
        const parentDiv = document.getElementById('O365_NavHeader');
        parentDiv.prepend(element);
      });

      checkElement('#navbar').then((element: HTMLElement) => {
        // const parentDivElems = document.querySelectorAll('[data-automationid="SiteHeader"]');
        const parentDivElems = document.querySelectorAll('[class^="headerRow"]');
        console.log(parentDivElems && parentDivElems.length);
        if (parentDivElems && parentDivElems.length > 0) {
          const parentDiv = parentDivElems[0];
          parentDiv.append(element);
        }

      });

    }

  }

  private async _renderBottomPlaceHolder(): Promise<void> {
    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._bottomPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }

      const element: React.ReactElement<IIntranetFooterProps> = React.createElement(
        IntranetFooter,
        {
          siteUrl: this.context.pageContext.web.absoluteUrl,
          context: this.context,
          spHttpClient: this.context.spHttpClient
        }
      );

      const checkElement = async selector => {
        while (document.querySelector(selector) === null) {
          await new Promise(resolve => requestAnimationFrame(resolve))
        }
        return document.querySelector(selector);
      };

      checkElement('.ALG-Footer-Class').then((selector) => {
        console.log("selector" + selector);
        ReactDOM.render(element, document.getElementById('ALG-Footer-Id'));
      });

    }
  }


  private async _renderPlaceHolders(): Promise<void> {
    const userId = this.context.pageContext.legacyPageContext.userId;
    const userEmail = this.context.pageContext.legacyPageContext.userPrincipalName;

    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }

      const element: React.ReactElement<IIntranetHeaderProps> = React.createElement(
        IntranetHeader,
        {
          siteUrl: this.context.pageContext.web.absoluteUrl,
          context: this.context,
          spHttpClient: this.context.spHttpClient,
          showManagers: this.properties.showManagers
        }
      );

      ReactDOM.render(element, this._topPlaceholder.domElement)

    }


    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );

      if (!this._bottomPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }

      const element: React.ReactElement<IIntranetFooterProps> = React.createElement(
        IntranetFooter,
        {
          siteUrl: this.context.pageContext.web.absoluteUrl,
          context: this.context,
          spHttpClient: this.context.spHttpClient
        }
      );

      const checkElement = async selector => {
        while (document.querySelector(selector) === null) {
          await new Promise(resolve => requestAnimationFrame(resolve))
        }
        return document.querySelector(selector);
      };

      checkElement('.ALG-Footer-Class').then((selector) => {
        //console.log("selector" + selector);
        ReactDOM.render(element, document.getElementById('ALG-Footer-Id'));
      });

      // inject custom logo
      const siteUrl = this.context.pageContext.web.absoluteUrl;
      const logoElement = document.createElement('a');
      logoElement.setAttribute('data-interception', 'off');
      logoElement.setAttribute('href', siteUrl);
      const imageElement = document.createElement('img');

      ////debugger;

      checkElement('#agiCustomLogo').then((selector) => {
        console.log('check logo');
        console.log(selector);
      });

      checkElement('data-automationid="SiteHeader"').then((selector) => {
        console.log("Site Header" + selector);
      })
      //imageElement.setAttribute('src', )
      //logoElement.appendChild()  

      // <a href={this.context.pageContext.} data-interception='off' >
      //         <img src={this.state.logoURL} alt="logo" style={{ display: this.state.logoURL ? 'block' : 'none' }} />
      //       </a>


    }


  }

  private _onDispose(): void {
    console.log('[ReactHeaderFooterApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }
}

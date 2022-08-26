import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'AgiIntranetThemeApplicationCustomizerStrings';

const LOG_SOURCE: string = 'AgiIntranetThemeApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IAgiIntranetThemeApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class AgiIntranetThemeApplicationCustomizer
  extends BaseApplicationCustomizer<IAgiIntranetThemeApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    let message: string = this.properties.testMessage;
    if (!message) {
      message = '(No properties were provided.)';
    }

    console.log('theme extension');
   // Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`);

   this.manageSPContent();

    return Promise.resolve();
  }

  private manageSPContent() {

    window.addEventListener("DOMContentLoaded", function(){
      //document.getElementById("wrapper").style.display = "block";
    });

    document.body.style.display = 'block';
  
    // add temp div

    var elemDiv = document.createElement('div');
    elemDiv.style.cssText = 'position:absolute;width:100%;height:100%;opacity:0.3;z-index:100;background:#000;z-index: 10;';
    //document.body.appendChild(elemDiv);

    const checkElement = async selector => {
      while (document.querySelector(selector) === null) {
        await new Promise(resolve => requestAnimationFrame(resolve))
      }
      return document.querySelector(selector);
    };

    

    // checkElement('#SuiteNavWrapper').then((header) => {
    //   header.style.display = 'none';
    // });

    // checkElement('.spAppAndPropertyPanelContainer').then((mainContainer) => {
    //   mainContainer.style.display = 'none';
    // });

    const elems = document.getElementsByClassName('SPPageChrome');
    if(elems && elems.length > 0 ) {
      (elems[0] as any).style.display = 'none';
    }

    checkElement('#O365_NavHeader').then((mainContainer) => {
      mainContainer.style.display = 'none';
    });
    
  }
}

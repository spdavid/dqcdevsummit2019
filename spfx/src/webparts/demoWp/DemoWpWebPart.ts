import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'DemoWpWebPartStrings';
import DemoWp from './components/DemoWp';
import { IDemoWpProps } from './components/IDemoWpProps';

export interface IDemoWpWebPartProps {
  description: string;
}

export default class DemoWpWebPart extends BaseClientSideWebPart<IDemoWpWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDemoWpProps > = React.createElement(
      DemoWp,
      {
        description: this.properties.description,
        ctx : this.context
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

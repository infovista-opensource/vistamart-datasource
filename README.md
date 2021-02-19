# VistaMart datasource for Grafana 4.7+

VistaMart Datasource can be used to design dashboards with VistaMart data. It uses the VistaPortal API to query the VistaMart topology and data (using the Datamodel API)

## Summary
- [**Introduction**](#introduction)
- [**Getting Started**](#getting-started)
- [**Using the datasource**](#using-the-datasource)
- [**Contributing**](#contributing)
- [**Development**](#development)
- [**License**](#license)

## Introduction

### Overview

VistaMart Datasource is connecting to VistaMart with VistaPortal API.

### Requirements
The following software must be installed in order to use this datasource
- VistaMart 2021.03+
- VistaPortal 2021.03+

## Getting Started

### VistaPortal Configuration
A OAuth2 Client Application must be created into the VistaPortal Management Console
- Log on the VistaPortal Management Console
- Go to the "OAuth2 Client Application" section
- Create a new application by selecting a *Confidential* client type
- Mark down the 2 following important parameters : *Client ID* and *Client secret*

![Configuration example](https://github.com/infovista/vistamart-datasource/raw/master/src/images/vportal.png) 

### Datasource configuration
- Log on grafana
- Install the "VistaMart" plugin by following the instruction on [grafana.com Website](https://grafana.com/grafana/plugins)
- Create a "VistaMart" datasource
- Enter the URL of the VistaPortal API url (for example: http://ivapi:9080/api)
- Enter the *VistaPortal OAuth2 Client ID* (copied from the previous step)
- Enter the *VistaPortal OAuth2 Client Secret* (copied from the previous step)
- Click on "Save & Test"

![Configuration example](https://github.com/infovista/vistamart-datasource/raw/master/src/images/datasource.png)

## Using the datasource

### Query parameters

![Parameters example](https://github.com/infovista/vistamart-datasource/raw/master/src/images/parameters.png)

### Using variables in a dashboard

![Variables](https://github.com/infovista/vistamart-datasource/raw/master/src/images/variables.png)

![Variables](https://github.com/infovista/vistamart-datasource/raw/master/src/images/variables_editor.png)

![Variables](https://github.com/infovista/vistamart-datasource/raw/master/src/images/variables_usage.png)


## Contributing

If you have any idea for an improvement or found a bug do not hesitate to open an issue or submit a pull request.
We will appreciate any help from the community which will make working with InfoVista products and Grafana more convenient.


## Development 

see [CONTRIBUTING.md](CONTRIBUTING.md) for Development and Pull request Contributing instructions 
   
## License
Apache 2.0, please see [LICENSE](https://github.com/infovista/vistamart-datasource/blob/master/LICENSE) for details.

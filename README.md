# Infovista VistaMart datasource for Grafana 8.1.3+

VistaMart datasource is used to design dashboards with VistaMart data and it uses the VistaPortal API to query the VistaMart topology and data (using the Datamodel API)

[![License](https://img.shields.io/github/license/infovista/vistamart-datasource)](LICENSE)
[![Ci](https://github.com/infovista/vistamart-datasource/actions/workflows/ci.yml/badge.svg)]()

## Introduction

### Overview

VistaMart Datasource is connecting to VistaMart with VistaPortal API.

### Features

- Query setup
- Templates
- Table view
- SingleStat view
- Annotations

### Requirements
The following software must be installed in order to use this datasource
- VistaMart 2021.03
- VistaPortal 2021.03

## Installation

As `grafana-cli` installation is not supported, installation must be done manually.

- Go to the [GitHub Releases page](https://github.com/infovista/vistamart-datasource/releases)
- Download the latest 'infovista-vistamart-datasource-2021.3' zip file
- Unzip the file under the grafana installation folder under the data/plugins folder (in order to have a `<installation dir>/data/plugins/infovista-vistamart-datasource` folder)
- Restart grafana server
- You should find a "Infovista VistaMart" plugin in the available plugins

## Getting Started

### VistaPortal Configuration
A OAuth2 Client Application must be created into the VistaPortal Management Console
- Log on the VistaPortal Management Console
- Go to the "OAuth2 Client Application" section
- Create a new application by selecting the client type *Confidential*
- Mark down the 2 following important parameters : *Client ID* and *Client secret*

![Configuration example](https://github.com/infovista/vistamart-datasource/blob/master/src/images/vportal.png?raw=true) 

### Datasource configuration
- Log on grafana
- Create a "Infovista VistaMart" datasource
- Enter the URL of the VistaPortal API url (for example: http://ivapi:9080/api)
- Enter the *VistaPortal OAuth2 Client ID* (copied from the "VistaPortal Configuration" step)
- Enter the *VistaPortal OAuth2 Client Secret* (copied from the "VistaPortal Configuration" step)
- Click on "Save & Test"

![Configuration example](https://github.com/infovista/vistamart-datasource/blob/master/src/images/datasource.png?raw=true)

## Using the datasource

### Query parameters

The query parameters are used to identify the right VistaMart started slots in the database. These parameters are divided into 3 parts.

* Main Parameters (Mandatory for all use cases):
  * *VISTA*: Indicates the indicator vista (based on the list of top vistas available in the VistaMart topology)
  * *INDICATOR*: Indicates the indicator (based on the list of indicators available in the VistaMart topology filtered by the selected vista)
  * *INSTANCE*: Indicates the instance (based on the list of instances available in the VistaMart topology filtered by the selected vista)
  * *DISPLAY RATE*: Indicates the slot display rate (based on the started slots for the selected indicator and instance)
  * *PROPERTY 1* & *PROPERTY VALUE 1*: Additional slots filtering based on a property and its property value
  * *PROPERTY 2* & *PROPERTY VALUE 2*: Additional slots filtering based on a property and its property value
  * *PROPERTY 3* & *PROPERTY VALUE 3*: Additional slots filtering based on a property and its property value
* Parent Instance Filtering (optional): Used when querying instance having a parent instance (like an Interface vista instance)
  * *PARENT VISTA*: Indicates the parent instance vista (based on the list of top vistas available in the VistaMart topology).
  * *PARENT INSTANCE*: Indicates the parent instance (based on the list of instances available in the VistaMart topology filtered by the selected parent vista).
  * *PARENT PROPERTY* & *PARENT PROPERTY VALUE*: Additional instance filtering based on a property and its property value
* Display Options
  * *ALIAS* : Can be used to override the serie name. By default, the name is "indicatorName (Instance Name)" but by using the following keywords, its name can be overriden:
    * *$i*: Indicator Name
    * *$t*: Instance Tag
    * *$n*: Instance Name
    * *$N*: Basic Instance Tag
    * *$N*: Basic Instance Name
    *  Any other text: The typed text

![Parameters example](https://github.com/infovista/vistamart-datasource/blob/master/src/images/parameters.png?raw=true)

Note : Please note that Shared Criterias are also applied on topology objects (like Instance, Property...)

### Using variables in a dashboard

Grafana variables are used to ease integration of topology objects, reduce development work and ease navigation.

#### Configuration

The variable must have the type *Query* and point to a defined VistaMart datasource.

A JSON structure must be entered to define the type of object to query. The *type* JSON node is mandatory to specify the type of object to query. *filter* and *subfilter* are optional nodes.

![Variables](https://github.com/infovista/vistamart-datasource/blob/master/src/images/variables.png?raw=true)

Here is a list of available JSON structures:

* List all vistas from the topology:
``{
    "type":"vista"
}``
* List all instances from a vista:
``{
    "type":"instance"
    "filter" : "<Vista Name>"
}``
* List all instances from a vista and a parent instance:
``{
    "type":"cinstance"
    "filter" : "<instance>"
    "subfilter" : "<Vista Name>"
}``
* List all available display rates from the topology:
``{
    "type":"dr"
}``

Example: Listing all "SA Agent - RTT" instances from an instance located in the "Router" Vista:

``{
    "type":"cinstance"
    "filter" : "$router"
    "subfilter" : "SA Agent - RTT"
}``

Note : $router is another variable defined as ``{
    "type":"instance"
    "filter" : "Router"
}``

Other examples:

![Variables](https://github.com/infovista/vistamart-datasource/blob/master/src/images/variables_editor.png?raw=true)

#### Usage

A template variable can be used in the query panel by simply putting the name of the variable prepended by the $ sign (``$router`` for example)

Template variables appears automatically in the dashboard header with the data coming from the topology.

![Variables](https://github.com/infovista/vistamart-datasource/blob/master/src/images/variables_usage.png?raw=true)

Note for "Multi-value" usage: If a template variable is defined as *Multi-value*, the variable must be formatted in JSON. For example, ``${router:json}``

## Dashboard examples

Several demo dashboards are available. You may import them directly from Grafana when creating the datasource.

## Contributing

If you have any idea for an improvement or found a bug do not hesitate to open an issue or submit a pull request.
We will appreciate any help from the community which will make working with InfoVista products and Grafana more convenient.

## Development 

see [CONTRIBUTING.md](https://github.com/infovista/vistamart-datasource/blob/master/CONTRIBUTING.md) for Development and Pull request Contributing instructions 
   
## License
Apache 2.0, please see [LICENSE](https://github.com/infovista/vistamart-datasource/blob/master/LICENSE) for details.

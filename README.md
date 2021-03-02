# VistaMart datasource for Grafana 4.7+

VistaMart datasource can be used to design dashboards with VistaMart data. It uses the VistaPortal API to query the VistaMart topology and data (using the Datamodel API)

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
- Cloud Native VistaMart 2021.03+
- VistaPortal 2021.03+

## Getting Started

### VistaPortal Configuration
A OAuth2 Client Application must be created into the VistaPortal Management Console
- Log on the VistaPortal Management Console
- Go to the "OAuth2 Client Application" section
- Create a new application by selecting a *Confidential* client type
- Mark down the 2 following important parameters : *Client ID* and *Client secret*

![Configuration example](https://github.com/infovista/vistamart-datasource/blob/master/src/images/vportal.png?raw=true) 

### Datasource configuration
- Log on grafana
- Install the "VistaMart" plugin by following the instruction on [grafana.com Website](https://grafana.com/grafana/plugins)
- Create a "VistaMart" datasource
- Enter the URL of the VistaPortal API url (for example: http://ivapi:9080/api)
- Enter the *VistaPortal OAuth2 Client ID* (copied from the "VistaPortal Configuration" step)
- Enter the *VistaPortal OAuth2 Client Secret* (copied from the "VistaPortal Configuration" step)
- Click on "Save & Test"

![Configuration example](https://github.com/infovista/vistamart-datasource/blob/master/src/images/datasource.png?raw=true)

## Using the datasource

### Query parameters

The query parameters are used to identify the right VistaMart started slots in the database. These parameters are divided into 3 parts.

* Main Parameters (Mandatory for all use cases):
  * *VISTA*: Indicates the indicator vista (based on the list of vistas available in the VistaMart topology)
  * *INDICATOR*: Indicates the indicator (based on the list of indicators available in the VistaMart topology filtered by the selected vista)
  * *INSTANCE*: Indicates the instance (based on the list of instances available in the VistaMart topology filtered by the selected vista)
  * *DISPLAY RATE*: Indicates the slot display rate (based on the started slots for the selected indicator and instance)
  * *PROPERTY 1* & *PROPERTY VALUE 1*: Additional slots filtering based on a property and its property value
  * *PROPERTY 2* & *PROPERTY VALUE 2*: Additional slots filtering based on a property and its property value
  * *PROPERTY 3* & *PROPERTY VALUE 3*: Additional slots filtering based on a property and its property value
* Parent Instance Filtering (optional): Used when querying instance having a parent instance (like an Interface instance)
  * *PARENT VISTA*: Indicates the parent instance vista (based on the list of vistas available in the VistaMart topology).
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

### Using variables in a dashboard

Grafana variables are used to ease integration of topology objects and to reduce development work.

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
    "type":"instance"
    "filter" : "<instance>"
    "subfilter" : "<Vista Name>"
}``
* List all available display rates from the topology:
``{
    "type":"dr"
}``

Example: Listing all "SA Agent - RTT" instances from an instance located in the "Router" Vista:

``{
    "type":"instance"
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

Several dashboard example are available under the *examples*

## Contributing

If you have any idea for an improvement or found a bug do not hesitate to open an issue or submit a pull request.
We will appreciate any help from the community which will make working with InfoVista products and Grafana more convenient.

## Development 

see [CONTRIBUTING.md](https://github.com/infovista/vistamart-datasource/blob/master/CONTRIBUTING.md) for Development and Pull request Contributing instructions 
   
## License
Apache 2.0, please see [LICENSE](https://github.com/infovista/vistamart-datasource/blob/master/LICENSE) for details.

# Infovista Ativa Net data source for Grafana 12.3.0+

Ativa Net data source is used to design dashboards with Ativa Net data and it uses the Ativa Net API to query the DataMart topology and data (using the Datamodel API)

[![License](https://img.shields.io/github/license/infovista/vistamart-datasource)](LICENSE)
[![Ci](https://github.com/infovista/vistamart-datasource/actions/workflows/ci.yml/badge.svg)]()

## Introduction

### Overview

Ativa Net data source is connecting to Ativa Net with Ativa Net API.

### Features

- Query setup
- Templates
- Table view
- SingleStat view
- Annotations

### Requirements
The following software must be installed in order to use this data source
- Ativa Net 26.1

## Installation

As `grafana-cli` installation is not supported, installation must be done manually.

- Go to the [GitHub Releases page](https://github.com/infovista/vistamart-datasource/releases)
- Download the latest 'infovista-ativanet-datasource-26.1.0' zip file
- Unzip the file under the grafana plugins folder e.g. /var/lib/grafana/plugins (in order to have a `<plugins dir>/infovista-ativanet-datasource` folder e.g /var/lib/grafana/plugins/infovista-ativanet-datasource)
- Restart grafana server
- You should find a "Infovista Ativa Net" plugin in the available plugins

## Getting Started

### Ativa Net Web Portal certificate
Warning: the certificate of the Ativa Net Web Portal must be known by the host of the grafana server (e.g. by adding it to the host). If not, the message `Bad Gateway` may be returned when saving and testing the data source connection.

### Ativa Net API access configuration
To access Ativa Net API, an Open ID Connect private client must be created into the Ativa Net Web Portal Administration interface,<br>
the *Client ID* and *Client secret* are then used to configure the Ativa Net data source in Grafana.
- Go to the Users and Groups page
- Select the realm where you want to create the client (master)
- In the left menu, click Clients
- On the Clients page, click Create client
- Ensure Client type = OpenID Connect
- Enter a unique, meaningful *Client ID*
- Click Next
- Set Client authentication = On
- Enable Service account roles only
- Click Next
- Click Save
- Select the Service accounts roles tab of the newly created client
- Click the service-account link at the top
- Select the Role Mappings tab
- Click on "Assign roles" and assign the Realm roles: net_api_datamart_get, net_api_model_get, net_api_topology_get

### Data source configuration
- Log on grafana
- Create a "Infovista Ativa Net" data source
- Enter the URL of the Ativa Net API url (for example: https://portal.ativa:31390/ativanet/api)
- Enter the *Open ID Connect Client ID* (copied from the "Ativa Net API access configuration" step)
- Enter the *Open ID Connect Client Secret* (copied from the "Ativa Net API access configuration" step)
- Click on "Save & Test"

![Configuration example](https://github.com/infovista/vistamart-datasource/blob/main/src/images/datasource.png?raw=true)

## Using the data source

### Query parameters

The query parameters are used to identify the right Ativa Net started slots in the database. These parameters are divided into 3 parts.

* Main Parameters (Mandatory for all use cases):
  * *VISTA*: Indicates the indicator vista (based on the list of top vistas available in the Ativa Net topology)
  * *INDICATOR*: Indicates the indicator (based on the list of indicators available in the Ativa Net topology filtered by the selected vista)
  * *INSTANCE*: Indicates the instance (based on the list of instances available in the Ativa Net topology filtered by the selected vista)
  * *DISPLAY RATE*: Indicates the slot display rate (based on the started slots for the selected indicator and instance)
  * *PROPERTY 1* & *PROPERTY VALUE 1*: Additional slots filtering based on a property and its property value
  * *PROPERTY 2* & *PROPERTY VALUE 2*: Additional slots filtering based on a property and its property value
  * *PROPERTY 3* & *PROPERTY VALUE 3*: Additional slots filtering based on a property and its property value
* Parent Instance Filtering (optional): Used when querying instance having a parent instance (like an Interface vista instance)
  * *PARENT VISTA*: Indicates the parent instance vista (based on the list of top vistas available in the Ativa Net topology).
  * *PARENT INSTANCE*: Indicates the parent instance (based on the list of instances available in the Ativa Net topology filtered by the selected parent vista).
  * *PARENT PROPERTY* & *PARENT PROPERTY VALUE*: Additional instance filtering based on a property and its property value
* Display Options
  * *ALIAS* : Can be used to override the serie name. By default, the name is "indicatorName (Instance Name)" but by using the following keywords, its name can be overriden:
    * *$i*: Indicator Name
    * *$t*: Instance Tag
    * *$n*: Instance Name
    * *$T*: Basic Instance Tag
    * *$N*: Basic Instance Name
    *  Any other text: The typed text

![Parameters example](https://github.com/infovista/vistamart-datasource/blob/main/src/images/parameters.png?raw=true)

Note : Please note that Shared Criterias are also applied on topology objects (like Instance, Property...)

### Using variables in a dashboard

Grafana variables are used to ease integration of topology objects, reduce development work and ease navigation.

#### Configuration

The variable must have the type *Query* and point to a defined Ativa Net data source.

The query is made of 3 elements: the *type* which is mandatory to specify the type of object to query, the *filter* and the *subfilter* are optional. 

![Variables](https://github.com/infovista/vistamart-datasource/blob/main/src/images/variables.png?raw=true)

Here is a list of available queries:

* List all vistas from the topology: select ``vista`` as the type
* List all instances of a vista: select ``instance`` as the type and specify the vista name in the filter
* List all instances of a vista with a given parent instance: select ``cinstance`` as the type and specify the parent instance and vista name respectively in the filter and subfilter, filter can be a variable (variables are prepended by the sign $)
* List all available display rates from the topology: select ``dr`` as the type

Example: Listing all "SA Agent - RTT" instances from an instance located in the "Router" Vista:

``{ "type": "cinstance", "filter": "$router", "subfilter": "SA Agent - RTT" }``

Note : $router is another variable defined as ``{ "type": "instance", "filter": "Router" }``

Other examples:

![Variables](https://github.com/infovista/vistamart-datasource/blob/main/src/images/variables_editor.png?raw=true)

#### Usage

A template variable can be used in the query panel by simply putting the name of the variable prepended by the sign $ (``$router`` for example)

Template variables appears automatically in the dashboard header with the data coming from the topology.

![Variables](https://github.com/infovista/vistamart-datasource/blob/main/src/images/variables_usage.png?raw=true)

Note for "Multi-value" usage: If a template variable is defined as *Multi-value*, the variable must be formatted in JSON. For example, ``${router:json}`` in demo dashboard 'Interface Utilization Overview (multiple) - Demo'.

### Using annotations in a dashboard

Annotations can be used to display events on a dashboard. An annotation query is made of 3 mandatory elements to be selected: the *Vista*, the *Instance* and the *Indicator* of the events to be retrieved if any.

![Annotations](https://github.com/infovista/vistamart-datasource/blob/main/src/images/annotations_editor.png?raw=true)

## Dashboard examples

Several demo dashboards are available. You may import them directly from Grafana when creating the data source.

## Contributing

If you have any idea for an improvement or found a bug do not hesitate to open an issue or submit a pull request.
We will appreciate any help from the community which will make working with InfoVista products and Grafana more convenient.

## Development 

see [CONTRIBUTING.md](https://github.com/infovista/vistamart-datasource/blob/main/CONTRIBUTING.md) for Development and Pull request Contributing instructions 
   
## License
Apache 2.0, please see [LICENSE](https://github.com/infovista/vistamart-datasource/blob/main/LICENSE) for details.

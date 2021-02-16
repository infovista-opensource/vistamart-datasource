interface DrConvertionType {
    [key: string]: string;
}

export const TextToISO8601 : DrConvertionType = {
    "15 seconds": "PT15S",
    "1 minutes": "PT1M",
    "5 minutes": "PT5M",
    "10 minutes": "PT10M",
    "15 minutes": "PT15M",
    "30 minutes": "PT30M",
    "Hourly": "PT1H",
    "Daily": "P1D",
    "Weekly": "P1W",
    "Monthly": "P1M",
    "Yearly": "P1Y"
};

export const ISO8601ToText : DrConvertionType = {
    "PT15S": "15 seconds",
    "PT1M": "1 minute",
    "PT5M": "5 minutes",
    "PT10M": "10 minutes",
    "PT15M": "15 minutes",
    "PT30M": "30 minutes",
    "PT1H": "Hourly",
    "P1D": "Daily",
    "P1W": "Weekly",
    "P1M": "Monthly",
    "P1Y": "Yearly"
};
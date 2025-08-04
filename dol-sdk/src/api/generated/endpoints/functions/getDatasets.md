[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [dol-sdk/src/api/generated/endpoints](../README.md) / getDatasets

# Function: getDatasets()

> **getDatasets**(`params?`, `options?`): `Promise`\<[`GetDatasets200Item`](../../model/type-aliases/GetDatasets200Item.md)[]\>

Retrieve the catalog of datasets available through the DOL API in JSON format.
This endpoint does not require an API key.

*Important:** This endpoint returns a paginated response. The response is an array where:
- All elements except the last are dataset objects
- The last element is a pagination metadata object

*Note on Response Structure:** This is a non-standard pagination approach. When processing 
the response, you need to separate the last element (pagination metadata) from the dataset 
objects. For example, in JavaScript: `const datasets = response.slice(0, -1); const pagination = response[response.length - 1];`

Use this endpoint to discover:
- Available agency abbreviations (in the `agency.abbr` field)
- Dataset endpoints (in the `api_url` field)
- Dataset descriptions and metadata

## Parameters

### params?

[`GetDatasetsParams`](../../model/type-aliases/GetDatasetsParams.md)

### options?

`AxiosRequestConfig`\<`any`\>

## Returns

`Promise`\<[`GetDatasets200Item`](../../model/type-aliases/GetDatasets200Item.md)[]\>

[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [dol-sdk/src/api/generated/endpoints](../README.md) / getAgencyEndpointMetadataJson

# Function: getAgencyEndpointMetadataJson()

> **getAgencyEndpointMetadataJson**(`agency`, `endpoint`, `options?`): `Promise`\<[`MetadataResponse`](../../model/interfaces/MetadataResponse.md)\>

Retrieve comprehensive metadata about a dataset including field descriptions,
data types, and other characteristics that help understand the dataset structure.

*Note:** XML format is not supported for metadata endpoints. Use JSON or CSV format only.

## Parameters

### agency

`string`

### endpoint

`string`

### options?

`AxiosRequestConfig`\<`any`\>

## Returns

`Promise`\<[`MetadataResponse`](../../model/interfaces/MetadataResponse.md)\>

[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [dol-sdk/src/api/generated/endpoints](../README.md) / getAgencyEndpointDataXml

# Function: getAgencyEndpointDataXml()

> **getAgencyEndpointDataXml**(`agency`, `endpoint`, `params?`, `options?`): `Promise`\<[`DataResponse`](../../model/interfaces/DataResponse.md)\>

Retrieve data from a specific dataset with optional filtering, sorting, and field selection.

*Response Structure:** Data endpoints return responses wrapped in a `{"data": [...]}` object.
The `data` property contains an array of records whose structure varies by dataset.

## Parameters

### agency

`string`

### endpoint

`string`

### params?

[`GetAgencyEndpointDataXmlParams`](../../model/type-aliases/GetAgencyEndpointDataXmlParams.md)

### options?

`AxiosRequestConfig`\<`any`\>

## Returns

`Promise`\<[`DataResponse`](../../model/interfaces/DataResponse.md)\>

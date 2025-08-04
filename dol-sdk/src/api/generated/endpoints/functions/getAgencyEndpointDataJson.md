[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [dol-sdk/src/api/generated/endpoints](../README.md) / getAgencyEndpointDataJson

# Function: getAgencyEndpointDataJson()

> **getAgencyEndpointDataJson**(`agency`, `endpoint`, `params?`, `options?`): `Promise`\<[`DataResponse`](../../model/interfaces/DataResponse.md)\>

Retrieve data from a specific dataset with optional filtering, sorting, and field selection.

*Response Structure:** Data endpoints return responses wrapped in a `{"data": [...]}` object.
The `data` property contains an array of records whose structure varies by dataset.

## Parameters

### agency

`string`

### endpoint

`string`

### params?

[`GetAgencyEndpointDataJsonParams`](../../model/type-aliases/GetAgencyEndpointDataJsonParams.md)

### options?

`AxiosRequestConfig`\<`any`\>

## Returns

`Promise`\<[`DataResponse`](../../model/interfaces/DataResponse.md)\>

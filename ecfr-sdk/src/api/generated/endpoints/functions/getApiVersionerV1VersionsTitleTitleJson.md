[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [ecfr-sdk/src/api/generated/endpoints](../README.md) / getApiVersionerV1VersionsTitleTitleJson

# Function: getApiVersionerV1VersionsTitleTitleJson()

> **getApiVersionerV1VersionsTitleTitleJson**(`title`, `params?`, `options?`): `Promise`\<`null`\>

Returns the content versions meeting the specified criteria. Each content object includes its identifier, parent hierarchy, last amendment date and issue date it was last updated. Queries return content versions `on` an issue date, or before or on a specific issue date `lte` or on or after `gte` a specific issue date. The `gte` and `lte` parameters may be combined. Use of the `on` parameter precludes use of `gte` or `lte`. In the response, the `date` field is identical to `amendment_date` and is deprecated.
<br>
A response of `400 Bad Request` indicates that your request could not be processed. If possible the response will include a message indicating the problem.
<br>
A response of `503 Service Unavailable` indicates that the title is currently unavailable, typlically because it is currently being processed. The value of the `Retry-After` header suggests a number of seconds to wait before retrying the request.

## Parameters

### title

`string`

### params?

[`GetApiVersionerV1VersionsTitleTitleJsonParams`](../../model/type-aliases/GetApiVersionerV1VersionsTitleTitleJsonParams.md)

### options?

`AxiosRequestConfig`\<`any`\>

## Returns

`Promise`\<`null`\>

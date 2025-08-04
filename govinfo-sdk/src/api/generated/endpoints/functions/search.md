[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [govinfo-sdk/src/api/generated/endpoints](../README.md) / search

# Function: search()

> **search**(`searchBody`, `options?`): `Promise`\<[`SearchResponse`](../../model/interfaces/SearchResponse.md)\>

This service can be used to query the GovInfo search engine and return results that are the equivalent to what is returned by the main user interface. You can use field operators, such as congress, publishdate, branch, and others to construct complex queries that will return only matching documents. For additional information, please see our <a href=\'https://www.govinfo.gov/features/search-service-overview\' target=\'blank\' style=\'text-decoration:underline\'>search service overview</a>.

## Parameters

### searchBody

[`SearchBody`](../../model/interfaces/SearchBody.md)

### options?

`AxiosRequestConfig`\<`any`\>

## Returns

`Promise`\<[`SearchResponse`](../../model/interfaces/SearchResponse.md)\>

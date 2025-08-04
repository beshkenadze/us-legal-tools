[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [courtlistener-sdk/src/api/generated/endpoints](../README.md) / postCitationLookup

# Function: postCitationLookup()

> **postCitationLookup**(`postCitationLookupBody`, `options?`): `Promise`\<[`CitationResult`](../../model/interfaces/CitationResult.md)\>

Look up citations by providing either a text blob containing citations or specific volume/reporter/page parameters. Rate limited to 60 citations per minute with a maximum of 250 citations per request.

## Parameters

### postCitationLookupBody

[`PostCitationLookupBody`](../../model/type-aliases/PostCitationLookupBody.md)

### options?

`AxiosRequestConfig`\<`any`\>

## Returns

`Promise`\<[`CitationResult`](../../model/interfaces/CitationResult.md)\>

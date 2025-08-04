[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [ecfr-sdk/src/api/generated/endpoints](../README.md) / getApiVersionerV1FullDateTitleTitleXml

# Function: getApiVersionerV1FullDateTitleTitleXml()

> **getApiVersionerV1FullDateTitleTitleXml**(`date`, `title`, `params?`, `options?`): `Promise`\<`string`\>

The title source route can be used to retrieve the source xml for a complete title or subset. The subset of xml is determined by the lowest leaf node given. For example, if you request Title 1, Chapter I, Part 1, you'll receive the XML only for Part 1 and its children.
If you request a section you'll receive the section XML inside its parent Part as well as relevant non-section sibling nodes (Auth, Source, etc).
The largest title source xml files can be dozens of megabytes.

[GPO eCFR XML User guide](https://github.com/usgpo/bulk-data/blob/master/ECFR-XML-User-Guide.md)

## Parameters

### date

`string`

### title

`string`

### params?

[`GetApiVersionerV1FullDateTitleTitleXmlParams`](../../model/type-aliases/GetApiVersionerV1FullDateTitleTitleXmlParams.md)

### options?

`AxiosRequestConfig`\<`any`\>

## Returns

`Promise`\<`string`\>

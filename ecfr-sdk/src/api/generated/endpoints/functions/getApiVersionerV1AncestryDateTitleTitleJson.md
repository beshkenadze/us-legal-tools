[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [ecfr-sdk/src/api/generated/endpoints](../README.md) / getApiVersionerV1AncestryDateTitleTitleJson

# Function: getApiVersionerV1AncestryDateTitleTitleJson()

> **getApiVersionerV1AncestryDateTitleTitleJson**(`date`, `title`, `params?`, `options?`): `Promise`\<`null`\>

The Ancestry service can be used to determine the complete ancestry to a leaf node at a specific point in time.
### Example
The complete hierarchy for **2 CFR 1532.137** is
```
Title 2
 Subtitle B
   Chapter XV
     Part 1532
       Subpart A
         Section 1532.137
```
To retrieve this complete hierarchy you can use the ancestry endpoint and provide a Title, Part and Section (you can provide additional layers of the hierarchy) to retrieve a full ancestry.
See sample json responses below.

## Parameters

### date

`string`

### title

`string`

### params?

[`GetApiVersionerV1AncestryDateTitleTitleJsonParams`](../../model/type-aliases/GetApiVersionerV1AncestryDateTitleTitleJsonParams.md)

### options?

`AxiosRequestConfig`\<`any`\>

## Returns

`Promise`\<`null`\>

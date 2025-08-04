[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [dol-sdk/src/api/generated/model](../README.md) / DataResponse

# Interface: DataResponse

The standard response structure for data requests. Data is wrapped in a "data" property
containing an array of records. The structure of individual records varies by dataset.

## Properties

### data

> **data**: [`DataResponseDataItem`](../type-aliases/DataResponseDataItem.md)[]

***

### metadata?

> `optional` **metadata**: [`DataResponseMetadata`](../type-aliases/DataResponseMetadata.md)

Optional metadata about the response (not always included)

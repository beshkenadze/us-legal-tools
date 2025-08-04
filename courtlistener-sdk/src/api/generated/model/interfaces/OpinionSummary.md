[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [courtlistener-sdk/src/api/generated/model](../README.md) / OpinionSummary

# Interface: OpinionSummary

## Properties

### author\_id?

> `optional` **author\_id**: `number`

ID of the opinion author

#### Nullable

***

### cites?

> `optional` **cites**: `number`[]

IDs of cases cited in this opinion

***

### download\_url?

> `optional` **download\_url**: `string`

URL to download the opinion document

***

### id?

> `optional` **id**: `number`

Opinion ID

***

### joined\_by\_ids?

> `optional` **joined\_by\_ids**: `number`[]

IDs of judges who joined this opinion

***

### local\_path?

> `optional` **local\_path**: `string`

Local file path

***

### meta?

> `optional` **meta**: [`OpinionSummaryMeta`](../type-aliases/OpinionSummaryMeta.md)

***

### ordering\_key?

> `optional` **ordering\_key**: `number`

Key for ordering opinions

#### Nullable

***

### per\_curiam?

> `optional` **per\_curiam**: `boolean`

Whether this is a per curiam opinion

***

### sha1?

> `optional` **sha1**: `string`

SHA1 hash of the document

***

### snippet?

> `optional` **snippet**: `string`

Text snippet from the opinion

***

### type?

> `optional` **type**: `string`

Type of opinion

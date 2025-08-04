[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [govinfo-sdk/src/api/generated/model](../README.md) / GetModifiedCollectionsParams

# Type Alias: GetModifiedCollectionsParams

> **GetModifiedCollectionsParams** = `object`

## Properties

### billVersion?

> `optional` **billVersion**: [`GetModifiedCollectionsBillVersion`](GetModifiedCollectionsBillVersion.md)

Filter the results by overarching collection-specific categories.

***

### congress?

> `optional` **congress**: `number`

Filters results by Congress, where applicable. For example 113 or 114.

***

### courtCode?

> `optional` **courtCode**: `string`

#### Pattern

(?:(?:al|ak|as|az|ar|ca|co|ct|de|dc|fl|ga|gu|hi|id|il|in|ia|ks|ky|la|me|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|mp|oh|ok|or|pa|pr|ri|sc|sd|tn|tx|ut|vt|va|vi|wa|wv|wi|wy)[n|e|w|s]?[d|b|a])|(cit|ca\d{1,2})|(cofc|jpml)

***

### courtType?

> `optional` **courtType**: `string`

#### Pattern

District|Bankruptcy|Appellate|National

***

### docClass?

> `optional` **docClass**: `string`

Filter the results by overarching collection-specific categories. The values vary from collection to collection. For example, docClass in BILLS corresponds with Bill Type --e.g. s, hr, hres, sconres.

***

### isGLP?

> `optional` **isGLP**: `boolean`

***

### natureSuit?

> `optional` **natureSuit**: `string`

***

### natureSuitCode?

> `optional` **natureSuitCode**: `string`

***

### offset?

> `optional` **offset**: `number`

This is the starting record you wish to retrieve-- 0 is the first record. This parameter will be deprecated in December 2022. Please begin transitioning to use offsetMark instead. For more information see https://github.com/usgpo/api/issues/101

***

### offsetMark?

> `optional` **offsetMark**: `string`

Indicates starting record for a given request. For the first request, use * - for subsequent requests, this information will be provided in the nextPage field. Note: this parameter will completely replace the offset parameter in December 2022. For more information see https://github.com/usgpo/api/issues/101

***

### pageSize

> **pageSize**: `number`

The number of records to return for a given request. Max value is 1000

#### Maximum

1000

***

### state?

> `optional` **state**: `string`

#### Pattern

AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PA|PR|RI|SC|SD|TN|TX|UT|VT|VA|VI|WA|WV|WI|WY

***

### topic?

> `optional` **topic**: `string`

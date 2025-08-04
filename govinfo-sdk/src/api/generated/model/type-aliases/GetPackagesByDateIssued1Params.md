[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [govinfo-sdk/src/api/generated/model](../README.md) / GetPackagesByDateIssued1Params

# Type Alias: GetPackagesByDateIssued1Params

> **GetPackagesByDateIssued1Params** = `object`

## Properties

### billVersion?

> `optional` **billVersion**: [`GetPackagesByDateIssued1BillVersion`](GetPackagesByDateIssued1BillVersion.md)

Filter the results by overarching collection-specific categories.

***

### collection

> **collection**: `string`

comma-separated list of collections that you are requesting, e.g. https://api.govinfo.gov/published/2019-01-01/2019-12-31?offset=0&pageSize=100&collection=BILLS,BILLSTATUS&api_key=DEMO_KEY - see /collections for a list of collections by code and human-readable name.

***

### congress?

> `optional` **congress**: `string`

congress number (e.g. 116)

***

### courtCode?

> `optional` **courtCode**: `string`

#### Pattern

(?:AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FL|GA|GU|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PA|PR|RI|SC|SD|TN|TX|UT|VT|VA|VI|WA|WV|WI|WY)[n|e|w|s]?[d|b|a]|(cofc|jpml)

***

### courtType?

> `optional` **courtType**: `string`

#### Pattern

District|Bankruptcy|Appellate|National

***

### docClass?

> `optional` **docClass**: `string`

Filter the results by overarching collection-specific categories. The values vary from collection to collection. For example, docClass in BILLS corresponds with Bill Type --e.g. s, hr, hres, sconres. CREC (the Congressional Record) has docClass by CREC section: HOUSE, SENATE, DIGEST, and EXTENSIONS

***

### isGLP?

> `optional` **isGLP**: `boolean`

***

### modifiedSince?

> `optional` **modifiedSince**: `string`

equivalent to the lastModifiedStartDate parameter in the collections service which is based on lastModified- allows you to request only packages that have been modified since a given date/time - useful for tracking updates. Requires ISO 8601 format -- e.g. 2020-02-28T00:00:00Z

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

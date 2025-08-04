[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [ecfr-sdk/src/api/generated/model](../README.md) / GetApiSearchV1ResultsParams

# Type Alias: GetApiSearchV1ResultsParams

> **GetApiSearchV1ResultsParams** = `object`

## Properties

### agency\_slugs\[\]?

> `optional` **agency\_slugs\[\]**: `string`[]

limit to content currently associated with these agencies (see AdminService agencies endpoint to retrieve a list of agency slugs)

***

### date?

> `optional` **date**: `string`

limit to content present on this date (YYYY-MM-DD)

***

### last\_modified\_after?

> `optional` **last\_modified\_after**: `string`

limit to content last modified after this date (YYYY-MM-DD)

***

### last\_modified\_before?

> `optional` **last\_modified\_before**: `string`

limit to content last modified before this date (YYYY-MM-DD)

***

### last\_modified\_on\_or\_after?

> `optional` **last\_modified\_on\_or\_after**: `string`

limit to content last modified on or after this date (YYYY-MM-DD)

***

### last\_modified\_on\_or\_before?

> `optional` **last\_modified\_on\_or\_before**: `string`

limit to content last modified on or before this date (YYYY-MM-DD)

***

### order?

> `optional` **order**: [`GetApiSearchV1ResultsOrder`](GetApiSearchV1ResultsOrder.md)

order of results

***

### page?

> `optional` **page**: `number`

page of results; can't paginate beyond 10,000 total results

#### Minimum

1

***

### paginate\_by?

> `optional` **paginate\_by**: [`GetApiSearchV1ResultsPaginateBy`](GetApiSearchV1ResultsPaginateBy.md)

how results should be paginated - 'date' will group results so that all results from a date appear on the same page of pagination. If 'date' is chosen then one of the last_modified_* options is required.

***

### per\_page?

> `optional` **per\_page**: `number`

number of results per page; max of 1,000

#### Minimum

1

#### Maximum

1000

***

### query?

> `optional` **query**: `string`

Search term; searches the headings and the full text

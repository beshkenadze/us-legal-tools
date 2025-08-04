[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [courtlistener-sdk/src/api/generated/model](../README.md) / Court

# Interface: Court

## Properties

### appeals\_to?

> `optional` **appeals\_to**: `string`[]

Courts this court appeals to

***

### citation\_string?

> `optional` **citation\_string**: `string`

Citation abbreviation

***

### date\_last\_pacer\_contact?

> `optional` **date\_last\_pacer\_contact**: `string`

Last PACER contact date

#### Nullable

***

### date\_modified?

> `optional` **date\_modified**: `string`

Date modified

***

### end\_date?

> `optional` **end\_date**: `string`

Court end date

#### Nullable

***

### fjc\_court\_id?

> `optional` **fjc\_court\_id**: `string`

Federal Judicial Center court ID

***

### full\_name?

> `optional` **full\_name**: `string`

Full court name

***

### has\_opinion\_scraper?

> `optional` **has\_opinion\_scraper**: `boolean`

Whether court has opinion scraper

***

### has\_oral\_argument\_scraper?

> `optional` **has\_oral\_argument\_scraper**: `boolean`

Whether court has oral argument scraper

***

### id?

> `optional` **id**: `string`

Court identifier

***

### in\_use?

> `optional` **in\_use**: `boolean`

Whether court is in use

***

### jurisdiction?

> `optional` **jurisdiction**: [`CourtJurisdiction`](../type-aliases/CourtJurisdiction.md)

Jurisdiction type: F=Federal, S=State, FS=Federal Special, MA=Military Appeals

***

### pacer\_court\_id?

> `optional` **pacer\_court\_id**: `number`

PACER court ID

#### Nullable

***

### pacer\_has\_rss\_feed?

> `optional` **pacer\_has\_rss\_feed**: `boolean`

Whether court has RSS feed

#### Nullable

***

### pacer\_rss\_entry\_types?

> `optional` **pacer\_rss\_entry\_types**: `string`

Types of RSS entries

***

### parent\_court?

> `optional` **parent\_court**: `string`

Parent court ID

#### Nullable

***

### position?

> `optional` **position**: `number`

Position for ordering

***

### resource\_uri?

> `optional` **resource\_uri**: `string`

Resource URI

***

### short\_name?

> `optional` **short\_name**: `string`

Short court name

***

### start\_date?

> `optional` **start\_date**: `string`

Court start date

#### Nullable

***

### url?

> `optional` **url**: `string`

Court website URL

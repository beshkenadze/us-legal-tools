[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [federal-register-sdk/src/api/generated/model](../README.md) / GetDocumentsFacetsFacetParams

# Type Alias: GetDocumentsFacetsFacetParams

> **GetDocumentsFacetsFacetParams** = `object`

## Properties

### conditions\[agencies\]\[\]?

> `optional` **conditions\[agencies\]\[\]**: [`Agency`](Agency.md)

Publishing agency

***

### conditions\[cfr\]\[part\]?

> `optional` **conditions\[cfr\]\[part\]**: `number`

Part or part range (eg \'17\' or \'1-50\'); requires the CFR title to be provided

***

### conditions\[cfr\]\[title\]?

> `optional` **conditions\[cfr\]\[title\]**: `number`

documents affecting the associated CFR title

***

### conditions\[docket\_id\]?

> `optional` **conditions\[docket\_id\]**: `string`

Agency docket number associated with document

***

### conditions\[effective\_date\]\[gte\]?

> `optional` **conditions\[effective\_date\]\[gte\]**: [`FrDate`](FrDate.md)

Find documents with an effective date on or after a given date (YYYY-MM-DD)

***

### conditions\[effective\_date\]\[is\]?

> `optional` **conditions\[effective\_date\]\[is\]**: [`FrDate`](FrDate.md)

Exact effective date match (YYYY-MM-DD)

***

### conditions\[effective\_date\]\[lte\]?

> `optional` **conditions\[effective\_date\]\[lte\]**: [`FrDate`](FrDate.md)

Find documents with an effective date on or before a given date (YYYY-MM-DD)

***

### conditions\[effective\_date\]\[year\]?

> `optional` **conditions\[effective\_date\]\[year\]**: [`FrDate`](FrDate.md)

Find documents with an effective date in a given year (YYYY)

***

### conditions\[near\]\[location\]?

> `optional` **conditions\[near\]\[location\]**: `string`

Location search; enter zipcode or City and State

***

### conditions\[near\]\[within\]?

> `optional` **conditions\[near\]\[within\]**: `number`

Location search; maximum distance from location in miles (max 200)

#### Maximum

200

***

### conditions\[president\]\[\]?

> `optional` **conditions\[president\]\[\]**: [`President`](President.md)

Signing President; only available for Presidential Documents

***

### conditions\[presidential\_document\_type\]\[\]?

> `optional` **conditions\[presidential\_document\_type\]\[\]**: [`PresidentialDocumentType`](PresidentialDocumentType.md)

Presidential document type; only available for Presidential Docuements

***

### conditions\[publication\_date\]\[gte\]?

> `optional` **conditions\[publication\_date\]\[gte\]**: [`FrDate`](FrDate.md)

Find documents published on or after a given date (YYYY-MM-DD)

***

### conditions\[publication\_date\]\[is\]?

> `optional` **conditions\[publication\_date\]\[is\]**: [`FrDate`](FrDate.md)

Exact publication date match (YYYY-MM-DD)

***

### conditions\[publication\_date\]\[lte\]?

> `optional` **conditions\[publication\_date\]\[lte\]**: [`FrDate`](FrDate.md)

Find documents published on or before a given date (YYYY-MM-DD)

***

### conditions\[publication\_date\]\[year\]?

> `optional` **conditions\[publication\_date\]\[year\]**: [`FrYear`](FrYear.md)

Find documents published in a given year (YYYY)

***

### conditions\[regulation\_id\_number\]?

> `optional` **conditions\[regulation\_id\_number\]**: `string`

Regulation ID Number (RIN) associated with document

***

### conditions\[sections\]\[\]?

> `optional` **conditions\[sections\]\[\]**: [`Section`](Section.md)

Limit to documents that appeared within a particular section of FederalRegister.gov

***

### conditions\[significant\]?

> `optional` **conditions\[significant\]**: [`GetDocumentsFacetsFacetConditionsSignificant`](GetDocumentsFacetsFacetConditionsSignificant.md)

Deemed Significant Under EO 12866:
 * "0": Not Deemed Significant
 * "1": Deemed Significant

***

### conditions\[term\]?

> `optional` **conditions\[term\]**: `string`

Full text search

***

### conditions\[type\]\[\]?

> `optional` **conditions\[type\]\[\]**: [`DocumentType`](DocumentType.md)

Document Type:
 * RULE: Final Rule
 * PRORULE: Proposed Rule
 * NOTICE: Notice
 * PRESDOCU: Presidential Document

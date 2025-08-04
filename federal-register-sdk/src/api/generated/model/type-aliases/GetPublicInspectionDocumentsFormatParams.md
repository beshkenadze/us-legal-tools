[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [federal-register-sdk/src/api/generated/model](../README.md) / GetPublicInspectionDocumentsFormatParams

# Type Alias: GetPublicInspectionDocumentsFormatParams

> **GetPublicInspectionDocumentsFormatParams** = `object`

## Properties

### conditions\[agencies\]\[\]?

> `optional` **conditions\[agencies\]\[\]**: [`Agency`](Agency.md)

Publishing agency

***

### conditions\[available\_on\]

> **conditions\[available\_on\]**: [`FrDate`](FrDate.md)

Public Inspection issue date (YYYY-MM-DD)

***

### conditions\[docket\_id\]?

> `optional` **conditions\[docket\_id\]**: `string`

Agency docket number associated with document

***

### conditions\[special\_filing\]?

> `optional` **conditions\[special\_filing\]**: [`GetPublicInspectionDocumentsFormatConditionsSpecialFiling`](GetPublicInspectionDocumentsFormatConditionsSpecialFiling.md)

Filing type:
 * "0": Regular Filing
 * "1": Special Filing

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

***

### fields\[\]?

> `optional` **fields\[\]**: [`PublicInspectionDocumentField`](PublicInspectionDocumentField.md)

Which attributes of the documents to return; by default, a reasonable set is returned, but a user can customize it to return exactly what is needed.

***

### page?

> `optional` **page**: `number`

The page of the result set.

***

### per\_page?

> `optional` **per\_page**: `number`

How many documents to return at once; 1000 maximum.

#### Minimum

1

#### Maximum

1000

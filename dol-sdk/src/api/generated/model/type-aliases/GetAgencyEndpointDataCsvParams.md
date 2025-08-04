[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [dol-sdk/src/api/generated/model](../README.md) / GetAgencyEndpointDataCsvParams

# Type Alias: GetAgencyEndpointDataCsvParams

> **GetAgencyEndpointDataCsvParams** = `object`

## Properties

### fields?

> `optional` **fields**: [`FieldsParameter`](FieldsParameter.md)

Comma-separated list of specific field names to include in response.
If not specified, all fields are returned.

Example fields for MSHA accident dataset: mine_id, ai_dt, inj_degr_desc, operator_name, fips_state_cd, days_lost

***

### filter\_object?

> `optional` **filter\_object**: [`FilterObjectParameter`](FilterObjectParameter.md)

JSON formatted string specifying conditional filters to apply.

*Supported operators:**
- `eq` - equals
- `neq` - not equals
- `gt` - greater than
- `lt` - less than
- `in` - value is in array
- `not_in` - value is not in array
- `like` - pattern matching (use % as wildcard)

*Examples:**

Simple filter:
```json
{"field":"fips_state_cd","operator":"eq","value":"54"}
```

Filter by injury type:
```json
{"field":"inj_degr_desc","operator":"eq","value":"DAYS AWAY FROM WORK ONLY"}
```

Multiple conditions with AND:
```json
{"and":[{"field":"coal_metal_ind","operator":"eq","value":"C"},{"field":"cal_yr","operator":"eq","value":"2013"}]}
```

Multiple conditions with OR:
```json
{"or":[{"field":"value","operator":"lt","value":500},{"field":"value","operator":"gt","value":999}]}
```

Complex nested conditions:
```json
{"and":[{"field":"year","operator":"eq","value":"2021"},{"or":[{"field":"industry","operator":"eq","value":"A"},{"field":"industry","operator":"eq","value":"C"}]}]}
```

Pattern matching with LIKE:
```json
{"field":"industry","operator":"like","value":"%A%"}
```

IN operator with array:
```json
{"field":"state","operator":"in","value":["CA","NY","TX"]}
```

***

### limit?

> `optional` **limit**: [`LimitParameter`](LimitParameter.md)

Maximum number of records to return (max 10,000 records or 5MB)

#### Minimum

1

#### Maximum

10000

***

### offset?

> `optional` **offset**: [`OffsetParameter`](OffsetParameter.md)

Number of records to skip from the top of the dataset

#### Minimum

0

***

### sort?

> `optional` **sort**: [`SortParameter`](SortParameter.md)

Sort direction for the returned records

***

### sort\_by?

> `optional` **sort\_by**: [`SortByParameter`](SortByParameter.md)

Field name to sort records by

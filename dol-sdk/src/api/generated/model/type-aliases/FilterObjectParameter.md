[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [dol-sdk/src/api/generated/model](../README.md) / FilterObjectParameter

# Type Alias: FilterObjectParameter

> **FilterObjectParameter** = `string`

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

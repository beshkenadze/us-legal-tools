[**US Legal Tools SDK Documentation**](../../../../../../README.md)

***

[US Legal Tools SDK Documentation](../../../../../../README.md) / [dol-sdk/src/api/generated/model](../README.md) / FilterCondition

# Interface: FilterCondition

## Properties

### field

> **field**: `string`

Field name to apply the filter on

***

### operator

> **operator**: [`FilterConditionOperator`](../type-aliases/FilterConditionOperator.md)

Filter operator:
- eq: equals
- neq: not equals  
- gt: greater than
- lt: less than
- in: value is in array
- not_in: value is not in array
- like: pattern matching (use % as wildcard)

***

### value

> **value**: [`FilterConditionValue`](../type-aliases/FilterConditionValue.md)

Value(s) to compare against

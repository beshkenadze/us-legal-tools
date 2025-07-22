# CourtListener OpenAPI Update Prompt

Use this prompt to recreate or update the CourtListener OpenAPI specification when the API documentation changes.

## Purpose:
This prompt is designed to guide an AI assistant in generating a comprehensive OpenAPI (Swagger) JSON specification for the CourtListener REST API. The goal is to ensure that the OpenAPI spec accurately reflects the current state of the API, including all endpoints, request/response schemas, and documentation standards.
The generated OpenAPI spec will be used for SDK generation, API documentation, and client integration.

## Tools
- AI assistant with web scraping capabilities (MCP Playwright tools recommended)
- Use `bunx -y openapi-typescript courtlistener-openapi.json > /dev/null` validators to ensure compliance with the OpenAPI 3.0.3 specification

## Context:
The CourtListener API provides access to a wealth of legal data, including case law, judges, oral arguments, and citation lookups. The API is RESTful and requires token-based authentication. It supports advanced search capabilities and has specific rate limits for different endpoints.
The API documentation is available at the following URLs:
1. [API Root](https://www.courtlistener.com/api/rest/v4/?format=json)
2. [Search Operators](https://www.courtlistener.com/help/search-operators/)
3. [Citation Lookup](https://www.courtlistener.com/help/api/rest/citation-lookup/)
4. [Search API](https://www.courtlistener.com/help/api/rest/search/)
5. [Case Law API](https://www.courtlistener.com/help/api/rest/case-law/)
6. [Judges API](https://www.courtlistener.com/help/api/rest/judges/)
7. [Financial Disclosures API](https://www.courtlistener.com/help/api/rest/financial-disclosures/)
8. [Oral Arguments API](https://www.courtlistener.com/help/api/rest/oral-arguments/)
9. [PACER API](https://www.courtlistener.com/help/api/rest/pacer/)
The API supports various search operators, pagination, and has specific requirements for citation lookups. The OpenAPI spec should reflect these capabilities and provide clear documentation for developers.
## AI Assistant Instructions:
- Use the provided URLs to gather information about the API endpoints, request/response schemas, and documentation standards.
- Ensure that the generated OpenAPI spec adheres to the OpenAPI 3.0.3 specification.
- Include detailed descriptions for all endpoints, parameters, and response codes.
- Use proper data types and validation rules for request/response schemas.
- Document all possible response codes and include examples where helpful.
- Organize endpoints using proper tags (e.g., Search, Citations, Case Law, Judges, Oral Arguments).
- Ensure that the OpenAPI spec includes authentication details, server configuration, and pagination support.
- Include rate limiting information where applicable.
- Ensure that the OpenAPI spec is well-formatted and easy to read.
- Save the generated OpenAPI spec as a JSON file named `courtlistener-openapi.json`.
- Validate the generated OpenAPI spec using online validators to ensure compliance with the OpenAPI 3.0.3 specification.
- Test key endpoints to ensure accuracy and completeness of the generated OpenAPI spec.
- Update any SDK or client code that depends on the API based on the changes in the OpenAPI spec.
- Document any changes made to the OpenAPI spec and the reasons for those changes.

## Prompt for AI Assistant:

```
Read the CourtListener REST API documentation from the following URLs and convert it to OpenAPI (Swagger) JSON format:
0. https://www.courtlistener.com/api/rest/v4/?format=json Api Root
The default basic root view for the API. This is a JSON object with a list of all the available endpoints and their descriptions.
    1. Open the URL: https://www.courtlistener.com/api/rest/v4/?format=json
    2. Open each route to get models if available

Generate a comprehensive OpenAPI 3.0.3 specification that includes:

### Required Components:
- **Server configuration**: Base URL https://www.courtlistener.com/api/rest/v4
- **Authentication**: Token-based authentication (Authorization header: "Token <token>")
- **All documented endpoints** with proper HTTP methods, parameters, and responses
- **Complete schema definitions** for all request/response objects
- **Search operators documentation** in endpoint descriptions
- **Pagination support** using cursor-based pagination
- **Rate limiting information** where applicable
- **Proper tags** for organizing endpoints (Search, Citations, Case Law, Judges, Oral Arguments, etc.)

### Search API Requirements:
- Support for `type` parameter with values: o, r, rd, d, p, oa
- Advanced query operators: AND, OR, NOT, quotes, wildcards, fuzzy search, ranges
- Field-specific searches (caseName:, court_id:, dateFiled:, etc.)
- Highlighting support with `highlight=on/off`
- Ordering with `order_by` parameter

### Citation Lookup API Requirements:
- POST endpoint accepting either text blob or volume/reporter/page
- Rate limiting (60 citations/minute, 250 citations/request max)
- Status codes: 200, 300, 400, 404, 429
- Error responses with wait_util field for rate limiting

### Data Models:
Include comprehensive schemas for:
- Search results with metadata and scoring
- Dockets, Clusters, Opinions, Courts
- People (judges), Positions, Political Affiliations, Education
- Audio recordings for oral arguments
- Citation lookup results with normalization
- Pagination wrapper objects

### Documentation Standards:
- Follow OpenAPI 3.0.3 specification
- Include detailed descriptions for all endpoints and parameters
- Document all possible response codes
- Add examples where helpful
- Use proper data types and validation rules
- Include field descriptions from the API documentation

Save the result as a well-formatted JSON file named `courtlistener-openapi.json`.
```

## Usage Instructions:

1. **When to update**: Run this when CourtListener API documentation changes or new endpoints are added
2. **Tools needed**: AI assistant with web scraping capabilities (MCP Playwright tools recommended)
3. **Output location**: Save as `courtlistener-openapi.json` in the project root
4. **Validation**: After generation, validate the OpenAPI spec using online validators
5. **SDK generation**: Use the updated spec to regenerate SDK code if needed

## Key Areas to Check for Updates:

- **New endpoints**: Check if new API endpoints have been added
- **Schema changes**: Look for new fields or modified data structures  
- **Search operators**: Verify if new search operators or field names were added
- **Rate limits**: Check if throttling rules have changed
- **Authentication**: Confirm auth mechanism hasn't changed
- **Response formats**: Ensure pagination and error response formats are current

## Post-Update Tasks:

1. Validate the generated OpenAPI specification
2. Test key endpoints to ensure accuracy
3. Update any SDK or client code that depends on the API
4. Update this prompt if the process needs refinement
5. Commit changes to version control

## Notes:

- CourtListener uses cursor-based pagination, not offset-based
- Many field names use camelCase in search API vs snake_case in regular APIs
- Citation lookup has special rate limiting that differs from other endpoints
- Some endpoints may require specific USER-AGENT headers or have CORS restrictions
- The API documentation includes comprehensive field reference tables that should be preserved in the OpenAPI spec
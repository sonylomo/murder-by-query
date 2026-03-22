export interface QueryValidationResult {
	valid: boolean;
	error?: string;
	warning?: string;
}

const DANGEROUS_PATTERNS = [
	/\bDROP\b/gi,
	/\bDELETE\b/gi,
	/\bUPDATE\b/gi,
	/\bINSERT\b/gi,
	/\bALTER\b/gi,
	/\bTRUNCATE\b/gi,
	/\bREPLACE\b/gi,
	/\bCREATE\b/gi,
	/\bATTACH\b/gi,
	/\bDETACH\b/gi,
];

const _ALLOWED_SELECT_PATTERNS = [
	/\bSELECT\b/gi,
	/\bFROM\b/gi,
	/\bWHERE\b/gi,
	/\bAND\b/gi,
	/\bOR\b/gi,
	/\bJOIN\b/gi,
	/\bINNER\b/gi,
	/\bLEFT\b/gi,
	/\bRIGHT\b/gi,
	/\bON\b/gi,
	/\bGROUP\b/gi,
	/\bBY\b/gi,
	/\bHAVING\b/gi,
	/\bORDER\b/gi,
	/\bLIMIT\b/gi,
	/\bOFFSET\b/gi,
	/\bDISTINCT\b/gi,
	/\bAS\b/gi,
	/\bCASE\b/gi,
	/\bWHEN\b/gi,
	/\bTHEN\b/gi,
	/\bELSE\b/gi,
	/\bEND\b/gi,
	/\bCOUNT\b/gi,
	/\bSUM\b/gi,
	/\bAVG\b/gi,
	/\bMAX\b/gi,
	/\bMIN\b/gi,
	/\bIN\b/gi,
	/\bNOT\b/gi,
	/\bNULL\b/gi,
	/\bBETWEEN\b/gi,
	/\bLIKE\b/gi,
	/\bIS\b/gi,
];

export function validateQuery(query: string): QueryValidationResult {
	if (!query || query.trim().length === 0) {
		return {
			valid: false,
			error: "Query cannot be empty",
		};
	}

	const trimmedQuery = query.trim();

	// Check for dangerous keywords
	for (const pattern of DANGEROUS_PATTERNS) {
		if (pattern.test(trimmedQuery)) {
			return {
				valid: false,
				error: `Query contains forbidden operation: ${pattern.source.match(/\w+/)?.[0]}. Only SELECT queries are allowed.`,
			};
		}
	}

	// Check if it starts with SELECT
	// if (!/^\s*SELECT\b/gi.test(trimmedQuery)) {
	// 	return {
	// 		valid: false,
	// 		error:
	// 			"Only SELECT queries are allowed. Your query must start with SELECT.",
	// 	};
	// }

	// Check for SQL injection patterns
	// if (/['"];?\s*;/g.test(trimmedQuery) || /--\s*$|\/\*/g.test(trimmedQuery)) {
	//   return {
	//     valid: false,
	//     error: 'Query contains suspicious patterns that may indicate SQL injection attempt.',
	//   };
	// }

	return { valid: true };
}

export function parseQuery(query: string): { table: string; isJoin: boolean } {
	const selectMatch = query.match(/FROM\s+(\w+)/i);
	const joinMatch = query.match(/JOIN/i);

	return {
		table: selectMatch ? selectMatch[1] : "unknown",
		isJoin: !!joinMatch,
	};
}

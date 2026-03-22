export interface Clue {
	id: number;
	unlockLevel: number;
	category: string;
	hint: string;
	queryKeywords: string[];
}

export interface Mystery {
	id: string;
	title: string;
	brief: string;
	correctSuspectId: number;
	clues: Clue[];
}

export const MYSTERY_DATA: Record<string, Mystery> = {
	winchester: {
		id: "winchester",
		title: "Murder at Winchester Manor",
		brief:
			"A prestigious estate has been thrown into chaos following the sudden death of its owner, Charles Winchester. The victim was found in the library late evening. Five individuals had access to the estate that day, each with potential motives and suspicious behavior.",
		correctSuspectId: 2, // Margaret Winchester
		clues: [
			{
				id: 1,
				unlockLevel: 0,
				category: "Cause of Death",
				hint: "Find out what killed the victim by examining the evidence table.",
				queryKeywords: ["SELECT", "FROM", "evidence", "WHERE", "description"],
			},
			{
				id: 2,
				unlockLevel: 1,
				category: "Staff Background",
				hint: "Examine connections between the staff and medical professionals.",
				queryKeywords: ["SELECT", "FROM", "suspect", "JOIN", "ON"],
			},
			{
				id: 3,
				unlockLevel: 2,
				category: "Communications",
				hint: "Check the events for any suspicious phone calls during the evening.",
				queryKeywords: ["SELECT", "FROM", "event", "WHERE", "time", "LIKE"],
			},
			{
				id: 4,
				unlockLevel: 3,
				category: "Purchase History",
				hint: "Search evidence for purchases made under aliases or from unusual suppliers.",
				queryKeywords: [
					"SELECT",
					"FROM",
					"evidence",
					"WHERE",
					"LIKE",
					"venerinary",
				],
			},
			{
				id: 5,
				unlockLevel: 4,
				category: "Motive Analysis",
				hint: "Look for financial or inheritance-related documents in the evidence.",
				queryKeywords: ["SELECT", "FROM", "evidence", "WHERE", "name", "LIKE"],
			},
		],
	},
	hidden: {
		id: "hidden",
		title: "The Hidden Truth",
		brief:
			"An artist's home was allegedly broken into, yet no obvious theft occurred. Instead, her artwork was damaged and she was found unconscious hours later. Inconsistencies in the story suggest something more sinister may have been orchestrated.",
		correctSuspectId: 2, // James Hart
		clues: [
			{
				id: 1,
				unlockLevel: 0,
				category: "Forensics",
				hint: "Investigate the broken glass at the studio and which side it fell on.",
				queryKeywords: [
					"SELECT",
					"FROM",
					"evidence",
					"WHERE",
					"name",
					"LIKE",
					"window",
				],
			},
			{
				id: 2,
				unlockLevel: 1,
				category: "Financial Gain",
				hint: "Check for recent changes in life insurance or large wire transfers.",
				queryKeywords: [
					"SELECT",
					"FROM",
					"evidence",
					"WHERE",
					"description",
					"LIKE",
				],
			},
			{
				id: 3,
				unlockLevel: 2,
				category: "Relationships",
				hint: "Search for hidden family connections among the suspects and staff.",
				queryKeywords: ["SELECT", "FROM", "suspect", "WHERE", "motive", "LIKE"],
			},
			{
				id: 4,
				unlockLevel: 3,
				category: "Collaborations",
				hint: "Look for events where multiple suspects were seen together recently.",
				queryKeywords: ["SELECT", "FROM", "event", "GROUP BY", "HAVING"],
			},
		],
	},
	heist: {
		id: "heist",
		title: "The Vintage Jewel Heist",
		brief:
			"A rare and priceless ruby has vanished from the most secure museum vault. Security footage was corrupted at a critical moment. Multiple suspects had access and expertise, but who orchestrated this heist?",
		correctSuspectId: 3, // Detective James Walsh
		clues: [
			{
				id: 1,
				unlockLevel: 0,
				category: "Equipment",
				hint: "Examine the specialized electronics found at the scene in the evidence table.",
				queryKeywords: ["SELECT", "FROM", "evidence", "WHERE", "name", "LIKE"],
			},
			{
				id: 2,
				unlockLevel: 1,
				category: "Access Logs",
				hint: "Check the event logs for vault access shortly before the theft was discovered.",
				queryKeywords: [
					"SELECT",
					"FROM",
					"event",
					"WHERE",
					"description",
					"LIKE",
					"vault",
				],
			},
			{
				id: 3,
				unlockLevel: 2,
				category: "Corruption",
				hint: "Investigate financial transfers from suspects to low-level employees.",
				queryKeywords: [
					"SELECT",
					"FROM",
					"evidence",
					"WHERE",
					"description",
					"LIKE",
					"transfer",
				],
			},
			{
				id: 4,
				unlockLevel: 3,
				category: "Footage",
				hint: "Look for alibis confirmed or denied by the remaining security logs.",
				queryKeywords: [
					"SELECT",
					"FROM",
					"event",
					"WHERE",
					"suspect_id",
					"IS NULL",
				],
			},
		],
	},
};

import initSqlJs, { Database } from 'sql.js';

let SQL: any = null;
let db: Database | null = null;

export async function initDB() {
  if (db) return db;

  SQL = await initSqlJs({
    locateFile: file => `/${file}`
  });
  db = new SQL.Database();
  return db;
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db;
}

export async function resetDB() {
  db = null;
}

export async function createSchema() {
  const database = getDB();

  // Winchester Manor schema
  database.run(`
    CREATE TABLE IF NOT EXISTS suspect (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      motive TEXT
    )
  `);

  database.run(`
    CREATE TABLE IF NOT EXISTS event (
      id INTEGER PRIMARY KEY,
      time TEXT NOT NULL,
      description TEXT NOT NULL,
      suspect_id INTEGER,
      FOREIGN KEY (suspect_id) REFERENCES suspect(id)
    )
  `);

  database.run(`
    CREATE TABLE IF NOT EXISTS evidence (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      found_by TEXT
    )
  `);
}

export async function seedWinchesterManor() {
  const database = getDB();

  // Clear existing data
  database.run('DELETE FROM suspect');
  database.run('DELETE FROM event');
  database.run('DELETE FROM evidence');

  // Suspects (inspired by The Housemaid, but with original names)
  database.run(`INSERT INTO suspect (id, name, role, motive) VALUES 
    (1, 'Charles Winchester', 'Estate Owner', 'Inheritance complications'),
    (2, 'Margaret Winchester', 'Estate Manager', 'Jealousy over attention'),
    (3, 'Dr. Thomas Reed', 'Family Physician', 'Unpaid debts'),
    (4, 'Elena Vasquez', 'New Household Staff', 'Unknown connection'),
    (5, 'Victor Ashford', 'Legal Advisor', 'Financial impropriety')
  `);

  // Events
  database.run(`INSERT INTO event (id, time, description, suspect_id) VALUES 
    (1, '19:00', 'Guest arrived at mansion', 4),
    (2, '19:45', 'Arguments heard in study', 1),
    (3, '20:30', 'Telephone call made to lawyer', 5),
    (4, '21:15', 'Scream from upstairs', NULL),
    (5, '21:20', 'Body discovered in library', NULL),
    (6, '21:25', 'Elena seen near kitchen', 4),
    (7, '21:30', 'Dr. Reed summoned', 3),
    (8, '22:00', 'Police arrive', NULL)
  `);

  // Evidence
  database.run(`INSERT INTO evidence (id, name, location, description, found_by) VALUES 
    (1, 'Torn Letter', 'Library Floor', 'Letter fragment mentioning money', 'Detective'),
    (2, 'Empty Poison Bottle', 'Kitchen Cabinet', 'Medicine cabinet, no label', 'Detective'),
    (3, 'Wet Footprints', 'Study to Library', 'Muddy prints leading to crime scene', 'Detective'),
    (4, 'Financial Records', 'Study Desk', 'Documents showing large debts', 'Detective'),
    (5, 'Telegram', 'Entrance Hall Table', 'Urgent message from London', 'Margaret'),
    (6, 'Witness Statement', 'Interview Room', 'Margaret claims she was reading', 'Police')
  `);
}

export async function seedHiddenDrawings() {
  const database = getDB();

  // Clear existing data
  database.run('DELETE FROM suspect');
  database.run('DELETE FROM event');
  database.run('DELETE FROM evidence');

  // Suspects (inspired by Hidden Pictures, but with original names)
  database.run(`INSERT INTO suspect (id, name, role, motive) VALUES 
    (1, 'Rebecca Hart', 'Artist Resident', 'Mental instability'),
    (2, 'James Hart', 'Architect Husband', 'Insurance fraud'),
    (3, 'Dr. Patricia Stone', 'Therapist', 'Professional negligence'),
    (4, 'Marcus Chen', 'Gallery Owner', 'Stolen artwork'),
    (5, 'Nina Volkov', 'Housekeeper', 'Hidden past')
  `);

  // Events
  database.run(`INSERT INTO event (id, time, description, suspect_id) VALUES 
    (1, '14:00', 'Rebecca called 911 reporting intrusion', 1),
    (2, '14:15', 'James returns from work site', 2),
    (3, '14:30', 'Police arrive, find no signs of break-in', NULL),
    (4, '15:00', 'Marcus Chen visits studio unannounced', 4),
    (5, '15:45', 'Rebecca found unconscious in studio', 1),
    (6, '16:00', 'Dr. Stone called to scene', 3),
    (7, '16:30', 'Evidence of missing artwork discovered', NULL),
    (8, '17:00', 'Investigation begins', NULL)
  `);

  // Evidence
  database.run(`INSERT INTO evidence (id, name, location, description, found_by) VALUES 
    (1, 'Smashed Window', 'Studio', 'Glass broken from inside, not outside', 'Police'),
    (2, 'Torn Canvas', 'Floor', 'Rebecca''s unfinished painting slashed', 'Police'),
    (3, 'Medication Bottles', 'Bedroom', 'High doses prescribed, some missing', 'Police'),
    (4, 'Gallery Receipt', 'Desk', 'Payment to Marcus Chen for recent sales', 'Police'),
    (5, 'Journal Entries', 'Nightstand', 'Increasingly paranoid writing', 'Police'),
    (6, 'Wire Transfer Records', 'Computer', 'Large payments from James to offshore account', 'Police')
  `);
}

export async function seedVintageHeist() {
  const database = getDB();

  // Clear existing data
  database.run('DELETE FROM suspect');
  database.run('DELETE FROM event');
  database.run('DELETE FROM evidence');

  // Suspects (original heist mystery)
  database.run(`INSERT INTO suspect (id, name, role, motive) VALUES 
    (1, 'Augustus Fletcher', 'Museum Director', 'Career advancement'),
    (2, 'Sophia Laurent', 'Auction House Manager', 'Financial gain'),
    (3, 'Detective James Walsh', 'Police Detective', 'Corruption'),
    (4, 'Henry Blackwell', 'Jeweler Appraiser', 'Revenge'),
    (5, 'Lily Morrison', 'Security Guard', 'Coercion')
  `);

  // Events
  database.run(`INSERT INTO event (id, time, description, suspect_id) VALUES 
    (1, '08:00', 'Museum opens normally', NULL),
    (2, '09:30', 'Vault inspection routine check', NULL),
    (3, '11:45', 'Augustus Fletcher called emergency meeting', 1),
    (4, '12:00', 'Theft discovered - Ruby Diamond missing', NULL),
    (5, '12:15', 'Police called, Detective Walsh arrives quickly', 3),
    (6, '13:00', 'Sophia Laurent questioned at office', 2),
    (7, '14:30', 'Security footage requested but corrupted', NULL),
    (8, '15:00', 'Auction record found for identical ruby', NULL)
  `);

  // Evidence
  database.run(`INSERT INTO evidence (id, name, location, description, found_by) VALUES 
    (1, 'Bypass Device', 'Vault Lock', 'Sophisticated electronic bypass found hidden', 'Forensics'),
    (2, 'Auction Catalog', 'Sophia''s Office', 'Lists stolen ruby with exact specifications', 'Police'),
    (3, 'Detective Log', 'Police Records', 'Walsh logged vault access 2 hours before discovery', 'Internal Affairs'),
    (4, 'Diamond Receipt', 'Henry''s Workshop', 'Documentation for recent certification work', 'Police'),
    (5, 'Security Schedule', 'Guard Station', 'Lily''s shift changed day before theft', 'Police'),
    (6, 'Communication Records', 'Phone Company', 'Call pattern between Fletcher and Laurent', 'Police')
  `);
}

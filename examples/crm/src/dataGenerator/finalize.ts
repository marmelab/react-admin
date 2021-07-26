import { Db } from './types';

export const finalize = (db: Db) => {
    // set contact status according to latest note
    db.contactNotes
        .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
        .forEach(note => {
            db.contacts[note.contact_id as number].status = note.status;
        });
};

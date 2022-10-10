import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
    // Get data submitted in request's body.
    const body = req.body

    // Optional logging to see the responses
    // in the command line where next.js app is running.
    console.log('body: ', body)

    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!body.blocker) {
        // Sends a HTTP bad request error code
        return res.status(400).json({ error: 'please provide a blocker' })
    }

    let insertedId = await addBlocker(body.blocker);
    // Found the name.
    // Sends a HTTP success code
    res.status(200).json({ result: 'added', insert_id: `${insertedId}`})
}

export async function addBlocker(blocker) {
    const client = await clientPromise;

    const db = client.db("admin");

    const doc = {
        blocker_name: blocker
    }

    const result = await db.collection("blockers").insertOne(doc);

    console.log(`A document was inserted with the _id: ${result.insertedId}`);

    return await result.insertedId;
};
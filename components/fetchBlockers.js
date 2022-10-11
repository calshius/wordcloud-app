import clientPromise from "../lib/mongodb";

export default async function fetchBlockers() {
    const client = await clientPromise;
    let data

    const db = client.db(process.env.MONGODB_DATBASE);
    const collection = db.collection("blockers")

    data = await collection.aggregate([{ $group: { _id: '$blocker_name', count: { $sum: 1 } } }, { $sort: { count: -1 } }]).toArray();
    return await data;
};
export default function Form() {
    return (
        <form action="/api/addBlocker" method="post">
            <label htmlFor="blocker">Your cloud blocker</label>
            <input type="text" id="blocker" name="blocker" required />

            <button type="submit">Submit</button>
        </form>
    )
}
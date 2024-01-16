import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { App } from "./App";

test("should pass", async () => {
	vi.spyOn(window, "scrollTo").mockImplementation(() => {});
	render(<App />);

	// Sign in
	fireEvent.change(await screen.findByLabelText("Username *"), {
		target: { value: "janedoe" },
	});
	fireEvent.change(await screen.findByLabelText("Password *"), {
		target: { value: "password" },
	});
	fireEvent.click(await screen.findByText("Sign in"));

	// Open the first post
	fireEvent.click(await screen.findByText("Post 1"));
	// Update its title
	fireEvent.change(await screen.findByDisplayValue("Post 1"), {
		target: { value: "Post 1 edited" },
	});
	fireEvent.click(await screen.findByText("Save"));
	await screen.findByText("Post 1 edited");

	// Navigate to the comments
	fireEvent.click(await screen.findByText("Comments"));
	// Open the first comment
	fireEvent.click(await screen.findByText("Comment 1"));
	// Edit the comment selected post
	fireEvent.click(await screen.findByDisplayValue("#0"));
	fireEvent.click(await screen.findByText("#11"));
	fireEvent.click(await screen.findByText("Save"));
	// Check the comment has been updated by finding the post link in the comments list page
	await screen.findByText("#11", { selector: "a *" });
});

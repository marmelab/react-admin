import { fireEvent, render, screen } from "@testing-library/react";
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

	// Test posts
	fireEvent.click(await screen.findByText("Post 1"));
	fireEvent.change(await screen.findByDisplayValue("Post 1"), {
		target: { value: "Post 1 edited" },
	});
	fireEvent.click(await screen.findByText("Save"));
	await screen.findByText("Post 1 edited");

	// Test comments
	fireEvent.click(await screen.findByText("Comments"));
	fireEvent.click(await screen.findByText("Comment 1"));
	fireEvent.click(await screen.findByDisplayValue("#0"));
	fireEvent.click(await screen.findByText("#11"));
	fireEvent.click(await screen.findByText("Save"));
	await screen.findByText("#11", { selector: "a *" });
});

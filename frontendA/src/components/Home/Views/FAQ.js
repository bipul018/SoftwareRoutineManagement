import React from "react";
import { Collapse, Button } from "antd";
import "./Views.css";
import { List } from "antd/lib";
import Item from "antd/lib/list/Item";

const { Panel } = Collapse;

function AppFAQ() {
	return (
		<div id="faq" className="block faqBlock">
			<div className="container-fluid">
				<div className="titleHolder">
					
					<p> Some questions you may have </p>
				</div>
				<Collapse defaultActiveKey={["0"]}>
					<Panel header="How do I manage my Account?" key="1">
						<p>
							Accounts are no longer used. This application is intended for admin use only. Please ignore any remaining instances of accounts.
						</p>
					</Panel>
					<Panel
						header="What features are available?"
						key="3">
						<p>
							<List >
								<p>1. The routine can be freely edited by adding new classes, editing existing classes or deleting classes.</p>
								<p>2. The add class button appears at the middle of any empty cell on hovering.</p>
								<p>3. The edit and delete class button appears at the center lower end of any class cell on hovering.</p>
								
								<p>4. Any overlap of teachers in different classes at the same time slot is notified.</p>
								<p>5. Any time overlap of new classes with old classes is notified.</p>
								<p>6. Overlapped labs are displayed by dividing into subrows.</p>
							</List>
						</p>
					</Panel>
					<Panel
						header="Why are some features missing?"
						key="4">
						<p>
							The codebase for this application was in a dire state when we were assigned with this project, and only worked for the dummy that was used for the demo. A lot of dependencies were, and still are, deprecated. 
							A majority of the time was spent in making the application actually functional by refactoring the codebase, locating bugs, and making quality of life improvements. All while learning web development for the first time. 
							Hence, the application is far from perfect and may have some features missing that might have slipped our minds. For these features, please inform the new batch of software engineering students. Thank you. 
						</p>
					</Panel>
				</Collapse>

			</div>
		</div>
	);
}

export default AppFAQ;

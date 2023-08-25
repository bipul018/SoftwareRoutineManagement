import React from "react";
import { Collapse, Button } from "antd";
import "./Views.css";

const { Panel } = Collapse;

function AppFAQ() {
	return (
		<div id="faq" className="block faqBlock">
			<div className="container-fluid">
				<div className="titleHolder">
					<h2>
						<strong>Frequently Asked Question</strong>{" "}
					</h2>
					<p> Solving queries about the app </p>
				</div>
				<Collapse defaultActiveKey={["1"]}>
					<Panel header="How do I manage my Account?" key="1">
						<p>
							Accounts are managed directly by the IT Block of
							ICTC. Initially , respective ID and passwords are
							provided to all the faculty heads and teachers .
							Later on , your accounts private profile can be
							modified according to ur identification.
						</p>
					</Panel>
					<Panel header="How do I change my password?" key="2">
						<p>
							"Forgot my Password" appears as in all other apps.
							When clicked on that , the page is redirected to to
							the IT block of ICTC and the password changing code
							is provided to you via college mail.
						</p>
					</Panel>
					<Panel
						header="What special features are for Admin?"
						key="3">
						<p>
							CONTENTS TO BE FILLED BY BACKEND-ERS!!! DO FILL IT.
						</p>
					</Panel>
					<Panel
						header="What special features are for Teaching staffs?"
						key="4">
						<p>
							CONTENTS TO BE FILLED BY BACKEND-ERS!!! DO FILL IT.
						</p>
					</Panel>
				</Collapse>
				<div className="quickSupport">
					<h1>
						<strong>
							Want Immediate Responses for the Queries?
						</strong>
					</h1>
					<p>
						Sorry for the inconveniences. You can email us for your
						further queries. We will try to solve it within a day or
						two. Thank you !!!
					</p>
					<Button
						type="primary"
						size="large"
						href="https://www.google.com/gmail">
						<i className="fas fa-envelope"></i>Email your Question
					</Button>
				</div>
			</div>
		</div>
	);
}

export default AppFAQ;

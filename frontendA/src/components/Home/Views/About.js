import React from "react";
import { Row, Col } from "antd";
import "./Views.css";

//import Item from 'antd/lib/list/Item';

const items = [
	{
		key: "1",
		icon: <i className="fas fa-chart-pie"></i>,
		title: "Add and edit",
		content:
			"Add and edit classes, programs, subjects, teachers and so on",
	},
	{
		key: "2",
		icon: <i className="fas fa-desktop"></i>,
		title: "Warnings",
		content: "Warnings are shown on teacher and period collisions/overlap.",
	},
	{
		key: "3",
		icon: <i className="fas fa-database"></i>,
		title: "Teacher routines",
		content: "View routines of any teacher in the database",
	},
];

function AppAbout() {
	return (
		<div id="about" className="block aboutBlock">
			<div className="container-fluid">
				<div className="titleHolder">
					<h2>
						<strong>About Us</strong>
					</h2>
					<p>Get more idea about our app</p>
				</div>

				<div className="contentHolder">
					<p>
						This application is an attempt at easing the task of routine making.{" "}
					</p>
				</div>
				<Row gutter={[16, 16]}>
					{items.map((item) => {
						return (
							<Col span={8} key={item.key}>
								<div className="content">
									<div className="icon">{item.icon}</div>
									<h3>{item.title}</h3>
									<p>{item.content}</p>
								</div>
							</Col>
						);
					})}
				</Row>
			</div>
		</div>
	);
}

export default AppAbout;

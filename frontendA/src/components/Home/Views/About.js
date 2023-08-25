import React from "react";
import { Row, Col } from "antd";
import "./Views.css";

//import Item from 'antd/lib/list/Item';

const items = [
	{
		key: "1",
		icon: <i className="fas fa-chart-pie"></i>,
		title: "High performance",
		content:
			"speedy working capability in comparison to similar related apps",
	},
	{
		key: "2",
		icon: <i className="fas fa-desktop"></i>,
		title: "Web compatible",
		content: "compatible in every domain",
	},
	{
		key: "3",
		icon: <i className="fas fa-database"></i>,
		title: "Simplified workflow",
		content: "simplifies the making of routine for different faculties",
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
						We designed this application to ease the tedious task of
						manually routine creation . Also taking in consideration
						the fact that PUlchowk being a college with very large
						numbers of facultied . To ease the task , this app is
						developed.{" "}
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

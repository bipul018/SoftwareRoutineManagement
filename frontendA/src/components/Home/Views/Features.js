import React from "react";
import { Row, Col } from "antd";
import { Card } from "antd";

import image1 from "../../../assets/images/modern-design.jpg";
import image2 from "../../../assets/images/clean-design.jpg";
import image3 from "../../../assets/images/great-support.jpg";
import image4 from "../../../assets/images/advanced-option.jpg";
import "./Views.css";

const { Meta } = Card;

function AppFeature() {
	return (
		<div id="feature" className="block featureBlock bgGray">
			<div className="container-fluid">
				<div className="titleHolder">
					<h2>
						<strong>Key Features and Benefits</strong>
					</h2>
				</div>
				<Row gutter={[24, 24]}>
					<Col span={12}>
						<Card
							hoverable
							cover={<img alt="Modified Design" src={image1} />}>
							<Meta title="Modified Design" />
						</Card>
					</Col>
					<Col span={12}>
						<Card
							hoverable
							cover={
								<img
									alt="Clean and Distinct workspace"
									src={image2}
								/>
							}>
							<Meta title="Clean and Distinct workspace" />
						</Card>
					</Col>
					<Col span={12}>
						<Card
							hoverable
							cover={<img alt="Great Support" src={image3} />}>
							<Meta title="Great Support" />
						</Card>
					</Col>
					<Col span={12}>
						<Card
							hoverable
							cover={<img alt="Advanced Options" src={image4} />}>
							<Meta title="Advanced Options" />
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
}

export default AppFeature;

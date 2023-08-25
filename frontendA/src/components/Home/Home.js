import React from "react";
import AppHero from "./Views/Hero";
import AppAbout from "./Views/About";
import AppFeature from "./Views/Features";
import AppFAQ from "./Views/FAQ";

import AppContact from "./Views/Contact";
import "./Home.css";

function AppHome() {
	return (
		<div className="main">
			<AppHero />
			<AppAbout />
			<AppFeature />
			<AppFAQ />
			<AppContact />
		</div>
	);
}

export default AppHome;

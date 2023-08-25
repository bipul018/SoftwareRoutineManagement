import React from "react";
// import { Carousel, Button } from "antd";
import { Carousel } from "antd";
import "./Views.css";

// const items = [
//   {
//     key: "1",
//     title: <strong>Welcome to be Routine Management</strong>,
//     content: <strong>1st page of the routine management</strong>,
//   },
// ];

function AppHero() {
  return (
    <div id="hero" className="heroBlock">
      <div id="background-img"></div>
      <Carousel>
        {/* {items.map((item) => {
					return (
						<div className="container-fluid">
							<div className="content">
								<h3>{item.title}</h3>
								<p>{item.content}</p> */}
        {/* <div className="btnHolder">
                  <Button type="primary" size="large">
                    Login
                  </Button>
                </div> */}
        {/* </div>
						</div>
					);
				})} */}
      </Carousel>
    </div>
  );
}

export default AppHero;

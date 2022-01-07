import React from "react";


// displays a page header

export default function Header() {
  return (
    <div>
      <img className="logo" src={process.env.PUBLIC_URL +"/OracleFactory.png"} alt="Oracle factory workshop"/>
    </div>
     
  );
}

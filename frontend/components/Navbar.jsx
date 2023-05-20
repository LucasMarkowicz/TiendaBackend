import React from "react";
import Cartwidget from "./Cartwidget";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-light ">
        <div className="container-fluid ">
          <NavLink className="navbar-brand" to="/">
            Tienda Apple Import
            <img src="../public/images/Apple.png" className="logoApple"></img>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml 500 ">
              <li className="nav-item">
                <NavLink className="nav-link " to="/">
                  ALL
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link " to="/remeras">
                  REMERAS
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link " to="/pantalones">
                  PANTALONES
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link " to="/buzos">
                  BUZOS
                </NavLink>
              </li>
            </ul>
          </div>
          <Cartwidget></Cartwidget>
        </div>
      </nav>
      <main></main>
    </div>
  );
}

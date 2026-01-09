import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Collapse } from "reactstrap";
import navdata from "../LayoutMenuData";
import { withTranslation } from "react-i18next";
import withRouter from "../../Components/Common/withRouter";

const VerticalLayout = (props: any) => {
  const navData = navdata().props.children;

  return (
    <>
      {(navData || []).map((item: any, key: number) => (
        <React.Fragment key={key}>
          {/* ===== HEADER ===== */}
          {item.isHeader ? (
            <li className="menu-title">
              <span data-key="t-menu">{props.t(item.label)}</span>
            </li>
          ) : item.subItems ? (
            /* ===== MENU WITH SUBMENU ===== */
            <li className="nav-item">
              <Link
                to="/#"
                className="nav-link menu-link"
                data-bs-toggle="collapse"
                aria-expanded={item.stateVariables ? "true" : "false"}
                onClick={item.click}
              >
                {/* LEFT ICON */}
                {item.icon && <i className={item.icon}></i>}

                <span data-key={item.label}>{props.t(item.label)}</span>
              </Link>

              <Collapse className="menu-dropdown" isOpen={item.stateVariables}>
                <ul className="nav nav-sm flex-column">
                  {item.subItems.map((sub: any, idx: number) => (
                    <li className="nav-item" key={idx}>
                      <Link
                        to={sub.link}
                        className="nav-link"
                        onClick={sub.click}
                      >
                        {props.t(sub.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>
          ) : (
            /* ===== SINGLE MENU ===== */
            <li className="nav-item">
              <Link
                to={item.link}
                className="nav-link menu-link"
                onClick={item.click}
              >
                {item.icon && <i className={item.icon}></i>}
                <span data-key={item.label}>{props.t(item.label)}</span>
              </Link>
            </li>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

VerticalLayout.propTypes = {
  t: PropTypes.any,
};

export default withRouter(withTranslation()(VerticalLayout));

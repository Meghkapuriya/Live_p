import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Col, Collapse, Row } from "reactstrap";
import withRouter from "../../Components/Common/withRouter";
import navdata from "../LayoutMenuData";
import { withTranslation } from "react-i18next";

const HorizontalLayout = (props: any) => {
  const [isMoreMenu, setIsMoreMenu] = useState(false);

  const navData = navdata().props.children;

  let menuItems: any[] = [];
  let splitMenuItems: any[] = [];
  let menuSplitContainer = 6;

  navData.forEach((item: any, key: number) => {
    if (item.isHeader) {
      menuSplitContainer++;
    }

    if (key >= menuSplitContainer) {
      splitMenuItems.push({
        ...item,
        isChildItem: !!item.subItems,
        childItems: item.subItems || [],
      });
    } else {
      menuItems.push(item);
    }
  });

  // MORE MENU
  if (splitMenuItems.length > 0) {
    menuItems.push({
      id: "more",
      label: "More",
      icon: "ri-briefcase-2-line",
      link: "#",
      stateVariables: isMoreMenu,
      className: `nav-link menu-link ${isMoreMenu ? "active" : ""}`,
      click: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsMoreMenu((prev) => !prev);
      },
      subItems: splitMenuItems,
    });
  }

  return (
    <>
      {(menuItems || []).map((item: any, key: number) => (
        <React.Fragment key={key}>
          {item.isHeader ? (
            <li className="menu-title">
              <span>{props.t(item.label)}</span>
            </li>
          ) : item.subItems ? (
            <li className="nav-item">
              <Link
                to={item.link || "/#"}
                onClick={item.click}
                className={item.className || "nav-link menu-link"}
                aria-expanded={item.stateVariables}
              >
                {item.icon && <i className={item.icon}></i>}{" "}
                <span>{props.t(item.label)}</span>
              </Link>

              <Collapse
                isOpen={item.stateVariables}
                className={
                  item.id === "baseUi" && item.subItems.length > 13
                    ? "menu-dropdown mega-dropdown-menu"
                    : "menu-dropdown"
                }
              >
                {item.id === "baseUi" && item.subItems.length > 13 ? (
                  <Row>
                    {item.subItems.map((subItem: any, idx: number) => (
                      <Col lg={4} key={idx}>
                        <ul className="nav nav-sm flex-column">
                          <li className="nav-item">
                            <Link
                              to={subItem.link}
                              className={subItem.className || "nav-link"}
                              onClick={subItem.click}
                            >
                              {props.t(subItem.label)}
                            </Link>
                          </li>
                        </ul>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <ul className="nav nav-sm flex-column">
                    {item.subItems.map((subItem: any, idx: number) => (
                      <li className="nav-item" key={idx}>
                        <Link
                          to={subItem.link || "/#"}
                          className={subItem.className || "nav-link"}
                          onClick={subItem.click}
                        >
                          {props.t(subItem.label)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Collapse>
            </li>
          ) : (
            <li className="nav-item">
              <Link
                to={item.link}
                onClick={item.click}
                className={item.className || "nav-link menu-link"}
              >
                {item.icon && <i className={item.icon}></i>}{" "}
                <span>{props.t(item.label)}</span>
              </Link>
            </li>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

HorizontalLayout.propTypes = {
  t: PropTypes.any,
};

export default withRouter(withTranslation()(HorizontalLayout));

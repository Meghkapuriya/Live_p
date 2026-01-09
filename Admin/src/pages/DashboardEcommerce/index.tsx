import React from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

const DashboardEcommerce: React.FC = () => {
  document.title = "Admin Dashboard";
  const navigate = useNavigate();

  return (
    <div className="page-content">
      <Container fluid>
        {/* ================= HEADER ================= */}
        <Row className="mb-4 align-items-center">
          <Col md={8}>
            <h4 className="mb-1 fw-semibold">Good Morning, Admin 👋</h4>
            <p className="text-muted mb-0">
              Here’s what’s happening with your platform today.
            </p>
          </Col>

          <Col md={4} className="mt-3 mt-md-0">
            <div className="d-flex justify-content-md-end justify-content-start gap-2 flex-wrap">
              <Button
                color="primary"
                onClick={() => navigate("/events/create")}
              >
                + Add Event
              </Button>

              <Button
                color="success"
                onClick={() => navigate("/members/create")}
              >
                + Add Member
              </Button>

              <Button
                color="info"
                onClick={() => navigate("/announcements/create")}
              >
                + Add Announcement
              </Button>
            </div>
          </Col>
        </Row>

        {/* ================= STATS ================= */}
        <Row>
          {/* EVENTS */}
          <Col xl={3} md={6} className="mb-4">
            <Card className="shadow-sm dashboard-card">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">EVENTS</p>
                    <h4 className="fw-bold mb-0">24</h4>
                    <p className="text-success mt-2 mb-0">
                      ↑ Active & Upcoming
                    </p>
                  </div>
                  <div className="avatar-sm bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center">
                    <i className="ri-calendar-event-line text-primary fs-3" />
                  </div>
                </div>

                <Button
                  size="sm"
                  color="link"
                  className="mt-3 p-0"
                  onClick={() => navigate("/events/list")}
                >
                  View all events →
                </Button>
              </CardBody>
            </Card>
          </Col>

          {/* ANNOUNCEMENTS */}
          <Col xl={3} md={6} className="mb-4">
            <Card className="shadow-sm dashboard-card">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">ANNOUNCEMENTS</p>
                    <h4 className="fw-bold mb-0">12</h4>
                    <p className="text-info mt-2 mb-0">↑ Live announcements</p>
                  </div>
                  <div className="avatar-sm bg-info bg-opacity-10 rounded d-flex align-items-center justify-content-center">
                    <i className="ri-notification-3-line text-info fs-3" />
                  </div>
                </div>

                <Button
                  size="sm"
                  color="link"
                  className="mt-3 p-0"
                  onClick={() => navigate("/announcements/list")}
                >
                  View announcements →
                </Button>
              </CardBody>
            </Card>
          </Col>

          {/* MEMBERS */}
          <Col xl={3} md={6} className="mb-4">
            <Card className="shadow-sm dashboard-card">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">MEMBERS</p>
                    <h4 className="fw-bold mb-0">56</h4>
                    <p className="text-warning mt-2 mb-0">↑ Active members</p>
                  </div>
                  <div className="avatar-sm bg-warning bg-opacity-10 rounded d-flex align-items-center justify-content-center">
                    <i className="ri-team-line text-warning fs-3" />
                  </div>
                </div>

                <Button
                  size="sm"
                  color="link"
                  className="mt-3 p-0"
                  onClick={() => navigate("/members/list")}
                >
                  View members →
                </Button>
              </CardBody>
            </Card>
          </Col>

          {/* SYSTEM STATUS */}
          <Col xl={3} md={6} className="mb-4">
            <Card className="shadow-sm dashboard-card">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">SYSTEM STATUS</p>
                    <h4 className="fw-bold mb-0">Online</h4>
                    <p className="text-success mt-2 mb-0">
                      All services running
                    </p>
                  </div>
                  <div className="avatar-sm bg-success bg-opacity-10 rounded d-flex align-items-center justify-content-center">
                    <i className="ri-shield-check-line text-success fs-3" />
                  </div>
                </div>

                <Button size="sm" color="link" className="mt-3 p-0">
                  View details →
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardEcommerce;

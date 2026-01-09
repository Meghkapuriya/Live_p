import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardImg,
  Button,
  Spinner,
  Badge,
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

interface EventType {
  id: number;
  title: string;
  description?: string;
  end_date: string;
  link: string;
  status: "upcoming" | "recent" | "past";
  photo_url?: string | null;
}

const ViewEvent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/events/${id}`)
      .then((res: any) => {
        setEvent(res?.data?.data ?? res?.data ?? null);
      })
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="page-content">
      <Container fluid>
        {/* LOADING */}
        {loading && (
          <div className="d-flex justify-content-center py-5">
            <Spinner color="primary" />
          </div>
        )}

        {/* NOT FOUND */}
        {!loading && !event && (
          <div className="text-center py-5 text-muted">
            <h5>Event not found</h5>
          </div>
        )}

        {/* CONTENT */}
        {!loading && event && (
          <>
            {/* HEADER */}
            <Row className="mb-4 align-items-center">
              <Col>
                <h4 className="mb-1 fw-semibold">Event Details</h4>
                <p className="text-muted mb-0">
                  Complete information about the selected event
                </p>
              </Col>
              <Col className="text-end">
                <Button
                  color="secondary"
                  outline
                  className="me-2"
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
                <Button
                  color="primary"
                  onClick={() => navigate(`/events/edit/${event.id}`)}
                >
                  Edit
                </Button>
              </Col>
            </Row>

            <Row>
              {/* IMAGE */}
              <Col xl={5} lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <div
                    className="d-flex align-items-center justify-content-center bg-light"
                    style={{ height: 380 }}
                  >
                    {event.photo_url ? (
                      <CardImg
                        src={event.photo_url}
                        alt={event.title}
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <span className="text-muted">No image available</span>
                    )}
                  </div>
                </Card>
              </Col>

              {/* DETAILS */}
              <Col xl={7} lg={6}>
                <Card className="border-0 shadow-sm h-100">
                  <CardBody>
                    {/* LINE BY LINE DATA */}
                    <Row className="mb-3">
                      <Col sm={4} className="fw-semibold">
                        Title
                      </Col>
                      <Col sm={8}>{event.title}</Col>
                    </Row>

                    <Row className="mb-3">
                      <Col sm={4} className="fw-semibold">
                        Description
                      </Col>
                      <Col sm={8} className="text-muted">
                        {event.description || "Not provided"}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col sm={4} className="fw-semibold">
                        End Date
                      </Col>
                      <Col sm={8}>
                        {new Date(event.end_date).toLocaleDateString()}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col sm={4} className="fw-semibold">
                        Status
                      </Col>
                      <Col sm={8}>
                        <Badge
                          color={
                            event.status === "upcoming"
                              ? "primary"
                              : event.status === "recent"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {event.status}
                        </Badge>
                      </Col>
                    </Row>

                    <Row>
                      <Col sm={4} className="fw-semibold">
                        Event Link
                      </Col>
                      <Col sm={8}>
                        {event.link ? (
                          <a href={event.link} target="_blank" rel="noreferrer">
                            Open link →
                          </a>
                        ) : (
                          <span className="text-muted">Not available</span>
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default ViewEvent;

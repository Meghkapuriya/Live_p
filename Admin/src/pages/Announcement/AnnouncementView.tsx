import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Spinner,
  Button,
} from "reactstrap";

const api = new APIClient();

/* ================= TYPES ================= */

interface Announcement {
  id: number;
  title: string;
  description?: string | null;
  link?: string | null;
  end_date: string;
  photo_url?: string | null;
}

const ViewAnnouncement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /* ================= LOAD ANNOUNCEMENT ================= */

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/announcements/${id}`)
      .then((res: any) => {
        const data = res?.data?.data ?? res?.data ?? null;

        setAnnouncement(data);
      })
      .catch(() => {
        alert("Failed to load announcement ❌");
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="page-content">
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Spinner />
          <span className="ms-2">Loading announcement...</span>
        </div>
      </div>
    );
  }

  /* ================= NOT FOUND ================= */

  if (!announcement) {
    return (
      <div className="page-content">
        <div className="text-center mt-5">Announcement not found</div>
      </div>
    );
  }

  /* ================= VIEW ================= */

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={10} lg={11}>
            <Card className="shadow-sm">
              <CardBody className="p-4 p-lg-5">
                <Row>
                  {/* ===== IMAGE ===== */}
                  <Col lg={5} className="mb-4 mb-lg-0">
                    {announcement.photo_url ? (
                      <img
                        src={announcement.photo_url}
                        alt={announcement.title}
                        className="img-fluid rounded w-100"
                        style={{
                          maxHeight: 360,
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="border rounded d-flex align-items-center justify-content-center text-muted"
                        style={{ height: 360 }}
                      >
                        No image available
                      </div>
                    )}
                  </Col>

                  {/* ===== DETAILS ===== */}
                  <Col lg={7}>
                    <h2 className="mb-3">{announcement.title}</h2>

                    <p className="text-muted mb-4">
                      {announcement.description || "No description available"}
                    </p>

                    <p className="fw-semibold">
                      Valid Till:{" "}
                      {new Date(announcement.end_date).toLocaleDateString()}
                    </p>

                    {announcement.link && (
                      <a
                        href={announcement.link}
                        target="_blank"
                        rel="noreferrer"
                        className="d-inline-block mt-3 text-primary fw-semibold"
                      >
                        Open Link →
                      </a>
                    )}

                    <div className="mt-4 d-flex gap-2">
                      <Button color="secondary" onClick={() => navigate(-1)}>
                        Back
                      </Button>

                      <Button
                        color="primary"
                        onClick={() =>
                          navigate(`/announcements/edit/${announcement.id}`)
                        }
                      >
                        Edit Announcement
                      </Button>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ViewAnnouncement;
